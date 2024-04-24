import { DocumentData, Query, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, updateDoc, where } from "@firebase/firestore";
import { GroupType } from "../types/GroupTypes";
import { CurrentUserOption } from "../types/Options";
import { db } from "../configs/firebaseConfig";
import { ConvertDateToString } from "../utils/time";
import { Unsubscribe } from "firebase/auth";
import { Dispatch } from "react";
import { GroupAction } from "../constants/group";
import { UserType } from "../types/UserTypes";
import { UserAction } from "../constants/user";


export type DispatchOptions = {
  [key: string]: Dispatch<any>
}

export async function fetchGroups(
  dispatchOptions: DispatchOptions,
  option: CurrentUserOption,

): Promise<Unsubscribe> {
  const { dispatchGroups, dispatchUser } = dispatchOptions
  if (dispatchGroups)
    dispatchGroups({ type: GroupAction.PENDING })

  let groupQuery: Query<DocumentData, DocumentData>
  let userResult: UserType

  if (option && option.userid) {
    groupQuery = query(collection(db, "groups"), where("users", "array-contains", option.userid))
  } else {
    groupQuery = query(collection(db, "groups"));
  }



  let unsub = onSnapshot(groupQuery, async (groupSnapshot: any) => {
    let groupList: GroupType[] = []
    if (option && option.userid) {
      const userRef = doc(db, "users", option.userid)
      const userSnapshot = await getDoc(userRef)
      userResult = userSnapshot.data() as UserType

    }
    if (dispatchUser)
      dispatchUser({ type: UserAction.FETCH, payload: userResult })

    let futureGroup = groupSnapshot.docs.map(async (groupdoc: any) => {
      let groupResult = groupdoc.data()
      const firstGroupMessageRef = query(collection(db, "messages"), where("groupid", "==", groupResult.id), orderBy("createdAt", "desc"), limit(1))
      let messageResult;
      try {
        const res = (await getDocs(firstGroupMessageRef)).docs[0].data()
        messageResult = res

      } catch (err) {
        console.error(err)
      }
      let messageDate = new Date(messageResult?.createdAt.toDate())

      groupResult.latestMessage = messageResult?.content
      groupResult.time = ConvertDateToString(messageDate).slice(0, 5)
      console.log(userResult)
      const unreadGroup = userResult?.unread?.find(u => u.groupid === groupResult.id)
      groupResult.isRead = unreadGroup?.isRead


      return groupResult
    })

    groupList = await Promise.all(futureGroup)
    if (dispatchGroups) {
      dispatchGroups({ type: GroupAction.FETCH, payload: groupList })
    }
  })

  return unsub
}

export async function fetchUnreadGroups(userid: string, dispatchOptions: DispatchOptions): Promise<Unsubscribe> {
  const { dispatchUser, dispatchGroups } = dispatchOptions
  const userRef = doc(db, "users", userid)
  const groupQuery = query(collection(db, "groups"), where("users", "array-contains", userid))
  const userResult = (await getDoc(userRef)).data()

  if (dispatchUser) {
    dispatchUser({ type: UserAction.FETCH, payload: userResult })
  }

  let unsub = onSnapshot(groupQuery, async (groupSnapshot: any) => {
    let groupList: GroupType[] = []

    let futureGroup = groupSnapshot.docs.map(async (groupdoc: any) => {
      let groupResult = groupdoc.data()
      const unreadGroup = userResult?.unread?.find((u: any) => u.groupid === groupResult.id && !u.isRead)
      if (!unreadGroup)
        return null
      const firstGroupMessageRef = query(collection(db, "messages"), where("groupid", "==", groupResult.id), orderBy("createdAt", "desc"), limit(1))
      let messageResult;
      try {
        const res = (await getDocs(firstGroupMessageRef)).docs[0].data()
        messageResult = res

      } catch (err) {
        console.error(err)
      }
      let messageDate = new Date(messageResult?.createdAt.toDate())

      groupResult.latestMessage = messageResult?.content
      groupResult.time = ConvertDateToString(messageDate).slice(0, 5)
      groupResult.isRead = unreadGroup?.isRead


      return groupResult
    })

    groupList = (await Promise.all(futureGroup)).filter(g => g !== null)

    if (dispatchGroups) {
      dispatchGroups({ type: GroupAction.FETCH, payload: groupList })
    }
  })
  console.log("UNSU", unsub)
  return unsub
}

export function createGroup() { }

export async function updateReadGroup(userid: string, groupid: string, dispatchOptions: DispatchOptions) {
  const { dispatchUser, dispatchGroups } = dispatchOptions

  if (dispatchUser) {
    const userRef = doc(db, "users", userid)
    const userResult = (await getDoc(userRef)).data()
    const newUnread = userResult?.unread?.map((u: any) => {
      if (u.groupid == groupid)
        return null
    }).filter((u: any) => u !== null)
    try {
      await updateDoc(userRef, {
        unread: newUnread
      })
    } catch (err) {
      console.error("Error updating userDoc:", err)
    }

    dispatchUser({ type: UserAction.FETCH, payload: { ...userResult, unread: newUnread } })
  }

  if (dispatchGroups) {
    dispatchGroups((prev: GroupType[]) => prev.map(p => {
      if (p.id === groupid)
        p.isRead = true

      return p
    }))
  }

}

export async function getGroupName(currentUserId: string, group: GroupType): Promise<string> {
  if (group?.groupName && group.groupName as string !== "")
    return group.groupName
  let groupName = ""
  console.log("currentuserid: ", currentUserId)

  let usersQuery = query(collection(db, "users"), where("groupids", "array-contains", group?.id))

  try {
    const usersSnapshot = await getDocs(usersQuery)

    usersSnapshot.docs.map((userdoc, i) => {
      const userResult = userdoc.data()
      if (group.quantity == 2) {
        if (currentUserId === userResult?.id)
          return
      }


      groupName += userResult?.displayName
      groupName += ", "
      console.log("groupName inside userSnapshot", groupName)
    })
  } catch (err) {
    console.error(err)
  }
  groupName = groupName.substring(0, groupName.length - 2)
  return groupName
}

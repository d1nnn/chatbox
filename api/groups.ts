import { DocumentData, Query, Timestamp, addDoc, arrayUnion, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, setDoc, updateDoc, where } from "@firebase/firestore";
import { GroupType } from "../types/GroupTypes";
import { CurrentUserOption } from "../types/Options";
import { db } from "../configs/firebaseConfig";
import { ConvertDateToString } from "../utils/time";
import { Unsubscribe } from "firebase/auth";
import { Dispatch } from "react";
import { GroupAction } from "../constants/group";
import { UserType } from "../types/UserTypes";
import { UserAction } from "../constants/user";
import { v4 as uuidv4 } from 'uuid'
import { addMessage } from "./messages";
import "react-native-get-random-values"

export type DispatchOptions = {
  [key: string]: Dispatch<any>
}

export async function fetchGroup(groupid: string): Promise<GroupType> {
  const groupQuery = doc(db, "groups", groupid)
  var groupResult = (await getDoc(groupQuery)).data() as GroupType
  return groupResult
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
      const unreadGroup = userResult?.unread?.find(u => u.groupid === groupResult.id)
      groupResult.isRead = unreadGroup?.isRead
      groupResult.groupName = await getGroupName(option.userid as string, groupResult)


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
  return unsub
}

type CreateGroupType = {
  currentUserid: string
  groupName: string,
  message: string,
  quantity: number,
  otherUsers: string[]
}

const groupPhotoUrl = "https://res.cloudinary.com/dhzsuo26a/image/upload/v1713499740/group-2517429_1280_gnbi1y.png"

export async function createGroup(
  {
    currentUserid,
    groupName,
    message,
    quantity,
    otherUsers
  }: CreateGroupType): Promise<GroupType> {
  let uid = uuidv4()
  let groupRef = doc(db, "groups", uid)

  const allUsers = [...otherUsers, currentUserid]


  await setDoc(groupRef, { id: uid, groupName, messages: [], quantity: allUsers.length, users: allUsers, photoUrl: groupPhotoUrl })

  await addMessage({ groupid: uid, userid: currentUserid, isFile: false, content: message, createdAt: Timestamp.now().toDate() })

  allUsers.map(async (u) => {
    const userRef = doc(db, "users", u)
    await updateDoc(userRef, {
      groupids: arrayUnion(uid)
    })
  })



  const groupResult = (await getDoc(doc(db, "groups", uid))).data()

  return groupResult as GroupType
}

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
      if (newUnread)
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
  const groupRef = doc(db, "groups", group.id as string)
  const groupResult = (await getDoc(groupRef)).data() as GroupType
  if (groupResult?.groupName && groupResult.groupName as string !== "") {
    return groupResult.groupName as string
  }


  let groupName = ""

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
    })
  } catch (err) {
    console.error(err)
  }
  groupName = groupName.substring(0, groupName.length - 2)
  return groupName
}

export async function updateGroup(groupid: string, payload: GroupType): Promise<GroupType> {
  const groupRef = doc(db, "groups", groupid)

  try {
    await updateDoc(groupRef, {
      groupName: payload.groupName,
      users: payload.users,
      quantity: payload?.users?.length,
      photoUrl: payload.photoUrl
    })
  } catch (err) {
    console.error(err)
  }
  const group = (await getDoc(groupRef)).data() as GroupType
  return group
}

export async function addGroupToUser(userid: string, groupid: string) {
  const userQuery = doc(db, "users", userid)
  await updateDoc(userQuery, {
    groupids: arrayUnion(groupid)
  })
}

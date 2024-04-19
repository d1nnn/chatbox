import { DocumentData, Query, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, where } from "@firebase/firestore";
import { GroupType } from "../types/GroupTypes";
import { CurrentUserOption } from "../types/Options";
import { db } from "../configs/firebaseConfig";
import { ConvertDateToString } from "../utils/time";
import { Unsubscribe } from "firebase/auth";
import { Dispatch, SetStateAction } from "react";


export function fetchGroups(
  option: CurrentUserOption,
  handleGroups?: Dispatch<SetStateAction<GroupType[]>>,
  readOption?: { isRead: boolean },
): Unsubscribe {

  let groupQuery: Query<DocumentData, DocumentData>

  if (!option.exclude && option.userid) {
    groupQuery = query(collection(db, "groups"), where("users", "array-contains", option.userid))
    if (readOption && !readOption.isRead) {
      groupQuery = query(collection(db, "groups"), where("users", "array-contains", option.userid), limit(6))
    }
  } else {

    groupQuery = query(collection(db, "groups"));
  }



  let unsub = onSnapshot(groupQuery, async (groupSnapshot: any) => {
    let groupList: GroupType[] = []

    let futureGroup = groupSnapshot.docs.map(async (groupdoc: any) => {
      let groupResult = groupdoc.data()
      console.log("GROUPRESULT: ", groupResult)
      const firstGroupMessageRef = query(collection(db, "messages"), where("groupid", "==", groupResult.id), orderBy("createdAt", "desc"), limit(1))
      let messageResult;
      try {
        if (readOption) {
          const res = (await getDocs(firstGroupMessageRef)).docs[0].data()
          if (!readOption.isRead && !res.isRead) {
            messageResult = res

          } else
            return null

        } else {
          const res = (await getDocs(firstGroupMessageRef)).docs[0].data()
          messageResult = res
        }
      } catch (err) {
        console.error(err)
      }
      let messageDate = new Date(messageResult?.createdAt.toDate())

      groupResult.latestMessage = messageResult?.content
      groupResult.time = ConvertDateToString(messageDate).slice(0, 5)

      return groupResult
    })

    groupList = await Promise.all(futureGroup)
    if (handleGroups) {
      handleGroups(groupList)
    }
  })

  return unsub
}

export function createGroup() { }

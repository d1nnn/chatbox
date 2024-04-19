import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, updateDoc, where } from "@firebase/firestore";
import { AddMessageType, MessageType } from "../types/MessageTypes";
import { db } from "../configs/firebaseConfig";
import { Unsubscribe } from "firebase/auth";
import { Dispatch, SetStateAction } from "react";



export function fetchMessages(groupid: string, handleMessages?: Dispatch<SetStateAction<MessageType[]>>): Unsubscribe {
  var currentGroupMessagesQuery = query(collection(db, "messages"), where("groupid", "==", groupid), orderBy("createdAt", "asc"))
  var unsub = onSnapshot(currentGroupMessagesQuery, async messageSnapshot => {

    const futureMessages = messageSnapshot.docs.map(async (messageDoc) => {
      let messageResult: any;
      messageResult = messageDoc.data()
      const userQuery = doc(db, "users", messageResult.userid)
      const userResult = (await getDoc(userQuery)).data()
      messageResult.user = userResult


      return messageResult
    })
    const messages: MessageType[] = await Promise.all(futureMessages)
    if (handleMessages) {
      handleMessages(messages)
    }
  })
  return unsub
}

export async function addMessage(payload: AddMessageType): Promise<string> {
  const messagesRef = collection(db, "messages")
  const updateGroupMessageRef = doc(db, "groups", payload.groupid)


  const result = await addDoc(messagesRef, payload)
  const updateMessageRef = doc(db, "messages", result.id)
  await updateDoc(updateMessageRef, {
    id: result.id
  })
  await updateDoc(updateGroupMessageRef, {
    messages: arrayUnion(result.id)
  })

  return result.id
}

export function fetchMessage(messageId: string, handleMessages?: Dispatch<SetStateAction<MessageType[]>>): Unsubscribe {
  let messageQuery = doc(db, "messages", messageId)
  let unsub = onSnapshot(messageQuery, async messageSnapshot => {
    let data = messageSnapshot.data()
    let messageResult: MessageType = {
      id: data?.id,
      groupId: data?.groupid,
      userid: data?.userid,
      content: data?.content,
      createdAt: data?.createdAt
    }
    let userQuery = doc(db, "users", data?.userid)

    onSnapshot(userQuery, userSnapshot => {
      let userResult = userSnapshot.data()
      if (messageResult)
        messageResult.user = userResult

      if (handleMessages) {
        handleMessages(prev => ([...prev, messageResult]))
        console.log("Message handled in fetchMessage")
      }

    })
  })

  return unsub
}

export function fetchUnreadMessages(handleMessages?: Dispatch<SetStateAction<MessageType[]>>): Unsubscribe {
  var messagesQuery = query(collection(db, "messages"), where("isRead", "==", false), orderBy("createdAt", "desc"), limit(5))
  var unsub = onSnapshot(messagesQuery, async messageSnapshot => {
    const futureMessages = messageSnapshot.docs.map(async (messageDoc) => {
      let messageResult: any;
      messageResult = messageDoc.data()
      const userQuery = doc(db, "users", messageResult.userid)
      const userResult = (await getDoc(userQuery)).data()
      messageResult.user = userResult


      return messageResult
    })
    const messages: MessageType[] = await Promise.all(futureMessages)
    if (handleMessages) {
      handleMessages(messages)
    }
  })
  return unsub
}

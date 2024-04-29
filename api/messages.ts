import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, updateDoc, where } from "@firebase/firestore";
import { AddMessageType, MessageType } from "../types/MessageTypes";
import { db } from "../configs/firebaseConfig";
import { Unsubscribe } from "firebase/auth";
import { Dispatch, SetStateAction } from "react";
import { UserType } from "../types/UserTypes";



export async function fetchMessages(groupid: string, lm: number, handleMessages?: Dispatch<SetStateAction<MessageType[]>>): Promise<Unsubscribe> {
  var currentGroupMessagesQuery = query(collection(db, "messages"), where("groupid", "==", groupid), limit(lm), orderBy("createdAt", "desc"))
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
      let newMessages: MessageType[] = []
      for (let m of messages) {
        newMessages.unshift(m)
      }
      handleMessages(newMessages)
    }
  })
  return unsub
}

export async function addMessage(payload: AddMessageType): Promise<string> {
  const messagesRef = collection(db, "messages")
  const updateGroupMessageRef = doc(db, "groups", payload.groupid)

  const usersQuery = query(collection(db, "users"), where("id", "!=", payload.userid), where("groupids", "array-contains", payload.groupid))

  try {
    var usersSnapshot = await getDocs(usersQuery)
    let futureUsers = usersSnapshot.docs.map(async (userdoc) => {
      let userResult = userdoc.data()
      let userRef = doc(db, "users", userResult.id)
      try {
        await updateDoc(userRef, {
          unread: arrayUnion({
            groupid: payload.groupid,
            isRead: false
          })
        })
      } catch (err) {
        console.error(err)
      }
    })
  } catch (err) {
    console.error(err)
  }


  const result = await addDoc(messagesRef, payload)
  await updateDoc(updateGroupMessageRef, {
    messages: arrayUnion(result.id),
    isRead: false
  })

  return result.id
}

export function fetchMessage(messageId: string, handleMessages?: Dispatch<SetStateAction<MessageType[]>>): Unsubscribe {
  console.log("called")
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
        messageResult.user = userResult as UserType

      if (handleMessages) {
        handleMessages(prev => ([...prev, messageResult]))
        console.log("Message handled in fetchMessage")
      }

    })
  })

  return unsub
}

function fetchUnreadMessages(handleMessages?: Dispatch<SetStateAction<MessageType[]>>): Unsubscribe {
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

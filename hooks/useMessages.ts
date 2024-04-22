import { useContext } from "react"
import { MessageContext, MessagesContext } from "../context/MessageContext"
import { GlobalContextType } from "../types/GlobalTypes"
import { MessageType } from "../types/MessageTypes"

export enum MessageCtx {
  MessageType,
  MessagesType
}

export default function useUsers(type: MessageCtx): GlobalContextType<MessageType> | GlobalContextType<MessageType[]> {

  if (type === MessageCtx.MessageType)
    return useContext<GlobalContextType<MessageType>>(MessageContext)
  else
    return useContext<GlobalContextType<MessageType[]>>(MessagesContext)
}

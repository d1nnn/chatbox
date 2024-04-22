import { ReactNode, createContext, useEffect, useReducer } from "react";
import { MessageAction } from "../constants/message";
import { Action, GlobalContextType, State } from "../types/GlobalTypes";
import { MessageType } from "../types/MessageTypes";

const initialMessageState = {
  isLoading: false, isError: false
}
const initialMessagesState = {
  isLoading: false, isError: false
}


export const MessageContext = createContext<GlobalContextType<MessageType>>({
  state: initialMessageState,
  dispatch: () => null
})

export const MessagesContext = createContext<GlobalContextType<MessageType[]>>({ state: initialMessagesState, dispatch: () => null })

type MessageProviderProp = {
  children: ReactNode
}


const messageReducer = (state: State<MessageType>, action: Action<MessageAction, MessageType>): State<MessageType> => {
  switch (action.type) {
    case MessageAction.FETCH:
      return {
        ...state,
        isLoading: false, isError: false, data: {
          groupId: action.payload?.groupId,
          userid: action.payload?.userid,
          content: action.payload?.content,
          createdAt: action.payload?.createdAt,
          id: action.payload?.id,
        }
      }
    case MessageAction.PENDING:
      return {
        ...state,
        isLoading: true, isError: false, data: undefined
      }
    case MessageAction.ERROR:
      return {
        ...state,
        isLoading: false, isError: true, error: "Error fetching messages"
      }
    case MessageAction.DELETE:
      return {
        ...state,
        isLoading: false, isError: false, data: undefined
      }
  }
}

const messagesReducer = (state: State<MessageType[]>, action: Action<MessageAction, MessageType[]>): State<MessageType[]> => {
  switch (action.type) {
    case MessageAction.FETCH:
      return {
        ...state,
        isLoading: false, isError: false, data: action.payload
      }
    case MessageAction.PENDING:
      return {
        ...state,
        isLoading: true, isError: false, data: undefined
      }
    case MessageAction.ERROR:
      return {
        ...state,
        isLoading: false, isError: true, error: "Error fetching messages"
      }
    case MessageAction.DELETE:
      return {
        ...state,
        isLoading: false, isError: false, data: undefined
      }
  }
}

export default function MessageProvider({ children }: MessageProviderProp) {
  const [messageState, dispatchMessage] = useReducer(messageReducer, initialMessageState)
  const [messagesState, dispatchMessages] = useReducer(messagesReducer, initialMessagesState)


  return (
    <MessageContext.Provider value={{ state: messageState, dispatch: dispatchMessage }}>
      <MessagesContext.Provider value={{ state: messagesState, dispatch: dispatchMessages }}>
        {children}
      </MessagesContext.Provider>
    </MessageContext.Provider>
  )
}

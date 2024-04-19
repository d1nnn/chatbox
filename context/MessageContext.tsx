import { ReactNode, createContext, useEffect, useReducer } from "react";
import { MessageAction } from "../constants/message";
import { State } from "../types/LoginTypes";
import { Action, MessageContextType, MessageType } from "../types/MessageTypes";
import useLogin from "../hooks/useLogin";

const initialState = {
  isLoading: false, isError: false
}

const MessageContext = createContext<MessageContextType>({
  state: initialState,
  dispatch: () => null
})

type MessageProviderProp = {
  children: ReactNode
}


const reducer = (state: State<MessageType>, action: Action<MessageType>): State<MessageType> => {
  switch (action.type) {
    case MessageAction.FETCH:
      return {
        ...state,
        isLoading: false, isError: false, data: {
          groupId: action.payload?.groupId,
          users: action.payload?.users,
          message: action.payload?.message,
        }
      }
    case MessageAction.PENDING:
      return {
        ...state,
        isLoading: true, isError: false, data: undefined
      }

    default:
      return {
        isLoading: false, isError: true, data: undefined
      }
  }
}


export default function MessageProvider({ children }: MessageProviderProp) {
  const { state: userState } = useLogin()
  const [messageState, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {

  }, [userState])

  return (
    <MessageContext.Provider value={{ state: messageState, dispatch }}>
      {children}
    </MessageContext.Provider>
  )
}


import { Dispatch } from "react"
import { UserType } from "./LoginTypes"

export type MessageType = {
  groupId?: string,
  message?: string,
  users?: {
    [user: string]: UserType
  }
}

type MessageContextType = {
  state: State<MessageType>
  dispatch: Dispatch<any>
}



type State<T> = {
  data?: T,
  isLoading: boolean,
  isError: boolean,
  error?: string
}

type Action<T> = { type: 'FETCH' | 'PENDING', payload?: T }

export { MessageContextType, State, Action }

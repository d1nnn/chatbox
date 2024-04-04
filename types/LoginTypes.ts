import { Dispatch } from "react"

export type UserType = {
  email?: string | null,
  displayName?: string | null,
  token?: string | null,
}

type LoginContextType = {
  state: State<UserType>
  dispatch: Dispatch<any>
}



type State<T> = {
  data?: T,
  isLoading: boolean,
  isError: boolean,
  error?: string
}

type Action<T> = { type: 'LOGIN' | 'LOGOUT' | 'PENDING' | 'UPDATE', payload?: T }

export { LoginContextType, State, Action }

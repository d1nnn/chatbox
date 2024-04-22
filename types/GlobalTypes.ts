import { Dispatch } from "react"

type GlobalContextType<T> = {
  state: State<T>
  dispatch: Dispatch<any>
}



type State<T> = {
  data?: T,
  isLoading: boolean,
  isError: boolean,
  error?: string
}
type Action<AT, T> = { type: AT, payload?: T }


export { GlobalContextType, State, Action }

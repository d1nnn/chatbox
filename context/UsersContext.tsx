import { ReactNode, createContext, useContext, useReducer } from "react"
import { Action, GlobalContextType, State } from "../types/GlobalTypes"
import { UserAction } from "../constants/user"
import { UserType } from "../types/UserTypes"

type UsersProviderType = {
  children: ReactNode
}

const initialUsersState = {
  isLoading: false,
  isError: false,
}
const initialUserState = {
  isLoading: false,
  isError: false,
}

export const UsersContext = createContext<GlobalContextType<UserType[]>>({ state: initialUsersState, dispatch: () => null })
export const UserContext = createContext<GlobalContextType<UserType>>({ state: initialUserState, dispatch: () => null })

function usersReducer(state: State<UserType[]>, action: Action<UserAction, UserType[]>): State<UserType[]> {
  switch (action.type) {
    case UserAction.FETCH:
      return { ...state, isLoading: false, isError: false, data: action.payload }
    case UserAction.PENDING:
      return { ...state, isLoading: true, isError: false }
    case UserAction.DELETE:
      return { ...state, isLoading: false, isError: false, data: undefined }
    case UserAction.ERROR:
      return { ...state, isLoading: false, isError: true, error: "Error fetching users" }
  }
}

function userReducer(state: State<UserType>, action: Action<UserAction, UserType>): State<UserType> {
  switch (action.type) {
    case UserAction.FETCH:
      return { ...state, isLoading: false, isError: false, data: action.payload }
    case UserAction.PENDING:
      return { ...state, isLoading: true, isError: false }
    case UserAction.DELETE:
      return { ...state, isLoading: false, isError: false, data: undefined }
    case UserAction.ERROR:
      return { ...state, isLoading: false, isError: true, error: "Error fetching user" }
    default:
      return state
  }
}

export default function UsersProvider({ children }: UsersProviderType) {
  const [usersState, dispatchUsers] = useReducer(usersReducer, initialUsersState)
  const [userState, dispatchUser] = useReducer(userReducer, initialUsersState)

  return (
    <UserContext.Provider value={{ state: userState, dispatch: dispatchUser }}>
      <UsersContext.Provider value={{ state: usersState, dispatch: dispatchUsers }}>
        {children}
      </UsersContext.Provider>
    </UserContext.Provider>
  )
}

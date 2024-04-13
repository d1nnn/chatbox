import { ReactNode, createContext, useEffect, useReducer } from "react"
import { LoginContextType, State, Action, UserType } from "../types/LoginTypes"
import { onAuthStateChanged } from "firebase/auth"
import firebaseApi from '../configs/firebaseConfig'
import { UserAction } from "../constants/user"


type AuthProviderProps = {
  children: ReactNode
}

const initialState = {
  isLoading: false, isError: false
}

export const LoginContext = createContext<LoginContextType>({ state: initialState, dispatch: () => null })

const reducer = (state: State<UserType>, action: Action<UserType>): State<UserType> => {
  switch (action.type) {
    case UserAction.PENDING:
      return {
        ...state, isLoading: true, isError: false,
      }
    case UserAction.LOGIN:
    case UserAction.UPDATE:
      return {
        ...state, isLoading: false, isError: false, data: { displayName: action.payload?.displayName, email: action.payload?.email, token: action.payload?.token }
      }
    case UserAction.LOGOUT:
      return {
        ...state, isLoading: false, isError: false, data: undefined
      }
    default:
      return {
        ...state, isLoading: false, isError: true, error: "Error providing auth"
      }
  }
}

export default ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(reducer, { isLoading: false, isError: false })

  useEffect(() => {
    dispatch({ type: UserAction.PENDING })
    onAuthStateChanged(firebaseApi.auth, user => {
      if (user) {
        user.getIdToken().then(t => {
          dispatch({ type: UserAction.LOGIN, payload: { email: user.email, displayName: user.displayName, token: t } })
        })
      } else {
        console.log("user logged out")
        dispatch({ type: UserAction.LOGOUT })
      }
    })
  }, [])

  return (
    <LoginContext.Provider value={{ state, dispatch }}>
      {children}
    </LoginContext.Provider >
  )
}

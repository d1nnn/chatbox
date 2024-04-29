import { ReactNode, createContext, useEffect, useReducer } from "react"
import { onAuthStateChanged } from "firebase/auth"
import firebaseApi from '../configs/firebaseConfig'
import { AuthAction } from "../constants/user"
import { Action, GlobalContextType, State } from "../types/GlobalTypes"
import { AuthType } from "../types/UserTypes"


type AuthProviderProps = {
  children: ReactNode
}

const initialState = {
  isLoading: false, isError: false
}

export const LoginContext = createContext<GlobalContextType<AuthType>>({ state: initialState, dispatch: () => null })


const loginReducer = (state: State<AuthType>, action: Action<AuthAction, AuthType>): State<AuthType> => {
  switch (action.type) {
    case AuthAction.PENDING:
      return {
        ...state, isLoading: true, isError: false,
      }
    case AuthAction.LOGIN:
    case AuthAction.UPDATE:
      return {
        ...state, isLoading: false, isError: false, data: { id: action.payload?.id, displayName: action.payload?.displayName, email: action.payload?.email, token: action.payload?.token, photoUrl: action.payload?.photoUrl }
      }
    case AuthAction.LOGOUT:
      return {
        ...state, isLoading: false, isError: false, data: undefined
      }
    case AuthAction.ERROR:
      return {
        ...state, isLoading: false, isError: true, error: "Error providing auth"
      }
  }
}



export default ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(loginReducer, { isLoading: false, isError: false })

  useEffect(() => {
    dispatch({ type: AuthAction.PENDING })
    onAuthStateChanged(firebaseApi.auth, user => {
      if (user) {

        user.getIdToken().then(t => {
          dispatch({ type: AuthAction.LOGIN, payload: { id: user.uid, email: user.email, displayName: user.displayName, token: t, photoUrl: user.photoURL } })
        })
      } else {
        console.log("user logged out")
        dispatch({ type: AuthAction.LOGOUT })
      }
    })
  }, [])

  return (
    <LoginContext.Provider value={{ state, dispatch }}>
      {children}
    </LoginContext.Provider >
  )
}

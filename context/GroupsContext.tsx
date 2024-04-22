import { ReactNode, createContext, useReducer } from "react";
import { Action, GlobalContextType, State } from "../types/GlobalTypes";
import { GroupType } from "../types/GroupTypes";
import { GroupAction } from "../constants/group"


type GroupProviderType = {
  children: ReactNode
}

const initialState = {
  isLoading: true,
  isError: false,
}

function reducer(state: State<GroupType[]>, action: Action<GroupAction, GroupType[]>): State<GroupType[]> {
  switch (action.type) {
    case GroupAction.FETCH:
      return {
        // ...state, isLoading: false, isError: false, data: {
        //   id: action.payload?.id,
        //   groupName: action.payload?.groupName,
        //   photoUrl: action.payload?.photoUrl,
        //   quantity: action.payload?.quantity,
        //   isRead: action.payload?.isRead,
        //   users: action.payload?.users,
        //   messages: action.payload?.messages,
        //   latestMessage: action.payload?.latestMessage

        ...state, isLoading: false, isError: false, data: action.payload
      }
    case GroupAction.PENDING:
      return { ...state, isLoading: true, isError: false }
    case GroupAction.DELETE:
      return { ...state, isLoading: true, isError: false, data: undefined }
    case GroupAction.ERROR:
      return {
        ...state, isLoading: false, isError: true, error: "Error fetching Groups"
      }
  }
}

export const GroupsContext = createContext<GlobalContextType<GroupType[]>>({ state: initialState, dispatch: () => null })

export default function GroupsProvider({ children }: GroupProviderType) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <GroupsContext.Provider value={{ state, dispatch }} >
      {children}
    </GroupsContext.Provider>
  )
}

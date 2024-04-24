import { collection, doc, getDocs, onSnapshot, query, where } from "@firebase/firestore";
import { UserType } from "../types/UserTypes";
import { db } from "../configs/firebaseConfig";
import useLogin from "../hooks/useLogin";
import { CurrentUserOption } from "../types/Options";
import { Dispatch } from "react";
import { UserAction } from "../constants/user";
import { Unsubscribe } from "firebase/auth";
import { DispatchOptions } from "./groups";


export function fetchUsersFromGroup(groupid: string, option: CurrentUserOption, dispatch: Dispatch<any>): Unsubscribe {
  let userList: UserType[] = []
  const groupQuery = doc(db, "groups", groupid)

  const unsub = onSnapshot(groupQuery, (groupDoc) => {
    let groupResult = groupDoc.data()
    const userQuery = query(collection(db, "users"), where("groupids", "array-contains", groupResult?.id))
    // const userQuery = query(collection(db, "users"), where("id", "in", ["", ""]))

    onSnapshot(userQuery, userSnapshot => {
      userSnapshot.forEach(doc => {
        let userResult = doc.data()
        if (userResult.id == option.userid)
          return
        userList.push(userResult as UserType)
      })

      if (dispatch)
        dispatch({ type: UserAction.FETCH, payload: userList })
    })
  })

  return unsub
}

export function fetchUsers(
  option: CurrentUserOption,
  handleUsers?: (users: UserType[]) => void): UserType[] {

  let userList: UserType[] = []
  let userQuery;

  if (option.userid !== "" || !option.userid)
    userQuery = query(collection(db, "users"))
  else
    userQuery = query(collection(db, "users"), where("id", "!=", option.userid))

  onSnapshot(userQuery, userSnapshot => {
    userSnapshot.forEach(doc => {
      const userResult = doc.data()
      userList.push(userResult as UserType)
    })

    if (handleUsers) {
      handleUsers(userList)
    }
  })


  return userList
}

export async function searchUsers(displayName: string): Promise<UserType[]> {
  const usersQuery = query(collection(db, "users"), where("displayName", ">=", displayName), where("displayName", "<=", displayName + '\uf8ff'))
  let userList: UserType[] = []
  const usersSnapshot = (await getDocs(usersQuery))

  userList = usersSnapshot.docs.map(userdoc => {
    const userResult = userdoc.data()

    return userResult as UserType
  })
  console.log("userList in users.ts: ", userList)

  return userList
}

import { collection, doc, onSnapshot, query, where } from "@firebase/firestore";
import { UserType } from "../types/UserTypes";
import { db } from "../configs/firebaseConfig";
import useLogin from "../hooks/useLogin";
import { CurrentUserOption } from "../types/Options";


export function fetchUsersFromGroup(groupid: string, option: CurrentUserOption, handleUsers?: (userList: UserType[]) => void): UserType[] {
  let userList: UserType[] = []
  const groupQuery = doc(db, "groups", groupid)

  onSnapshot(groupQuery, (groupDoc) => {
    let groupResult = groupDoc.data()
    const userQuery = query(collection(db, "users"), where("id", "in", groupResult?.users))
    // const userQuery = query(collection(db, "users"), where("id", "in", ["", ""]))

    onSnapshot(userQuery, userSnapshot => {
      userSnapshot.forEach(doc => {
        let userResult = doc.data()
        if (option.exclude && userResult.id == option.userid)
          return
        userList.push(userResult as UserType)
      })

      if (handleUsers)
        handleUsers(userList)
    })
  })

  return userList
}

export function fetchUsers(
  option: CurrentUserOption,
  handleUsers?: (users: UserType[]) => void): UserType[] {

  let userList: UserType[] = []
  let userQuery;

  if (option.exclude)
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


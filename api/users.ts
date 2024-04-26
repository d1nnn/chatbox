import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from "@firebase/firestore";
import { UserType } from "../types/UserTypes";
import { db } from "../configs/firebaseConfig";
import { CurrentUserOption } from "../types/Options";
import { UserAction } from "../constants/user";
import { GroupType } from "../types/GroupTypes";


export async function fetchUsersFromGroup(group: GroupType): Promise<UserType[]> {
  let userList: UserType[] = []
  if (group?.users?.length !== 0) {
    group?.users?.map(async id => {
      const userQuery = doc(db, "users", id)
      const userResult = (await getDoc(userQuery)).data()
      userList.push(userResult as UserType)
    })
  }
  console.log("Users fetched from Groups: ", userList)
  return userList
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

export async function searchUsers(currentUserId: string, displayName: string): Promise<UserType[]> {
  const usersQuery = query(collection(db, "users"), where("displayName", ">=", displayName), where("displayName", "<=", displayName + '\uf8ff'))

  const currentUserQuery = doc(db, "users", currentUserId)

  let userList: UserType[] = []
  const usersSnapshot = (await getDocs(usersQuery))
  const currentUserResult = (await getDoc(currentUserQuery)).data() as UserType

  userList = usersSnapshot.docs.map(userdoc => {
    let counter = 0;
    const userResult = userdoc.data() as UserType
    userResult.friends.map(f => {
      const res = currentUserResult.friends.find(id => id === f)
      if (res)
        counter++

    })
    userResult.mutualCount = counter

    return userResult as UserType
  })

  return userList
}

export async function addUserToGroup(groupid: string, userids: string[]) {
  const groupRef = doc(db, "groups", groupid)


}

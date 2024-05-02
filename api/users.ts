import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "@firebase/firestore";
import { UserType } from "../types/UserTypes";
import { db } from "../configs/firebaseConfig";
import { CurrentUserOption } from "../types/Options";
import { UserAction } from "../constants/user";
import { GroupType } from "../types/GroupTypes";
import { convertUsersObjToArray } from "./groups";
import { Alert } from "react-native";


export async function fetchUsersFromGroup(currentUserid: string, group: GroupType): Promise<UserType[]> {
  let userList: UserType[] = []
  const currentUserQuery = doc(db, "users", currentUserid)
  const currentUserResult = (await getDoc(currentUserQuery)).data() as UserType

  console.log("fetchUsersGroupGroup called: ", group)
  console.log()

  if (group?.users?.length !== 0) {
    var promise: any = group?.users?.map(async id => {
      const userQuery = doc(db, "users", id)
      const userResult = (await getDoc(userQuery)).data() as UserType
      let counter = getMutualCount(userResult, currentUserResult)
      if (userResult) {
        const friend = currentUserResult.friends.find(id => id === userResult.id)
        if (friend)
          userResult.isFriend = true

        userResult.mutualCount = counter
        userList.push(userResult as UserType)
      }
    })
  }
  await Promise.all(promise)
  return userList
}

function getMutualCount(thisUser: UserType, thatUser: UserType): number {
  let counter = 0;
  thisUser?.friends.map(f => {
    const res = thatUser.friends.find(id => id === f)
    if (res)
      counter++

  })
  return counter
}

export async function fetchUsers(
  currentUserId: string,
): Promise<UserType[]> {

  const currentUserQuery = doc(db, "users", currentUserId)
  const currentUserResult = (await getDoc(currentUserQuery)).data() as UserType
  let userList: UserType[] = []
  let usersQuery = query(collection(db, "users"), where("id", "!=", currentUserId))
  let promise = (await getDocs(usersQuery)).docs.map(async u => {
    const userResult = u.data() as UserType
    userResult.mutualCount = getMutualCount(currentUserResult, userResult)
    userResult.isFriend = await getIsFriend(currentUserId, userResult.id as string)

    return userResult
  })
  userList = await Promise.all(promise)

  return userList
}

export async function searchUsers(currentUserId: string, displayName: string): Promise<UserType[]> {
  const usersQuery = query(collection(db, "users"), where("displayName", ">=", displayName), where("displayName", "<=", displayName + '\uf8ff'), where("id", "!=", currentUserId))

  const currentUserQuery = doc(db, "users", currentUserId)

  let userList: UserType[] = []
  try {
    var usersSnapshot = (await getDocs(usersQuery))
    var currentUserResult = (await getDoc(currentUserQuery)).data() as UserType
    let promise = usersSnapshot.docs.map(async userdoc => {
      const userResult = userdoc.data() as UserType
      let counter = getMutualCount(currentUserResult, userResult)
      userResult.mutualCount = counter
      userResult.isFriend = await getIsFriend(currentUserId, userResult.id as string)

      return userResult as UserType
    })
    userList = await Promise.all(promise)
  } catch (err: any) {
    console.error(err)
  }


  return userList
}


export async function fetchUser(userid: string, currentUserId?: string): Promise<UserType> {
  const userQuery = doc(db, "users", userid)
  const userResult = (await getDoc(userQuery)).data() as UserType

  if (currentUserId) {
    try {
      userResult.isFriend = await getIsFriend(currentUserId, userResult.id as string)

    } catch (err) {
      console.error(err)
    }

  }

  return userResult
}

async function getIsFriend(currentUserId: string, otherUserId: string) {
  const currentUserQuery = doc(db, "users", currentUserId)
  const currentUserResult = (await getDoc(currentUserQuery)).data() as UserType

  const friend = currentUserResult.friends.find(id => id === otherUserId)
  if (friend)
    return true

  return false

}

export async function addFriend(currentUserid: string, addId: string): Promise<UserType> {
  const currentUserQuery = doc(db, "users", currentUserid)
  let addUser: UserType;

  try {
    await updateDoc(currentUserQuery, {
      friends: arrayUnion(addId)
    })

  } catch (err) {
    console.error(err)
  }
  addUser = (await getDoc(doc(db, "users", addId))).data() as UserType
  addUser.isFriend = true
  const currentUserResult = (await getDoc(currentUserQuery)).data() as UserType
  const counter = getMutualCount(currentUserResult, addUser)
  addUser.mutualCount = counter

  return addUser
}

export async function fetchFriends(currentUserId: string): Promise<UserType[]> {
  const currentUserQuery = doc(db, "users", currentUserId)
  const currentUserResult = (await getDoc(currentUserQuery)).data() as UserType

  const promise = currentUserResult.friends.map(async id => {
    const userQuery = doc(db, "users", id)
    const userResult = (await getDoc(userQuery)).data() as UserType
    let counter = getMutualCount(userResult, currentUserResult)
    userResult.mutualCount = counter
    userResult.isFriend = true

    return userResult
  })

  const userList = await Promise.all(promise)
  return userList
}

export async function updateProfile(userid: string, payload: UserType): Promise<UserType> {
  const userQuery = doc(db, "users", userid)

  await updateDoc(userQuery, {
    displayName: payload.displayName,
    photoUrl: payload.photoUrl
  })

  const userResult = (await getDoc(userQuery)).data() as UserType
  return userResult
}

export async function leaveGroup(currentUserId: string, groupId: string) {
  const userRef = doc(db, "users", currentUserId)
  const groupRef = doc(db, "groups", groupId)
  try {
    await updateDoc(userRef, {
      groupids: arrayRemove(groupId)
    })
    await updateDoc(groupRef, {
      users: arrayRemove(currentUserId)
    })

    const groupResult = (await getDoc(groupRef)).data()
    const users = convertUsersObjToArray(groupResult?.users)

    if (users.length === 0) {
      await deleteDoc(groupRef)
    }
  } catch (err) {
    console.error(err)
  }
}

export async function unfriend(currentUserId: string, removeId: string) {
  const userRef = doc(db, "users", currentUserId)

  try {
    await updateDoc(userRef, {
      // const [inputIsFocused, setInputIsFocused] = useState<boolean>(inputRef.current?.isFocused() as boolean)
      friends: arrayRemove(removeId)
    })
  } catch (err) {
    console.error(err)
  }
}

import { GroupType } from "./GroupTypes"

export type UserType = {
  id?: string | null,
  displayName?: string | null,
  photoUrl?: string | null,
  groupids: GroupType[],
  friends: string[],
  unread: {
    groupid: string,
    isRead: boolean
  }[],
  mutualCount: number
  isFriend: boolean
}


export type AuthType = {
  id?: string | null,
  email?: string | null,
  displayName?: string | null,
  photoUrl?: string | null,
  token?: string | null,
}


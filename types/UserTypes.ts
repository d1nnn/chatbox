import { GroupType } from "./GroupTypes"

export type UserType = {
  id?: string | null,
  displayName?: string | null,
  photoUrl?: string | null,
  groups: GroupType[],
  friends: UserType[],
  unread: {
    groupid: string,
    isRead: boolean
  }[]
}


export type AuthType = {
  id?: string | null,
  email?: string | null,
  displayName?: string | null,
  photoUrl?: string | null,
  token?: string | null,
}


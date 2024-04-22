import { UserType } from "./UserTypes"

export type MessageType = {
  groupId?: string,
  content?: string,
  user?: UserType,
  userid?: string,
  createdAt?: Date,
  id?: string,
}

export type AddMessageType = {
  content: string,
  groupid: string,
  userid: string,
  isFile: boolean,
  createdAt: Date,
}






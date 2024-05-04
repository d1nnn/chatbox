import { MessageType } from "./MessageTypes"

export type GroupType = {
  id?: string,
  groupName?: string,
  quantity?: number,
  messages?: string[],
  users?: string[],
  photoUrl?: string,
  latestMessage?: MessageType,
  isRead?: boolean
}



export type ChatroomStatus = 'ACTIVE' | 'CLOSE' | 'DELETED'

export interface ChatroomListItem {
  chatroomNo: number
  name: string
  createdByName: string
  status: ChatroomStatus
  createdAt: string
  isJoined: boolean
}

export interface MessageHistoryItem {
  messageNo: number
  userNo: number
  userName: string
  content: string
  createdAt: string
}

export interface LiveChatMessage {
  messageNo: number
  chatroomNo: number
  userNo: number
  userName: string
  content: string
  createdAt: string
}

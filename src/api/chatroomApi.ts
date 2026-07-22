import { client } from './client'
import type { ChatroomListItem } from '@/types/chat'
import type { MessageResponse, PageParams } from '@/types/common'

export const chatroomApi = {
  create: (name: string, inviteeUserNos: number[] = []) =>
    client
      .post<{ chatroomNo: number; name: string; createdByName: string; createdAt: string; message: string }>(
        '/chatroom',
        { name, inviteeUserNos },
      )
      .then((r) => r.data),
  rename: (chatroomNo: number, name: string) =>
    client
      .put<{ chatroomNo: number; name: string; message: string }>(`/chatroom/${chatroomNo}`, { name })
      .then((r) => r.data),
  remove: (chatroomNo: number) =>
    client.delete<MessageResponse>(`/chatroom/${chatroomNo}`).then((r) => r.data),
  join: (chatroomNo: number) =>
    client.post<MessageResponse>(`/chatroom/${chatroomNo}/join`).then((r) => r.data),
  leave: (chatroomNo: number) =>
    client.delete<MessageResponse>(`/chatroom/${chatroomNo}/leave`).then((r) => r.data),
  list: (params: PageParams) => client.get<ChatroomListItem[]>('/chatroom', { params }).then((r) => r.data),
  joined: (params: PageParams) =>
    client.get<ChatroomListItem[]>('/chatroom/joined', { params }).then((r) => r.data),
  created: (params: PageParams) =>
    client.get<ChatroomListItem[]>('/chatroom/created', { params }).then((r) => r.data),
}

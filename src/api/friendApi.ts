import { client } from './client'
import type { MessageResponse, PageParams } from '@/types/common'
import type { FriendDetail, FriendListItem, FriendRequestListItem, UserSearchResult } from '@/types/friend'

export const friendApi = {
  search: (keyword: string, params: PageParams) =>
    client.get<UserSearchResult[]>('/friend/search', { params: { keyword, ...params } }).then((r) => r.data),
  sendRequest: (receiverUserNo: number) =>
    client.post<MessageResponse>('/friend/request', { receiverUserNo }).then((r) => r.data),
  respondToRequest: (requestNo: number, status: 'ACCEPTED' | 'REJECTED') =>
    client.put<MessageResponse>('/friend/response', { requestNo, status }).then((r) => r.data),
  received: (params: PageParams) =>
    client.get<FriendRequestListItem[]>('/friend/request/received', { params }).then((r) => r.data),
  sent: (params: PageParams) =>
    client.get<FriendRequestListItem[]>('/friend/request/sent', { params }).then((r) => r.data),
  cancelRequest: (receiverUserNo: number) =>
    client
      .delete<MessageResponse>('/friend/request', { data: { receiverUserNo } })
      .then((r) => r.data),
  list: (params: PageParams) => client.get<FriendListItem[]>('/friend/list', { params }).then((r) => r.data),
  detail: (userNo: number) =>
    client.get<FriendDetail>('/friend/detail', { params: { userNo } }).then((r) => r.data),
  removeFriend: (friendUserNo: number) =>
    client.delete<MessageResponse>('/friend', { data: { friendUserNo } }).then((r) => r.data),
}

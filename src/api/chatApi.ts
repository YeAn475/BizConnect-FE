import { client } from './client'
import type { PageParams } from '@/types/common'
import type { MessageHistoryItem } from '@/types/chat'

export const chatApi = {
  history: (chatroomNo: number, params: PageParams) =>
    client
      .get<MessageHistoryItem[]>(`/chat/${chatroomNo}/messages`, { params })
      .then((r) => r.data),
}

import { client } from './client'
import type { AlarmListItem } from '@/types/alarm'
import type { MessageResponse, PageParams } from '@/types/common'

export const alarmApi = {
  list: (params: PageParams) => client.get<AlarmListItem[]>('/alarm/list', { params }).then((r) => r.data),
  markRead: (alarmNo: number) =>
    client.patch<AlarmListItem>('/alarm/read', null, { params: { alarmNo } }).then((r) => r.data),
  remove: (alarmNo: number) =>
    client.patch<MessageResponse>('/alarm/delete', null, { params: { alarmNo } }).then((r) => r.data),
}

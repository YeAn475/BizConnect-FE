import { client } from './client'
import type { CompanyAlarmApproveResponse } from '@/types/alarm'

// The {requestId} path segment is ignored by the backend implementation — only the
// `alarmNo` query param is actually used, so we pass the alarm's own alarmNo for both.
export const companyAlarmApi = {
  approve: (alarmNo: number) =>
    client
      .post<CompanyAlarmApproveResponse>(`/companyAlarm/${alarmNo}/approve`, null, { params: { alarmNo } })
      .then((r) => r.data),
  // Backend always returns a null body here (known bug) — callers should treat a
  // non-throwing resolution as success and not rely on the response payload.
  reject: (alarmNo: number, message: string) =>
    client.put(`/companyAlarm/${alarmNo}/reject`, null, { params: { alarmNo, message } }).then(() => undefined),
}

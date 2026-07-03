import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { alarmApi } from '@/api/alarmApi'
import { companyAlarmApi } from '@/api/companyAlarmApi'
import type { AlarmListItem } from '@/types/alarm'
import { usePagination } from '@/hooks/usePagination'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Pagination } from '@/components/common/Pagination'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { getErrorMessage } from '@/lib/errorMessage'

// The alarm list response doesn't include alarmType/referenceNo, so we infer
// "company request" alarms (which are the only ones with an approve/reject action)
// from keywords in the title/content — a best-effort heuristic given the API's limits.
function isCompanyRequestAlarm(alarm: AlarmListItem) {
  const text = `${alarm.title} ${alarm.content}`
  return ['회사', '가입', '등록'].some((keyword) => text.includes(keyword))
}

export function AlarmListPage() {
  const { page, size, hasNext, applyResultLength, nextPage, prevPage } = usePagination(10)
  const [alarms, setAlarms] = useState<AlarmListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [busyAlarmNo, setBusyAlarmNo] = useState<number | null>(null)

  function load() {
    setLoading(true)
    alarmApi
      .list({ page, size })
      .then((data) => {
        setAlarms(data)
        applyResultLength(data.length)
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [page, size, applyResultLength])

  async function handleRead(alarmNo: number) {
    try {
      await alarmApi.markRead(alarmNo)
      load()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  async function handleDelete(alarmNo: number) {
    try {
      await alarmApi.remove(alarmNo)
      toast.success('알림이 삭제되었습니다.')
      load()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  async function handleApprove(alarmNo: number) {
    setBusyAlarmNo(alarmNo)
    try {
      const res = await companyAlarmApi.approve(alarmNo)
      toast.success(res.message || '요청을 승인했습니다.')
      load()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setBusyAlarmNo(null)
    }
  }

  async function handleReject(alarmNo: number) {
    setBusyAlarmNo(alarmNo)
    try {
      // Backend always returns a null body for reject (known bug) — a non-throwing
      // resolution is treated as success.
      await companyAlarmApi.reject(alarmNo, '거절되었습니다.')
      toast.success('요청을 거절했습니다.')
      load()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setBusyAlarmNo(null)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="알림함" description="회사 가입/등록 요청 알림은 이 화면에서 바로 승인·거절할 수 있습니다." />
      {loading ? (
        <Spinner />
      ) : alarms.length === 0 ? (
        <EmptyState title="알림이 없습니다." />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {alarms.map((alarm) => (
              <Card key={alarm.alarmNo} className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">{alarm.title}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-500">{alarm.content}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {isCompanyRequestAlarm(alarm) && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        loading={busyAlarmNo === alarm.alarmNo}
                        onClick={() => handleApprove(alarm.alarmNo)}
                      >
                        승인
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        loading={busyAlarmNo === alarm.alarmNo}
                        onClick={() => handleReject(alarm.alarmNo)}
                      >
                        거절
                      </Button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleRead(alarm.alarmNo)}>
                      읽음
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(alarm.alarmNo)}>
                      삭제
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Pagination page={page} hasNext={hasNext} onPrev={prevPage} onNext={nextPage} />
        </>
      )}
    </div>
  )
}

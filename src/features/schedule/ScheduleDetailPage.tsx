import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useScheduleStore } from '@/stores/useScheduleStore'
import type { Schedule } from '@/types/schedule'
import { PageHeader } from '@/components/common/PageHeader'
import { MockNotice } from '@/components/common/MockNotice'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Spinner } from '@/components/common/Spinner'
import { formatDateTime } from '@/lib/date'

export function ScheduleDetailPage() {
  const { scheduleNo } = useParams<{ scheduleNo: string }>()
  const navigate = useNavigate()
  const get = useScheduleStore((s) => s.get)
  const remove = useScheduleStore((s) => s.remove)
  const [schedule, setSchedule] = useState<Schedule | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (!scheduleNo) return
    get(Number(scheduleNo))
      .then((s) => setSchedule(s ?? null))
      .finally(() => setLoading(false))
  }, [scheduleNo, get])

  async function handleDelete() {
    if (!schedule) return
    await remove(schedule.scheduleNo)
    toast.success('일정이 삭제되었습니다.')
    navigate('/schedules', { replace: true })
  }

  if (loading) return <Spinner />
  if (!schedule) return <p className="text-sm text-slate-400">존재하지 않는 일정입니다.</p>

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title={schedule.title} description={`${schedule.companyName} · ${schedule.author}`} />
      <MockNotice />
      <Card>
        <dl className="mb-4 grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-slate-400">시작</dt>
          <dd className="text-slate-800">{formatDateTime(schedule.startedAt)}</dd>
          <dt className="text-slate-400">종료</dt>
          <dd className="text-slate-800">{formatDateTime(schedule.endedAt)}</dd>
        </dl>
        <p className="whitespace-pre-wrap text-sm text-slate-700">{schedule.content}</p>
        <Button variant="danger" size="sm" className="mt-6" onClick={() => setConfirmOpen(true)}>
          삭제
        </Button>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="일정을 삭제하시겠습니까?"
        confirmLabel="삭제"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}

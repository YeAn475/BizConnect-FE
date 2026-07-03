import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useScheduleStore } from '@/stores/useScheduleStore'
import type { Schedule } from '@/types/schedule'
import { PageHeader } from '@/components/common/PageHeader'
import { MockNotice } from '@/components/common/MockNotice'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/common/EmptyState'
import { formatDateTime } from '@/lib/date'

export function ScheduleListPage() {
  const list = useScheduleStore((s) => s.list)
  const [schedules, setSchedules] = useState<Schedule[]>([])

  useEffect(() => {
    list(0, 50).then(setSchedules)
  }, [list])

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="일정"
        action={
          <Link to="/schedules/new">
            <Button size="sm">일정 등록</Button>
          </Link>
        }
      />
      <MockNotice />
      {schedules.length === 0 ? (
        <EmptyState title="등록된 일정이 없습니다." />
      ) : (
        <ul className="flex flex-col gap-2">
          {schedules.map((s) => (
            <li key={s.scheduleNo}>
              <Link
                to={`/schedules/${s.scheduleNo}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 hover:shadow-sm"
              >
                <div className="text-sm">
                  <p className="font-medium text-slate-800">{s.title}</p>
                  <p className="text-slate-400">{s.author}</p>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <p>{formatDateTime(s.startedAt)}</p>
                  <p>~ {formatDateTime(s.endedAt)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

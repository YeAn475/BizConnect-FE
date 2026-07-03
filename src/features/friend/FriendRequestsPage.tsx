import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { friendApi } from '@/api/friendApi'
import type { FriendRequestListItem } from '@/types/friend'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/common/Button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { formatDateTime } from '@/lib/date'
import { getErrorMessage } from '@/lib/errorMessage'
import clsx from 'clsx'

type Tab = 'received' | 'sent'

export function FriendRequestsPage() {
  const [tab, setTab] = useState<Tab>('received')
  const [requests, setRequests] = useState<FriendRequestListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [busyNo, setBusyNo] = useState<number | null>(null)

  function load() {
    setLoading(true)
    const fetcher = tab === 'received' ? friendApi.received : friendApi.sent
    fetcher({ page: 0, size: 50 })
      .then(setRequests)
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [tab])

  async function handleRespond(requestNo: number, status: 'ACCEPTED' | 'REJECTED') {
    setBusyNo(requestNo)
    try {
      await friendApi.respondToRequest(requestNo, status)
      toast.success(status === 'ACCEPTED' ? '친구 요청을 수락했습니다.' : '친구 요청을 거절했습니다.')
      load()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setBusyNo(null)
    }
  }

  async function handleCancel(userNo: number, requestNo: number) {
    setBusyNo(requestNo)
    try {
      await friendApi.cancelRequest(userNo)
      toast.success('요청을 취소했습니다.')
      load()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setBusyNo(null)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="친구 요청" />
      <div className="mb-4 flex gap-1 rounded-md border border-slate-200 bg-slate-100 p-0.5 text-sm">
        {(['received', 'sent'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'flex-1 rounded px-3 py-1.5 font-medium transition-colors',
              tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700',
            )}
          >
            {t === 'received' ? '받은 요청' : '보낸 요청'}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : requests.length === 0 ? (
        <EmptyState title="요청이 없습니다." />
      ) : (
        <ul className="flex flex-col gap-2">
          {requests.map((r) => (
            <li key={r.requestNo} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4">
              <div className="text-sm">
                <p className="font-medium text-slate-800">{r.name}</p>
                <p className="text-slate-400">
                  {r.companyName} · {formatDateTime(r.createdAt)}
                </p>
              </div>
              {r.status === 'PENDING' ? (
                tab === 'received' ? (
                  <div className="flex gap-2">
                    <Button size="sm" loading={busyNo === r.requestNo} onClick={() => handleRespond(r.requestNo, 'ACCEPTED')}>
                      수락
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      loading={busyNo === r.requestNo}
                      onClick={() => handleRespond(r.requestNo, 'REJECTED')}
                    >
                      거절
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    loading={busyNo === r.requestNo}
                    onClick={() => handleCancel(r.userNo, r.requestNo)}
                  >
                    요청 취소
                  </Button>
                )
              ) : (
                <StatusBadge status={r.status} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

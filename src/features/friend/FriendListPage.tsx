import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { friendApi } from '@/api/friendApi'
import type { FriendListItem } from '@/types/friend'
import { usePagination } from '@/hooks/usePagination'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/common/Button'
import { Pagination } from '@/components/common/Pagination'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { formatDate } from '@/lib/date'
import { getErrorMessage } from '@/lib/errorMessage'

export function FriendListPage() {
  const { page, size, hasNext, applyResultLength, nextPage, prevPage } = usePagination(12)
  const [friends, setFriends] = useState<FriendListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    function load() {
      setLoading(true)
      friendApi
        .list({ page, size })
        .then((data) => {
          setFriends(data)
          applyResultLength(data.length)
        })
        .catch((error) => toast.error(getErrorMessage(error)))
        .finally(() => setLoading(false))
    }
    load()
  }, [page, size, applyResultLength])

  return (
    <div>
      <PageHeader
        title="친구"
        description="다른 회사 담당자와의 친구 관계를 관리합니다."
        action={
          <div className="flex gap-2">
            <Link to="/friends/requests">
              <Button variant="secondary" size="sm">
                요청함
              </Button>
            </Link>
            <Link to="/friends/search">
              <Button size="sm">친구 찾기</Button>
            </Link>
          </div>
        }
      />
      {loading ? (
        <Spinner />
      ) : friends.length === 0 ? (
        <EmptyState title="아직 친구가 없습니다." description="친구 찾기에서 담당자를 검색해보세요." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {friends.map((f) => (
              <Link
                key={f.userNo}
                to={`/friends/${f.userNo}`}
                className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-4 text-center transition-shadow hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-lg font-semibold text-white">
                  {f.imageUrl ? <img src={f.imageUrl} alt="" className="h-full w-full object-cover" /> : f.name.slice(0, 1)}
                </div>
                <p className="text-sm font-medium text-slate-800">{f.name}</p>
                <p className="text-xs text-slate-400">{f.companyName}</p>
                <p className="text-xs text-slate-300">{formatDate(f.friendSince)}부터</p>
              </Link>
            ))}
          </div>
          <Pagination page={page} hasNext={hasNext} onPrev={prevPage} onNext={nextPage} />
        </>
      )}
    </div>
  )
}

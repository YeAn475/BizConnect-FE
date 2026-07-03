import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { friendApi } from '@/api/friendApi'
import type { FriendDetail } from '@/types/friend'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Spinner } from '@/components/common/Spinner'
import { formatDate } from '@/lib/date'
import { getErrorMessage } from '@/lib/errorMessage'

export function FriendDetailPage() {
  const { userNo } = useParams<{ userNo: string }>()
  const navigate = useNavigate()
  const [friend, setFriend] = useState<FriendDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [removing, setRemoving] = useState(false)

  useEffect(() => {
    if (!userNo) return
    function load() {
      setLoading(true)
      friendApi
        .detail(Number(userNo))
        .then(setFriend)
        .catch((error) => toast.error(getErrorMessage(error)))
        .finally(() => setLoading(false))
    }
    load()
  }, [userNo])

  async function handleRemove() {
    if (!friend) return
    setRemoving(true)
    try {
      await friendApi.removeFriend(friend.userNo)
      toast.success('친구를 삭제했습니다.')
      navigate('/friends', { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error))
      setRemoving(false)
    }
  }

  if (loading) return <Spinner />
  if (!friend) return null

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title={friend.name} />
      <Card>
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-xl font-semibold text-white">
            {friend.imageUrl ? (
              <img src={friend.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              friend.name.slice(0, 1)
            )}
          </div>
          <div className="text-sm">
            <p className="font-semibold text-slate-900">{friend.name}</p>
            <p className="text-slate-400">{friend.companyName}</p>
          </div>
        </div>
        {friend.message ? (
          <p className="mb-4 text-sm text-slate-400">{friend.message}</p>
        ) : (
          <dl className="mb-4 grid grid-cols-2 gap-y-2 text-sm">
            <dt className="text-slate-400">이메일</dt>
            <dd className="text-slate-800">{friend.email}</dd>
            <dt className="text-slate-400">전화번호</dt>
            <dd className="text-slate-800">{friend.phoneNumber}</dd>
            <dt className="text-slate-400">친구 등록일</dt>
            <dd className="text-slate-800">{formatDate(friend.friendSince)}</dd>
          </dl>
        )}
        <Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
          친구 삭제
        </Button>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="친구를 삭제하시겠습니까?"
        confirmLabel="삭제"
        danger
        loading={removing}
        onConfirm={handleRemove}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}

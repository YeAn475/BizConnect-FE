import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import clsx from 'clsx'
import { chatroomApi } from '@/api/chatroomApi'
import type { ChatroomListItem } from '@/types/chat'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/common/Button'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatDateTime } from '@/lib/date'
import { getErrorMessage } from '@/lib/errorMessage'

type Tab = 'all' | 'joined' | 'created'

const FETCHERS: Record<Tab, typeof chatroomApi.list> = {
  all: chatroomApi.list,
  joined: chatroomApi.joined,
  created: chatroomApi.created,
}

export function ChatroomListPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('all')
  const [rooms, setRooms] = useState<ChatroomListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [joiningNo, setJoiningNo] = useState<number | null>(null)

  function load() {
    setLoading(true)
    FETCHERS[tab]({ page: 0, size: 50 })
      .then(setRooms)
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [tab])

  async function handleCreate() {
    if (!newName.trim()) return
    setCreating(true)
    try {
      const res = await chatroomApi.create(newName)
      toast.success(res.message || '채팅방이 생성되었습니다.')
      setCreateOpen(false)
      setNewName('')
      navigate(`/chat/${res.chatroomNo}`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setCreating(false)
    }
  }

  async function handleEnter(room: ChatroomListItem) {
    if (room.isJoined) {
      navigate(`/chat/${room.chatroomNo}`)
      return
    }
    setJoiningNo(room.chatroomNo)
    try {
      await chatroomApi.join(room.chatroomNo)
      navigate(`/chat/${room.chatroomNo}`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setJoiningNo(null)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title="채팅"
        action={
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            채팅방 만들기
          </Button>
        }
      />
      <div className="mb-4 flex gap-1 rounded-md border border-slate-200 bg-slate-100 p-0.5 text-sm">
        {(['all', 'joined', 'created'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              'flex-1 rounded px-3 py-1.5 font-medium transition-colors',
              tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700',
            )}
          >
            {t === 'all' ? '전체' : t === 'joined' ? '참여중' : '내가 만든'}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : rooms.length === 0 ? (
        <EmptyState title="채팅방이 없습니다." />
      ) : (
        <ul className="flex flex-col gap-2">
          {rooms.map((room) => (
            <li
              key={room.chatroomNo}
              onClick={() => handleEnter(room)}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 hover:shadow-sm"
            >
              <div className="text-sm">
                <p className="font-medium text-slate-800">{room.name}</p>
                <p className="text-slate-400">
                  개설자 {room.createdByName} · {formatDateTime(room.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {room.isJoined && <span className="text-xs text-emerald-600">참여중</span>}
                <StatusBadge status={room.status} />
                {joiningNo === room.chatroomNo && <span className="text-xs text-slate-400">입장중...</span>}
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={createOpen}
        title="채팅방 만들기"
        onClose={() => setCreateOpen(false)}
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setCreateOpen(false)}>
              취소
            </Button>
            <Button size="sm" loading={creating} onClick={handleCreate}>
              생성
            </Button>
          </>
        }
      >
        <Input label="채팅방 이름" value={newName} onChange={(e) => setNewName(e.target.value)} />
      </Modal>
    </div>
  )
}

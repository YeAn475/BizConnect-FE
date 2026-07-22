import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { chatroomApi } from '@/api/chatroomApi'
import type { FriendListItem } from '@/types/friend'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { EmptyState } from '@/components/common/EmptyState'
import { getErrorMessage } from '@/lib/errorMessage'

interface GroupChatModalProps {
  open: boolean
  friends: FriendListItem[]
  onClose: () => void
  onCreated: (chatroomNo: number) => void
}

export function GroupChatModal({ open, friends, onClose, onCreated }: GroupChatModalProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (open) {
      setSelected(new Set())
      setName('')
    }
  }, [open])

  function toggle(userNo: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(userNo)) next.delete(userNo)
      else next.add(userNo)
      return next
    })
  }

  const selectedNames = friends.filter((f) => selected.has(f.userNo)).map((f) => f.name)
  const autoName = selectedNames.join(', ')

  async function handleCreate() {
    if (selected.size === 0) {
      toast.error('초대할 친구를 1명 이상 선택해주세요.')
      return
    }
    setCreating(true)
    try {
      const res = await chatroomApi.create(name.trim() || autoName, Array.from(selected))
      toast.success(res.message || '채팅방이 생성되었습니다.')
      onCreated(res.chatroomNo)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setCreating(false)
    }
  }

  return (
    <Modal
      open={open}
      title="단체 채팅 만들기"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>
            취소
          </Button>
          <Button size="sm" loading={creating} onClick={handleCreate}>
            {selected.size > 0 ? `${selected.size}명과 채팅 시작` : '채팅 시작'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          label="채팅방 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={autoName || '초대할 친구를 선택하면 자동으로 채워집니다'}
        />

        {friends.length === 0 ? (
          <EmptyState title="초대할 친구가 없습니다." />
        ) : (
          <ul className="flex max-h-64 flex-col gap-1 overflow-y-auto">
            {friends.map((friend) => (
              <li key={friend.userNo}>
                <label className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={selected.has(friend.userNo)}
                    onChange={() => toggle(friend.userNo)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-600 text-xs font-semibold text-white">
                    {friend.imageUrl ? (
                      <img src={friend.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      friend.name.slice(0, 1)
                    )}
                  </span>
                  <span className="text-sm text-slate-800">{friend.name}</span>
                  <span className="text-xs text-slate-400">{friend.companyName}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  )
}

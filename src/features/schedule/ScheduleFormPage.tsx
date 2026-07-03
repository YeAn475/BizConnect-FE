import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useScheduleStore } from '@/stores/useScheduleStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { PageHeader } from '@/components/common/PageHeader'
import { MockNotice } from '@/components/common/MockNotice'
import { Card } from '@/components/common/Card'
import { Input, Textarea } from '@/components/common/Input'
import { Button } from '@/components/common/Button'

export function ScheduleFormPage() {
  const navigate = useNavigate()
  const create = useScheduleStore((s) => s.create)
  const user = useAuthStore((s) => s.user)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [startedAt, setStartedAt] = useState('')
  const [endedAt, setEndedAt] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (endedAt < startedAt) {
      toast.error('종료 시간은 시작 시간 이후여야 합니다.')
      return
    }
    setSaving(true)
    try {
      const schedule = await create(
        { title, content, startedAt, endedAt },
        user?.companyName ?? '우리 회사',
        user?.name ?? '나',
      )
      toast.success('일정이 등록되었습니다.')
      navigate(`/schedules/${schedule.scheduleNo}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="일정 등록" />
      <MockNotice />
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="제목" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="datetime-local"
              label="시작"
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
              required
            />
            <Input type="datetime-local" label="종료" value={endedAt} onChange={(e) => setEndedAt(e.target.value)} required />
          </div>
          <Textarea label="내용" value={content} onChange={(e) => setContent(e.target.value)} required />
          <Button type="submit" loading={saving} className="self-start">
            등록
          </Button>
        </form>
      </Card>
    </div>
  )
}

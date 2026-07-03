import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useNoticeStore } from '@/stores/useNoticeStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { PageHeader } from '@/components/common/PageHeader'
import { MockNotice } from '@/components/common/MockNotice'
import { Card } from '@/components/common/Card'
import { Input, Textarea } from '@/components/common/Input'
import { Button } from '@/components/common/Button'

export function NoticeFormPage() {
  const { noticeNo } = useParams<{ noticeNo: string }>()
  const isEdit = Boolean(noticeNo)
  const navigate = useNavigate()
  const get = useNoticeStore((s) => s.get)
  const create = useNoticeStore((s) => s.create)
  const update = useNoticeStore((s) => s.update)
  const authorName = useAuthStore((s) => s.user?.name ?? '나')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!noticeNo) return
    get(Number(noticeNo)).then((n) => {
      if (n) {
        setTitle(n.title)
        setContent(n.content)
      }
    })
  }, [noticeNo, get])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (isEdit) {
        await update(Number(noticeNo), { title, content })
        toast.success('공지사항이 수정되었습니다.')
        navigate(`/notices/${noticeNo}`)
      } else {
        const notice = await create({ title, content }, authorName)
        toast.success('공지사항이 등록되었습니다.')
        navigate(`/notices/${notice.noticeNo}`)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title={isEdit ? '공지사항 수정' : '공지사항 작성'} />
      <MockNotice />
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="제목" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Textarea label="내용" value={content} onChange={(e) => setContent(e.target.value)} rows={8} required />
          <Button type="submit" loading={saving} className="self-start">
            {isEdit ? '수정 완료' : '등록'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

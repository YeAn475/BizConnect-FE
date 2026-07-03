import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useInquiryStore } from '@/stores/useInquiryStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { INQUIRY_CATEGORIES } from '@/types/inquiry'
import { PageHeader } from '@/components/common/PageHeader'
import { MockNotice } from '@/components/common/MockNotice'
import { Card } from '@/components/common/Card'
import { Input, Select, Textarea } from '@/components/common/Input'
import { Button } from '@/components/common/Button'

export function InquiryFormPage() {
  const navigate = useNavigate()
  const create = useInquiryStore((s) => s.create)
  const user = useAuthStore((s) => s.user)
  const [categoryName, setCategoryName] = useState<string>(INQUIRY_CATEGORIES[0])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const inquiry = await create({ categoryName, title, content }, user?.companyName ?? '우리 회사', user?.name ?? '나')
      toast.success('문의가 등록되었습니다.')
      navigate(`/inquiries/${inquiry.inquiryNo}`)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="문의하기" />
      <MockNotice />
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Select
            label="분류"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            options={INQUIRY_CATEGORIES.map((c) => ({ value: c, label: c }))}
          />
          <Input label="제목" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Textarea label="내용" value={content} onChange={(e) => setContent(e.target.value)} rows={8} required />
          <Button type="submit" loading={saving} className="self-start">
            제출
          </Button>
        </form>
      </Card>
    </div>
  )
}

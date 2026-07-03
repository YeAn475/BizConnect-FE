import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useInquiryStore } from '@/stores/useInquiryStore'
import type { Inquiry } from '@/types/inquiry'
import { PageHeader } from '@/components/common/PageHeader'
import { MockNotice } from '@/components/common/MockNotice'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Spinner } from '@/components/common/Spinner'
import { formatDateTime } from '@/lib/date'

export function InquiryDetailPage() {
  const { inquiryNo } = useParams<{ inquiryNo: string }>()
  const navigate = useNavigate()
  const get = useInquiryStore((s) => s.get)
  const remove = useInquiryStore((s) => s.remove)
  const [inquiry, setInquiry] = useState<Inquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (!inquiryNo) return
    get(Number(inquiryNo))
      .then((i) => setInquiry(i ?? null))
      .finally(() => setLoading(false))
  }, [inquiryNo, get])

  async function handleDelete() {
    if (!inquiry) return
    await remove(inquiry.inquiryNo)
    toast.success('문의가 삭제되었습니다.')
    navigate('/inquiries', { replace: true })
  }

  if (loading) return <Spinner />
  if (!inquiry) return <p className="text-sm text-slate-400">존재하지 않는 문의입니다.</p>

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title={inquiry.title}
        description={`${inquiry.categoryName} · ${inquiry.author} · ${formatDateTime(inquiry.createdAt)}`}
        action={<StatusBadge status={inquiry.status} />}
      />
      <MockNotice />
      <Card>
        <p className="whitespace-pre-wrap text-sm text-slate-700">{inquiry.content}</p>
        <Button variant="danger" size="sm" className="mt-6" onClick={() => setConfirmOpen(true)}>
          삭제
        </Button>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="문의를 삭제하시겠습니까?"
        confirmLabel="삭제"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}

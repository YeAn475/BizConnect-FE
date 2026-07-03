import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useNoticeStore } from '@/stores/useNoticeStore'
import type { Notice } from '@/types/notice'
import { PageHeader } from '@/components/common/PageHeader'
import { MockNotice } from '@/components/common/MockNotice'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Spinner } from '@/components/common/Spinner'
import { formatDateTime } from '@/lib/date'

export function NoticeDetailPage() {
  const { noticeNo } = useParams<{ noticeNo: string }>()
  const navigate = useNavigate()
  const get = useNoticeStore((s) => s.get)
  const remove = useNoticeStore((s) => s.remove)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (!noticeNo) return
    get(Number(noticeNo))
      .then((n) => setNotice(n ?? null))
      .finally(() => setLoading(false))
  }, [noticeNo, get])

  async function handleDelete() {
    if (!notice) return
    await remove(notice.noticeNo)
    toast.success('공지사항이 삭제되었습니다.')
    navigate('/notices', { replace: true })
  }

  if (loading) return <Spinner />
  if (!notice) return <p className="text-sm text-slate-400">존재하지 않는 공지사항입니다.</p>

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title={notice.title}
        description={`${notice.author} · ${formatDateTime(notice.createdAt)} · 조회 ${notice.viewCount}`}
      />
      <MockNotice />
      <Card>
        <p className="whitespace-pre-wrap text-sm text-slate-700">{notice.content}</p>
        <div className="mt-6 flex gap-2">
          <Link to={`/notices/${notice.noticeNo}/edit`}>
            <Button variant="secondary" size="sm">
              수정
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
            삭제
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        title="공지사항을 삭제하시겠습니까?"
        confirmLabel="삭제"
        danger
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}

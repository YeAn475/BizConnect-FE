import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNoticeStore } from '@/stores/useNoticeStore'
import type { Notice } from '@/types/notice'
import { PageHeader } from '@/components/common/PageHeader'
import { MockNotice } from '@/components/common/MockNotice'
import { Table, type Column } from '@/components/common/Table'
import { Button } from '@/components/common/Button'
import { formatDate } from '@/lib/date'

const columns: Column<Notice>[] = [
  {
    key: 'title',
    header: '제목',
    render: (n) => (
      <Link to={`/notices/${n.noticeNo}`} className="font-medium text-slate-900 hover:underline">
        {n.title}
      </Link>
    ),
  },
  { key: 'author', header: '작성자', render: (n) => n.author },
  { key: 'viewCount', header: '조회수', render: (n) => n.viewCount },
  { key: 'createdAt', header: '작성일', render: (n) => formatDate(n.createdAt) },
]

export function NoticeListPage() {
  const list = useNoticeStore((s) => s.list)
  const [notices, setNotices] = useState<Notice[]>([])

  useEffect(() => {
    list(0, 50).then(setNotices)
  }, [list])

  return (
    <div>
      <PageHeader
        title="공지사항"
        action={
          <Link to="/notices/new">
            <Button size="sm">공지 작성</Button>
          </Link>
        }
      />
      <MockNotice />
      <Table columns={columns} rows={notices} rowKey={(n) => n.noticeNo} emptyMessage="등록된 공지사항이 없습니다." />
    </div>
  )
}

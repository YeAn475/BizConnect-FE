import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInquiryStore } from '@/stores/useInquiryStore'
import type { Inquiry } from '@/types/inquiry'
import { PageHeader } from '@/components/common/PageHeader'
import { MockNotice } from '@/components/common/MockNotice'
import { Table, type Column } from '@/components/common/Table'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/common/Button'
import { formatDate } from '@/lib/date'

const columns: Column<Inquiry>[] = [
  {
    key: 'title',
    header: '제목',
    render: (i) => (
      <Link to={`/inquiries/${i.inquiryNo}`} className="font-medium text-slate-900 hover:underline">
        {i.title}
      </Link>
    ),
  },
  { key: 'categoryName', header: '분류', render: (i) => i.categoryName },
  { key: 'status', header: '상태', render: (i) => <StatusBadge status={i.status} /> },
  { key: 'createdAt', header: '작성일', render: (i) => formatDate(i.createdAt) },
]

export function InquiryListPage() {
  const list = useInquiryStore((s) => s.list)
  const [inquiries, setInquiries] = useState<Inquiry[]>([])

  useEffect(() => {
    list(0, 50).then(setInquiries)
  }, [list])

  return (
    <div>
      <PageHeader
        title="문의"
        action={
          <Link to="/inquiries/new">
            <Button size="sm">문의하기</Button>
          </Link>
        }
      />
      <MockNotice />
      <Table columns={columns} rows={inquiries} rowKey={(i) => i.inquiryNo} emptyMessage="등록된 문의가 없습니다." />
    </div>
  )
}

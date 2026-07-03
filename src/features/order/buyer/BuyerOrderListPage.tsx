import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { orderBuyerApi } from '@/api/orderBuyerApi'
import type { BuyerOrderListItem } from '@/types/order'
import { usePagination } from '@/hooks/usePagination'
import { PageHeader } from '@/components/common/PageHeader'
import { Table, type Column } from '@/components/common/Table'
import { Pagination } from '@/components/common/Pagination'
import { Spinner } from '@/components/common/Spinner'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/common/Button'
import { formatDateTime } from '@/lib/date'
import { getErrorMessage } from '@/lib/errorMessage'

export function BuyerOrderListPage() {
  const { page, size, hasNext, applyResultLength, nextPage, prevPage } = usePagination(10)
  const [orders, setOrders] = useState<BuyerOrderListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    function load() {
      setLoading(true)
      orderBuyerApi
        .list({ page, size })
        .then((data) => {
          setOrders(data)
          applyResultLength(data.length)
        })
        .catch((error) => toast.error(getErrorMessage(error)))
        .finally(() => setLoading(false))
    }
    load()
  }, [page, size, applyResultLength])

  const columns: Column<BuyerOrderListItem>[] = [
    {
      key: 'orderNo',
      header: '주문번호',
      render: (r) => (
        <Link to={`/buyer/orders/${r.orderNo}`} className="font-medium text-slate-900 hover:underline">
          #{r.orderNo}
        </Link>
      ),
    },
    { key: 'supplierCompanyName', header: '공급사', render: (r) => r.supplierCompanyName },
    { key: 'orderStatus', header: '상태', render: (r) => <StatusBadge status={r.orderStatus} /> },
    { key: 'createdAt', header: '주문일', render: (r) => formatDateTime(r.createdAt) },
  ]

  return (
    <div>
      <PageHeader
        title="주문 내역"
        description="공급사에 발주한 주문 목록입니다."
        action={
          <Link to="/buyer/orders/new">
            <Button size="sm">새 주문</Button>
          </Link>
        }
      />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Table columns={columns} rows={orders} rowKey={(r) => r.orderNo} emptyMessage="주문 내역이 없습니다." />
          <Pagination page={page} hasNext={hasNext} onPrev={prevPage} onNext={nextPage} />
        </>
      )}
    </div>
  )
}

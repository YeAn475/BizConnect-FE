import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { orderSupplierApi } from '@/api/orderSupplierApi'
import type { SupplierOrderListItem } from '@/types/order'
import { usePagination } from '@/hooks/usePagination'
import { PageHeader } from '@/components/common/PageHeader'
import { Table, type Column } from '@/components/common/Table'
import { Pagination } from '@/components/common/Pagination'
import { Spinner } from '@/components/common/Spinner'
import { StatusBadge } from '@/components/common/StatusBadge'
import { formatDateTime } from '@/lib/date'
import { getErrorMessage } from '@/lib/errorMessage'

export function SupplierOrderListPage() {
  const { page, size, hasNext, applyResultLength, nextPage, prevPage } = usePagination(10)
  const [orders, setOrders] = useState<SupplierOrderListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    function load() {
      setLoading(true)
      orderSupplierApi
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

  const columns: Column<SupplierOrderListItem>[] = [
    {
      key: 'orderNo',
      header: '주문번호',
      render: (r) => (
        <Link to={`/supplier/orders/${r.orderNo}`} className="font-medium text-slate-900 hover:underline">
          #{r.orderNo}
        </Link>
      ),
    },
    { key: 'buyerCompanyName', header: '구매처', render: (r) => r.buyerCompanyName },
    { key: 'status', header: '상태', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'createdAt', header: '주문일', render: (r) => formatDateTime(r.createdAt) },
  ]

  return (
    <div>
      <PageHeader title="주문 관리" description="거래처로부터 접수된 주문을 관리합니다." />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Table columns={columns} rows={orders} rowKey={(r) => r.orderNo} emptyMessage="접수된 주문이 없습니다." />
          <Pagination page={page} hasNext={hasNext} onPrev={prevPage} onNext={nextPage} />
        </>
      )}
    </div>
  )
}

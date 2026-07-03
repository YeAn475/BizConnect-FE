import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { orderSupplierApi } from '@/api/orderSupplierApi'
import type { OrderStatus, SupplierOrderDetail } from '@/types/order'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Spinner } from '@/components/common/Spinner'
import { formatDateTime } from '@/lib/date'
import { getErrorMessage } from '@/lib/errorMessage'

const NEXT_ACTIONS: Partial<Record<OrderStatus, { label: string; status: OrderStatus; danger?: boolean }[]>> = {
  PENDING: [
    { label: '승인', status: 'APPROVED' },
    { label: '거절', status: 'REJECTED', danger: true },
  ],
  APPROVED: [{ label: '주문 종료', status: 'CLOSED' }],
}

export function SupplierOrderDetailPage() {
  const { orderNo } = useParams<{ orderNo: string }>()
  const [order, setOrder] = useState<SupplierOrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updatingStatus, setUpdatingStatus] = useState<OrderStatus | null>(null)

  function load() {
    if (!orderNo) return
    setLoading(true)
    orderSupplierApi
      .detail(Number(orderNo))
      .then(setOrder)
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [orderNo])

  async function handleStatusChange(status: OrderStatus) {
    if (!order) return
    setUpdatingStatus(status)
    try {
      const res = await orderSupplierApi.updateStatus(order.orderNo, status)
      toast.success(res.message || '주문 상태가 변경되었습니다.')
      load()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setUpdatingStatus(null)
    }
  }

  if (loading) return <Spinner />
  if (!order) return null

  const actions = NEXT_ACTIONS[order.status] ?? []

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title={`주문 #${order.orderNo}`}
        description={`${order.buyerCompanyName} · ${formatDateTime(order.createdAt)}`}
        action={<StatusBadge status={order.status} />}
      />

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-slate-900">주문 상품</h2>
        <ul className="flex flex-col divide-y divide-slate-100">
          {order.orderItems.map((item) => (
            <li key={item.productNo} className="flex items-center justify-between gap-4 py-3 text-sm">
              <span className="text-slate-800">{item.productName}</span>
              <span className="text-slate-500">{item.quantity}개</span>
            </li>
          ))}
        </ul>

        {actions.length > 0 && (
          <div className="mt-4 flex gap-2">
            {actions.map((action) => (
              <Button
                key={action.status}
                variant={action.danger ? 'danger' : 'primary'}
                loading={updatingStatus === action.status}
                onClick={() => handleStatusChange(action.status)}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

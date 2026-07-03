import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { orderBuyerApi } from '@/api/orderBuyerApi'
import type { BuyerOrderDetail } from '@/types/order'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Spinner } from '@/components/common/Spinner'
import { formatDateTime } from '@/lib/date'
import { getErrorMessage } from '@/lib/errorMessage'

const EDITABLE_STATUSES = new Set(['PENDING'])

export function BuyerOrderDetailPage() {
  const { orderNo } = useParams<{ orderNo: string }>()
  const [order, setOrder] = useState<BuyerOrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [saving, setSaving] = useState(false)
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  function load() {
    if (!orderNo) return
    setLoading(true)
    orderBuyerApi
      .get(Number(orderNo))
      .then((data) => {
        setOrder(data)
        setQuantities(Object.fromEntries(data.orderItems.map((i) => [i.productNo, i.quantity])))
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [orderNo])

  const editable = order ? EDITABLE_STATUSES.has(order.status) : false

  async function handleUpdate() {
    if (!order) return
    setSaving(true)
    try {
      const orderItems = Object.entries(quantities).map(([productNo, quantity]) => ({
        productNo: Number(productNo),
        quantity,
      }))
      await orderBuyerApi.update(order.orderNo, orderItems)
      toast.success('주문이 수정되었습니다.')
      load()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  async function handleCancel() {
    if (!order) return
    setCancelling(true)
    try {
      await orderBuyerApi.cancel(order.orderNo)
      toast.success('주문이 취소되었습니다.')
      setConfirmCancelOpen(false)
      load()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return <Spinner />
  if (!order) return null

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        title={`주문 #${order.orderNo}`}
        description={`${order.supplierCompanyName} · ${formatDateTime(order.createdAt)}`}
        action={<StatusBadge status={order.status} />}
      />

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-slate-900">주문 상품</h2>
        <ul className="flex flex-col divide-y divide-slate-100">
          {order.orderItems.map((item) => (
            <li key={item.productNo} className="flex items-center justify-between gap-4 py-3">
              <span className="text-sm text-slate-800">{item.productName}</span>
              {editable ? (
                <input
                  type="number"
                  min={0}
                  value={quantities[item.productNo] ?? item.quantity}
                  onChange={(e) =>
                    setQuantities((prev) => ({ ...prev, [item.productNo]: Math.max(0, Number(e.target.value)) }))
                  }
                  className="w-24 rounded-md border border-slate-300 px-2 py-1 text-right text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              ) : (
                <span className="text-sm text-slate-500">{item.quantity}개</span>
              )}
            </li>
          ))}
        </ul>

        {editable && (
          <div className="mt-4 flex gap-2">
            <Button loading={saving} onClick={handleUpdate}>
              수량 저장
            </Button>
            <Button variant="danger" onClick={() => setConfirmCancelOpen(true)}>
              주문 취소
            </Button>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={confirmCancelOpen}
        title="주문을 취소하시겠습니까?"
        description="취소된 주문은 되돌릴 수 없습니다."
        confirmLabel="취소"
        danger
        loading={cancelling}
        onConfirm={handleCancel}
        onCancel={() => setConfirmCancelOpen(false)}
      />
    </div>
  )
}

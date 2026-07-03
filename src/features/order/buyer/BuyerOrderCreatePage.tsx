import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { cartBuyerApi } from '@/api/cartBuyerApi'
import { orderBuyerApi } from '@/api/orderBuyerApi'
import type { SupplierListItem } from '@/types/cart'
import type { ProductListItem } from '@/types/product'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/common/Card'
import { Select } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { getErrorMessage } from '@/lib/errorMessage'

export function BuyerOrderCreatePage() {
  const navigate = useNavigate()
  const [suppliers, setSuppliers] = useState<SupplierListItem[]>([])
  const [supplierNo, setSupplierNo] = useState<string>('')
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    cartBuyerApi
      .suppliers({ page: 0, size: 100 })
      .then((data) => {
        setSuppliers(data)
        if (data.length > 0) setSupplierNo(String(data[0].supplierCompanyNo))
      })
      .catch((error) => toast.error(getErrorMessage(error)))
  }, [])

  useEffect(() => {
    if (!supplierNo) return
    setLoadingProducts(true)
    setQuantities({})
    cartBuyerApi
      .products(Number(supplierNo), { page: 0, size: 100 })
      .then(setProducts)
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoadingProducts(false))
  }, [supplierNo])

  function setQuantity(productNo: number, value: number) {
    setQuantities((prev) => ({ ...prev, [productNo]: Math.max(0, value) }))
  }

  async function handleSubmit() {
    const orderItems = Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([productNo, quantity]) => ({ productNo: Number(productNo), quantity }))

    if (orderItems.length === 0) {
      toast.error('주문할 상품의 수량을 입력해주세요.')
      return
    }

    setSubmitting(true)
    try {
      const res = await orderBuyerApi.create(Number(supplierNo), orderItems)
      toast.success(res.message || '주문이 접수되었습니다.')
      navigate(`/buyer/orders/${res.orderNo}`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  if (suppliers.length === 0) {
    return <EmptyState title="주문할 수 있는 공급사가 없습니다." description="공급사 카탈로그에서 거래처를 먼저 확인해주세요." />
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="새 주문" />
      <Card className="mb-6">
        <Select
          label="공급사"
          value={supplierNo}
          onChange={(e) => setSupplierNo(e.target.value)}
          options={suppliers.map((s) => ({ value: String(s.supplierCompanyNo), label: s.supplierCompanyName }))}
        />
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-slate-900">주문 상품</h2>
        {loadingProducts ? (
          <Spinner />
        ) : products.length === 0 ? (
          <EmptyState title="이 공급사에서 배정된 상품이 없습니다." />
        ) : (
          <ul className="flex flex-col divide-y divide-slate-100">
            {products.map((p) => (
              <li key={p.productNo} className="flex items-center justify-between gap-4 py-3">
                <span className="text-sm text-slate-800">{p.name}</span>
                <input
                  type="number"
                  min={0}
                  value={quantities[p.productNo] ?? ''}
                  onChange={(e) => setQuantity(p.productNo, Number(e.target.value))}
                  placeholder="0"
                  className="w-24 rounded-md border border-slate-300 px-2 py-1 text-right text-sm focus:border-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500"
                />
              </li>
            ))}
          </ul>
        )}
        <Button className="mt-4" loading={submitting} onClick={handleSubmit}>
          주문하기
        </Button>
      </Card>
    </div>
  )
}

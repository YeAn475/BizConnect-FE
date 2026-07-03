import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { cartSupplierApi } from '@/api/cartSupplierApi'
import { productApi } from '@/api/productApi'
import type { CompanyProductListItem } from '@/types/cart'
import type { ProductListItem } from '@/types/product'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { getErrorMessage } from '@/lib/errorMessage'

export function SupplierAssignmentDetailPage() {
  const { buyerCompanyNo } = useParams<{ buyerCompanyNo: string }>()
  const buyerNo = Number(buyerCompanyNo)

  const [assigned, setAssigned] = useState<CompanyProductListItem[]>([])
  const [loadingAssigned, setLoadingAssigned] = useState(true)
  const [togglingNo, setTogglingNo] = useState<number | null>(null)

  const [catalog, setCatalog] = useState<ProductListItem[]>([])
  const [loadingCatalog, setLoadingCatalog] = useState(true)
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [assigning, setAssigning] = useState(false)

  function loadAssigned() {
    setLoadingAssigned(true)
    cartSupplierApi
      .buyerCompanyProducts(buyerNo, { page: 0, size: 100 })
      .then(setAssigned)
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoadingAssigned(false))
  }

  useEffect(loadAssigned, [buyerNo])

  useEffect(() => {
    setLoadingCatalog(true)
    productApi
      .list({ page: 0, size: 100 })
      .then(setCatalog)
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoadingCatalog(false))
  }, [])

  async function handleToggleUsage(productNo: number) {
    setTogglingNo(productNo)
    try {
      await cartSupplierApi.updateUsage(buyerNo, [productNo])
      loadAssigned()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setTogglingNo(null)
    }
  }

  function toggleSelected(productNo: number) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(productNo)) next.delete(productNo)
      else next.add(productNo)
      return next
    })
  }

  async function handleAssign() {
    if (selected.size === 0) return
    setAssigning(true)
    try {
      const res = await cartSupplierApi.assign(buyerNo, Array.from(selected))
      toast.success(`${res.productName.join(', ')} 상품을 배정했습니다.`)
      setSelected(new Set())
      loadAssigned()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setAssigning(false)
    }
  }

  const assignedNos = new Set(assigned.map((a) => a.productNo))
  const assignableCatalog = catalog.filter((p) => !assignedNos.has(p.productNo))

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="거래처 상품 배정" description="이 거래처에 배정된 상품과 사용 여부를 관리합니다." />

      <Card className="mb-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">배정된 상품</h2>
        {loadingAssigned ? (
          <Spinner />
        ) : assigned.length === 0 ? (
          <EmptyState title="아직 배정된 상품이 없습니다." />
        ) : (
          <ul className="flex flex-col divide-y divide-slate-100">
            {assigned.map((p) => (
              <li key={p.productNo} className="flex items-center justify-between py-2 text-sm">
                <span className="text-slate-800">{p.name}</span>
                <Button
                  variant={p.isUsed ? 'secondary' : 'primary'}
                  size="sm"
                  loading={togglingNo === p.productNo}
                  onClick={() => handleToggleUsage(p.productNo)}
                >
                  {p.isUsed ? '사용중지' : '사용재개'}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">신규 상품 배정</h2>
          <Button size="sm" loading={assigning} disabled={selected.size === 0} onClick={handleAssign}>
            선택 배정 ({selected.size})
          </Button>
        </div>
        {loadingCatalog ? (
          <Spinner />
        ) : assignableCatalog.length === 0 ? (
          <EmptyState title="추가로 배정할 수 있는 상품이 없습니다." />
        ) : (
          <ul className="flex flex-col divide-y divide-slate-100">
            {assignableCatalog.map((p) => (
              <li key={p.productNo} className="flex items-center gap-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={selected.has(p.productNo)}
                  onChange={() => toggleSelected(p.productNo)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <span className="text-slate-800">{p.name}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}

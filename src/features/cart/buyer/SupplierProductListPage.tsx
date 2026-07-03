import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { cartBuyerApi } from '@/api/cartBuyerApi'
import type { ProductListItem } from '@/types/product'
import { usePagination } from '@/hooks/usePagination'
import { PageHeader } from '@/components/common/PageHeader'
import { Pagination } from '@/components/common/Pagination'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { getErrorMessage } from '@/lib/errorMessage'

export function SupplierProductListPage() {
  const { supplierCompanyNo } = useParams<{ supplierCompanyNo: string }>()
  const { page, size, hasNext, applyResultLength, nextPage, prevPage } = usePagination(12)
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supplierCompanyNo) return
    function load() {
      setLoading(true)
      cartBuyerApi
        .products(Number(supplierCompanyNo), { page, size })
        .then((data) => {
          setProducts(data)
          applyResultLength(data.length)
        })
        .catch((error) => toast.error(getErrorMessage(error)))
        .finally(() => setLoading(false))
    }
    load()
  }, [supplierCompanyNo, page, size, applyResultLength])

  return (
    <div>
      <PageHeader title="공급사 상품 목록" description="주문은 '주문 내역 > 새 주문'에서 진행할 수 있습니다." />
      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <EmptyState title="배정된 상품이 없습니다." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <Link
                key={p.productNo}
                to={`/buyer/suppliers/${supplierCompanyNo}/${p.productNo}`}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md"
              >
                <div className="flex h-32 items-center justify-center bg-slate-100">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-400">이미지 없음</span>
                  )}
                </div>
                <p className="truncate p-3 text-sm font-medium text-slate-800">{p.name}</p>
              </Link>
            ))}
          </div>
          <Pagination page={page} hasNext={hasNext} onPrev={prevPage} onNext={nextPage} />
        </>
      )}
    </div>
  )
}

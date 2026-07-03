import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { productApi } from '@/api/productApi'
import type { ProductListItem } from '@/types/product'
import { usePagination } from '@/hooks/usePagination'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/common/Button'
import { Pagination } from '@/components/common/Pagination'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { getErrorMessage } from '@/lib/errorMessage'

export function ProductListPage() {
  const { page, size, hasNext, applyResultLength, nextPage, prevPage } = usePagination(12)
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    function load() {
      setLoading(true)
      productApi
        .list({ page, size })
        .then((data) => {
          setProducts(data)
          applyResultLength(data.length)
        })
        .catch((error) => toast.error(getErrorMessage(error)))
        .finally(() => setLoading(false))
    }
    load()
  }, [page, size, applyResultLength])

  return (
    <div>
      <PageHeader
        title="상품 관리"
        description="우리 회사가 공급하는 상품 카탈로그입니다."
        action={
          <Link to="/supplier/products/new">
            <Button size="sm">상품 등록</Button>
          </Link>
        }
      />
      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <EmptyState title="등록된 상품이 없습니다." description="새 상품을 등록해보세요." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <Link
                key={p.productNo}
                to={`/supplier/products/${p.productNo}`}
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

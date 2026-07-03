import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { cartBuyerApi } from '@/api/cartBuyerApi'
import type { ProductDetail } from '@/types/product'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/common/Card'
import { Spinner } from '@/components/common/Spinner'
import { formatDateTime } from '@/lib/date'
import { getErrorMessage } from '@/lib/errorMessage'

export function BuyerProductDetailPage() {
  const { supplierCompanyNo, productNo } = useParams<{ supplierCompanyNo: string; productNo: string }>()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supplierCompanyNo || !productNo) return
    function load() {
      setLoading(true)
      cartBuyerApi
        .productDetail(Number(supplierCompanyNo), Number(productNo))
        .then(setProduct)
        .catch((error) => toast.error(getErrorMessage(error)))
        .finally(() => setLoading(false))
    }
    load()
  }, [supplierCompanyNo, productNo])

  if (loading) return <Spinner />
  if (!product) return null

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={product.name} />
      <Card>
        <div className="mb-4 flex h-56 items-center justify-center overflow-hidden rounded-md bg-slate-100">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm text-slate-400">이미지 없음</span>
          )}
        </div>
        <dl className="grid grid-cols-2 gap-y-2 text-sm">
          <dt className="text-slate-400">가격</dt>
          <dd className="text-slate-800">{product.price.toLocaleString()}원</dd>
          <dt className="text-slate-400">단위</dt>
          <dd className="text-slate-800">{product.unitName}</dd>
          <dt className="text-slate-400">카테고리</dt>
          <dd className="text-slate-800">{product.categoryName}</dd>
          <dt className="text-slate-400">제조사</dt>
          <dd className="text-slate-800">{product.manufacturerName}</dd>
          <dt className="text-slate-400">상태</dt>
          <dd className="text-slate-800">{product.productStatusName}</dd>
          <dt className="text-slate-400">등록일</dt>
          <dd className="text-slate-800">{formatDateTime(product.createdAt)}</dd>
        </dl>
        <p className="mt-4 whitespace-pre-wrap text-sm text-slate-600">{product.content}</p>
      </Card>
    </div>
  )
}

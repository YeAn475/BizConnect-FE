import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { cartSupplierApi } from '@/api/cartSupplierApi'
import type { BuyerCompanyListItem } from '@/types/cart'
import { usePagination } from '@/hooks/usePagination'
import { PageHeader } from '@/components/common/PageHeader'
import { Table, type Column } from '@/components/common/Table'
import { Pagination } from '@/components/common/Pagination'
import { Spinner } from '@/components/common/Spinner'
import { getErrorMessage } from '@/lib/errorMessage'

export function SupplierAssignmentsListPage() {
  const { page, size, hasNext, applyResultLength, nextPage, prevPage } = usePagination(10)
  const [companies, setCompanies] = useState<BuyerCompanyListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    function load() {
      setLoading(true)
      cartSupplierApi
        .buyerCompanies({ page, size })
        .then((data) => {
          setCompanies(data)
          applyResultLength(data.length)
        })
        .catch((error) => toast.error(getErrorMessage(error)))
        .finally(() => setLoading(false))
    }
    load()
  }, [page, size, applyResultLength])

  const columns: Column<BuyerCompanyListItem>[] = [
    {
      key: 'name',
      header: '거래처',
      render: (r) => (
        <Link to={`/supplier/assignments/${r.buyerCompanyNo}`} className="font-medium text-slate-900 hover:underline">
          {r.buyerCompanyName}
        </Link>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="거래처 배정" description="구매 거래처별로 공급 상품을 배정하고 사용 여부를 관리합니다." />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Table columns={columns} rows={companies} rowKey={(r) => r.buyerCompanyNo} emptyMessage="연결된 거래처가 없습니다." />
          <Pagination page={page} hasNext={hasNext} onPrev={prevPage} onNext={nextPage} />
        </>
      )}
    </div>
  )
}

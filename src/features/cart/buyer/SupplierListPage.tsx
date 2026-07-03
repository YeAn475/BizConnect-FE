import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { cartBuyerApi } from '@/api/cartBuyerApi'
import type { SupplierListItem } from '@/types/cart'
import { usePagination } from '@/hooks/usePagination'
import { PageHeader } from '@/components/common/PageHeader'
import { Table, type Column } from '@/components/common/Table'
import { Pagination } from '@/components/common/Pagination'
import { Spinner } from '@/components/common/Spinner'
import { getErrorMessage } from '@/lib/errorMessage'

export function SupplierListPage() {
  const { page, size, hasNext, applyResultLength, nextPage, prevPage } = usePagination(10)
  const [suppliers, setSuppliers] = useState<SupplierListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await cartBuyerApi.suppliers({ page, size })
        setSuppliers(data)
        applyResultLength(data.length)
      } catch (error) {
        toast.error(getErrorMessage(error))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, size, applyResultLength])

  const columns: Column<SupplierListItem>[] = [
    {
      key: 'name',
      header: '공급사',
      render: (r) => (
        <Link to={`/buyer/suppliers/${r.supplierCompanyNo}`} className="font-medium text-slate-900 hover:underline">
          {r.supplierCompanyName}
        </Link>
      ),
    },
  ]

  return (
    <div>
      <PageHeader title="공급사 카탈로그" description="우리 회사에 상품을 공급하는 거래처 목록입니다." />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Table
            columns={columns}
            rows={suppliers}
            rowKey={(r) => r.supplierCompanyNo}
            emptyMessage="연결된 공급사가 없습니다."
          />
          <Pagination page={page} hasNext={hasNext} onPrev={prevPage} onNext={nextPage} />
        </>
      )}
    </div>
  )
}

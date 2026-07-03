import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { companyApi } from '@/api/companyApi'
import type { CompanyListItem } from '@/types/company'
import { usePagination } from '@/hooks/usePagination'
import { PageHeader } from '@/components/common/PageHeader'
import { Table, type Column } from '@/components/common/Table'
import { Pagination } from '@/components/common/Pagination'
import { Spinner } from '@/components/common/Spinner'
import { Button } from '@/components/common/Button'
import { getErrorMessage } from '@/lib/errorMessage'

const columns: Column<CompanyListItem>[] = [
  { key: 'companyName', header: '회사명', render: (r) => r.companyName },
  { key: 'affiliationName', header: '소속', render: (r) => r.affiliationName },
  { key: 'branchName', header: '지점', render: (r) => r.branchName },
  { key: 'address', header: '주소', render: (r) => r.address },
  { key: 'phoneNumber', header: '전화번호', render: (r) => r.phoneNumber },
]

export function CompanyDirectoryPage() {
  const { page, size, hasNext, applyResultLength, nextPage, prevPage } = usePagination(10)
  const [companies, setCompanies] = useState<CompanyListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    function load() {
      setLoading(true)
      companyApi
        .list({ page, size })
        .then((data) => {
          setCompanies(data)
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
        title="회사 디렉토리"
        description="플랫폼에 등록된 회사 목록입니다."
        action={
          <Link to="/company/request">
            <Button size="sm">신규 회사 등록 요청</Button>
          </Link>
        }
      />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <Table columns={columns} rows={companies} rowKey={(r) => r.companyNo} emptyMessage="등록된 회사가 없습니다." />
          <Pagination page={page} hasNext={hasNext} onPrev={prevPage} onNext={nextPage} />
        </>
      )}
    </div>
  )
}

import { type FormEvent, useState } from 'react'
import { toast } from 'sonner'
import { friendApi } from '@/api/friendApi'
import type { UserSearchResult } from '@/types/friend'
import { PageHeader } from '@/components/common/PageHeader'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import { EmptyState } from '@/components/common/EmptyState'
import { getErrorMessage } from '@/lib/errorMessage'

export function FriendSearchPage() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<UserSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [requestingNo, setRequestingNo] = useState<number | null>(null)

  async function handleSearch(e: FormEvent) {
    e.preventDefault()
    if (!keyword.trim()) return
    setLoading(true)
    try {
      const data = await friendApi.search(keyword, { page: 0, size: 20 })
      setResults(data)
      setSearched(true)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  async function handleRequest(userNo: number) {
    setRequestingNo(userNo)
    try {
      const res = await friendApi.sendRequest(userNo)
      toast.success(res.message || '친구 요청을 보냈습니다.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setRequestingNo(null)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="친구 찾기" description="이름 또는 이메일로 다른 회사 담당자를 검색할 수 있습니다." />
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <Input
          className="flex-1"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="이름, 이메일 검색"
        />
        <Button type="submit" loading={loading}>
          검색
        </Button>
      </form>

      {loading ? (
        <Spinner />
      ) : searched && results.length === 0 ? (
        <EmptyState title="검색 결과가 없습니다." />
      ) : (
        <ul className="flex flex-col gap-2">
          {results.map((r) => (
            <li
              key={r.userNo}
              className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {r.imageUrl ? <img src={r.imageUrl} alt="" className="h-full w-full object-cover" /> : r.name.slice(0, 1)}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-slate-800">{r.name}</p>
                  <p className="text-slate-400">
                    {r.companyName} · {r.email}
                  </p>
                </div>
              </div>
              <Button size="sm" loading={requestingNo === r.userNo} onClick={() => handleRequest(r.userNo)}>
                친구 요청
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

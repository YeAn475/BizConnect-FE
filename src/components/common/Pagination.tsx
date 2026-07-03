import { Button } from './Button'

interface PaginationProps {
  page: number
  hasNext: boolean
  onPrev: () => void
  onNext: () => void
}

export function Pagination({ page, hasNext, onPrev, onNext }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <Button variant="secondary" size="sm" onClick={onPrev} disabled={page === 0}>
        이전
      </Button>
      <span className="text-sm text-slate-500">{page + 1} 페이지</span>
      <Button variant="secondary" size="sm" onClick={onNext} disabled={!hasNext}>
        다음
      </Button>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { Button } from '@/components/common/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <p className="text-3xl font-bold text-slate-900">404</p>
      <p className="text-sm text-slate-500">요청하신 페이지를 찾을 수 없습니다.</p>
      <Link to="/">
        <Button variant="secondary">홈으로 이동</Button>
      </Link>
    </div>
  )
}

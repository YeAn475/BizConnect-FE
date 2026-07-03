import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom'
import { Button } from '@/components/common/Button'

export function RootErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : '알 수 없는 오류가 발생했습니다.'

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-lg font-semibold text-slate-900">화면을 표시하는 중 문제가 발생했습니다</p>
      <p className="text-sm text-slate-500">{message}</p>
      <Button variant="secondary" onClick={() => navigate('/')}>
        홈으로 이동
      </Button>
    </div>
  )
}

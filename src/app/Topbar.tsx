import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import { useLogout } from '@/hooks/useLogout'
import { Button } from '@/components/common/Button'
import { ModeSwitcher } from './ModeSwitcher'

export function Topbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-3">
      <ModeSwitcher />
      <div className="flex items-center gap-3">
        <Link to="/alarms" className="rounded-md p-2 text-slate-500 hover:bg-slate-100" aria-label="알림함">
          🔔
        </Link>
        <Link to="/profile" className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            {user?.name?.slice(0, 1) ?? '?'}
          </span>
          <span className="text-sm">
            <span className="block font-medium text-slate-800">{user?.name ?? '사용자'}</span>
            <span className="block text-xs text-slate-400">{user?.companyName ?? ''}</span>
          </span>
        </Link>
        <Button variant="ghost" size="sm" onClick={logout}>
          로그아웃
        </Button>
      </div>
    </header>
  )
}

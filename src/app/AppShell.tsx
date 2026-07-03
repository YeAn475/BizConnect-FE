import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { userApi } from '@/api/userApi'
import { useAuthStore } from '@/stores/useAuthStore'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppShell() {
  const setUser = useAuthStore((s) => s.setUser)

  useEffect(() => {
    userApi.getProfile().then(setUser).catch(() => {
      // RequireAuth / the response interceptor already handles redirecting on auth failure.
    })
  }, [setUser])

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

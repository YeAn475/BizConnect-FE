import { Outlet } from 'react-router-dom'
import { Boxes, ClipboardCheck, MessageSquare, Store } from 'lucide-react'

const FEATURES = [
  { icon: Store, text: '거래처별 상품 카탈로그와 배정 관리' },
  { icon: ClipboardCheck, text: '구매/공급 주문 흐름을 한 화면에서' },
  { icon: MessageSquare, text: '담당자 간 실시간 협업 채팅' },
]

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-brand-950 p-12 text-white lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(58,135,229,0.35),transparent_45%)]" />
        <div className="relative flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500">
            <Boxes className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="text-lg font-bold tracking-tight">BizConnect</span>
        </div>
        <div className="relative">
          <h1 className="text-3xl font-bold leading-snug">
            거래처와의 업무를
            <br />
            한 곳에서 연결하세요
          </h1>
          <p className="mt-3 max-w-sm text-sm text-slate-300">
            상품, 주문, 채팅, 승인까지 — B2B 파트너십 운영에 필요한 모든 기능을 하나의 플랫폼에서 관리합니다.
          </p>
          <ul className="mt-8 flex flex-col gap-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-slate-200">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/10">
                  <Icon className="h-4 w-4" strokeWidth={2} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-slate-500">© {new Date().getFullYear()} BizConnect</p>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:hidden">
            <p className="text-2xl font-bold tracking-tight text-slate-900">BizConnect</p>
            <p className="mt-1 text-sm text-slate-500">B2B 파트너 플랫폼</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

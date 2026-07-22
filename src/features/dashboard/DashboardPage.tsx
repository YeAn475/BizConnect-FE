import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, ClipboardList, MessageSquare, Package, Store, UserPlus, Users } from 'lucide-react'
import { alarmApi } from '@/api/alarmApi'
import { friendApi } from '@/api/friendApi'
import { chatroomApi } from '@/api/chatroomApi'
import { orderBuyerApi } from '@/api/orderBuyerApi'
import { orderSupplierApi } from '@/api/orderSupplierApi'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModeStore } from '@/stores/useModeStore'
import { PageHeader } from '@/components/common/PageHeader'
import { StatTile } from '@/components/common/StatTile'
import { Card } from '@/components/common/Card'

interface Stats {
  alarms: number
  pendingFriendRequests: number
  joinedChatrooms: number
  pendingOrders: number
}

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const mode = useModeStore((s) => s.mode)
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    async function load() {
      const [alarms, friendRequests, chatrooms] = await Promise.allSettled([
        alarmApi.list({ page: 0, size: 20 }),
        friendApi.received({ page: 0, size: 50 }),
        chatroomApi.joined({ page: 0, size: 50 }),
      ])

      let pendingOrders = 0
      try {
        if (mode === 'BUYER') {
          const orders = await orderBuyerApi.list({ page: 0, size: 50 })
          pendingOrders = orders.filter((o) => o.orderStatus === 'PENDING').length
        } else {
          const orders = await orderSupplierApi.list({ page: 0, size: 50 })
          pendingOrders = orders.filter((o) => o.status === 'PENDING').length
        }
      } catch {
        // leave pendingOrders at 0
      }

      setStats({
        alarms: alarms.status === 'fulfilled' ? alarms.value.length : 0,
        pendingFriendRequests:
          friendRequests.status === 'fulfilled'
            ? friendRequests.value.filter((r) => r.status === 'PENDING').length
            : 0,
        joinedChatrooms: chatrooms.status === 'fulfilled' ? chatrooms.value.length : 0,
        pendingOrders,
      })
    }
    load()
  }, [mode])

  const loading = stats === null

  return (
    <div>
      <PageHeader
        title={`안녕하세요, ${user?.name ?? ''}님`}
        description={`${user?.companyName ?? ''} · ${mode === 'BUYER' ? '구매자 모드' : '공급자 모드'}로 보고 있습니다.`}
      />

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="새 알림" value={stats?.alarms ?? 0} icon={Bell} loading={loading} />
        <StatTile label="받은 친구 요청" value={stats?.pendingFriendRequests ?? 0} icon={UserPlus} loading={loading} />
        <StatTile label="참여중인 채팅방" value={stats?.joinedChatrooms ?? 0} icon={MessageSquare} loading={loading} />
        <StatTile
          label={mode === 'BUYER' ? '대기중인 주문' : '처리 대기 주문'}
          value={stats?.pendingOrders ?? 0}
          icon={ClipboardList}
          loading={loading}
        />
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-slate-900">빠른 실행</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {mode === 'BUYER' ? (
            <>
              <QuickAction to="/buyer/orders/new" label="새 주문" icon={ClipboardList} />
              <QuickAction to="/buyer/suppliers" label="공급사 카탈로그" icon={Store} />
            </>
          ) : (
            <>
              <QuickAction to="/supplier/products/new" label="상품 등록" icon={Package} />
              <QuickAction to="/supplier/assignments" label="거래처 배정" icon={Store} />
            </>
          )}
          <QuickAction to="/friends/search" label="친구 찾기" icon={Users} />
          <QuickAction to="/chat" label="채팅 시작" icon={MessageSquare} />
        </div>
      </Card>
    </div>
  )
}

function QuickAction({ to, label, icon: Icon }: { to: string; label: string; icon: typeof Bell }) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 p-4 text-center text-sm font-medium text-slate-700 transition-colors hover:border-brand-300 hover:bg-brand-50"
    >
      <Icon className="h-5 w-5 text-brand-600" strokeWidth={2} />
      {label}
    </Link>
  )
}

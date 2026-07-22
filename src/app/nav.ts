import type { LucideIcon } from 'lucide-react'
import {
  Bell,
  Building,
  Building2,
  Calendar,
  ClipboardCheck,
  ClipboardList,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  Megaphone,
  Package,
  Share2,
  Store,
  Users,
} from 'lucide-react'
import type { CompanyMode } from '@/stores/useModeStore'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const homeNavItem: NavItem = { to: '/', label: '대시보드', icon: LayoutDashboard }

export const commonNavGroups: NavGroup[] = [
  {
    title: '업무',
    items: [
      { to: '/alarms', label: '알림함', icon: Bell },
      { to: '/company', label: '회사 정보', icon: Building2 },
      { to: '/company/directory', label: '회사 디렉토리', icon: Building },
      { to: '/friends', label: '친구', icon: Users },
      { to: '/chat', label: '채팅', icon: MessageSquare },
    ],
  },
  {
    title: '게시판',
    items: [
      { to: '/notices', label: '공지사항', icon: Megaphone },
      { to: '/schedules', label: '일정', icon: Calendar },
      { to: '/inquiries', label: '문의', icon: HelpCircle },
    ],
  },
]

export const modeNavGroups: Record<CompanyMode, NavGroup> = {
  BUYER: {
    title: '구매 (Buyer)',
    items: [
      { to: '/buyer/suppliers', label: '공급사 카탈로그', icon: Store },
      { to: '/buyer/orders', label: '주문 내역', icon: ClipboardList },
    ],
  },
  SUPPLIER: {
    title: '공급 (Supplier)',
    items: [
      { to: '/supplier/products', label: '상품 관리', icon: Package },
      { to: '/supplier/assignments', label: '거래처 배정', icon: Share2 },
      { to: '/supplier/orders', label: '주문 관리', icon: ClipboardCheck },
    ],
  },
}

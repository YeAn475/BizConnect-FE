import type { CompanyMode } from '@/stores/useModeStore'

export interface NavItem {
  to: string
  label: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const commonNavGroups: NavGroup[] = [
  {
    title: '업무',
    items: [
      { to: '/alarms', label: '알림함' },
      { to: '/company', label: '회사 정보' },
      { to: '/company/directory', label: '회사 디렉토리' },
      { to: '/friends', label: '친구' },
      { to: '/chat', label: '채팅' },
    ],
  },
  {
    title: '게시판',
    items: [
      { to: '/notices', label: '공지사항' },
      { to: '/schedules', label: '일정' },
      { to: '/inquiries', label: '문의' },
    ],
  },
]

export const modeNavGroups: Record<CompanyMode, NavGroup> = {
  BUYER: {
    title: '구매 (Buyer)',
    items: [
      { to: '/buyer/suppliers', label: '공급사 카탈로그' },
      { to: '/buyer/orders', label: '주문 내역' },
    ],
  },
  SUPPLIER: {
    title: '공급 (Supplier)',
    items: [
      { to: '/supplier/products', label: '상품 관리' },
      { to: '/supplier/assignments', label: '거래처 배정' },
      { to: '/supplier/orders', label: '주문 관리' },
    ],
  },
}

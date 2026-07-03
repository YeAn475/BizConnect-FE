import { create } from 'zustand'
import type { Inquiry, InquiryInput } from '@/types/inquiry'

// Inquiry has no backend controller yet - mock store mirroring the eventual API shape.
const seedInquiries: Inquiry[] = [
  {
    inquiryNo: 1,
    companyName: '우리 회사',
    author: '박담당',
    categoryName: '주문/배송 문의',
    title: '주문 #1023 배송 지연 문의',
    content: '주문한 상품이 예정일보다 늦게 도착하고 있습니다. 확인 부탁드립니다.',
    status: 'ACTIVE',
    createdAt: '2026-06-28T13:20:00',
    updatedAt: '2026-06-28T13:20:00',
  },
]

interface InquiryState {
  inquiries: Inquiry[]
  list: (page: number, size: number) => Promise<Inquiry[]>
  get: (inquiryNo: number) => Promise<Inquiry | undefined>
  create: (input: InquiryInput, companyName: string, author: string) => Promise<Inquiry>
  remove: (inquiryNo: number) => Promise<void>
}

export const useInquiryStore = create<InquiryState>((set, get) => ({
  inquiries: seedInquiries,
  list: async (page, size) => get().inquiries.slice(page * size, page * size + size),
  get: async (inquiryNo) => get().inquiries.find((i) => i.inquiryNo === inquiryNo),
  create: async (input, companyName, author) => {
    const inquiry: Inquiry = {
      inquiryNo: Date.now(),
      companyName,
      author,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...input,
    }
    set((s) => ({ inquiries: [inquiry, ...s.inquiries] }))
    return inquiry
  },
  remove: async (inquiryNo) => {
    set((s) => ({ inquiries: s.inquiries.filter((i) => i.inquiryNo !== inquiryNo) }))
  },
}))

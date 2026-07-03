import { create } from 'zustand'
import type { Notice, NoticeInput } from '@/types/notice'

// Notice has no backend controller yet - this store simulates the API shape
// (async functions, same field names) so the page components can be swapped
// to a real noticeApi.ts later without changes.
const seedNotices: Notice[] = [
  {
    noticeNo: 1,
    author: '운영자',
    title: '시스템 정기 점검 안내',
    content: '매주 일요일 새벽 2시~4시 정기 점검이 진행됩니다. 이용에 참고 부탁드립니다.',
    viewCount: 128,
    createdAt: '2026-06-20T09:00:00',
    updatedAt: '2026-06-20T09:00:00',
  },
  {
    noticeNo: 2,
    author: '운영자',
    title: 'BizConnect 신규 기능 안내',
    content: '거래처 배정 화면이 개선되었습니다. 자세한 내용은 첨부파일을 참고해주세요.',
    viewCount: 54,
    createdAt: '2026-06-25T11:30:00',
    updatedAt: '2026-06-25T11:30:00',
  },
]

interface NoticeState {
  notices: Notice[]
  list: (page: number, size: number) => Promise<Notice[]>
  get: (noticeNo: number) => Promise<Notice | undefined>
  create: (input: NoticeInput, author: string) => Promise<Notice>
  update: (noticeNo: number, input: NoticeInput) => Promise<void>
  remove: (noticeNo: number) => Promise<void>
}

export const useNoticeStore = create<NoticeState>((set, get) => ({
  notices: seedNotices,
  list: async (page, size) => get().notices.slice(page * size, page * size + size),
  get: async (noticeNo) => {
    const notice = get().notices.find((n) => n.noticeNo === noticeNo)
    if (notice) {
      set((s) => ({
        notices: s.notices.map((n) => (n.noticeNo === noticeNo ? { ...n, viewCount: n.viewCount + 1 } : n)),
      }))
    }
    return notice
  },
  create: async (input, author) => {
    const notice: Notice = {
      noticeNo: Date.now(),
      author,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...input,
    }
    set((s) => ({ notices: [notice, ...s.notices] }))
    return notice
  },
  update: async (noticeNo, input) => {
    set((s) => ({
      notices: s.notices.map((n) => (n.noticeNo === noticeNo ? { ...n, ...input, updatedAt: new Date().toISOString() } : n)),
    }))
  },
  remove: async (noticeNo) => {
    set((s) => ({ notices: s.notices.filter((n) => n.noticeNo !== noticeNo) }))
  },
}))

import { create } from 'zustand'
import type { Schedule, ScheduleInput } from '@/types/schedule'

// Schedule has no backend controller yet - mock store mirroring the eventual API shape.
const seedSchedules: Schedule[] = [
  {
    scheduleNo: 1,
    companyName: '우리 회사',
    author: '김담당',
    title: '분기 정산 미팅',
    content: '2분기 매입/매출 정산 관련 미팅입니다.',
    startedAt: '2026-07-10T14:00:00',
    endedAt: '2026-07-10T15:30:00',
    createdAt: '2026-07-01T10:00:00',
    updatedAt: '2026-07-01T10:00:00',
  },
]

interface ScheduleState {
  schedules: Schedule[]
  list: (page: number, size: number) => Promise<Schedule[]>
  get: (scheduleNo: number) => Promise<Schedule | undefined>
  create: (input: ScheduleInput, companyName: string, author: string) => Promise<Schedule>
  update: (scheduleNo: number, input: ScheduleInput) => Promise<void>
  remove: (scheduleNo: number) => Promise<void>
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
  schedules: seedSchedules,
  list: async (page, size) =>
    [...get().schedules].sort((a, b) => a.startedAt.localeCompare(b.startedAt)).slice(page * size, page * size + size),
  get: async (scheduleNo) => get().schedules.find((s) => s.scheduleNo === scheduleNo),
  create: async (input, companyName, author) => {
    const schedule: Schedule = {
      scheduleNo: Date.now(),
      companyName,
      author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...input,
    }
    set((s) => ({ schedules: [schedule, ...s.schedules] }))
    return schedule
  },
  update: async (scheduleNo, input) => {
    set((s) => ({
      schedules: s.schedules.map((sc) => (sc.scheduleNo === scheduleNo ? { ...sc, ...input, updatedAt: new Date().toISOString() } : sc)),
    }))
  },
  remove: async (scheduleNo) => {
    set((s) => ({ schedules: s.schedules.filter((sc) => sc.scheduleNo !== scheduleNo) }))
  },
}))

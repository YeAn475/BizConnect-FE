export interface Schedule {
  scheduleNo: number
  companyName: string
  author: string
  title: string
  content: string
  startedAt: string
  endedAt: string
  createdAt: string
  updatedAt: string
}

export interface ScheduleInput {
  title: string
  content: string
  startedAt: string
  endedAt: string
}

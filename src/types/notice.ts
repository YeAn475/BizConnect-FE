export interface Notice {
  noticeNo: number
  author: string
  title: string
  content: string
  viewCount: number
  createdAt: string
  updatedAt: string
}

export interface NoticeInput {
  title: string
  content: string
}

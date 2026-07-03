export type InquiryStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export interface Inquiry {
  inquiryNo: number
  companyName: string
  author: string
  categoryName: string
  title: string
  content: string
  status: InquiryStatus
  createdAt: string
  updatedAt: string
}

export interface InquiryInput {
  categoryName: string
  title: string
  content: string
}

export const INQUIRY_CATEGORIES = ['상품 문의', '주문/배송 문의', '계약/제휴 문의', '기타'] as const

export type FriendRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export interface UserSearchResult {
  userNo: number
  name: string
  email: string
  companyName: string
  imageUrl: string | null
  isOpen: boolean
}

export interface FriendRequestListItem {
  requestNo: number
  userNo: number
  name: string
  companyName: string
  imageUrl: string | null
  status: FriendRequestStatus
  createdAt: string
}

export interface FriendListItem {
  userNo: number
  name: string
  companyName: string
  imageUrl: string | null
  friendSince: string
}

export interface FriendDetail {
  userNo: number
  name: string
  email: string
  phoneNumber: string
  companyName: string
  imageUrl: string | null
  friendSince: string
  message: string | null
}

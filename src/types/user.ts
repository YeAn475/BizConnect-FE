export interface SignupRequest {
  name: string
  email: string
  password: string
  passwordConfirm: string
  phoneNumber: string
  address: string
}

export interface UserProfile {
  name: string
  roleName: string
  companyName: string
  positionName: string
  userStatus: string
  email: string
  phoneNumber: string
  address: string
  imageUrl: string | null
  createdAt: string
  updatedAt: string
  isOpened: boolean
}

export interface ProfileUpdateRequest {
  phoneNumber: string
  address: string
}

export interface PasswordUpdateRequest {
  password: string
  newPassword: string
  confirmPassword: string
}

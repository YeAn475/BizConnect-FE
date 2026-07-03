export interface CompanyListItem {
  companyNo: number
  companyName: string
  affiliationName: string
  branchName: string
  address: string
  phoneNumber: string
}

export interface CompanyRequestInput {
  companyName: string
  affiliationName: string
  branchName: string
  address: string
  phoneNumber: string
  content: string
}

export interface CompanyUpdateInput {
  companyName: string
  branchName: string
  affiliationName: string
  companyAddress: string
  companyPhone: string
}

export interface CompanyUpdateResponse {
  message: string
  companyName: string
  branchName: string
  affiliationName: string
  address: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
}

export interface AccountRegisterResponse {
  Companyname: string
  number: string
}

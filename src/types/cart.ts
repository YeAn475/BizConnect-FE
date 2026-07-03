export interface SupplierListItem {
  supplierCompanyNo: number
  supplierCompanyName: string
}

export interface BuyerCompanyListItem {
  buyerCompanyNo: number
  buyerCompanyName: string
}

export interface CompanyProductListItem {
  productNo: number
  name: string
  imageUrl: string | null
  isUsed: boolean
}

export interface AssignProductResponse {
  productName: string[]
}

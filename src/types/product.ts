export interface ProductListItem {
  productNo: number
  name: string
  imageUrl: string | null
}

export interface ProductDetail {
  productNo: number
  unitName: string
  categoryName: string
  manufacturerName: string
  productStatusName: string
  name: string
  content: string
  price: number
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface ProductCreateInput {
  name: string
  companyName: string
  unit: string
  category: string
  manufacturer: string
  productStatus: string
  content: string
  price: number
  imageUrl?: string
}

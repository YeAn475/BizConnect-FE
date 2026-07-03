import { client } from './client'
import type { SupplierListItem } from '@/types/cart'
import type { PageParams } from '@/types/common'
import type { ProductDetail, ProductListItem } from '@/types/product'

export const cartBuyerApi = {
  suppliers: (params: PageParams) =>
    client.get<SupplierListItem[]>('/cart/suppliers', { params }).then((r) => r.data),
  products: (supplierCompanyNo: number, params: PageParams) =>
    client
      .get<ProductListItem[]>(`/cart/suppliers/${supplierCompanyNo}/products`, { params })
      .then((r) => r.data),
  productDetail: (supplierCompanyNo: number, productNo: number) =>
    client
      .get<ProductDetail>(`/cart/suppliers/${supplierCompanyNo}/products/${productNo}`)
      .then((r) => r.data),
}

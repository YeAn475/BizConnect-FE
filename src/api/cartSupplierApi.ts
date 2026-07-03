import { client } from './client'
import type { AssignProductResponse, BuyerCompanyListItem, CompanyProductListItem } from '@/types/cart'
import type { MessageResponse, PageParams } from '@/types/common'

export const cartSupplierApi = {
  buyerCompanies: (params: PageParams) =>
    client.get<BuyerCompanyListItem[]>('/admin/cart/companies/', { params }).then((r) => r.data),
  buyerCompanyProducts: (buyerCompanyNo: number, params: PageParams) =>
    client
      .get<CompanyProductListItem[]>(`/admin/cart/companies/${buyerCompanyNo}`, { params })
      .then((r) => r.data),
  assign: (buyerCompanyNo: number, productNo: number[]) =>
    client
      .post<AssignProductResponse>('/admin/cart/assign', null, { params: { buyerCompanyNo, productNo } })
      .then((r) => r.data),
  updateUsage: (buyerCompanyNo: number, productNos: number[]) =>
    client
      .patch<MessageResponse>('/admin/cart/update', { buyerCompanyNo, productNos })
      .then((r) => r.data),
}

import { client } from './client'
import type { MessageResponse, PageParams } from '@/types/common'
import type { BuyerOrderDetail, BuyerOrderListItem, OrderItemInput, OrderStatus } from '@/types/order'

export const orderBuyerApi = {
  create: (supplierCompanyNo: number, orderItems: OrderItemInput[]) =>
    client
      .post<{ orderNo: number; message: string }>('/buyerOrder/', { supplierCompanyNo, orderItems })
      .then((r) => r.data),
  list: (params: PageParams) =>
    client.get<BuyerOrderListItem[]>('/buyerOrder/list', { params }).then((r) => r.data),
  get: (orderNo: number) =>
    client.get<BuyerOrderDetail>(`/buyerOrder/${orderNo}`, { params: { orderNo } }).then((r) => r.data),
  getStatus: (orderNo: number) =>
    client.get<{ status: OrderStatus }>(`/buyerOrder/${orderNo}/status`, { params: { orderNo } }).then((r) => r.data),
  cancel: (orderNo: number) =>
    client.put<MessageResponse>(`/buyerOrder/${orderNo}/cancel`, null, { params: { orderNo } }).then((r) => r.data),
  update: (orderNo: number, orderItems: OrderItemInput[]) =>
    client
      .put<MessageResponse>(`/buyerOrder/${orderNo}/update`, { orderNo, orderItems })
      .then((r) => r.data),
}

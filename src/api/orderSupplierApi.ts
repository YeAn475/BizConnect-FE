import { client } from './client'
import type { PageParams } from '@/types/common'
import type { OrderStatus, SupplierOrderDetail, SupplierOrderListItem } from '@/types/order'

export const orderSupplierApi = {
  list: (params: PageParams) =>
    client.get<SupplierOrderListItem[]>('/SupplierOrder/list', { params }).then((r) => r.data),
  detail: (orderNo: number) =>
    client.get<SupplierOrderDetail>('/SupplierOrder/detail', { params: { orderNo } }).then((r) => r.data),
  updateStatus: (orderNo: number, status: OrderStatus) =>
    client
      .put<{ orderNo: number; status: OrderStatus; message: string }>('/SupplierOrder/status', null, {
        params: { orderNo, status },
      })
      .then((r) => r.data),
}

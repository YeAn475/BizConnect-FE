export type OrderStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CLOSED'

export interface OrderItemInput {
  productNo: number
  quantity: number
}

export interface OrderItemView {
  productNo: number
  productName: string
  quantity: number
}

export interface BuyerOrderListItem {
  orderNo: number
  supplierCompanyName: string
  orderStatus: OrderStatus
  createdAt: string
}

export interface BuyerOrderDetail {
  orderNo: number
  supplierCompanyName: string
  status: OrderStatus
  createdAt: string
  orderItems: OrderItemView[]
}

export interface SupplierOrderListItem {
  orderNo: number
  buyerCompanyName: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

export interface SupplierOrderDetail {
  orderNo: number
  buyerCompanyName: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  orderItems: OrderItemView[]
}

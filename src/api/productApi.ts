import { client } from './client'
import type { MessageResponse, PageParams } from '@/types/common'
import type { ProductCreateInput, ProductDetail, ProductListItem } from '@/types/product'

export const productApi = {
  list: (params: PageParams) =>
    client.post<ProductListItem[]>('/product/list', null, { params }).then((r) => r.data),
  get: (productNo: number) =>
    client
      .post<ProductDetail>(`/product/${productNo}`, null, { params: { productNo } })
      .then((r) => r.data),
  create: (payload: ProductCreateInput) =>
    client.post<MessageResponse>('/product/', null, { params: payload }).then((r) => r.data),
  uploadImage: (productNo: number, file: File) => {
    const form = new FormData()
    form.append('image', file)
    return client
      .post<{ message: string; url: string }>(`/product/${productNo}/image`, form)
      .then((r) => r.data)
  },
}

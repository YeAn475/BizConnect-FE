import { client } from './client'
import type { MessageResponse, PageParams } from '@/types/common'
import type {
  AccountRegisterResponse,
  CompanyListItem,
  CompanyRequestInput,
  CompanyUpdateInput,
  CompanyUpdateResponse,
} from '@/types/company'

export const companyApi = {
  list: (params: PageParams) => client.get<CompanyListItem[]>('/company/list', { params }).then((r) => r.data),
  requestNewCompany: (payload: CompanyRequestInput) =>
    client.post<MessageResponse>('/company/request', null, { params: payload }).then((r) => r.data),
  update: (payload: CompanyUpdateInput) =>
    client.patch<CompanyUpdateResponse>('/company/', payload).then((r) => r.data),
  registerAccount: (number: string) =>
    client.post<AccountRegisterResponse>('/company/account', null, { params: { number } }).then((r) => r.data),
  registerBusinessRegistration: (number: string) =>
    client.post<AccountRegisterResponse>('/company/registration', null, { params: { number } }).then((r) => r.data),
}

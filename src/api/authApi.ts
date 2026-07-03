import { client } from './client'
import type { LoginRequest, LoginResponse } from '@/types/auth'

export const authApi = {
  login: (payload: LoginRequest) => client.post<LoginResponse>('/auth/login', payload).then((r) => r.data),
  logout: () => client.post<string>('/auth/logout').then((r) => r.data),
}

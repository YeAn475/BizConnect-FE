import { client } from './client'
import type { MessageResponse } from '@/types/common'
import type { PasswordUpdateRequest, ProfileUpdateRequest, SignupRequest, UserProfile } from '@/types/user'

export const userApi = {
  signup: (payload: SignupRequest) => client.post<MessageResponse>('/user/signup', payload).then((r) => r.data),
  getProfile: () => client.get<UserProfile>('/user/profile').then((r) => r.data),
  updateProfile: (payload: ProfileUpdateRequest) =>
    client.patch<UserProfile>('/user/profile', payload).then((r) => r.data),
  updatePassword: (payload: PasswordUpdateRequest) =>
    client.put<MessageResponse>('/user/password', payload).then((r) => r.data),
  uploadProfileImage: (file: File) => {
    const form = new FormData()
    form.append('image', file)
    return client
      .post<{ message: string; imageUrl: string }>('/user/profile-image', form)
      .then((r) => r.data)
  },
  deleteAccount: () => client.put<Record<string, string>>('/user/account/delete').then((r) => r.data),
}

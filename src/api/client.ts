import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/useAuthStore'
import type { LoginResponse } from '@/types/auth'

// Injected by app/router.tsx after the router is created, to avoid a circular import
// between this module and the router (this module has no React/router dependency otherwise).
let navigateToLogin: (() => void) | null = null
export function setNavigateToLogin(fn: () => void) {
  navigateToLogin = fn
}

export const client = axios.create({ baseURL: '/api' })

// Separate instance with no interceptors, used only for the refresh call itself,
// so a failed refresh can't recursively trigger another refresh attempt.
const rawClient = axios.create({ baseURL: '/api' })

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }
  return config
})

let refreshPromise: Promise<LoginResponse> | null = null

function isAuthEndpoint(config: InternalAxiosRequestConfig | undefined) {
  return Boolean(config?.url?.startsWith('/auth/'))
}

async function refreshTokens(): Promise<LoginResponse> {
  const refreshToken = useAuthStore.getState().refreshToken
  if (!refreshToken) throw new Error('No refresh token available')

  // Backend expects the refresh token as a raw JSON string body, not { refreshToken }.
  const { data } = await rawClient.post<LoginResponse>('/auth/refresh', JSON.stringify(refreshToken), {
    headers: { 'Content-Type': 'application/json' },
  })
  return data
}

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined

    if (error.response?.status !== 401 || !originalConfig || originalConfig._retried || isAuthEndpoint(originalConfig)) {
      throw error
    }

    originalConfig._retried = true

    try {
      refreshPromise ??= refreshTokens().finally(() => {
        refreshPromise = null
      })
      const tokens = await refreshPromise
      useAuthStore.getState().setTokens(tokens)
      originalConfig.headers.set('Authorization', `Bearer ${tokens.accessToken}`)
      return client(originalConfig)
    } catch (refreshError) {
      useAuthStore.getState().logout()
      navigateToLogin?.()
      throw refreshError
    }
  },
)

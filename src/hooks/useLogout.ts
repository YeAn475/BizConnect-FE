import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/authApi'
import { useAuthStore } from '@/stores/useAuthStore'
import { useModeStore } from '@/stores/useModeStore'

export function useLogout() {
  const navigate = useNavigate()

  return async () => {
    try {
      await authApi.logout()
    } catch {
      // Even if the server call fails, still clear local state so the user can log out.
    }
    useAuthStore.getState().logout()
    useModeStore.getState().reset()
    navigate('/login', { replace: true })
  }
}

import { Navigate } from 'react-router-dom'
import { useModeStore } from '@/stores/useModeStore'

export function IndexRedirect() {
  const mode = useModeStore((s) => s.mode)
  return <Navigate to={mode === 'BUYER' ? '/buyer' : '/supplier'} replace />
}

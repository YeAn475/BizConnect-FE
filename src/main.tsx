import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'
import './index.css'
import { router } from '@/app/router'
import { setNavigateToLogin } from '@/api/client'

setNavigateToLogin(() => router.navigate('/login'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster position="top-center" richColors />
    <RouterProvider router={router} />
  </StrictMode>,
)

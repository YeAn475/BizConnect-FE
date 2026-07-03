import { type FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authApi } from '@/api/authApi'
import { userApi } from '@/api/userApi'
import { useAuthStore } from '@/stores/useAuthStore'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { getErrorMessage } from '@/lib/errorMessage'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const setTokens = useAuthStore((s) => s.setTokens)
  const setUser = useAuthStore((s) => s.setUser)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const tokens = await authApi.login({ email, password })
      setTokens(tokens)
      const profile = await userApi.getProfile()
      setUser(profile)
      const from = (location.state as { from?: Location })?.from?.pathname ?? '/'
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error, '로그인에 실패했습니다.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-slate-900">로그인</h1>
      <Input
        id="email"
        type="email"
        label="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        id="password"
        type="password"
        label="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
      />
      <Button type="submit" loading={loading} className="mt-2 w-full">
        로그인
      </Button>
      <p className="text-center text-sm text-slate-500">
        계정이 없으신가요?{' '}
        <Link to="/signup" className="font-medium text-slate-900 hover:underline">
          회원가입
        </Link>
      </p>
    </form>
  )
}

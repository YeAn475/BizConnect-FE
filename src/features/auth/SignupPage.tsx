import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { userApi } from '@/api/userApi'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { getErrorMessage } from '@/lib/errorMessage'

const initialForm = { name: '', email: '', password: '', passwordConfirm: '', phoneNumber: '', address: '' }

export function SignupPage() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function update<K extends keyof typeof initialForm>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (form.password !== form.passwordConfirm) {
      toast.error('비밀번호가 일치하지 않습니다.')
      return
    }
    setLoading(true)
    try {
      await userApi.signup(form)
      toast.success('회원가입이 완료되었습니다. 로그인해주세요.')
      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error, '회원가입에 실패했습니다.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-slate-900">회원가입</h1>
      <Input id="name" label="이름" value={form.name} onChange={(e) => update('name', e.target.value)} required />
      <Input
        id="email"
        type="email"
        label="이메일"
        value={form.email}
        onChange={(e) => update('email', e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        id="password"
        type="password"
        label="비밀번호"
        value={form.password}
        onChange={(e) => update('password', e.target.value)}
        required
        autoComplete="new-password"
      />
      <Input
        id="passwordConfirm"
        type="password"
        label="비밀번호 확인"
        value={form.passwordConfirm}
        onChange={(e) => update('passwordConfirm', e.target.value)}
        required
        autoComplete="new-password"
      />
      <Input
        id="phoneNumber"
        label="전화번호"
        value={form.phoneNumber}
        onChange={(e) => update('phoneNumber', e.target.value)}
        placeholder="010-0000-0000"
        required
      />
      <Input id="address" label="주소" value={form.address} onChange={(e) => update('address', e.target.value)} required />
      <Button type="submit" loading={loading} className="mt-2 w-full">
        가입하기
      </Button>
      <p className="text-center text-sm text-slate-500">
        이미 계정이 있으신가요?{' '}
        <Link to="/login" className="font-medium text-slate-900 hover:underline">
          로그인
        </Link>
      </p>
    </form>
  )
}

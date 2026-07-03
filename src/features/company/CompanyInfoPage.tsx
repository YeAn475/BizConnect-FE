import { type FormEvent, useState } from 'react'
import { toast } from 'sonner'
import { companyApi } from '@/api/companyApi'
import { useAuthStore } from '@/stores/useAuthStore'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { getErrorMessage } from '@/lib/errorMessage'

export function CompanyInfoPage() {
  const companyName = useAuthStore((s) => s.user?.companyName ?? '')

  const [form, setForm] = useState({
    companyName,
    branchName: '',
    affiliationName: '',
    companyAddress: '',
    companyPhone: '',
  })
  const [saving, setSaving] = useState(false)

  const [accountNumber, setAccountNumber] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [savingAccount, setSavingAccount] = useState(false)
  const [savingRegistration, setSavingRegistration] = useState(false)

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await companyApi.update(form)
      toast.success('회사 정보가 수정되었습니다.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  async function handleAccountSubmit(e: FormEvent) {
    e.preventDefault()
    setSavingAccount(true)
    try {
      await companyApi.registerAccount(accountNumber)
      toast.success('법인 계좌가 등록되었습니다.')
      setAccountNumber('')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSavingAccount(false)
    }
  }

  async function handleRegistrationSubmit(e: FormEvent) {
    e.preventDefault()
    setSavingRegistration(true)
    try {
      await companyApi.registerBusinessRegistration(registrationNumber)
      toast.success('사업자등록번호가 등록되었습니다.')
      setRegistrationNumber('')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSavingRegistration(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="회사 정보" description="소속 회사 정보를 수정하고 계좌/사업자등록번호를 관리합니다." />

      <Card className="mb-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">회사 정보 수정</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="회사명" value={form.companyName} onChange={(e) => update('companyName', e.target.value)} required />
          <Input label="소속(그룹)명" value={form.affiliationName} onChange={(e) => update('affiliationName', e.target.value)} required />
          <Input label="지점/브랜드명" value={form.branchName} onChange={(e) => update('branchName', e.target.value)} required />
          <Input label="주소" value={form.companyAddress} onChange={(e) => update('companyAddress', e.target.value)} required />
          <Input label="전화번호" value={form.companyPhone} onChange={(e) => update('companyPhone', e.target.value)} required />
          <Button type="submit" loading={saving} className="self-start">
            저장
          </Button>
        </form>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">법인 계좌 등록</h2>
        <form onSubmit={handleAccountSubmit} className="flex items-end gap-3">
          <Input
            label="계좌번호"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" loading={savingAccount}>
            등록
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold text-slate-900">사업자등록번호 등록</h2>
        <form onSubmit={handleRegistrationSubmit} className="flex items-end gap-3">
          <Input
            label="사업자등록번호"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            required
            className="flex-1"
          />
          <Button type="submit" loading={savingRegistration}>
            등록
          </Button>
        </form>
      </Card>
    </div>
  )
}

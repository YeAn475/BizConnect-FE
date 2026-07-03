import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { companyApi } from '@/api/companyApi'
import type { CompanyRequestInput } from '@/types/company'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/common/Card'
import { Input, Textarea } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { getErrorMessage } from '@/lib/errorMessage'

const initialForm: CompanyRequestInput = {
  companyName: '',
  affiliationName: '',
  branchName: '',
  address: '',
  phoneNumber: '',
  content: '',
}

export function CompanyRequestPage() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function update<K extends keyof CompanyRequestInput>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await companyApi.requestNewCompany(form)
      toast.success(res.message || '신규 회사 등록 요청이 접수되었습니다.')
      navigate('/company/directory')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="신규 회사 등록 요청" description="새로운 회사를 등록하려면 아래 정보를 입력해주세요. 운영자 승인 후 반영됩니다." />
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="회사명" value={form.companyName} onChange={(e) => update('companyName', e.target.value)} required />
          <Input
            label="소속(그룹)명"
            value={form.affiliationName}
            onChange={(e) => update('affiliationName', e.target.value)}
            required
          />
          <Input label="지점/브랜드명" value={form.branchName} onChange={(e) => update('branchName', e.target.value)} required />
          <Input label="주소" value={form.address} onChange={(e) => update('address', e.target.value)} required />
          <Input label="전화번호" value={form.phoneNumber} onChange={(e) => update('phoneNumber', e.target.value)} required />
          <Textarea
            label="요청 사유"
            value={form.content}
            onChange={(e) => update('content', e.target.value)}
            placeholder="회사 등록이 필요한 사유를 입력해주세요."
            required
          />
          <Button type="submit" loading={loading} className="self-start">
            요청 제출
          </Button>
        </form>
      </Card>
    </div>
  )
}

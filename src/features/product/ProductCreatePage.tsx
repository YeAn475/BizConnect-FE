import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { productApi } from '@/api/productApi'
import { useAuthStore } from '@/stores/useAuthStore'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/common/Card'
import { Input, Textarea } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { getErrorMessage } from '@/lib/errorMessage'

export function ProductCreatePage() {
  const companyName = useAuthStore((s) => s.user?.companyName ?? '')
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    unit: '',
    category: '',
    manufacturer: '',
    productStatus: '판매중',
    content: '',
    price: '',
  })
  const [loading, setLoading] = useState(false)

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await productApi.create({ ...form, companyName, price: Number(form.price) })
      toast.success('상품이 등록되었습니다. 목록에서 이미지를 추가할 수 있습니다.')
      navigate('/supplier/products')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="상품 등록" description="등록 후 상품 상세 화면에서 이미지를 업로드할 수 있습니다." />
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="상품명" value={form.name} onChange={(e) => update('name', e.target.value)} required />
          <Input label="단위" value={form.unit} onChange={(e) => update('unit', e.target.value)} placeholder="EA, BOX 등" required />
          <Input label="카테고리" value={form.category} onChange={(e) => update('category', e.target.value)} required />
          <Input label="제조사" value={form.manufacturer} onChange={(e) => update('manufacturer', e.target.value)} required />
          <Input label="상품 상태" value={form.productStatus} onChange={(e) => update('productStatus', e.target.value)} required />
          <Input
            type="number"
            label="가격"
            value={form.price}
            onChange={(e) => update('price', e.target.value)}
            min={0}
            required
          />
          <Textarea label="상품 설명" value={form.content} onChange={(e) => update('content', e.target.value)} required />
          <Button type="submit" loading={loading} className="self-start">
            등록
          </Button>
        </form>
      </Card>
    </div>
  )
}

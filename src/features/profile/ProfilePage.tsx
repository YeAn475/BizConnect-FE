import { type FormEvent, useRef, useState } from 'react'
import { toast } from 'sonner'
import { userApi } from '@/api/userApi'
import { useAuthStore } from '@/stores/useAuthStore'
import { useLogout } from '@/hooks/useLogout'
import { PageHeader } from '@/components/common/PageHeader'
import { Card } from '@/components/common/Card'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { getErrorMessage } from '@/lib/errorMessage'
import { formatDateTime } from '@/lib/date'

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useLogout()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? '')
  const [address, setAddress] = useState(user?.address ?? '')
  const [savingProfile, setSavingProfile] = useState(false)

  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  const [uploading, setUploading] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (!user) return null

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const updated = await userApi.updateProfile({ phoneNumber, address })
      setUser({ ...user!, ...updated })
      toast.success('프로필이 수정되었습니다.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSavingProfile(false)
    }
  }

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('새 비밀번호가 일치하지 않습니다.')
      return
    }
    setSavingPassword(true)
    try {
      await userApi.updatePassword({ password, newPassword, confirmPassword })
      toast.success('비밀번호가 변경되었습니다.')
      setPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSavingPassword(false)
    }
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { imageUrl } = await userApi.uploadProfileImage(file)
      setUser({ ...user!, imageUrl })
      toast.success('프로필 이미지가 변경되었습니다.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true)
    try {
      await userApi.deleteAccount()
      toast.success('계정이 삭제되었습니다.')
      await logout()
    } catch (error) {
      toast.error(getErrorMessage(error))
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="내 정보" description="계정 및 회사 소속 정보를 확인하고 수정할 수 있습니다." />

      <Card className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-xl font-semibold text-white">
          {user.imageUrl ? (
            <img src={user.imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            user.name.slice(0, 1)
          )}
        </div>
        <div className="flex-1 text-sm">
          <p className="text-base font-semibold text-slate-900">{user.name}</p>
          <p className="text-slate-500">
            {user.companyName} · {user.positionName} · {user.roleName}
          </p>
          <p className="text-xs text-slate-400">가입일 {formatDateTime(user.createdAt)}</p>
        </div>
        <div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
          <Button variant="secondary" size="sm" loading={uploading} onClick={() => fileInputRef.current?.click()}>
            사진 변경
          </Button>
        </div>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">기본 정보</h2>
        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
          <Input label="이메일" value={user.email} disabled />
          <Input label="전화번호" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
          <Input label="주소" value={address} onChange={(e) => setAddress(e.target.value)} required />
          <Button type="submit" loading={savingProfile} className="self-start">
            저장
          </Button>
        </form>
      </Card>

      <Card className="mb-6">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">비밀번호 변경</h2>
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <Input
            type="password"
            label="현재 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            label="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <Input
            type="password"
            label="새 비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" loading={savingPassword} className="self-start">
            변경
          </Button>
        </form>
      </Card>

      <Card className="border-red-200">
        <h2 className="mb-2 text-sm font-semibold text-red-700">계정 삭제</h2>
        <p className="mb-4 text-sm text-slate-500">계정을 삭제하면 되돌릴 수 없습니다.</p>
        <Button variant="danger" size="sm" onClick={() => setConfirmDeleteOpen(true)}>
          계정 삭제
        </Button>
      </Card>

      <ConfirmDialog
        open={confirmDeleteOpen}
        title="계정을 삭제하시겠습니까?"
        description="삭제 후에는 복구할 수 없으며 즉시 로그아웃됩니다."
        confirmLabel="삭제"
        danger
        loading={deleting}
        onConfirm={handleDeleteAccount}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </div>
  )
}

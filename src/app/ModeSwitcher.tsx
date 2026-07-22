import clsx from 'clsx'
import { useNavigate } from 'react-router-dom'
import { useModeStore, type CompanyMode } from '@/stores/useModeStore'

const OPTIONS: { value: CompanyMode; label: string }[] = [
  { value: 'BUYER', label: '구매자 모드' },
  { value: 'SUPPLIER', label: '공급자 모드' },
]

export function ModeSwitcher() {
  const mode = useModeStore((s) => s.mode)
  const setMode = useModeStore((s) => s.setMode)
  const navigate = useNavigate()

  function handleSelect(value: CompanyMode) {
    setMode(value)
    navigate(value === 'BUYER' ? '/buyer' : '/supplier')
  }

  return (
    <div className="flex rounded-md border border-slate-200 bg-slate-100 p-0.5 text-xs font-medium">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleSelect(opt.value)}
          className={clsx(
            'rounded px-3 py-1.5 transition-colors',
            mode === opt.value ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

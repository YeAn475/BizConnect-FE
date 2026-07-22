import type { LucideIcon } from 'lucide-react'
import { Card } from './Card'

interface StatTileProps {
  label: string
  value: number | string
  icon: LucideIcon
  loading?: boolean
}

export function StatTile({ label, value, icon: Icon, loading }: StatTileProps) {
  return (
    <Card className="flex items-center gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-semibold text-slate-900">{loading ? '—' : value}</p>
      </div>
    </Card>
  )
}

import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import { useModeStore } from '@/stores/useModeStore'
import { commonNavGroups, modeNavGroups, type NavGroup } from './nav'

function NavGroupBlock({ group }: { group: NavGroup }) {
  return (
    <div>
      <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">{group.title}</p>
      <nav className="flex flex-col gap-0.5">
        {group.items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export function Sidebar() {
  const mode = useModeStore((s) => s.mode)

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r border-slate-200 bg-white p-4 md:flex">
      <div className="px-2 pt-2">
        <p className="text-lg font-bold tracking-tight text-slate-900">BizConnect</p>
        <p className="text-xs text-slate-400">B2B 파트너 플랫폼</p>
      </div>
      <NavGroupBlock group={modeNavGroups[mode]} />
      {commonNavGroups.map((group) => (
        <NavGroupBlock key={group.title} group={group} />
      ))}
    </aside>
  )
}

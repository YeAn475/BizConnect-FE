import clsx from 'clsx'
import { NavLink } from 'react-router-dom'
import { Boxes } from 'lucide-react'
import { useModeStore } from '@/stores/useModeStore'
import { commonNavGroups, homeNavItem, modeNavGroups, type NavGroup, type NavItem } from './nav'

function NavRow({ item }: { item: NavItem }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-brand-500/15 text-white ring-1 ring-inset ring-brand-500/40'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-100',
        )
      }
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
      {item.label}
    </NavLink>
  )
}

function NavGroupBlock({ group }: { group: NavGroup }) {
  return (
    <div>
      <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{group.title}</p>
      <nav className="flex flex-col gap-0.5">
        {group.items.map((item) => (
          <NavRow key={item.to} item={item} />
        ))}
      </nav>
    </div>
  )
}

export function Sidebar() {
  const mode = useModeStore((s) => s.mode)

  return (
    <aside className="hidden w-64 shrink-0 flex-col gap-6 overflow-y-auto bg-brand-950 p-4 md:flex">
      <div className="flex items-center gap-2.5 px-2 pt-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-500 text-white">
          <Boxes className="h-4.5 w-4.5" strokeWidth={2.25} />
        </span>
        <div>
          <p className="text-sm font-bold tracking-tight text-white">BizConnect</p>
          <p className="text-[11px] text-slate-400">B2B 파트너 플랫폼</p>
        </div>
      </div>

      <NavRow item={homeNavItem} />

      <div className="h-px bg-white/10" />

      <NavGroupBlock group={modeNavGroups[mode]} />
      {commonNavGroups.map((group) => (
        <NavGroupBlock key={group.title} group={group} />
      ))}
    </aside>
  )
}

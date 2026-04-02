import { NavLink } from 'react-router-dom'
import {
  RiDashboardLine,
  RiFileListLine,
  RiUploadLine,
  RiBarChartLine,
  RiChat1Line,
  RiCandleLine,
} from '@remixicon/react'
import { cn } from '@/utils/cn'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: RiDashboardLine },
  { to: '/trades',    label: 'Trades',    icon: RiFileListLine },
  { to: '/import',   label: 'Import',    icon: RiUploadLine },
  { to: '/analytics',label: 'Analytics', icon: RiBarChartLine },
  { to: '/chat',     label: 'AI Chat',   icon: RiChat1Line },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-56 shrink-0 flex-col border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-neutral-200 px-4 dark:border-neutral-800">
        <RiCandleLine className="size-5 text-primary-600" />
        <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Trading Journal
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-400'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

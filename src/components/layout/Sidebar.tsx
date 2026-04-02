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
    <aside className="flex h-screen w-12 shrink-0 flex-col border-r border-neutral-800 bg-neutral-950">
      {/* Logo */}
      <div className="flex h-14 items-center justify-center border-b border-neutral-800">
        <RiCandleLine className="size-5 text-primary-500" />
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col overflow-y-auto py-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              cn(
                'flex h-10 w-full items-center justify-center border-l-2 transition-colors',
                isActive
                  ? 'border-l-primary-500 bg-primary-950 text-primary-400'
                  : 'border-l-transparent text-neutral-600 hover:bg-neutral-800 hover:text-neutral-200'
              )
            }
          >
            <Icon className="size-4 shrink-0" />
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/trades':    'Trade List',
  '/import':   'Import Trades',
  '/analytics':'Analytics',
  '/chat':     'AI Chat',
}

export function AppShell() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] ?? TITLES[Object.keys(TITLES).find(k => pathname.startsWith(k)) ?? ''] ?? ''

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-950">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { RiMoonLine, RiSunLine, RiLogoutBoxLine } from '@remixicon/react'
import { useAuthStore } from '@/store'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function TopBar({ title }: { title?: string }) {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('tj-theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-5 dark:border-neutral-800 dark:bg-neutral-950">
      <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
      </h1>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDark((d) => !d)}
          title="Toggle dark mode"
        >
          {dark ? <RiSunLine className="size-4" /> : <RiMoonLine className="size-4" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { logout(); navigate('/login') }}
          title="Logout"
        >
          <RiLogoutBoxLine className="size-4" />
          <span className="text-xs">Logout</span>
        </Button>
      </div>
    </header>
  )
}

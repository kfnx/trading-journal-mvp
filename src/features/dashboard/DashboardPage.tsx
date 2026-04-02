import { useNavigate } from 'react-router-dom'
import { RiUploadLine, RiFileListLine, RiBarChartLine, RiChat1Line } from '@remixicon/react'
import { useAnalytics } from '@/hooks/useAnalytics'
import { StatCards } from '@/features/analytics/StatCards'
import { CalendarView } from '@/features/analytics/CalendarView'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store'

export default function DashboardPage() {
  const navigate = useNavigate()
  const username = useAuthStore((s) => s.username)
  const { stats, byDay, trades } = useAnalytics()

  const isEmpty = trades.length === 0

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div>
        <h2 className="font-mono text-lg font-medium text-neutral-100">
          Welcome back, {username ?? 'Trader'}
        </h2>
        <p className="mt-1 font-mono text-xs text-neutral-500">
          {isEmpty ? 'Import your first CSV to get started.' : `${trades.length} trades tracked.`}
        </p>
      </div>

      {isEmpty ? (
        /* Empty state */
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Import CSV', icon: RiUploadLine, to: '/import', desc: 'Upload your trade history' },
            { label: 'View Trades', icon: RiFileListLine, to: '/trades', desc: 'Browse and classify trades' },
            { label: 'Analytics', icon: RiBarChartLine, to: '/analytics', desc: 'Performance overview' },
            { label: 'AI Chat', icon: RiChat1Line, to: '/chat', desc: 'Ask about your trades' },
          ].map(({ label, icon: Icon, to, desc }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="flex flex-col gap-3 border border-neutral-800 bg-neutral-900 p-5 text-left transition-colors hover:border-neutral-700 hover:bg-neutral-800"
            >
              <Icon className="size-5 text-primary-500" />
              <div>
                <p className="text-sm font-medium text-neutral-100">{label}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-neutral-500">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <>
          <StatCards stats={stats} />
          <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
            <CalendarView byDay={byDay} />
            <div className="flex flex-col gap-3 lg:w-52">
              <Button onClick={() => navigate('/import')} variant="stroke" size="sm" className="justify-start gap-2">
                <RiUploadLine className="size-4" /> Import more trades
              </Button>
              <Button onClick={() => navigate('/trades')} variant="stroke" size="sm" className="justify-start gap-2">
                <RiFileListLine className="size-4" /> View all trades
              </Button>
              <Button onClick={() => navigate('/analytics')} variant="stroke" size="sm" className="justify-start gap-2">
                <RiBarChartLine className="size-4" /> Full analytics
              </Button>
              <Button onClick={() => navigate('/chat')} variant="stroke" size="sm" className="justify-start gap-2">
                <RiChat1Line className="size-4" /> Ask AI
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

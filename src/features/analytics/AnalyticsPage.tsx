import { useNavigate } from 'react-router-dom'
import { useAnalytics } from '@/hooks/useAnalytics'
import { StatCards } from './StatCards'
import { CalendarView } from './CalendarView'
import { MonthlyOverview } from './MonthlyOverview'
import { Button } from '@/components/ui/button'

export default function AnalyticsPage() {
  const { stats, byDay, byMonth, trades } = useAnalytics()
  const navigate = useNavigate()

  if (trades.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <p className="text-sm text-neutral-400">Import trades to see analytics.</p>
        <Button variant="stroke" size="sm" onClick={() => navigate('/import')}>
          Import CSV
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <StatCards stats={stats} />
      <div className="grid gap-5 lg:grid-cols-2">
        <CalendarView byDay={byDay} />
        <MonthlyOverview months={byMonth} />
      </div>
      {/* Extra stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="border border-neutral-800 bg-neutral-900 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Wins / Losses</p>
          <p className="mt-1 font-mono text-lg font-medium">
            <span className="text-success-500">{stats.totalWins}</span>
            <span className="mx-1 text-neutral-700">/</span>
            <span className="text-error-500">{stats.totalLosses}</span>
          </p>
        </div>
        <div className="border border-neutral-800 bg-neutral-900 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Avg PnL / Trade</p>
          <p className={`mt-1 font-mono text-lg font-medium ${stats.avgPnlPerTrade >= 0 ? 'text-success-500' : 'text-error-500'}`}>
            {stats.avgPnlPerTrade >= 0 ? '+' : ''}{stats.avgPnlPerTrade.toFixed(2)}
          </p>
        </div>
        <div className="border border-neutral-800 bg-neutral-900 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Largest Win</p>
          <p className="mt-1 font-mono text-lg font-medium text-success-500">+{stats.largestWin.toFixed(2)}</p>
        </div>
        <div className="border border-neutral-800 bg-neutral-900 p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">Largest Loss</p>
          <p className="mt-1 font-mono text-lg font-medium text-error-500">{stats.largestLoss.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

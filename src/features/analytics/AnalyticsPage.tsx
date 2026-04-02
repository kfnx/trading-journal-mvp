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
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs text-neutral-400">Wins / Losses</p>
          <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-neutral-100">
            <span className="text-success-600">{stats.totalWins}</span>
            <span className="text-neutral-300 mx-1">/</span>
            <span className="text-error-600">{stats.totalLosses}</span>
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs text-neutral-400">Avg PnL / Trade</p>
          <p className={`mt-1 text-lg font-bold ${stats.avgPnlPerTrade >= 0 ? 'text-success-600' : 'text-error-600'}`}>
            {stats.avgPnlPerTrade >= 0 ? '+' : ''}{stats.avgPnlPerTrade.toFixed(2)}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs text-neutral-400">Largest Win</p>
          <p className="mt-1 text-lg font-bold text-success-600">+{stats.largestWin.toFixed(2)}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-xs text-neutral-400">Largest Loss</p>
          <p className="mt-1 text-lg font-bold text-error-600">{stats.largestLoss.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}

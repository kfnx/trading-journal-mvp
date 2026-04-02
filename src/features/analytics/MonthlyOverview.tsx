import type { MonthSummary } from '@/types/analytics'
import { cn } from '@/utils/cn'

interface Props {
  months: MonthSummary[]
}

export function MonthlyOverview({ months }: Props) {
  if (months.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
        <p className="text-sm text-neutral-400">No monthly data yet.</p>
      </div>
    )
  }

  const maxAbsPnl = Math.max(...months.map((m) => Math.abs(m.totalPnl)), 1)
  const recent = months.slice(-12)

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Monthly PnL</h3>
      <div className="flex items-end gap-2 overflow-x-auto pb-1">
        {recent.map((m) => {
          const pct = Math.abs(m.totalPnl) / maxAbsPnl
          const height = Math.max(pct * 120, 4)
          const positive = m.totalPnl >= 0
          return (
            <div key={m.month} className="flex flex-col items-center gap-1 shrink-0" title={`${m.label}: ${m.totalPnl >= 0 ? '+' : ''}${m.totalPnl.toFixed(2)}`}>
              <span className={cn('text-[10px] font-semibold', positive ? 'text-success-600' : 'text-error-600')}>
                {m.totalPnl >= 0 ? '+' : ''}{m.totalPnl.toFixed(0)}
              </span>
              <div
                className={cn('w-8 rounded-t-md transition-all', positive ? 'bg-success-400 dark:bg-success-600' : 'bg-error-400 dark:bg-error-600')}
                style={{ height }}
              />
              <span className="text-[9px] text-neutral-400 text-center leading-tight">
                {m.label.split(' ')[0]}<br />{m.label.split(' ')[1]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

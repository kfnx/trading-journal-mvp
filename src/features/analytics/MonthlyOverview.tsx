import type { MonthSummary } from '@/types/analytics'
import { cn } from '@/utils/cn'

interface Props {
  months: MonthSummary[]
}

export function MonthlyOverview({ months }: Props) {
  if (months.length === 0) {
    return (
      <div className="border border-neutral-800 bg-neutral-900 p-5">
        <p className="font-mono text-xs text-neutral-500">No monthly data yet.</p>
      </div>
    )
  }

  const maxAbsPnl = Math.max(...months.map((m) => Math.abs(m.totalPnl)), 1)
  const recent = months.slice(-12)

  return (
    <div className="border border-neutral-800 bg-neutral-900 p-5">
      <h3 className="mb-4 font-mono text-[10px] uppercase tracking-widest text-neutral-500">Monthly PnL</h3>
      <div className="flex items-end gap-2 overflow-x-auto pb-1">
        {recent.map((m) => {
          const pct = Math.abs(m.totalPnl) / maxAbsPnl
          const height = Math.max(pct * 120, 4)
          const positive = m.totalPnl >= 0
          return (
            <div key={m.month} className="flex shrink-0 flex-col items-center gap-1" title={`${m.label}: ${m.totalPnl >= 0 ? '+' : ''}${m.totalPnl.toFixed(2)}`}>
              <span className={cn('font-mono text-[9px] font-medium', positive ? 'text-success-500' : 'text-error-500')}>
                {m.totalPnl >= 0 ? '+' : ''}{m.totalPnl.toFixed(0)}
              </span>
              <div
                className={cn('w-8 transition-all', positive ? 'bg-success-700' : 'bg-error-800')}
                style={{ height }}
              />
              <span className="text-center font-mono text-[8px] leading-tight text-neutral-600">
                {m.label.split(' ')[0]}<br />{m.label.split(' ')[1]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

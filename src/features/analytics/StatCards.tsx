import type { TradeStats } from '@/types/analytics'
import { cn } from '@/utils/cn'

interface CardProps {
  label: string
  value: string
  positive?: boolean
  negative?: boolean
}

function StatCard({ label, value, positive, negative }: CardProps) {
  return (
    <div className={cn(
      'flex flex-col gap-2 border border-neutral-800 border-l-2 bg-neutral-900 p-4',
      positive ? 'border-l-success-500' : negative ? 'border-l-error-500' : 'border-l-neutral-600'
    )}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">{label}</p>
      <p className={cn(
        'font-mono text-2xl font-medium tracking-tight',
        positive && 'text-success-500',
        negative && 'text-error-500',
        !positive && !negative && 'text-neutral-100'
      )}>
        {value}
      </p>
    </div>
  )
}

export function StatCards({ stats }: { stats: TradeStats }) {
  return (
    <div className="grid grid-cols-2 gap-px sm:grid-cols-4 bg-neutral-800">
      <StatCard
        label="Total Trades"
        value={String(stats.totalTrades)}
      />
      <StatCard
        label="Win Rate"
        value={`${(stats.winRate * 100).toFixed(1)}%`}
        positive={stats.winRate >= 0.5}
        negative={stats.winRate < 0.5 && stats.totalTrades > 0}
      />
      <StatCard
        label="Total PnL"
        value={`${stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toFixed(2)}`}
        positive={stats.totalPnl > 0}
        negative={stats.totalPnl < 0}
      />
      <StatCard
        label="Profit Factor"
        value={isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : '∞'}
        positive={stats.profitFactor >= 1.5}
        negative={stats.profitFactor < 1 && stats.totalTrades > 0}
      />
    </div>
  )
}

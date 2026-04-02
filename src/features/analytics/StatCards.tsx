import { RiTrophyLine, RiLineChartLine, RiBarChartBoxLine, RiExchangeDollarLine } from '@remixicon/react'
import type { TradeStats } from '@/types/analytics'
import { cn } from '@/utils/cn'

interface CardProps {
  label: string
  value: string
  icon: React.ReactNode
  positive?: boolean
  negative?: boolean
}

function StatCard({ label, value, icon, positive, negative }: CardProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
        {icon}
      </div>
      <div>
        <p className="text-xs text-neutral-400">{label}</p>
        <p className={cn('mt-0.5 text-xl font-bold', positive && 'text-success-600', negative && 'text-error-600', !positive && !negative && 'text-neutral-900 dark:text-neutral-100')}>
          {value}
        </p>
      </div>
    </div>
  )
}

export function StatCards({ stats }: { stats: TradeStats }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard
        label="Total Trades"
        value={String(stats.totalTrades)}
        icon={<RiBarChartBoxLine className="size-4" />}
      />
      <StatCard
        label="Win Rate"
        value={`${(stats.winRate * 100).toFixed(1)}%`}
        icon={<RiTrophyLine className="size-4" />}
        positive={stats.winRate >= 0.5}
        negative={stats.winRate < 0.5 && stats.totalTrades > 0}
      />
      <StatCard
        label="Total PnL"
        value={`${stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toFixed(2)}`}
        icon={<RiExchangeDollarLine className="size-4" />}
        positive={stats.totalPnl > 0}
        negative={stats.totalPnl < 0}
      />
      <StatCard
        label="Profit Factor"
        value={isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : '∞'}
        icon={<RiLineChartLine className="size-4" />}
        positive={stats.profitFactor >= 1.5}
        negative={stats.profitFactor < 1 && stats.totalTrades > 0}
      />
    </div>
  )
}

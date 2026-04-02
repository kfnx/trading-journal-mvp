import { useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths } from 'date-fns'
import { RiArrowLeftSLine, RiArrowRightSLine } from '@remixicon/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import type { DaySummary } from '@/types/analytics'

interface Props {
  byDay: Record<string, DaySummary>
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalendarView({ byDay }: Props) {
  const [current, setCurrent] = useState(() => new Date())

  const monthStart = startOfMonth(current)
  const monthEnd = endOfMonth(current)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startOffset = getDay(monthStart) // 0=Sun

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {format(current, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-1">
          <Button variant="stroke" size="xs" onClick={() => setCurrent(subMonths(current, 1))}>
            <RiArrowLeftSLine className="size-4" />
          </Button>
          <Button variant="stroke" size="xs" onClick={() => setCurrent(new Date())}>
            Today
          </Button>
          <Button variant="stroke" size="xs" onClick={() => setCurrent(addMonths(current, 1))}>
            <RiArrowRightSLine className="size-4" />
          </Button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-wide text-neutral-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells for offset */}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const key = format(day, 'yyyy-MM-dd')
          const summary = byDay[key]
          const isToday = key === format(new Date(), 'yyyy-MM-dd')

          return (
            <div
              key={key}
              title={summary ? `PnL: ${summary.totalPnl >= 0 ? '+' : ''}${summary.totalPnl.toFixed(2)} (${summary.tradeCount} trades)` : undefined}
              className={cn(
                'relative flex flex-col items-center justify-center rounded-lg p-1.5 text-center aspect-square text-xs transition-colors',
                summary
                  ? summary.totalPnl > 0
                    ? 'bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200 cursor-pointer hover:bg-success-200'
                    : 'bg-error-100 text-error-800 dark:bg-error-900 dark:text-error-200 cursor-pointer hover:bg-error-200'
                  : 'text-neutral-400 dark:text-neutral-600',
                isToday && 'ring-2 ring-primary-500 ring-offset-1'
              )}
            >
              <span className={cn('font-medium', summary ? '' : 'text-neutral-400')}>{format(day, 'd')}</span>
              {summary && (
                <span className="text-[9px] leading-tight font-semibold mt-0.5">
                  {summary.totalPnl >= 0 ? '+' : ''}{summary.totalPnl.toFixed(0)}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4 text-xs text-neutral-400">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded bg-success-200 dark:bg-success-900" /> Profitable
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded bg-error-200 dark:bg-error-900" /> Loss
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded bg-neutral-200 dark:bg-neutral-700" /> No trades
        </span>
      </div>
    </div>
  )
}

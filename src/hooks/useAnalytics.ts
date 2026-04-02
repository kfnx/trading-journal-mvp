import { useMemo } from 'react'
import { useTradeStore } from '@/store'
import { computeStats, groupByDay, groupByMonth } from '@/utils/analytics'

export function useAnalytics() {
  const trades = useTradeStore((s) => s.trades)
  return useMemo(() => ({
    trades,
    stats: computeStats(trades),
    byDay: groupByDay(trades),
    byMonth: groupByMonth(trades),
  }), [trades])
}

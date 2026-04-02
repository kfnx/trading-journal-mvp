import { useState, useMemo } from 'react'
import { RiSearch2Line, RiFilterLine } from '@remixicon/react'
import { TradeTable } from './TradeTable'
import { useTradeStore } from '@/store'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { Strategy } from '@/types/trade'
import { STRATEGY_LABELS } from '@/types/trade'

export default function TradeListPage() {
  const trades = useTradeStore((s) => s.trades)
  const [search, setSearch] = useState('')
  const [strategyFilter, setStrategyFilter] = useState<Strategy | 'all'>('all')
  const [sideFilter, setSideFilter] = useState<'all' | 'LONG' | 'SHORT'>('all')

  const filtered = useMemo(() => {
    return trades.filter((t) => {
      const matchSearch = !search || t.symbol.toLowerCase().includes(search.toLowerCase())
      const matchStrategy = strategyFilter === 'all' || t.strategy === strategyFilter
      const matchSide = sideFilter === 'all' || t.side === sideFilter
      return matchSearch && matchStrategy && matchSide
    })
  }, [trades, search, strategyFilter, sideFilter])

  const totalPnl = filtered.reduce((sum, t) => sum + t.pnl, 0)

  return (
    <div className="flex flex-col gap-5">
      {/* Summary bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-500">{filtered.length} trades</span>
          <span className={`text-sm font-semibold ${totalPnl >= 0 ? 'text-success-600' : 'text-error-600'}`}>
            Total PnL: {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <RiSearch2Line className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400" />
          <Input
            className="h-8 w-44 pl-8 text-xs"
            placeholder="Search symbol…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <RiFilterLine className="size-3.5" />
        </div>
        <Select value={strategyFilter} onValueChange={(v) => setStrategyFilter(v as Strategy | 'all')}>
          <SelectTrigger className="h-8 w-36 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">All strategies</SelectItem>
            {(Object.entries(STRATEGY_LABELS) as [Strategy, string][]).map(([k, v]) => (
              <SelectItem key={k} value={k} className="text-xs">{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sideFilter} onValueChange={(v) => setSideFilter(v as typeof sideFilter)}>
          <SelectTrigger className="h-8 w-28 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs">Both sides</SelectItem>
            <SelectItem value="LONG" className="text-xs">Long only</SelectItem>
            <SelectItem value="SHORT" className="text-xs">Short only</SelectItem>
          </SelectContent>
        </Select>
        {(search || strategyFilter !== 'all' || sideFilter !== 'all') && (
          <Badge
            variant="primary"
            className="cursor-pointer"
            onClick={() => { setSearch(''); setStrategyFilter('all'); setSideFilter('all') }}
          >
            Clear filters ×
          </Badge>
        )}
      </div>

      <TradeTable trades={filtered} />
    </div>
  )
}

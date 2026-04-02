import { Badge } from '@/components/ui/badge'
import { StrategySelect } from '@/features/trades/StrategySelect'
import type { Trade } from '@/types/trade'

function Row({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-800 py-2.5 last:border-0">
      <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">{label}</span>
      <span className={`font-mono text-sm text-neutral-100 ${className ?? ''}`}>{value}</span>
    </div>
  )
}

export function TradeMetaCard({ trade }: { trade: Trade }) {
  const pnlColor = trade.pnl >= 0 ? 'text-success-600' : 'text-error-600'

  const duration = (() => {
    if (!trade.entryDate || !trade.exitDate) return '—'
    const diff = new Date(trade.exitDate).getTime() - new Date(trade.entryDate).getTime()
    const days = Math.floor(diff / 86400000)
    return days === 0 ? 'Intraday' : `${days}d`
  })()

  return (
    <div className="rounded border border-neutral-800 bg-neutral-900 p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{trade.symbol}</h2>
          <Badge variant={trade.side === 'LONG' ? 'success' : 'error'}>{trade.side}</Badge>
        </div>
        <span className={`font-mono text-xl font-medium ${pnlColor}`}>
          {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
        </span>
      </div>

      <div className="divide-y divide-neutral-800">
        <Row label="Entry date" value={`${trade.entryDate}${trade.entryTime ? ' ' + trade.entryTime : ''}`} />
        <Row label="Exit date"  value={`${trade.exitDate}${trade.exitTime ? ' ' + trade.exitTime : ''}`} />
        <Row label="Entry price" value={trade.entryPrice.toFixed(4)} />
        <Row label="Exit price"  value={trade.exitPrice.toFixed(4)} />
        <Row label="Quantity"    value={trade.quantity} />
        <Row label="PnL"         value={`${trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}`} className={pnlColor} />
        {trade.pnlPercent !== undefined && (
          <Row label="PnL %" value={`${trade.pnlPercent >= 0 ? '+' : ''}${trade.pnlPercent.toFixed(2)}%`} className={pnlColor} />
        )}
        {trade.commission !== undefined && (
          <Row label="Commission" value={trade.commission.toFixed(2)} />
        )}
        <Row label="Duration" value={duration} />
        <div className="flex items-center justify-between py-2.5">
          <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Strategy</span>
          <StrategySelect tradeId={trade.id} value={trade.strategy} />
        </div>
      </div>
    </div>
  )
}

import type { Trade } from '@/types/trade'
import { Badge } from '@/components/ui/badge'

interface Props {
  trades: Trade[]
}

export function ImportPreview({ trades }: Props) {
  const preview = trades.slice(0, 5)

  return (
    <div className="overflow-x-auto rounded border border-neutral-800">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-900">
            {['Date', 'Symbol', 'Side', 'Entry', 'Exit', 'Qty', 'PnL'].map((h) => (
              <th key={h} className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {preview.map((t) => (
            <tr key={t.id} className="border-b border-neutral-800 bg-neutral-950 last:border-0">
              <td className="px-3 py-2 font-mono text-neutral-500">{t.entryDate}</td>
              <td className="px-3 py-2 font-medium text-neutral-100">{t.symbol}</td>
              <td className="px-3 py-2">
                <Badge variant={t.side === 'LONG' ? 'success' : 'error'}>{t.side}</Badge>
              </td>
              <td className="px-3 py-2 font-mono text-neutral-400">{t.entryPrice}</td>
              <td className="px-3 py-2 font-mono text-neutral-400">{t.exitPrice}</td>
              <td className="px-3 py-2 font-mono text-neutral-500">{t.quantity}</td>
              <td className={`px-3 py-2 font-mono font-medium ${t.pnl >= 0 ? 'text-success-500' : 'text-error-500'}`}>
                {t.pnl >= 0 ? '+' : ''}{t.pnl.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {trades.length > 5 && (
        <p className="bg-neutral-900 px-3 py-2 font-mono text-[10px] text-neutral-600">
          …and {trades.length - 5} more rows
        </p>
      )}
    </div>
  )
}

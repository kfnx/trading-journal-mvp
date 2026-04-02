import type { Trade } from '@/types/trade'
import { Badge } from '@/components/ui/badge'

interface Props {
  trades: Trade[]
}

export function ImportPreview({ trades }: Props) {
  const preview = trades.slice(0, 5)

  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
            {['Date', 'Symbol', 'Side', 'Entry', 'Exit', 'Qty', 'PnL'].map((h) => (
              <th key={h} className="px-3 py-2 text-left font-semibold text-neutral-500 dark:text-neutral-400">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {preview.map((t) => (
            <tr key={t.id} className="border-b border-neutral-100 dark:border-neutral-800 last:border-0">
              <td className="px-3 py-2 text-neutral-600 dark:text-neutral-400">{t.entryDate}</td>
              <td className="px-3 py-2 font-medium text-neutral-900 dark:text-neutral-100">{t.symbol}</td>
              <td className="px-3 py-2">
                <Badge variant={t.side === 'LONG' ? 'success' : 'error'}>{t.side}</Badge>
              </td>
              <td className="px-3 py-2 text-neutral-700 dark:text-neutral-300">{t.entryPrice}</td>
              <td className="px-3 py-2 text-neutral-700 dark:text-neutral-300">{t.exitPrice}</td>
              <td className="px-3 py-2 text-neutral-700 dark:text-neutral-300">{t.quantity}</td>
              <td className={`px-3 py-2 font-semibold ${t.pnl >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                {t.pnl >= 0 ? '+' : ''}{t.pnl.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {trades.length > 5 && (
        <p className="px-3 py-2 text-xs text-neutral-400 bg-neutral-50 dark:bg-neutral-800">
          …and {trades.length - 5} more rows
        </p>
      )}
    </div>
  )
}

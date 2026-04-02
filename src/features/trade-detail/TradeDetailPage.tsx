import { useParams, useNavigate } from 'react-router-dom'
import { RiArrowLeftLine } from '@remixicon/react'
import { useTradeStore } from '@/store'
import { Button } from '@/components/ui/button'
import { TradeMetaCard } from './TradeMetaCard'
import { TradeChart } from './TradeChart'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function TradeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const trade = useTradeStore((s) => s.trades.find((t) => t.id === id))
  const updateTradeNotes = useTradeStore((s) => s.updateTradeNotes)

  if (!trade) {
    return (
      <div className="flex flex-col items-center gap-4 pt-20">
        <p className="text-neutral-400">Trade not found.</p>
        <Button variant="stroke" size="sm" onClick={() => navigate('/trades')}>
          Back to trades
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-5">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate('/trades')} className="-ml-2">
          <RiArrowLeftLine className="size-4" /> Back
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
        <TradeMetaCard trade={trade} />
        <div className="flex flex-col gap-5">
          <TradeChart trade={trade} />
          <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
            <Label htmlFor="notes" className="mb-2 block">Notes</Label>
            <Textarea
              id="notes"
              rows={4}
              placeholder="Add your thoughts about this trade…"
              defaultValue={trade.notes ?? ''}
              onBlur={(e) => updateTradeNotes(trade.id, e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

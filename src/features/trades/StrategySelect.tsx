import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTradeStore } from '@/store'
import type { Strategy } from '@/types/trade'
import { STRATEGY_LABELS } from '@/types/trade'

interface Props {
  tradeId: string
  value: Strategy
}

export function StrategySelect({ tradeId, value }: Props) {
  const updateTradeStrategy = useTradeStore((s) => s.updateTradeStrategy)

  return (
    <Select value={value} onValueChange={(v) => updateTradeStrategy(tradeId, v as Strategy)}>
      <SelectTrigger className="h-7 w-36 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.entries(STRATEGY_LABELS) as [Strategy, string][]).map(([key, label]) => (
          <SelectItem key={key} value={key} className="text-xs">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

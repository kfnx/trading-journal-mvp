export type TradeSide = 'LONG' | 'SHORT'

export type Strategy = 'none' | 'strategy_1' | 'strategy_2' | 'strategy_3'

export const STRATEGY_LABELS: Record<Strategy, string> = {
  none: 'Unclassified',
  strategy_1: 'Strategy 1',
  strategy_2: 'Strategy 2',
  strategy_3: 'Strategy 3',
}

export interface Trade {
  id: string
  symbol: string
  side: TradeSide
  entryDate: string       // ISO date "YYYY-MM-DD"
  exitDate: string
  entryTime?: string      // "HH:MM:SS"
  exitTime?: string
  entryPrice: number
  exitPrice: number
  quantity: number
  pnl: number
  pnlPercent?: number
  commission?: number
  notes?: string
  strategy: Strategy
  importedAt: string      // ISO timestamp
}

export interface RawTradeRow {
  [column: string]: string
}

export interface CsvFieldMapping {
  symbol: string
  side: string
  entryDate: string
  exitDate: string
  entryTime: string
  exitTime: string
  entryPrice: string
  exitPrice: string
  quantity: string
  pnl: string
  pnlPercent: string
  commission: string
  notes: string
}

export const REQUIRED_FIELDS: (keyof CsvFieldMapping)[] = [
  'symbol',
  'side',
  'entryDate',
  'exitDate',
  'entryPrice',
  'exitPrice',
  'quantity',
  'pnl',
]

export const OPTIONAL_FIELDS: (keyof CsvFieldMapping)[] = [
  'entryTime',
  'exitTime',
  'pnlPercent',
  'commission',
  'notes',
]

export const FIELD_LABELS: Record<keyof CsvFieldMapping, string> = {
  symbol: 'Symbol',
  side: 'Side (Long/Short)',
  entryDate: 'Entry Date',
  exitDate: 'Exit Date',
  entryTime: 'Entry Time',
  exitTime: 'Exit Time',
  entryPrice: 'Entry Price',
  exitPrice: 'Exit Price',
  quantity: 'Quantity',
  pnl: 'PnL',
  pnlPercent: 'PnL %',
  commission: 'Commission',
  notes: 'Notes',
}

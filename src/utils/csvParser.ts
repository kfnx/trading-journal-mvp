import Papa from 'papaparse'
import { v4 as uuidv4 } from 'uuid'
import type { Trade, RawTradeRow, CsvFieldMapping, TradeSide } from '@/types/trade'

export interface ParseResult {
  headers: string[]
  rows: RawTradeRow[]
  error?: string
}

export function parseCsvFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    Papa.parse<RawTradeRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: (results) => {
        const headers = results.meta.fields ?? []
        resolve({ headers, rows: results.data })
      },
      error: (err) => {
        resolve({ headers: [], rows: [], error: err.message })
      },
    })
  })
}

function parseDate(val: string): string {
  if (!val) return ''
  // Try common formats: MM/DD/YYYY, YYYY-MM-DD, DD-MM-YYYY
  const trimmed = val.trim()
  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10)
  // MM/DD/YYYY or M/D/YYYY
  const mdy = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (mdy) return `${mdy[3]}-${mdy[1].padStart(2, '0')}-${mdy[2].padStart(2, '0')}`
  // DD-MM-YYYY
  const dmy = trimmed.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/)
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, '0')}-${dmy[1].padStart(2, '0')}`
  return trimmed
}

function parseSide(val: string): TradeSide {
  const v = val.trim().toUpperCase()
  if (v === 'SHORT' || v === 'SELL' || v === 'S') return 'SHORT'
  return 'LONG'
}

function parseNum(val: string): number {
  if (!val) return 0
  return parseFloat(val.replace(/[,$%\s]/g, '')) || 0
}

export function mapRowsToTrades(rows: RawTradeRow[], mapping: CsvFieldMapping): Trade[] {
  const now = new Date().toISOString()
  return rows
    .map((row): Trade | null => {
      const symbol = row[mapping.symbol]?.trim()
      if (!symbol) return null
      return {
        id: uuidv4(),
        symbol: symbol.toUpperCase(),
        side: parseSide(row[mapping.side] ?? ''),
        entryDate: parseDate(row[mapping.entryDate] ?? ''),
        exitDate: parseDate(row[mapping.exitDate] ?? ''),
        entryTime: mapping.entryTime ? row[mapping.entryTime]?.trim() : undefined,
        exitTime: mapping.exitTime ? row[mapping.exitTime]?.trim() : undefined,
        entryPrice: parseNum(row[mapping.entryPrice] ?? ''),
        exitPrice: parseNum(row[mapping.exitPrice] ?? ''),
        quantity: parseNum(row[mapping.quantity] ?? ''),
        pnl: parseNum(row[mapping.pnl] ?? ''),
        pnlPercent: mapping.pnlPercent ? parseNum(row[mapping.pnlPercent] ?? '') : undefined,
        commission: mapping.commission ? parseNum(row[mapping.commission] ?? '') : undefined,
        notes: mapping.notes ? row[mapping.notes]?.trim() : undefined,
        strategy: 'none',
        importedAt: now,
      }
    })
    .filter((t): t is Trade => t !== null)
}

/** Auto-detect field mapping by fuzzy-matching CSV headers */
export function autoDetectMapping(headers: string[]): Partial<CsvFieldMapping> {
  const lower = headers.map((h) => h.toLowerCase())
  const find = (...keywords: string[]) =>
    headers[lower.findIndex((h) => keywords.some((k) => h.includes(k)))] ?? ''

  return {
    symbol: find('symbol', 'ticker', 'instrument', 'asset', 'pair'),
    side: find('side', 'direction', 'type', 'action', 'buy/sell'),
    entryDate: find('entry date', 'entrydate', 'open date', 'date opened', 'entry'),
    exitDate: find('exit date', 'exitdate', 'close date', 'date closed', 'exit'),
    entryTime: find('entry time', 'entrytime', 'open time'),
    exitTime: find('exit time', 'exittime', 'close time'),
    entryPrice: find('entry price', 'entryprice', 'open price', 'avg entry', 'buy price'),
    exitPrice: find('exit price', 'exitprice', 'close price', 'avg exit', 'sell price'),
    quantity: find('quantity', 'qty', 'size', 'shares', 'contracts', 'amount'),
    pnl: find('pnl', 'p&l', 'profit', 'gain', 'net pnl', 'realized'),
    pnlPercent: find('pnl%', 'pnl %', 'return %', 'return%', 'gain %'),
    commission: find('commission', 'fee', 'fees'),
    notes: find('notes', 'note', 'comment', 'remarks'),
  }
}

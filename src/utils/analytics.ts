import { format } from 'date-fns'
import type { Trade } from '@/types/trade'
import type { DaySummary, MonthSummary, TradeStats } from '@/types/analytics'

export function groupByDay(trades: Trade[]): Record<string, DaySummary> {
  const map: Record<string, DaySummary> = {}
  for (const t of trades) {
    const date = t.exitDate || t.entryDate
    if (!date) continue
    if (!map[date]) {
      map[date] = { date, totalPnl: 0, tradeCount: 0, winCount: 0, lossCount: 0 }
    }
    map[date].totalPnl += t.pnl
    map[date].tradeCount += 1
    if (t.pnl > 0) map[date].winCount += 1
    else if (t.pnl < 0) map[date].lossCount += 1
  }
  return map
}

export function groupByMonth(trades: Trade[]): MonthSummary[] {
  const map: Record<string, MonthSummary> = {}
  for (const t of trades) {
    const date = t.exitDate || t.entryDate
    if (!date) continue
    const month = date.slice(0, 7)
    if (!map[month]) {
      const d = new Date(date + 'T00:00:00')
      map[month] = {
        month,
        label: format(d, 'MMM yyyy'),
        totalPnl: 0,
        tradeCount: 0,
        winRate: 0,
      }
    }
    map[month].totalPnl += t.pnl
    map[month].tradeCount += 1
  }
  // Compute win rates
  for (const t of trades) {
    const month = (t.exitDate || t.entryDate)?.slice(0, 7)
    if (!month || !map[month]) continue
  }
  // Second pass for win rate
  const winsByMonth: Record<string, number> = {}
  for (const t of trades) {
    const month = (t.exitDate || t.entryDate)?.slice(0, 7)
    if (!month) continue
    if (t.pnl > 0) winsByMonth[month] = (winsByMonth[month] ?? 0) + 1
  }
  for (const month in map) {
    map[month].winRate =
      map[month].tradeCount > 0 ? (winsByMonth[month] ?? 0) / map[month].tradeCount : 0
  }
  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month))
}

export function computeStats(trades: Trade[]): TradeStats {
  if (trades.length === 0) {
    return {
      totalPnl: 0, winRate: 0, avgPnlPerTrade: 0, totalTrades: 0,
      totalWins: 0, totalLosses: 0, largestWin: 0, largestLoss: 0, profitFactor: 0,
    }
  }
  let totalPnl = 0, grossProfit = 0, grossLoss = 0
  let wins = 0, losses = 0, largestWin = 0, largestLoss = 0
  for (const t of trades) {
    totalPnl += t.pnl
    if (t.pnl > 0) {
      wins++
      grossProfit += t.pnl
      if (t.pnl > largestWin) largestWin = t.pnl
    } else if (t.pnl < 0) {
      losses++
      grossLoss += Math.abs(t.pnl)
      if (t.pnl < largestLoss) largestLoss = t.pnl
    }
  }
  return {
    totalPnl,
    winRate: trades.length > 0 ? wins / trades.length : 0,
    avgPnlPerTrade: totalPnl / trades.length,
    totalTrades: trades.length,
    totalWins: wins,
    totalLosses: losses,
    largestWin,
    largestLoss,
    profitFactor: grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0,
  }
}

export function buildTradeContextBlock(trades: Trade[], stats: TradeStats): string {
  const recent = [...trades]
    .sort((a, b) => (b.exitDate || b.entryDate).localeCompare(a.exitDate || a.entryDate))
    .slice(0, 20)

  const rows = recent
    .map((t) =>
      `| ${t.exitDate || t.entryDate} | ${t.symbol} | ${t.side} | ${t.entryPrice} | ${t.exitPrice} | ${t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(2)} |`
    )
    .join('\n')

  const dateRange =
    trades.length > 0
      ? `${[...trades].sort((a, b) => a.entryDate.localeCompare(b.entryDate))[0].entryDate} to ${[...trades].sort((a, b) => b.exitDate.localeCompare(a.exitDate))[0].exitDate}`
      : 'N/A'

  return `--- TRADE DATA CONTEXT ---
Total Trades: ${stats.totalTrades}
Win Rate: ${(stats.winRate * 100).toFixed(1)}%
Total PnL: ${stats.totalPnl >= 0 ? '+' : ''}${stats.totalPnl.toFixed(2)}
Avg PnL/Trade: ${stats.avgPnlPerTrade.toFixed(2)}
Largest Win: +${stats.largestWin.toFixed(2)}
Largest Loss: ${stats.largestLoss.toFixed(2)}
Profit Factor: ${isFinite(stats.profitFactor) ? stats.profitFactor.toFixed(2) : '∞'}
Date Range: ${dateRange}

Recent Trades (last 20):
| Date | Symbol | Side | Entry | Exit | PnL |
|------|--------|------|-------|------|-----|
${rows || '(no trades yet)'}
---`
}

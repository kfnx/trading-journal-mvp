export interface DaySummary {
  date: string; // "YYYY-MM-DD"
  totalPnl: number;
  tradeCount: number;
  winCount: number;
  lossCount: number;
}

export interface MonthSummary {
  month: string; // "YYYY-MM"
  label: string; // "Jan 2026"
  totalPnl: number;
  tradeCount: number;
  winRate: number; // 0–1
}

export interface TradeStats {
  totalPnl: number;
  winRate: number;
  avgPnlPerTrade: number;
  totalTrades: number;
  totalWins: number;
  totalLosses: number;
  largestWin: number;
  largestLoss: number;
  profitFactor: number;
}

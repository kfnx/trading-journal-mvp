import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Trade, Strategy } from '@/types/trade'

interface TradeState {
  trades: Trade[]
  importTrades: (incoming: Trade[]) => void
  updateTradeStrategy: (id: string, strategy: Strategy) => void
  updateTradeNotes: (id: string, notes: string) => void
  deleteTrade: (id: string) => void
  clearTrades: () => void
}

export const useTradeStore = create<TradeState>()(
  persist(
    (set) => ({
      trades: [],
      importTrades: (incoming) =>
        set((state) => ({ trades: [...state.trades, ...incoming] })),
      updateTradeStrategy: (id, strategy) =>
        set((state) => ({
          trades: state.trades.map((t) => (t.id === id ? { ...t, strategy } : t)),
        })),
      updateTradeNotes: (id, notes) =>
        set((state) => ({
          trades: state.trades.map((t) => (t.id === id ? { ...t, notes } : t)),
        })),
      deleteTrade: (id) =>
        set((state) => ({ trades: state.trades.filter((t) => t.id !== id) })),
      clearTrades: () => set({ trades: [] }),
    }),
    { name: 'tj-trades' }
  )
)

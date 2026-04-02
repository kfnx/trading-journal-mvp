import { useEffect, useRef } from 'react'
import {
  createChart,
  ColorType,
  LineStyle,
  type IChartApi,
  type ISeriesApi,
  type LineData,
  type SeriesMarker,
  type Time,
} from 'lightweight-charts'
import type { Trade } from '@/types/trade'

interface Props {
  trade: Trade
}

function buildChartData(trade: Trade): LineData<Time>[] {
  const entryTs = Math.floor(new Date(`${trade.entryDate}T${trade.entryTime ?? '09:30:00'}`).getTime() / 1000) as Time
  const exitTs  = Math.floor(new Date(`${trade.exitDate}T${trade.exitTime ?? '16:00:00'}`).getTime() / 1000) as Time

  const midPrice = (trade.entryPrice + trade.exitPrice) / 2
  const range = Math.abs(trade.exitPrice - trade.entryPrice) || midPrice * 0.005

  // Synthesise a plausible price path: entry → mid fluctuation → exit
  const points: LineData<Time>[] = []
  const steps = 8
  const startTs = (entryTs as number) - 3600 * 2
  const endTs = (exitTs as number) + 3600 * 2
  const totalDuration = endTs - startTs

  for (let i = 0; i <= steps; i++) {
    const t = (startTs + (totalDuration * i) / steps) as Time
    let price: number
    if (i === 0) {
      price = trade.entryPrice + (trade.side === 'LONG' ? -range * 0.3 : range * 0.3)
    } else if (i === steps) {
      price = trade.exitPrice + (trade.side === 'LONG' ? range * 0.2 : -range * 0.2)
    } else if (i <= 2) {
      price = trade.entryPrice
    } else if (i >= steps - 2) {
      price = trade.exitPrice
    } else {
      const progress = (i - 2) / (steps - 4)
      price = trade.entryPrice + (trade.exitPrice - trade.entryPrice) * progress
      price += (Math.random() - 0.5) * range * 0.3
    }
    points.push({ time: t, value: price })
  }

  // Deduplicate times
  const seen = new Set<number>()
  return points
    .filter((p) => {
      const t = p.time as number
      if (seen.has(t)) return false
      seen.add(t)
      return true
    })
    .sort((a, b) => (a.time as number) - (b.time as number))
}

export function TradeChart({ trade }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const isDark = document.documentElement.classList.contains('dark')

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: isDark ? '#94a3b8' : '#64748b',
        fontFamily: 'Inter, sans-serif',
        fontSize: 11,
      },
      grid: {
        vertLines: { color: isDark ? '#1e293b' : '#f1f5f9', style: LineStyle.Dashed },
        horzLines: { color: isDark ? '#1e293b' : '#f1f5f9', style: LineStyle.Dashed },
      },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: isDark ? '#334155' : '#e2e8f0' },
      timeScale: {
        borderColor: isDark ? '#334155' : '#e2e8f0',
        timeVisible: true,
        secondsVisible: false,
      },
      handleScroll: false,
      handleScale: false,
      width: containerRef.current.clientWidth,
      height: 260,
    })

    const isWin = trade.pnl >= 0
    const series = chart.addLineSeries({
      color: isWin ? '#22c55e' : '#ef4444',
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: true,
    })

    const data = buildChartData(trade)
    series.setData(data)

    // Entry & exit markers
    const entryTs = Math.floor(
      new Date(`${trade.entryDate}T${trade.entryTime ?? '09:30:00'}`).getTime() / 1000
    ) as Time
    const exitTs = Math.floor(
      new Date(`${trade.exitDate}T${trade.exitTime ?? '16:00:00'}`).getTime() / 1000
    ) as Time

    const markers: SeriesMarker<Time>[] = [
      {
        time: entryTs,
        position: trade.side === 'LONG' ? 'belowBar' : 'aboveBar',
        color: '#3b82f6',
        shape: trade.side === 'LONG' ? 'arrowUp' : 'arrowDown',
        text: `Entry ${trade.entryPrice}`,
        size: 1,
      },
      {
        time: exitTs,
        position: trade.side === 'LONG' ? 'aboveBar' : 'belowBar',
        color: isWin ? '#22c55e' : '#ef4444',
        shape: trade.side === 'LONG' ? 'arrowDown' : 'arrowUp',
        text: `Exit ${trade.exitPrice}`,
        size: 1,
      },
    ]
    series.setMarkers(markers.sort((a, b) => (a.time as number) - (b.time as number)))
    chart.timeScale().fitContent()

    chartRef.current = chart
    seriesRef.current = series

    const ro = new ResizeObserver(() => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth })
    })
    ro.observe(containerRef.current)

    return () => {
      ro.disconnect()
      chart.remove()
    }
  }, [trade])

  return (
    <div className="border border-neutral-800 bg-neutral-900 p-4">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-neutral-500">
        Price Chart — {trade.symbol}
      </p>
      <div ref={containerRef} className="w-full" />
      <p className="mt-2 text-[10px] text-neutral-400">
        Note: Chart shows a simulated price path between entry and exit. Connect a market data feed for real OHLC data.
      </p>
    </div>
  )
}

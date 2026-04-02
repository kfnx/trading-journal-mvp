import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiArrowUpLine,
  RiArrowDownLine,
  RiDeleteBinLine,
  RiArrowUpDownLine,
} from "@remixicon/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StrategySelect } from "./StrategySelect";
import { useTradeStore } from "@/store";
import { toast } from "@/components/ui/toast";
import { cn } from "@/utils/cn";
import type { Trade } from "@/types/trade";

type SortKey =
  | "date"
  | "symbol"
  | "side"
  | "entryPrice"
  | "exitPrice"
  | "quantity"
  | "pnl";
type SortDir = "asc" | "desc";

interface Props {
  trades: Trade[];
}

const COLUMNS: { label: string; key?: SortKey }[] = [
  { label: "Date", key: "date" },
  { label: "Symbol", key: "symbol" },
  { label: "Side", key: "side" },
  { label: "Entry", key: "entryPrice" },
  { label: "Exit", key: "exitPrice" },
  { label: "Qty", key: "quantity" },
  { label: "PnL", key: "pnl" },
  { label: "Strategy" },
  { label: "" },
];

function sortTrades(trades: Trade[], key: SortKey, dir: SortDir): Trade[] {
  return [...trades].sort((a, b) => {
    let va: string | number;
    let vb: string | number;
    switch (key) {
      case "date":
        va = a.exitDate || a.entryDate;
        vb = b.exitDate || b.entryDate;
        break;
      case "symbol":
        va = a.symbol;
        vb = b.symbol;
        break;
      case "side":
        va = a.side;
        vb = b.side;
        break;
      case "entryPrice":
        va = a.entryPrice;
        vb = b.entryPrice;
        break;
      case "exitPrice":
        va = a.exitPrice;
        vb = b.exitPrice;
        break;
      case "quantity":
        va = a.quantity;
        vb = b.quantity;
        break;
      case "pnl":
        va = a.pnl;
        vb = b.pnl;
        break;
    }
    if (va < vb) return dir === "asc" ? -1 : 1;
    if (va > vb) return dir === "asc" ? 1 : -1;
    return 0;
  });
}

export function TradeTable({ trades }: Props) {
  const navigate = useNavigate();
  const deleteTrade = useTradeStore((s) => s.deleteTrade);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sorted = useMemo(
    () => sortTrades(trades, sortKey, sortDir),
    [trades, sortKey, sortDir],
  );

  if (trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded border border-dashed border-neutral-200 py-16 dark:border-neutral-700">
        <p className="text-sm text-neutral-400">No trades yet.</p>
        <Button variant="stroke" size="sm" onClick={() => navigate("/import")}>
          Import CSV
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded border border-neutral-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800 bg-neutral-900">
            {COLUMNS.map(({ label, key }) => (
              <th
                key={label}
                className={cn(
                  "px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest",
                  key
                    ? "cursor-pointer select-none text-neutral-500 hover:text-neutral-200"
                    : "text-neutral-600",
                )}
                onClick={() => key && handleSort(key)}
              >
                {key ? (
                  <span className="inline-flex items-center gap-1">
                    {label}
                    {sortKey === key ? (
                      sortDir === "asc" ? (
                        <RiArrowUpLine className="size-3 text-primary-500" />
                      ) : (
                        <RiArrowDownLine className="size-3 text-primary-500" />
                      )
                    ) : (
                      <RiArrowUpDownLine className="size-3 opacity-30" />
                    )}
                  </span>
                ) : (
                  label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((trade) => (
            <tr
              key={trade.id}
              className="group cursor-pointer border-b border-neutral-800 bg-neutral-950 transition-colors hover:bg-neutral-900 last:border-0"
              onClick={() => navigate(`/trades/${trade.id}`)}
            >
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-neutral-500">
                {trade.exitDate || trade.entryDate}
              </td>
              <td className="px-4 py-3 font-semibold text-neutral-100">
                {trade.symbol}
              </td>
              <td className="px-4 py-3">
                <Badge variant={trade.side === "LONG" ? "success" : "error"}>
                  {trade.side === "LONG" ? (
                    <>
                      <RiArrowUpLine className="size-3" /> LONG
                    </>
                  ) : (
                    <>
                      <RiArrowDownLine className="size-3" /> SHORT
                    </>
                  )}
                </Badge>
              </td>
              <td className="px-4 py-3 font-mono text-xs tabular-nums text-neutral-400">
                {trade.entryPrice.toFixed(2)}
              </td>
              <td className="px-4 py-3 font-mono text-xs tabular-nums text-neutral-400">
                {trade.exitPrice.toFixed(2)}
              </td>
              <td className="px-4 py-3 font-mono text-xs tabular-nums text-neutral-500">
                {trade.quantity}
              </td>
              <td
                className={`px-4 py-3 font-mono text-sm font-medium tabular-nums ${trade.pnl >= 0 ? "text-success-500" : "text-error-500"}`}
              >
                {trade.pnl >= 0 ? "+" : ""}
                {trade.pnl.toFixed(2)}
              </td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <StrategySelect tradeId={trade.id} value={trade.strategy} />
              </td>
              <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="xs"
                  className="opacity-0 group-hover:opacity-100 text-error-500 hover:bg-error-50 hover:text-error-600"
                  onClick={() => {
                    deleteTrade(trade.id);
                    toast("Trade deleted", { variant: "default" });
                  }}
                >
                  <RiDeleteBinLine className="size-3.5" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

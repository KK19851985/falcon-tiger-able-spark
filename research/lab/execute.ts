import { START_EQUITY } from "./constants.ts";
import { SYMBOLS, type Series, type Side, type Stance, type SymbolName } from "./types.ts";

export type Fill = {
  symbol: SymbolName;
  side: Side;
  signalIndex: number;
  openedIndex: number;
  closedIndex: number;
  entry: number;
  exit: number;
  ret: number;
  pnl: number;
};

export type BookRun = {
  profit: number;
  endEquity: number;
  maxDd: number;
  fills: Fill[];
  /** Equity after each marked close, including the flat start. */
  curve: number[];
  dailyReturns: number[];
};

export type CostModel = {
  fee: number;
  slippage: number;
};

export const ZERO_COSTS: CostModel = { fee: 0, slippage: 0 };

/**
 * Round-trip return after taker fees and adverse slippage.
 * A long buys the open higher and sells the exit lower. A short does the opposite.
 */
export function netReturn(side: Side, entry: number, exit: number, costs: CostModel): number {
  const feeFactor = (1 - costs.fee) * (1 - costs.fee);
  if (side === "LONG") {
    const buy = entry * (1 + costs.slippage);
    const sell = exit * (1 - costs.slippage);
    return (sell / buy) * feeFactor - 1;
  }
  const sold = entry * (1 - costs.slippage);
  const cover = exit * (1 + costs.slippage);
  return (sold / cover) * feeFactor - 1;
}

/**
 * Desk `scoreOne` fills.
 *
 * The stance on bar i is filled at bar i+1's open. A coin holds one position.
 * If that coin is already in a trade, a different stance (the other side, or
 * flat) closes it at that open and does not open the new side on the same
 * bar. The next bar can open it. Whatever is still open is flattened at the
 * close of the window's end bar. Stake is current equity divided by the number
 * of coins, and coins are marked in BTC, ETH, SOL order, matching the desk.
 */
export function runBook(
  series: Series,
  stance: Partial<Record<SymbolName, Stance[]>>,
  from: number,
  to: number,
  costs: CostModel,
  startEquity = START_EQUITY,
): BookRun {
  const symbols = SYMBOLS.filter((symbol) => series[symbol] && stance[symbol]);
  if (symbols.length === 0) throw new Error("runBook needs at least one coin");
  const weight = 1 / symbols.length;
  const n = series[symbols[0]!]!.length;
  const endSignal = Math.min(to, n - 1);
  let equity = startEquity;
  const open = new Map<SymbolName, { side: Side; entry: number; opened: number; signal: number }>();
  const fills: Fill[] = [];
  const curve: number[] = [startEquity];

  const closeAt = (symbol: SymbolName, px: number, closedIndex: number) => {
    const pos = open.get(symbol);
    if (!pos) return;
    const ret = netReturn(pos.side, pos.entry, px, costs);
    const pnl = equity * weight * ret;
    equity += pnl;
    fills.push({
      symbol,
      side: pos.side,
      signalIndex: pos.signal,
      openedIndex: pos.opened,
      closedIndex,
      entry: pos.entry,
      exit: px,
      ret,
      pnl,
    });
    open.delete(symbol);
  };

  const liquidation = (barIndex: number) => {
    let marked = equity;
    for (const symbol of symbols) {
      const pos = open.get(symbol);
      if (!pos) continue;
      const px = series[symbol]![barIndex]!.close;
      const ret = netReturn(pos.side, pos.entry, px, costs);
      marked += marked * weight * ret;
    }
    return marked;
  };

  for (let i = from; i < endSignal; i++) {
    const fillIndex = i + 1;
    if (fillIndex >= n) break;
    for (const symbol of symbols) {
      const side = stance[symbol]![i];
      if (side !== "LONG" && side !== "SHORT" && side !== "FLAT") {
        throw new Error(`missing stance for ${symbol} at ${i}`);
      }
      const pos = open.get(symbol);
      const px = series[symbol]![fillIndex]!.open;
      if (pos) {
        if (side && side !== pos.side) closeAt(symbol, px, fillIndex);
        continue;
      }
      if (side !== "LONG" && side !== "SHORT") continue;
      open.set(symbol, { side, entry: px, opened: fillIndex, signal: i });
    }
    curve.push(liquidation(fillIndex));
  }

  const end = Math.min(endSignal, n - 1);
  for (const symbol of symbols) closeAt(symbol, series[symbol]![end]!.close, end);
  if (curve.length === 1) curve.push(equity);
  else curve[curve.length - 1] = equity;

  let peak = curve[0]!;
  let maxDd = 0;
  const dailyReturns: number[] = [];
  for (let i = 0; i < curve.length; i++) {
    const point = curve[i]!;
    if (i > 0) {
      const prev = curve[i - 1]!;
      dailyReturns.push(prev !== 0 ? point / prev - 1 : 0);
    }
    peak = Math.max(peak, point);
    maxDd = Math.max(maxDd, peak > 0 ? (peak - point) / peak : 0);
  }

  return { profit: equity - startEquity, endEquity: equity, maxDd, fills, curve, dailyReturns };
}

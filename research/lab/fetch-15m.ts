/**
 * Download confirmed OKX 15-minute candles for BTC, ETH, and SOL.
 * Uses www.okx.com and falls back to my.okx.com. Binance is not used.
 * Run once: node --experimental-strip-types research/lab/fetch-15m.ts
 * Cycles then read research/lab/data/okx-15m.json and do not refetch.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { seriesHash } from "./hash.ts";
import { PATHS } from "./paths.ts";
import { SYMBOLS, type Bar, type Series, type SymbolName } from "./types.ts";

const HOSTS = ["https://www.okx.com", "https://my.okx.com"];
const OLDEST = Date.parse("2024-11-14T00:00:00.000Z");
const WARMUP_BARS = 384;
const INST: Record<SymbolName, string> = {
  "BTC/USD": "BTC-USDT",
  "ETH/USD": "ETH-USDT",
  "SOL/USD": "SOL-USDT",
};

const outPath = path.join(path.dirname(PATHS.cache), "okx-15m.json");

type Raw = { t: number; open: number; high: number; low: number; close: number; volume: number };

async function fetchInst(symbol: SymbolName): Promise<Raw[]> {
  const inst = INST[symbol];
  let hostIndex = 0;
  const byTime = new Map<number, Raw>();
  let after: number | undefined;
  for (let page = 0; page < 900; page++) {
    const url = `${HOSTS[hostIndex]}/api/v5/market/history-candles?instId=${inst}&bar=15m&limit=100${after ? `&after=${after}` : ""}`;
    let payload: { code?: string; msg?: string; data?: string[][] };
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      payload = (await response.json()) as { code?: string; msg?: string; data?: string[][] };
      if (payload.code !== "0") throw new Error(payload.msg || payload.code || "okx error");
    } catch (error) {
      if (hostIndex === 0) {
        hostIndex = 1;
        console.error(`${symbol} switching to ${HOSTS[1]} after ${error instanceof Error ? error.message : "error"}`);
        page -= 1;
        continue;
      }
      throw error;
    }
    const rows = payload.data ?? [];
    if (rows.length === 0) break;
    let oldest = Infinity;
    for (const row of rows) {
      const t = Number(row[0]);
      if (t < oldest) oldest = t;
      if (row[8] !== "1" || byTime.has(t)) continue;
      byTime.set(t, {
        t,
        open: Number(row[1]),
        high: Number(row[2]),
        low: Number(row[3]),
        close: Number(row[4]),
        volume: Number(row[5]),
      });
    }
    if (page % 40 === 0) {
      console.error(`${symbol} page ${page} ${new Date(oldest).toISOString()} bars ${byTime.size} via ${HOSTS[hostIndex]}`);
    }
    if (oldest <= OLDEST || after === oldest) break;
    after = oldest;
    await new Promise((resolve) => setTimeout(resolve, 30));
  }
  return [...byTime.values()].filter((bar) => bar.t >= OLDEST).sort((a, b) => a.t - b.t);
}

function align(books: Record<SymbolName, Raw[]>): Series {
  const eth = new Set(books["ETH/USD"].map((bar) => bar.t));
  const sol = new Set(books["SOL/USD"].map((bar) => bar.t));
  const stamps = books["BTC/USD"].map((bar) => bar.t).filter((t) => eth.has(t) && sol.has(t));
  const wanted = new Set(stamps);
  const series = {} as Series;
  for (const symbol of SYMBOLS) {
    const rows = books[symbol].filter((bar) => wanted.has(bar.t));
    series[symbol] = rows.map((bar) => ({ ...bar }) satisfies Bar);
  }
  const btc = series["BTC/USD"];
  for (const symbol of SYMBOLS) {
    if (series[symbol].length !== btc.length) throw new Error(`${symbol} length mismatch after align`);
    for (let i = 0; i < btc.length; i++) {
      if (series[symbol][i]!.t !== btc[i]!.t) throw new Error(`${symbol} timestamp mismatch at ${i}`);
    }
  }
  return series;
}

const books = {} as Record<SymbolName, Raw[]>;
const fetched = await Promise.all(SYMBOLS.map(async (symbol) => [symbol, await fetchInst(symbol)] as const));
for (const [symbol, bars] of fetched) books[symbol] = bars;
const series = align(books);
const btc = series["BTC/USD"];
if (btc.length < 365 * 96) {
  throw new Error(`Only ${btc.length} shared 15m bars. Need at least one year.`);
}
const last = btc.length - 1;
const trainFrom = WARMUP_BARS;
const holdoutFrom = trainFrom + Math.floor((last - trainFrom) * 0.6);
const file = {
  bar: "15m",
  source: `${HOSTS[0]}/api/v5/market/history-candles?bar=15m`,
  fallback: HOSTS[1],
  fetchedAt: new Date().toISOString(),
  warmupBars: WARMUP_BARS,
  trainStart: btc[trainFrom]!.t,
  holdoutStart: btc[holdoutFrom]!.t,
  hash: seriesHash(series),
  symbols: Object.fromEntries(
    SYMBOLS.map((symbol) => [symbol, series[symbol].map((bar) => [bar.t, bar.open, bar.high, bar.low, bar.close, bar.volume])]),
  ),
};
mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(file));
console.log(
  JSON.stringify(
    {
      bars: btc.length,
      start: new Date(btc[0]!.t).toISOString(),
      end: new Date(btc[btc.length - 1]!.t).toISOString(),
      trainStart: new Date(file.trainStart).toISOString(),
      holdoutStart: new Date(file.holdoutStart).toISOString(),
      hash: file.hash,
      path: outPath,
    },
    null,
    2,
  ),
);

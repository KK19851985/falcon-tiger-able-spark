/**
 * Public OKX spot 15-minute candles for the Livermore parameter sweep.
 * No API key. Binance is probed and not used when it refuses.
 *
 * node --experimental-strip-types research/lab/fetch-livermore.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { tapeHash } from "./hash.ts";
import { COINS, INSTRUMENTS, type CoinName } from "./livermore-quantum.ts";
import { PATHS } from "./paths.ts";

const HOSTS = ["https://www.okx.com", "https://my.okx.com"];
const OLDEST = Date.parse("2025-11-15T00:00:00.000Z");
const BAR_MS = 15 * 60 * 1000;
const WARMUP_BARS = 384;
const outPath = path.join(path.dirname(PATHS.cache), "livermore-15m.json");

type Raw = { t: number; open: number; high: number; low: number; close: number; volume: number };

async function probe(url: string): Promise<string> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return `HTTP ${response.status}`;
    return "reachable";
  } catch (error) {
    return `unreachable (${error instanceof Error ? error.message : "error"})`;
  }
}

async function fetchInst(symbol: CoinName): Promise<Raw[]> {
  const inst = INSTRUMENTS[symbol];
  let hostIndex = 0;
  const byTime = new Map<number, Raw>();
  let after: number | undefined;
  for (let page = 0; page < 500; page++) {
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
      const bar = {
        t,
        open: Number(row[1]),
        high: Number(row[2]),
        low: Number(row[3]),
        close: Number(row[4]),
        volume: Number(row[5]),
      };
      if (![bar.open, bar.high, bar.low, bar.close, bar.volume].every((value) => Number.isFinite(value))) continue;
      if (bar.high < Math.max(bar.open, bar.close, bar.low) || bar.low > Math.min(bar.open, bar.close, bar.high)) continue;
      if (bar.volume < 0) continue;
      byTime.set(t, bar);
    }
    if (page % 25 === 0) {
      console.error(`${symbol} page ${page} ${new Date(oldest).toISOString()} bars ${byTime.size} via ${HOSTS[hostIndex]}`);
    }
    if (oldest <= OLDEST || after === oldest) break;
    after = oldest;
    await new Promise((resolve) => setTimeout(resolve, 40));
  }
  return [...byTime.values()].filter((bar) => bar.t >= OLDEST).sort((a, b) => a.t - b.t);
}

function missingBars(bars: Raw[]): number {
  let missing = 0;
  for (let i = 1; i < bars.length; i++) {
    const step = bars[i]!.t - bars[i - 1]!.t;
    if (step > BAR_MS) missing += Math.round(step / BAR_MS) - 1;
  }
  return missing;
}

const binanceSpot = await probe("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=15m&limit=2");
const binanceFutures = await probe("https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=15m&limit=2");
console.error(`Binance spot ${binanceSpot}. Binance USDT-M ${binanceFutures}.`);

const books = {} as Record<CoinName, Raw[]>;
for (const symbol of COINS) {
  books[symbol] = await fetchInst(symbol);
  console.error(`${symbol} ${books[symbol].length} confirmed bars, missing slots ${missingBars(books[symbol])}`);
}

let stamps = books[COINS[0]].map((bar) => bar.t);
for (const symbol of COINS.slice(1)) {
  const have = new Set(books[symbol].map((bar) => bar.t));
  stamps = stamps.filter((t) => have.has(t));
}
const wanted = new Set(stamps);
const aligned = {} as Record<CoinName, Raw[]>;
for (const symbol of COINS) {
  aligned[symbol] = books[symbol].filter((bar) => wanted.has(bar.t));
  if (aligned[symbol].length !== stamps.length) throw new Error(`${symbol} did not align`);
}
const btc = aligned["BTC/USD"];
if (btc.length < 300 * 96) throw new Error(`Only ${btc.length} shared 15m bars. Need about a year.`);
const dropped = Object.fromEntries(COINS.map((symbol) => [symbol, books[symbol].length - aligned[symbol].length]));
const gaps = Object.fromEntries(COINS.map((symbol) => [symbol, missingBars(aligned[symbol])]));
const last = btc.length - 1;
const trainFrom = WARMUP_BARS;
const holdoutFrom = trainFrom + Math.floor((last - trainFrom) * 0.6);
const hash = tapeHash(COINS.map((symbol) => ({ symbol, bars: aligned[symbol] })));
const file = {
  bar: "15m",
  source: `${HOSTS[0]}/api/v5/market/history-candles?bar=15m`,
  fallback: HOSTS[1],
  market: "OKX spot USDT. Base-asset volume. Confirmed candles only.",
  instruments: INSTRUMENTS,
  symbolsListed: [...COINS],
  oldestRequested: new Date(OLDEST).toISOString(),
  fetchedAt: new Date().toISOString(),
  binanceSpot,
  binanceFutures,
  warmupBars: WARMUP_BARS,
  trainStart: btc[trainFrom]!.t,
  holdoutStart: btc[holdoutFrom]!.t,
  hash,
  dropped,
  sharedGaps: gaps,
  symbols: Object.fromEntries(
    COINS.map((symbol) => [symbol, aligned[symbol].map((bar) => [bar.t, bar.open, bar.high, bar.low, bar.close, bar.volume])]),
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
      hash,
      dropped,
      sharedGaps: gaps,
      binanceSpot,
      binanceFutures,
      path: outPath,
    },
    null,
    2,
  ),
);

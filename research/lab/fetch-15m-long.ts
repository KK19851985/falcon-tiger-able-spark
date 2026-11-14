/**
 * Download as much confirmed OKX 15-minute history as the public API will give
 * for BTC, ETH, and SOL. Does not overwrite the shorter pinned tape.
 *
 * node --experimental-strip-types research/lab/fetch-15m-long.ts
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { gapReport } from "./gaps.ts";
import { seriesHash } from "./hash.ts";
import { PATHS } from "./paths.ts";
import { SYMBOLS, type Series, type SymbolName } from "./types.ts";

const HOSTS = ["https://www.okx.com", "https://my.okx.com"];
const WARMUP_BARS = 384;
const INST: Record<SymbolName, string> = {
  "BTC/USD": "BTC-USDT",
  "ETH/USD": "ETH-USDT",
  "SOL/USD": "SOL-USDT",
};
const outPath = path.join(path.dirname(PATHS.cache), "okx-15m-long.json");

type Raw = { t: number; open: number; high: number; low: number; close: number; volume: number };

async function fetchInst(symbol: SymbolName): Promise<{ host: string; duplicates: number; bars: Raw[] }> {
  const inst = INST[symbol];
  let hostIndex = 0;
  const byTime = new Map<number, Raw>();
  let duplicates = 0;
  let after: number | undefined;
  let hostUsed = HOSTS[0]!;
  for (let page = 0; page < 5000; page++) {
    const url = `${HOSTS[hostIndex]}/api/v5/market/history-candles?instId=${inst}&bar=15m&limit=100${after ? `&after=${after}` : ""}`;
    let payload: { code?: string; msg?: string; data?: string[][] } | null = null;
    let lastError = "";
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
        if (response.status === 429) {
          await sleep(1000 * (attempt + 1));
          continue;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        payload = (await response.json()) as { code?: string; msg?: string; data?: string[][] };
        if (payload.code !== "0") throw new Error(payload.msg || payload.code || "okx error");
        hostUsed = HOSTS[hostIndex]!;
        break;
      } catch (error) {
        lastError = error instanceof Error ? error.message : "error";
        await sleep(400 * (attempt + 1));
      }
    }
    if (!payload) {
      if (hostIndex === 0) {
        hostIndex = 1;
        console.error(`${symbol} switching to ${HOSTS[1]} after ${lastError}`);
        page -= 1;
        continue;
      }
      throw new Error(`${symbol} failed: ${lastError}`);
    }
    const rows = payload.data ?? [];
    if (rows.length === 0) break;
    let oldest = Infinity;
    let added = 0;
    for (const row of rows) {
      const t = Number(row[0]);
      if (t < oldest) oldest = t;
      if (row[8] !== "1") continue;
      if (byTime.has(t)) {
        duplicates += 1;
        continue;
      }
      byTime.set(t, {
        t,
        open: Number(row[1]),
        high: Number(row[2]),
        low: Number(row[3]),
        close: Number(row[4]),
        volume: Number(row[5]),
      });
      added++;
    }
    if (page % 100 === 0) {
      console.error(`${symbol} page ${page} ${new Date(oldest).toISOString()} bars ${byTime.size}`);
    }
    if (!Number.isFinite(oldest) || after === oldest || added === 0) break;
    after = oldest;
    await sleep(40);
  }
  return { host: hostUsed, duplicates, bars: [...byTime.values()].sort((a, b) => a.t - b.t) };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const fetched = await Promise.all(SYMBOLS.map(async (symbol) => ({ symbol, ...(await fetchInst(symbol)) })));
const coins: Record<string, ReturnType<typeof gapReport> & { instId: string; host: string }> = {};
for (const item of fetched) {
  const report = gapReport(item.bars.map((bar) => bar.t));
  coins[item.symbol] = { instId: INST[item.symbol], host: item.host, ...report, duplicates: report.duplicates + item.duplicates };
}

const sets = Object.fromEntries(fetched.map((item) => [item.symbol, new Set(item.bars.map((bar) => bar.t))])) as Record<SymbolName, Set<number>>;
const common = [...sets["BTC/USD"]].filter((t) => sets["ETH/USD"].has(t) && sets["SOL/USD"].has(t)).sort((a, b) => a - b);
const wanted = new Set(common);
const series = {} as Series;
for (const item of fetched) {
  series[item.symbol] = item.bars.filter((bar) => wanted.has(bar.t));
}
const aligned = gapReport(common);
const btc = series["BTC/USD"];
const last = btc.length - 1;
const trainFrom = Math.min(WARMUP_BARS, Math.max(0, last - 10));
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
  coins,
  aligned,
  symbols: Object.fromEntries(SYMBOLS.map((symbol) => [symbol, series[symbol].map((bar) => [bar.t, bar.open, bar.high, bar.low, bar.close, bar.volume])])),
};
mkdirSync(path.dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(file));
console.log(JSON.stringify({ coins, aligned, hash: file.hash, trainStart: new Date(file.trainStart).toISOString(), holdoutStart: new Date(file.holdoutStart).toISOString(), path: outPath }, null, 2));

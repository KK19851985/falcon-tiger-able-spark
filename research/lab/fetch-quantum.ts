/**
 * Public candles for the coins the pinned tape does not have.
 * No API key. Writes research/lab/data/quantum-public.json and exits.
 *
 * OKX spot is preferred so BNB and XRP use the same venue as the pinned
 * ETH/SOL 15-minute file. Binance is probed and used only if OKX fails.
 *
 * node --experimental-strip-types research/lab/fetch-quantum.ts
 */
import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { tapeHash } from "./hash.ts";
import { PATHS } from "./paths.ts";
import type { Bar } from "./types.ts";

const OLDEST = Date.parse("2024-11-14T00:00:00.000Z");
const OKX_HOSTS = ["https://www.okx.com", "https://my.okx.com"];
const COINS = [
  { symbol: "BNB/USD", okx: "BNB-USDT", binance: "BNBUSDT" },
  { symbol: "XRP/USD", okx: "XRP-USDT", binance: "XRPUSDT" },
] as const;

type Frame = "15m" | "1Dutc";

const outPath = path.join(path.dirname(PATHS.cache), "quantum-public.json");

async function getJson(url: string): Promise<{ status: number; body: unknown }> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(20000),
    headers: { "user-agent": "falcon-research-lab/1.0" },
  });
  const body = await response.json().catch(() => null);
  return { status: response.status, body };
}

async function probeBinance(): Promise<string> {
  const urls = [
    "https://fapi.binance.com/fapi/v1/klines?symbol=BNBUSDT&interval=1d&limit=1",
    "https://api.binance.com/api/v3/klines?symbol=BNBUSDT&interval=1d&limit=1",
  ];
  const notes: string[] = [];
  for (const url of urls) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
      notes.push(`${new URL(url).hostname} HTTP ${response.status}`);
      if (response.ok) return notes.join("; ");
    } catch (error) {
      notes.push(`${new URL(url).hostname} ${error instanceof Error ? error.message : "unreachable"}`);
    }
  }
  return notes.join("; ");
}

function rowsFromOkx(payload: { code?: string; data?: string[][] }): Bar[] {
  if (payload.code !== "0" || !Array.isArray(payload.data)) {
    throw new Error(payload.code || "okx rejected the request");
  }
  const out: Bar[] = [];
  for (const row of payload.data) {
    if (row[8] !== "1") continue;
    const t = Number(row[0]);
    if (t < OLDEST) continue;
    out.push({
      t,
      open: Number(row[1]),
      high: Number(row[2]),
      low: Number(row[3]),
      close: Number(row[4]),
      volume: Number(row[5]),
    });
  }
  return out;
}

async function fetchOkx(inst: string, bar: Frame, host: string): Promise<Bar[]> {
  const byTime = new Map<number, Bar>();
  let after: number | undefined;
  for (let page = 0; page < 1200; page++) {
    const url = `${host}/api/v5/market/history-candles?instId=${inst}&bar=${bar}&limit=100${after ? `&after=${after}` : ""}`;
    let payload: { code?: string; data?: string[][] } | null = null;
    let lastError = "no response";
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const response = await getJson(url);
        if (response.status === 429 || response.status >= 500) {
          lastError = `HTTP ${response.status}`;
          await sleep(400 * (attempt + 1));
          continue;
        }
        if (response.status !== 200) throw new Error(`HTTP ${response.status}`);
        payload = response.body as { code?: string; data?: string[][] };
        break;
      } catch (error) {
        lastError = error instanceof Error ? error.message : "error";
        await sleep(400 * (attempt + 1));
      }
    }
    if (!payload) throw new Error(`${inst} ${bar} ${lastError}`);
    const rows = rowsFromOkx(payload);
    const raw = payload.data ?? [];
    if (raw.length === 0) break;
    let oldest = Infinity;
    for (const row of raw) oldest = Math.min(oldest, Number(row[0]));
    for (const candle of rows) byTime.set(candle.t, candle);
    if (page % 50 === 0) {
      console.error(`${inst} ${bar} page ${page} ${new Date(oldest).toISOString()} confirmed ${byTime.size}`);
    }
    if (oldest <= OLDEST || after === oldest) break;
    after = oldest;
    await sleep(40);
  }
  return [...byTime.values()].sort((a, b) => a.t - b.t);
}

async function fetchOkxBook(inst: string, bar: Frame): Promise<{ host: string; bars: Bar[] }> {
  let lastError = "okx failed";
  for (const host of OKX_HOSTS) {
    try {
      const bars = await fetchOkx(inst, bar, host);
      if (bars.length === 0) throw new Error("no confirmed candles");
      return { host, bars };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "error";
      console.error(`${host} ${inst} ${bar} failed: ${lastError}`);
    }
  }
  throw new Error(lastError);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const binanceProbe = await probeBinance();
  console.error(`Binance probe: ${binanceProbe}`);
  const symbols: Record<string, { daily: number[][]; m15: number[][] }> = {};
  let source = "";
  for (const coin of COINS) {
    const daily = await fetchOkxBook(coin.okx, "1Dutc");
    const m15 = await fetchOkxBook(coin.okx, "15m");
    source = `${daily.host}/api/v5/market/history-candles`;
    symbols[coin.symbol] = {
      daily: daily.bars.map(pack),
      m15: m15.bars.map(pack),
    };
    console.error(
      `${coin.symbol} daily ${daily.bars.length} ${stamp(daily.bars)} | 15m ${m15.bars.length} ${stamp(m15.bars)}`,
    );
  }
  const books = COINS.flatMap((coin) => [
    { symbol: `${coin.symbol} 1Dutc`, bars: unpack(symbols[coin.symbol]!.daily) },
    { symbol: `${coin.symbol} 15m`, bars: unpack(symbols[coin.symbol]!.m15) },
  ]);
  const file = {
    venue: "okx-spot",
    source,
    fallback: OKX_HOSTS[1],
    binanceProbe,
    fetchedAt: new Date().toISOString(),
    oldest: new Date(OLDEST).toISOString(),
    note: "Spot USDT candles. Confirmed OKX rows only. No API key. Binance was probed and not used when OKX answered, so these coins match the pinned 15-minute tape's venue.",
    symbols,
    hash: tapeHash(books),
  };
  mkdirSync(path.dirname(outPath), { recursive: true });
  const tmp = `${outPath}.partial`;
  writeFileSync(tmp, JSON.stringify(file));
  renameSync(tmp, outPath);
  console.log(JSON.stringify({ path: outPath, hash: file.hash, binanceProbe }, null, 2));
}

function pack(bar: Bar): number[] {
  return [bar.t, bar.open, bar.high, bar.low, bar.close, bar.volume];
}

function unpack(rows: number[][]): Bar[] {
  return rows.map((row) => ({
    t: row[0]!,
    open: row[1]!,
    high: row[2]!,
    low: row[3]!,
    close: row[4]!,
    volume: row[5]!,
  }));
}

function stamp(bars: Bar[]): string {
  if (!bars.length) return "empty";
  return `${new Date(bars[0]!.t).toISOString()} → ${new Date(bars[bars.length - 1]!.t).toISOString()}`;
}

await main();

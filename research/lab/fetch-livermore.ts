/**
 * Public Binance USDT-M 15-minute klines for the Livermore parameter sweep.
 * No API key. The REST hosts return HTTP 451 here, so the bars come from
 * the public archive at data.binance.vision.
 *
 * node --experimental-strip-types research/lab/fetch-livermore.ts
 */
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { pathToFileURL } from "node:url";
import { tapeHash } from "./hash.ts";
import { BINANCE_UM, COINS, type CoinName } from "./livermore-quantum.ts";
import { PATHS } from "./paths.ts";

const exec = promisify(execFile);
const ROOT = "https://data.binance.vision/data/futures/um";
const BAR_MS = 15 * 60 * 1000;
const WARMUP_BARS = 384;
const outPath = path.join(path.dirname(PATHS.cache), "livermore-15m.json");

type Raw = { t: number; open: number; high: number; low: number; close: number; volume: number };

export function archiveMonths(): string[] {
  const out: string[] = [];
  let year = 2025;
  let month = 11;
  while (year < 2026 || (year === 2026 && month <= 10)) {
    out.push(`${year}-${String(month).padStart(2, "0")}`);
    month += 1;
    if (month === 13) {
      month = 1;
      year += 1;
    }
  }
  return out;
}

export function parseKlineCsv(text: string): Raw[] {
  const out: Raw[] = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const col = line.split(",");
    const t = Number(col[0]);
    if (!Number.isFinite(t)) continue;
    const bar = {
      t,
      open: Number(col[1]),
      high: Number(col[2]),
      low: Number(col[3]),
      close: Number(col[4]),
      volume: Number(col[5]),
    };
    if (![bar.open, bar.high, bar.low, bar.close, bar.volume].every((value) => Number.isFinite(value))) continue;
    if (bar.high + 1e-9 < Math.max(bar.open, bar.close, bar.low)) continue;
    if (bar.low - 1e-9 > Math.min(bar.open, bar.close, bar.high)) continue;
    if (bar.volume < 0) continue;
    out.push(bar);
  }
  return out;
}

async function probe(url: string): Promise<string> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    return response.ok ? "reachable" : `HTTP ${response.status}`;
  } catch (error) {
    return `unreachable (${error instanceof Error ? error.message : "error"})`;
  }
}

async function getBuffer(url: string): Promise<Buffer | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (response.status === 404) return null;
    if (!response.ok) {
      if (attempt === 2) throw new Error(`${url} HTTP ${response.status}`);
      await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
      continue;
    }
    return Buffer.from(await response.arrayBuffer());
  }
  return null;
}

async function zipCsv(url: string): Promise<Raw[] | null> {
  const zip = await getBuffer(url);
  if (!zip) return null;
  const checksum = await getBuffer(`${url}.CHECKSUM`);
  if (!checksum) throw new Error(`missing checksum for ${url}`);
  const expected = checksum.toString("utf8").trim().split(/\s+/)[0];
  const actual = createHash("sha256").update(zip).digest("hex");
  if (expected !== actual) throw new Error(`checksum mismatch for ${url}`);
  const file = path.join(tmpdir(), `livermore-${actual.slice(0, 12)}.zip`);
  writeFileSync(file, zip);
  try {
    const { stdout } = await exec("unzip", ["-p", file], { maxBuffer: 32_000_000, encoding: "buffer" });
    return parseKlineCsv(stdout.toString("utf8"));
  } finally {
    unlinkSync(file);
  }
}

function missingBars(bars: Raw[]): number {
  let missing = 0;
  for (let i = 1; i < bars.length; i++) {
    const step = bars[i]!.t - bars[i - 1]!.t;
    if (step > BAR_MS) missing += Math.round(step / BAR_MS) - 1;
  }
  return missing;
}

async function fetchSymbol(symbol: CoinName): Promise<Raw[]> {
  const inst = BINANCE_UM[symbol];
  const byTime = new Map<number, Raw>();
  const take = (rows: Raw[] | null) => {
    if (!rows) return;
    for (const bar of rows) byTime.set(bar.t, bar);
  };
  for (const month of archiveMonths()) {
    const url = `${ROOT}/monthly/klines/${inst}/15m/${inst}-15m-${month}.zip`;
    const rows = await zipCsv(url);
    if (!rows) throw new Error(`${symbol} monthly ${month} is missing`);
    take(rows);
    console.error(`${symbol} ${month} ${rows.length} bars`);
  }
  for (let day = 1; day <= 31; day++) {
    const stamp = `2026-11-${String(day).padStart(2, "0")}`;
    const url = `${ROOT}/daily/klines/${inst}/15m/${inst}-15m-${stamp}.zip`;
    const rows = await zipCsv(url);
    if (!rows) break;
    take(rows);
    console.error(`${symbol} ${stamp} ${rows.length} bars`);
  }
  return [...byTime.values()].sort((a, b) => a.t - b.t);
}

async function main(): Promise<void> {
  const binanceSpot = await probe("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=15m&limit=2");
  const binanceFutures = await probe("https://fapi.binance.com/fapi/v1/klines?symbol=BTCUSDT&interval=15m&limit=2");
  console.error(`Binance spot REST ${binanceSpot}. Binance USDT-M REST ${binanceFutures}.`);
  const books = {} as Record<CoinName, Raw[]>;
  for (const symbol of COINS) {
    books[symbol] = await fetchSymbol(symbol);
    console.error(`${symbol} ${books[symbol].length} bars, missing slots ${missingBars(books[symbol])}`);
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
    source: `${ROOT}/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip`,
    market: "Binance USDT-M perpetual. Public data.binance.vision archive. Base-asset volume. Closed 15m bars.",
    instruments: BINANCE_UM,
    symbolsListed: [...COINS],
    oldestRequested: "2025-11-01T00:00:00.000Z",
    fetchedAt: new Date().toISOString(),
    binanceSpot: `REST ${binanceSpot}`,
    binanceFutures: `REST ${binanceFutures}; klines from data.binance.vision futures/um`,
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
        binanceSpot: file.binanceSpot,
        binanceFutures: file.binanceFutures,
        path: outPath,
      },
      null,
      2,
    ),
  );
}

const invoked = process.argv[1] != null && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invoked) {
  main().catch((error: unknown) => {
    console.error("[fetch]", error instanceof Error ? error.stack : error);
    process.exit(1);
  });
}

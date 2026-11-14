import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { PATHS } from "./paths.ts";
import { PINNED_DATA_HASH } from "./constants.ts";
import { seriesHash } from "./hash.ts";
import { dayOf, mergeSymbol, type ExtCandle, type MergeResult } from "./merge.ts";
import { SYMBOLS, type DataManifest, type Series, type SymbolName } from "./types.ts";

type ClockBook = Record<string, Record<string, { t: number; open: number; high: number; low: number; close: number; volume: number }[]>>;

const INST: Record<SymbolName, { okx: string; binance: string }> = {
  "BTC/USD": { okx: "BTC-USDT", binance: "BTCUSDT" },
  "ETH/USD": { okx: "ETH-USDT", binance: "ETHUSDT" },
  "SOL/USD": { okx: "SOL-USDT", binance: "SOLUSDT" },
};

export type LoadedMarket = {
  series: Series;
  manifest: DataManifest;
  reasoning: string[];
};

type CacheFile = {
  fetchedAt: string;
  venue: "okx" | "binance";
  symbols: Record<SymbolName, ExtCandle[]>;
};

export async function loadMarket(options?: { cacheOnly?: boolean; now?: number }): Promise<LoadedMarket> {
  const now = options?.now ?? Date.now();
  if (options?.cacheOnly) return loadPinnedCache();
  const bundled = await loadBundled();
  const reasoning: string[] = [];
  const binanceNote = await probeBinance();
  reasoning.push(`Binance public daily candles: ${binanceNote}.`);
  let extension: { venue: "okx" | "binance"; symbols: Record<SymbolName, ExtCandle[]> } | null = null;
  let origin = "";
  if (binanceNote === "reachable") {
    try {
      extension = { venue: "binance", symbols: await fetchBinance(now) };
      origin = "fetched Binance spot 1d klines";
    } catch (error) {
      reasoning.push(`Binance fetch failed (${messageOf(error)}).`);
    }
  }
  if (!extension) {
    try {
      extension = { venue: "okx", symbols: await fetchOkx() };
      origin = "fetched OKX 1Dutc candles";
    } catch (error) {
      reasoning.push(`OKX fetch failed (${messageOf(error)}).`);
    }
  }
  if (!extension) {
    const cached = readCache();
    if (cached) {
      extension = { venue: cached.venue, symbols: cached.symbols };
      origin = `reused the saved ${cached.venue} cache from ${cached.fetchedAt}`;
      reasoning.push("Public candles were unreachable, so the saved extension cache was reused.");
    }
  }
  if (!extension) {
    reasoning.push("No public extension. The cycle uses the bundled daily tape only.");
    return finish(bundled, null, binanceNote, reasoning, "bundle");
  }
  const merges = {} as Record<SymbolName, MergeResult>;
  let rejected: SymbolName | null = null;
  for (const symbol of SYMBOLS) {
    merges[symbol] = mergeSymbol(bundled[symbol], extension.symbols[symbol] ?? []);
    if (!merges[symbol].accepted) rejected = symbol;
  }
  if (rejected) {
    reasoning.push(
      `${origin}, then rejected for ${rejected}: ${merges[rejected].reason}. The bundled tape is unchanged.`,
    );
    return finish(bundled, null, binanceNote, reasoning, "bundle");
  }
  const series = {} as Series;
  for (const symbol of SYMBOLS) series[symbol] = merges[symbol].bars;
  writeCache({ fetchedAt: new Date(now).toISOString(), venue: extension.venue, symbols: extension.symbols });
  reasoning.push(`${origin}. ${SYMBOLS.map((symbol) => `${symbol} ${merges[symbol].reason}`).join(" ")}`);
  const venueLabel = extension.venue === "okx" ? "OKX 1Dutc" : "Binance spot 1d";
  return finish(series, merges, binanceNote, reasoning, origin.startsWith("reused") ? `cached ${venueLabel}` : venueLabel);
}

async function loadPinnedCache(): Promise<LoadedMarket> {
  const bundled = await loadBundled();
  const cached = readCache();
  if (!cached) throw new Error("The saved OKX extension is missing, so the pinned tape cannot be rebuilt.");
  const reasoning = [
    "Binance public daily candles: HTTP 451, not used.",
    `Pinned the saved ${cached.venue} extension from ${cached.fetchedAt} so this cycle uses the same tape as the earlier cycles.`,
  ];
  const merges = {} as Record<SymbolName, MergeResult>;
  let rejected: SymbolName | null = null;
  for (const symbol of SYMBOLS) {
    merges[symbol] = mergeSymbol(bundled[symbol], cached.symbols[symbol] ?? []);
    if (!merges[symbol].accepted) rejected = symbol;
  }
  if (rejected) {
    throw new Error(`Pinned extension was rejected for ${rejected}: ${merges[rejected].reason}`);
  }
  const series = {} as Series;
  for (const symbol of SYMBOLS) series[symbol] = merges[symbol].bars;
  const venueLabel = cached.venue === "okx" ? "OKX 1Dutc" : "Binance spot 1d";
  const loaded = finish(series, merges, "HTTP 451, not used", reasoning, `cached ${venueLabel}`);
  if (loaded.manifest.hash !== PINNED_DATA_HASH) {
    throw new Error(`Pinned tape hash ${loaded.manifest.hash} does not match ${PINNED_DATA_HASH}`);
  }
  return loaded;
}

function finish(
  series: Series,
  merges: Record<SymbolName, MergeResult> | null,
  binance: string,
  reasoning: string[],
  extensionLabel: string,
): LoadedMarket {
  const btc = series["BTC/USD"];
  const replaced = merges ? unique(SYMBOLS.flatMap((symbol) => merges[symbol].replaced)) : [];
  const appended = merges ? unique(SYMBOLS.flatMap((symbol) => merges[symbol].appended)) : [];
  const manifest: DataManifest = {
    source:
      extensionLabel === "bundle"
        ? "bundled src/lib/desk/clocks.ts daily (1440)"
        : `bundled src/lib/desk/clocks.ts daily plus ${extensionLabel}`,
    binance,
    hash: seriesHash(series),
    bars: btc.length,
    start: dayOf(btc[0]!.t),
    end: dayOf(btc[btc.length - 1]!.t),
    partialReplaced: replaced,
    appended,
    overlapMedianAbsPct: {},
    volumeScale: {},
  };
  if (merges) {
    for (const symbol of SYMBOLS) {
      if (merges[symbol].medianAbsPct != null) manifest.overlapMedianAbsPct[symbol] = merges[symbol].medianAbsPct!;
      if (merges[symbol].scale != null) manifest.volumeScale[symbol] = merges[symbol].scale!;
    }
  }
  reasoning.push(
    `Series ${manifest.start} → ${manifest.end}, ${manifest.bars} daily bars, sha256 ${manifest.hash}.`,
  );
  return { series, manifest, reasoning };
}

async function loadBundled(): Promise<Series> {
  const mod = (await import("../../src/lib/desk/clocks.ts")) as { CLOCKS: ClockBook };
  const daily = mod.CLOCKS["1440"];
  const series = {} as Series;
  for (const symbol of SYMBOLS) {
    const bars = daily?.[symbol];
    if (!bars?.length) throw new Error(`bundled daily tape is missing ${symbol}`);
    series[symbol] = bars.map((bar) => ({
      t: bar.t,
      open: bar.open,
      high: bar.high,
      low: bar.low,
      close: bar.close,
      volume: bar.volume,
    }));
  }
  const stamp = series["BTC/USD"].map((bar) => bar.t).join(",");
  for (const symbol of SYMBOLS) {
    if (series[symbol].map((bar) => bar.t).join(",") !== stamp) {
      throw new Error(`${symbol} daily timestamps do not match BTC`);
    }
  }
  return series;
}

async function probeBinance(): Promise<string> {
  try {
    const response = await fetch(
      "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=2",
      { signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) return `HTTP ${response.status}, not used`;
    return "reachable";
  } catch (error) {
    return `unreachable (${messageOf(error)}), not used`;
  }
}

async function fetchOkx(): Promise<Record<SymbolName, ExtCandle[]>> {
  const out = {} as Record<SymbolName, ExtCandle[]>;
  for (const symbol of SYMBOLS) {
    const inst = INST[symbol].okx;
    const url = `https://www.okx.com/api/v5/market/candles?instId=${inst}&bar=1Dutc&limit=100`;
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`OKX ${inst} HTTP ${response.status}`);
    const body = (await response.json()) as { code?: string; data?: string[][] };
    if (body.code !== "0" || !Array.isArray(body.data)) throw new Error(`OKX ${inst} rejected the request`);
    out[symbol] = body.data.map((row) => ({
      t: Number(row[0]),
      open: Number(row[1]),
      high: Number(row[2]),
      low: Number(row[3]),
      close: Number(row[4]),
      volume: Number(row[5]),
      confirmed: row[8] === "1",
    }));
  }
  return out;
}

async function fetchBinance(now: number): Promise<Record<SymbolName, ExtCandle[]>> {
  const out = {} as Record<SymbolName, ExtCandle[]>;
  for (const symbol of SYMBOLS) {
    const pair = INST[symbol].binance;
    const url = `https://api.binance.com/api/v3/klines?symbol=${pair}&interval=1d&limit=100`;
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Binance ${pair} HTTP ${response.status}`);
    const rows = (await response.json()) as (string | number)[][];
    if (!Array.isArray(rows)) throw new Error(`Binance ${pair} returned an unexpected body`);
    out[symbol] = rows.map((row) => ({
      t: Number(row[0]),
      open: Number(row[1]),
      high: Number(row[2]),
      low: Number(row[3]),
      close: Number(row[4]),
      volume: Number(row[5]),
      confirmed: Number(row[6]) < now,
    }));
  }
  return out;
}

function readCache(): CacheFile | null {
  if (!existsSync(PATHS.cache)) return null;
  const parsed = JSON.parse(readFileSync(PATHS.cache, "utf8")) as CacheFile;
  if (!parsed?.symbols || (parsed.venue !== "okx" && parsed.venue !== "binance")) return null;
  return parsed;
}

function writeCache(cache: CacheFile) {
  mkdirSync(path.dirname(PATHS.cache), { recursive: true });
  writeFileSync(PATHS.cache, `${JSON.stringify(cache)}\n`);
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : "unknown error";
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

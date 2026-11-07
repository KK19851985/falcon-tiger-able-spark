export type Bar = {
  t: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Side = "LONG" | "SHORT" | "NEUTRAL";
export type Mode = "crude" | "pivot" | "stack";

export type TechRead = {
  signal: Side;
  confidence: number;
  kind: string;
  volumeRatio: number;
  histogram: number;
  reasoning: string;
};

export type Gate = { pass: boolean; reason: string };

export type Decision = {
  symbol: string;
  bar: number;
  time: number;
  price: number;
  signal: Side;
  confidence: number;
  kind: string;
  volumeRatio: number;
  risk: string;
  skeptic: string;
  action: "PAPER" | "REJECT";
  why: string;
};

export type ClosedTrade = {
  symbol: string;
  side: Exclude<Side, "NEUTRAL">;
  entry: number;
  exit: number;
  r: number;
  bars: number;
  win: boolean;
};

export type ModeReport = {
  mode: Mode;
  trades: ClosedTrade[];
  vetoes: number;
  signals: number;
  equity: { i: number; equity: number }[];
  decisions: Decision[];
  winRate: number;
  avgR: number;
  returnPct: number;
  maxDd: number;
};

const SYMBOLS = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "ARB/USDT"] as const;
export const DESK_SYMBOLS = SYMBOLS;

const START = {
  "BTC/USDT": 67200,
  "ETH/USDT": 3480,
  "SOL/USDT": 168,
  "ARB/USDT": 0.82,
} as const;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildSeries(symbol: (typeof SYMBOLS)[number], bars = 2200): Bar[] {
  const rand = mulberry32(
    symbol.split("").reduce((n, c) => n + c.charCodeAt(0) * 17, 9041),
  );
  const out: Bar[] = [];
  let price: number = START[symbol];
  let drift = 0.00004;
  const start = Date.UTC(2026, 4, 1);
  for (let i = 0; i < bars; i++) {
    if (i % 180 === 0) drift = (rand() - 0.48) * 0.00035;
    const shock = rand() < 0.012 ? (rand() - 0.5) * 0.018 : 0;
    const ret = drift + (rand() - 0.5) * 0.0042 + shock;
    const open = price;
    const close = Math.max(0.01, open * (1 + ret));
    const wick = Math.abs(ret) * open * (0.4 + rand());
    const high = Math.max(open, close) + wick * rand();
    const low = Math.min(open, close) - wick * rand();
    const volume = (0.6 + rand() * 1.4) * (1 + Math.min(4, Math.abs(ret) * 180));
    out.push({
      t: start + i * 15 * 60 * 1000,
      open,
      high,
      low,
      close,
      volume,
    });
    price = close;
  }
  return out;
}

function ema(values: number[], span: number): number[] {
  const k = 2 / (span + 1);
  const out = new Array<number>(values.length);
  let prev = values[0] ?? 0;
  for (let i = 0; i < values.length; i++) {
    prev = i === 0 ? values[i]! : values[i]! * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

type Pack = {
  bars: Bar[];
  macd: number[];
  signal: number[];
  hist: number[];
  volSma: number[];
  atr: number[];
  emaSlow: number[];
};

function pack(bars: Bar[]): Pack {
  const close = bars.map((b) => b.close);
  const line = ema(close, 12).map((v, i) => v - ema(close, 26)[i]!);
  const sig = ema(line, 9);
  const hist = line.map((v, i) => v - sig[i]!);
  const emaSlow = ema(close, 80);
  const volSma = bars.map((_, i) => {
    if (i < 19) return bars[i]!.volume;
    let s = 0;
    for (let k = i - 19; k <= i; k++) s += bars[k]!.volume;
    return s / 20;
  });
  const atr = bars.map((b, i) => {
    const prev = i === 0 ? b.close : bars[i - 1]!.close;
    const tr = Math.max(b.high - b.low, Math.abs(b.high - prev), Math.abs(b.low - prev));
    if (i === 0) return tr;
    return atrPrev(bars, i, tr);
  });
  function atrPrev(src: Bar[], i: number, tr: number) {
    // Wilder-ish rolling mean of 14
    const from = Math.max(0, i - 13);
    let s = 0;
    let n = 0;
    for (let k = from; k <= i; k++) {
      const p = k === 0 ? src[0]!.close : src[k - 1]!.close;
      s += Math.max(
        src[k]!.high - src[k]!.low,
        Math.abs(src[k]!.high - p),
        Math.abs(src[k]!.low - p),
      );
      n++;
    }
    return s / n || tr;
  }
  return { bars, macd: line, signal: sig, hist, volSma, atr, emaSlow };
}

type Pivot = { i: number; price: number; hist: number };

function pivots(p: Pack, kind: "low" | "high", left = 3, right = 3): Pivot[] {
  const out: Pivot[] = [];
  const n = p.bars.length;
  for (let i = left; i < n - right; i++) {
    let ok = true;
    for (let k = i - left; k <= i + right; k++) {
      if (k === i) continue;
      const a = kind === "low" ? p.bars[k]!.low : p.bars[k]!.high;
      const b = kind === "low" ? p.bars[i]!.low : p.bars[i]!.high;
      if (kind === "low" ? a < b : a > b) ok = false;
    }
    if (ok) {
      out.push({
        i,
        price: kind === "low" ? p.bars[i]!.low : p.bars[i]!.high,
        hist: p.hist[i]!,
      });
    }
  }
  return out;
}

function volRatio(p: Pack, i: number) {
  const base = p.volSma[i] || 1;
  return p.bars[i]!.volume / base;
}

export function crudeAt(p: Pack, i: number): TechRead {
  if (i < 30) return neutral(p, i, "warming up");
  const lows = p.bars.slice(i - 5, i).map((b) => b.low);
  const highs = p.bars.slice(i - 5, i).map((b) => b.high);
  const hists = p.hist.slice(i - 5, i);
  const vr = volRatio(p, i);
  const crossUp = p.macd[i - 1]! <= p.signal[i - 1]! && p.macd[i]! > p.signal[i]!;
  const crossDn = p.macd[i - 1]! >= p.signal[i - 1]! && p.macd[i]! < p.signal[i]!;
  const bullConv =
    p.bars[i]!.low < Math.min(...lows) && p.hist[i]! > Math.min(...hists) && p.hist[i]! < 0;
  const bearConv =
    p.bars[i]!.high > Math.max(...highs) && p.hist[i]! < Math.max(...hists) && p.hist[i]! > 0;
  let signal: Side = "NEUTRAL";
  let kind = "none";
  if ((crossUp || bullConv) && vr > 1.25) {
    signal = "LONG";
    kind = bullConv ? "5-bar convergence" : "MACD cross";
  } else if ((crossDn || bearConv) && vr > 1.25) {
    signal = "SHORT";
    kind = bearConv ? "5-bar convergence" : "MACD cross";
  }
  const confidence =
    signal === "NEUTRAL" ? 0 : Math.min(100, 40 + (vr > 1.5 ? 25 : 10) + (bullConv || bearConv ? 20 : 0));
  return {
    signal,
    confidence,
    kind,
    volumeRatio: vr,
    histogram: p.hist[i]!,
    reasoning:
      signal === "NEUTRAL"
        ? "No 5-bar confluence"
        : `${kind}, volume ${vr.toFixed(2)}×`,
  };
}

function confirmedDivergence(list: Pivot[], i: number, right: number, side: "bull" | "bear") {
  const ready = list.filter((pv) => pv.i + right <= i);
  if (ready.length < 2) return null;
  const b = ready[ready.length - 1]!;
  if (b.i + right !== i) return null;
  const a = ready[ready.length - 2]!;
  if (side === "bull" && b.price < a.price && b.hist > a.hist && b.hist < 0) return { a, b };
  if (side === "bear" && b.price > a.price && b.hist < a.hist && b.hist > 0) return { a, b };
  return null;
}

export function pivotAt(p: Pack, lows: Pivot[], highs: Pivot[], i: number): TechRead {
  if (i < 40) return neutral(p, i, "warming up");
  const vr = volRatio(p, i);
  const bull = confirmedDivergence(lows, i, 3, "bull");
  const bear = confirmedDivergence(highs, i, 3, "bear");
  const histUp = p.hist[i]! > p.hist[i - 1]!;
  let signal: Side = "NEUTRAL";
  let kind = "none";
  if (bull && vr > 1.25) {
    signal = "LONG";
    kind = "regular bullish divergence";
  } else if (bear && vr > 1.25) {
    signal = "SHORT";
    kind = "regular bearish divergence";
  }
  let confidence = 0;
  if (signal !== "NEUTRAL") {
    confidence += 50;
    confidence += vr >= 1.5 ? 25 : 10;
    if ((signal === "LONG" && histUp) || (signal === "SHORT" && !histUp)) confidence += 15;
  }
  return {
    signal,
    confidence: Math.min(100, confidence),
    kind,
    volumeRatio: vr,
    histogram: p.hist[i]!,
    reasoning:
      signal === "NEUTRAL"
        ? "No confirmed pivot divergence"
        : `${kind} · vol ${vr.toFixed(2)}× · hist ${p.hist[i]!.toFixed(4)}`,
  };
}

function pHistUp(p: Pack, i: number) {
  return p.hist[i]! > p.hist[i - 1]!;
}

function neutral(p: Pack, i: number, why: string): TechRead {
  return {
    signal: "NEUTRAL",
    confidence: 0,
    kind: "none",
    volumeRatio: volRatio(p, i),
    histogram: p.hist[i] ?? 0,
    reasoning: why,
  };
}

type Open = {
  symbol: string;
  side: Exclude<Side, "NEUTRAL">;
  entry: number;
  stop: number;
  target: number;
  risk: number;
  opened: number;
};

type RunOpts = {
  from: number;
  to: number;
  stopAtr: number;
  targetR: number;
  maxHold: number;
  trend: boolean;
};

const BASE_OPTS: RunOpts = {
  from: 40,
  to: Number.POSITIVE_INFINITY,
  stopAtr: 1.4,
  targetR: 2,
  maxHold: 16,
  trend: false,
};

function stopTarget(p: Pack, i: number, side: Exclude<Side, "NEUTRAL">, entry: number, opts: RunOpts) {
  const atr = p.atr[i]! || entry * 0.004;
  const risk = Math.max(atr * opts.stopAtr, entry * 0.0025);
  if (side === "LONG") return { stop: entry - risk, target: entry + risk * opts.targetR, risk };
  return { stop: entry + risk, target: entry - risk * opts.targetR, risk };
}

export function runMode(
  books: Record<string, Pack>,
  piv: Record<string, { lows: Pivot[]; highs: Pivot[] }>,
  mode: Mode,
  opts: RunOpts = BASE_OPTS,
): ModeReport {
  const symbols = Object.keys(books);
  const n = books[symbols[0]!]!.bars.length;
  let equity = 10_000;
  let peak = equity;
  let maxDd = 0;
  let dayStart = equity;
  let dayPnl = 0;
  let dayIndex = -1;
  const cooldown = new Map<string, number>();
  const open: Open[] = [];
  const trades: ClosedTrade[] = [];
  const decisions: Decision[] = [];
  const equityCurve: { i: number; equity: number }[] = [{ i: opts.from, equity }];
  let vetoes = 0;
  let signals = 0;

  const mark = (px: number, pos: Open) =>
    pos.side === "LONG" ? (px - pos.entry) / pos.risk : (pos.entry - px) / pos.risk;

  const end = Math.min(opts.to, n - 1);
  for (let i = opts.from; i < end; i++) {
    const day = Math.floor(i / 96);
    if (day !== dayIndex) {
      dayIndex = day;
      dayStart = equity;
      dayPnl = 0;
    }

    for (let k = open.length - 1; k >= 0; k--) {
      const pos = open[k]!;
      const bar = books[pos.symbol]!.bars[i]!;
      let exitPx: number | null = null;
      if (pos.side === "LONG") {
        if (bar.low <= pos.stop) exitPx = pos.stop;
        else if (bar.high >= pos.target) exitPx = pos.target;
      } else if (bar.high >= pos.stop) exitPx = pos.stop;
      else if (bar.low <= pos.target) exitPx = pos.target;
      if (exitPx == null && i - pos.opened >= opts.maxHold) exitPx = bar.close;
      if (exitPx != null) {
        const r = mark(exitPx, pos);
        const pnl = equity * 0.01 * r; // 1% risk per trade
        equity += pnl;
        dayPnl += pnl;
        trades.push({
          symbol: pos.symbol,
          side: pos.side,
          entry: pos.entry,
          exit: exitPx,
          r,
          bars: i - pos.opened,
          win: r > 0,
        });
        open.splice(k, 1);
        cooldown.set(pos.symbol, i + 8);
      }
    }

    for (const symbol of symbols) {
      const book = books[symbol]!;
      const tech =
        mode === "crude"
          ? crudeAt(book, i)
          : pivotAt(book, piv[symbol]!.lows, piv[symbol]!.highs, i);
      if (tech.signal === "NEUTRAL") continue;
      if (opts.trend) {
        const withTrend =
          tech.signal === "LONG"
            ? book.bars[i]!.close >= book.emaSlow[i]!
            : book.bars[i]!.close <= book.emaSlow[i]!;
        if (!withTrend) continue;
      }
      signals++;

      const cd = cooldown.get(symbol) ?? 0;
      const occupied = open.some((o) => o.symbol === symbol);
      let riskPass = true;
      let riskReason = "size 1% · stop 1.4 ATR · target 2R";
      if (occupied) {
        riskPass = false;
        riskReason = "already in this market";
      } else if (dayPnl < -dayStart * 0.02) {
        riskPass = false;
        riskReason = "daily loss limit −2%";
      } else if (open.length >= 3) {
        riskPass = false;
        riskReason = "max 3 open positions";
      } else if (i < cd) {
        riskPass = false;
        riskReason = "cooldown";
      }

      const histAgrees =
        (tech.signal === "LONG" && pHistUp(books[symbol]!, i)) ||
        (tech.signal === "SHORT" && !pHistUp(books[symbol]!, i));
      const objections: string[] = [];
      if (tech.confidence < 80) objections.push(`confidence ${tech.confidence} < 80`);
      if (tech.volumeRatio < 1.7) objections.push(`volume ${tech.volumeRatio.toFixed(2)}× < 1.7`);
      if (!histAgrees) objections.push("histogram not expanding with price");
      if (!tech.kind.includes("divergence") && !tech.kind.includes("convergence"))
        objections.push("no structural divergence");
      const kill = objections.length >= 2;
      const skepticReason = kill ? objections.join("; ") : "clean enough to paper";

      let action: Decision["action"] = "PAPER";
      let why = tech.reasoning;
      if (occupied || i < cd) {
        action = "REJECT";
        why = occupied ? "already in this market" : "cooldown";
      } else if (mode === "stack" && !riskPass) {
        action = "REJECT";
        why = riskReason;
        vetoes++;
      } else if (mode === "stack" && kill) {
        action = "REJECT";
        why = skepticReason;
        vetoes++;
      }

      const price = book.bars[i]!.close;
      if (decisions.length < 4000) {
        decisions.push({
          symbol,
          bar: i,
          time: book.bars[i]!.t,
          price,
          signal: tech.signal,
          confidence: tech.confidence,
          kind: tech.kind,
          volumeRatio: tech.volumeRatio,
          risk: mode === "stack" ? riskReason : "bypassed",
          skeptic: mode === "stack" ? skepticReason : "bypassed",
          action,
          why,
        });
      }

      if (action === "PAPER") {
        const fill = book.bars[i + 1]!.open;
        const { stop, target, risk } = stopTarget(book, i, tech.signal, fill, opts);
        open.push({
          symbol,
          side: tech.signal,
          entry: fill,
          stop,
          target,
          risk,
          opened: i + 1,
        });
      }
    }

    if (i % 8 === 0) {
      peak = Math.max(peak, equity);
      maxDd = Math.max(maxDd, peak > 0 ? (peak - equity) / peak : 0);
      equityCurve.push({ i, equity });
    }
  }

  const wins = trades.filter((t) => t.win).length;
  const avgR = trades.length ? trades.reduce((s, t) => s + t.r, 0) / trades.length : 0;
  return {
    mode,
    trades,
    vetoes,
    signals,
    equity: equityCurve,
    decisions,
    winRate: trades.length ? wins / trades.length : 0,
    avgR,
    returnPct: (equity / 10_000 - 1) * 100,
    maxDd,
  };
}

export type LabRow = {
  name: string;
  stopAtr: number;
  targetR: number;
  maxHold: number;
  trend: boolean;
  trainTrades: number;
  trainAvgR: number;
  trainDd: number;
  score: number;
};

export type LabReport = {
  cause: string;
  splitBar: number;
  adopted: boolean;
  verdict: string;
  winner: LabRow;
  test: { trades: number; avgR: number; returnPct: number; maxDd: number };
  baselineTest: { trades: number; avgR: number; returnPct: number; maxDd: number };
  rows: LabRow[];
};

function sliceScore(report: ModeReport) {
  if (report.trades.length < 6) return -1_000;
  return report.avgR - report.maxDd;
}

export function learn(
  books: Record<string, Pack>,
  piv: Record<string, { lows: Pivot[]; highs: Pivot[] }>,
): LabReport {
  const n = books[Object.keys(books)[0]!]!.bars.length;
  const split = Math.floor(n * 0.6);
  const grid: Omit<LabRow, "trainTrades" | "trainAvgR" | "trainDd" | "score">[] = [];
  for (const stopAtr of [1.2, 2.2]) {
    for (const targetR of [1.5, 2.5]) {
      for (const maxHold of [12, 28]) {
        for (const trend of [false, true]) {
          grid.push({
            name: `${trend ? "with trend" : "both ways"} · stop ${stopAtr} ATR · ${targetR}R · ${maxHold} bars`,
            stopAtr,
            targetR,
            maxHold,
            trend,
          });
        }
      }
    }
  }

  const rows: LabRow[] = grid.map((g) => {
    const train = runMode(books, piv, "pivot", {
      from: 80,
      to: split,
      stopAtr: g.stopAtr,
      targetR: g.targetR,
      maxHold: g.maxHold,
      trend: g.trend,
    });
    return {
      ...g,
      trainTrades: train.trades.length,
      trainAvgR: train.avgR,
      trainDd: train.maxDd,
      score: sliceScore(train),
    };
  });
  rows.sort((a, b) => b.score - a.score);
  const winner = rows[0]!;
  const testOpts = {
    from: split,
    to: n,
    stopAtr: winner.stopAtr,
    targetR: winner.targetR,
    maxHold: winner.maxHold,
    trend: winner.trend,
  };
  const test = runMode(books, piv, "pivot", testOpts);
  const baseline = runMode(books, piv, "pivot", { ...BASE_OPTS, from: split, to: n });
  const beat =
    test.trades.length >= 4 && test.avgR > baseline.avgR && test.avgR > 0;
  return {
    cause:
      "Losing trades were stopped by noise or taken against the slow average. The lab only changes stop width, target, hold time, and trend alignment.",
    splitBar: split,
    adopted: beat,
    verdict: beat
      ? "Kept. The locked rule made money on the bars it never saw."
      : "Rejected. The train winner did not beat the old rule on unseen bars, so the desk does not switch.",
    winner,
    test: {
      trades: test.trades.length,
      avgR: test.avgR,
      returnPct: test.returnPct,
      maxDd: test.maxDd,
    },
    baselineTest: {
      trades: baseline.trades.length,
      avgR: baseline.avgR,
      returnPct: baseline.returnPct,
      maxDd: baseline.maxDd,
    },
    rows,
  };
}

export type DeskSnapshot = {
  series: Record<string, Bar[]>;
  reports: Record<Mode, ModeReport>;
  latest: Record<string, { tech: TechRead; risk: string; skeptic: string; action: string }>;
  lab: LabReport;
};

let cached: DeskSnapshot | null = null;

export function getDesk(): DeskSnapshot {
  if (cached) return cached;
  const series: Record<string, Bar[]> = {};
  const books: Record<string, Pack> = {};
  const piv: Record<string, { lows: Pivot[]; highs: Pivot[] }> = {};
  for (const s of SYMBOLS) {
    series[s] = buildSeries(s);
    books[s] = pack(series[s]);
    piv[s] = { lows: pivots(books[s], "low"), highs: pivots(books[s], "high") };
  }
  const reports = {
    crude: runMode(books, piv, "crude"),
    pivot: runMode(books, piv, "pivot"),
    stack: runMode(books, piv, "stack"),
  };
  const latest: DeskSnapshot["latest"] = {};
  const last = series[SYMBOLS[0]!]!.length - 4;
  for (const s of SYMBOLS) {
    const tech = pivotAt(books[s]!, piv[s]!.lows, piv[s]!.highs, last);
    const risk =
      tech.signal === "NEUTRAL" ? "no order" : "size 1% · daily loss −2% · max 3";
    const skeptic =
      tech.confidence >= 75 && tech.volumeRatio >= 1.5
        ? "let it through"
        : tech.signal === "NEUTRAL"
          ? "nothing to attack"
          : "confidence or volume too thin";
    latest[s] = {
      tech,
      risk,
      skeptic,
      action: tech.signal !== "NEUTRAL" && tech.confidence >= 80 && tech.volumeRatio >= 1.7 ? "PAPER" : "REJECT",
    };
  }
  const lab = learn(books, piv);
  cached = { series, reports, latest, lab };
  return cached;
}

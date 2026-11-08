import { CLOCKS } from "./clocks.ts";
import { HISTORY } from "./history.ts";

type Bar = {
  t: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type VproTape = {
  clock: string;
  span: string;
  bars: number;
  returnPct: number;
  hold: number;
  trades: number;
  winRate: number;
  avgTrade: number;
  maxDd: number;
};

export type VproCall = {
  symbol: string;
  side: "LONG" | "SHORT" | "FLAT";
  since: string;
  wave: string;
};

export type DailyFill = {
  symbol: string;
  side: "LONG" | "SHORT";
  opened: string;
  closed: string;
  entry: number;
  exit: number;
  pnl: number;
};

export type DailyBook = {
  span: string;
  start: number;
  equity: number;
  profit: number;
  openPnl: number;
  maxDd: number;
  trades: number;
  winRate: number;
  hold: number;
  positions: { symbol: string; side: "LONG" | "SHORT"; since: string; entry: number; mark: number; pnl: number }[];
  recent: DailyFill[];
  curve: { i: number; equity: number; hold: number }[];
};

export type VproQuote = {
  symbol: string;
  last: number;
  changePct: number;
};

export type LearnStep = {
  change: string;
  trainWin: number;
  trainProfit: number;
  kept: boolean;
};

export type LearnReport = {
  adopted: boolean;
  mistake: string;
  verdict: string;
  rule: string;
  active: Rule;
  train: { winRate: number; profit: number; trades: number; losses: number };
  unseen: { winRate: number; profit: number; trades: number; losses: number };
  unseenBase: { winRate: number; profit: number; trades: number; losses: number };
  steps: LearnStep[];
};

export type VproReport = {
  note: string;
  rule: string;
  tapes: VproTape[];
  calls: VproCall[];
  curve: { i: number; equity: number; hold: number }[];
  daily: DailyBook;
  quotes: VproQuote[];
  learn: LearnReport;
};

export const VPRO_SETTINGS = {
  macd: 34,
  signal: 9,
  waveA: 5,
  waveB: 25,
  waveC: 50,
  waveSma: 4,
  trend: false,
  cutoff: 10,
};

const WAVE_A = VPRO_SETTINGS.waveA;
const WAVE_B = VPRO_SETTINGS.waveB;
const WAVE_C = VPRO_SETTINGS.waveC;

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

function smma(values: number[], len: number): number[] {
  const out = new Array<number>(values.length).fill(Number.NaN);
  let acc = 0;
  for (let i = 0; i < values.length; i++) {
    if (i < len) {
      acc += values[i]!;
      if (i === len - 1) out[i] = acc / len;
    } else {
      out[i] = (out[i - 1]! * (len - 1) + values[i]!) / len;
    }
  }
  return out;
}

function smaAt(values: number[], i: number, len: number): number {
  if (i < len - 1) return Number.NaN;
  let acc = 0;
  for (let k = i - len + 1; k <= i; k++) acc += values[k]!;
  return acc / len;
}

function zlema(values: number[], len: number): number[] {
  const first = ema(values, len);
  const second = ema(first, len);
  return first.map((v, i) => v + (v - second[i]!));
}

function impulse(bars: Bar[], len: number): number[] {
  const hi = smma(bars.map((b) => b.high), len);
  const lo = smma(bars.map((b) => b.low), len);
  const mid = zlema(
    bars.map((b) => (b.high + b.low + b.close) / 3),
    len,
  );
  return mid.map((m, i) => {
    if (!Number.isFinite(hi[i])) return 0;
    if (m > hi[i]!) return m - hi[i]!;
    if (m < lo[i]!) return m - lo[i]!;
    return 0;
  });
}

function signWord(n: number) {
  if (n > 0) return "up";
  if (n < 0) return "down";
  return "flat";
}

function sma(values: number[], len: number): number[] {
  return values.map((_, i) => smaAt(values, i, len));
}

export function vproLines(bars: Bar[]): { md: number[]; sig: number[] } {
  const md = impulse(bars, VPRO_SETTINGS.macd);
  const sig = md.map((_, i) => smaAt(md, i, VPRO_SETTINGS.signal));
  return { md, sig };
}

export function vproStance(bars: Bar[]): ("LONG" | "SHORT" | "FLAT")[] {
  const { md, sig } = vproLines(bars);
  const out: ("LONG" | "SHORT" | "FLAT")[] = new Array(bars.length);
  let side: "LONG" | "SHORT" | "FLAT" = "FLAT";
  for (let i = 0; i < bars.length; i++) {
    if (i > 0 && Number.isFinite(sig[i]) && Number.isFinite(sig[i - 1])) {
      if (md[i - 1]! <= sig[i - 1]! && md[i]! > sig[i]!) side = "LONG";
      else if (md[i - 1]! >= sig[i - 1]! && md[i]! < sig[i]!) side = "SHORT";
    }
    out[i] = side;
  }
  return out;
}

type Rule = {
  macd: number;
  signal: number;
  waveGate: boolean;
  exitOnWave: boolean;
};

const BASE_RULE: Rule = { macd: 34, signal: 9, waveGate: false, exitOnWave: false };

function describe(rule: Rule) {
  const gate = rule.waveGate ? "Wave C must agree with the cross." : "Wave C does not filter the cross.";
  const exit = rule.exitOnWave
    ? "A position is closed when wave C turns against it."
    : "A position is held until the opposite cross.";
  return `V-Pro length ${rule.macd}, signal ${rule.signal}. Waves ${WAVE_A}, ${WAVE_B}, ${WAVE_C}, each averaged over ${VPRO_SETTINGS.waveSma}. Trend and exhaustion coloring is off, so the cutoff of ${VPRO_SETTINGS.cutoff} is not used. Long on a cross up, short on a cross down. ${gate} ${exit}`;
}

function pack(bars: Bar[], rule: Rule = BASE_RULE) {
  const md = impulse(bars, rule.macd);
  const sig = md.map((_, i) => smaAt(md, i, rule.signal));
  const waveA = sma(impulse(bars, WAVE_A), VPRO_SETTINGS.waveSma);
  const waveB = sma(impulse(bars, WAVE_B), VPRO_SETTINGS.waveSma);
  const waveC = sma(impulse(bars, WAVE_C), VPRO_SETTINGS.waveSma);
  return { bars, md, sig, waveA, waveB, waveC };
}

type Score = {
  profit: number;
  winRate: number;
  trades: number;
  wins: number;
  losses: number;
  againstLosses: number;
  againstWins: number;
};

function simulate(
  source: Record<string, Bar[]>,
  rule: Rule,
  signalFrom: number,
  signalTo: number,
  flatten: "close" | "mark",
) {
  const symbols = Object.keys(source);
  const books = Object.fromEntries(symbols.map((s) => [s, pack(source[s]!, rule)]));
  const n = books[symbols[0]!]!.bars.length;
  const end = n - 1;
  const weight = 1 / symbols.length;
  const start = 10_000;
  let equity = start;
  let peak = equity;
  let maxDd = 0;
  const open = new Map<string, { side: "LONG" | "SHORT"; entry: number; opened: number; against: boolean }>();
  const fills: DailyFill[] = [];
  let wins = 0;
  let againstLosses = 0;
  let againstWins = 0;
  const curve: { i: number; equity: number }[] = [];
  const day = (t: number) => new Date(t).toISOString().slice(0, 10);

  const closeAt = (symbol: string, px: number, closed: string) => {
    const pos = open.get(symbol);
    if (!pos) return;
    const ret = pos.side === "LONG" ? px / pos.entry - 1 : pos.entry / px - 1;
    const pnl = equity * weight * ret;
    equity += pnl;
    if (pnl > 0) {
      wins++;
      if (pos.against) againstWins++;
    } else if (pos.against) againstLosses++;
    fills.push({
      symbol,
      side: pos.side,
      opened: day(books[symbol]!.bars[pos.opened]!.t),
      closed,
      entry: pos.entry,
      exit: px,
      pnl,
    });
    open.delete(symbol);
  };

  for (let i = signalFrom; i < signalTo; i++) {
    for (const symbol of symbols) {
      const p = books[symbol]!;
      if (!Number.isFinite(p.sig[i]!) || !Number.isFinite(p.sig[i - 1]!)) continue;
      const up = p.md[i - 1]! <= p.sig[i - 1]! && p.md[i]! > p.sig[i]!;
      const down = p.md[i - 1]! >= p.sig[i - 1]! && p.md[i]! < p.sig[i]!;
      const fill = p.bars[i + 1]!.open;
      const closed = day(p.bars[i + 1]!.t);
      const held = open.get(symbol);
      if (up || down) {
        const side = up ? "LONG" : "SHORT";
        const allowed = !rule.waveGate || (side === "LONG" ? p.waveC[i]! > 0 : p.waveC[i]! < 0);
        if (held && held.side !== side) closeAt(symbol, fill, closed);
        if (allowed && open.get(symbol)?.side !== side) {
          open.set(symbol, {
            side,
            entry: fill,
            opened: i + 1,
            against: side === "LONG" ? p.waveC[i]! <= 0 : p.waveC[i]! >= 0,
          });
        }
      } else if (rule.exitOnWave && held) {
        const against = held.side === "LONG" ? p.waveC[i]! < 0 : p.waveC[i]! > 0;
        if (against) closeAt(symbol, fill, closed);
      }
    }
    peak = Math.max(peak, equity);
    maxDd = Math.max(maxDd, peak > 0 ? (peak - equity) / peak : 0);
    curve.push({ i, equity });
  }

  if (flatten === "close") {
    for (const symbol of symbols) closeAt(symbol, books[symbol]!.bars[Math.min(signalTo, end)]!.close, day(books[symbol]!.bars[Math.min(signalTo, end)]!.t));
  }

  const positions = symbols.flatMap((symbol) => {
    const pos = open.get(symbol);
    if (!pos) return [];
    const mark = books[symbol]!.bars[end]!.close;
    const ret = pos.side === "LONG" ? mark / pos.entry - 1 : pos.entry / mark - 1;
    return [
      {
        symbol,
        side: pos.side,
        since: day(books[symbol]!.bars[pos.opened]!.t),
        entry: pos.entry,
        mark,
        pnl: equity * weight * ret,
      },
    ];
  });
  const openPnl = positions.reduce((a, p) => a + p.pnl, 0);
  const marked = equity + (flatten === "mark" ? openPnl : 0);
  const losses = fills.length - wins;
  const score: Score = {
    profit: marked - start,
    winRate: fills.length ? wins / fills.length : 0,
    trades: fills.length,
    wins,
    losses,
    againstLosses,
    againstWins,
  };
  return { score, fills, positions, openPnl, maxDd, equity: marked, curve, books, end, symbols };
}

function better(next: Score, prev: Score) {
  return next.trades >= 8 && next.winRate > prev.winRate && next.profit > prev.profit;
}

function sameRule(a: Rule, b: Rule) {
  return a.macd === b.macd && a.signal === b.signal && a.waveGate === b.waveGate && a.exitOnWave === b.exitOnWave;
}

function neighbors(rule: Rule) {
  const ideas: { change: string; rule: Rule }[] = [];
  for (const signal of [5, 7, 9, 12, 15, 20]) {
    if (signal !== rule.signal) ideas.push({ change: `Signal ${rule.signal} to ${signal}`, rule: { ...rule, signal } });
  }
  for (const macd of [21, 26, 34, 40, 50]) {
    if (macd !== rule.macd) ideas.push({ change: `MACD length ${rule.macd} to ${macd}`, rule: { ...rule, macd } });
  }
  ideas.push(
    rule.waveGate
      ? { change: "Drop the wave C filter", rule: { ...rule, waveGate: false } }
      : { change: "Require wave C to agree", rule: { ...rule, waveGate: true } },
  );
  ideas.push(
    rule.exitOnWave
      ? { change: "Hold until the opposite cross", rule: { ...rule, exitOnWave: false } }
      : { change: "Exit when wave C turns against the trade", rule: { ...rule, exitOnWave: true } },
  );
  return ideas;
}

function selfImprove(source: Record<string, Bar[]>): LearnReport {
  const n = source[Object.keys(source)[0]!]!.length;
  const from = 80;
  const last = n - 1;
  const split = from + Math.floor((last - from) * 0.6);
  const window = (rule: Rule, start: number, stop: number) => simulate(source, rule, start, stop, "close").score;
  const trainOf = (rule: Rule) => window(rule, from, split - 1);
  const testOf = (rule: Rule) => window(rule, split, last);

  const baseTrain = trainOf(BASE_RULE);
  const losers = Math.max(1, baseTrain.losses);
  const wins = Math.max(1, baseTrain.wins);
  const mistake = `On the learning days, ${baseTrain.againstLosses} of ${baseTrain.losses} losses were taken against wave C, against ${baseTrain.againstWins} of ${baseTrain.wins} winners. The self-improving function then changes one setting at a time and keeps a change only when those same days win more often and make more money.`;

  let current = BASE_RULE;
  let currentTrain = baseTrain;
  const steps: LearnStep[] = [];
  let tried = 0;
  for (let round = 0; round < 4; round++) {
    let best: { change: string; rule: Rule; train: Score } | null = null;
    for (const idea of neighbors(current)) {
      if (sameRule(idea.rule, current)) continue;
      tried++;
      const train = trainOf(idea.rule);
      if (!better(train, currentTrain)) continue;
      if (
        !best ||
        train.winRate > best.train.winRate ||
        (train.winRate === best.train.winRate && train.profit > best.train.profit)
      ) {
        best = { change: idea.change, rule: idea.rule, train };
      }
    }
    if (!best) break;
    steps.push({ change: best.change, trainWin: best.train.winRate, trainProfit: best.train.profit, kept: true });
    current = best.rule;
    currentTrain = best.train;
  }
  if (steps.length === 0) {
    steps.push({
      change: "No one-variable change beat the published cross",
      trainWin: baseTrain.winRate,
      trainProfit: baseTrain.profit,
      kept: false,
    });
  }

  const unseen = testOf(current);
  const unseenBase = testOf(BASE_RULE);
  const gap = unseen.profit - unseenBase.profit;
  const moreWinners = unseen.wins > unseen.losses;
  const adopted =
    !sameRule(current, BASE_RULE) &&
    unseen.trades >= 8 &&
    unseen.winRate > unseenBase.winRate &&
    gap >= 500 &&
    moreWinners;
  const verdict = adopted
    ? `After ${tried} one-variable tries, the unseen days had more winners than losers and at least $500 more profit. The daily book switches.`
    : moreWinners
      ? `After ${tried} one-variable tries, the later days made $${Math.round(gap)} more than the old cross. That is not enough to switch.`
      : `After ${tried} one-variable tries, the later days still lost more trades than they won (${unseen.losses} losses, ${unseen.wins} wins). Profit gap versus the old cross was $${Math.round(gap)}. The daily book stays on the published cross.`;
  return {
    adopted,
    mistake,
    verdict,
    rule: describe(adopted ? current : BASE_RULE),
    active: adopted ? current : BASE_RULE,
    train: { winRate: baseTrain.winRate, profit: baseTrain.profit, trades: baseTrain.trades, losses: baseTrain.losses },
    unseen: {
      winRate: unseen.winRate,
      profit: unseen.profit,
      trades: unseen.trades,
      losses: unseen.losses,
    },
    unseenBase: {
      winRate: unseenBase.winRate,
      profit: unseenBase.profit,
      trades: unseenBase.trades,
      losses: unseenBase.losses,
    },
    steps,
  };
}

function runBook(source: Record<string, Bar[]>) {
  const symbols = Object.keys(source);
  const n = source[symbols[0]!]!.length;
  const from = 80;
  const ran = simulate(source, BASE_RULE, from, n - 1, "close");
  const end = ran.end;
  let holdSum = 0;
  for (const s of symbols) holdSum += source[s]![end]!.close / source[s]![from]!.close - 1;
  const step = Math.max(1, Math.ceil(ran.curve.length / 180));
  const retSum = ran.fills.reduce((a, f) => a + (f.side === "LONG" ? f.exit / f.entry - 1 : f.entry / f.exit - 1), 0);
  const calls: VproCall[] = symbols.map((symbol) => {
    const pos = ran.positions.find((row) => row.symbol === symbol);
    const packed = ran.books[symbol]!;
    const last = Math.max(from, n - 2);
    return {
      symbol,
      side: pos?.side ?? "FLAT",
      since: pos?.since ?? "—",
      wave: `A ${signWord(packed.waveA[last]!)} · B ${signWord(packed.waveB[last]!)} · C ${signWord(packed.waveC[last]!)}`,
    };
  });
  return {
    from: source[symbols[0]!]![from]!.t,
    to: source[symbols[0]!]![end]!.t,
    bars: n,
    hold: (holdSum / symbols.length) * 100,
    returnPct: (ran.equity / 10_000 - 1) * 100,
    trades: ran.score.trades,
    winRate: ran.score.winRate,
    avgTrade: ran.score.trades ? (retSum / ran.score.trades) * 100 : 0,
    maxDd: ran.maxDd,
    calls,
    curve: ran.curve.filter((_, i) => i % step === 0).map((pt) => {
      let acc = 0;
      for (const s of symbols) acc += source[s]![Math.min(pt.i, end)]!.close / source[s]![from]!.close;
      return { i: pt.i, equity: Math.round(pt.equity), hold: Math.round((acc / symbols.length) * 10_000) };
    }),
  };
}

function runDaily(source: Record<string, Bar[]>, rule: Rule): DailyBook {
  const symbols = Object.keys(source);
  const n = source[symbols[0]!]!.length;
  const from = 80;
  const ran = simulate(source, rule, from, n - 1, "mark");
  const end = ran.end;
  let holdSum = 0;
  for (const s of symbols) holdSum += source[s]![end]!.close / source[s]![from]!.close - 1;
  const step = Math.max(1, Math.ceil(Math.max(1, ran.curve.length) / 180));
  const day = (t: number) => new Date(t).toISOString().slice(0, 10);
  return {
    span: `${day(source[symbols[0]!]![from]!.t)} → ${day(source[symbols[0]!]![end]!.t)}`,
    start: 10_000,
    equity: ran.equity,
    profit: ran.score.profit,
    openPnl: ran.openPnl,
    maxDd: ran.maxDd,
    trades: ran.score.trades,
    winRate: ran.score.winRate,
    hold: (holdSum / symbols.length) * 100,
    positions: ran.positions,
    recent: ran.fills.slice(-8).reverse(),
    curve: ran.curve.filter((_, i) => i % step === 0).map((pt) => {
      let acc = 0;
      for (const s of symbols) acc += source[s]![Math.min(pt.i, end)]!.close / source[s]![from]!.close;
      return { i: pt.i, equity: Math.round(pt.equity), hold: Math.round((acc / symbols.length) * 10_000) };
    }),
  };
}

export function runVpro(): VproReport {
  const books4h = HISTORY as unknown as Record<string, Bar[]>;
  const clocks = CLOCKS as unknown as Record<string, Record<string, Bar[]>>;
  const dailyBars = clocks["1440"]!;
  const learned = selfImprove(dailyBars);
  const sets = [
    ["15m", clocks["15"]!],
    ["1h", clocks["60"]!],
    ["4h", books4h],
    ["1d", dailyBars],
  ] as const;
  const ran = sets.map(([clock, books]) => ({ clock, result: runBook(books) }));
  const day = (t: number) => new Date(t).toISOString().slice(0, 10);
  const four = ran.find((r) => r.clock === "4h")!;
  return {
    note: "One function, selfImprove, changes a single V-Pro setting at a time on the older daily bars. It rewrites the daily book only when the later days have more winning trades than losing ones and at least $500 more profit.",
    rule: learned.rule,
    tapes: ran.map(({ clock, result }) => ({
      clock,
      span: `${day(result.from)} → ${day(result.to)}`,
      bars: result.bars,
      returnPct: result.returnPct,
      hold: result.hold,
      trades: result.trades,
      winRate: result.winRate,
      avgTrade: result.avgTrade,
      maxDd: result.maxDd,
    })),
    calls: four.result.calls,
    curve: four.result.curve,
    daily: runDaily(dailyBars, learned.active),
    quotes: Object.entries(dailyBars).map(([symbol, bars]) => {
      const last = bars[bars.length - 1]!;
      const prev = bars[bars.length - 2]!;
      return { symbol, last: last.close, changePct: (last.close / prev.close - 1) * 100 };
    }),
    learn: learned,
  };
}

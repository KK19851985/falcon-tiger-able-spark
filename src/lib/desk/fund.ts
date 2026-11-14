import { CLOCKS } from "./clocks.ts";
import m5 from "./m5.json" with { type: "json" };
import { runVpro, vproLines, vproStance } from "./vpro.ts";

type Bar = {
  t: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type Side = "LONG" | "SHORT";

export type Trial = {
  name: string;
  trainProfit: number;
  testProfit: number;
  testWin: number;
  testWins: number;
  testLosses: number;
  testTrades: number;
  hold: number;
  verdict: "LIVE" | "KILLED";
  reason: string;
  tested: boolean;
  fullProfit: number;
  fullWins: number;
  fullTrades: number;
};

export type AgentCard = {
  id: string;
  name: string;
  library: string;
  state: "working" | "idle" | "blocked";
  brief: string;
};

export type LedgerRow = {
  symbol: string;
  side: Side;
  opened: string;
  closed: string;
  pnl: number;
  strategy: string;
};

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  ema20: number;
  ema50: number;
  vpro: number;
  vproSignal: number;
  pair: "LONG" | "SHORT" | "FLAT";
};

export type Frame = {
  id: "5m" | "15m" | "1h" | "1D";
  label: string;
  span: string;
  candles: Record<string, Candle[]>;
};

export type FundReport = {
  mission: string;
  rules: string[];
  agents: AgentCard[];
  trials: Trial[];
  champion: string | null;
  equity: number;
  proof: number;
  positions: { symbol: string; side: Side | "FLAT"; since: string; weight: number }[];
  ledger: LedgerRow[];
  quotes: { symbol: string; last: number; changePct: number }[];
  candles: Record<string, Candle[]>;
  frames: Frame[];
  signals: { symbol: string; rsi: number; macd: number; emaFast: number; emaSlow: number }[];
  jobs: { name: string; every: string }[];
  audit: { sharpe: number; maxDd: number; profitFactor: number; note: string };
};

function ema(values: number[], span: number) {
  const k = 2 / (span + 1);
  const out = new Array<number>(values.length);
  let prev = values[0] ?? 0;
  for (let i = 0; i < values.length; i++) {
    prev = i === 0 ? values[i]! : values[i]! * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

function sma(values: number[], span: number) {
  const out = new Array<number>(values.length).fill(Number.NaN);
  let acc = 0;
  for (let i = 0; i < values.length; i++) {
    acc += values[i]!;
    if (i >= span) acc -= values[i - span]!;
    if (i >= span - 1) out[i] = acc / span;
  }
  return out;
}

function rsi(closes: number[], span = 14) {
  const out = new Array<number>(closes.length).fill(50);
  let gain = 0;
  let loss = 0;
  for (let i = 1; i < closes.length; i++) {
    const diff = closes[i]! - closes[i - 1]!;
    const up = Math.max(diff, 0);
    const down = Math.max(-diff, 0);
    if (i <= span) {
      gain += up;
      loss += down;
      if (i === span) out[i] = loss === 0 ? 100 : 100 - 100 / (1 + gain / span / (loss / span));
    } else {
      gain = (gain * (span - 1) + up) / span;
      loss = (loss * (span - 1) + down) / span;
      out[i] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
    }
  }
  return out;
}

function day(t: number) {
  return new Date(t).toISOString().slice(0, 10);
}

function scoreWindow(
  source: Record<string, Bar[]>,
  decide: (symbol: string, i: number) => Side | "FLAT" | null,
  from: number,
  to: number,
) {
  const symbols = Object.keys(source);
  const weight = 1 / symbols.length;
  let equity = 10_000;
  const open = new Map<string, { side: Side; entry: number; opened: number }>();
  const fills: LedgerRow[] = [];
  let wins = 0;
  const rets: number[] = [];
  let peak = equity;
  let maxDd = 0;
  const closeAt = (symbol: string, px: number, closed: string) => {
    const pos = open.get(symbol);
    if (!pos) return;
    const ret = pos.side === "LONG" ? px / pos.entry - 1 : pos.entry / px - 1;
    const pnl = equity * weight * ret;
    equity += pnl;
    rets.push(ret);
    if (pnl > 0) wins++;
    fills.push({
      symbol,
      side: pos.side,
      opened: day(source[symbol]![pos.opened]!.t),
      closed,
      pnl,
      strategy: "",
    });
    open.delete(symbol);
  };
  for (let i = from; i < to; i++) {
    for (const symbol of symbols) {
      const side = decide(symbol, i);
      if (side === "FLAT") {
        const bar = source[symbol]![i + 1];
        if (bar) closeAt(symbol, bar.open, day(bar.t));
        continue;
      }
      if (!side) continue;
      const held = open.get(symbol);
      if (held?.side === side) continue;
      const bar = source[symbol]![i + 1];
      if (!bar) continue;
      if (held) closeAt(symbol, bar.open, day(bar.t));
      open.set(symbol, { side, entry: bar.open, opened: i + 1 });
    }
    peak = Math.max(peak, equity);
    maxDd = Math.max(maxDd, peak > 0 ? (peak - equity) / peak : 0);
  }
  const end = Math.min(to, source[symbols[0]!]!.length - 1);
  for (const symbol of symbols) closeAt(symbol, source[symbol]![end]!.close, day(source[symbol]![end]!.t));
  const mean = rets.reduce((a, b) => a + b, 0) / Math.max(1, rets.length);
  const variance = rets.length > 1 ? rets.reduce((a, b) => a + (b - mean) ** 2, 0) / (rets.length - 1) : 0;
  const sharpe = variance > 0 ? (mean / Math.sqrt(variance)) * Math.sqrt(rets.length) : 0;
  const gains = fills.filter((row) => row.pnl > 0).reduce((a, row) => a + row.pnl, 0);
  const pains = Math.abs(fills.filter((row) => row.pnl < 0).reduce((a, row) => a + row.pnl, 0));
  return {
    profit: equity - 10_000,
    trades: fills.length,
    wins,
    losses: fills.length - wins,
    winRate: fills.length ? wins / fills.length : 0,
    maxDd,
    sharpe,
    profitFactor: pains === 0 ? gains : gains / pains,
    fills,
  };
}

function scoreOne(
  source: Record<string, Bar[]>,
  decide: (symbol: string, i: number) => Side | "FLAT" | null,
  from: number,
  to: number,
) {
  const symbols = ["BTC/USD", "ETH/USD", "SOL/USD"].filter((symbol) => source[symbol]);
  const weight = 1 / symbols.length;
  let equity = 10_000;
  const fills: LedgerRow[] = [];
  let wins = 0;
  const rets: number[] = [];
  let peak = equity;
  let maxDd = 0;
  const held = new Map<string, { side: Side; entry: number; opened: number }>();
  const closeAt = (symbol: string, px: number, closed: string) => {
    const pos = held.get(symbol);
    if (!pos) return;
    const ret = pos.side === "LONG" ? px / pos.entry - 1 : pos.entry / px - 1;
    const pnl = equity * weight * ret;
    equity += pnl;
    rets.push(ret);
    if (pnl > 0) wins++;
    fills.push({
      symbol,
      side: pos.side,
      opened: day(source[symbol]![pos.opened]!.t),
      closed,
      pnl,
      strategy: "",
    });
    held.delete(symbol);
  };
  for (let i = from; i < to; i++) {
    for (const symbol of symbols) {
      const side = decide(symbol, i);
      const pos = held.get(symbol);
      const bar = source[symbol]![i + 1];
      if (!bar) continue;
      if (pos) {
        if (side && side !== pos.side) closeAt(symbol, bar.open, day(bar.t));
        continue;
      }
      if (side !== "LONG" && side !== "SHORT") continue;
      held.set(symbol, { side, entry: bar.open, opened: i + 1 });
    }
    peak = Math.max(peak, equity);
    maxDd = Math.max(maxDd, peak > 0 ? (peak - equity) / peak : 0);
  }
  const end = Math.min(to, source[symbols[0]!]!.length - 1);
  for (const symbol of symbols) closeAt(symbol, source[symbol]![end]!.close, day(source[symbol]![end]!.t));
  const mean = rets.reduce((a, b) => a + b, 0) / Math.max(1, rets.length);
  const variance = rets.length > 1 ? rets.reduce((a, b) => a + (b - mean) ** 2, 0) / (rets.length - 1) : 0;
  const sharpe = variance > 0 ? (mean / Math.sqrt(variance)) * Math.sqrt(rets.length) : 0;
  const gains = fills.filter((row) => row.pnl > 0).reduce((a, row) => a + row.pnl, 0);
  const pains = Math.abs(fills.filter((row) => row.pnl < 0).reduce((a, row) => a + row.pnl, 0));
  return {
    profit: equity - 10_000,
    trades: fills.length,
    wins,
    losses: fills.length - wins,
    winRate: fills.length ? wins / fills.length : 0,
    maxDd,
    sharpe,
    profitFactor: pains === 0 ? gains : gains / pains,
    fills,
  };
}

function holdProfit(source: Record<string, Bar[]>, from: number, to: number) {
  const symbols = Object.keys(source);
  const end = Math.min(to, source[symbols[0]!]!.length - 1);
  let sum = 0;
  for (const symbol of symbols) sum += source[symbol]![end]!.close / source[symbol]![from]!.close - 1;
  return (sum / symbols.length) * 10_000;
}

function judge(
  name: string,
  trainProfit: number,
  test: { profit: number; trades: number; wins: number; losses: number; winRate: number },
  hold: number,
): Trial {
  const reasons: string[] = [];
  if (trainProfit <= 0) reasons.push("lost money while it was being fit");
  if (test.trades < 8) reasons.push("fewer than 8 unseen trades");
  if (test.profit <= 0) reasons.push("lost money on unseen days");
  if (test.wins <= test.losses) reasons.push("more losses than wins on unseen days");
  if (test.profit <= hold) reasons.push("did not beat buy and hold on unseen days");
  if (trainProfit > 1_000 && test.profit < trainProfit * 0.25) reasons.push("the edge collapsed outside the fit");
  const verdict = reasons.length ? "KILLED" : "LIVE";
  return {
    name,
    trainProfit,
    testProfit: test.profit,
    testWin: test.winRate,
    testWins: test.wins,
    testLosses: test.losses,
    testTrades: test.trades,
    hold,
    verdict,
    reason: verdict === "LIVE" ? "Survived the unseen window." : reasons[0]!,
    tested: true,
    fullProfit: 0,
    fullWins: 0,
    fullTrades: 0,
  };
}

function packFrame(book: Record<string, Bar[]>, take: number): Record<string, Candle[]> {
  return Object.fromEntries(
    Object.keys(book).map((symbol) => {
      const bars = book[symbol]!;
      const closes = bars.map((bar) => bar.close);
      const fast = ema(closes, 20);
      const slow = ema(closes, 30);
      const { md, sig } = vproLines(bars);
      const start = Math.max(0, bars.length - take);
      let emaSide: "LONG" | "SHORT" | "FLAT" = "FLAT";
      let impulseSide: "LONG" | "SHORT" | "FLAT" = "FLAT";
      const rows: Candle[] = [];
      for (let i = 0; i < bars.length; i++) {
        const bar = bars[i]!;
        if (i > 0 && fast[i - 1]! <= slow[i - 1]! && fast[i]! > slow[i]!) emaSide = "LONG";
        else if (i > 0 && fast[i - 1]! >= slow[i - 1]! && fast[i]! < slow[i]!) emaSide = "SHORT";
        if (i > 0 && Number.isFinite(sig[i]) && Number.isFinite(sig[i - 1])) {
          if (md[i - 1]! <= sig[i - 1]! && md[i]! > sig[i]!) impulseSide = "LONG";
          else if (md[i - 1]! >= sig[i - 1]! && md[i]! < sig[i]!) impulseSide = "SHORT";
        }
        if (i < start) continue;
        let pair: "LONG" | "SHORT" | "FLAT" = emaSide !== "FLAT" && emaSide === impulseSide ? emaSide : "FLAT";
        if (pair === "SHORT" && bar.close > fast[i]!) pair = "FLAT";
        rows.push({
          time: Math.floor(bar.t / 1000),
          open: bar.open,
          high: bar.high,
          low: bar.low,
          close: bar.close,
          ema20: fast[i]!,
          ema50: slow[i]!,
          vpro: md[i]!,
          vproSignal: sig[i]!,
          pair,
        });
      }
      return [symbol, rows];
    }),
  );
}

function frameSpan(candles: Record<string, Candle[]>) {
  const bars = Object.values(candles)[0] ?? [];
  if (bars.length < 2) return "";
  const start = new Date(bars[0]!.time * 1000).toISOString().slice(0, 10);
  const end = new Date(bars[bars.length - 1]!.time * 1000).toISOString().slice(0, 10);
  return `${start} to ${end}`;
}

export function runFund(): FundReport {
  const clocks = CLOCKS as unknown as Record<string, Record<string, Bar[]>>;
  const source = clocks["1440"]!;
  const symbols = Object.keys(source);
  const n = source[symbols[0]!]!.length;
  const from = 80;
  const last = n - 1;
  const split = from + Math.floor((last - from) * 0.6);
  const lines = Object.fromEntries(
    symbols.map((symbol) => {
      const closes = source[symbol]!.map((bar) => bar.close);
      const fast = ema(closes, 8);
      const slow = ema(closes, 30);
      const macd = fast.map((value, i) => value - slow[i]!);
      const rsiLine = rsi(closes, 8);
      return [
        symbol,
        {
          macd,
          signal: ema(macd, 10),
          rsi: rsiLine,
          rsiSignal: sma(rsiLine, 26),
          trendFast: ema(closes, 20),
          trendSlow: ema(closes, 30),
        },
      ];
    }),
  ) as Record<string, { macd: number[]; signal: number[]; rsi: number[]; rsiSignal: number[]; trendFast: number[]; trendSlow: number[] }>;

  const cross = (symbol: string, i: number, a: number[], b: number[]): Side | null => {
    if (i < 1) return null;
    if (a[i - 1]! <= b[i - 1]! && a[i]! > b[i]!) return "LONG";
    if (a[i - 1]! >= b[i - 1]! && a[i]! < b[i]!) return "SHORT";
    return null;
  };

  const specs: { name: string; decide: (symbol: string, i: number) => Side | null }[] = [
    { name: "MACD 8/30/10", decide: (symbol, i) => cross(symbol, i, lines[symbol]!.macd, lines[symbol]!.signal) },
    { name: "EMA 20/30", decide: (symbol, i) => cross(symbol, i, lines[symbol]!.trendFast, lines[symbol]!.trendSlow) },
    { name: "RSI 8/26", decide: (symbol, i) => cross(symbol, i, lines[symbol]!.rsi, lines[symbol]!.rsiSignal) },
    {
      name: "20-day breakout",
      decide: (symbol, i) => {
        if (i < 20) return null;
        let hi = -Infinity;
        let lo = Infinity;
        for (let k = i - 20; k < i; k++) {
          hi = Math.max(hi, source[symbol]![k]!.high);
          lo = Math.min(lo, source[symbol]![k]!.low);
        }
        const close = source[symbol]![i]!.close;
        if (close > hi) return "LONG";
        if (close < lo) return "SHORT";
        return null;
      },
    },
  ];

  const hold = holdProfit(source, split, last);
  const trials = specs.map((spec) => {
    const train = scoreWindow(source, spec.decide, from, split - 1);
    const test = scoreWindow(source, spec.decide, split, last);
    const full = scoreWindow(source, spec.decide, from, last);
    const trial = judge(spec.name, train.profit, test, hold);
    trial.fullProfit = full.profit;
    trial.fullWins = full.wins;
    trial.fullTrades = full.trades;
    return { trial, test, train };
  });

  const desk = runVpro();
  const vproTestWins = desk.learn.unseenBase.trades - desk.learn.unseenBase.losses;
  const vproTrainWins = desk.learn.train.trades - desk.learn.train.losses;
  const vproTrial = judge(
    "V-Pro cross 34/9",
    desk.learn.train.profit,
    {
      profit: desk.learn.unseenBase.profit,
      trades: desk.learn.unseenBase.trades,
      wins: vproTestWins,
      losses: desk.learn.unseenBase.losses,
      winRate: desk.learn.unseenBase.winRate,
    },
    hold,
  );

  type Stance = Side | "FLAT";
  const labels: Record<string, string> = {
    "V-Pro cross 34/9": "V-Pro",
    "MACD 8/30/10": "MACD",
    "EMA 20/30": "EMA 20/30",
    "RSI 8/26": "RSI",
    "20-day breakout": "Breakout",
  };
  const stance: Record<string, Record<string, Stance[]>> = {
    "V-Pro cross 34/9": Object.fromEntries(symbols.map((symbol) => [symbol, vproStance(source[symbol]!)] as const)),
  };
  for (const spec of specs) {
    stance[spec.name] = Object.fromEntries(
      symbols.map((symbol) => {
        const out: Stance[] = [];
        let side: Stance = "FLAT";
        for (let i = 0; i < n; i++) {
          const next = spec.decide(symbol, i);
          if (next === "LONG" || next === "SHORT") side = next;
          out.push(side);
        }
        return [symbol, out] as const;
      }),
    );
  }
  const vproFull = scoreWindow(source, (symbol, i) => stance["V-Pro cross 34/9"]![symbol]![i]!, from, last);
  vproTrial.fullProfit = vproFull.profit;
  vproTrial.fullWins = vproFull.wins;
  vproTrial.fullTrades = vproFull.trades;

  const parents = new Map<string, { profit: number; winRate: number }>([
    [
      "V-Pro cross 34/9",
      {
        profit: desk.learn.train.profit,
        winRate: desk.learn.train.trades ? vproTrainWins / desk.learn.train.trades : 0,
      },
    ],
    ...trials.map((row) => [row.trial.name, { profit: row.train.profit, winRate: row.train.winRate }] as const),
  ]);
  const singleNames = Object.keys(labels);
  const vote = (group: string[], symbol: string, i: number, mode: "all" | "majority"): Side | "FLAT" => {
    const states = group.map((name) => stance[name]![symbol]![i]!);
    if (mode === "all") {
      const first = states[0]!;
      return first !== "FLAT" && states.every((item) => item === first) ? first : "FLAT";
    }
    let long = 0;
    let short = 0;
    for (const item of states) {
      if (item === "LONG") long += 1;
      else if (item === "SHORT") short += 1;
    }
    const need = Math.floor(group.length / 2) + 1;
    if (long >= need) return "LONG";
    if (short >= need) return "SHORT";
    return "FLAT";
  };
  const combos: { name: string; group: string[]; mode: "all" | "majority"; forward: boolean }[] = [];
  for (let a = 0; a < singleNames.length; a++) {
    for (let b = a + 1; b < singleNames.length; b++) {
      const left = singleNames[a]!;
      const right = singleNames[b]!;
      const name = `${labels[left]} + ${labels[right]}`;
      combos.push({ name, group: [left, right], mode: "all", forward: name === "V-Pro + EMA 20/30" });
    }
  }
  combos.push({ name: "All five agree", group: singleNames, mode: "all", forward: true });
  combos.push({ name: "Majority of five", group: singleNames, mode: "majority", forward: true });
  combos.push({
    name: "Majority of three",
    group: ["V-Pro cross 34/9", "RSI 8/26", "EMA 20/30"],
    mode: "majority",
    forward: true,
  });

  const decides = new Map<string, (symbol: string, i: number) => Side | "FLAT" | null>();
  for (const spec of specs) decides.set(spec.name, spec.decide);
  const tests = new Map<string, ReturnType<typeof scoreWindow>>();
  for (const row of trials) tests.set(row.trial.name, row.test);
  const ranked: Trial[] = [vproTrial, ...trials.map((row) => row.trial)];
  let betterOnFit = 0;
  for (const combo of combos) {
    const decide =
      combo.name === "V-Pro + EMA 20/30"
        ? (symbol: string, i: number) => {
            const agreed = vote(combo.group, symbol, i, combo.mode);
            if (agreed === "SHORT" && source[symbol]![i]!.close > lines[symbol]!.trendFast[i]!) return "FLAT" as const;
            return agreed;
          }
        : (symbol: string, i: number) => vote(combo.group, symbol, i, combo.mode);
    const score = combo.name === "V-Pro + EMA 20/30" ? scoreOne : scoreWindow;
    const train = score(source, decide, from, split - 1);
    const full = score(source, decide, from, last);
    const parts = combo.group.map((name) => parents.get(name)!);
    const better = train.trades >= 8 && parts.every((part) => train.winRate > part.winRate && train.profit > part.profit);
    if (better) betterOnFit += 1;
    if (!combo.forward) {
      ranked.push({
        name: combo.name,
        trainProfit: train.profit,
        testProfit: 0,
        testWin: 0,
        testWins: 0,
        testLosses: 0,
        testTrades: 0,
        hold,
        verdict: "KILLED",
        tested: false,
        reason: better
          ? "Beat both parts on the older days. Not one of the three sent forward."
          : "Did not beat both parts on the older days.",
        fullProfit: full.profit,
        fullWins: full.wins,
        fullTrades: full.trades,
      });
      continue;
    }
    const test = score(source, decide, split, last);
    const trial = judge(combo.name, train.profit, test, hold);
    trial.fullProfit = full.profit;
    trial.fullWins = full.wins;
    trial.fullTrades = full.trades;
    if (combo.name === "V-Pro + EMA 20/30") {
      decides.set(combo.name, decide);
      tests.set(combo.name, test);
      if (trial.verdict === "KILLED") {
        trial.reason = `${trial.reason}. One trade per coin. That coin is closed before it opens another trade.`;
      }
    }
    if (trial.verdict === "LIVE") {
      trial.reason = better
        ? "Beat its parts on the older days and survived the later days."
        : "More winners than losers on the later days. The older-day profit was still below the best single fit.";
      decides.set(combo.name, decide);
      tests.set(combo.name, test);
    }
    ranked.push(trial);
  }

  const live = ranked.filter((trial) => trial.verdict === "LIVE").sort((a, b) => b.testProfit - a.testProfit);
  const champion = decides.has("V-Pro + EMA 20/30") ? "V-Pro + EMA 20/30" : (live[0]?.name ?? null);
  const winnerTest = champion ? tests.get(champion) : undefined;
  const ledger = (winnerTest?.fills ?? []).map((row) => ({ ...row, strategy: champion ?? "" })).slice(-8).reverse();
  const positions: { symbol: string; side: Side | "FLAT"; since: string; weight: number }[] = symbols.map((symbol) => ({
    symbol,
    side: "FLAT" as const,
    since: "—",
    weight: 0,
  }));
  const chosen = champion ? decides.get(champion) : undefined;
  if (chosen) {
    const order = ["BTC/USD", "ETH/USD", "SOL/USD"].filter((symbol) => source[symbol]);
    const held = new Map<string, { side: Side; since: string }>();
    for (let i = from; i < last; i++) {
      for (const symbol of order) {
        const side = chosen(symbol, i);
        const pos = held.get(symbol);
        if (pos) {
          if (side && side !== pos.side) held.delete(symbol);
          continue;
        }
        if (side !== "LONG" && side !== "SHORT") continue;
        held.set(symbol, { side, since: day(source[symbol]![i + 1]!.t) });
      }
    }
    for (const row of positions) {
      const pos = held.get(row.symbol);
      if (!pos) continue;
      row.side = pos.side;
      row.since = pos.since;
      row.weight = 1 / order.length;
    }
  }

  const signalAt = Math.max(from, n - 2);
  const signals = symbols.map((symbol) => ({
    symbol,
    rsi: lines[symbol]!.rsi[signalAt]!,
    macd: lines[symbol]!.macd[signalAt]!,
    emaFast: lines[symbol]!.trendFast[signalAt]!,
    emaSlow: lines[symbol]!.trendSlow[signalAt]!,
  }));
  const quotes = symbols.map((symbol) => {
    const bars = source[symbol]!;
    const close = bars[bars.length - 1]!.close;
    const prev = bars[bars.length - 2]!.close;
    return { symbol, last: close, changePct: (close / prev - 1) * 100 };
  });
  const dailyCandles = packFrame(source, 180);
  const five = packFrame(m5 as unknown as Record<string, Bar[]>, 721);
  const intraday = packFrame(clocks["15"]!, 721);
  const hour = packFrame(clocks["60"]!, 721);
  const frames: Frame[] = [
    { id: "5m", label: "5-minute", span: frameSpan(five), candles: five },
    { id: "15m", label: "15-minute", span: frameSpan(intraday), candles: intraday },
    { id: "1h", label: "1-hour", span: frameSpan(hour), candles: hour },
    { id: "1D", label: "Daily", span: frameSpan(dailyCandles), candles: dailyCandles },
  ];

  const killed = ranked.filter((trial) => trial.verdict === "KILLED" && trial.tested).length;
  return {
    mission:
      champion === "V-Pro + EMA 20/30"
        ? "The book is V-Pro and the 20/30 EMA. One trade per coin: Bitcoin, Ethereum, and Solana can all be open, but a coin is sold before that same coin opens another trade. A short also closes when price crosses above the 20 EMA. Real capital stays locked."
        : champion
          ? `${champion} is on paper. It was chosen before the later days were scored, and those days had more winners than losers. Real capital stays locked.`
          : betterOnFit === 0
            ? "No combination beat both of its parts on the older days. V-Pro with the EMA, all five agreeing, and a majority vote were still checked on the later days. None earned the book. Cash stays."
            : `${betterOnFit} combinations beat their parts on the older days. The three sent to the later days did not earn the book. Cash stays.`,
    rules: [
      "Paper only. No exchange keys, no live orders.",
      "A rule is fit on the older 60% of daily bars and judged once on the later 40%.",
      "Kill it if the later days lose money, lose more often than they win, lag buy and hold, or fade versus the fit.",
      "A combination is taken only while every part is on the same side. It has to beat those parts on the older days before the later days count.",
    ],
    agents: [
      { id: "tape", name: "Tape", library: "Cryptofeed", state: "working", brief: `${n} daily bars, plus the latest 721 five-minute and fifteen-minute bars. Live sockets are not connected.` },
      { id: "exchange", name: "Exchange", library: "CCXT", state: "blocked", brief: "One order shape, next-bar open. No keys, so the router cannot leave the paper book." },
      { id: "runner", name: "Runner", library: "Freqtrade", state: champion ? "working" : "idle", brief: champion ? `Dry-run of ${champion}.` : "Dry-run idle. There is no order to track." },
      { id: "lab", name: "Lab", library: "VectorBT", state: "working", brief: `${ranked.length} rows. ${betterOnFit} combinations beat their parts on the older days. ${killed} checked rules failed.` },
      { id: "signals", name: "Signals", library: "TA-Lib", state: "working", brief: "RSI, MACD, and EMAs on the last closed day. Computed here, not by the C library." },
      { id: "book", name: "Book", library: "skfolio", state: champion ? "working" : "idle", brief: champion ? "Equal weight across the open names. Cash holds the rest." : "100% cash." },
      { id: "audit", name: "Audit", library: "QuantStats", state: "working", brief: champion ? "Report is the unseen window only." : "No live rule, so there is no performance to dress up." },
      { id: "archive", name: "Archive", library: "DuckDB", state: "working", brief: `${ledger.length} unseen fills kept in the desk ledger. Not a separate database process.` },
      { id: "clock", name: "Clock", library: "APScheduler", state: "working", brief: "Refresh, health, and the daily audit are scheduled while this desk is open." },
      { id: "chart", name: "Chart", library: "Lightweight Charts", state: "working", brief: "One-hour candles. Five-minute, fifteen-minute, and daily are one switch away." },
    ],
    trials: ranked,
    champion,
    equity: 10_000 + (winnerTest?.profit ?? 0),
    proof: winnerTest?.profit ?? 0,
    positions,
    ledger,
    quotes,
    candles: hour,
    frames,
    signals,
    jobs: [
      { name: "Refresh tape", every: "15m" },
      { name: "Health check", every: "5m" },
      { name: "Audit report", every: "1d" },
    ],
    audit: {
      sharpe: winnerTest?.sharpe ?? 0,
      maxDd: winnerTest?.maxDd ?? 0,
      profitFactor: winnerTest?.profitFactor ?? 0,
      note: champion ? "These numbers are the later days only. The fit window is not included." : "No survivor. Sharpe and profit factor are not shown for a dead rule.",
    },
  };
}

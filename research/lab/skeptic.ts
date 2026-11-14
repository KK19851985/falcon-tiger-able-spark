import { MIN_TRADES_PER_COIN } from "./constants.ts";
import { usd } from "./format.ts";
import { deflatedSharpe } from "./stats.ts";
import { SYMBOLS, type DeflatedRecord, type Gate, type Logger, type NeighborScore, type SideMetrics, type Verdict } from "./types.ts";

export type Judgment = {
  verdict: Verdict;
  reason: string;
  gates: Gate[];
  trialsCounted: number;
  deflated: DeflatedRecord;
};

/**
 * Accept only when every gate passes. A coin with fewer than 30 closed trades
 * on the full sample is INSUFFICIENT, which is not a rejection of the direction.
 * The deflated-Sharpe figure is a test statistic. It is never a probability.
 */
export function judge(
  input: {
    champion: SideMetrics;
    challenger: SideMetrics;
    neighbors: { label: string; hash: string; holdoutProfit: number }[];
    /** Holdout daily Sharpes of every earlier trial. This trial is added here. */
    priorHoldoutSharpes: number[];
  },
  log: Logger = console.log,
): Judgment {
  const say = (line: string) => log(`[skeptic] ${line}`);
  const gates: Gate[] = [];
  const champ = input.champion;
  const next = input.challenger;
  const tradeBits = SYMBOLS.map(
    (symbol) => `${symbol} ${next.fullTrades[symbol]} (champion ${champ.fullTrades[symbol]})`,
  );
  const tradesPass = SYMBOLS.every((symbol) => next.fullTrades[symbol] >= MIN_TRADES_PER_COIN);
  gates.push({
    name: "trades",
    pass: tradesPass,
    detail: tradesPass
      ? `Each coin closed at least ${MIN_TRADES_PER_COIN} trades on the full sample (${tradeBits.join(", ")}).`
      : `Need ${MIN_TRADES_PER_COIN} closed trades on each coin over the full sample. Got ${tradeBits.join(", ")}.`,
  });

  const trainPass = next.train.profit > champ.train.profit;
  gates.push({
    name: "train",
    pass: trainPass,
    detail: `Train profit ${usd(champ.train.profit)} → ${usd(next.train.profit)}.`,
  });
  const holdPass = next.holdout.profit > champ.holdout.profit;
  gates.push({
    name: "holdout",
    pass: holdPass,
    detail: `Holdout profit ${usd(champ.holdout.profit)} → ${usd(next.holdout.profit)}. Buy and hold on that window was ${usd(next.holdout.buyHold)}.`,
  });

  let foldWins = 0;
  for (let i = 0; i < next.folds.length; i++) {
    if (next.folds[i]!.profit > champ.folds[i]!.profit) foldWins += 1;
  }
  const foldPass = next.folds.length > 0 && foldWins * 2 > next.folds.length;
  gates.push({
    name: "walk-forward",
    pass: foldPass,
    detail: `Beat the champion on ${foldWins} of ${next.folds.length} anchored folds. Most means more than half.`,
  });

  const ddPass =
    next.train.maxDd <= champ.train.maxDd + 1e-12 && next.holdout.maxDd <= champ.holdout.maxDd + 1e-12;
  gates.push({
    name: "drawdown",
    pass: ddPass,
    detail: `Max drawdown train ${(champ.train.maxDd * 100).toFixed(2)}% → ${(next.train.maxDd * 100).toFixed(2)}%, holdout ${(champ.holdout.maxDd * 100).toFixed(2)}% → ${(next.holdout.maxDd * 100).toFixed(2)}%. No worse means less than or equal to the champion on both windows.`,
  });

  const trialSharpes = [...input.priorHoldoutSharpes, next.holdout.sharpeDaily];
  const deflated = deflatedSharpe({
    sharpe: next.holdout.sharpeDaily,
    skew: next.holdout.skew,
    kurtosis: next.holdout.kurtosis,
    observations: next.holdout.observations,
    trialSharpes,
  });
  gates.push({
    name: "deflated-sharpe",
    pass: deflated.clears,
    detail: deflated.clears
      ? `Holdout daily Sharpe ${deflated.sharpe.toFixed(4)} cleared hurdle ${deflated.hurdle.toFixed(4)} with test statistic z=${formatZ(deflated.z)} after ${deflated.trials} trials. This z is not a probability.`
      : `Holdout daily Sharpe ${deflated.sharpe.toFixed(4)} did not clear hurdle ${deflated.hurdle.toFixed(4)} (z=${formatZ(deflated.z)}, trials=${deflated.trials}, variance=${deflated.variance.toFixed(6)}). The statistic is not a probability.`,
  });

  const neighbors: NeighborScore[] = input.neighbors.map((neighbor) => ({
    ...neighbor,
    beatsChampion: neighbor.holdoutProfit > champ.holdout.profit,
  }));
  const neighbourWins = neighbors.filter((neighbor) => neighbor.beatsChampion).length;
  const neighbourPass = neighbors.length > 0 && neighbourWins * 2 > neighbors.length;
  gates.push({
    name: "neighbours",
    pass: neighbourPass,
    detail: neighbourPass
      ? `${neighbourWins} of ${neighbors.length} one-step neighbours beat the champion's holdout profit, which is a majority.`
      : `${neighbourWins} of ${neighbors.length} one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.`,
  });

  let verdict: Verdict;
  if (!tradesPass) verdict = "INSUFFICIENT";
  else if (gates.every((gate) => gate.pass)) verdict = "ACCEPT";
  else verdict = "REJECT";

  const failed = gates.filter((gate) => !gate.pass).map((gate) => gate.name);
  const reason =
    verdict === "ACCEPT"
      ? "Accepted on the research ledger only. Train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, neighbour stability, and the 30-trade count all passed. The desk was not changed."
      : verdict === "INSUFFICIENT"
        ? `Insufficient sample: ${gates.find((gate) => gate.name === "trades")!.detail} Other failed gates: ${failed.filter((name) => name !== "trades").join(", ") || "none"}.`
        : `Rejected. Failed gates: ${failed.join(", ")}.`;

  for (const gate of gates) say(`${gate.pass ? "pass" : "fail"} ${gate.name}: ${gate.detail}`);
  if (neighbors.length) {
    const worst = [...neighbors].sort((a, b) => a.holdoutProfit - b.holdoutProfit)[0]!;
    say(
      `Neighbour holdout profits span ${usd(worst.holdoutProfit)} (${worst.label}) to ${usd(neighbors.reduce((best, item) => Math.max(best, item.holdoutProfit), -Infinity))}.`,
    );
  }
  say(reason);
  return { verdict, reason, gates, trialsCounted: deflated.trials, deflated };
}

function formatZ(value: number): string {
  return Number.isFinite(value) ? value.toFixed(3) : "n/a";
}

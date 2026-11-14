/**
 * One offline research cycle. Run with `npm run lab:cycle`.
 * Writes the ledger, the readable copy, and — only on ACCEPT — candidate.json.
 * Does not import the candidate back into the desk and does not place orders.
 */
import { execSync } from "node:child_process";
import { FIFTEEN_DATA_HASH, FIFTEEN_KNOBS, PINNED_DATA_HASH, SEED } from "./constants.ts";
import { describeConfig } from "./format.ts";
import { loadFifteen, loadMarket } from "./market.ts";
import { PATHS, REPO_ROOT, isOutputPath } from "./paths.ts";
import { adjacentMoves, forcedFromBaseline, propose, toProposerView } from "./proposer.ts";
import { appendCycle, consoleSummary, readLedger } from "./recorder.ts";
import { judge } from "./skeptic.ts";
import { LIVE_COSTS, evaluatePair, holdoutProfit } from "./tester.ts";
import { rowTimeframe, type Knob, type LedgerRow, type Timeframe } from "./types.ts";

async function main() {
  const commit = codeCommit();
  const argv = process.argv.slice(2);
  const timeframe: Timeframe = argv.includes("--timeframe=15m") ? "15m" : "1d";
  const ledger = readLedger(PATHS.ledger);
  const track = ledger.filter(
    (row) => rowTimeframe(row) === timeframe && (row.strategy ?? "vpro") === "vpro",
  );
  const directed = parseDirected(argv);
  if (directed?.knob === "directionTf" && timeframe !== "15m") {
    throw new Error("The higher-timeframe direction test runs on the 15-minute book.");
  }
  if (timeframe === "15m") {
    console.log(
      "[proposer] 15-minute track. Earlier daily trials do not choose the next knob and are not counted in this track's deflated-Sharpe hurdle.",
    );
  }
  const proposal = directed
    ? forcedFromBaseline(directed.knob, directed.value, directed.reasoning)
    : propose(track.map(toProposerView), console.log, timeframe === "15m" ? FIFTEEN_KNOBS : undefined);
  const loaded = timeframe === "15m" ? await loadFifteen() : await loadMarket({ cacheOnly: directed != null });
  const anchors =
    loaded.manifest.trainStart && loaded.manifest.holdoutStart
      ? { trainStart: Date.parse(loaded.manifest.trainStart), holdoutStart: Date.parse(loaded.manifest.holdoutStart) }
      : undefined;
  if (timeframe === "15m" && loaded.manifest.hash !== FIFTEEN_DATA_HASH) {
    throw new Error(`15-minute tape hash ${loaded.manifest.hash} does not match ${FIFTEEN_DATA_HASH}`);
  }
  if (directed && timeframe === "1d" && loaded.manifest.hash !== PINNED_DATA_HASH) {
    throw new Error(`Pinned tape hash ${loaded.manifest.hash} does not match ${PINNED_DATA_HASH}`);
  }
  for (const line of loaded.reasoning) console.log(`[tester] ${line}`);

  if (proposal.kind === "exhausted") {
    const row: LedgerRow = {
      cycle: ledger.length + 1,
      at: new Date().toISOString(),
      commit,
      seed: SEED,
      timeframe,
      data: loaded.manifest,
      champion: {
        config: proposal.champion,
        hash: proposal.championHash,
        label: describeConfig(proposal.champion),
      },
      experiment: null,
      metrics: null,
      neighbors: [],
      verdict: "EXHAUSTED",
      reason: proposal.reasoning.join(" ") || "Search space exhausted.",
      gates: [],
      trialsCounted: track.filter((item) => item.experiment).length,
      deflated: null,
    };
    appendCycle(row);
    console.log("");
    console.log(consoleSummary(row));
    return;
  }

  const scored = evaluatePair(loaded.series, proposal.champion, proposal.move.config, {
    log: console.log,
    seed: SEED,
    timeframe,
    anchors,
  });
  const neighbors = adjacentMoves(proposal.move.config).map((move) => ({
    label: move.label,
    hash: move.hash,
    holdoutProfit: holdoutProfit(loaded.series, move.config, LIVE_COSTS, anchors),
  }));
  const prior = track
    .filter((item) => item.experiment && item.metrics)
    .map((item) => item.metrics!.challenger.holdout.sharpeDaily);
  const judgment = judge(
    {
      champion: scored.champion,
      challenger: scored.challenger,
      neighbors,
      priorHoldoutSharpes: prior,
    },
    console.log,
  );
  const neighborScores = neighbors.map((neighbor) => ({
    ...neighbor,
    beatsChampion: neighbor.holdoutProfit > scored.champion.holdout.profit,
  }));
  const row: LedgerRow = {
    cycle: ledger.length + 1,
    at: new Date().toISOString(),
    commit,
    seed: SEED,
    timeframe,
    data: loaded.manifest,
    champion: {
      config: proposal.champion,
      hash: proposal.championHash,
      label: describeConfig(proposal.champion),
    },
    experiment: {
      config: proposal.move.config,
      hash: proposal.move.hash,
      knob: proposal.move.knob,
      direction: proposal.move.direction,
      from: proposal.move.from,
      to: proposal.move.to,
      label: proposal.move.label,
      reasoning: proposal.reasoning,
    },
    metrics: { champion: scored.champion, challenger: scored.challenger },
    neighbors: neighborScores,
    verdict: judgment.verdict,
    reason: judgment.reason,
    gates: judgment.gates,
    trialsCounted: judgment.trialsCounted,
    deflated: judgment.deflated,
  };
  appendCycle(row);
  console.log("");
  console.log(consoleSummary(row));
}

function parseDirected(argv: string[]): { knob: Knob; value: number | string; reasoning: string[] } | null {
  const raw = argv.find((arg) => arg.startsWith("--set="));
  if (!raw) return null;
  if (!argv.includes("--against-baseline")) {
    throw new Error("A directed cycle must be scored against the published baseline.");
  }
  const body = raw.slice("--set=".length);
  const split = body.indexOf("=");
  const knob = body.slice(0, split) as Knob;
  const rawValue = body.slice(split + 1);
  const named = new Set(["either", "window3", "agree", "15m", "1h", "4h", "1d"]);
  const value = named.has(rawValue) ? rawValue : Number(rawValue);
  if (typeof value === "number" && !Number.isFinite(value)) throw new Error(`Bad --set value ${raw}`);
  return { knob, value, reasoning: reasonsFor(knob, value) };
}

function reasonsFor(knob: Knob, value: number | string): string[] {
  const common = [
    "Scored against the published baseline, V-Pro 34/9 and EMA 20/30, not against an earlier band trial.",
    "The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.",
    "Fees stay on: 0.1% taker and 5 bps slippage on the entry and the exit. Seed stays 20261114.",
    "This does not edit the desk.",
  ];
  if (knob === "signalRule" && value === "either") {
    return [
      "Daniel asked to lower the buy and sell requirement so each coin can reach 30 trades.",
      "Assumption: the baseline already enters when the latched V-Pro stance and the latched EMA 20/30 stance agree. It does not require both crosses on the same bar, so a 'state instead of cross' trial would not change a fill and is not run as its own config.",
      "Assumption: the volume threshold is already off. The next grid step turns that filter on, which raises the bar, so it is not run.",
      "Assumption: requiring the two latest crosses to land within 3 bars is tighter than the baseline latch. That window is a later cycle, still against this baseline.",
      "This cycle changes one variable: the signal rule from agree to either. A side is taken when V-Pro or the EMA has that side and the other is not opposite.",
      "EMA 20/50 is queued after the signal-rule trials. It is a separate one-variable change.",
      ...common,
    ];
  }
  if (knob === "signalRule" && value === "window3") {
    return [
      "One variable: signal rule agree to window3.",
      "Assumption: this is stricter than the baseline. The baseline stays in while both latched stances agree, no matter how far apart the crosses were. Window3 allows a side only when the latest V-Pro cross and the latest EMA cross point the same way and are at most 3 bars apart.",
      "It is measured because Daniel asked for N=3, and it is still scored against the published baseline with the skeptic unchanged.",
      ...common,
    ];
  }
  if (knob === "directionTf") {
    return [
      `One variable: direction timeframe 15m to ${value}. Trades still fill on the 15-minute chart.`,
      "Direction is the higher-timeframe EMA 20/30: long only while the fast average is above the slow average, short only while it is below. The higher bar is used only after it has closed.",
      "The entry trigger stays the 15-minute V-Pro 34/9. The volume filter stays off. The 15-minute short-skip stays on. Fees and the seed stay the same.",
      "Scored against the 15-minute baseline, not against another higher timeframe.",
      ...common,
    ];
  }
  if (knob === "emaSlow" && value === 50) {
    return [
      "One variable: EMA slow 30 to 50. EMA fast stays 20. V-Pro stays 34/9. The signal rule stays agree. Volume stays off.",
      "Queued after the signal-rule trials. Independent of them, and scored against the same published baseline.",
      ...common,
    ];
  }
  return [`Directed one-variable change: ${knob} to ${String(value)}.`, ...common];
}

function codeCommit(): string {
  const hash = execSync("git rev-parse HEAD", { cwd: REPO_ROOT, encoding: "utf8" }).trim();
  // -uall lists each new file. The default collapses an untracked docs/ directory
  // into one line, which would look like a code change.
  const status = execSync("git status --porcelain --untracked-files=all", { cwd: REPO_ROOT, encoding: "utf8" });
  const dirty = status
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .filter((line) => !isOutputPath(line.slice(3).trim()));
  return dirty.length ? `${hash}+dirty` : hash;
}

main().catch((error: unknown) => {
  console.error("[lab]", error instanceof Error ? error.stack : error);
  process.exit(1);
});

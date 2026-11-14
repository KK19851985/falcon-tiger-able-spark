/**
 * One offline research cycle. Run with `npm run lab:cycle`.
 * Writes the ledger, the readable copy, and — only on ACCEPT — candidate.json.
 * Does not import the candidate back into the desk and does not place orders.
 */
import { execSync } from "node:child_process";
import { SEED } from "./constants.ts";
import { describeConfig } from "./format.ts";
import { loadMarket } from "./market.ts";
import { OUTPUT_PREFIXES, PATHS, REPO_ROOT } from "./paths.ts";
import { adjacentMoves, propose, toProposerView } from "./proposer.ts";
import { appendCycle, consoleSummary, readLedger } from "./recorder.ts";
import { judge } from "./skeptic.ts";
import { evaluatePair, holdoutProfit } from "./tester.ts";
import type { LedgerRow } from "./types.ts";

async function main() {
  const commit = codeCommit();
  const ledger = readLedger(PATHS.ledger);
  const proposal = propose(ledger.map(toProposerView));
  const loaded = await loadMarket();
  for (const line of loaded.reasoning) console.log(`[tester] ${line}`);

  if (proposal.kind === "exhausted") {
    const row: LedgerRow = {
      cycle: ledger.length + 1,
      at: new Date().toISOString(),
      commit,
      seed: SEED,
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
      trialsCounted: ledger.filter((item) => item.experiment).length,
      deflated: null,
    };
    appendCycle(row);
    console.log("");
    console.log(consoleSummary(row));
    return;
  }

  const scored = evaluatePair(loaded.series, proposal.champion, proposal.move.config, { log: console.log, seed: SEED });
  const neighbors = adjacentMoves(proposal.move.config).map((move) => ({
    label: move.label,
    hash: move.hash,
    holdoutProfit: holdoutProfit(loaded.series, move.config),
  }));
  const prior = ledger
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

function codeCommit(): string {
  const hash = execSync("git rev-parse HEAD", { cwd: REPO_ROOT, encoding: "utf8" }).trim();
  const status = execSync("git status --porcelain", { cwd: REPO_ROOT, encoding: "utf8" });
  const dirty = status
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .filter((line) => {
      const file = line.slice(3).trim();
      return !OUTPUT_PREFIXES.some((prefix) => file === prefix || file.startsWith(prefix));
    });
  return dirty.length ? `${hash}+dirty` : hash;
}

main().catch((error: unknown) => {
  console.error("[lab]", error instanceof Error ? error.stack : error);
  process.exit(1);
});

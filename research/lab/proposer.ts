import { BASELINE, GRIDS, KNOB_LABEL, KNOB_ORDER } from "./constants.ts";
import { describeConfig, describeMove } from "./format.ts";
import { configHash } from "./hash.ts";
import type { Config, Direction, Knob, Logger, ProposerView } from "./types.ts";

export type Move = {
  config: Config;
  hash: string;
  knob: Knob;
  direction: Direction;
  from: number | null;
  to: number | null;
  distance: number;
  label: string;
};

export type Proposal =
  | { kind: "experiment"; champion: Config; championHash: string; move: Move; reasoning: string[] }
  | { kind: "exhausted"; champion: Config; championHash: string; reasoning: string[] };

type DirectionState = {
  fails: Map<string, number>;
  retired: Set<string>;
  heldUp: string | null;
  touched: Set<Knob>;
  tried: Set<string>;
};

/**
 * Pick the next experiment by changing exactly one knob on the current champion.
 * A direction that the skeptic has rejected twice is retired. A direction whose
 * last result improved holdout profit is refined before a new knob is opened.
 * A config hash that is already in the ledger is never proposed again.
 */
export function propose(ledger: ProposerView[], log: Logger = console.log): Proposal {
  const say = (line: string) => log(`[proposer] ${line}`);
  const reasoning: string[] = [];
  const note = (line: string) => {
    reasoning.push(line);
    say(line);
  };
  const champion = championConfig(ledger);
  const championHash = configHash(champion);
  const state = readState(ledger);
  note(
    ledger.length === 0
      ? `No ledger yet. The champion is the published rule: ${describeConfig(champion)}.`
      : `Champion is ${describeConfig(champion)} (${championHash.slice(0, 12)}).`,
  );
  if (state.retired.size) {
    note(`Retired after two rejections: ${[...state.retired].join(", ")}.`);
  } else {
    note("No direction has been rejected twice.");
  }
  const moves = legalMoves(champion, state);
  const inactive = moves.filter((move) => move.knob === "volumeLookback" && champion.volumeThreshold == null);
  let pool = moves.filter((move) => !(move.knob === "volumeLookback" && champion.volumeThreshold == null));
  if (inactive.length && pool.length) {
    note(
      `Volume lookback does not change a fill while the volume threshold is off, so those ${inactive.length} moves wait.`,
    );
  } else if (!pool.length) {
    pool = moves;
  }
  if (!pool.length) {
    note("Every one-knob change has been tried or retired. The search stops. The desk is unchanged.");
    return { kind: "exhausted", champion, championHash, reasoning };
  }
  const focus = state.heldUp && !state.retired.has(state.heldUp) ? state.heldUp : null;
  const ranked = [...pool].sort((a, b) => rank(a, state, focus) - rank(b, state, focus) || a.hash.localeCompare(b.hash));
  const chosen = ranked[0]!;
  const focusKnob = focus?.split(":")[0];
  const focusDirection = focus?.split(":")[1];
  if (focus && chosen.knob === focusKnob && chosen.direction === focusDirection) {
    note(
      `${focus} improved holdout profit last time it was tried, so the next step stays on that knob and moves further that way before opening a new knob.`,
    );
  } else if (focus && chosen.knob === focusKnob) {
    note(
      `${focus} improved holdout profit, and there is no unused step further that way. The next experiment tries the other side of ${KNOB_LABEL[chosen.knob]} before opening a new knob.`,
    );
  } else if (!state.touched.has(chosen.knob)) {
    note(
      "Nothing that is still eligible improved the holdout, so the next untouched knob is probed one grid step at a time.",
    );
  } else {
    note("Eligible held-up steps are exhausted. The next unused one-knob step is the closest remaining grid neighbour.");
  }
  note(
    `Experiment: ${chosen.label}. One variable. ${pool.length} unused moves were eligible. Hash ${chosen.hash.slice(0, 12)}.`,
  );
  return { kind: "experiment", champion, championHash, move: chosen, reasoning };
}

export function championConfig(ledger: ProposerView[]): Config {
  for (let i = ledger.length - 1; i >= 0; i--) {
    const row = ledger[i]!;
    if (row.verdict === "ACCEPT" && row.experiment) return { ...row.experiment.config };
  }
  return { ...BASELINE };
}

export function toProposerView(row: {
  verdict: ProposerView["verdict"];
  experiment: ProposerView["experiment"];
  metrics: { champion: { holdout: { profit: number } }; challenger: { holdout: { profit: number } } } | null;
}): ProposerView {
  return {
    verdict: row.verdict,
    experiment: row.experiment,
    holdoutProfit: row.metrics
      ? {
          champion: row.metrics.champion.holdout.profit,
          challenger: row.metrics.challenger.holdout.profit,
        }
      : null,
  };
}

function readState(ledger: ProposerView[]): DirectionState {
  const fails = new Map<string, number>();
  const touched = new Set<Knob>();
  const tried = new Set<string>();
  let heldUp: string | null = null;
  for (const row of ledger) {
    if (!row.experiment) continue;
    const key = `${row.experiment.knob}:${row.experiment.direction}`;
    touched.add(row.experiment.knob);
    tried.add(row.experiment.hash);
    if (row.verdict === "ACCEPT") {
      fails.set(key, 0);
      heldUp = key;
      continue;
    }
    if ((row.verdict !== "REJECT" && row.verdict !== "INSUFFICIENT") || !row.holdoutProfit) continue;
    // A rejection is a failed direction. An underpowered trial is not: the
    // sample was too small to judge, but a better holdout is still a reason
    // to take the next step on that same knob.
    if (row.verdict === "REJECT") fails.set(key, (fails.get(key) ?? 0) + 1);
    const improved = row.holdoutProfit.challenger > row.holdoutProfit.champion;
    if (improved) heldUp = key;
    else if (heldUp === key) heldUp = null;
  }
  const retired = new Set<string>();
  for (const [key, count] of fails) if (count >= 2) retired.add(key);
  return { fails, retired, heldUp, touched, tried };
}

function legalMoves(champion: Config, state: DirectionState): Move[] {
  const moves: Move[] = [];
  for (const knob of KNOB_ORDER) {
    const grid = GRIDS[knob] as readonly (number | null)[];
    const current = champion[knob] as number | null;
    const index = grid.findIndex((value) => value === current);
    if (index < 0) throw new Error(`${knob} value ${String(current)} is not on the search grid`);
    for (let j = 0; j < grid.length; j++) {
      if (j === index) continue;
      const direction: Direction = j > index ? "up" : "down";
      if (state.retired.has(`${knob}:${direction}`)) continue;
      const next = withKnob(champion, knob, grid[j]!);
      if (next.emaFast >= next.emaSlow) continue;
      const hash = configHash(next);
      if (state.tried.has(hash)) continue;
      moves.push({
        config: next,
        hash,
        knob,
        direction,
        from: current,
        to: grid[j]!,
        distance: Math.abs(j - index),
        label: describeMove(knob, current, grid[j]!),
      });
    }
  }
  return moves;
}

function rank(move: Move, state: DirectionState, focus: string | null): number {
  const key = `${move.knob}:${move.direction}`;
  const knobIndex = KNOB_ORDER.indexOf(move.knob);
  let band = 20;
  if (focus && move.knob === focus.split(":")[0]) band = move.direction === focus.split(":")[1] ? 0 : 5;
  else if (!state.touched.has(move.knob)) band = 10;
  else if ((state.fails.get(key) ?? 0) > 0) band = 30;
  const directionBit = move.direction === "down" ? 1 : 0;
  return band * 1000 + move.distance * 100 + knobIndex * 2 + directionBit;
}

function withKnob(base: Config, knob: Knob, value: number | null): Config {
  const next: Config = { ...base };
  switch (knob) {
    case "vproBand":
      next.vproBand = value as number;
      break;
    case "vproSignal":
      next.vproSignal = value as number;
      break;
    case "emaFast":
      next.emaFast = value as number;
      break;
    case "emaSlow":
      next.emaSlow = value as number;
      break;
    case "shortSkip":
      next.shortSkip = value;
      break;
    case "volumeLookback":
      next.volumeLookback = value as number;
      break;
    case "volumeThreshold":
      next.volumeThreshold = value;
      break;
  }
  return next;
}

/** One-grid-step neighbours of a config, including the step back to where it came from. */
export function adjacentMoves(config: Config): Move[] {
  const moves: Move[] = [];
  for (const knob of KNOB_ORDER) {
    const grid = GRIDS[knob] as readonly (number | null)[];
    const current = config[knob] as number | null;
    const index = grid.findIndex((value) => value === current);
    for (const j of [index - 1, index + 1]) {
      if (j < 0 || j >= grid.length) continue;
      const next = withKnob(config, knob, grid[j]!);
      if (next.emaFast >= next.emaSlow) continue;
      const direction: Direction = j > index ? "up" : "down";
      moves.push({
        config: next,
        hash: configHash(next),
        knob,
        direction,
        from: current,
        to: grid[j]!,
        distance: 1,
        label: describeMove(knob, current, grid[j]!),
      });
    }
  }
  return moves;
}

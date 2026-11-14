import { KNOB_LABEL } from "./constants.ts";
import type { Config, Knob } from "./types.ts";

export function usd(value: number): string {
  const sign = value < 0 ? "-" : "";
  const [whole, frac] = Math.abs(value).toFixed(2).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}$${grouped}.${frac}`;
}

export function pct(value: number, digits = 2): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function num(value: number, digits = 4): string {
  if (!Number.isFinite(value)) return "n/a";
  return value.toFixed(digits);
}

export function describeConfig(config: Config): string {
  const skip = config.shortSkip == null ? "off" : `EMA ${config.shortSkip}`;
  const volume =
    config.volumeThreshold == null
      ? "off"
      : `${config.volumeThreshold}× a ${config.volumeLookback}-bar average`;
  const rule =
    config.signalRule && config.signalRule !== "agree" ? `, signal ${config.signalRule}` : "";
  return `V-Pro ${config.vproBand}/${config.vproSignal}, EMA ${config.emaFast}/${config.emaSlow}, short-skip ${skip}, volume ${volume}${rule}`;
}

export function formatKnobValue(knob: Knob, value: number | string | null): string {
  if (value == null) return "off";
  if (knob === "volumeThreshold") return String(value);
  return String(value);
}

export function describeMove(knob: Knob, from: number | string | null, to: number | string | null): string {
  return `${KNOB_LABEL[knob]} ${formatKnobValue(knob, from)} → ${formatKnobValue(knob, to)}`;
}

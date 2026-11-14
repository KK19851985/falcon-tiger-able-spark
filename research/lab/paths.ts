import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

export const REPO_ROOT = path.resolve(here, "../..");

export const PATHS = {
  ledger: path.join(REPO_ROOT, "research/lab/ledger.jsonl"),
  markdown: path.join(REPO_ROOT, "docs/LAB_LEDGER.md"),
  candidate: path.join(REPO_ROOT, "research/lab/candidate.json"),
  cache: path.join(REPO_ROOT, "research/lab/data/extension-cache.json"),
};

/** Files a cycle is allowed to write. None of them are imported by the desk. */
export const OUTPUT_PREFIXES = [
  "research/lab/ledger.jsonl",
  "research/lab/candidate.json",
  "research/lab/data/",
  "docs/LAB_LEDGER.md",
];

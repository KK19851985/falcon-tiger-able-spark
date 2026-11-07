import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DESK_SYMBOLS, getDesk, type Mode } from "@/lib/desk/engine";

const MODES: { id: Mode; label: string }[] = [
  { id: "crude", label: "5-bar scan" },
  { id: "pivot", label: "Pivot only" },
  { id: "stack", label: "Full stack" },
];

function money(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

function pct(n: number) {
  return `${(n * 100).toFixed(1)}%`;
}

export function DeskView() {
  const desk = useMemo(() => getDesk(), []);
  const [symbol, setSymbol] = useState<(typeof DESK_SYMBOLS)[number]>("BTC/USDT");
  const [focus, setFocus] = useState<Mode>("stack");

  const chart = useMemo(() => {
    const a = desk.reports.crude.equity;
    const b = desk.reports.pivot.equity;
    const c = desk.reports.stack.equity;
    const len = Math.min(a.length, b.length, c.length);
    return Array.from({ length: len }, (_, i) => ({
      i: a[i]!.i,
      crude: Math.round(a[i]!.equity),
      pivot: Math.round(b[i]!.equity),
      stack: Math.round(c[i]!.equity),
    }));
  }, [desk]);

  const log = desk.reports[focus].decisions
    .filter((d) => d.symbol === symbol)
    .slice(-12)
    .reverse();

  const live = desk.latest[symbol]!;
  const lastBar = desk.series[symbol]![desk.series[symbol]!.length - 1]!;
  const prev = desk.series[symbol]![desk.series[symbol]!.length - 2]!;
  const chg = ((lastBar.close - prev.close) / prev.close) * 100;

  return (
    <main className="min-h-screen overflow-x-hidden bg-bg text-fg">
      <header className="border-b border-line px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-up/50 bg-surface">
              <span className="h-3 w-3 rounded-full bg-up" />
            </span>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Pivot Desk</h1>
              <p className="text-sm text-muted">Paper only · 15-minute MACD desk</p>
            </div>
          </div>
          <p className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-up">
            dry-run · risk and skeptic armed
          </p>
        </div>
      </header>

      <div className="mx-auto grid min-w-0 max-w-6xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[220px_1fr]">
        <section className="rounded-lg border border-line bg-surface p-3">
          <h2 className="mb-2 text-xs font-semibold tracking-wide text-muted">MARKETS</h2>
          <ul className="flex flex-col gap-1">
            {DESK_SYMBOLS.map((s) => {
              const bars = desk.series[s]!;
              const c = bars[bars.length - 1]!.close;
              const p = bars[bars.length - 2]!.close;
              const d = ((c - p) / p) * 100;
              const on = s === symbol;
              return (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => setSymbol(s)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left ${
                      on ? "bg-surface-2" : "hover:bg-surface-2"
                    }`}
                  >
                    <span className="text-sm font-medium">{s.replace("/USDT", "")}</span>
                    <span className={`font-mono text-xs ${d >= 0 ? "text-up" : "text-down"}`}>
                      {d >= 0 ? "+" : ""}
                      {d.toFixed(2)}%
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="flex min-w-0 flex-col gap-4">
          <section className="grid gap-3 sm:grid-cols-3">
            {MODES.map((m) => {
              const r = desk.reports[m.id];
              const on = focus === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setFocus(m.id)}
                  className={`rounded-lg border p-3 text-left ${
                    on ? "border-up bg-surface" : "border-line bg-surface"
                  }`}
                >
                  <p className="text-xs text-muted">{m.label}</p>
                  <p className={`mt-1 font-mono text-2xl ${r.returnPct >= 0 ? "text-up" : "text-down"}`}>
                    {money(r.returnPct)}
                  </p>
                  <p className="mt-2 font-mono text-xs text-muted">
                    {r.trades.length} trades · win {pct(r.winRate)} · avg {r.avgR.toFixed(2)}R
                  </p>
                  <p className="font-mono text-xs text-muted">
                    max DD {(r.maxDd * 100).toFixed(1)}%
                    {m.id === "stack" ? ` · ${r.vetoes} vetoes` : ""}
                  </p>
                </button>
              );
            })}
          </section>

          <section className="rounded-lg border border-line bg-surface p-3">
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold">Equity, same history, three filters</h2>
              <p className="font-mono text-xs text-muted">
                {symbol.split("/")[0]} {lastBar.close.toFixed(symbol.startsWith("ARB") ? 4 : 2)}{" "}
                <span className={chg >= 0 ? "text-up" : "text-down"}>
                  {chg >= 0 ? "+" : ""}
                  {chg.toFixed(2)}%
                </span>
              </p>
            </div>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chart}>
                  <CartesianGrid stroke="var(--color-line)" vertical={false} />
                  <XAxis dataKey="i" hide />
                  <YAxis
                    stroke="var(--color-muted)"
                    tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                    width={48}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-surface-2)",
                      border: "1px solid var(--color-line)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="crude" stroke="var(--color-muted)" dot={false} strokeWidth={1.5} />
                  <Line type="monotone" dataKey="pivot" stroke="var(--color-warn)" dot={false} strokeWidth={1.5} />
                  <Line type="monotone" dataKey="stack" stroke="var(--color-up)" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 font-mono text-xs text-muted">
              grey 5-bar · gold pivot divergence · green full stack (risk + skeptic)
            </p>
          </section>

          <section className="rounded-lg border border-line bg-surface p-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold">Learning lab</h2>
              <p className={`font-mono text-xs ${desk.lab.adopted ? "text-up" : "text-warn"}`}>
                {desk.lab.adopted ? "rule kept" : "rule rejected"}
              </p>
            </div>
            <p className="mt-2 text-sm text-muted">{desk.lab.cause}</p>
            <p className="mt-2 text-sm">{desk.lab.verdict}</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <article className="rounded-md border border-line bg-surface-2 p-3">
                <p className="text-xs text-muted">Old rule, unseen bars</p>
                <p className={`mt-1 font-mono text-lg ${desk.lab.baselineTest.returnPct >= 0 ? "text-up" : "text-down"}`}>
                  {money(desk.lab.baselineTest.returnPct)}
                </p>
                <p className="font-mono text-xs text-muted">
                  {desk.lab.baselineTest.trades} trades · {desk.lab.baselineTest.avgR.toFixed(2)}R
                </p>
              </article>
              <article className="rounded-md border border-line bg-surface-2 p-3">
                <p className="text-xs text-muted">Train winner, same unseen bars</p>
                <p className={`mt-1 font-mono text-lg ${desk.lab.test.returnPct >= 0 ? "text-up" : "text-down"}`}>
                  {money(desk.lab.test.returnPct)}
                </p>
                <p className="font-mono text-xs text-muted">
                  {desk.lab.test.trades} trades · {desk.lab.test.avgR.toFixed(2)}R · {desk.lab.winner.name}
                </p>
              </article>
            </div>
            <ul className="mt-3 flex flex-col gap-1">
              {desk.lab.rows.slice(0, 4).map((row) => (
                <li key={row.name} className="flex items-center justify-between gap-3 font-mono text-xs text-muted">
                  <span className="truncate">{row.name}</span>
                  <span>
                    train {row.trainAvgR.toFixed(2)}R · {row.trainTrades}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-3 md:grid-cols-3">
            <AgentCard
              title="Technical"
              body={live.tech.reasoning}
              meta={live.tech.signal === "NEUTRAL" ? "NEUTRAL" : `${live.tech.signal} ${live.tech.confidence}`}
              tone={live.tech.signal === "NEUTRAL" ? "muted" : "up"}
            />
            <AgentCard title="Risk" body={live.risk} meta="gate" tone="muted" />
            <AgentCard
              title="Skeptic"
              body={live.skeptic}
              meta={live.action}
              tone={live.action === "PAPER" ? "up" : "down"}
            />
          </section>

          <section className="min-w-0 overflow-hidden rounded-lg border border-line bg-surface">
            <div className="border-b border-line px-3 py-2">
              <h2 className="text-sm font-semibold">
                {focus === "stack" ? "Full stack" : focus === "pivot" ? "Pivot only" : "5-bar scan"} ·{" "}
                {symbol}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="text-xs text-muted">
                  <tr className="border-b border-line">
                    <th className="px-3 py-2 font-medium">Signal</th>
                    <th className="px-3 py-2 font-medium">Setup</th>
                    <th className="px-3 py-2 font-medium">Vol</th>
                    <th className="px-3 py-2 font-medium">Action</th>
                    <th className="px-3 py-2 font-medium">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {log.length === 0 ? (
                    <tr>
                      <td className="px-3 py-6 text-muted" colSpan={5}>
                        No setups on this market in the kept log. The desk skipped them.
                      </td>
                    </tr>
                  ) : (
                    log.map((d) => (
                      <tr key={`${d.bar}-${d.symbol}`} className="border-b border-line last:border-0">
                        <td className={`px-3 py-2 font-mono ${d.signal === "LONG" ? "text-up" : "text-down"}`}>
                          {d.signal}
                        </td>
                        <td className="px-3 py-2 text-muted">{d.kind}</td>
                        <td className="px-3 py-2 font-mono">{d.volumeRatio.toFixed(2)}×</td>
                        <td className={`px-3 py-2 font-mono ${d.action === "PAPER" ? "text-up" : "text-warn"}`}>
                          {d.action}
                        </td>
                        <td className="px-3 py-2 text-muted">{d.why}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <p className="pb-6 text-sm text-muted">
            Simulated history, not a live exchange. A veto is the point: most MACD ideas die at the risk gate
            or the skeptic before size is applied. Nothing here places a real order.
          </p>
        </div>
      </div>
    </main>
  );
}

function AgentCard({
  title,
  body,
  meta,
  tone,
}: {
  title: string;
  body: string;
  meta: string;
  tone: "up" | "down" | "muted";
}) {
  const color = tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-muted";
  return (
    <article className="rounded-lg border border-line bg-surface p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-xs font-semibold tracking-wide text-muted">{title.toUpperCase()}</h3>
        <span className={`font-mono text-xs ${color}`}>{meta}</span>
      </div>
      <p className="mt-2 text-sm leading-snug">{body}</p>
    </article>
  );
}

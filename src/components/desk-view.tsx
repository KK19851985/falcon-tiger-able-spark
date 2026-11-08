import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowLeftRight,
  CandlestickChart,
  Clock,
  Database,
  FileBarChart,
  FlaskConical,
  LineChart,
  PieChart,
  Play,
} from "lucide-react";
import { ColorType, createChart, type CandlestickData, type UTCTimestamp } from "lightweight-charts";
import { runFund, type FundReport } from "@/lib/desk/fund";

const ICONS = {
  tape: Activity,
  exchange: ArrowLeftRight,
  runner: Play,
  lab: FlaskConical,
  signals: LineChart,
  book: PieChart,
  audit: FileBarChart,
  archive: Database,
  clock: Clock,
  chart: CandlestickChart,
} as const;

function dollars(n: number) {
  const sign = n < 0 ? "−" : "";
  return `${sign}$${Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

function price(n: number) {
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (n >= 1) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return n.toLocaleString("en-US", { maximumFractionDigits: 4 });
}

export function DeskView() {
  const fund = useMemo(() => runFund(), []);
  const [symbol, setSymbol] = useState(fund.quotes[0]?.symbol ?? "BTC/USD");
  const [agentId, setAgentId] = useState("lab");
  const [clock, setClock] = useState<"5m" | "15m" | "1h" | "1D">("1D");
  const [awake, setAwake] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setAwake((value) => value + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);
  const agent = fund.agents.find((row) => row.id === agentId) ?? fund.agents[0]!;
  const quote = fund.quotes.find((row) => row.symbol === symbol) ?? fund.quotes[0]!;
  const frame = fund.frames.find((row) => row.id === clock) ?? fund.frames[0]!;
  const signal = fund.signals.find((row) => row.symbol === symbol);

  return (
    <main className="min-h-screen overflow-x-hidden bg-bg text-fg">
      <header className="border-b border-line px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-xs tracking-wide text-muted">PAPER DESK</p>
            <h1 className="text-lg font-semibold tracking-tight">Ten agents, one book</h1>
          </div>
          <p className="font-mono text-xs text-muted">
            {fund.champion ? fund.champion : "cash"} · {dollars(fund.equity)} · awake{" "}
            {awake === 0 ? "now" : `${awake * 30}s`}
          </p>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6">
        <p className="text-sm text-muted">{fund.mission}</p>

        <div className="grid gap-4 lg:grid-cols-[200px_1fr]">
          <section className="rounded-lg border border-line bg-surface p-3">
            <h2 className="mb-2 text-xs font-semibold tracking-wide text-muted">MARKETS</h2>
            <ul className="flex flex-col gap-1">
              {fund.quotes.map((row) => (
                <li key={row.symbol}>
                  <button
                    type="button"
                    onClick={() => setSymbol(row.symbol)}
                    className={`flex min-h-11 w-full items-center justify-between rounded-md px-3 py-2 text-left ${
                      row.symbol === symbol ? "bg-surface-2" : "hover:bg-surface-2"
                    }`}
                  >
                    <span className="text-sm font-medium">{row.symbol.replace("/USD", "")}</span>
                    <span className={`font-mono text-xs ${row.changePct >= 0 ? "text-up" : "text-down"}`}>
                      {row.changePct >= 0 ? "+" : ""}
                      {row.changePct.toFixed(2)}%
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 font-mono text-xs text-muted">
              {quote.symbol} {price(quote.last)}
              {signal ? ` · RSI ${signal.rsi.toFixed(0)}` : ""}
            </p>
          </section>
          <section className="rounded-lg border border-line bg-surface p-3">
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-sm font-semibold">
                {symbol.replace("/USD", "")} {frame.label.toLowerCase()}
              </h2>
              <div className="flex items-center gap-2">
                {fund.frames.map((row) => (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setClock(row.id)}
                    className={`min-h-11 rounded-md px-3 font-mono text-xs ${
                      row.id === clock ? "bg-surface-2 text-fg" : "text-muted"
                    }`}
                  >
                    {row.id}
                  </button>
                ))}
              </div>
            </div>
            <p className="mb-2 font-mono text-xs text-muted">
              {frame.span}
              <span> · </span>
              <span className="text-fg">20 EMA</span>
              <span> · </span>
              <span className="text-warn">30 EMA</span>
              <span> · V-Pro 34/9 · waves 5, 25, 50 averaged by 4</span>
            </p>
            <CandlePane bars={frame.candles[symbol] ?? []} />
          </section>
        </div>

        <section className="rounded-lg border border-line bg-surface p-3">
          <h2 className="text-sm font-semibold">Classic MACD</h2>
          <p className="mt-1 text-sm text-muted">The standard inputs. The desk’s own MACD rule is still 8, 30, and 10, and it is not in the book.</p>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              ["Fast length", "12"],
              ["Slow length", "26"],
              ["Source", "Close"],
              ["Signal smoothing", "9"],
              ["Oscillator", "EMA"],
              ["Signal line", "EMA"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-3 rounded-md bg-surface-2 px-3 py-2">
                <dt className="text-sm">{label}</dt>
                <dd className="font-mono text-sm">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="mb-2 text-xs font-semibold tracking-wide text-muted">AGENTS</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {fund.agents.map((row) => {
              const Icon = ICONS[row.id as keyof typeof ICONS] ?? Activity;
              const on = row.id === agent.id;
              return (
                <li key={row.id}>
                  <button
                    type="button"
                    onClick={() => setAgentId(row.id)}
                    className={`flex min-h-11 w-full gap-3 rounded-lg border p-3 text-left ${
                      on ? "border-up bg-surface" : "border-line bg-surface hover:bg-surface-2"
                    }`}
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="text-sm font-medium">{row.name}</span>
                        <span
                          className={`font-mono text-xs ${
                            row.state === "working" ? "text-up" : row.state === "blocked" ? "text-warn" : "text-muted"
                          }`}
                        >
                          {row.state}
                        </span>
                      </span>
                      <span className="mt-0.5 block font-mono text-xs text-muted">{row.library}</span>
                      <span className="mt-1 block text-sm text-muted">{row.brief}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-lg border border-line bg-surface p-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold">
              {agent.name} · {agent.library}
            </h2>
            <p
              className={`font-mono text-xs ${
                agent.state === "working" ? "text-up" : agent.state === "blocked" ? "text-warn" : "text-muted"
              }`}
            >
              {agent.state}
            </p>
          </div>
          <p className="mt-2 text-sm">{agent.brief}</p>
          <AgentBody fund={fund} agentId={agent.id} symbol={symbol} />
        </section>

        <section className="rounded-lg border border-line bg-surface p-3">
          <h2 className="text-sm font-semibold">Alone, then together</h2>
          <p className="mt-2 text-sm text-muted">
            A pair is compared with its parts on the older days. Only V-Pro with the 20/30 EMA, all five agreeing, and a
            majority of the five are scored on the later days.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-xs">
              <thead className="text-muted">
                <tr>
                  <th className="py-1 pr-3 font-medium">Rule</th>
                  <th className="py-1 pr-3 font-medium">Fit</th>
                  <th className="py-1 pr-3 font-medium">Unseen</th>
                  <th className="py-1 pr-3 font-medium">Wins</th>
                  <th className="py-1 font-medium">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {fund.trials.map((trial) => (
                  <tr key={trial.name} className="border-t border-line font-mono">
                    <td className="py-1 pr-3">{trial.name}</td>
                    <td className={`py-1 pr-3 ${trial.trainProfit >= 0 ? "text-up" : "text-down"}`}>
                      {dollars(trial.trainProfit)}
                    </td>
                    <td className={`py-1 pr-3 ${trial.tested && trial.testProfit >= 0 ? "text-up" : trial.tested ? "text-down" : "text-muted"}`}>
                      {trial.tested ? dollars(trial.testProfit) : "—"}
                    </td>
                    <td className="py-1 pr-3 text-muted">
                      {trial.tested ? `${trial.testWins}/${trial.testTrades}` : "—"}
                    </td>
                    <td className={`py-1 ${trial.verdict === "LIVE" ? "text-up" : "text-down"}`}>{trial.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function AgentBody({ fund, agentId, symbol }: { fund: FundReport; agentId: string; symbol: string }) {
  if (agentId === "tape") {
    return (
      <ul className="mt-3 flex flex-col gap-1 font-mono text-xs">
        {fund.quotes.map((row) => (
          <li key={row.symbol} className="flex justify-between gap-2">
            <span>{row.symbol}</span>
            <span className={row.changePct >= 0 ? "text-up" : "text-down"}>
              {price(row.last)} {row.changePct >= 0 ? "+" : ""}
              {row.changePct.toFixed(2)}%
            </span>
          </li>
        ))}
      </ul>
    );
  }
  if (agentId === "signals") {
    const row = fund.signals.find((item) => item.symbol === symbol) ?? fund.signals[0];
    if (!row) return null;
    return (
      <p className="mt-3 font-mono text-xs text-muted">
        {row.symbol} RSI {row.rsi.toFixed(1)} · MACD {row.macd.toFixed(1)} · EMA {price(row.emaFast)} /{" "}
        {price(row.emaSlow)}
      </p>
    );
  }
  if (agentId === "book" || agentId === "runner") {
    return (
      <ul className="mt-3 flex flex-col gap-1 font-mono text-xs">
        {fund.positions.map((row) => (
          <li key={row.symbol} className="flex justify-between gap-2">
            <span>{row.symbol.replace("/USD", "")}</span>
            <span className={row.side === "LONG" ? "text-up" : row.side === "SHORT" ? "text-down" : "text-muted"}>
              {row.side}
              {row.weight > 0 ? ` ${(row.weight * 100).toFixed(0)}%` : ""}
            </span>
          </li>
        ))}
      </ul>
    );
  }
  if (agentId === "clock") {
    return (
      <ul className="mt-3 flex flex-col gap-1 font-mono text-xs">
        {fund.jobs.map((job) => (
          <li key={job.name} className="flex justify-between gap-2">
            <span>{job.name}</span>
            <span className="text-muted">every {job.every}</span>
          </li>
        ))}
      </ul>
    );
  }
  if (agentId === "audit") {
    return <p className="mt-3 text-sm text-muted">{fund.audit.note}</p>;
  }
  if (agentId === "archive") {
    return fund.ledger.length === 0 ? (
      <p className="mt-3 text-sm text-muted">Ledger is empty.</p>
    ) : (
      <p className="mt-3 font-mono text-xs text-muted">{fund.ledger.length} unseen fills stored.</p>
    );
  }
  if (agentId === "lab") {
    const killed = fund.trials.filter((trial) => trial.verdict === "KILLED").length;
    return (
      <p className="mt-3 text-sm text-muted">
        {killed} of {fund.trials.length} rules failed the unseen test. The kill list is below the chart.
      </p>
    );
  }
  return null;
}

function CandlePane({
  bars,
}: {
  bars: {
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
  }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const style = getComputedStyle(document.documentElement);
    const surface = style.getPropertyValue("--color-surface").trim();
    const muted = style.getPropertyValue("--color-muted").trim();
    const line = style.getPropertyValue("--color-line").trim();
    const fg = style.getPropertyValue("--color-fg").trim();
    const warn = style.getPropertyValue("--color-warn").trim();
    const up = style.getPropertyValue("--color-up").trim();
    const down = style.getPropertyValue("--color-down").trim();
    const chart = createChart(node, {
      width: node.clientWidth,
      height: 460,
      layout: { background: { type: ColorType.Solid, color: surface }, textColor: muted },
      grid: { vertLines: { color: line }, horzLines: { color: line } },
      rightPriceScale: { borderColor: line, scaleMargins: { top: 0.06, bottom: 0.32 } },
      timeScale: { borderColor: line },
    });
    const series = chart.addCandlestickSeries({
      upColor: up,
      downColor: down,
      borderVisible: false,
      wickUpColor: up,
      wickDownColor: down,
    });
    const fast = chart.addLineSeries({ color: fg, lineWidth: 2, priceLineVisible: false, lastValueVisible: false });
    const slow = chart.addLineSeries({ color: warn, lineWidth: 2, priceLineVisible: false, lastValueVisible: false });
    const impulse = chart.addHistogramSeries({
      priceScaleId: "vpro",
      priceLineVisible: false,
      lastValueVisible: false,
    });
    chart.priceScale("vpro").applyOptions({
      scaleMargins: { top: 0.74, bottom: 0 },
      borderColor: line,
    });
    const impulseSignal = chart.addLineSeries({
      priceScaleId: "vpro",
      color: fg,
      lineWidth: 1,
      priceLineVisible: false,
      lastValueVisible: false,
    });
    const points = bars.map((bar) => ({ ...bar, time: bar.time as UTCTimestamp }));
    series.setData(points satisfies CandlestickData[]);
    fast.setData(points.map((bar) => ({ time: bar.time, value: bar.ema20 })));
    slow.setData(points.map((bar) => ({ time: bar.time, value: bar.ema50 })));
    impulse.setData(
      points.map((bar) => ({
        time: bar.time,
        value: bar.vpro,
        color: bar.vpro >= 0 ? up : down,
      })),
    );
    impulseSignal.setData(
      points.filter((bar) => Number.isFinite(bar.vproSignal)).map((bar) => ({ time: bar.time, value: bar.vproSignal })),
    );
    const markers = [];
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]!;
      const bar = points[i]!;
      if (prev.pair !== "LONG" && bar.pair === "LONG") {
        markers.push({ time: bar.time, position: "belowBar" as const, color: up, shape: "arrowUp" as const });
      } else if (prev.pair !== "SHORT" && bar.pair === "SHORT") {
        markers.push({ time: bar.time, position: "aboveBar" as const, color: down, shape: "arrowDown" as const });
      } else if (prev.pair === "SHORT" && bar.pair !== "SHORT") {
        markers.push({ time: bar.time, position: "aboveBar" as const, color: warn, shape: "circle" as const });
      }
    }
    series.setMarkers(markers);
    chart.timeScale().fitContent();
    const observer = new ResizeObserver(() => {
      chart.applyOptions({ width: node.clientWidth });
      chart.timeScale().fitContent();
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, [bars]);
  return <div ref={ref} className="h-[29rem] w-full" />;
}

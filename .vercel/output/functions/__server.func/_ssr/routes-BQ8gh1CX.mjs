import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as CartesianGrid, i as Line, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BQ8gh1CX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SYMBOLS = [
	"BTC/USDT",
	"ETH/USDT",
	"SOL/USDT",
	"ARB/USDT"
];
var DESK_SYMBOLS = SYMBOLS;
var START = {
	"BTC/USDT": 67200,
	"ETH/USDT": 3480,
	"SOL/USDT": 168,
	"ARB/USDT": .82
};
function mulberry32(seed) {
	let a = seed >>> 0;
	return () => {
		a |= 0;
		a = a + 1831565813 | 0;
		let t = Math.imul(a ^ a >>> 15, 1 | a);
		t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function buildSeries(symbol, bars = 2200) {
	const rand = mulberry32(symbol.split("").reduce((n, c) => n + c.charCodeAt(0) * 17, 9041));
	const out = [];
	let price = START[symbol];
	let drift = 4e-5;
	const start = Date.UTC(2026, 4, 1);
	for (let i = 0; i < bars; i++) {
		if (i % 180 === 0) drift = (rand() - .48) * 35e-5;
		const shock = rand() < .012 ? (rand() - .5) * .018 : 0;
		const ret = drift + (rand() - .5) * .0042 + shock;
		const open = price;
		const close = Math.max(.01, open * (1 + ret));
		const wick = Math.abs(ret) * open * (.4 + rand());
		const high = Math.max(open, close) + wick * rand();
		const low = Math.min(open, close) - wick * rand();
		const volume = (.6 + rand() * 1.4) * (1 + Math.min(4, Math.abs(ret) * 180));
		out.push({
			t: start + i * 15 * 60 * 1e3,
			open,
			high,
			low,
			close,
			volume
		});
		price = close;
	}
	return out;
}
function ema(values, span) {
	const k = 2 / (span + 1);
	const out = new Array(values.length);
	let prev = values[0] ?? 0;
	for (let i = 0; i < values.length; i++) {
		prev = i === 0 ? values[i] : values[i] * k + prev * (1 - k);
		out[i] = prev;
	}
	return out;
}
function pack(bars) {
	const close = bars.map((b) => b.close);
	const line = ema(close, 12).map((v, i) => v - ema(close, 26)[i]);
	const sig = ema(line, 9);
	const hist = line.map((v, i) => v - sig[i]);
	const volSma = bars.map((_, i) => {
		if (i < 19) return bars[i].volume;
		let s = 0;
		for (let k = i - 19; k <= i; k++) s += bars[k].volume;
		return s / 20;
	});
	const atr = bars.map((b, i) => {
		const prev = i === 0 ? b.close : bars[i - 1].close;
		const tr = Math.max(b.high - b.low, Math.abs(b.high - prev), Math.abs(b.low - prev));
		if (i === 0) return tr;
		return atrPrev(bars, i, tr);
	});
	function atrPrev(src, i, tr) {
		const from = Math.max(0, i - 13);
		let s = 0;
		let n = 0;
		for (let k = from; k <= i; k++) {
			const p = k === 0 ? src[0].close : src[k - 1].close;
			s += Math.max(src[k].high - src[k].low, Math.abs(src[k].high - p), Math.abs(src[k].low - p));
			n++;
		}
		return s / n || tr;
	}
	return {
		bars,
		macd: line,
		signal: sig,
		hist,
		volSma,
		atr
	};
}
function pivots(p, kind, left = 3, right = 3) {
	const out = [];
	const n = p.bars.length;
	for (let i = left; i < n - right; i++) {
		let ok = true;
		for (let k = i - left; k <= i + right; k++) {
			if (k === i) continue;
			const a = kind === "low" ? p.bars[k].low : p.bars[k].high;
			const b = kind === "low" ? p.bars[i].low : p.bars[i].high;
			if (kind === "low" ? a < b : a > b) ok = false;
		}
		if (ok) out.push({
			i,
			price: kind === "low" ? p.bars[i].low : p.bars[i].high,
			hist: p.hist[i]
		});
	}
	return out;
}
function volRatio(p, i) {
	const base = p.volSma[i] || 1;
	return p.bars[i].volume / base;
}
function crudeAt(p, i) {
	if (i < 30) return neutral(p, i, "warming up");
	const lows = p.bars.slice(i - 5, i).map((b) => b.low);
	const highs = p.bars.slice(i - 5, i).map((b) => b.high);
	const hists = p.hist.slice(i - 5, i);
	const vr = volRatio(p, i);
	const crossUp = p.macd[i - 1] <= p.signal[i - 1] && p.macd[i] > p.signal[i];
	const crossDn = p.macd[i - 1] >= p.signal[i - 1] && p.macd[i] < p.signal[i];
	const bullConv = p.bars[i].low < Math.min(...lows) && p.hist[i] > Math.min(...hists) && p.hist[i] < 0;
	const bearConv = p.bars[i].high > Math.max(...highs) && p.hist[i] < Math.max(...hists) && p.hist[i] > 0;
	let signal = "NEUTRAL";
	let kind = "none";
	if ((crossUp || bullConv) && vr > 1.25) {
		signal = "LONG";
		kind = bullConv ? "5-bar convergence" : "MACD cross";
	} else if ((crossDn || bearConv) && vr > 1.25) {
		signal = "SHORT";
		kind = bearConv ? "5-bar convergence" : "MACD cross";
	}
	return {
		signal,
		confidence: signal === "NEUTRAL" ? 0 : Math.min(100, 40 + (vr > 1.5 ? 25 : 10) + (bullConv || bearConv ? 20 : 0)),
		kind,
		volumeRatio: vr,
		histogram: p.hist[i],
		reasoning: signal === "NEUTRAL" ? "No 5-bar confluence" : `${kind}, volume ${vr.toFixed(2)}×`
	};
}
function confirmedDivergence(list, i, right, side) {
	const ready = list.filter((pv) => pv.i + right <= i);
	if (ready.length < 2) return null;
	const b = ready[ready.length - 1];
	if (b.i + right !== i) return null;
	const a = ready[ready.length - 2];
	if (side === "bull" && b.price < a.price && b.hist > a.hist && b.hist < 0) return {
		a,
		b
	};
	if (side === "bear" && b.price > a.price && b.hist < a.hist && b.hist > 0) return {
		a,
		b
	};
	return null;
}
function pivotAt(p, lows, highs, i) {
	if (i < 40) return neutral(p, i, "warming up");
	const vr = volRatio(p, i);
	const bull = confirmedDivergence(lows, i, 3, "bull");
	const bear = confirmedDivergence(highs, i, 3, "bear");
	const histUp = p.hist[i] > p.hist[i - 1];
	let signal = "NEUTRAL";
	let kind = "none";
	if (bull && vr > 1.25) {
		signal = "LONG";
		kind = "regular bullish divergence";
	} else if (bear && vr > 1.25) {
		signal = "SHORT";
		kind = "regular bearish divergence";
	}
	let confidence = 0;
	if (signal !== "NEUTRAL") {
		confidence += 50;
		confidence += vr >= 1.5 ? 25 : 10;
		if (signal === "LONG" && histUp || signal === "SHORT" && !histUp) confidence += 15;
	}
	return {
		signal,
		confidence: Math.min(100, confidence),
		kind,
		volumeRatio: vr,
		histogram: p.hist[i],
		reasoning: signal === "NEUTRAL" ? "No confirmed pivot divergence" : `${kind} · vol ${vr.toFixed(2)}× · hist ${p.hist[i].toFixed(4)}`
	};
}
function pHistUp(p, i) {
	return p.hist[i] > p.hist[i - 1];
}
function neutral(p, i, why) {
	return {
		signal: "NEUTRAL",
		confidence: 0,
		kind: "none",
		volumeRatio: volRatio(p, i),
		histogram: p.hist[i] ?? 0,
		reasoning: why
	};
}
function stopTarget(p, i, side, entry) {
	const atr = p.atr[i] || entry * .004;
	const risk = Math.max(atr * 1.4, entry * .0025);
	if (side === "LONG") return {
		stop: entry - risk,
		target: entry + risk * 2,
		risk
	};
	return {
		stop: entry + risk,
		target: entry - risk * 2,
		risk
	};
}
function runMode(books, piv, mode) {
	const symbols = Object.keys(books);
	const n = books[symbols[0]].bars.length;
	let equity = 1e4;
	let peak = equity;
	let maxDd = 0;
	let dayStart = equity;
	let dayPnl = 0;
	let dayIndex = -1;
	const cooldown = /* @__PURE__ */ new Map();
	const open = [];
	const trades = [];
	const decisions = [];
	const equityCurve = [{
		i: 40,
		equity
	}];
	let vetoes = 0;
	let signals = 0;
	const mark = (px, pos) => pos.side === "LONG" ? (px - pos.entry) / pos.risk : (pos.entry - px) / pos.risk;
	for (let i = 40; i < n - 1; i++) {
		const day = Math.floor(i / 96);
		if (day !== dayIndex) {
			dayIndex = day;
			dayStart = equity;
			dayPnl = 0;
		}
		for (let k = open.length - 1; k >= 0; k--) {
			const pos = open[k];
			const bar = books[pos.symbol].bars[i];
			let exitPx = null;
			if (pos.side === "LONG") {
				if (bar.low <= pos.stop) exitPx = pos.stop;
				else if (bar.high >= pos.target) exitPx = pos.target;
			} else if (bar.high >= pos.stop) exitPx = pos.stop;
			else if (bar.low <= pos.target) exitPx = pos.target;
			if (exitPx == null && i - pos.opened >= 16) exitPx = bar.close;
			if (exitPx != null) {
				const r = mark(exitPx, pos);
				const pnl = equity * .01 * r;
				equity += pnl;
				dayPnl += pnl;
				trades.push({
					symbol: pos.symbol,
					side: pos.side,
					entry: pos.entry,
					exit: exitPx,
					r,
					bars: i - pos.opened,
					win: r > 0
				});
				open.splice(k, 1);
				cooldown.set(pos.symbol, i + 8);
			}
		}
		for (const symbol of symbols) {
			const book = books[symbol];
			const tech = mode === "crude" ? crudeAt(book, i) : pivotAt(book, piv[symbol].lows, piv[symbol].highs, i);
			if (tech.signal === "NEUTRAL") continue;
			signals++;
			const cd = cooldown.get(symbol) ?? 0;
			const occupied = open.some((o) => o.symbol === symbol);
			let riskPass = true;
			let riskReason = "size 1% · stop 1.4 ATR · target 2R";
			if (occupied) {
				riskPass = false;
				riskReason = "already in this market";
			} else if (dayPnl < -dayStart * .02) {
				riskPass = false;
				riskReason = "daily loss limit −2%";
			} else if (open.length >= 3) {
				riskPass = false;
				riskReason = "max 3 open positions";
			} else if (i < cd) {
				riskPass = false;
				riskReason = "cooldown";
			}
			const histAgrees = tech.signal === "LONG" && pHistUp(books[symbol], i) || tech.signal === "SHORT" && !pHistUp(books[symbol], i);
			const objections = [];
			if (tech.confidence < 80) objections.push(`confidence ${tech.confidence} < 80`);
			if (tech.volumeRatio < 1.7) objections.push(`volume ${tech.volumeRatio.toFixed(2)}× < 1.7`);
			if (!histAgrees) objections.push("histogram not expanding with price");
			if (!tech.kind.includes("divergence") && !tech.kind.includes("convergence")) objections.push("no structural divergence");
			const kill = objections.length >= 2;
			const skepticReason = kill ? objections.join("; ") : "clean enough to paper";
			let action = "PAPER";
			let why = tech.reasoning;
			if (occupied || i < cd) {
				action = "REJECT";
				why = occupied ? "already in this market" : "cooldown";
			} else if (mode === "stack" && !riskPass) {
				action = "REJECT";
				why = riskReason;
				vetoes++;
			} else if (mode === "stack" && kill) {
				action = "REJECT";
				why = skepticReason;
				vetoes++;
			}
			const price = book.bars[i].close;
			if (decisions.length < 4e3) decisions.push({
				symbol,
				bar: i,
				time: book.bars[i].t,
				price,
				signal: tech.signal,
				confidence: tech.confidence,
				kind: tech.kind,
				volumeRatio: tech.volumeRatio,
				risk: mode === "stack" ? riskReason : "bypassed",
				skeptic: mode === "stack" ? skepticReason : "bypassed",
				action,
				why
			});
			if (action === "PAPER") {
				const fill = book.bars[i + 1].open;
				const { stop, target, risk } = stopTarget(book, i, tech.signal, fill);
				open.push({
					symbol,
					side: tech.signal,
					entry: fill,
					stop,
					target,
					risk,
					opened: i + 1
				});
			}
		}
		if (i % 8 === 0) {
			peak = Math.max(peak, equity);
			maxDd = Math.max(maxDd, peak > 0 ? (peak - equity) / peak : 0);
			equityCurve.push({
				i,
				equity
			});
		}
	}
	const wins = trades.filter((t) => t.win).length;
	const avgR = trades.length ? trades.reduce((s, t) => s + t.r, 0) / trades.length : 0;
	return {
		mode,
		trades,
		vetoes,
		signals,
		equity: equityCurve,
		decisions,
		winRate: trades.length ? wins / trades.length : 0,
		avgR,
		returnPct: (equity / 1e4 - 1) * 100,
		maxDd
	};
}
var cached = null;
function getDesk() {
	if (cached) return cached;
	const series = {};
	const books = {};
	const piv = {};
	for (const s of SYMBOLS) {
		series[s] = buildSeries(s);
		books[s] = pack(series[s]);
		piv[s] = {
			lows: pivots(books[s], "low"),
			highs: pivots(books[s], "high")
		};
	}
	const reports = {
		crude: runMode(books, piv, "crude"),
		pivot: runMode(books, piv, "pivot"),
		stack: runMode(books, piv, "stack")
	};
	const latest = {};
	const last = series[SYMBOLS[0]].length - 4;
	for (const s of SYMBOLS) {
		const tech = pivotAt(books[s], piv[s].lows, piv[s].highs, last);
		latest[s] = {
			tech,
			risk: tech.signal === "NEUTRAL" ? "no order" : "size 1% · daily loss −2% · max 3",
			skeptic: tech.confidence >= 75 && tech.volumeRatio >= 1.5 ? "let it through" : tech.signal === "NEUTRAL" ? "nothing to attack" : "confidence or volume too thin",
			action: tech.signal !== "NEUTRAL" && tech.confidence >= 80 && tech.volumeRatio >= 1.7 ? "PAPER" : "REJECT"
		};
	}
	cached = {
		series,
		reports,
		latest
	};
	return cached;
}
var MODES = [
	{
		id: "crude",
		label: "5-bar scan"
	},
	{
		id: "pivot",
		label: "Pivot only"
	},
	{
		id: "stack",
		label: "Full stack"
	}
];
function money(n) {
	return `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
}
function pct(n) {
	return `${(n * 100).toFixed(1)}%`;
}
function DeskView() {
	const desk = (0, import_react.useMemo)(() => getDesk(), []);
	const [symbol, setSymbol] = (0, import_react.useState)("BTC/USDT");
	const [focus, setFocus] = (0, import_react.useState)("stack");
	const chart = (0, import_react.useMemo)(() => {
		const a = desk.reports.crude.equity;
		const b = desk.reports.pivot.equity;
		const c = desk.reports.stack.equity;
		const len = Math.min(a.length, b.length, c.length);
		return Array.from({ length: len }, (_, i) => ({
			i: a[i].i,
			crude: Math.round(a[i].equity),
			pivot: Math.round(b[i].equity),
			stack: Math.round(c[i].equity)
		}));
	}, [desk]);
	const log = desk.reports[focus].decisions.filter((d) => d.symbol === symbol).slice(-12).reverse();
	const live = desk.latest[symbol];
	const lastBar = desk.series[symbol][desk.series[symbol].length - 1];
	const prev = desk.series[symbol][desk.series[symbol].length - 2];
	const chg = (lastBar.close - prev.close) / prev.close * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-screen overflow-x-hidden bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-line px-4 py-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-9 w-9 place-items-center rounded-full border border-up/50 bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full bg-up" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-lg font-semibold tracking-tight",
						children: "Pivot Desk"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Paper only · 15-minute MACD desk"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-up",
					children: "dry-run · risk and skeptic armed"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid min-w-0 max-w-6xl gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[220px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border border-line bg-surface p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-2 text-xs font-semibold tracking-wide text-muted",
					children: "MARKETS"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-1",
					children: DESK_SYMBOLS.map((s) => {
						const bars = desk.series[s];
						const c = bars[bars.length - 1].close;
						const p = bars[bars.length - 2].close;
						const d = (c - p) / p * 100;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSymbol(s),
							className: `flex w-full items-center justify-between rounded-md px-3 py-2 text-left ${s === symbol ? "bg-surface-2" : "hover:bg-surface-2"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: s.replace("/USDT", "")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `font-mono text-xs ${d >= 0 ? "text-up" : "text-down"}`,
								children: [
									d >= 0 ? "+" : "",
									d.toFixed(2),
									"%"
								]
							})]
						}) }, s);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "grid gap-3 sm:grid-cols-3",
						children: MODES.map((m) => {
							const r = desk.reports[m.id];
							const on = focus === m.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setFocus(m.id),
								className: `rounded-lg border p-3 text-left ${on ? "border-up bg-surface" : "border-line bg-surface"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: m.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: `mt-1 font-mono text-2xl ${r.returnPct >= 0 ? "text-up" : "text-down"}`,
										children: money(r.returnPct)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 font-mono text-xs text-muted",
										children: [
											r.trades.length,
											" trades · win ",
											pct(r.winRate),
											" · avg ",
											r.avgR.toFixed(2),
											"R"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-mono text-xs text-muted",
										children: [
											"max DD ",
											(r.maxDd * 100).toFixed(1),
											"%",
											m.id === "stack" ? ` · ${r.vetoes} vetoes` : ""
										]
									})
								]
							}, m.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-lg border border-line bg-surface p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-semibold",
									children: "Equity, same history, three filters"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-xs text-muted",
									children: [
										symbol.split("/")[0],
										" ",
										lastBar.close.toFixed(symbol.startsWith("ARB") ? 4 : 2),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: chg >= 0 ? "text-up" : "text-down",
											children: [
												chg >= 0 ? "+" : "",
												chg.toFixed(2),
												"%"
											]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-56 w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
										data: chart,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
												stroke: "var(--color-line)",
												vertical: false
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "i",
												hide: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
												stroke: "var(--color-muted)",
												tick: {
													fill: "var(--color-muted)",
													fontSize: 11
												},
												width: 48,
												domain: ["auto", "auto"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
												background: "var(--color-surface-2)",
												border: "1px solid var(--color-line)",
												borderRadius: 8,
												fontSize: 12
											} }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
												type: "monotone",
												dataKey: "crude",
												stroke: "var(--color-muted)",
												dot: false,
												strokeWidth: 1.5
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
												type: "monotone",
												dataKey: "pivot",
												stroke: "var(--color-warn)",
												dot: false,
												strokeWidth: 1.5
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
												type: "monotone",
												dataKey: "stack",
												stroke: "var(--color-up)",
												dot: false,
												strokeWidth: 2
											})
										]
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-mono text-xs text-muted",
								children: "grey 5-bar · gold pivot divergence · green full stack (risk + skeptic)"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "grid gap-3 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentCard, {
								title: "Technical",
								body: live.tech.reasoning,
								meta: live.tech.signal === "NEUTRAL" ? "NEUTRAL" : `${live.tech.signal} ${live.tech.confidence}`,
								tone: live.tech.signal === "NEUTRAL" ? "muted" : "up"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentCard, {
								title: "Risk",
								body: live.risk,
								meta: "gate",
								tone: "muted"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentCard, {
								title: "Skeptic",
								body: live.skeptic,
								meta: live.action,
								tone: live.action === "PAPER" ? "up" : "down"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "min-w-0 overflow-hidden rounded-lg border border-line bg-surface",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-b border-line px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-sm font-semibold",
								children: [
									focus === "stack" ? "Full stack" : focus === "pivot" ? "Pivot only" : "5-bar scan",
									" ·",
									" ",
									symbol
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full min-w-[640px] text-left text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "text-xs text-muted",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-line",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2 font-medium",
												children: "Signal"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2 font-medium",
												children: "Setup"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2 font-medium",
												children: "Vol"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2 font-medium",
												children: "Action"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-3 py-2 font-medium",
												children: "Why"
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: log.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-6 text-muted",
									colSpan: 5,
									children: "No setups on this market in the kept log. The desk skipped them."
								}) }) : log.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-line last:border-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: `px-3 py-2 font-mono ${d.signal === "LONG" ? "text-up" : "text-down"}`,
											children: d.signal
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-muted",
											children: d.kind
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-3 py-2 font-mono",
											children: [d.volumeRatio.toFixed(2), "×"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: `px-3 py-2 font-mono ${d.action === "PAPER" ? "text-up" : "text-warn"}`,
											children: d.action
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-3 py-2 text-muted",
											children: d.why
										})
									]
								}, `${d.bar}-${d.symbol}`)) })]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pb-6 text-sm text-muted",
						children: "Simulated history, not a live exchange. A veto is the point: most MACD ideas die at the risk gate or the skeptic before size is applied. Nothing here places a real order."
					})
				]
			})]
		})]
	});
}
function AgentCard({ title, body, meta, tone }) {
	const color = tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-muted";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-lg border border-line bg-surface p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-xs font-semibold tracking-wide text-muted",
				children: title.toUpperCase()
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `font-mono text-xs ${color}`,
				children: meta
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-snug",
			children: body
		})]
	});
}
var SplitComponent = DeskView;
//#endregion
export { SplitComponent as component };

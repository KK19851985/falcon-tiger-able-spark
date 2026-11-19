# MACD Signal Lab

Pine v6 indicator: `macd_signal_lab.pine`. It grades six MACD events on the chart you have loaded. The archive test, with train, holdout, and the skeptic, is `docs/MACD_SIGNAL_STUDY.md`. The indicator does not see bars the chart did not load.

## Add it

1. Open a chart in TradingView and set the timeframe you care about (15m, 1h, 4h, or 1D).
2. Pine Editor → open `macd_signal_lab.pine` → paste → Add to chart.
3. Scroll the chart back as far as TradingView will load. A short viewport is a short sample.
4. Read the two tables in the MACD pane.

## How to read the tables

The left table grades every signal. The right table grades only the signals that pass the filters you turned on. With every filter off, the two tables match.

Columns, one per signal type:

| Mark | Event |
| --- | --- |
| X+<0 | MACD crosses above its signal while the MACD line is below zero |
| X+>0 | Same cross, MACD line at or above zero |
| X->0 | MACD crosses below its signal while the MACD line is above zero |
| X-<0 | Same cross, MACD line below zero |
| 0+ | MACD line crosses above zero |
| 0- | MACD line crosses below zero |

- **N** is every graded trade, including timeouts.
- **Hit%** is how often the target printed before the stop. A timeout stays in the denominator. It is not a failed stop.
- **BE%** is the hit rate that would break even after the fee and slippage you typed, for this target and stop. At 1.5 ATR versus 1 ATR, that number is about 40 before costs and higher after them. A hit rate of 55 is not the bar.
- **AvgR** is the average result in R after costs. One R is the distance from the fill to the stop.
- **Exp%** is the average percent return after costs, timeouts included at their close.
- **PF** is profit factor on those percent returns.
- **R low** is the bottom of a normal interval around AvgR. Green means that bottom is above zero and N is at least the minimum. Red means the top is below zero. Tan means the interval still covers zero, or N is too small to color. The interval is not a probability.

Labels on the price chart show that type's current AvgR. They use the previous completed trades, not the trade that just opened.

## Costs, fill, and timeout

Default costs are Binance USDT-M taker style: 0.05% and 2 bps of slippage, each side. Change them in the inputs. Both the target and the stop pay the taker schedule.

A cross is read on the bar that just closed. The fill is the next bar's open. A bar that trades both the stop and the target is a stop. If the horizon ends without either, the trade exits at that close.

Each signal type keeps its own queue (default 30 open trades). A signal past the cap is counted under Skip and is not graded. Raise the cap if Skip climbs.

## Filters

Leave them off for the raw grade. Turn one on and compare the right-hand table with the left.

- **EMA200 with the trade** — long only above a rising EMA200, short only below a falling one.
- **Higher-timeframe MACD** — set the timeframe one step up (15 → 60, 60 → 240, 240 → D, D → W). The request does not look ahead. It uses the previous completed higher-timeframe bar.
- **ATR percentile band** — default 0 to 100 does not filter. Narrow it to drop the quiet or the violent end.
- **Histogram moving with the trade** — long needs a rising histogram, short a falling one.
- **Regular divergence** — a lower low in price with a higher low in the histogram, or the mirror on highs. The pivot is confirmed only after its right wing exists.

## Alerts

Each signal type has an alert condition, and a message alert that includes the type's current average R. Create them from the chart's alert dialog. Alerts fire on a confirmed bar.

Nothing in the table is a promise that the next signal makes money. If the archive study did not clear its holdout bar, a green cell on a short chart is not a reason to trade it.

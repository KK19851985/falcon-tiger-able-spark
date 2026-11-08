---
name: desk-learner
description: "Walk-forward learner for the paper trading desk. Use when a tweak, self-learning pass, or an unknown buy/sell decision must be checked against historic bars before it changes the rule."
type: workflow
lifecycle: active
---

# Desk Learner — Keep a tweak only when the next history beats the previous rule

Use this when the desk is asked to learn, tweak a signal, or decide a bar it does not already know. Never replace a rule because the train window liked it.

## Rule that is allowed to learn

Start from histogram expansion only when 10-bar momentum still disagrees. Stop, target, and hold may change. Do not add back volume spikes, RSI, stochastic, a moving-average trend filter, or a MACD cross that agrees with momentum. Those were measured false signals.

## One tweak, then the next block

1. Score the current rule on the train block. That score is the previous result.
2. Change one allowed knob. Reject the change unless the train score beats the previous score by more than 0.02 and the slice has at least 5 trades.
3. Score both the previous rule and that one candidate on the next block of bars. Keep the candidate only if its average R is higher and it has at least 4 trades.
4. Otherwise keep the previous rule. A rejected tweak is not a failure of the loop. Adopting a worse result is.
5. Repeat on the following block. Do not retune on the block that was just used as the test.

The code for this loop is `runMemory` in `src/lib/desk/memory.ts`. Run it. Do not invent a second learner that peeks at the same bars it is scored on.

## Unknown decision

A bar is unknown when the rule is neutral, or the rule fires but similar past bars do not agree.

1. Build the comparison only from bars at least 6 bars earlier. Never use the forward return of the bar being decided.
2. Take the 15 nearest past bars on MACD histogram, histogram slope, and 10-bar momentum.
3. If the rule fired, follow it only when at least 60% of those neighbors moved the same way. Otherwise abstain.
4. If the rule did not fire, trade only when at least 73% of the neighbors moved one way. Otherwise abstain.
5. Report the neighbor count, the agreement, and the reason. An abstain is a result.

## What not to claim

Do not say the bot always makes money. Say it refuses a tweak that loses to the previous rule on the next historic block, and it refuses a live call the past does not confirm.

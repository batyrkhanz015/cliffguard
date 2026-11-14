
## G3 localhost QA — 2026-11-15 (http://localhost:3000, DEMO_UNLOCK_ENABLED=true)

Tester notes: browser viewport was stuck at 606x623 (resize_window had no effect), so "desktop" checks ran at 606 px. Phone checks ran in a same-origin 375 px iframe (373 px inner width). Screenshots could not be saved to docs/screenshots (tool only writes to temp), so none were saved.

| # | Step | Result | Actual figures |
|---|------|--------|----------------|
| 1 | Landing + Try Dani's family | PASS | Hero clear; click led to /result in about 1 s |
| 2 | /result headline, slider, gig | PASS | MAGI $122,036, 379%, headroom $6,564 under $128,600 cliff, repay $1,697, "NO CAP FROM 2026" badge. Slider +$20k: "Over the cliff: you repay $9,342". Offer $12,000 (prefilled): do nothing $1,321, plan $8,548, loss zone $7,064 to $10,232, label "Rough federal estimate (excludes QBI deduction and state tax)" |
| 3 | /plan locked | PASS | Badge "WORTH THE MOVES", Keep my cash toggle, 6 levers with up/down (first-up and last-down disabled, no visible reason text), amounts `$•,•••`, totals: repay now $9,342, after $2,251, net keep $8,548, cash $2,930, locked $0, moved $3,000. Access panel: Year $79/yr, Rescue $59 once, "Unlock Year demo — free" |
| 4 | Unlock, proofs, Explain | PASS with bug | Exact amounts ($3,000 / $1,800 / HSA), how-to, deadlines, proof checkboxes shown once. Ticked proof persisted after reload. Explain gave "CALCULATION-BASED EXPLANATION". See Bug 1 |
| 5 | /plan/export | PASS | "repayment limitation: none for 2026" present; print layout, Print / Save as PDF button |
| 6 | /checkin | PASS | Baseline check-in, then +$3,000: MAGI $122,036 to $124,824, headroom $6,564 to $3,776, repay $1,697 to $1,974, alert text, history table with 2 rows. Jan 15 estimate with 60,000 gave $63,000 floor (+$3,000 deferral), 2027 cliff $132,000. /api/calendar.ics returns 200, 7 VEVENTs |
| 7 | Delete my data | PASS | Redirected to /; /result and /plan both then redirect to /; /checkin shows empty state |
| 8 | Own input /check | PASS | Empty step 1: inline "Choose your state." and "Choose how you file your taxes." Negative income: "Enter an amount of $0 or more." "105k", "$40,000", "20k" accepted. "abc" blocked progress at step 4. Demo notice works offline (fictional values, "Use these demo values"/Cancel). Finish led to /result: MAGI $90,761, 340%, cliff $106,600 (3 people), repay $0 |
| 9 | Phone 375 | PASS | No horizontal scroll on /, /result, /plan, unlocked /plan. See Minor 2 for tap targets |
| 10 | Console | FAIL | See Bug 1 |

### Bugs

**Major 1 - Duplicate React key error on unlock, and "Understand your plan / Explain my plan" panel rendered twice**
- Steps: /plan with a saved household, click "Unlock Year demo — free".
- Expected: no console errors; one explain panel.
- Actual: after unlock, two "Understand your plan" panels with two "Explain my plan" buttons (innerText shows the block twice). Console, at each unlock (desktop and 375 px): `Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted... 4` (also `... 3` once). Move list itself is not duplicated. After reload the duplicate is gone (0 buttons before clicking, one panel after).
- Viewport: both 606 and 375. The jury will see a dev overlay/error badge in dev only, but the duplicated panel is real.

**Minor 2 - small tap targets at phone width**
- Header "My plan" 53x20, "Check-in" 62x20, "Delete my data" 99x20, "Back to your result" 127x17, source links 17 px tall, proof checkboxes 20x20. Below the 40-44 px guideline.

**Minor 3 - "Delete my data" has no confirmation**
- One click in the footer wipes household, plan and unlock and redirects to /. Expected a confirm step.

**Minor 4 - "My plan" and "Back to your plan" link to /unlock**, which resolves to the plan page (fetch returned 200). Works, but an extra hop.

**Minor 5 - disabled lever shows no reason**
- First lever "up" and last lever "down" are disabled with no reason text, while the brief expected a lever with a visible reason.

**Minor 6 - check-in history logs the baseline twice**
- First check-in with no change adds a row identical to the saved baseline (2026-11-14 both rows).

### UX observations a juror would notice
1. Result headline is strong: "$6,564 under the cliff" and a red $1,697 repayment with the "no cap" badge; the offer check is prefilled with the sample $12,000 so the gig verdict appears immediately.
2. The red loss zone on the gig chart and the "do nothing $1,321 vs plan $8,548" comparison carry the pitch in one screen.
3. Demo-unlock labelling is honest ("no card, no charge", planned prices shown), but there is no Stripe test card hint, which CLAUDE.md lists in the jury path.
4. Return-visit banner works ("Welcome back. Your November check-in is due"), plus .ics reminders and the Jan 15 estimate give a clear reason to return.
5. The calculation-based explain fallback is clearly labelled, which avoids looking faked.

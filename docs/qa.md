
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

## G4 production QA — 2026-11-15 (https://cliffguard-beta.vercel.app)

Browser window was 606 px wide (resize_window did not change the viewport); mobile checked via a same-origin 375x812 iframe. Console: no errors on any page visited (console tracking began after first load, so initial-load logs on `/` and `/result` were not captured).

| # | Step | Result | Figures |
|---|---|---|---|
| 1 | `/` Check my numbers | PASS | lands on `/check` |
| 2 | Try Dani's family -> /result | PASS | about 4 s; SAMPLE banner; MAGI $122,036, 379%, $6,564 under, repay $1,697 |
| 3 | Cliff chart / slider | PASS | slider +$20k -> "With the offer repay $9,342"; red cliff $128,600 line present |
| 4 | Gig section | PASS | doing nothing $1,321, with plan $8,548; chart dots equal table; fast slider sweep: no error banner, chart stays |
| 5 | /plan | PASS | verdict shows, Keep my cash toggles, up/down reorders, locked `$•,•••`, cards Year $79 / Rescue $59 |
| 6 | Unlock Year demo | PASS | exact amounts, deadlines "Dec 31, 2026"/"Apr 15, 2027", proof checklist once; ticked proof persists after reload |
| 7 | Explain my plan | PASS (see M1, m1) | 7 s; labelled "AI EXPLANATION · NUMBERS CHECKED AGAINST YOUR PLAN"; stays after blur/visibilitychange (simulated events, no real tab switch) |
| 8 | Tax-preparer export | PASS (m2) | /plan/export renders, Print / Save as PDF button; not print-previewed |
| 9 | /checkin | PASS (M2) | see bugs; $7,000 extra: MAGI $122,036 -> $128,541, headroom $59, repay $1,697 -> $2,345; Jan 15 estimate: input $110,000 -> floor $113,000, 2027 cliff $132,000; /api/calendar.ics 200 with 7 VEVENTs |
| 10 | Read sample with AI | PASS | 6 s, fills year/state/income/APTC/premium/plan name, warns it is synthetic |
| 11 | Delete my data | PASS | inline confirm -> Confirm -> `/`; `/result` redirects to `/` |
| 12 | Phone 375 px (steps 1-6) | PASS | no horizontal scroll (scrollWidth 375); no SVG text overlaps; sliders and checkbox labels 44 px tall |
| 13 | Console | PASS | no errors |
| - | Failure cases (empty, huge, wrong file type, double-click, back) | NOT RUN | out of time box |

### Blockers
None.

### Major
- M1 AI explanation contradicts the plan. With the default plan it dropped the "Bill in January" move and said "I can't recommend asking clients to hold payments or backdating", though the plan lists that move ($3,000). Repro: unlock Year demo on the sample, reorder a lever (Buy planned items first), click Explain my plan. Expected: explanation covers every move in the plan. Actual: January billing move omitted and refused in the first-person.
- M2 First check-in demo is anticlimactic. Entering $5,000 SE received with the auto-filled "still expected" yields MAGI $122,036 -> $122,036 and repay unchanged, with no explanation that moving forecast income to received is neutral. A juror following the "$5,000 received" script sees a $0 delta. The first submit is also treated as a baseline and shows the same card. Expected: a visible note on why nothing changed, or a default that shows a delta. Actual: only "well away from your Marketplace estimate".

### Minor
- m1 AI explanation and the export show raw ISO dates ("by 2026-12-31", "Generated 2026-11-15T04:42:07.013Z") while the rest of the app uses "Dec 31, 2026".
- m2 With headroom of $59 after the check-in there is no near-cliff alert, only "repayment rose" and "report the change" (the alert copy contains no "cliff"). Expected a warning that the cliff is $59 away.
- m3 Gig chart: "Loss zone / Taking it leaves you worse off" annotation sits over the green curve at 606 px width.
- m4 /plan unlocked state: the unpaid view shows "YOU REPAY NOW $9,342" (unlocked amounts) beside locked move amounts; consistent with spec but note it for the jury.
- m5 Gig slider: after the fast sweep it ended at $12,000 although the last programmatic value was 0 (programmatic events only; likely the controlled-value snap; not reproduced with a real drag).
- m6 Year demo expires Nov 14, 2027; Stripe test checkout not exercised (demo unlock buttons only, per UI "No card, no charge").

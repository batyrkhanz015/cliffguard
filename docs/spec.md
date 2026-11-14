# CliffGuard: product spec (v1)

> **Status:** **Approved by the captain at G2 (~19:50, 2026-11-14)**, with all of §H's recommended defaults accepted. Written by the strategist agent. Idea locked at G1 (18:15). v1 target: live by ~00:30, Nov 15.
> **Inputs:** `CLAUDE.md`, `docs/handoff.md`, `docs/scores.md` (G1), `research/track-01-money.md`, `research/new-rules-radar.md`, `research/niche-hunt.md`.
> **Table values:** `research/tax-tables-2026.md` (a researcher is writing it in parallel) is the source of truth for every table number. Where this spec lists a value, it is the value the fixtures in §B were computed with. If the research file disagrees, the research file wins and the builder recomputes the affected fixtures and reports the delta.
> **Education, not tax advice.** That rule covers the product, this spec and the pitch.

---

## 0. Read first: corrections to the handoff

These change numbers the pitch was going to use. Every number shown to a juror must come from the engine.

| # | Handoff said | Correct | Why it matters |
|---|---|---|---|
| C1 | Dani's $12k gig "keeps about $200" (22% bracket) | **Keeps $1,321.** A married-filing-jointly family of 4 near the cliff has taxable income of about $89k–$100k, which is in the **12%** band (2026 MFJ 12% runs to $100,800 of taxable income; the standard deduction is $32,200). Almost every household near the 400% line is in the 12% bracket. | Use the engine's number. The dramatic line becomes **"an $8,000 gig leaves Dani $1,668 *poorer* than saying no"**, also computed live. |
| C2 | "$122k + $12k = $134k" | **$122,036 → $133,188.** MAGI is net of the deduction for half of self-employment (SE) tax, so $1 of extra freelance profit adds about $0.93 to MAGI. | The engine computes MAGI from its components. Never hand-type MAGI. |
| C3 | "Instead's 403% example, $7,294 vs $3,289" | The example is from **Morkel Financial**. Instead's page has different examples. | Fix the attribution in the deck. The fixture reproduces it exactly (§B, F5–F6). |
| C4 | HSA: "withdraw tax-free anytime for medical bills, including past ones" | Only for expenses incurred **after the HSA was opened**. | This is UI copy in the proof list. |
| C5 | KFF's family of 3 at 407% | That is the **2025** plan year: 2024 poverty line, enhanced table. | It is reproduced exactly with a **test-only** 2025 rule set (F7). |
| C6 | The cliff is "400% FPL", rounding unspecified | Form 8962 Worksheet 2: if income is **more than 4 × the poverty line in dollars**, enter 401 and get no credit. Otherwise **truncate** the percentage ("drop any numbers after the decimal point"). | $128,600 is eligible. $128,601 is not. |

## G1 objections and where this spec answers them

| Judge's objection (`docs/scores.md`) | Answer |
|---|---|
| "StateCalc gives me the bill free in 30 s." | The first screen after "Try Dani's family" is the **gig decision plus the rescue**. The bill is one free line. The landing page says: *"Free calculators stop at the bill."* (§4, §C) |
| "If you're $1 off TurboTax, I don't trust you." | The engine follows Form 8962 exactly (truncated FPL %, 4-decimal applicable figure, whole-dollar lines). Fixtures reproduce **KFF ($745 → $34,463)** and **Morkel ($3,512; $7,294 vs $3,289)** exactly. The export shows Form 8962 preview lines. (§A, §B) |
| "A 1095-A doesn't exist until late January." | Intake uses the **Marketplace eligibility notice**. SLCSP is derived from APTC plus the estimate. No CMS dependency. (§A.4, §E.1) |
| "Monthly check-ins are manufactured retention." | The check-in re-projects from real entries, alerts are computed, `.ics` reminders really fire, and the plan's to-do checkboxes hold state until Dec 31. The product targets **lumpy income** and says plainly who it is *not* for. (§7, §C S8) |
| "The market is shrinking (CBO 13.1M in 2027)." | We size on variable earners and present a **bottom-up path with assumptions**: ACA core, then other income cliffs on the same engine, then B2B2C. (§8) |
| "LTV/CAC 4x is asserted." | Every input is listed and marked as an assumption, with sensitivity. Annual upfront billing means payback on day 1. (§8) |
| "The calculator is a commodity." | The wedge is the gig check, the ordered legal optimizer with **Keep my cash**, notice intake, and monitoring. No competitor found does that. (§9) |
| Tax edge cases | Explicit out-of-scope flags in the UI. Conservative choices are explained, e.g. leaving out the SE health-insurance deduction overstates MAGI. (§A.10) |

---

## 1. One-liner

**"Take the gig. Keep your health subsidy."** CliffGuard is a web app for freelancers and other variable-income families on HealthCare.gov. It shows whether extra work this year will push them over the 2026 subsidy cliff, which no longer has a repayment cap. It then builds a ranked, dated plan of legal moves, liquid ones first, that lets them take the work and keep thousands of dollars of premium tax credit. After that it watches their income every month until the April return.

## 2. Persona and trigger moment

**Dani Reyes, 37, freelance UX designer in Austin, TX** (a HealthCare.gov state).
- Married to **Alex** (38, part-time W-2 job, no benefits). Two kids, 6 and 9. They file jointly, household of 4.
- Bronze family plan bought on HealthCare.gov. At enrollment she estimated **$105,000** for 2026, so the Marketplace pays **$778.50 a month** of advance premium tax credit (APTC) to the insurer.
- Her real 2026 is lumpy. A September contract pushed her projection to about **$122k**, and the cliff for a family of 4 is **$128,600**.

**Trigger moment (now, mid-November 2026):** a client offers a **$12,000 December project**. Dani has read that "you can owe the whole subsidy back now," but she doesn't know her number, and the answer depends on December 31, which is about 47 days away. Secondary triggers on the same household:
- the HealthCare.gov renewal email asking for her 2027 income (open enrollment ends Jan 15);
- the Form 1095-A in late January;
- TurboTax showing the bill in Feb–Apr 2027.

**What she does today instead:**
1. Guesses, and hopes.
2. Uses a free repayment calculator. It gives a bill but no decision and no moves.
3. Googles forum threads.
4. Asks a general chatbot, which may apply the old capped rules or make arithmetic errors.
5. Asks her CPA in March, after the Dec 31 moves have expired.
6. Turns the work down. As Urban Institute's Jason Levitis put it, *"maybe don't take that shift."*

**Not for:** steady salaried households far under the line, who know their number; people far over the line, who get a free "not worth fighting, set $X aside" verdict; and anyone with an employer health plan.

## 3. Pain evidence

1. **No repayment cap from tax year 2026.** IRS: *"Beginning with tax year 2026, the taxpayer must repay the full amount of any excess advance payments… Repayment limits… no longer apply."* ([IRS](https://www.irs.gov/tax-professionals/eitc-central/repayment-caps-eliminated-for-excess-advance-payments-of-the-premium-tax-credit); fact-checked in [`scores.md`](scores.md)). The cliff is back above 400% FPL (KFF, Nov 6 2026; [`research/new-rules-radar.md`](../research/new-rules-radar.md) §2A).
2. **The shock in dollars, from published examples we reproduce exactly:**
   - KFF's family of 3 at 407% FPL owed **$745** under the enhanced rules and owes **$34,463** with them gone ([KFF](https://www.kff.org/affordable-care-act/marketplace-enrollees-with-unpredictable-incomes-could-face-bigger-penalties-under-house-reconciliation-bill-provision/)).
   - Morkel Financial's single filer at 403% repays **$7,294 vs $3,289** ([Morkel](https://morkelfinancial.com/blog/excess-premium-tax-credit-repayment-2026); [`research/niche-hunt.md`](../research/niche-hunt.md) §B).
3. **The people exposed are exactly variable earners.**
   - **26%** of likely Marketplace shoppers have income that swings 20% or more within a year (KFF; [`new-rules-radar.md`](../research/new-rules-radar.md) §2A).
   - **43%** of enrollees plan to work more hours (KFF poll via KFF Health News; [`track-01-money.md`](../research/track-01-money.md) §4).
4. **Their own words:**
   - *"I can make anywhere between $20,000 and $45,000 next year. I just don't know."* (legal-aid client, KFF Health News).
   - *"This seems extremely unfair. I was not warned about this…"* (ObamacareFacts reader).
   - Jason Levitis on one extra shift costing $10k: *"maybe don't take that shift."* ([`track-01-money.md`](../research/track-01-money.md) §4).
5. **Scale even with the old caps:** TIGTA found **2.9M taxpayers with $3.8B of excess APTC** in tax year 2016 ([`new-rules-radar.md`](../research/new-rules-radar.md) §2A).

*Gap:* we have no Reddit quotes, because our tools can't reach Reddit. A human pastes 3–5 into the deck (Open decision D8).

## 4. Magic moment (under 60 s, no login)

| t | Juror does | Sees (all computed live by the engine) |
|---|---|---|
| 0 s | Opens the URL | Hero: "Take the gig. Keep your health subsidy." Primary button **Try Dani's family**, with the 5-question check and the upload button beside it |
| ~3 s | Clicks **Try Dani's family** | The server stores Dani's *inputs* (not outputs) in the session, then runs the diagnosis and a $12k gig check |
| ~5 s | Reads the result | "Projected 2026 income **$122,036**, 379% of the poverty line. Cliff: **$128,600**. You're **$6,564** under. April repayment if nothing changes: **$1,697** (no cap from 2026). **47 days** left for December moves." |
| ~15 s | Drags the "extra income" slider | The dot crosses the red cliff wall and the repayment jumps from **$1,697 to $9,342** |
| ~25 s | Reads the gig check | "Take the $12,000 project and do nothing: you keep **$1,321**. With a rescue plan: **$8,548**." Dragging the gig slider to $8,000 shows **−$1,668**, i.e. losing money by working |
| ~40 s | Clicks **See the rescue plan** | Verdict "Worth it". **Keep my cash** is ON and the plan has 3 moves with deadlines: bill $3,000 of work in January, buy the planned laptop now, put money in the HSA. Exact amounts are locked |
| ~50 s | Flips **Keep my cash** off and moves SEP-IRA to the top | Totals recompute live: keeps **$9,083**, with $5,590 in retirement. The paywall shows the test-card hint |

**Computed live on every request:**
- the poverty line for the state and household size, and the 4× cliff;
- MAGI from components (SE profit, half of SE tax, wages, interest, tax-exempt interest, dividends, gains);
- SLCSP derived from APTC and the estimate;
- truncated FPL % and the interpolated applicable figure, the expected contribution, the PTC, and the uncapped excess APTC;
- 2026 federal bracket tax and SE tax on the gig;
- the optimizer's search over lever capacities and eligibility;
- the deadlines, filtered by today's date.

**Only the sample *inputs* are fixed** (`src/samples/dani.ts`).

**Faking temptations (forbidden; the code reviewer checks for each):**
1. Typing "$8,548" or any other result into landing or UI copy. If the hero shows a number, a server component computes it from the Dani preset at render time.
2. A "sample notice extraction" that returns pre-parsed JSON. The sample PDF must go through Claude live.
3. Claude text with raw numbers that were never checked against engine output (see the grounding validator, §E.4).
4. An "email reminders on" toggle that sends nothing. v1 uses a real `.ics` file instead.
5. Implying a ZIP-based CMS benchmark lookup we don't run.
6. Testimonials or user counts we don't have.

## 5. Core flow (screens)

1. **Landing** (`/`): hero, **Try Dani's family**, "Check my numbers (5 questions)", "Upload my eligibility notice", a "What changed in 2026" box with sources, the line "Free calculators stop at the bill", who it's for and not for, and the disclaimer.
2. **Check** (`/check`): 5 short steps (§C S1). Upload on step 2 pre-fills steps 1–3 after the user confirms.
3. **Result: where you stand** (`/result`): headline numbers, the cliff chart with the extra-income slider, a "Report a change" card, a days-left chip, and the "Got an offer?" gig input.
4. **Gig check** (a section of `/result`, auto-run for Dani): options table and the net-vs-gig chart with a slider.
5. **Rescue plan preview** (`/plan`): verdict, the Keep my cash toggle, lever order controls, moves with names and deadlines, and live totals. Per-move amounts and how-to are **locked**.
6. **Paywall** (`/plan` modal): CliffGuard Year $79/yr (highlighted) vs One-time Rescue $59, with the value line "This plan keeps $7,227 more than doing nothing" (computed) and the test-card hint.
7. **Stripe Checkout** (hosted, test mode) → **`/success`**, where the server verifies the session → redirect to `/plan`.
8. **Unlocked plan** (`/plan`): exact amounts, step-by-step instructions, deadline chips, where each move shows on the return, a proof checklist (persisted), "Explain my plan" (Claude), "Ask a what-if" (Claude calling the engine), and **Tax-preparer export** (`/plan/export`, printable).
9. **Check-in and calendar** (`/checkin`, Year only): "what came in since last time" → re-projection, alerts, history, the Jan 15 2027 estimate card, and `.ics` download.
10. **Reason to return:** the `.ics` monthly check-in event and deadline alarms; the to-do checkboxes for Dec 31 moves; a "Welcome back: your December check-in is due" banner keyed to the cookie.

## 6. What we sell

| | **Free** | **One-time Rescue: $59** | **CliffGuard Year: $79/yr** (recommended) |
|---|---|---|---|
| Where you stand (MAGI, cliff, repayment, chart, slider) | ✔ | ✔ | ✔ |
| Gig check (all options, net-vs-gig chart, loss zone) | ✔ | ✔ | ✔ |
| Eligibility-notice upload (Claude extraction) | ✔ (rate-limited) | ✔ | ✔ |
| Rescue verdict, live totals, toggle, reorder | ✔ | ✔ | ✔ |
| Exact amounts, how-to, deadlines, proof list | | ✔ | ✔ |
| Tax-preparer export (Form 8962 preview, moves, proofs) | | ✔ | ✔ |
| "Explain my plan" and "Ask a what-if" (Claude) | | ✔ (10 questions/day) | ✔ (30 questions/day) |
| Monthly check-ins, re-projection, alerts, history | | | ✔ |
| Deadline calendar (`.ics` with alarms), Jan 15 estimate helper | | | ✔ |
| 2027 coverage year (same loop, 2027 cliff), renews at open enrollment | | | ✔ |

- **Model:** Rescue is a one-time payment that covers tax year 2026 (valid until 2027-10-15). Year is an **annual subscription billed upfront**, implemented as a Stripe subscription with `interval: year`. **No monthly plan.** Renewal is timed to open enrollment; the pitch-only part is anchoring the renewal date to Nov 1.
- **Price logic:** Year costs only $20 more than Rescue and includes it, so Rescue works as the decoy anchor. Dani's plan keeps $7,227 more than doing nothing, so $79 is about 1% of the value.
- **Seasonality:** the pitch line is "The earlier you join, the more you keep." After Dec 31, four of the seven moves expire, and the engine shows that live.
- **Willingness-to-pay comparables:**
  - Instead's AI tax planning starts at $16/mo, about $192/yr (verified pricing page, [`track-01-money.md`](../research/track-01-money.md) §7).
  - Student Loan Planner charges $595 for one consult on a comparable "complex federal rules" problem (verified, same file).
  - JustAnswer's paid expert Q&A shows people pay per question (same file).
  - *(assumption, unverified)* TurboTax online self-employed tiers run $100–$200+ federal, and a CPA tax-planning session costs $200–$500.

## 7. Retention loop

Income for the target user changes every month, and the year has hard money deadlines. Each one is a scheduled return:

| When | Why they come back | What the product does |
|---|---|---|
| This week | Execute the Dec 31 moves: send the invoice in January, buy the laptop, open the HSA | Plan to-do checkboxes persist. Days-left chip. `.ics` alarm 7 days and 1 day before Dec 31 |
| 1st of each month | Lumpy income landed | `.ics` monthly event (RRULE, 12 occurrences) deep-links to `/checkin`. The return banner says the check-in is due. The 30-second check-in re-projects, alerts if they crossed or are approaching the line, and updates the plan |
| Dec 15 / Jan 15 | 2027 plan and income estimate | Jan 15 card: "Your 2027 estimate must include the $3,000 you're billing in January." Shows the 2027 cliff ($132,000 for a family of 4). **Never suggests a lower estimate.** |
| Late Jan | 1095-A arrives | *(nice-to-have)* Upload the 1095-A to verify against our projection |
| Apr 15, 2027 | File with Form 8962; deadline for HSA, IRA and SEP | Export for the preparer; alarm |
| Monthly in 2027, then November | A new coverage year | Year subscribers roll into 2027 with the same loop; renewal at open enrollment |

**Honest framing:** this is a monthly tool for lumpy earners and a seasonal tool for everyone else. We don't claim daily use. Metrics to watch: check-in completion rate, and the share of users who executed at least one move by Dec 31.

## 8. Business model

**Acquisition channels (named):**
1. **High-intent seasonal search and programmatic SEO.** Engine-generated pages such as "2026 subsidy cliff for a family of 4 in Texas" and "repay premium tax credit 2026" capture demand that spikes in Dec and Feb–Apr 2027. The SEO-calculator boom is the demand signal ([`new-rules-radar.md`](../research/new-rules-radar.md) §2A).
2. **Freelancer and creator channels.** Freelance and finance short-form video ("an $8k gig would have cost me $1,668"), plus newsletters and communities for freelancers and gig workers.
3. **Partners.** CPAs and enrolled agents (referral rev share), and later brokers and navigators (white-label).

| Metric | Estimate | Basis (all *assumptions* unless cited) |
|---|---|---|
| Blended CAC | **$35** | SEO/content about $10–15 per payer; creators $30–45; partner rev share about $15. Paid search is avoided because ACA keywords are priced by insurance lead-gen buyers |
| Blended first-year ARPU | $72 | 65% Year ($79), 35% Rescue ($59) |
| Gross margin | ~90% | Stripe about $2.60 on $79; Claude at most about $1 per paid user per year (measure in v1); hosting negligible |
| Year renewal | 55% → ~2.2-year life | Driven by the annual coverage-year cycle |
| Rescue → Year next season | 30% | |
| **LTV** | **≈ $134** | 0.65 × ($79 × 0.9 × 2.2) + 0.35 × ($59 × 0.9 + 0.30 × $156) |
| **LTV/CAC** | **≈ 3.8x** | Payback on day 1, since billing is upfront annual. Sensitivity: 40% renewal → ~3.1x; CAC $50 → ~2.7x |

**Bottom-up path to $100M ARR** (*assumptions*; this answers the judge's "shrinking market" point):
- **Core today:** 19.2M effectuated enrollees in 2026, falling to 13.1M in 2027 per CBO, which is about 7.7–11.3M households at 1.7 people each (assumption). Of these, 26% have income swings of 20% or more (KFF), giving **2.0–2.9M core households**. 8% paying × $72 = **$12–17M ARR ceiling for the ACA wedge alone.** The deck must say this honestly.
- **2030 mix:**

| Segment | Payers / seats | Price | ARR |
|---|---|---|---|
| ACA variable earners (HealthCare.gov plus state exchanges) | 250k | $79 | $20M |
| **Income Guard** for all variable-income households: same MAGI engine applied to other income cliffs (RAP student-loan payments tied to AGI, Roth/IRA limits, child-tax-credit and dependent-care phase-downs, QBI thresholds, quarterly estimated tax). Pool: tens of millions of 1099 earners (assumption, cite BLS/Upwork in the deck) | 600k | $99 | $59M |
| B2B2C seats: brokers, CPAs, freelance platforms, enrollment platforms | 7M seats | $3 | $21M |
| **Total** | | | **~$100M** |

- **Ramp:** 2027 season about 40k payers ($3M). 2028: 200k ($15M), with state exchanges and renewals. 2029: Income Guard launch.
- **Policy risk is a tailwind for the expansion, not the core:** any new MAGI-tested benefit is a new cliff for the same engine.

## 9. Why this is new

**Competitors found** (from `scores.md` and the research files):

| Product | What it does | Gap vs CliffGuard |
|---|---|---|
| **StateCalc** ACA PTC repayment calculator | Free, no account. 1095-A columns in, 2026 uncapped repayment out, what-if, PDF | Retrospective bill only. No gig decision, no optimizer, no intake, no monitoring |
| healthinsurance.org, NerdWallet, KFF, nationaltaxtools, teamzlab, taxbracketcalc, aca-subsidy-guide.vercel.app, acacalc, tax47 | Subsidy or repayment calculators | Static. The headline number is a **commodity**, and we give it away |
| TurboTax, H&R Block, FreeTaxUSA | Form 8962 at filing | Too late for Dec 31 moves. Users test IRA contributions by hand |
| Stride Health ($47M Series C) | Gig-worker enrollment, income update flow, "repay 100%" notice | Enrollment-centric. No optimizer or alerts found |
| Instead ($15M) | AI tax planning for professionals and businesses, from $16/mo | B2B and generalist |
| HealthSherpa | Enrollment | Stops at enrollment |
| beancount.io guides, Covered California SE-IRA brief | Content | Not a product |

**Our real wedge:**
1. **The decision, not the bill.** "Should I take this gig?" answered with after-tax value *and* subsidy loss, plus the loss zone (gigs that make you poorer).
2. **An ordered legal optimizer** with **Keep my cash**: liquid moves first, retirement only on opt-in, exact amounts, dated deadlines, and a proof list for each move.
3. **Intake from the document users actually have today** (the eligibility notice), with the benchmark derived from it. No CMS key.
4. **It speaks first.** Monthly re-projection, cliff alerts, the "report a change" prompt, and the Jan 15 estimate with deferred income included.
5. It is built on all three 2026 changes: uncapped repayment, the returned cliff, and bronze/catastrophic plans becoming HSA-eligible.

*Honest risk:* 3 of our 5 agents converged on this idea, so other teams may too. The depth has to be visible in 60 seconds (§4).

## 10. MVP scope

Sized for **about 6 builder-hours on the critical path** (~9 builder-hours total). Two parallel builders working in separate worktrees (engine vs UI shell) should land M1–M9 by about 22:00 (the G3 insurance submit) and M10–M15 by about 00:30. **If the team is behind, cut from the bottom of the must-have list.**

### Must-have (in build order)

| # | Item | Serves | Est. |
|---|---|---|---|
| M1 | **Rules engine** (§A) with all fixtures in §B passing (`vitest`) | Magic, everything | 1.75h |
| M2 | Anonymous session middleware, Upstash Redis client, household API (`GET/PUT/DELETE /api/household`, `POST /api/household/sample`) | Magic, retention | 0.5h |
| M3 | Landing with **Try Dani's family** (one click → `/result` with the gig check auto-run) | Magic | 0.4h |
| M4 | Check form: 5 steps, Zod validation, guards, manual SLCSP fallback | Magic | 0.6h |
| M5 | Result: headline, cliff chart, extra-income slider (client-side `reconcile`), report-change card, days-left chip | Magic | 0.6h |
| M6 | Gig check: API, options table, net-vs-gig chart and slider, loss zone | Magic | 0.4h |
| M7 | Rescue plan preview: `/api/plan`, Keep my cash toggle, up/down lever ordering, verdicts, **server-side redaction** | Magic, paywall | 0.5h |
| M8 | Paywall, Stripe test Checkout (Year subscription, Rescue payment), `/success` verification, entitlement in Redis, test-card hint | Paywall | 0.4h |
| M9 | Unlocked plan (amounts, how-to, proof checklist persisted) and `/plan/export` print page | Paid value | 0.5h |
| M10 | Claude extraction of the **eligibility notice** (PDF/image) plus the **bundled sample notice**, a confirm card, and manual fallback | Magic (intake), New | 0.6h |
| M11 | Check-in (manual entry), re-projection, alerts, history; `.ics` calendar; Jan 15 2027 estimate card | Retention | 0.8h |
| M12 | Claude "Explain my plan" with the grounding validator and a template fallback | Paid value | 0.4h |
| M13 | Rate limits, token and upload caps, daily Claude call cap, `CLAUDE_ENABLED` kill switch | Works (cost/abuse) | 0.25h |
| M14 | Loading, empty and error states everywhere; 375 px layout; disclaimers | Works (UX) | 0.4h |
| M15 | Claude "Ask a what-if" with the `run_scenario` engine tool. **First to cut if behind at 23:30** | Paid value, New | 0.5h |
| M16 | README: problem, persona, live link, screenshots, architecture, how to run, how the agent team built it | Works (repo) | 0.25h |

### Nice-to-have (only after G3, in this order)
N1. Bank CSV extraction in the check-in (Claude classifies deposits, code sums them).
N2. Invoice PDF extraction, which pre-fills "unbilled work you could bill in January".
N3. A line showing "If 2025's rules still applied: $X" (reuses the test rule set).
N4. A "Max-value order" comparison next to the user's order.
N5. Email reminders (Resend plus Vercel Cron), with an opt-in.
N6. 1095-A upload to verify the projection (useful from late January).
N7. A 250% FPL cost-sharing-reduction alert for silver plans.
N8. A 2027 PTC preview using Rev. Proc. 2026-26.
N9. CMS Rate PUF SLCSP lookup for TX, FL and GA.
N10. Upgrade from Rescue to Year (+$20).

### Cut list (will not build in v1)
- Login, accounts, bank linking (Plaid), SMS.
- CMS Marketplace API and ZIP/age-based benchmark lookup.
- State-exchange specifics (state subsidies). SBM states get a warning and the federal math.
- The self-employed health-insurance deduction (circular), shared policies, mid-year marriage or divorce, Medicaid-eligible months, employer-coverage affordability tests, married filing separately, below-100% FPL logic.
- Age catch-ups (IRA 50+, HSA 55+); the persona is 25–45, so the UI flags them.
- QBI deduction, state income tax, credits and capital-gains rates in the rough gig after-tax figure (flagged).
- W-2 gigs (v1 gigs are 1099 income), a Solo 401(k) lever, the HSA last-month rule, and multi-year optimization.
- Any chatbot as the main UI. Q&A sits inside the plan only.
- A native app (the brief requires web only).

## 11. Risks

| Type | Risk | Mitigation |
|---|---|---|
| Technical | One wrong number in front of a tax-savvy juror sinks the 40% criterion | Form 8962 method; fixtures reproduce KFF and Morkel exactly; versioned rule set (`ty2026-v1`); "How we got this" expander with the formula lines; conservative scope flags |
| Technical | Table values unverified (2026 applicable % from a secondary source) | Morkel reproduction confirms 9.96% (300–400%) and 6.60% (at 200%). `research/tax-tables-2026.md` confirms the rest against Rev. Proc. 2025-25 |
| Technical | Claude slow or down during judging | The magic moment uses no LLM. Every Claude feature has a fallback (manual entry, template text, "Q&A unavailable"). Timeouts. Kill switch |
| Technical | Stripe redirect or verification fails | Hosted Checkout in test mode. Server verification checks `client_reference_id`. Clear "no charge made" states |
| Technical | Redis down | Engine is stateless. Saving degrades with a banner, and results still show |
| Legal | Seen as tax advice or unauthorized practice | Labeled "education, not tax advice"; "moves to discuss with your preparer"; formulas shown; preparer export; no filing, no e-sign, no brokerage of plans |
| Legal | Helping someone understate a Marketplace estimate (45 CFR 155.285 penalties) | The engine never outputs an estimate below the projection. The Jan 15 card *adds* deferred income. The Q&A system prompt refuses. A unit test covers it (F13) |
| Legal | Constructive receipt and wash-sale misuse | Per-move warnings. Invoice timing is described as "don't bill until January", never "ask the client to hold a check" |
| Legal | Financial data privacy | No SSN or name fields. Uploaded files are processed in memory, never stored; only confirmed numbers are saved. "Delete my data" button. 400-day TTL. Users are told they can black out names and IDs |
| Data | SLCSP derivation wrong (partial credit taken, household change, credit equal to the full premium) | Guards trigger a required manual SLCSP field with help text pointing to HealthCare.gov or the 1095-A column B |
| Data | Policy change (a lame-duck extension) | "Rules as of Nov 2026" label. Rules live in versioned data, so a swap is a one-file change |
| Data | The user's projection is a guess | $1,000 safety buffer below the cliff; monthly re-projection; "update when income lands" |
| Data | State-exchange users | Federal reconciliation is identical. Banner: "Your state may add its own subsidy that we don't model" |

## 12. Demo script (90 s)

| t | Screen | Say |
|---|---|---|
| 0:00 | Landing | "Meet Dani: freelance designer, family of four, insured through HealthCare.gov. Since 2026 there's no cap on paying the subsidy back, and a client just offered her $12,000 for December." Click **Try Dani's family**. |
| 0:08 | Result | "She's tracking $122,036. The cliff is $128,600." Drag the slider across the wall. "One dollar over, and her April bill jumps from $1,697 to $9,342." |
| 0:22 | Gig check | "Take the gig and do nothing: she keeps $1,321 of $12,000." Drag the gig slider to $8,000. "An $8,000 gig would leave her $1,668 *poorer*. That's why people turn down work." |
| 0:35 | Plan preview | "CliffGuard finds the legal way to say yes. Keep my cash is on: bill $3,000 of this month's retainer in January, buy the laptop she'd buy anyway now, top up her HSA, because bronze plans qualify from 2026. She keeps $8,548." Flip the toggle and move SEP up: "Or $9,083, with $5,590 going to retirement." |
| 0:50 | Paywall → Stripe | "$79 a year, billed once." Pick Year, enter 4242 4242 4242 4242, come back unlocked. |
| 1:02 | Unlocked plan | "Exact amounts, deadlines, the proof to keep, and an export for her preparer." Click **Explain my plan**. "Claude explains, but every number comes from our tested rules engine, and we check that." |
| 1:12 | Ask | Type "What if I also sell $4,000 of stock in December?" "Claude calls the engine as a tool and answers with real numbers." |
| 1:20 | Check-in | "Every month, 30 seconds: what came in. Alerts before she crosses the line. Her January estimate includes the income she deferred." |
| 1:27 | Close | "Free calculators stop at the bill. CliffGuard gives Dani the plan, and keeps watching." |

Backup: a recorded video of this exact path (§G).

---

# Engineering appendices (builders plan from these)

## A. Rules engine contract

**Location:** `src/engine/`. Pure TypeScript with no I/O. `strict`, no `any`. Zod schemas in `types.ts`; types inferred. Every function takes a `RuleSet` argument (default `TY2026`) and an `asOf` ISO date where time matters. Same input, same output.

**Module layout:**
```
src/engine/
  rules/ty2026.ts            // TY2026 rule set (values from research/tax-tables-2026.md)
  rules/ty2025-enhanced.ts   // test-only rule set (KFF/Morkel 2025 fixtures; N3)
  types.ts  fpl.ts  applicable.ts  income.ts  slcsp.ts  reconcile.ts  tax.ts
  levers.ts  optimizer.ts  gig.ts  alerts.ts  deadlines.ts  estimate2027.ts  index.ts
  __tests__/fixtures.ts  __tests__/*.test.ts
```
`optimizer.ts`, `gig.ts` and `levers.ts` start with `import 'server-only'`, so plan amounts never ship to the client. `income.ts`, `fpl.ts`, `applicable.ts`, `slcsp.ts` and `reconcile.ts` are client-safe (the slider uses them).

### A.1 Inputs

```ts
type Money = number;                       // USD, finite. ≥ 0 unless noted
type AdultId = 'a' | 'b';
type LeverId = 'invoiceTiming' | 'businessPurchases' | 'hsa' | 'delayStockSale'
             | 'taxLossHarvest' | 'traditionalIra' | 'sepIra';
const LIQUID_LEVERS: LeverId[] = ['invoiceTiming','businessPurchases','hsa','delayStockSale','taxLossHarvest'];
const DEFAULT_LEVER_ORDER: LeverId[] = [...LIQUID_LEVERS, 'traditionalIra', 'sepIra'];

interface Amount { ytd: Money; expectedRest: Money }        // projected = ytd + expectedRest

interface AdultInput {
  id: AdultId;
  label: string;                         // ≤ 24 chars, e.g. "You", "Spouse", "Dani"
  selfEmploymentProfit: Amount;          // Schedule C net profit after business expenses
  wages: Amount;                         // W-2 box 1
  coveredByWorkplacePlan: boolean;       // 401k/403b/SIMPLE/SEP in 2026
  contributedSoFar: { traditionalIra: Money; sepIra: Money };
}

interface HouseholdInput {
  coverageYear: 2026;
  state: UsStateCode;                    // 50 states + DC
  filingStatus: 'single' | 'mfj' | 'hoh'; // 'mfs' rejected: FILING_STATUS_UNSUPPORTED
  householdSize: number;                 // int 1..10 (tax family)
  adults: [AdultInput] | [AdultInput, AdultInput]; // second adult only when mfj
  marketplace: {
    incomeEstimate: Money;               // what you told HealthCare.gov for 2026
    aptcMonthly: Money;                  // 0..10,000
    monthsWithAptc: number;              // int 1..12, default 12
    tookFullCredit: boolean;             // guard
    householdUnchanged: boolean;         // guard
    slcspAnnualOverride: Money | null;   // manual benchmark (1095-A col B ×12 or HealthCare.gov)
    premiumMonthly: Money | null;        // before credit; optional (caps refunds)
    planMetal: 'bronze'|'catastrophic'|'silver'|'gold'|'platinum'|'unknown';
    coverage: 'self' | 'family';
  };
  investments: {
    taxableInterest: Money;
    taxExemptInterest: Money;            // MAGI add-back
    dividends: Money;                    // incl. fund capital-gain distributions
    capitalGainsNet: number;             // realized + planned this year; may be negative
    otherIncome: Money;                  // other taxable income
    otherMagiAddbacks: Money;            // untaxed Social Security, foreign earned income excl., dependents' MAGI
  };
  adjustments: { hsaContributedSoFar: Money; otherAboveTheLine: Money };
  levers: {
    unbilledInvoicesMovable: Money;      // work you could legitimately invoice on/after Jan 1, 2027
    plannedPurchases: Money;             // business purchases you'd make in early 2027 anyway
    plannedStockSaleGains: Money;        // gains on sales planned before Dec 31 that could wait
    unrealizedLosses: Money;             // losses you could realize by Dec 31
  };
  preferences: { keepMyCash: boolean; leverOrder: LeverId[] };
}

interface Scenario {
  gig: { amount: Money; canBillInJanuary: boolean } | null; // 1099 income, added to the SE adult
  extra?: { selfEmployment?: number; wages?: number; capitalGains?: number; interestOrDividends?: number }; // what-if deltas
  asOf: string;                          // ISO date; server passes today, tests pass fixed dates
}
```
**The "SE adult"** is the adult with the larger projected SE profit; ties go to `a`. Gigs and SE levers apply to that adult.

### A.2 Rule set (TY2026), with the values the fixtures use

| Key | Value | Source / status |
|---|---|---|
| `fpl` (2025 HHS guidelines, for 2026 coverage) | 48 states + DC: $15,650 + $5,500 per extra person. AK: $19,550 + $6,880. HI: $17,990 + $6,325 | Cliff values ($62,600 / $106,600 / $128,600) verified (handoff §11). **AK/HI: confirm in tax-tables-2026** |
| `cliffMultiple` | 4 (no credit if income **>** 4 × FPL) | IRS; Form 8962 Worksheet 2 |
| `applicableBands` | <133%: 2.10% flat · 133–150: 3.14→4.19 · 150–200: 4.19→6.60 · 200–250: 6.60→8.44 · 250–300: 8.44→9.96 · 300–400: 9.96 flat | Rev. Proc. 2025-25 via secondary source. 9.96% and 6.60% confirmed by the Morkel reproduction. **Confirm the rest** |
| `repaymentCaps` | `null` (none for TY2026) | IRS (verified) |
| `standardDeduction` | single $16,100 · mfj $32,200 · hoh $24,150 | Rev. Proc. 2025-32 (mfj verified by search; others confirm) |
| `brackets.mfj` | 10% ≤ $24,800 · 12% ≤ $100,800 · 22% ≤ $211,400 · 24% ≤ $403,550 · 32% ≤ $512,450 · 35% ≤ $768,700 · 37% | Rev. Proc. 2025-32 (first four verified; confirm the rest) |
| `brackets.single` | 10% ≤ $12,400 · 12% ≤ $50,400 · 22% ≤ $105,700 · 24% ≤ $201,775 · 32% ≤ $256,225 · 35% ≤ $640,600 · 37% | Confirm |
| `brackets.hoh` | 10% ≤ $17,700 · 12% ≤ $67,450 · 22% ≤ $105,700 · 24% ≤ $201,750 · 32% ≤ $256,200 · 35% ≤ $640,600 · 37% | Confirm |
| `se` | net earnings factor 0.9235 · SS 12.4% up to wage base **$184,500** · Medicare 2.9% · no SE tax if net earnings < $400 | Wage base: confirm |
| `capitalLossLimit` | $3,000 | Statute |
| `hsa` | self-only $4,400 · family $8,750 (catch-up excluded) | Handoff §11 |
| `ira` | $7,500 limit. Deduction phase-out when covered: single/hoh $81k–$91k · mfj covered $129k–$149k · mfj spouse of covered $242k–$252k | Notice 2025-67 (mfj ranges verified; single: confirm) |
| `sep` | 20% of (SE profit − ½ SE tax), cap $72,000 | Handoff §11; confirm |
| `dates` | yearEnd 2026-12-31 · enrollForJan1 2026-12-15 · oeEnd 2027-01-15 · q4Estimated 2027-01-15 · form1095aBy 2027-01-31 · contributionDeadline 2027-04-15 · sepExtended 2027-10-15 | Research §7 of handoff |
| `nextYear.fpl` (2026 HHS, for 2027 coverage) | $15,960 + $5,680 (48 states + DC); 2027 cliff for a family of 4 = $132,000 | `new-rules-radar.md` §2A |
| `sbmStates` (PY2026, full state-based exchanges) | CA, CO, CT, DC, GA, ID, IL, KY, ME, MD, MA, MN, NV, NJ, NM, NY, PA, RI, VT, VA, WA | **Assumption, confirm in tax-tables-2026** |

**Test-only `TY2025_ENHANCED`:**
- FPL 2024: $15,060 + $5,380 (48 states).
- Bands: <150%: 0 · 150–200: 0→2.00 · 200–250: 2.00→4.00 · 250–300: 4.00→6.00 · 300–400: 6.00→8.50 · ≥400: 8.50, with no cliff (`cliffMultiple: null`, `aboveCliffRate: 0.085`).
- Repayment caps (single / other filers): <200%: $375 / $750 · 200–<300: $975 / $1,950 · 300–<400: $1,625 / $3,250 · ≥400%: no cap.

### A.3 Income and MAGI (`income.ts`)
For each adult: `seProfit = ytd + expectedRest + (gig if SE adult) + extra.selfEmployment − SE-lever reductions`.

```
netEarnings(p)  = max(0, p) × 0.9235;                      // SE tax only if netEarnings ≥ 400
seTax(p, w2ss)  = 0.124 × min(netEarnings, max(0, ssWageBase − w2ss)) + 0.029 × netEarnings
halfSeTax       = Σ adults seTax / 2
capGainsAllowed = max(capitalGainsNet + extra.capitalGains − delayStockSale − taxLossHarvest, −capitalLossLimit)
AGI  = Σ wages + Σ seProfit − halfSeTax + taxableInterest + dividends + capGainsAllowed + otherIncome
       − hsa(soFar + lever) − traditionalIra(soFar + lever) − sepIra(soFar + lever) − otherAboveTheLine
MAGI = AGI + taxExemptInterest + otherMagiAddbacks
```
Here `w2ss` is that adult's W-2 wages. For Form 8962 lines, household income is rounded to **whole dollars** before computing FPL % and the contribution.

### A.4 Poverty line, FPL %, applicable figure, SLCSP, reconciliation
```
fpl         = base(state) + perExtra(state) × (householdSize − 1)
cliff       = cliffMultiple × fpl                                 // income ≤ cliff is eligible
fplPercent  = income > cliff ? 401 : floor(income × 100 / fpl)    // truncate (Form 8962 Worksheet 2)
applicableFigure(p):
  p ≥ 401 and cliff exists → null (no credit)
  band b with b.from ≤ p < b.to (last band includes p = 400):
    figureBp = roundHalfUp((b.startBp × (b.to − b.from) + (p − b.from) × (b.endBp − b.startBp)) / (b.to − b.from))
    return figureBp / 10000                                       // 4 decimals, as in Table 2
  p < 100 → bottom-band rate and flag BELOW_100_FPL
  (roundHalfUp on non-negative rationals: floor((2·num + den) / (2·den)) on integers. Avoid float .5 drift)
annualContribution = round(applicableFigure × income)             // whole dollars, Form 8962 line 8a
```
**SLCSP derived from APTC (`slcsp.ts`).** Valid only when `tookFullCredit && householdUnchanged`, the estimate is ≤ the cliff and ≥ 100% FPL, and `aptcMonthly < premiumMonthly` (when the premium is given):
```
slcspMonthly = aptcMonthly + applicableFigure(fplPercent(estimate)) × round(estimate) / 12
```
- If `slcspAnnualOverride` is set, use it with source `'manual'`.
- If a guard fails and there is no override, return error `SLCSP_REQUIRED`.
- If APTC is at least the premium, flag `SLCSP_DERIVATION_UNRELIABLE` and require an override.
- If the estimate is over the cliff and APTC > 0, flag `ESTIMATE_OVER_CLIFF_WITH_APTC` and require an override.

**Reconcile (`reconcile.ts`):**
```
monthlyContribution = annualContribution / 12
ptcMonthly  = overCliff ? 0 : max(0, min(premiumMonthly ?? ∞, slcspMonthly − monthlyContribution))
ptcAllowed  = ptcMonthly × monthsWithAptc
aptcReceived = aptcMonthly × monthsWithAptc
repayment   = round(max(0, aptcReceived − ptcAllowed))           // NO CAP in TY2026; therefore ≤ aptcReceived
refund      = round(max(0, ptcAllowed − aptcReceived))           // "up to" if premium not given
```
For rule sets with `repaymentCaps`, apply the cap by FPL band and filing status (single vs other); there is none at ≥400%.

**Diagnosis output:**
```ts
interface Diagnosis {
  rulesId: 'ty2026-v1'; asOf: string;
  income: IncomeBreakdown;                // every component above, for the "How we got this" panel
  fpl: number; cliff: number; fplPercent: number; overCliff: boolean;
  applicableFigure: number | null; annualContribution: number;
  slcsp: { annual: number; source: 'derived' | 'manual' };
  aptcReceived: number; ptcAllowed: number; repayment: number; refund: number;
  headroom: number;                       // cliff − MAGI (negative when over)
  zone: 'below_100' | 'clear' | 'near' | 'over';   // near: 0 ≤ headroom ≤ 10% of cliff (assumption)
  per1000: number;                        // repayment change per +$1,000 MAGI in the smooth zone (= 1000 × figure)
  daysToYearEnd: number;
  reportChange: { recommended: boolean; incomeToReport: number }; // see A.8
  flags: FlagCode[];
}
```

### A.5 Rough after-tax for the gig check (`tax.ts`)
```
taxable(AGI)       = max(0, AGI − standardDeduction[filingStatus])     // uses AGI, not MAGI
federalTax(t)      = progressive brackets [filingStatus]
taxOnGig           = Δ seTax + (federalTax(taxable(AGI_withGig)) − federalTax(taxable(AGI_base)))
incomeTaxSaved(d)  = federalTax(taxable(AGI_withGig)) − federalTax(taxable(AGI_withGig − d))  // d = HSA+IRA+SEP of the plan
```
Labelled "Rough estimate: federal income tax plus SE tax. Leaves out the QBI deduction, state tax, credits and capital-gains rates." Timing moves (invoice timing, purchases, stock delay, loss harvesting) are treated as **tax-neutral across years** (assumption: same marginal rate next year). They change only the 2026 credit.

### A.6 Optimizer (`optimizer.ts`, server-only)
```
optimize(input, scenario, rules):
  before = diagnose(input, scenario)
  if before.MAGI ≤ cliff → verdict 'under_line', moves [] (show per1000 and the report-change card)
  target = cliff − SAFETY_BUFFER                                // SAFETY_BUFFER = $1,000 (assumption)
  allowed = preferences.leverOrder
              .filter(eligible(lever, input, asOf))             // see the table below
              .filter(l => !keepMyCash || LIQUID_LEVERS.includes(l))
  state = before
  for lever in allowed (for IRA: one sub-lever per adult; non-covered adults first, then a before b):
    if state.MAGI ≤ target: break
    cap = capacity(lever, state)                                // dollars of the lever, ≥ 0
    if cap ≤ 0: continue
    amount = smallest multiple of $10 in [0, cap] with MAGI(state + amount) ≤ target
             (binary search; MAGI is monotone non-increasing in amount), else cap
    state = apply(lever, amount, state); push move
  // IRA/SEP interaction: if the plan uses SEP for adult X, X counts as covered by a workplace plan.
  // Recompute X's IRA deductible limit. If the plan's IRA for X exceeds it, rerun once with X marked covered.
  feasible = state.MAGI ≤ target
```

| Lever | Eligible when | Capacity | Effect | Deadline | Liquidity |
|---|---|---|---|---|---|
| `invoiceTiming` | asOf ≤ Dec 31; SE adult exists | `unbilledInvoicesMovable` (+ gig amount if `canBillInJanuary`), ≤ SE profit | −SE profit (so MAGI falls about 0.929×) | 2026-12-31 | arrives in January |
| `businessPurchases` | asOf ≤ Dec 31; SE adult exists | `plannedPurchases`, ≤ remaining SE profit | −SE profit | 2026-12-31 (paid and placed in service) | spent on a planned purchase |
| `hsa` | `planMetal ∈ {bronze, catastrophic}`; asOf ≤ Apr 15 | (family ? 8,750 : 4,400) × monthsWithAptc/12 − hsaContributedSoFar | −AGI 1:1 | 2027-04-15 | mostly liquid (qualified medical) |
| `delayStockSale` | asOf ≤ Dec 31 | `plannedStockSaleGains` | −capital gains 1:1 | 2026-12-31 (trade date) | stays invested |
| `taxLossHarvest` | asOf ≤ Dec 31 | min(`unrealizedLosses`, capGainsAllowed + 3,000) | −capital gains (floor −$3k) | 2026-12-31 (trade date) | stays invested |
| `traditionalIra` (per adult) | asOf ≤ Apr 15; compensation > 0 | min(7,500 − soFar, compensation) → phase-out if covered (below) | −AGI 1:1 | 2027-04-15 | locked until 59½ |
| `sepIra` (SE adult) | asOf ≤ Apr 15 (later with an extension: flag only) | min(0.20 × (SE profit − ½SE tax), 72,000) − soFar, using the *current* SE profit | −AGI 1:1 | 2027-04-15 (Oct 15 with extension) | locked until 59½ |

**IRA compensation:** wages plus (SE profit − ½SE tax − SEP). For mfj, a spousal IRA is allowed if joint compensation covers both contributions.

**IRA phase-out (Pub 590-A):** the IRA MAGI is approximated as AGI before the IRA deduction (assumption).
- Reduced limit = limit × (hi − iraMagi)/(hi − lo), rounded **up** to the next $10, with a minimum of $200 if the result is above 0. It is 0 when iraMagi ≥ hi.
- Range: covered adult → the "covered" range for the filing status. Non-covered spouse of a covered adult → $242k–$252k. Neither covered → no phase-out.

**Move output:**
```ts
interface Move {
  leverId: LeverId; adultId?: AdultId; amount: number; magiReduction: number;
  deadline: string; liquidity: 'arrives_january'|'planned_purchase'|'mostly_liquid'|'stays_invested'|'locked';
  howTo: string[]; returnLocation: string; proof: string[]; warnings: string[];  // static copy from levers.ts
}
```
Static copy per lever (in `levers.ts`, never from the LLM):
- **invoiceTiming**: "Not on your 2026 Schedule C; on the 2027 return." Proof: an invoice dated in 2027, the deposit date, and a client 1099 that excludes it. Warning: *constructive receipt*. If payment is offered or available in 2026 it counts for 2026, so don't ask a client to hold a check. Cash-basis only. **Add it to your 2027 Marketplace estimate.**
- **businessPurchases**: "Schedule C expense (or depreciation / §179)." Proof: receipts and a note of business use. Warning: only what you'd buy anyway, since $1 spent saves only part of $1.
- **hsa**: "Form 8889 → Schedule 1." Proof: the provider statement or Form 5498-SA, plus the plan's HSA eligibility. Warnings: bronze and catastrophic plans count from 2026. Not allowed with a general-purpose health FSA or Medicare. Designate a Jan–Apr deposit as a 2026 contribution. Tax-free withdrawals apply only to medical costs incurred after the HSA was opened.
- **delayStockSale**: "Not on the 2026 Form 8949." Proof: trade confirmations. Warnings: market risk; include the sale in the 2027 estimate.
- **taxLossHarvest**: "Form 8949 / Schedule D; net loss over $3,000 carries forward." Proof: 1099-B. Warning: **wash sale**. No same or substantially identical security 30 days before or after, including in IRAs.
- **traditionalIra**: "Schedule 1 IRA deduction." Proof: Form 5498, with the contribution designated for 2026. Warnings: Roth contributions don't count; deductibility phases out when covered by a workplace plan.
- **sepIra**: "Schedule 1, SEP deduction." Proof: Form 5305-SEP and Form 5498. Warnings: self-employed only; if you have employees, they must be included.

**Plan output and "worth it" test:**
```ts
interface PlanResult {
  verdict: 'under_line' | 'worth_it' | 'costly' | 'needs_retirement_moves' | 'not_worth_fighting';
  target: number; magiBefore: number; magiAfter: number;
  ptcBefore: number; ptcAfter: number; repaymentBefore: number; repaymentAfter: number;
  moves: Move[];
  totals: { cashCommitted: number; lockedInRetirement: number; deferredToNextYear: number; incomeTaxSaved: number };
  maxReductionAvailable: number;      // MAGI reduction if every allowed lever is used to capacity
  setAside: number | null;            // = repaymentBefore when not_worth_fighting
  suggestion: 'allow_retirement_moves' | null;
}
```
- `cashCommitted` = purchases + HSA + IRA + SEP. `lockedInRetirement` = IRA + SEP. `deferredToNextYear` = invoice timing + delayed sales.
- Verdicts:
  - Infeasible, but feasible once retirement levers are allowed → `needs_retirement_moves`, with the suggestion.
  - Infeasible with every lever → `not_worth_fighting`. Copy: *"Set ${setAside} aside, update your Marketplace income now, give an accurate 2027 estimate."*
  - Feasible and (lockedInRetirement + HSA) > 3 × (ptcAfter − ptcBefore) → `costly` (threshold is an assumption). Otherwise → `worth_it`.

### A.7 Gig check (`gig.ts`, server-only)
```ts
interface GigCheckResult {
  gigAmount: number; magiWithout: number; magiWith: number; crossesCliff: boolean;
  taxOnGig: { seTax: number; incomeTax: number; total: number; marginalRate: number };
  options: Array<{
    id: 'decline' | 'take_do_nothing' | 'take_with_plan' | 'bill_in_january';   // bill_in_january only if canBillInJanuary
    netFromGig: number; ptcKept: number; repayment: number; notes: string[];
  }>;
  lossZone: { from: number; to: number } | null;   // gig amounts where take_do_nothing < 0 (binary search, $1)
  curve: Array<{ gig: number; netDoNothing: number; netWithPlan: number }>;     // gig 0..30,000 step 500
  plan: PlanResult;                                // redacted by the API when unpaid
}
```
- decline: net 0.
- take_do_nothing: `gig − taxOnGig − (ptcBase − ptcWithGig)`.
- take_with_plan: `gig − taxOnGig − (ptcBase − plan.ptcAfter) + incomeTaxSaved(HSA + IRA + SEP)`. Money placed in an HSA, IRA or SEP, or deferred to January, still belongs to the user. The UI shows it as "of which $X in your HSA / arrives in January".
- bill_in_january: `gig − taxOnGig`, with `ptcKept = ptcBase`, and the note "adds $gig to 2027 income; include it in your 2027 estimate."

### A.8 Report change, alerts, deadlines, 2027 estimate
- **Report change:** `recommended = asOf < 2026-12-01 && |projectedMAGI − incomeEstimate| ≥ max(2,500, 5% × estimate)` (thresholds are an assumption).
  - `incomeToReport = projected MAGI *before* plan moves`. That's honest and conservative.
  - Copy: "Reporting doesn't change the year's total; it moves part of April's bill into lower credits now."
- **Alerts** (`alerts.ts`), comparing the previous check-in to the new diagnosis:
  - `CROSSED_CLIFF`, `BACK_UNDER_CLIFF`
  - `APPROACHING_CLIFF` (entering the near zone)
  - `REPAYMENT_UP` (≥ $250 since the last check-in)
  - `REPORT_CHANGE`
  - `DEADLINE_SOON` (within 14 days)
  - Copy is static templates filled with engine numbers.
- **Deadlines** (`deadlines.ts`): the dated list from `rules.dates`, filtered to dates ≥ asOf. Each item carries the levers it affects. The same list feeds the UI chips and the `.ics`.
- **2027 estimate** (`estimate2027.ts`):
  - `floor = expected2027 + plan.totals.deferredToNextYear`.
  - Return `{ floor, cliff2027, headroom2027, warning }`.
  - **No code path may return a recommended estimate below `floor`.**

### A.9 Rounding and precision
- Compute in floating dollars.
- Round household income to whole dollars before FPL % and the contribution, as Form 8962 does.
- Lever amounts are multiples of $10, rounded up.
- Round results to whole dollars only for display and fixtures. Fixture tolerance is ±$1, except where §B says otherwise.

### A.10 Edge cases and flags (every flag has static UI copy)
| Case | Behavior |
|---|---|
| Income exactly at the cliff ($128,600) | Eligible (F2) |
| $1 over the cliff | Full repayment (F2) |
| Far over (e.g. MAGI $250k) | Repayment = APTC received (the maximum). `not_worth_fighting` (F8) |
| APTC = 0 | Nothing to repay; possible credit at filing (`NO_APTC`) |
| Income below the estimate | Refund shown ("up to" without a premium) |
| Partial year (months < 12) | Monthly math × months; `PARTIAL_YEAR` |
| Guards fail, credit ≥ premium, or estimate over the cliff with APTC | Manual SLCSP required (F10) |
| SE loss or < $400 net earnings | No SE tax; SE levers have 0 capacity |
| SE above the SS wage base | Only 2.9% on the excess |
| Net capital loss | Limited to −$3,000; carryovers not collected (`CAPITAL_LOSS_LIMITED`) |
| Married filing separately | Rejected with an explanation (`FILING_STATUS_UNSUPPORTED`) |
| Below 100% FPL | Computed with the bottom rate and flagged `BELOW_100_FPL`; no plan |
| State-based exchange | Computed, with banner `SBM_STATE` |
| Not collected | `SEHI_DEDUCTION_EXCLUDED` (conservative: true MAGI may be lower), `AGE_CATCHUP_EXCLUDED`, `ROUGH_TAX_ESTIMATE` |
| Silver/gold/platinum/unknown plan | HSA lever ineligible, with an "unless your plan is an HSA-qualified HDHP" note |

## B. Test fixtures (expected outputs, ±$1)

**Dani preset** (`src/samples/dani.ts`, asOf `2026-11-14`):
- TX, mfj, household 4.
- Marketplace: estimate $105,000; APTC $778.50/mo × 12; full credit yes; household unchanged yes; bronze, family, premium $1,240/mo.
- Dani (a): SE profit ytd $78,000 + expected $13,500; not covered; $0 contributed so far.
- Alex (b): wages ytd $29,200 + expected $5,800; not covered.
- Investments: interest $500, tax-exempt interest $500, dividends $1,000, gains $0.
- Levers: unbilled invoices movable $3,000; planned purchases $1,800; stock gains $0; losses $0. HSA contributed so far $0.
- Preferences: Keep my cash ON, default order. Gig: $12,000, `canBillInJanuary: false`.

| ID | Case | Expected |
|---|---|---|
| **F1** | Dani, where you stand | FPL $32,150 · cliff $128,600 · half SE tax $6,464 · AGI $121,536 · **MAGI $122,036** · FPL % 379 · figure 0.0996 · SLCSP derived **$19,800** · PTC **$7,645** · **repayment $1,697** · headroom **$6,564** · zone `near` · reportChange recommended, report **$122,036** · daysToYearEnd 47 |
| **F2** | Dani reconcile at fixed MAGI (handoff §4 table) | $100,000 → refund $498 · $105,000 → $0 · $115,000 → **$996** · $120,000 → **$1,494** · $128,599 → **$2,350** · $128,600 → $2,351 (eligible) · $128,601 → **$9,342** · $134,000 → $9,342 · $250,000 → $9,342 |
| **F3** | Dani + $12k gig, Keep my cash ON | MAGI with gig **$133,188** · taxOnGig $3,034 (SE $1,696 + income tax $1,338; marginal 12%) · take_do_nothing **net $1,321**, repayment $9,342 · plan moves: invoiceTiming **$3,000**, businessPurchases **$1,800**, hsa **$1,130** · MAGI after **$127,597** · repayment after **$2,251** · take_with_plan **net $8,548** · verdict `worth_it` |
| **F3b** | Dani loss zone | lossZone ≈ {from **$7,064**, to **$10,233**} (±$5) · an $8,000 gig, doing nothing → **net −$1,668** |
| **F3c** | Dani + $12k gig, `canBillInJanuary: true` | bill_in_january net **$8,966**, ptcKept $7,645 · note "include in 2027 estimate" |
| **F4** | Dani + $12k gig, Keep my cash OFF, order `[sepIra, …]` | sepIra **$5,590** (cap $19,238) · MAGI after $127,598 · repayment after **$2,251** · incomeTaxSaved $671 · net **$9,083** |
| **F5** | Morkel case 1 (single, 2026 rules) | FPL $15,650 · estimate $31,300 (200% → 0.0660) · APTC $7,294/yr · derived SLCSP ≈ **$9,360** · actual $56,000 → 357% → PTC **$3,782** · **repayment $3,512** |
| **F6** | Morkel case 2 | actual $63,000 (> $62,600) → PTC $0 → **repayment $7,294** (full). Same household under `TY2025_ENHANCED` with SLCSP $9,360 → **$3,289** |
| **F7** | KFF family of 3, 2025 plan year (`TY2025_ENHANCED`, 2024 FPL $25,820) | estimate $100,000 → 387% → figure **0.0818** → derived SLCSP **$42,643** · actual $105,000 (407%, 8.5%) → PTC **$33,718** → **repayment $745** (no cap at ≥400%). Same APTC $34,463 with `{...TY2026, fpl: FPL_2024}` → over the cliff → **repayment $34,463** |
| **F8** | Far over: Dani + `otherIncome` $128,000 | MAGI $250,036 · repayment **$9,342** (= APTC; the maximum) · verdict **`not_worth_fighting`** · setAside $9,342 |
| **F9** | Dani + $12k gig, asOf `2027-02-01`, Keep my cash ON | Dec 31 levers unavailable → moves: hsa **$5,590** · repayment after $2,251 · net $9,083 |
| **F10** | Dani + $12k gig, silver plan, invoices/purchases $0 | Keep my cash ON → **`needs_retirement_moves`**, suggestion `allow_retirement_moves` · OFF → traditionalIra (Dani, a) **$5,590** · repayment after $2,251 |
| **F11** | Applicable figure (TY2026) | 100→0.0210 · 132→0.0210 · 133→0.0314 · 149→0.0413 · 150→0.0419 · 175→0.0540 · 200→0.0660 · 225→0.0752 · 250→0.0844 · 275→0.0920 · 300→0.0996 · 400→0.0996 · 401→null. Truncation: income/FPL = 3.997 → 399 |
| **F12** | SLCSP guards | tookFullCredit false and no override → `SLCSP_REQUIRED` · APTC ≥ premium → `SLCSP_DERIVATION_UNRELIABLE` · override $20,000 → source `manual` |
| **F13** | Estimate never understated | Dani F3 plan, expected 2027 $120,000 → floor **$123,000**; cliff2027 **$132,000**; no output < floor |
| **F14** | Filing status mfs | Rejected, `FILING_STATUS_UNSUPPORTED` |
| **F15** | Optimizer properties (table-driven over F3/F4/F9/F10) | Amounts are multiples of $10 · never above capacity · no locked lever when Keep my cash is ON · MAGI after ≤ target when feasible · deterministic (same input → deep-equal output) |

## C. Screens and states

All screens work at **375 px** (single column, sticky bottom CTA on mobile) and on desktop. The footer on every page reads: "Education, not tax advice. Rules as of Nov 2026. Delete my data."

| Screen | Content | Loading | Empty | Error |
|---|---|---|---|---|
| **S0 Landing** `/` | Hero; **Try Dani's family**; "Check my numbers"; "Upload my notice"; the 2026-changes box (3 rules, linked sources); "Free calculators stop at the bill."; who it's for and not for; return banner if a household exists ("Your December check-in is due") | Button spinner on the Dani click ("Computing Dani's year…") | n/a | Toast "Couldn't load the sample, try again" plus retry |
| **S1 Check** `/check` (5 steps, progress bar) | 1 Where & who (state, filing status, household size; SBM warning). 2 Marketplace (estimate, APTC/mo, *Advanced*: months, premium; guards default yes → manual SLCSP field when no; **Upload notice** / **Use sample notice**). 3 Plan (metal, coverage). 4 2026 income per adult (SE profit so far + still expected; wages so far + expected) plus collapsible investments and other income. 5 Your options (all optional, "Skip, decide on the plan"): unbilled work movable, planned purchases, planned stock gains, unrealized losses, HSA/IRA/SEP so far, workplace plan per adult | Extraction: "Reading your notice… usually 10–20 s" with cancel | First visit: empty fields with example placeholders (never pre-filled except for Dani) | Inline Zod messages per field; extraction failure → "Couldn't read it. Enter the numbers below" (form stays usable); 429 → "Upload limit reached, try in N min" |
| **Extraction confirm card** | Each field with the extracted value, an editable input and the quoted evidence; "Confirm and use these" | n/a | Field not found → empty and highlighted | `NOT_RECOGNIZED` → "This doesn't look like a Marketplace eligibility notice" |
| **S2 Result** `/result` | Headline (MAGI, % FPL, cliff, headroom, repayment with a "no cap from 2026" badge); **cliff chart** (x: MAGI; y: repayment; red wall at the cliff; dots for now and with-gig); **extra-income slider** $0–$40k (client-side engine); report-change card; days-left chip; "How we got this" (Form 8962 preview lines and the MAGI breakdown); flags accordion; "Got an offer?" input | Skeleton cards | No household → redirect to `/` with "Start with Dani or your numbers" | `SLCSP_REQUIRED` → back to step 2 with the manual field focused |
| **S3 Gig check** (on `/result`) | Options table (decline / do nothing / with plan / bill in January if allowed); net-vs-gig chart with gig slider and a red **loss zone** band; headline "Doing nothing: $1,321. With a plan: $8,548."; **See the rescue plan** | Spinner on the table | No gig yet → prompt "Enter an offer to see if it's worth it" | Amount ≤ 0 or > $500k → inline error |
| **S4 Plan preview** `/plan` | Verdict badge; **Keep my cash** toggle; lever list with up/down buttons and a disabled state plus reason (e.g. "Not HSA-eligible: silver plan"); moves with name, deadline and liquidity chip, amount shown as `$•,•••` with a lock icon; totals visible (repayment before→after, net kept); **Unlock exact plan** | Totals shimmer on toggle (< 300 ms) | `under_line` → "You're under the line. No rescue needed. Each $1,000 more costs you about $100 of credit." plus a Year upsell for monitoring | `not_worth_fighting` → set-aside card; `needs_retirement_moves` → "Allow retirement moves?" CTA |
| **S5 Paywall** (modal) | Year $79/yr (badge "Best for variable income"); Rescue $59; computed value line; a visible box: **"Test mode: card 4242 4242 4242 4242, any future date, any CVC, any ZIP. No real charge."** | "Opening secure checkout…" | n/a | Checkout create fails → "Payment is unavailable right now; no charge made" plus retry; canceled return → toast "No charge made" |
| **S6 Success** `/success?session_id=` | Server verifies → "Unlocked: CliffGuard Year" → auto-redirect to `/plan` in 2 s | "Confirming your payment…" | Missing `session_id` → redirect `/plan` | Mismatch or unpaid → "We couldn't confirm this payment" plus a link back |
| **S7 Unlocked plan** `/plan` | Per move: amount, how-to steps, deadline date, where it shows on the return, proof checklist (checkboxes persist), warnings; **Explain my plan**; **Ask a what-if** (input ≤ 500 chars, answer with "numbers from the engine" chips); **Tax-preparer export**; Year: **Add deadlines to calendar** (.ics) and **Start check-in** | Explain/Ask: typing indicator, 15–30 s cap | No moves (`under_line`) → monitoring card | Claude down → template explanation and "Q&A unavailable right now; try the sliders" |
| **Export** `/plan/export` | Print layout: household inputs, SLCSP method, MAGI breakdown, Form 8962 preview (labels as on the 2025 form: family size, household income, FPL %, applicable figure, annual contribution, annual SLCSP, PTC allowed, APTC, excess APTC, "repayment limitation: none for 2026"), moves with amounts, deadlines, return locations, proofs, flags, rules id and timestamp, disclaimer; **Print / Save as PDF** button | n/a | Unpaid → redirect to `/plan` with the paywall | n/a |
| **S8 Check-in** `/checkin` (Year) | "Since {last date}, what came in?" per adult (SE received, wages received), investment sales, "Still expected for the rest of the year?" (default: old expected − received, floored at 0) → **Update**; result: delta card (MAGI, headroom, repayment, with arrows), alerts, updated plan link; history table and sparkline; Jan 15 card (expected 2027 → floor → 2027 cliff); "Next check-in: Dec 1" and `.ics` | Button spinner | First check-in → "This is your baseline"; no history → hidden chart | Rescue-only users → locked preview plus Year CTA |

**Chart:** Recharts, or a small hand-rolled SVG. The curve is computed client-side from `reconcile` over MAGI from (min(estimate, MAGI) − $20k) to (cliff + $20k) in $250 steps, plus the points cliff and cliff+1 so the wall is vertical.

## D. Data model and API

**Session:** `middleware.ts` sets `cg_sid` = `crypto.randomUUID()` if it is missing (`httpOnly`, `secure` in production, `sameSite=lax`, `path=/`, maxAge 400 days). The id is never sent to Claude or Stripe except as Stripe's `client_reference_id`.

**Redis (Upstash) keys:**
- `cg:hh:{sid}` → `HouseholdRecord` (TTL 400 days, refreshed on write)
- `cg:explain:{sid}:{planHash}` → `Explanation` (TTL 24 h)
- `cg:qa:{sid}` → last 6 Q&A turns (TTL 7 days)
- `cg:claude:calls:{yyyy-mm-dd}` → daily counter
- `cg:rl:*` → rate-limit windows

```ts
interface HouseholdRecord {
  version: 1; sid: string; createdAt: string; updatedAt: string;
  source: 'sample_dani' | 'manual' | 'upload';
  input: HouseholdInput;
  lastGig: { amount: number; canBillInJanuary: boolean } | null;
  planProgress: Partial<Record<LeverId, { done: boolean; doneAt?: string; proofsChecked: number[] }>>;
  checkins: Checkin[];                               // newest last, max 24
  entitlement: { product: 'rescue' | 'year'; stripeSessionId: string; paidAt: string; validUntil: string } | null;
}
interface Checkin {
  id: string; asOf: string;
  received: { seByAdult: Partial<Record<AdultId, number>>; wagesByAdult: Partial<Record<AdultId, number>>; capitalGains: number; interestOrDividends: number };
  expectedRestAfter: { seByAdult: Partial<Record<AdultId, number>>; wagesByAdult: Partial<Record<AdultId, number>> };
  result: { magi: number; headroom: number; repayment: number; alerts: AlertCode[] };
}
```
Extracted documents are **not stored**. Only the numbers the user confirms enter `input`.

**Error shape (all routes):** `{ error: { code: ErrorCode; message: string; issues?: ZodIssue[] } }` with HTTP 400, 401, 402, 404, 413, 422, 429, 503.

| Route | Request | Response | Gate | Limits |
|---|---|---|---|---|
| `GET /api/household` | — | `{ household: HouseholdRecord \| null; diagnosis: Diagnosis \| null }` | — | 120/min/IP |
| `PUT /api/household` | `HouseholdInput` | `{ household; diagnosis }` | — | 60/min/session |
| `POST /api/household/sample` | `{ persona: 'dani' }` | `{ household; diagnosis; gig: GigCheckResult(redacted) }` | — | 30/min/session |
| `DELETE /api/household` | — | `{ ok: true }` (also clears the cookie) | — | — |
| `POST /api/gig-check` | `{ amount: number; canBillInJanuary: boolean }` | `GigCheckResult` (plan redacted unless entitled) | — | 60/min/session |
| `POST /api/plan` | `{ gig: {amount, canBillInJanuary} \| null; keepMyCash: boolean; leverOrder: LeverId[] }` | `{ plan: PlanResult \| PlanSummary; entitled: boolean }`; saves preferences | Full plan requires an entitlement | 120/min/session |
| `PATCH /api/plan/progress` | `{ leverId; done?: boolean; proofsChecked?: number[] }` | `{ ok: true }` | Entitled | 60/min |
| `POST /api/extract` | multipart `{ file, docType: 'eligibility_notice' }` **or** JSON `{ sample: 'dani_notice' }` | `{ extraction: EligibilityNoticeExtraction; confirmed: false }` | — | 3/h/session, 10/day/IP; file ≤ 5 MB; pdf/png/jpeg/webp |
| `POST /api/checkout` | `{ product: 'year' \| 'rescue' }` | `{ url: string }` | — | 10/h/session |
| `/success` (server component) | `?session_id=` | Verifies and writes `entitlement`, then redirects | — | — |
| `POST /api/explain` | `{}` (server uses the stored household and preferences) | `Explanation` (`source: 'claude' \| 'template'`) | Entitled | 10/h/session; cached by planHash |
| `POST /api/ask` | `{ question: string }` (≤ 500 chars) | `{ answer: GroundedAnswer; scenarios: ScenarioSummary[]; source: 'claude' \| 'unavailable' }` | Entitled | Rescue 10/day, Year 30/day, 60/day/IP |
| `POST /api/checkin` | `{ received: …; expectedRestAfter: … }` | `{ checkin: Checkin; diagnosis: Diagnosis; alerts: Alert[] }` | Year | 30/day/session |
| `GET /api/calendar.ics` | — | `text/calendar`: all-day events for Dec 15, Dec 31, Jan 15, Jan 31 and Apr 15 (VALARM −P7D and −P1D), plus a monthly check-in on the 1st (`RRULE:FREQ=MONTHLY;COUNT=12`) linking to `/checkin` | Year | — |

`PlanSummary` = `PlanResult` with each `move.amount`, `magiReduction`, `howTo` and `proof` replaced by `null` (`locked: true`). Redaction is a pure function in `src/server/redact.ts` with a unit test.

**Stripe (test mode, no webhook):**
- `checkout.sessions.create` with `client_reference_id = sid` and `metadata.product`.
  - Rescue: `mode: 'payment'`, `price_data` 5900 USD.
  - Year: `mode: 'subscription'`, `price_data` 7900 USD with `recurring: { interval: 'year' }`.
  - `success_url: ${APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`, `cancel_url: ${APP_URL}/plan?canceled=1`.
- On `/success`, retrieve the session and require `client_reference_id === sid && status === 'complete' && payment_status === 'paid'`. Then write the entitlement idempotently:
  - Rescue: `validUntil` = 2027-10-15.
  - Year: paidAt + 365 days.

**Env (`.env.example`):** `ANTHROPIC_API_KEY`, `CLAUDE_ENABLED=true`, `CLAUDE_DAILY_CALL_CAP=1000`, `STRIPE_SECRET_KEY` (sk_test_…), `APP_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

## E. Claude responsibilities (server-only)

**Common rules:**
- Model `claude-opus-5-5` via `@anthropic-ai/sdk`. Code lives in `src/server/claude/*` with `import 'server-only'`. Builders **load the `claude-api` skill first** and use structured outputs or tool schemas generated from the Zod schemas below, never regex on prose.
- Every call:
  - checks `CLAUDE_ENABLED` and the daily cap (`INCR cg:claude:calls:{date}`);
  - has a timeout (extraction 25 s, explanation 15 s, Q&A 30 s total);
  - never logs document contents;
  - falls back deterministically on any failure.
- Claude never produces a number that reaches the user unless the number was validated against user input or engine output.

| Use | Purpose | Input to Claude | Output schema (Zod) | Caps | Fallback |
|---|---|---|---|---|---|
| **E.1 Extraction** (eligibility notice; N1/N2 add `bank_csv`/`invoice` with their own schemas) | Read the notice the user has *today* and pre-fill steps 1–3 | The file as a document or image block inside a delimited "untrusted document" section. No tools. No household data | `{ docType: 'marketplace_eligibility_notice' \| 'not_a_notice'; coverageYear: int 2025–2027 \| null; state: UsStateCode \| null; householdSize: int 1–10 \| null; incomeEstimate: 0–2,000,000 \| null; aptcMonthly: 0–10,000 \| null; premiumMonthly: 0–10,000 \| null; planMetal: enum \| null; planName: string ≤ 80 \| null; evidence: { field: string; quote: string ≤ 100 }[] ≤ 10; warnings: string ≤ 160 [] ≤ 5 }` | max_tokens 1,200; file ≤ 5 MB | "Couldn't read it. Enter the numbers below." The form stays usable |
| **E.2 Explanation** | A plain-English, 3-paragraph explanation of *this* diagnosis and plan; per-move notes | The engine's `Diagnosis` + `PlanResult` (or `GigCheckResult`) JSON plus static lever copy. No free text from the user | `{ headline: string ≤ 140; paragraphs: string ≤ 500 [] 1–3; moveNotes: { leverId: LeverId; note: string ≤ 300 }[]; caveats: string ≤ 200 [] ≤ 4 }` | max_tokens 900; cached by planHash | `templateExplanation(diagnosis, plan)`: deterministic sentences in `src/engine/explainTemplate.ts` (also used when Claude is off) |
| **E.3 Q&A** | Answer what-ifs ("What if I also sell $4k of stock?") by **calling the engine** | System prompt (rules below) + household summary from the engine + the last 6 turns + the question. Tools: `run_scenario` and `get_deadlines` | Tool `run_scenario` input: `{ label: string ≤ 60; gig?: { amount 0–500k; canBillInJanuary? }; extra?: { selfEmployment?, wages?, capitalGains?, interestOrDividends? } (each −200k–200k); levers?: Partial<Levers>; keepMyCash?: boolean; leverOrder?: LeverId[] }` → returns `{ label, diagnosis: {magi, fplPercent, cliff, headroom, ptc, repayment}, gig?: {netDoNothing, netWithPlan}, plan: {verdict, moves: {leverId, amount, deadline}[], repaymentAfter} }`. Final answer: `{ answer: string ≤ 1,200; scenarioLabels: string[]; outOfScope: boolean; refused: boolean }` | ≤ 3 tool rounds; max_tokens 700 per call; question ≤ 500 chars | "Q&A is unavailable right now. Try the sliders and the toggle." |

### E.4 Grounding validator (`src/server/claude/grounding.ts`, unit-tested)
- Extract every number in Claude's text: `$`, commas, percentages, plain integers.
- Each must match, within ±1, a value in the **allowed set**:
  - all numbers in the engine JSON sent or returned (also as rounded whole dollars and as percentages ×100 for figures);
  - numbers in the user's question;
  - the day, month and year parts of deadline dates;
  - small counting words and numbers 1–12.
- On failure: retry once with the offending numbers listed. Then use the template (explanation) or "I couldn't verify that answer" (Q&A).
- This is how we prove the LLM never invents a figure.

### E.5 System-prompt rules (Q&A and explanation)
- "You explain results from a deterministic rules engine. Use only numbers from the engine JSON or tool results."
- "Education, not tax advice. Suggest reviewing with a tax preparer for plan changes."
- "**Never** help someone report a lower Marketplace income estimate than they expect, hide income, ask a client to hold a payment, or backdate documents. Refuse briefly and offer the legal moves."
- "Out of scope: the self-employed health-insurance deduction, state-exchange subsidies, Medicaid months, mid-year marriage, shared policies, married filing separately. Say so."
- "Answers ≤ 120 words, plain English, no markdown tables."

### E.6 Untrusted input
- Uploaded files are data. The system prompt says the document may contain instructions and that they must be ignored. Extraction has **no tools** and receives no other data.
- The output is schema-constrained, Zod range-checked, then cross-checked:
  - coverageYear ≠ 2026 → warning;
  - APTC above the premium → warning;
  - household size vs the state's form.
- The **user must confirm** before anything is saved.
- Q&A tools are read-only, pure engine runs on the user's own household: no writes, no network, no other users' data. Tool inputs are Zod-validated, and invalid calls return an error to Claude.
- Questions are length-capped and rate-limited.

### E.7 Limits summary
| Limit | Value |
|---|---|
| Upload | ≤ 5 MB; pdf/png/jpeg/webp; 1 file per request |
| Extraction | 3/h per session, 10/day per IP |
| Explanation | 10/h per session (paid), cached |
| Q&A | Rescue 10/day, Year 30/day per session; 60/day per IP; ≤ 3 tool rounds |
| Global | `CLAUDE_DAILY_CALL_CAP` (default 1,000) → automatic template mode; Anthropic console spend limit (§G) |
| Non-AI routes | 60–120/min per session or IP (Upstash sliding window) |

## F. v1 vs pitch-only

| Capability | v1 live | Pitch only (roadmap) |
|---|---|---|
| Rules engine (Form 8962 method, uncapped, cliff), MAGI from components | ✔ | |
| Gig check, loss zone, optimizer, Keep my cash, reorder, verdicts | ✔ | |
| Eligibility-notice extraction (incl. the sample notice) | ✔ | |
| Bank CSV / invoice extraction | stretch (N1/N2) | ✔ |
| Claude explanation (grounded) and Q&A with the engine tool | ✔ (Q&A is first to cut) | |
| Stripe Checkout | test mode | live mode |
| Year as an annual subscription | ✔ (interval: year) | renewal anchored to Nov 1 open enrollment |
| Monthly check-ins, alerts, history, `.ics` reminders, Jan 15 card | ✔ | |
| Email / SMS reminders | stretch (N5) | ✔ |
| 1095-A verification | stretch (N6, useful from late Jan) | ✔ |
| CMS benchmark by ZIP and age | stretch (N9) | ✔ |
| State-exchange subsidies (CA, NJ, NM, …) | warning only | ✔ |
| SE health-insurance deduction (iterative), Solo 401(k), catch-ups | flagged | ✔ |
| "Income Guard" multi-cliff (RAP student loans, CTC, Roth limits, QBI) | | ✔ |
| B2B2C (brokers, CPAs, freelance platforms) | | ✔ |
| Bank linking (Plaid) | | ✔ |

## G. Demo-day checklist (owner: captain; verify by 10:00 on Nov 15)

- [ ] `ANTHROPIC_API_KEY` set in Vercel **Production** (and Preview). Test one extraction on prod.
- [ ] Anthropic credits ≥ $50, and a **monthly spend limit** set in the console (amount: D7).
- [ ] `CLAUDE_DAILY_CALL_CAP` set; `CLAUDE_ENABLED=false` tested on a preview deploy (every fallback path works).
- [ ] `STRIPE_SECRET_KEY` is `sk_test_…`; the test-card hint is visible on the paywall at 375 px; one full purchase of each product completed on prod.
- [ ] `APP_URL` matches the prod domain (Stripe success/cancel URLs).
- [ ] Upstash env vars set; `DELETE /api/household` works; rate limits verified (4th upload in an hour from one session returns 429 with friendly copy).
- [ ] Incognito run of the jury path on desktop **and** phone: Dani → result → gig → plan → pay → unlocked → explain → ask → check-in → `.ics` opens in a calendar.
- [ ] `vitest`, `lint` and `typecheck` green on `main`; fixtures F1–F15 pass; `git grep -n "sk_\|ANTHROPIC_API_KEY="` finds no secrets in the repo.
- [ ] **Backup video** (≤ 2 min) of §12, linked in the README and the deck.
- [ ] README has the live URL, screenshots, architecture sketch, how to run, the agent-team story, and the "Rules as of Nov 2026" note.
- [ ] Deck numbers copied from the **live engine** (F1/F3/F3b/F4), not from the handoff. The 403% example attributed to Morkel.

## H. Open decisions for the captain

| # | Decision | Recommendation |
|---|---|---|
| D1 | Accept the corrected Dani numbers ($1,321, not "$200"; headline "an $8,000 gig leaves her $1,668 poorer") for the pitch | **Yes.** Correct math is the 40% criterion |
| D2 | Scope: only the eligibility notice is a must-have for extraction; bank CSV and invoices become N1/N2 | **Yes.** It saves about 1h; the notice is the doc users have today |
| D3 | Q&A (M15) is the first must-have cut if behind at 23:30 | **Yes.** The explanation still shows Claude on engine output |
| D4 | Year as a Stripe **subscription** (interval: year) vs a one-time 12-month pass | **Subscription.** It makes the LTV claim credible and costs no more to build |
| D5 | Reminders in v1 via `.ics` only; email (Resend plus cron) is a stretch | **`.ics` only.** It is real, needs no infrastructure, and doesn't fake an opt-in |
| D6 | State-exchange states: warn and compute (federal math) vs block | **Warn and compute** |
| D7 | Anthropic spend limit amount and who holds the console | Suggest **$100/month cap**, held by the captain |
| D8 | Reddit/forum quotes: a human must paste 3–5 real ones into the deck (agents can't reach Reddit) | Assign a human tonight |
| D9 | Product thresholds: $1,000 safety buffer, "costly" at 3×, near-cliff band 10% | Keep as defaults; revisit only if the judge objects |

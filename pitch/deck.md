# CliffGuard pitch deck (10 slides, 16:9)

Source of truth for the slides. Numbers come from `docs/spec.md`, `research/*.md` and the live engine fixtures. Anything in `[BRACKETS]` is a placeholder to fill before export. Gig figures are a "rough federal estimate" (no QBI, no state tax); show that footnote on any slide with exact gig numbers.

## Rubric map

| Slide | Title | Criterion (weight) |
|---|---|---|
| 1 | Take the gig. Keep your health subsidy. | Who (15%) |
| 2 | 2026 removed the safety net and brought the cliff back | Who (15%), New (10%) |
| 3 | The people hit hardest cannot predict their income | Who (15%) |
| 4 | Free calculators stop at the bill | New (10%) |
| 5 | One click: the bill, the decision, and the legal way to say yes | Works (40%) |
| 6 | A tested tax engine does the math. AI only reads and explains | Works (40%), New (10%) |
| 7 | $79 a year to keep thousands, and a reason to return | Sell (20%) |
| 8 | An honest $12-17M wedge, and a bottom-up path to $100M | Money (15%) |
| 9 | Unit economics: LTV/CAC 3.9x with named channels | Money (15%) |
| 10 | Try it now, no login | Works (40%), all (close and ask) |

Why now and why us is folded into slides 2, 4 and 10, to stay within 10 slides.

---

## Slide 1. Take the gig. Keep your health subsidy.

- Dani, 37, freelance UX designer in Austin, TX. Married, two kids, insured on HealthCare.gov.
- A client offers her $12,000 for December. She is tracking $122,036 against a cliff of $128,600.
- Since 2026 there is no cap on repaying the subsidy, and nobody warned her.
- CliffGuard: the decision, the legal plan, and monthly watching. Free to try: [LIVE URL]

**Visual:** Product name and tagline over `docs/screenshots/gig.png` (net-vs-gig chart with the red loss zone). Mobile variant `gig-mobile.png` as a small inset.

**Speaker notes:** Meet Dani. A client just offered her $12,000 for December, and she has 47 days to act on it. Under 2026 rules that offer can leave her poorer than saying no, and no tool she knows tells her that in time. This is the exact moment CliffGuard is built for.

---

## Slide 2. 2026 removed the safety net and brought the cliff back

- **No repayment cap from tax year 2026:** you repay all excess advance subsidy (IRS).
- **The 400% cliff is back:** for a family of 4 it is $128,600. One dollar over means no subsidy for the whole year.
- Dani: April repayment jumps from **$1,697 to $9,342** one dollar over the line (live engine).
- Published proof: KFF's family owed $745, now **$34,463** without the caps. Morkel's filer at 403%: **$7,294 vs $3,289**.

**Visual:** `docs/screenshots/result.png` (cliff chart with the red wall and slider). Small grey sources: IRS "Repayment caps eliminated" page; KFF (family-of-3 example); Morkel Financial (excess PTC repayment 2026); HHS poverty guidelines x4 (`research/tax-tables-2026.md`).

**Speaker notes:** From tax year 2026 the IRS says the full excess must be repaid, and the cliff above 400% of the poverty line is back. The cliff turns a $1 difference in income into a bill of thousands. Both published examples are reproduced to the dollar by our engine.

---

## Slide 3. The people hit hardest cannot predict their income

- **19.2M** Marketplace enrollees in Feb 2026 (KFF). **26%** of likely shoppers see income swing 20% or more in a year (KFF). **43%** of enrollees plan to work more hours (KFF poll via KFF Health News).
- Persona: variable-income families who buy on HealthCare.gov. Their income is a forecast, not a fact.
- Their words, verbatim:
  - "I can make anywhere between $20,000 and $45,000 next year. I just don't know." (client of a legal-aid group, KFF Health News)
  - "This seems extremely unfair. I was not warned about this, and needed the subsidized insurance until my new job started." (ObamacareFacts reader question)
  - Urban Institute's Jason Levitis on one extra shift that could cost $10,000: "maybe don't take that shift."
- `[QUOTE 1-3 from research/quotes.md]` Reddit/forum quotes with links. `research/quotes.md` does not exist yet (GitHub issue #2). Never paraphrase. If still missing at export, delete this bullet.

**Visual:** Three big numbers (19.2M, 26%, 43%) on the left. Quotes on the right in speech-bubble style. Persona card for Dani at the bottom.

**Speaker notes:** Freelancers, gig workers and small-business owners cannot know December's income in November. Today they guess, Google, or turn down work. The quotes are from real enrollees and the experts who study them. Sources: `research/track-01-money.md` s4, `research/new-rules-radar.md` s2A.

---

## Slide 4. Free calculators stop at the bill

| Today's option | What it gives | Why it fails Dani |
|---|---|---|
| Free calculators (StateCalc, healthinsurance.org, NerdWallet, KFF) | The repayment number | No decision, no moves, no monitoring |
| TurboTax, H&R Block | Form 8962 in Feb-Apr | Too late: Dec 31 moves have expired |
| Stride Health (enrollment for gig workers) | Enrollment and income worksheet | No gig decision or rescue plan found |
| Instead (AI tax planning, from $16/mo) | Strategy for businesses and CPAs | B2B and generalist |
| ChatGPT-style chatbots | Generic tips | Can apply the old capped rules, and only answers when asked |

- CliffGuard is the only product we found that combines all four: the gig decision, an ordered legal optimizer ("Keep my cash"), intake from the eligibility notice, and monitoring that warns first.

**Visual:** The table. A small `docs/screenshots/plan-locked.png` on the right showing the optimizer with the "Keep my cash" toggle.

**Speaker notes:** Everyone gives you the bill. Nobody gives you the decision and the plan while there is still time to act. A juror can fairly say a calculator is a commodity, so we give the bill away and sell the decision and the plan. Honest risk: our search was by web scan, not exhaustive, and the repo's `research/new-rules-radar.md` lists every rival we found.

---

## Slide 5. One click: the bill, the decision, and the legal way to say yes

- **Try Dani's family** opens her result: MAGI **$122,036**, cliff **$128,600**, **$6,564** of headroom, **$1,697** due in April if nothing changes.
- Gig check: take the $12k gig and do nothing, she keeps **$1,321**. With the rescue plan she keeps **$8,548**. An $8k gig does nothing but lose money (loss zone).
- **See the rescue plan:** bill $3,000 of not-yet-invoiced work in January, buy the planned laptop now, top up her HSA. "Keep my cash" puts liquid moves first.
- Every number is computed live on the server for each request. Only Dani's sample inputs are fixed.

**Visual:** Four screenshots in a row: `result.png` then `gig.png` then `plan-locked.png` then `plan-unlocked.png`. Footnote: "rough federal estimate: excludes QBI deduction and state tax." Link: [LIVE URL].

**Speaker notes:** This is where the live demo goes, about 60 to 90 seconds (script in the appendix). The juror gets a valuable result in under a minute with no login. If the demo fails, these four screenshots carry the slide.

---

## Slide 6. A tested tax engine does the math. AI only reads and explains

- Deterministic engine follows the IRS Form 8962 method. **553 unit tests**, including KFF ($745 and $34,463), Morkel ($3,512; $7,294 vs $3,289) and the IRS 2026 draft Form 8962 examples.
- **Claude's job:** read the user's HealthCare.gov eligibility notice (the user confirms the numbers) and explain the plan. A grounding validator blocks any number Claude did not get from the engine.
- Plan amounts are redacted server-side until unlock. The engine never outputs an income estimate below the projection (unit-tested).
- Privacy: no names or SSNs. Uploads are processed in memory, never stored. "Delete my data" is one click.
- Education, not tax advice. A "Tax-preparer export" gives a Form 8962 preview and the proof list.

**Visual:** Flow diagram: Documents -> Claude (reads) -> **Rules engine (math, tested)** -> Claude (explains, validated) -> User. Beside it, a screenshot of the test run (`npm test`: all passing) and the repo link `[GITHUB URL]`.

**Speaker notes:** If we were a dollar off TurboTax you should not trust us, so the math is plain code tested against published IRS, KFF and Morkel cases. The AI reads documents and explains; it is not allowed to invent a number. The jury can read the repo: engine in `src/engine/`, tests in `src/engine/__tests__`.

---

## Slide 7. $79 a year to keep thousands, and a reason to return

| Free | Rescue **$59** one-time | **CliffGuard Year $79/yr** (recommended) |
|---|---|---|
| Where you stand, gig check, plan preview | Exact amounts, deadlines, proofs, preparer export, Claude explanation | Everything in Rescue, plus monthly check-ins, cliff alerts, calendar (.ics) deadlines, Jan 15 estimate, 2027 coverage year |

- Value line: Dani's plan keeps **$7,227** more than doing nothing, so $79 is about 1% of it.
- Billing: **Stripe-ready entitlement; demo unlock for judging.** The live build uses a labelled no-payment "Unlock Year demo — free"; real Stripe checkout is deferred.
- Why they return: lumpy income lands monthly (30-second check-in with re-projection and alerts); plan to-dos persist; hard dates Dec 31, Jan 15, Apr 15; a new coverage year every November.
- Honest framing: monthly for lumpy earners, seasonal for everyone else. Annual billing only.

**Visual:** The pricing table with the Year column highlighted. Screenshot `checkin.png` on the right.

**Speaker notes:** The free tier gives the bill and the decision. The paid tier gives exact amounts, deadlines and the monitoring that makes it a year-round product. For comparison, Instead's AI tax planning starts at $16 a month and Student Loan Planner charges $595 for one consult on a comparable rules problem. We say plainly that checkout is a demo unlock today.

---

## Slide 8. An honest $12-17M wedge, and a bottom-up path to $100M

- **ACA wedge alone:** 19.2M enrollees in 2026 fall to 13.1M in 2027 (CBO). About 7.7-11.3M households at 1.7 people each (assumption). 26% with income swings (KFF) gives **2.0-2.9M core households**. At 8% paying x $72 that is a **$12-17M ARR ceiling**.
- **$100M comes from the same income engine applied to more cliffs.** Table below (2030, assumptions):

| Segment | Payers / seats | Price | ARR |
|---|---|---|---|
| ACA variable earners | 200k | $79 | ~$16M |
| Income Guard: other income cliffs for variable earners (student-loan payments tied to AGI, IRA and credit phase-outs, quarterly estimated tax) | 650k | $99 | ~$64M |
| B2B2C seats (CPAs, brokers, freelance platforms) | 7M | $3 | ~$21M |
| **Total** | | | **~$100M** |

- Policy risk: rules are versioned data (`ty2026-v1`), so a law change is a one-file swap. Every new income-tested benefit is another cliff for the same engine.
- Not built today: Income Guard and B2B2C. They are the expansion thesis, not the product.

**Visual:** Bar chart: ACA wedge $16M, Income Guard $64M, B2B2C $21M stacked to ~$100M, with the $12-17M ceiling marked. Sources in grey: KFF; CBO via `research/new-rules-radar.md`; `docs/spec.md` s8.

**Speaker notes:** We size the ACA market honestly: it is shrinking and our ceiling is $12 to $17M. The asset is the income-cliff engine, and the $100M is variable earners facing several cliffs plus seats sold through professionals. `[VERIFY: 2026 thresholds for each Income Guard cliff, and a BLS or Upwork count of 1099 earners, before claiming the segment pool]`.

---

## Slide 9. Unit economics: LTV/CAC 3.9x with named channels

| Metric | Value (assumptions unless cited) |
|---|---|
| Blended CAC | **~$35** |
| First-year ARPU | ~$72 (65% Year, 35% Rescue) |
| Gross margin | ~90% (Stripe ~$2.60 on $79; Claude about $1 per paid user per year, to be measured) |
| Year renewal | 55%, about 2.2-year life; 30% of Rescue buyers move to Year |
| **LTV** | **~$137** |
| **LTV/CAC** | **~3.9x**, payback on day 1 (annual upfront billing). Sensitivity: 40% renewal gives ~3.1x; CAC $50 gives ~2.7x |

- **Channel 1, named:** programmatic SEO pages generated by the engine ("2026 subsidy cliff for a family of 4 in Texas"), demand spikes in Dec and Feb-Apr. About $10-15 per payer.
- **Channel 2:** freelancer and creator short-form video and newsletters. $30-45 per payer.
- **Channel 3:** CPA and enrolled-agent referral share, about $15 per payer. Paid search avoided: ACA keywords are bid up by insurance lead-gen.
- None of the CAC figures is measured. We have no users yet.

**Visual:** The table, and a three-bar CAC chart by channel. Note "assumptions, not measured" in red on the slide.

**Speaker notes:** LTV works out as 0.65 x ($79 x 0.9 x 2.2) plus 0.35 x ($59 x 0.9 + 0.30 x $156), about $137 (this recomputes the spec's older $134 figure). Every input is listed so a juror can change it. The weakest input is renewal, which depends on the monthly check-in loop, so we show the sensitivity. Note: the spec s8 shows LTV about $134 and 3.8x, and the handoff shows $137 and 3.9x; the arithmetic gives $137. Fix spec s8 to match.

---

## Slide 10. Try it now, no login. Free diagnosis, $79 to keep watching

- **Live:** [LIVE URL] (QR code). Click **Try Dani's family**. Phone-width tested.
- **Repo:** [GITHUB URL]. Engine, 553 tests, README with architecture. Built in 24 hours with a 7-agent Claude Code team (researcher, strategist, judge, builder, code reviewer, QA, pitch writer). See `CLAUDE.md`.
- **Why now:** 2026 is the first tax year with an uncapped cliff. Dec 31 ends the cheapest moves, open enrollment runs to Jan 15, and the first uncapped returns land Feb-Apr 2027.
- **Next:** Stripe checkout live, the Reddit-quote evidence, then the first 2027-season SEO pages. Ask: `[ASK: feedback / pilot CPAs / intros to freelancer communities]`.
- Team: `[TEAM NAMES]`

**Visual:** Large QR code and URL. Screenshot `landing.png` (and `landing-mobile.png`) behind it. Logos of nothing; no Zimran marks.

**Speaker notes:** Free calculators stop at the bill. CliffGuard gives Dani the plan and keeps watching. Everything you saw is live, so please open it on your phone and try Dani's family.

---

# Appendix (not counted in the 10 slides)

## A. 90-second live demo script

Use an incognito window at [LIVE URL]. Expected numbers are from the engine fixtures; copy final values from the live app before presenting.

| t | Screen | Say / do |
|---|---|---|
| 0:00 | Landing | "Meet Dani: freelance designer, family of four, insured through HealthCare.gov. Since 2026 there is no cap on paying the subsidy back, and a client just offered her $12,000 for December." Click **Try Dani's family**. |
| 0:08 | Result | "She is tracking $122,036. The cliff is $128,600." Drag the slider over the red wall: "One dollar over, and her April bill jumps from $1,697 to $9,342." |
| 0:22 | Gig check | "Take the gig and do nothing: she keeps $1,321 of $12,000." Drag the gig slider to $8,000: "An $8,000 gig leaves her poorer than saying no. That is why people turn work down." |
| 0:35 | Plan preview | Click **See the rescue plan**. "Keep my cash is on: bill $3,000 of not-yet-invoiced work in January, buy the laptop she needed anyway, top up her HSA. She keeps $8,548." Flip the toggle: "Or $9,083, with $5,590 going to retirement." |
| 0:50 | Unlock | "$79 a year. Today the judging build uses a free demo unlock instead of Stripe." Click **Unlock Year demo — free**. |
| 1:02 | Unlocked plan | "Exact amounts, deadlines, the proof to keep." Click **Tax-preparer export**: "and a printable export for her preparer." |
| 1:12 | Explain | "Claude explains the plan, but every number comes from our tested engine, and we check that." |
| 1:20 | Check-in | Click **Check-in**: "Every month, 30 seconds: what came in. Alerts before she crosses the line. Her January estimate includes the income she deferred." |
| 1:27 | Close | "Free calculators stop at the bill. CliffGuard gives Dani the plan, and keeps watching." |

Do not say "retainer" or "ask the client to hold a check": invoice timing covers only work not yet invoiced, and money already available counts for 2026 (constructive receipt). Backup: a recorded video of this exact path; if the unlock misbehaves, show `plan-unlocked.png`.

## B. Claims and placeholders still open

- `[LIVE URL]`, `[GITHUB URL]`, `[TEAM NAMES]`, `[ASK]`: not yet known.
- `[QUOTE 1-3 from research/quotes.md]`: file absent. The three quotes used on slide 3 are sourced from `research/track-01-money.md` (KFF Health News, ObamacareFacts), not Reddit.
- Screenshots in `docs/screenshots/` not present when this deck was written.
- Unsourced (assumptions, labelled on slides): CAC by channel, renewal 55%, 8% paying, 1.7 people per household, Income Guard payers and price, B2B2C seats, 1099-earner pool (needs a BLS/Upwork cite), 2026 thresholds for each Income Guard cliff.
- Ranked competitor funding (Stride $47M, Instead $15M) is in `research/track-01-money.md` but not shown on slides.
- "553 tests": README currently says 537; confirm before export.
- Dani's figures for "$128,599 vs $128,601" repayment ($2,350 vs $9,342) from the handoff are not used; the deck uses $1,697 and $9,342 from the spec.
- Spec s8 still lists LTV ~$134, 3.8x, and ACA wedge 250k payers x $79 = $20M, which exceeds the $12-17M ceiling. The deck uses the handoff's $137, 3.9x and 200k payers.

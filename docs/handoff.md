# Team Handoff: CliffGuard (Business Cup 24h Hackathon)

> **For the Claude reading this:** a teammate shares this file to understand the idea we're proposing. Answer their questions from this document.
> - Keep **verified facts** (with sources, §11) separate from **estimates and assumptions** (marked *est.*).
> - Worked examples use **simplified, illustrative numbers**, not exact tax calculations.
> - This is a product discussion, not personal tax advice.
> - If something isn't covered here, say so and suggest how to verify it. Don't invent figures.
>
> **Status:** CliffGuard is the **proposed pick**, pending team agreement (gate G1). Alternatives are in §9.

---

## 1. The hackathon brief

- **Task:** build a **B2C, web-only** product that solves a fundamental pain for **US adults aged 25–45** (working adults with jobs, families, bills, goals). It must be a pain **they will pay for**.
- **Tracks:** Money, Entertainment, or Skills. Pick one and narrow it to **one user and one pain**.
- **Deadline: 12:00, Nov 15 2026.** Resubmission is allowed; the latest version is judged. Our internal target is to submit by 11:00.
- **Submission** (by the team captain, all three required):
  1. Pitch deck PDF, at most 10 slides.
  2. Production URL that the jury can use end-to-end **with no sign-up or login**.
  3. Public GitHub repo.

**How we're judged:**

| Weight | Criterion | Meaning |
|---|---|---|
| 40% | Does it work? | Live end-to-end; the core value is real, not hardcoded; UX and code quality (the jury reads the repo) |
| 20% | What do we sell? | What the user pays for, and why they come back tomorrow |
| 15% | Who do we sell to? | A sharp problem and a deep understanding of the user |
| 15% | Why does it make money? | Big or growing niche, $100M ARR potential, LTV > CAC |
| 10% | Is it new? | Not a copy of an existing business |

---

## 2. How we chose the idea

We used an **agentic workflow**: Claude Code orchestrating specialised subagents.

1. **Five research agents ran in parallel:**
   - one each for the Money, Entertainment and Skills tracks
   - a "niche hunter" that mined forums for "is there an app that…" posts
   - a "new-rules radar" that scanned US rules that changed in 2025–26
2. **Originality filter.** Every team has the same LLMs, so we **excluded the ideas an LLM suggests by default**: AI budgeting coach, subscription canceller, medical-bill disputer, mock-interview coach, AI tutor, bedtime stories, date-night planner, and so on. A surviving idea had to:
   - serve a specific person at a specific trigger moment
   - work on data the user already has, not be a chat window
   - have evidence that real people ask for it
   - have no funded competitor doing exactly the same thing
3. **A `judge` agent scored the shortlist** like a harsh juror, and fact-checked the legal claims with web search:

| Idea | Judge score /10 | Note |
|---|---|---|
| **CliffGuard** (ACA subsidy cliff) | **7.20** | Found independently by **3 of 5** agents. The law facts are verified |
| Box Score Kids | 7.13 | Easiest build, but a free rival exists and it's a softer pain |
| Mortgage Payment Autopsy | 6.85 | Most original alternative, but people need it about once a year |
| Health-plan simulator | 6.75 | Once a year, and close to an obvious idea |
| Undersold (employer pay data) | 5.80 | Fails originality: Levels.fyi and others already do it |

---

## 3. The idea in one line

**"Take the gig. Keep your health subsidy."** CliffGuard helps freelancers and other variable-income families who buy health insurance on HealthCare.gov earn more **without losing their health subsidy to the 2026 "subsidy cliff"**. It also warns them before an April tax bill they never saw coming.

---

## 4. Background, explained simply

### How the subsidy works
- People without job-based insurance (freelancers, gig workers, small-business owners and staff, early-stage founders) buy health plans on **HealthCare.gov** or a state Marketplace.
- At sign-up they **guess their household income for the coming year**.
- From that guess, the government pays part of the premium **directly to the insurer every month**. This is the "advance premium tax credit" (APTC). The person never sees it as cash; their monthly premium is just lower.
- At tax time, the IRS recalculates with **real income** (Form 8962). Earned more than guessed? They got too much help and **must pay the difference back**. Earned less? They get a refund.

### Income is one number per year
- The subsidy depends on the **calendar-year total** of household income (Jan 1 – Dec 31). Officially this is "MAGI": adjusted gross income plus a few add-backs.
- **A dollar earned in February counts the same as one earned in December.** The monthly payments are only an advance based on the guess.

### The formula, simplified for the income range we care about
**Help deserved = price of the benchmark plan − 9.96% of yearly income**

The benchmark plan is the second-cheapest "silver" plan in the area. The 9.96% applies between 300% and 400% of the federal poverty line.

### What changed in 2026 (verified, see §11)
1. **No repayment cap.** Until 2025, repayment was capped at $375–$3,250 for incomes under 400% of the poverty line. From tax year 2026, **you repay all of it** (IRS, page updated Oct 7, 2026).
2. **The cliff is back.** The extra pandemic-era subsidies expired at the end of 2025. Congress didn't extend them: the Senate rejected an extension in Dec 2025, and a House-passed 3-year extension (Jan 8, 2026) was never enacted. So above 400% of the poverty line you get **zero** help for the whole year.
   - 2026 lines: **$62,600** for a single person, **$106,600** for a family of 3, **$128,600** for a family of 4.
3. **Bronze and catastrophic Marketplace plans now qualify for an HSA** (IRS Notice 2026-5). That opens a new way to lower counted income.

### Worked example (family of 4, benchmark plan $19,800/yr, illustrative)
Dani, 37, is a freelance designer. She **guessed $105,000**, so she got help of $19,800 − $10,458 = **$9,342 a year ($778 a month)**. A big September contract took her **real income to $134,000**.

| Counted 2026 income | Help deserved | Help received | **Pays back in April** |
|---|---|---|---|
| $105,000 (her guess) | $9,342 | $9,342 | $0 |
| $120,000 | $7,848 | $9,342 | $1,494 |
| $128,599 (just under the line) | $6,992 | $9,342 | $2,350 |
| $128,601 (just over the line) | $0 | $9,342 | **$9,342** |
| $134,000 (actual) | $0 | $9,342 | **$9,342** |

**$2 more income makes the bill about $7,000 bigger.** That jump is the cliff.

**Where does the "difference" go?** Nowhere. If her counted income lands under the line, she *deserved* $6,992 of help that has **already paid part of her premiums**, so she simply keeps it and repays only $2,350. The roughly $7,000 isn't moved anywhere. It's money she's **no longer forced to hand back**.

### If income changes mid-year (below the line)
Say the guess was $105k but the year will total $115k. Help deserved falls from $9,342 to $8,346, about $100 less per extra $1,000 earned.
- **Don't report the change:** she keeps getting $778/month and repays **$996** in April.
- **Report it in February:** monthly help drops to about $680, and she repays **about $0** in April.

Below the line, changes are smooth. **Crossing the line is the dramatic case.** If a September contract pushes her over, she deserved $0 for the *whole year*. Reporting it stops future payments, but she still repays the months already received.

### If income is far over the line (e.g. $250k)
**The most anyone ever repays is the help they received** ($9,342 here), however far over they are. Removing $121k of income to save $9,342 makes no sense and is mostly impossible under the account limits. CliffGuard would say: **"Not worth fighting. Set $9,342 aside, update your Marketplace income now, and give an accurate estimate for 2027."**

---

## 5. Who it's for, and who it's not for

**Target:** households **near the line whose income isn't known until December**. That means freelancers, gig workers, commission earners, small-business owners, and couples where one partner is self-employed. Roughly $60k–$160k for a family (*est.*), varying with household size.

**Not for:**
- people with a steady salary well under the line, who know their numbers and can stay under
- people far over the line, for whom only the "set money aside" advice applies

### Why "just remember two numbers" doesn't work for the target
1. **Their counted income is a number they can't see.** It's household-wide: their business *profit* after expenses (not what clients paid), plus a spouse's salary and bonus, plus interest, stock sales, side gigs and any retirement withdrawal, minus deductions.
2. **The line moves with household size:** a baby, a marriage, or a teen who files their own return.
3. **The total is a forecast.** A legal-aid client quoted by KFF: *"I can make anywhere between $20,000 and $45,000 next year. I just don't know."*
4. **"Never cross the line" means turning down work.** That rule is itself the pain. Urban Institute's Jason Levitis, on a possible $10k repayment from one extra shift: *"maybe don't take that shift."* A KFF poll found **43% of enrollees plan to work more hours**.

### The real question CliffGuard answers: "Should I take this extra work?"
Dani is at $122k projected and is offered a **$12,000 December project**, which would take her to $134k. Rough numbers: federal 22% bracket plus self-employment tax, no state tax, illustrative.

| Choice | Outcome |
|---|---|
| **Turn it down** | Keeps ~$7,650 of help; gives up $12,000 of work |
| **Take it, do nothing** | ~$7,850 left after tax, minus ~$7,650 of help lost. **Keeps about $200 for a month of work** |
| **Take it, put ~$5,500 into a SEP-IRA** | Back under the line, keeps ~$7,000 of help. **~$2,900 more cash, plus $5,500 in her own retirement account** |
| **Take it, invoice on January 2** | Keeps all 2026 help; the $12k counts toward 2027 |

---

## 6. Legal ways to lower counted income, and how each shows on the tax return

| Move | Where it shows on the 2026 return | Proof kept | Money stays liquid? | Deadline |
|---|---|---|---|---|
| **Invoice in January instead of December** | The income isn't on the 2026 Schedule C; it moves to the 2027 return | Invoice date, bank deposit, client's 1099 | **Yes**, it arrives a few weeks later | Dec 31 |
| **Buy work items you need before year-end** | Schedule C expense, which lowers profit | Receipts | Spent on things needed anyway | Dec 31 |
| **HSA contribution** (needs an HSA-eligible plan; bronze counts from 2026) | Form 8889 → Schedule 1 deduction | HSA provider statement | **Mostly**: withdraw tax-free anytime for medical bills, including past ones | Apr 15, 2027 |
| **Traditional IRA** | Schedule 1 deduction | Form 5498 | No, locked until retirement | Apr 15, 2027 |
| **SEP-IRA** (self-employed) | Schedule 1 deduction | Form 5498 | No, locked until retirement | Tax filing deadline, including extensions |

**"Keep my cash" mode:** the optimizer tries the liquid moves first (invoice timing, planned purchases, HSA) and uses retirement accounts only if the user opts in.

**Important rule ("constructive receipt"):** income counts once it's **available to you**. A check received in December counts for 2026 even if it's deposited in January. Asking a client to hold a payment you could have had in December doesn't work either. The legal move is to **not bill until January**, or agree on January payment terms.

**Also out of scope for v1:** the self-employed health-insurance deduction lowers income too, but it's circular to compute. Flag it and leave it out.

---

## 7. Rules and timeline (2026 coverage year)

| When | What happens |
|---|---|
| **Nov 1 – Jan 15** (open enrollment) | Estimate next year's income on HealthCare.gov. The Marketplace checks it against IRS, Social Security and wage data. You can take **all, some or none** of the help in advance; taking less is the safe option if income is uncertain |
| **During the year** | Report income changes "as soon as possible" so monthly help is adjusted. (We couldn't confirm a fixed "within 30 days" rule from official sources.) |
| **Dec 31** | Last day for invoice timing and business purchases to count for 2026 |
| **Late January** | Form 1095-A arrives from the Marketplace: monthly premium, benchmark plan price, help paid |
| **By Apr 15** | File the return **with Form 8962** (required if you got advance help). Excess help is added to the tax bill, **uncapped from 2026**. HSA and IRA contributions for 2026 are allowed until this date. Skipping Form 8962 can cost you future advance help |
| **After Apr 15** | Unpaid repayment is ordinary tax owed. IRS payment plans exist, but interest and late penalties run |

**The honesty rule (45 CFR 155.285):** income estimates must be in good faith.
- Negligently wrong information: a civil penalty of up to **$25,000** per application.
- Knowingly false information: up to **$250,000**.
- Both are adjusted for inflation each year, and there's **no penalty with reasonable cause and good faith**.
- An honest wrong guess just means repaying.
- **Product rule: CliffGuard never helps anyone understate their Marketplace estimate.** It only changes actual income in legal ways and helps produce accurate estimates. If income moves into January, it must be included in the 2027 estimate.

---

## 8. The product

### The magic moment (under 60 seconds, no login)
1. The landing page says: **"Take the gig. Keep your health subsidy."** The user clicks "Try as Dani's family", or enters 5 numbers: ZIP, household size and ages, the income given to the Marketplace, monthly help received, and income so far plus expected.
2. Within seconds: *"You're at $122k. Someone offers you $12k? Doing nothing, you'd keep ~$200. Here's how to keep ~$8,400 instead."* A **slider** shows income approaching the visible "cliff wall".
3. A ranked rescue plan follows: exact amounts per move, the deadline for each, and a "Keep my cash" toggle.
4. Optional: upload the Marketplace eligibility notice, invoices or a bank export, and **Claude extracts the numbers**.

### Architecture: the money math is never done by the LLM
```
Documents / inputs ──► Claude extracts ──► validated numbers (Zod)
                                                 │
                     RULES ENGINE (TypeScript, unit-tested)
                     • poverty-line table, applicable-% table, account limits
                     • Form 8962 logic: help deserved vs. received (uncapped)
                     • optimizer: cheapest legal mix to get under the line
                                                 │ exact numbers
                                                 ▼
                     Claude explains in plain English; "what if" questions are answered
                     by calling the engine as a tool; it drafts the checklist and
                     tax-preparer summary
```
- **Rules engine (deterministic):** produces every number shown. Same input, same output. Tested against published worked examples (KFF, Instead).
- **Claude:** reads documents, explains results, and answers follow-ups by running the engine. It never invents a figure.
- **No outside API needed for v1.** The benchmark plan price is worked out from the user's own monthly help and income estimate. CMS public plan files are a fallback.

### Why not just ask ChatGPT or Claude?
| | General chatbot | CliffGuard |
|---|---|---|
| 2026 rules | Can apply outdated rules (e.g. the old repayment cap) | Current rules coded and tested |
| Math | Mental math; can be wrong; varies between attempts | Exact and repeatable |
| Advice | "Consider an IRA" | "$5,401 into a SEP-IRA by Apr 15, *or* move this invoice to January" |
| Timing | Only answers when asked, and **people don't know to ask** | **Speaks first:** monthly check-ins, "you'll cross the line in October", deadline reminders |
| Memory | Forgets between chats | Tracks the household all year |

**Pitch idea:** show a live side-by-side of a general chatbot (no web search) vs. CliffGuard on Dani's question.

### What we sell (*est.*, from research)
- **Free:** where you stand, plus the "should I take this gig?" check.
- **$39–49 one-time "Rescue Plan":** exact moves and deadlines, plus a summary for a tax preparer.
- **$79/yr "Income Guard":** monthly income check-in, cliff alerts, "report a change now" prompts, deadline calendar, 2027 estimate guidance.
- **Why they come back:** variable income changes monthly, and every year brings open enrollment (Nov–Jan), the 1095-A (Jan) and tax filing (Apr).

### Business model (*est.*, to be refined by the strategist)
- **LTV** ~ $175 ($79/yr × ~2.2 years).
- **CAC** ~ $25–40 through seasonal search ("ACA repay 2026", "1095-A owe"), tax-season creators, and partnerships with brokers, freelance platforms and gig communities.
- **Core market** (research estimate): ~$55M ARR.
- **Path to $100M (hypothesis):** extend the same engine to other "income cliffs" variable earners face, such as student-loan payments tied to income, childcare-credit phase-downs and state programs. Also sell through accountants and freelance platforms.

### Competitors (searched)
- **Free repayment calculators:** StateCalc, healthinsurance.org, NerdWallet, KFF (forward-looking only).
  - **Our difference:** they give the bill; we give the rescue plan, the "should I take the gig" answer, and monitoring.
- **TurboTax / H&R Block:** compute Form 8962 *at filing*, when it's too late.
- **Instead.com:** AI tax planning for professionals, from $16/mo, not focused on this.
- **Stride Health:** helps with enrollment, not reconciliation.

### Risks and the judge's objections
1. **"The headline number is free elsewhere."** We lead with the rescue and the gig decision, not the bill.
2. **The market is shrinking:** CBO projects Marketplace enrollment falling from 22.4M to 13.1M in 2027. Size the market as variable earners, and show the multi-cliff expansion.
3. **Tax-rule accuracy:** unit tests against published examples, conservative scope, an "educational, review with your tax preparer" label.
4. **Judges probably have employer insurance**, so the pitch must make the pain hit home. Freelancers and founders, many of whom buy Marketplace plans, are the persona to use.
5. **Other teams may find it too:** 3 of our agents did. Execution and the "take the gig" framing are our edge.
6. **Policy risk:** a post-election deal in Congress could restore the subsidies. We found nothing after Oct 2026 suggesting it.

---

## 9. Alternatives, if the team prefers

- **Box Score Kids** (Entertainment, 7.13): a daily printable sports paper about the kid's team, written at the kid's reading level from real box scores, with reading and math questions.
  - **Best demo:** a grade slider rewrites the same game.
  - **Downsides:** not every family has a printer; a web version competes with YouTube on the same device; a free rival exists (My Sports Report); the $100M case is weak.
- **Mortgage Payment Autopsy** (Money, 6.85): checks the escrow letter that raised your mortgage payment against federal rules (lenders often over-collect), and finds mortgage insurance (PMI) you can drop using public home-price data.
  - **Downside:** people need it about once a year.

---

## 10. Plan and how we'll build it

- **Agent team** (defined in `.claude/agents/`, rules in `CLAUDE.md`):
  - `researcher`, `strategist` (spec), `judge` (scores at every gate)
  - `builder` (the only agent that edits code)
  - `code-reviewer` (read-only, after every task), `qa-tester` (tests the live site in a browser), `pitch-writer`
- **Next steps once locked:**
  1. The strategist writes `docs/spec.md`, then the judge reviews it (gate G2).
  2. In parallel: scaffold the project and deploy an empty app to Vercel.
  3. Build v1: rules engine with tests → magic moment → Stripe test-mode paywall → monitor/check-in. Deploy, run QA and **submit v1 as insurance** (gate G3).
  4. Iterate on the judge's and QA's top fixes. Draft the deck in parallel.
  5. Final QA, README, deck PDF; submit by 11:00 (gate G4).
- **Stack:** Next.js + TypeScript + Tailwind on Vercel; Claude API server-side; Zod validation; anonymous session cookie (no login); Stripe test mode.

### Decisions the team needs to make
1. Lock CliffGuard, or switch to an alternative?
2. Roles: who codes, who designs, who owns the pitch, and the overnight shifts.
3. Keep the "Take the gig. Keep your health subsidy." positioning, and the name (CliffGuard is a working title)?
4. Which moves go in v1: proposed are invoice timing, HSA, IRA and SEP-IRA, plus the "Keep my cash" toggle.

---

## 11. Key numbers and sources

**Verified 2026 figures:**
- **Cliff (400% of the poverty line, 2026 coverage):** $62,600 single, $106,600 family of 3, $128,600 family of 4.
- **Expected contribution:** up to **9.96%** of income (Rev. Proc. 2025-25; the exact table is to be confirmed in the spec).
- **HSA:** $4,400 self / $8,750 family. **IRA:** $7,500. **SEP-IRA:** lesser of ~20% of net self-employment profit or $72,000.
- **Marketplace enrollment:** 19.2M effectuated (Feb 2026); CBO projects 13.1M in 2027.

**Sources:**
- [IRS: Premium tax credit](https://www.irs.gov/credits-deductions/premium-tax-credit)
- [IRS: Report changes in circumstances](https://irs.gov/affordable-care-act/individuals-and-families/getting-advance-payments-of-the-premium-tax-credit-remember-to-report-changes-in-circumstances)
- [HealthCare.gov: Reconciling your premium tax credit](https://www.healthcare.gov/taxes-reconciling)
- [HealthCare.gov: Form 1095-A](https://www.healthcare.gov/tax-form-1095/)
- [CMS: Reporting income changes](https://cms.gov/files/document/reporting-change-income-pdf.pdf)
- [45 CFR 155.285 (penalties), Cornell LII](https://www.law.cornell.edu/cfr/text/45/155.285)
- [KFF: Fraud in Marketplace enrollment](https://www.kff.org/patient-consumer-protections/issue-brief/fraud-in-marketplace-enrollment-and-eligibility-five-things-to-know/)
- [Kiplinger: 2026 IRA/401(k)/HSA changes](https://www.kiplinger.com/retirement/retirement-planning/changes-to-iras-401ks-hsas-in-2026)
- [ThinkAdvisor: Constructive receipt](https://www.thinkadvisor.com/tax-facts/2024/03/13/662-when-is-a-cash-basis-taxpayer-deemed-to-receive-income-how-is-the-doctrine-of-constructive-receipt-applicable)
- [KFF subsidy calculator](https://www.kff.org/interactive/subsidy-calculator/)

**Full research in the repo:**
- `research/track-01-money.md`, `research/new-rules-radar.md`, `research/niche-hunt.md`
- `research/track-02-entertainment.md`, `research/track-03-skills.md`
- `docs/scores.md` (judge scores and fact-check)

---

## 12. FAQ (questions the team has already asked)

- **"Where does the $7,000 difference go?"** Nowhere. It's subsidy already received that she's allowed to keep once counted income lands under the line (§4).
- **"I want the money back in my account, not in retirement."** Use "Keep my cash": invoice timing, planned purchases and HSA first (§6). Without action, the money goes to the IRS for good.
- **"What if I earn $250k?"** The most you can owe is the help received. CliffGuard says don't fight it, budget for it (§4).
- **"Is income monthly?"** No, it's the yearly total. Monthly help is an advance on the guess (§4).
- **"Why not just stay under the line?"** For variable earners the number is a forecast, and "never cross" means turning down work. CliffGuard shows how to take the work *and* keep the help (§5).
- **"Does it rely on an LLM?"** The math is a tested rules engine. Claude reads documents, explains, and answers by calling the engine (§8).
- **"Why not ChatGPT?"** Current rules, exact math, specific moves, memory, and it **warns you before you know to ask** (§8).

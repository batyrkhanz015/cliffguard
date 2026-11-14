# Niche Hunt: Evidence-Backed Pains for US Adults 25–45

Research date: 2026-11-14. Scope: B2C, web-only, Next.js + Vercel, Claude at the core, ~12 h build, no login, value in under 60 s.

Scoring formula used everywhere:
**Weighted = 0.40 × E2E/real core + 0.20 × What we sell & retention + 0.15 × Clear user/problem + 0.15 × $100M ARR / LTV>CAC + 0.10 × Originality**

---

## 0. Method and limitations (read first)

- **We couldn't read Reddit directly.** reddit.com blocks our fetcher and the search API. The Reddit quotes below come from search-engine snippets of Reddit mirror pages. Each link has been rewritten to its canonical `reddit.com/r/...` path. Every quote was seen in a snippet, but some threads may since have been deleted or edited.
- **The web-search budget ran out partway through.** The session-wide cap of 200 searches is shared across agents. Seeds a–h and own candidates A, B, F, G, H and I each got at least one dedicated competitor search. Candidates C (severance) and D (parental leave) have thinner evidence. A was checked for escrow-audit tools but **not** for PMI-removal tools. Each gap is flagged where it applies.
- **Market sizes come from different places.** Some figures were verified on primary pages: NCES, IRS, healthinsurance.org, KFF as quoted by press, Insurify as quoted by MoneyLion. Figures marked "(from memory)" or "est." should be re-checked before the pitch deck.
- **Every niche checked has at least one competitor.** That's expected in 2026. The real questions are (1) whether another *hackathon team* would build it and (2) whether we can show a real, non-hardcoded core in 60 seconds.

---

## 1. Ranked scoreboard (all 17 candidates)

| Rank | Candidate | Track | E2E (40%) | Sell/Retention (20%) | Clear (15%) | ARR (15%) | Orig (10%) | **Weighted** |
|---|---|---|---|---|---|---|---|---|
| 1 | **A. Mortgage Payment Autopsy** (escrow-shortage audit + PMI-removal finder) — own | Money | 8.5 | 6 | 8.5 | 7 | 8 | **7.7** |
| 2 | **c. Open-Enrollment SBC Simulator** — seed | Money | 9 | 5 | 9 | 6 | 6 | **7.45** |
| 3 | **a. IEP/504 Decoder & Meeting Prep** — seed | Skills/Money | 8 | 7 | 9 | 5.5 | 6 | **7.4** |
| 4 | **B. ACA "Clawback Guard"** (APTC repayment tracker for variable-income people) — own | Money | 7.5 | 7 | 8 | 6 | 7 | **7.2** |
| 5 | **b. Vet-Estimate Decoder** — seed | Money | 7 | 6 | 9 | 7 | 7 | **7.1** |
| 6 | f. Hourly paycheck checker — seed | Money | 7 | 5 | 7 | 5 | 7 | 6.3 |
| 6 | h. Fantasy commissioner recaps (Sleeper) — seed | Entertainment | 9 | 6 | 5 | 3 | 3 | 6.3 |
| 8 | g. Nanny-share household employer — seed | Money | 7 | 6 | 7 | 3 | 7 | 6.2 |
| 8 | I. Volunteer youth-coach practice planner — own (rejected: crowded) | Skills | 8 | 6 | 7 | 3 | 3 | 6.2 |
| 10 | C. Severance / layoff command center — own | Money | 7 | 4 | 8 | 5 | 6 | 6.15 |
| 11 | e. Security-deposit recovery — seed | Money | 8 | 3 | 8 | 4 | 4 | 6.0 |
| 11 | D. Parental-leave stacker (state PFML + FMLA + STD) — own | Money | 7 | 4 | 8 | 4 | 6 | 6.0 |
| 13 | d. Total-loss valuation dispute — seed | Money | 6.5 | 3 | 8 | 5 | 7 | 5.85 |
| 13 | F. Dealer buyer's-order decoder — own | Money | 7 | 3 | 8 | 5 | 5 | 5.85 |
| 15 | E. IUL / whole-life illustration decoder — own | Money | 7.5 | 2 | 7 | 3 | 9 | 5.8 |
| 16 | G. Home-inspection → repair-credit request — own (rejected: crowded) | Money | 7 | 2 | 8 | 4 | 3 | 5.3 |
| 17 | H. HVAC/contractor quote checker — own (rejected: crowded) | Money | 6 | 3 | 8 | 5 | 3 | 5.25 |

**Combo option worth considering:** c + B as one product, an **"Open Enrollment Copilot: employer or Marketplace"**. Both enrollment windows are open right now: employer OE runs Oct–Nov, and the ACA window runs 2026-11-01 to 2027-01-15. One cost engine covers both, because Marketplace plans publish SBCs too. B also adds the monthly retention loop that c lacks. The risk is scope creep within 12 hours. Build c first and add B's tracker only if time is left.

---

## 2. Seed ideas from the team lead (verification)

### a. IEP / 504 decoder, goal-measurability audit, meeting prep and IDEA letters

**Persona & trigger.** A parent aged 30–45 of a K-8 child with an IEP or 504 plan. The trigger is the school emailing an evaluation report or a draft IEP 3–10 days before the annual IEP meeting. Triennial reevaluations and quarterly progress reports trigger it again.

**Evidence.**
- A parent writing to University of Michigan Dyslexia Help: *"Why are they putting goals and objectives that they aren't introducing? … Are they breaking the law?"* ([dyslexiahelp.umich.edu](https://dyslexiahelp.umich.edu/ask-dr-pierson/mom-frustrated-her-6th-grade-daughters-school-not-respecting-iep/)). In its answer, the advocate cites the "stranger test" and a case titled "Repeating IEP goals from year to year denies FAPE".
- Reading Rockets: IEPs "often include attitude statements, i.e., 'have a good attitude,' 'display a cooperative spirit'". These are classic unmeasurable goals ([readingrockets.org](https://www.readingrockets.org/topics/special-education/articles/smart-ieps-step-4-write-measurable-not-abstract-goals)).
- Federal law requires measurable annual goals plus a description of how progress is measured (34 CFR 300.320(a)(2)–(3)). Hearing officers often find vague goals deficient ([Wrightslaw](https://www.wrightslaw.com/info/iep.goals.plan.htm)).
- A competitor's marketing claims that Reddit threads about evaluation scores give "well-intentioned but dangerously incomplete advice from strangers who can't see the full report" ([special-ed-ega.pages.dev](https://special-ed-ega.pages.dev/blog/best-resource-understand-evaluation-report-before-iep-meeting)). This is self-serving, but it shows the demand.
- **Scale:** "7.5 million, or the equivalent of 15 percent of all public school students" received IDEA services in 2022–23 ([NCES](https://nces.ed.gov/programs/coe/indicator/cgg)).

**Competitors found (more than expected; the space is warming up).**
- **Undivided**: an AI IEP & 504 Assistant bundled with a navigator membership, "Starting at $19/month". It has a heavy California focus ([undivided.io/membership](https://www.undivided.io/membership/)).
- **AdvocateIQ** (Texas, launched March 2026): "as low as $49 per review", with $29/month unlimited per press coverage. It has Texas ARD rules built in ([ai-market-watch](https://www.ai-market-watch.com/news/advocateiq-launches-ai-powered-platform-to-help-te)).
- **AIEP** (Innovate Public Schools with Northeastern's Burnes Center): "Always. AIEP is free for everyone." It summarizes and translates IEPs. It piloted with 200+ SFUSD families in 2025 and launched publicly in 2026 ([innovateforaction.com/aiep](https://innovateforaction.com/aiep/)).
- **Understood.org Parent Coach**: a free AI-enhanced tool.
- **Arloa**: a free "IEP Report Card", seen only on a Reddit mirror and unverified.
- Indie vibe-coded tools, including [iep-advocate-buddy.lovable.app](https://iep-advocate-buddy.lovable.app/) and the "$0 Assessment Decoder" page. This means at least some hackathon-style builders have found this niche.
- Human advocates charge roughly $75–200/h (from memory).

**Willingness to pay.** High and emotional. Parents already pay advocates and attorneys. Competitors anchor at $19/month and $49/review. Suggested pricing: **$39 per document review or $99/year** for unlimited reviews, letters and meeting prep.

**Retention loop.** This is a natural school-year cadence. There is an annual IEP review (34 CFR 300.324(b)), progress reports at least as often as report cards (300.320(a)(3)), triennial reevaluation (300.303), and ad-hoc letters for records requests (45-day rule, 300.613), Independent Educational Evaluations (300.502) and prior written notice disputes (300.503). Add a "service-minutes log" so parents can track delivered vs promised minutes every week.

**US market math.** About 7.5M IDEA students plus roughly 1.5–2M 504-only students (CRDC figure, from memory) gives about 8–9M families. Paying 5% at $99 = ~$45M ARR, and paying 10% = ~$90M. Reaching $100M needs B2B2C: advocates' seats and parent-training centers. CAC is low because the communities are dense (Facebook groups, parent-training-and-information centers, r/specialed).

**60-second magic moment (no login).** The juror clicks "Try sample IEP". It's a synthetic 3rd-grader with dyslexia, 9 goals, 18 pages. Within about 30 seconds, results stream in:
- a goal-by-goal scorecard (red/yellow/green with reasons: "no baseline", "no criterion", "no measurement method")
- a SMART rewrite for each goal
- 5 questions to ask at the meeting
- a one-click letter requesting an IEE at public expense, citing 34 CFR 300.502

**Real core.** Claude reads the PDF and extracts present levels, goals, services and accommodations into a JSON schema. A deterministic rubric engine then scores each goal: does it have a baseline, a target, a criterion, a measurement method and a timeline? Does every area of need in the present levels have a matching goal? Do service minutes match the goals? A curated library of IDEA regulation citations and federal timelines fills the letter templates. The value comes from the rubric and the citation library; Claude does extraction and rewriting.

**Build risk.** Medium-low. Long PDFs mean 30–60 s of latency, so stream the results. IEP formats vary by state, but the extraction schema is generic. Liability: frame it as "education, not legal advice". Privacy: process in memory and don't store anything.

**Scores:** E2E 8 | Sell 7 | Clear 9 | ARR 5.5 | Orig 6 → **7.4**

---

### b. Vet-estimate decoder

**Persona & trigger.** A pet owner aged 28–42, usually a millennial with no kids or young kids. The trigger is being handed a $1,500–$6,000 estimate (dental with extractions, cruciate surgery, ER admission) and having to decide "approve or not" within hours.

**Evidence.**
- A consumer TV story about a NJ dog owner: the signed estimate became a bill of "$4,298.64". The suggested questions were *"Does the surgery have to be done right away? Can I get this done elsewhere for less? Is there a way to lower the bill?"* ([6abc](https://6abc.com/amp/post/vet-bill-help-dog-eye-surgery-cherry-hill-pet-owner-emergency-veterinary-hospital/12291695/)).
- A forum owner on a mid-procedure estimate change: *"telling someone in the middle of a procedure that the amount will be twice as much as the high end of the estimate is extraordinarily upsetting and confusing"* (YorkieTalk thread, search-indexed: [yorkietalk.com](https://www.yorkietalk.com/forums/sick-injured-emergencies-talk/262779-changing-estimates-mid-procedure-print.html)).
- r/rva, "Dog owners of Richmond Reddit, does this dental [estimate look normal]". One reply advised *"decline bloodwork if you can if he has no preexisting condition"* ([reddit.com/r/rva/comments/1cmjtof](https://www.reddit.com/r/rva/comments/1cmjtof/)). That is exactly the "what can I safely decline" question, and the answer is risky without context.
- Berkeley Parents Network: about $2,300 for a cleaning with multiple extractions ([berkeleyparentsnetwork.org](https://berkeleyparentsnetwork.org/node/437866)).
- UK data shows the same trend: vet prices rose 6.1% vs 3.3% CPI ([Vet Times](https://www.vettimes.com/news/business/digital/we-want-to-build-trust-new-vet-bill-check-platform-claims)).

**Competitors found.**
- **PetClaim**: a pre-launch waitlist promising "Recover $1,247 in vet over-charges & insurance denials per year". It's priced at $79/year founding and $168/year regular, with "358 of 500 founding spots" claimed. This is a direct concept competitor but not live ([idea-007-petclaim.pages.dev](https://idea-007-petclaim.pages.dev/)).
- **VetsCompared** (UK, launched May 2026): upload a bill and get a "low/fair/high" rating. It doesn't serve the US.
- **PetCare AI** (iOS) and **Furbo AI Vet Report Translator** explain lab results and reports, not estimates.
- **Pumpkin Pet Health Predictor** forecasts future costs.
- Vet-side estimate tools are B2B.
- **No live US consumer estimate decoder was found.**

**Willingness to pay.** Strong at the moment of the decision. Price **$9 per estimate**, or **$5/month "Pet Money"** (estimates, Rx price checks, insurance-claim letters). Affiliate revenue is the bigger lever: pet-insurance CPA (est. $50–100) and pharmacy referrals.

**Retention loop.** About 2 vet visits per pet per year, plus Rx refills. Add a "price my refill" check monthly, an annual cost forecast, and help with insurance-claim denials.

**US market math.** About 94M pet-owning households and roughly $40B/year US vet spend (APPA, from memory). 2M users × $9 × 2 estimates = $36M, plus 500K insurance referrals × $60 = $30M, plus pharmacy referrals. **$100M is plausible with affiliates.**

**60-second magic moment.** The juror clicks "Try sample estimate" (a canine dental with 3 possible extractions, 22 lines). The output marks each line:
- "Explained", plus "Needed today / Safe to discuss / Optional"
- A typical regional range
- The Rx lines flagged as human generics (gabapentin, carprofen alternative, amoxicillin) with real cheaper prices from a human pharmacy, plus a script: "Can I have a written prescription?"
- 5 questions to ask the vet

**Real core.** Claude vision extracts line items and maps them to a normalized procedure taxonomy. A curated benchmark table (about 150 common line items, built from published vet price lists and surveys) provides ranges. An Rx price lookup uses a pre-scraped table of human-generic prices (Cost Plus Drugs or Costco public prices) for the roughly 30 drugs commonly prescribed to pets.

**Build risk.** Medium. There's no open US vet price dataset, so ranges must be curated and labeled as estimates. If the team over-claims, judges may see it as "LLM-hallucinated prices". Avoid medical-advice framing: say "questions to ask", not "decline this".

**Scores:** E2E 7 | Sell 6 | Clear 9 | ARR 7 | Orig 7 → **7.1**

---

### c. Open-enrollment plan simulator (SBC upload)

**Persona & trigger.** A dual-income parent aged 28–45 choosing between 2–4 employer plans (PPO vs HDHP+HSA) in the 2–3-week OE window, which is happening **now**. The trigger gets sharper with a baby on the way, a chronic Rx, or a choice between two spouses' employers' plans.

**Evidence.**
- r/personalfinance: *"Really angry about HDHP, not sure if I should…"* (Jan 30 '25) ([reddit.com/r/personalfinance/comments/1idqbwz](https://www.reddit.com/r/personalfinance/comments/1idqbwz/))
- r/HealthInsurance: *"Choosing HDHP vs PPO"* ([reddit.com/r/HealthInsurance/comments/1fkqanj](https://www.reddit.com/r/HealthInsurance/comments/1fkqanj/))
- Grassroots Motorsports forum: *"HDHP/HSA: in what situations do you lose money?"* ([grassrootsmotorsports.com](https://grassrootsmotorsports.com/forum/off-topic-discussion/hdhphsa-in-what-situations-do-you-lose-money/106634/page1/))
- TexAgs: *"HSA and their attachment to high deductible plans"* ([texags.com](https://texags.com/forums/57/topics/3447303))
- ValuePenguin reports that **LendingTree built a custom AI tool internally to help its own employees pick a 2026 plan** ([valuepenguin.com](https://www.valuepenguin.com/health-insurance-ai)). Even a fintech couldn't find a consumer tool.
- Many blog "how to" guides tell people to paste the SBC into ChatGPT ([thesolocreators](https://thesolocreators.com/prompts/pick-a-health-plan-at-open-enrollment/), [exploreaitogether](https://exploreaitogether.com/how-to-use-ai-for-health-insurance-analysis/)). That's a DIY workaround that signals unmet demand.
- 2027 numbers: HSA limits are $4,500 self / $9,000 family. Marketplace OOP max is $12,000 ([healthinsurance.org](https://www.healthinsurance.org/blog/2027-aca-open-enrollment-whats-changing/)).

**Competitors found.**
- **B2B decision-support tools sold to employers.** Jellyvision ALEX, Nayya and Picwell are listed from memory. **Flimp Decisions** added spouse-SBC upload comparison ([flimp.net](https://flimp.net/flimp-adds-spouse-plan-comparison-to-its-industry-leading-benefits-decision-support-tool/)). Simplify Healthcare and CassidyAI agents serve brokers. Employees only get these if their employer buys them, and most SMB employees don't.
- **Consumer calculators**, such as [PennyCalc](https://pennycalc.com/health-insurance-comparison/) (manual entry, "does not parse SBC PDFs", affiliate-funded), plus HSA-custodian calculators and health-plans.pages.dev.
- **No B2C tool was found that parses SBC PDFs and runs a usage simulation including HSA tax effects.**

**Willingness to pay.** Moderate. It's a once-a-year decision, but the stakes are $1–5K. Price **$15 per household per OE**, or free with an affiliate model (HSA custodians pay for account openings). Spouse-plan comparison and "baby year" mode can be upsells.

**Retention loop.** This is the weak spot. Ways to extend it:
- year-round "Which plan pays for this?" (upload an estimate or EOB, see what you'll owe)
- an HSA receipt vault
- life-event reruns (marriage, baby, job change, each with a 30-day special enrollment window)
- automatic comparison at next OE

**US market math.** About 155M people are covered by employer plans, which means roughly 65M+ plan-choosing employees (KFF, from memory). 3M paying × $15 = $45M B2C, plus HSA/affiliate revenue. A B2B2C channel through SMB brokers (which lack ALEX) is the path to $100M.

**60-second magic moment.** "Acme Corp" comes preloaded with 3 real-format SBCs. The juror picks "Family of 4, baby due in May, 1 monthly Rx". Output: expected annual cost per plan (premium + out-of-pocket − employer HSA seed − tax savings), shown as low / likely / bad-year bars, plus the break-even point and a plain-English verdict. **A juror can upload their own SBC from their HR portal and get a real answer.** This is the strongest "real, not hardcoded" demo of any candidate.

**Real core.** The SBC is a **federally standardized template** (PHSA §2715). It includes 3 standardized coverage examples: "Peg is Having a Baby", "Managing Joe's Type 2 Diabetes" and "Mia's Simple Fracture". That makes Claude's extraction highly reliable. A deterministic cost engine applies deductible, coinsurance, copays and the OOP max per family member, and runs a Monte Carlo over usage profiles. Inputs also include IRS HSA limits for 2026 and 2027 and federal/state marginal tax rates. Premium contributions come from the enrollment sheet: the user types them in or uploads a screenshot, which Claude reads.

**Build risk.** Low-medium. Family vs individual embedded deductibles add complexity, and accuracy must be visibly correct. Another hackathon team might build a "health plan picker", so the duplicate risk is moderate.

**Scores:** E2E 9 | Sell 5 | Clear 9 | ARR 6 | Orig 6 → **7.45**

---

### d. Total-loss car valuation dispute

**Persona & trigger.** A car owner aged 25–45 whose car was totaled. The insurer's CCC One or Mitchell valuation arrives, it feels $2–5K low, and the owner needs a replacement car this week.

**Evidence.**
- r/InsuranceDisputes: *"Appraisal Clause Success Story - AAA offered $29K for a car that was worth $62K."* ([reddit.com/r/InsuranceDisputes](https://www.reddit.com/r/InsuranceDisputes/))
- r/Insurance, "Total loss comps question": *"They might be undervaluing by as much as 3k."* ([reddit.com/r/Insurance/comments/1jr08m5](https://www.reddit.com/r/Insurance/comments/1jr08m5/))
- Repairer Driven News (advocate data): across 700+ appraisal-clause actions, vehicles were worth about $3,500 more than the insurer's first estimate ([repairerdrivennews.com](https://www.repairerdrivennews.com/2021/07/05/negotiator-initial-total-loss-acvs-coming-in-low-might-cost-consumers-shops-chance-to-repair/))
- Class actions against insurers that relied on CCC One ([insurify.com](https://insurify.com/car-insurance/news/ccc-lawsuits/))
- A NAIC 12-state pilot on AI-driven total-loss determinations is reported (unverified; source is Appraisal Engine).

**Competitors found.**
- Human appraisal services ($300–700): **Appraisal Engine**, **Diminished Value of Georgia**, mypdpros
- **Mighty** (AI-assisted claim guidance), **ClaimGap** and **terms.law** (demand-letter guides and services)
- **MarketCheck**, which publishes a "Total Loss Valuation Worksheet" ([ai.marketcheck.com](https://ai.marketcheck.com/reports/total-loss-valuation-worksheet.md)). It's a data vendor that could become a competitor.
- **No self-serve AI rebuttal tool was confirmed.**

**Willingness to pay.** High per incident ($49–99) or a success fee (10–15% of the uplift). There's **no repeat use**.

**Retention loop.** Essentially none. You could add diminished-value claims or rental and loss-of-use claims, but each is still one-off.

**US market math.** Roughly 3–4M total losses per year (est., using CCC's ~1-in-5 total-loss share of collision claims). 10% × $79 = ~$30M. A success-fee model (15% × $3.5K × 200K) is about $100M, but **public-adjuster licensing rules may apply in some states**.

**60-second magic moment.** The juror loads a sample CCC report. The output flags: state requires sales tax plus title fees to be paid and they're missing (+$1,640); comp #3 is 210 miles away; the condition adjustment of −$1,100 is unsupported. It then drafts a counter letter and an appraisal-clause invocation letter.

**Real core.** Claude parses the report. A deterministic checker recomputes the math and applies a 50-state tax/title/fees table. **Real comparables need listing data** (MarketCheck API is paid), and without it the core is mostly the LLM.

**Build risk.** Medium-high. The data gap on comps is the problem, and sample CCC reports must be synthesized.

**Scores:** E2E 6.5 | Sell 3 | Clear 8 | ARR 5 | Orig 7 → **5.85**

---

### e. Security-deposit recovery

**Persona & trigger.** A renter aged 25–35 who moved out. At day 21–45 they get no deposit back, or an itemized list of bogus deductions.

**Evidence.**
- A property manager's blog: *"Your renters are using AI to fight deposit deductions — here's what I learned from a manager with 1,250 doors"* ([getaptly.com](https://www.getaptly.com/blog/your-renters-are-using-ai-to-fight-deposit-deductions-heres-what-i-learned-from-a-manager-with-1-250-doors)). The pain is real, and **tenants already do this with ChatGPT**.
- Statutory multipliers exist: CA up to 2× for bad faith (Civ. Code 1950.5), NJ 2× (N.J.S.A. 46:8-21.1), RI 2×, and others ([terms.law](https://terms.law/2025/02/07/security-deposit-and-short-term-rental-demand-letters-how-to-get-your-money-back-from-landlords-and-hosts/), [ezel.ai](https://ezel.ai/templates/security-deposit-demand/nj)).

**Competitors found (crowded).**
- **Deposit Defender**: rules-based, 9 states, free analysis, "Letter price: $29 one time" ([moneyyoureowed.com](https://moneyyoureowed.com/deposit-defender/))
- **Depositron** (featured by City Limits, NYC)
- terms.law's AI security-deposit widget, 19pine.ai, ezel.ai, vaquill.ai, and DoNotPay historically
- JustFix (NYC tenant tools)

**Willingness to pay.** $19–29 one-time. The anchor is already set.

**Retention.** None. A renter moves about once every 2–3 years.

**US market math.** About 44M renter households, ~14M moves per year, ~25% disputes = ~3.5M. 10% × $29 = ~$10M. **Not a $100M business.**

**60-second magic moment.** Pick a state, enter the move-out date and deductions, and add a photo pair. The output says "Deadline missed by 9 days → up to 2× deposit". Claude vision compares move-in and move-out photos and marks "normal wear vs damage". Then it generates a letter.

**Real core.** A 50-state statute table (deadlines, itemization rules, multipliers), a deterministic deadline engine, Claude vision and letter drafting.

**Build risk.** Low technically. **Originality risk is high**: tenant-rights letters are an obvious LLM idea.

**Scores:** E2E 8 | Sell 3 | Clear 8 | ARR 4 | Orig 4 → **6.0**

---

### f. Hourly-worker paycheck checker

**Persona & trigger.** An hourly worker aged 25–45 in retail, warehouse, healthcare support or restaurants who suspects the check is short, especially overtime, split shifts or tips.

**Evidence.**
- The DOL built its own timesheet app to track hours and wages due ([dol.gov](https://www.dol.gov/newsroom/releases/whd/whd20220630)).
- EPI estimated about $15B/year in minimum-wage theft alone (2017, from memory).
- A new angle: the **OBBBA "no tax on overtime" deduction** (TY2025–2028) depends on correctly reported *qualified* overtime. Workers who file in Jan–Apr 2027 for TY2026 need their premium-portion OT calculated correctly. This is timely but unverified detail.

**Competitors found.**
- **WageWatch** (iOS, "built by labor lawyers and union advocates")
- The DOL Timesheet app
- Plantilla (on-device stub scanner, promotional)
- Free calculators: pay-stub error, back-pay with FLSA liquidated damages, CA unpaid wages
- **No AI pay-stub auditor was confirmed.**

**Willingness to pay.** Low from workers. The real monetization is lead-gen to wage-and-hour plaintiff firms, but lawyer-advertising rules and ethics make it messy. A tax-season OT-deduction calculator could add $10–20 revenue.

**Retention.** There's a natural biweekly loop (every paycheck), which is good engagement but low revenue.

**US market math.** About 80M hourly workers (BLS, from memory). B2C revenue is small, and lead-gen could reach tens of millions of dollars. $100M is unclear.

**60-second magic moment.** Upload a sample stub and enter the hours worked. The output: "6.5 OT hours paid at straight time; CA daily OT missed on Tuesday → $186.40 owed", plus a demand letter.

**Real core.** Claude extracts stub fields. A deterministic engine applies the FLSA weekly OT rule, state daily OT (CA, AK, NV, CO), a state/city minimum-wage table, and CA meal/rest premiums.

**Build risk.** Medium. City minimum wages and edge cases (regular rate of pay with bonuses) are tricky. Jurors are unlikely to be hourly workers, so they won't relate as easily.

**Scores:** E2E 7 | Sell 5 | Clear 7 | ARR 5 | Orig 7 → **6.3**

---

### g. Nanny-share household employer

**Persona & trigger.** Two dual-income urban families aged 32–42 sharing a nanny. The triggers are signing on, the first payroll, year-end W-2/Schedule H, and DCFSA elections at OE.

**Evidence.**
- Care.com HomePay explains that families "split the wages and the payroll tax, but they don't have to split the tax breaks, because each family is a separate employer" ([care.com](https://www.care.com/hp/nanny-share-payroll-taxes/)). The complexity is real.
- **The Dependent Care FSA rose to $7,500 per household in 2026 (OBBBA)**, while many calculators still say $5,000 ([Kiplinger](https://www.kiplinger.com/personal-finance/family-savings/ways-to-lower-your-child-care-costs), [Taxstra](https://taxstra.com/nanny-tax/)). The Child and Dependent Care Credit was also restructured for 2026; verify the rates.

**Competitors found.** **Care.com HomePay**, **GTM Payroll**, Poppins Payroll, NannyChex, **Nanny Lane** (share matching and calculators), plus many calculator sites (taxbracketcalc, sum-money, spousalcalc).

**Willingness to pay.** These families are affluent and already pay $40–80/month for payroll services. We can't run payroll in 12 hours, though.

**Retention.** There's a natural monthly "who owes what" ledger, plus PTO and holiday tracking.

**US market math.** Nanny shares number roughly 100–300K families (est.). **The TAM is too small for $100M** unless the product expands to all household employers, where HomePay dominates.

**60-second magic moment.** Enter both families' kids, hours, rate and ZIP. The output shows each family's weekly cost, employer taxes, and the optimal DCFSA vs credit mix with net cost.

**Real core.** A deterministic tax calculator (FICA, FUTA, state SUI, DCFSA/CDCTC). Claude drafts the share agreement. **Claude adds little value here**, so it reads as a calculator.

**Scores:** E2E 7 | Sell 6 | Clear 7 | ARR 3 | Orig 7 → **6.2**

---

### h. Fantasy-football commissioner recaps (Sleeper API)

**Persona & trigger.** A league commissioner aged 28–40 who wants the group chat alive. Week 11 is now, and the season ends in December.

**Evidence of demand (DIY).**
- Several open-source projects: Commish, fantasy-football-metrics-weekly-report, fantasy-football-recapper, a weekly-email repo ([GitHub](https://github.com/uberfastman/fantasy-football-metrics-weekly-report)).
- An existing iOS app built specifically for this ([League Rewind](https://apps.apple.com/app/id6499177011)).

**Competitors found (saturated).**
- **Sleeper itself posts "Weekly Report with Awards… in the league chat every week"** ([support.sleeper.com](https://support.sleeper.com/en/articles/3204499-league-history-and-weekly-reports))
- **League Rewind** (iOS, AI recaps for Sleeper)
- **Commish** (OSS, GPT recaps with a trash-talk mode, for ESPN, Sleeper and Yahoo)
- **ffwrapped** (Product Hunt)
- stork.ai "Fantasy Football AI Weekly Recaps"
- Fantasy Genius yearly recaps
- ESPN and Yahoo have their own AI features

**Willingness to pay.** Low: $10–20 per league per season. It's seasonal, about 17 weeks.

**Retention.** A good weekly loop in season, then nothing for about 8 months.

**US market math.** About 60M players and maybe 6M commissioners. Even 5% × $15 = ~$4.5M. **Not credible for $100M.**

**60-second magic moment.** Strong: enter any Sleeper league ID and get a real recap with awards. The API is public with no key ([docs.sleeper.com](https://docs.sleeper.com)).

**Real core.** Real data through a public API, which makes this the best E2E of all, but it's a "want", not a fundamental pain.

**Scores:** E2E 9 | Sell 6 | Clear 5 | ARR 3 | Orig 3 → **6.3**

---

## 3. Our own candidates

### A. Mortgage Payment Autopsy: escrow-shortage audit plus PMI-removal finder (TOP PICK)

**Persona & trigger.** A first-time homeowner aged 28–42 who bought in 2020–2024, often with 3–10% down. The trigger is the annual **escrow analysis letter**: "your new monthly payment is $X" (+$150 to +$600). The owner doesn't understand why, or whether it's right. Secondary triggers are the insurance renewal, the property-tax assessment notice, and realizing they still pay PMI after their home has appreciated.

**Evidence.**
- r/personalfinance, "Help! Monthly mortgage went up…" (Oct '24): *"My Mortgage was recently 1512.61 and my escrow analysis just came in and they're telling me by new monthly payments are 4167.61!"* ([reddit.com/r/personalfinance/comments/1g5jetr](https://www.reddit.com/r/personalfinance/comments/1g5jetr/))
- BiggerPockets, "Mortgage payment increased $220/month": *"my escrow was BEHIND my monthly payment went up about $100/month just to make up that debt"* ([biggerpockets.com](https://biggerpockets.com/forums/88/topics/536006-mortgage-payment-increased-220-month))
- Benzinga headline built on a Reddit post: *"A first-time buyer was shocked when their escrow shot up — turns out a fixed rate doesn't protect you…"* ([benzinga.com](https://www.benzinga.com/markets/25/06/46042334/a-first-time-buyer-was-shocked-when-their-escrow-shot-up-turns-out-a-fixed-rate-doesnt-protect-you-f))
- MoneyLion (Aug 2026), "Escrow payment jumped $400": the average homeowner insurance premium is **$3,057 in 2026, up 46% since 2021** (Insurify). Property taxes rose 10.4% in 2021–23 and 5.1% in 2023–24 (LendingTree) ([moneylion.com](https://moneylion.com/trending/money/escrow-payment-jumped-400-dollars-what-your-mortgage-statement-really-telling-you))
- Lender explainer pages (Experian, Rocket, Navy Federal, Better, CrossCountry, Redfin) all exist because the confusion is widespread. They explain the general case but don't audit *your* statement.

**Competitors found.**
- **Escrow audit: none found.** Only content pages explain shortages.
- **Adjacent:** Ownwell and similar firms for property-tax appeals; Insurify and Policygenius for insurance reshopping; lenders for refinancing.
- **PMI removal: not searched** (budget ran out). From memory, there are only content pages (NerdWallet, Bankrate) and lender forms, with no known consumer tool. **Verify before the pitch.**

**Willingness to pay.** "Found money" framing: PMI removal saves **$100–300/month**, and a cushion over-collection refund is real cash. Price **free audit + $29 "fix pack"** (letters to the servicer, a PMI cancellation request, a tax-appeal packet), or **$5/month "Home Cost Watchdog"**. Affiliates add revenue: homeowners insurance reshopping (CPA est. $50–100) and refinance leads (est. $100+).

**Retention loop.** Annual events cluster through the year: the escrow analysis, the insurance renewal (reshop alert), the property-tax notice (appeal deadline), and a quarterly PMI check as FHFA home-price data updates. It's a "watchdog" subscription, not daily use.

**US market math.** About 50M mortgaged owner-occupied homes, most of them escrowed, and several million loans with PMI (est.). 1.5M subs × $60 = $90M, plus affiliate revenue. **$100M is plausible.** CAC: SEO for "why did my escrow go up" is a huge evergreen query, and every escrow letter season brings a spike.

**60-second magic moment.**
1. "Try sample escrow analysis" produces: "Your servicer is projecting a 3.1-month cushion; federal rules (12 CFR 1024.17) cap it at 2 months, so you're over-collected ~$38/month. Your shortage is $1,212, and spreading it costs $101/month for 12 months. Your insurance premium rose 31%; reshopping typically saves $X."
2. "PMI check" needs 4 inputs: purchase price, date, ZIP and loan amount. Using **FHFA's public house-price index** for that ZIP3 and metro: "Estimated value $412K → LTV ~71% → you likely qualify to request PMI cancellation (Fannie/Freddie: ≤75% LTV with 2–5 years seasoning, based on a new appraisal). Savings: ~$143/month." It then generates the request letter.

**Real core.**
- **Claude** extracts the escrow analysis (Reg X requires standard elements: projected disbursements, lowest balance, cushion, shortage or surplus).
- **A deterministic Reg X engine** recomputes the projected balance month by month, the 1/6 cushion cap, shortage vs deficiency handling, and the surplus ≥ $50 refund rule.
- **The PMI engine** applies Homeowners Protection Act rules (80% request and 78% automatic termination on the original value), GSE current-value rules, FHA MIP rules (life of loan if under 10% down after 2013, otherwise 11 years), amortization, and FHFA HPI data.
- **Optional:** the insurance renewal declaration page goes to Claude, which produces a reshop checklist.

**Build risk.** Medium.
- Escrow statement layouts vary by servicer, so we need 2–3 realistic synthetic samples.
- Most shortages are *legitimate*, so the "error found" moment will be rare in real life. **The pitch should lead with PMI removal and the cost-reduction plan; the audit is the hook.**
- FHFA HPI is a CSV download, so preload it.

**Why another team won't build it.** LLMs don't suggest "escrow analysis" or "PMI cancellation" by default. They suggest budgeting coaches. The topic sounds boring but is about real money.

**Scores:** E2E 8.5 | Sell 6 | Clear 8.5 | ARR 7 | Orig 8 → **7.7**

---

### B. ACA "Clawback Guard" for freelancers and variable-income Marketplace enrollees

**Persona & trigger.** Self-employed, gig, commission or between-jobs adults aged 25–45 on an ACA Marketplace plan with advance premium tax credits (APTC). **New in tax year 2026: the repayment caps on excess APTC are gone.** If 2026 income comes in higher than estimated, they repay *all* of it in April 2027. The triggers are open enrollment now (2026-11-01 to 2027-01-15), every income change, and tax time.

**Evidence.**
- IRS: *"Beginning with tax year 2026, the taxpayer must repay the full amount of any excess advance payments of the premium tax credit (APTC)"* ([irs.gov](https://www.irs.gov/tax-professionals/eitc-central/repayment-caps-eliminated-for-excess-advance-payments-of-the-premium-tax-credit))
- CBPP: *"Marketplace enrollees could face surprise tax increases next year thanks to the Republican [megabill]"* ([cbpp.org](https://www.cbpp.org/blog/marketplace-enrollees-could-face-surprise-tax-increases-next-year-thanks-to-the-republican))
- Worked example (Morkel Financial): at 358% FPL, repayment is **$3,512 vs $1,625** under the old cap. At 403% FPL (over the cliff), the **full $7,294** is repaid ([morkelfinancial.com](https://morkelfinancial.com/blog/excess-premium-tax-credit-repayment-2026))
- Enhanced subsidies expired, and the 400% FPL cliff is back. Benchmark silver premiums are reportedly up ~42% over 2025–2027 (KFF via press). Unsubsidized rates are up ~14% for 2027, and insurers are exiting in nearly half the states ([healthinsurance.org](https://www.healthinsurance.org/blog/2027-aca-open-enrollment-whats-changing/))
- Freelancer press coverage: [healthjournalism.org](https://healthjournalism.org/blog/2026/01/what-freelancers-should-know-about-the-impending-health-insurance-premium-hikes/), [selfemployed.com](https://www.selfemployed.com/news/health-insurance-2026-subsid/)

**Competitors found.**
- **Subsidy and cliff calculators (commoditized):** tax47.app (MAGI tests), acacalc, jupid, aca-subsidy-guide.vercel.app, healthinsurance.org, KFF, nationaltaxtools
- **Enrollment platforms:** HealthSherpa (B2B enrollment) and Stride Health (gig workers, broker model)
- **Freelancer tax apps** (Keeper and similar, from memory)
- **No tool was found that tracks year-to-date income against the APTC already received and alerts the user to update their Marketplace estimate.** That tracking is the wedge.

**Willingness to pay.** These users fear a $2–7K tax bill. **$8/month or $59/year.** A later option is broker-of-record commission (requires licensing).

**Retention loop.** **Monthly**: log or upload income (1099s, invoices, bank CSV), recompute the projected repayment, and get prompts like "update your Marketplace income to $X" or "contribute $Y to HSA/SEP/IRA to drop MAGI under 400% FPL". At tax time, a Form 8962 preview.

**US market math.** About 20–24M Marketplace enrollees, of whom an estimated 30–40% have variable income (~7M). 1M × $59 = $59M, plus broker commissions. $100M is plausible but not obvious.

**60-second magic moment.** Enter ZIP, age, household size, the APTC on the plan and month-to-date income. The output: "Projected 2026 income $63.4K = 403% FPL → you will repay the entire $7,294 next April. Put $3,200 into an HSA or SEP-IRA → back to 398% FPL → repay $0–$900." It also generates a "how to update your income on healthcare.gov" checklist.

**Real core.** Official FPL tables, applicable-percentage tables and the Form 8962 logic, all deterministic. Benchmark plan premiums come from the CMS Marketplace API, which needs a free API key (approval timing is a risk). The fallback is having the user paste their second-lowest-cost Silver plan price from healthcare.gov. Claude parses income documents and explains the result.

**Build risk.** Medium. Tax math must be exact (MAGI definitions differ for PTC vs IRA purposes). The API key may be delayed. **Jurors are mostly employer-insured, so they relate less.**

**Scores:** E2E 7.5 | Sell 7 | Clear 8 | ARR 6 | Orig 7 → **7.2**

---

### C. Severance / layoff command center

**Persona & trigger.** A white-collar worker aged 28–45 laid off in the 2025–26 wave and handed a severance agreement with 21 or 45 days to sign.

**Evidence (thin; the search budget ran out).**
- Indie and guide products are multiplying: Orbyt severance guides, "Don't Sign Until You Read This" layoff kit ([a4-layoff-kit.pages.dev](https://a4-layoff-kit.pages.dev/)), "Layoff day 1 triage" ([theaicareerlab.com](https://theaicareerlab.com/examples/layoff-day-1-triage)), and a public Claude artifact "SLS Severance Navigator".
- Under ADEA/OWBPA, workers 40+ get 21 days to consider (45 days for group layoffs) plus a 7-day revocation period ([betterlegal.com](https://betterlegal.com/resources/red-flags-in-severance-agreement)).
- No first-person complaint quotes were collected.

**Competitors found.**
- **SimpleSeverance**: free, "Smarter than ChatGPT, more affordable than lawyers". It has 3 upvotes and no reviews on Product Hunt, so it's tiny ([producthunt.com](https://www.producthunt.com/products/simpleseverance))
- BetterLegal, Orbyt, layoff kits, employment lawyers (free consultations)

**Willingness to pay.** High per incident ($49–149). Retention is weak.

**US market math.** About 1.6–1.8M layoffs per month (JOLTS, from memory), of which an estimated 2–4M/year involve severance agreements. 300K × $99 = $30M.

**60-second magic moment.** A sample agreement produces clause flags (release scope, non-disparagement, a non-compete in a state that bans them, an OWBPA defect), a negotiation email, and a 90-day cash runway including COBRA vs Marketplace.

**Real core.** Clause rubric, state non-compete law table, OWBPA checklist, and state unemployment-insurance formulas.

**Scores:** E2E 7 | Sell 4 | Clear 8 | ARR 5 | Orig 6 → **6.15**

---

### D. Parental-leave stacker (state PFML + FMLA + short-term disability + employer policy)

**Persona & trigger.** An expecting parent aged 28–38 in months 4–6 of pregnancy, trying to work out how many weeks they get and what they'll be paid each week.

**Evidence.**
- One account in our results describes an employer whose short-term disability was supposed to stack with Oregon's state leave to reach full pay, but "no one realized that stacking insurance and state benefits didn't work that way on their policy". The source is probably the Claire Back Office Substack; attribution is uncertain.
- States differ: 67% wage replacement in NY, up to 100% for low earners in OR. CA allows 52 weeks of SDI but 12 weeks of PFL ([decisioncalc](https://decisioncalc.pages.dev/articles/fmla-paid-leave-guide), [clockspot](https://www.clockspot.com/tools/pfml-benefits-estimator)).
- New state programs started paying benefits in 2026 (DE, MN, ME; from memory, verify).

**Competitors found.** Official state calculators (CA EDD, MA, NY), the **Clockspot multi-state PFML estimator**, maternitytally, the Aflac maternity-leave calculator, calcbee and baby-calcs, and B2B leave platforms (from memory: Tilt, Cocoon, Sparrow, Maven).

**Willingness to pay.** $29–49 one-time. Retention is weak, though the user could flow on to childcare and DCFSA planning.

**US market math.** About 3.6M births per year. 300K × $39 = ~$12M. **Too small without expansion.**

**60-second magic moment.** Enter state, salary and due date, and paste the employer policy. The output is a week-by-week pay timeline plus a list of forms and deadlines.

**Scores:** E2E 7 | Sell 4 | Clear 8 | ARR 4 | Orig 6 → **6.0**

---

### E. IUL / whole-life illustration decoder ("my friend is selling me an IUL")

**Persona & trigger.** An adult aged 25–40 being pitched IUL or whole life by a friend or relative, often through multi-level marketing insurance agencies, as a "tax-free retirement" vehicle.

**Evidence.**
- A consumer advocate told regulators: *"The issue is not the product… It's the illustration of IUL that is creating issues for us."* ([insurancenewsnet.com](https://insurancenewsnet.com/innarticle/indexed-universal-life-tax-free-promise-or-costly-illusion))
- A NAIC consumer-representative handout says consumer complaints and litigation have arisen over misleading illustrations ([content.naic.org](https://content.naic.org/sites/default/files/call_materials/issues-w-iul-handout.pdf))

**Competitors found.**
- **Veralytic**, advisor-side ([kitces.com](https://www.kitces.com/blog/will-veralytic-reform-the-life-insurance-industry/))
- **Agencyrocket IUL Analyzer**, a sales-side closing tool ([agencyrocket.com](https://agencyrocket.com/analyzer))
- The **Consumer Federation of America rate-of-return service**, a paid human review ([consumerfed.org PDF](https://consumerfed.org/wp-content/uploads/2022/05/ROR-Service-2022.pdf))
- Fee-only advisors
- **No consumer self-serve tool was found.**

**Willingness to pay.** $29 one-time. **No retention.** The TAM is small.

**60-second magic moment.** Upload a sample illustration. The output: "Guaranteed-column IRR at year 20: −1.4%; illustrated: 5.1%; surrender charge until year 15; buy-term-and-invest comparison: +$212K at 65."

**Real core.** Claude table extraction plus a deterministic IRR and surrender-curve calculation. Strong originality, weak business.

**Scores:** E2E 7.5 | Sell 2 | Clear 7 | ARR 3 | Orig 9 → **5.8**

---

### F. Dealer buyer's-order decoder (out-the-door price and junk fees)

**Persona & trigger.** A car buyer aged 25–45 holding a dealer's buyer's order or four-square, deciding today.

**Evidence.**
- CarEdge: *"the dealer will never actually remove the fee from your buyer's order, instead they will reduce the selling price"* ([caredge.com](https://caredge.com/guides/car-dealer-fees/))
- White House CEA junk-fees report ([whitehouse.gov](https://www.whitehouse.gov/cea/written-materials/2024/03/05/the-price-isnt-right-how-junk-fees-cost-consumers-and-undermine-competition/))
- The FTC CARS Rule was vacated by the courts (Jan 2025, from memory; one search source agrees), so dealer junk fees are unregulated federally.

**Competitors found.** **frontle** (iOS: scan dealer quotes, spot hidden fees) ([apps.apple.com](https://apps.apple.com/app/frontle/id6759473567)), **CarEdge** (out-the-door quote grading and a negotiation concierge), Budget Beavers dealer-fee decoder, and CarGurus guides.

**Willingness to pay.** $19–49 one-time. No retention; affiliate revenue from auto refinance and insurance.

**60-second magic moment.** A sample buyer's order produces: "$2,895 of optional add-ons; doc fee $899 vs the state norm; nitrogen and VIN etch are junk", plus a script and an out-the-door counter.

**Real core.** Claude vision, a state doc-fee cap and tax table, and an add-on catalog. Without transaction-price data (paid APIs), "fair price" is weak.

**Scores:** E2E 7 | Sell 3 | Clear 8 | ARR 5 | Orig 5 → **5.85**

---

### G–I. Investigated and rejected as crowded

- **G. Home inspection report → repair-credit request.** Spectora AI and HomeGauge AI (inspector-side), Majordomo, homegrade.ai, shipshape.ai, Repair Pricer (from memory), plus many "use ChatGPT" guides ([aiyd comparison](https://aiyd-com.pages.dev/best-ai-for-home-inspection), [neuhausre](https://neuhausre.com/ai-home-inspection-report/)). **Score 5.3.**
- **H. HVAC/contractor quote checker.** **TruePrice** is free, covers 15 categories and 700+ cities, and says "No signup, no lead selling" ([Product Hunt](https://www.producthunt.com/@trueprice_tech/forums)). Also HVAC.com **QuoteScore** (human review, 1–3 days), **RenoCanvas** ($9.99) and 3HVACQuotes. **Score 5.25.**
- **I. Volunteer youth-coach practice planner.** Coach One, GOCOACH!, CoachFrank, Coach Jack (Soccer Handbook) and Coach2Coach, most of them free ([Coach One](https://apps.apple.com/app/id6759070599), [CoachFrank](https://apps.apple.com/app/id6479705308)). It has a good weekly loop but is crowded and has low willingness to pay. **Score 6.2.**

---

## 4. Recommendation

1. **Build A (Mortgage Payment Autopsy)** if the team wants the most original idea with a credible money story (affiliate revenue plus watchdog subscription). Lead the demo with the PMI check, which takes 4 inputs and uses real FHFA data. Follow with the escrow audit on a sample statement.
2. **Build c (Open-Enrollment SBC Simulator)** if the team wants the safest "works end-to-end with real data" score and a "why now" story. A juror can upload their own SBC today. Consider adding B's Marketplace clawback tracker as the retention layer.
3. **a (IEP)** is the strongest "clear user, emotional pain, school-year retention" pick. Competitors exist (Undivided, AdvocateIQ, AIEP), but no other hackathon team is likely to build it.
4. Drop **h, e, g, f, d** for this brief:
   - h: saturated, and Sleeper already does it natively.
   - e: crowded, $29 anchor, no retention.
   - g: TAM too small.
   - f: low willingness to pay and lead-gen ethics problems.
   - d: no retention, and no comparable-sales data.

### Things to verify before the pitch
- PMI-removal competitor scan, which was skipped because the search budget ran out.
- Exact 2026 CDCTC rates and the 2027 HDHP minimum deductible and OOP limits.
- Whether a CMS Marketplace API key can be obtained the same day.
- The IDEA 504-only count (CRDC).
- APPA vet-spend figures.
- KFF figures on employer-coverage counts.

# Track 01 — MONEY: opportunity research

*Researcher agent · 2026-11-14 · Scope: B2C, web-only, US adults 25–45, Claude API as the engine, about 12 hours of build time.*
*This file applies the team's **originality guardrail** (CLAUDE.md, plus the coordinator's mid-task update). Ideas on the excluded LLM-default list were dropped from the top 3 even where the evidence was strong.*

---

## TL;DR

| # | Idea | One-liner | Weighted score /10 | Biggest risk |
|---|---|---|---|---|
| 1 | **CliffGuard** | Tells freelancers and other variable-income families on HealthCare.gov how much premium tax credit they will have to **pay back, with no cap for the first time** (2026 tax year), and the exact HSA/SEP/IRA moves and income updates that bring it to zero. | **7.6** | Tax-rule edge cases and CMS API access (key request, coverage of HealthCare.gov states only). Most jurors have employer coverage, so the demo needs a strong preset persona. |
| 2 | **Shortfall** | Upload the escrow letter that just raised your mortgage payment. You get a line-by-line breakdown, an audit against RESPA/Reg X rules, a check for a missing homestead exemption, the cheapest way to pay, and a Notice of Error drafted if the servicer broke the rules. | **7.1** | Retention is annual, not weekly. Escrow statement formats vary by servicer. |
| 3 | **PlanMath** | Upload your employer's 2027 benefits guide (and your spouse's). In about 45 seconds you get the plan choice, HSA amount, health FSA amount and **new $7,500 dependent-care FSA** election that minimise your household's expected cost. | **6.8** | Weak retention (once a year) and medium novelty. B2B tools (ALEX, Nayya) already serve employees at large employers for free. |

**My bet: CliffGuard.** It is driven by a rule change with no incumbent. The OBBBA removed the repayment caps, the 400% FPL cliff came back, and bronze plans became HSA-eligible. The timing is ideal: open enrollment runs now, and the first uncapped reconciliation hits in Feb–Apr 2027. A juror gets a five-figure dollar answer in under 60 seconds with no upload, the math is deterministic on real federal data, and variable-income users have a natural reason to check in every month.

---

## 1. Method and limitations (please read)

- **Sources:** web search in standard mode, plus direct fetches of primary documents: the Fed SHED, KFF, the IRS Rev. Proc. 2026-26 PDF, 12 CFR 1024.17 and CMS developer pages. I also used survey and news coverage and competitor sites.
- **Reddit could not be fetched.** reddit.com blocks our crawler, so "own words" evidence comes from:
  - Q&A sites such as JustAnswer and ObamacareFacts
  - people quoted in KFF Health News
  - Reddit mirrors that appeared in search results
  - first-person blogs

  Treat the "people asking" evidence as **directionally right but thinner than ideal**. Before the pitch, a human should paste 3–5 real Reddit quotes (r/HealthInsurance, r/personalfinance, r/FirstTimeHomeBuyer, r/RealEstate) into the deck.
- **The search budget ran out partway through** (a 200-call limit shared across agents). Competitor checks for three secondary candidates are incomplete: paycheck auditor, BNPL calendar and utility tariffs. They are marked as such below.
- **Numbers:** anything marked *(assumption)* is my own estimate for market math. Everything else is cited in §7.

---

## 2. Macro context: where money hurts for 25–45s

- **Fragile cash buffers.** 63% of adults would cover a $400 emergency using cash or its equivalent. That figure was flat in 2025, and young and low-income adults declined (Fed SHED 2025, released May 2026). 42% worry about finding or keeping a job.
- **Health costs are the fastest-growing bill.**
  - Employer health costs are projected to rise **8.2% in 2027**, the most since 2003. About two-thirds of large employers will raise the employee share, and 59% plan cost-cutting changes such as higher deductibles (Mercer/Marsh survey coverage).
  - ACA benchmark premiums are up **42% from 2025 to 2027**, and the enhanced subsidies expired (KFF).
- **Housing "fixed" payments aren't fixed.** In 2026, 65% of escrow accounts face a shortage averaging $2,100, and the average payment rises $175/month (Cotality via U.S. News/WTOP).
- **Childcare** takes about 20% of household income for the average parent, against the HHS benchmark of 7% (Care.com 2026).
- **Credit stress.** 47% of BNPL users paid late in the past year, up from 34% in 2024 (LendingTree 2026).
- **Policy churn creates fresh pain.** The One Big Beautiful Bill Act (P.L. 119-21) changed ACA reconciliation, HSA eligibility, dependent-care FSA limits and tax deductions. Student-loan plans were overhauled: SAVE ended and RAP launched July 1, 2026.

---

## 3. Candidate pains (12) with competitor checks

Verdicts: ✅ top 3 · 🔁 alternate · ⛔ excluded by the guardrail or fails it · ⚠️ incomplete check

| # | Pain (persona · trigger) | Evidence | Top competitors | Gap | Verdict |
|---|---|---|---|---|---|
| 1 | **ACA subsidy clawback and cliff.** Freelancer or variable-income family; income rose mid-year, or it's open enrollment, or the 1095-A has arrived. | Repayment caps removed for tax years after 2025 (IRS OBBB page; CBPP). Cliff back at 400% FPL; premiums +42% since 2025 (KFF). Legal aid: "The amount is just so staggering for folks" (KFF Health News, Apr 2026). | Free static calculators (KFF, healthinsurance.org, Jupid, Sum.money, many vibe-coded pages). HealthSherpa (enrollment only). Stride Health ($47M Series C; gig benefits, B2B2C). Instead ($15M, general AI tax planning). | No product sits between enrollment and filing: nothing tracks income monthly, forecasts the uncapped repayment, and prescribes the HSA/SEP/IRA amounts and deadlines. | ✅ **#1** |
| 2 | **Escrow shortage shock.** Homeowner, often a first-time or new-build buyer, gets the annual escrow analysis letter. | 65% of accounts face a shortage averaging $2,100; payments +$175/month (Cotality). "My escrow analysis came back… payment went up $800… what can I do" (JustAnswer). CFPB found Reg X escrow violations. | Ownwell ($74M per a competitor; 25–35% of savings; property-tax appeals in 8 states). AppealDesk, O'Connor. JustAnswer (generic Q&A). Servicer-side software (VisiEscrow, LoanPro). | No B2C tool parses the escrow statement and audits it against Reg X, missing exemptions and payment options. | ✅ **#2** |
| 3 | **Employer open-enrollment elections.** Dual-income parents; HR email says "elections close Friday". | Most employees picked financially dominated plans and overspent about 24% of premiums (QJE 2017). 92% re-pick the same benefits in about 33 minutes (Aflac). 2027 costs +8.2%. Dependent-care FSA raised to $7,500 in 2026 (SHRM). 47% forfeit health FSA money, averaging $422 (EBRI via Money). | ALEX/Jellyvision (B2B, ~$0.83 PEPM listed). Nayya (B2B, $1–1.50 PEPM). Carrier and HSA-admin calculators. PennyCalc and Lively (manual entry). orbdoc (small upload tool). DIY ChatGPT. | No B2C tool models both spouses' menus plus HSA plus dependent-care FSA versus the expanded child-care credit from an uploaded guide. | ✅ **#3** |
| 4 | **Paycheck changed or wrong.** Hourly or W-2 worker; first January paycheck is $140 smaller. | Payroll vendors built "explain the difference" tools: Gusto has in-app paycheck compare; Symmetry has an AI "compare two paychecks and explain the differences" API. 2027 premium hikes and OBBBA withholding changes hit January checks. **No own-words evidence collected** (search budget). | Gusto (in-app, Gusto employees only). Symmetry (B2B API). IRS Withholding Estimator and PaycheckCity (manual entry). ⚠️ ADP not checked. | No independent consumer app that diffs stubs, flags errors and fixes the W-4. | 🔁 alternate (good retention, thin evidence) |
| 5 | **Student loans after SAVE.** SAVE borrower gets the 90-day "choose a new plan" notice (waves run through March 2027). | About 7M SAVE borrowers must switch; missed deadlines lead to auto-placement plus a final 30-day notice (College Investor, Oct 2026). A median-income family of four may go from ~$36 to ~$440/month under RAP (advocacy estimate). | StudentAid.gov Repayment Calculator (free; now includes RAP). Savi and Summer (funded, B2B2C plan selection plus forms). Chipper ($5.6M). Tate Law's free IBR-vs-RAP calculator. Student Loan Planner ($595 consult). | Only narrow angles remain: auditing the servicer's payment, the consolidation trap after 7/1/2026, and PSLF buyback. | 🔁 alternate (fails bar #5 for plan choice) |
| 6 | **Laid off: COBRA vs Marketplace.** Laid-off parent with a COBRA notice and 60 days to decide. | Full-year income rule means a re-hire can trigger repayment ("This seems extremely unfair. I was not warned…", ObamacareFacts). | Many SEO/vibe-coded pages (layoffcalc, laidofflaunch, etc.); HealthSherpa. | No clawback-aware decision tool, but this shows up in LLM-generated content a lot. | Folded into #1 as an entry point |
| 7 | **BNPL stacking and late fees.** Shopper juggling Klarna, Affirm and Afterpay. | 47% paid late; 29% financed groceries (LendingTree 2026). | ⚠️ not checked (search budget). | A unified schedule needs screenshots or data access. | ⛔ low willingness to pay; close to "debt planner" |
| 8 | **Childcare cost burden.** Parents of under-5s. | ~20% of income vs HHS 7% benchmark; 20% spend >$30k/yr (Care.com 2026). | FSA-admin calculators; Care.com. | The dependent-care FSA vs credit decision is covered inside #3. | Merged into #3 |
| 9 | **Medical bill and EOB errors.** Family with a confusing bill. | 43% of adults received an erroneous bill (KFF via PIRG). Goodbill charges 20% capped at $1,000 and handles hospital bills only; Resolve has a ~$5k minimum. | Granted, Curai (free), Remedy, Avelis, OpenHand, Counterforce, Goodbill, Resolve, Dollar For. | Crowded and on the excluded list. | ⛔ excluded |
| 10 | **Bill negotiation / subscription creep.** | Rocket Money takes 30–60% of savings; Trustpilot ~3.3–3.5 stars. | Rocket Money, Billshark, Trim, Pine AI. | Excluded list. | ⛔ excluded |
| 11 | **Under-negotiated offers (earning).** | 55% don't negotiate (Resume Genius 2025); ZipRecruiter shows only ~30% of new hires negotiated. Levels.fyi charges $650–$5,000. | Levels.fyi, Rora, Glassdoor, Payscale. | Excluded list. | ⛔ excluded |
| 12 | **Rising car-insurance and electricity bills.** | Two-thirds of drivers saw rate increases (CarInsurance.com survey). Residential power +7.3% YoY to 18.8¢/kWh (Apr 2026). | Jerry, Insurify, The Zebra (lead-gen). ⚠️ Utility tariff tools not checked. | No free quote data for insurance; tariff optimisation is regional. | ⛔ weak real-data core in 12h |

---

## 4. Top 3, in depth

### Idea 1 — **CliffGuard**: "Will you owe your health subsidy back?"

**Pitch:** CliffGuard is a web tool for freelancers and other variable-income families on HealthCare.gov. It forecasts the premium tax credit you will have to repay (fully, now that there is no cap) and gives you the exact contribution amounts and deadlines (HSA, SEP-IRA, IRA) plus the income update that brings the repayment to zero.

#### Persona and trigger moment
- **Dani, 37, freelance UX designer in Austin, TX** (Texas uses HealthCare.gov). Married; spouse is a part-time W-2 worker with no benefits; two kids. They bought a 2026 marketplace plan with advance credits based on a **$105k** income projection. A big contract in September pushed 2026 income toward **$134k**.
- **Trigger, now (Nov–Dec 2026):** the HealthCare.gov renewal email asks for her 2027 income estimate, and a friend mentions you can owe the subsidy back.
- **Trigger, Feb–Apr 2027:** the 1095-A arrives and TurboTax shows a five-figure repayment. That is the first tax season ever with **no repayment cap**.
- **Other triggers:** a W-2 job offer while on marketplace coverage; a December "am I over the cliff?" check.

#### The pain and evidence
- **Repayment caps are gone** for tax years after Dec 31, 2025 (OBBBA §71305; IRS OBBB provisions page; CBPP). Before the change, caps limited repayment to $375–$3,250 for incomes under 400% FPL. Now any excess advance credit is owed in full (KFF Health News).
- **The cliff is back.** Above 400% FPL there is no credit at all. For 2026 coverage that is $62,600 for a single person, $106,600 for a family of three and $128,600 for a family of four. Benchmark silver premiums rose 26% in 2026 and 13% more for 2027 (**42% cumulative**) (KFF).
- **How big the hit can be:**
  - A Pisgah Legal client's repayment was capped at $1,625; without the cap it would have been about **$4,000**.
  - Urban Institute's Jason Levitis describes a possible **$10,000 repayment from one extra shift**: "maybe don't take that shift."
  - A KFF poll found **43% of enrollees plan to work more hours**, which means income rises and so does the clawback risk (KFF Health News, Apr 3, 2026).
  - Instead's worked example: a household at 403% FPL repays about **$7,294** under 2026 rules vs about **$3,289** under 2025 rules.
  - Physician on FIRE's "A $30,000 mistake" shows cliff losses of about $21.5k/yr for one couple.
- **The scale of exposure:** effectuated marketplace enrollment was 19.2M in Feb 2026; the individual market was 20.5M in June 2026 (KFF). More than 90% of 2025 enrollees got subsidies (KFF Health News).
- **Own words:**
  - "This seems extremely unfair. I was not warned about this, and needed the subsidized insurance until my new job started." (ObamacareFacts reader question)
  - "I can make anywhere between $20,000 and $45,000 next year. I just don't know." (client quoted by legal aid in KFF Health News)
- **A new lever few people know about:** since Jan 1, 2026, **bronze and catastrophic plans count as HSA-eligible** (OBBBA; IRS Notice 2026-5). About 35% of HealthCare.gov plans are HSA-eligible in 2026, up from 4% in 2025. HSA contributions for 2026 can be made **until April 15, 2027** and reduce MAGI. SEP-IRA contributions can be made up to the filing deadline.
- **2027 parameters are published:** the applicable-percentage table runs **2.15% to 10.22%** of income (IRS Rev. Proc. 2026-26, fetched and read).

#### What they pay for, and the price
- **Free:** the clawback estimate and how far you are from the cliff. This is the magic moment.
- **$49 one-time "Fix Plan" (Jan–Apr 2027 for tax year 2026):** optimised contributions per account (HSA/SEP/IRA) with deadlines, a Form 8962 preview, a before-and-after repayment comparison, and a printable checklist.
- **$8/month or $79/year "Income Guard" (2027):** a monthly income tracker, clawback meter and threshold alerts; a script for updating income on HealthCare.gov; a December cliff check; and a 2027 plan comparison after the credit.
- **Willingness-to-pay comparables:**
  - CPA tax planning typically costs hundreds of dollars *(assumption; not verified this session)*
  - Instead's AI tax planning starts at $16/month
  - Jupid's AI accountant is listed from $50/month (third-party listing)
  - Student Loan Planner charges $595 for a single consult on a comparable "complex federal rules" problem

  The savings are often $2k–$15k, so a $49–$79 price is a 30–200× return.

#### Retention loop
Variable earners check in monthly:
1. They log or upload the month's income (invoices, 1099-K screenshot, pay stub, bank CSV).
2. CliffGuard updates projected MAGI and shows "you'll repay $X" alongside the 400% (cliff) and 250% (cost-sharing reduction) lines.
3. If a line is crossed, it alerts the user to update HealthCare.gov now and tells them how much SEP/HSA it would take to get back under.

The same data drives quarterly estimated taxes (April, June, September, January). The calendar builds to a December check, then a Jan–April Fix Plan, then the November open-enrollment estimate. Each step is a hard money deadline.

#### Market math (with assumptions stated)
- ~20.5M individual-market enrollees, or ~12M households at ~1.6 people per household *(assumption)*
- ~40% with variable or uncertain income (self-employed, gig, hourly, job changers) gives **~4.8M core households** *(assumption, consistent with the 43% planning to work more)*
- 8% conversion at $79/yr ≈ $30M, plus 500k one-time Fix Plans at $49 ≈ $25M, gives **~$55M ARR from the core**

**Is $100M plausible?** Yes, but only with expansion: MAGI planning for all 1099 households (subsidy, quarterly tax and retirement contributions), plus early retirees (the cliff hits them hardest) and families near the Medicaid/CHIP boundary. So: plausible, not certain.

#### Acquisition and LTV/CAC
- **Channels:**
  - High-intent seasonal search ("pay back premium tax credit", "1095-A repayment", "subsidy cliff"), which spikes Feb–Apr 2027 as the first uncapped returns are filed
  - Licensed marketplace brokers and navigators (white-label; brokers want clients to avoid tax-time shocks)
  - Freelancer communities and newsletters
  - Short-form "I almost owed $14k" content
- **LTV:** $79 × ~2.5 years × ~85% gross margin (Claude costs cents per analysis) ≈ **$168**, plus one-time Fix Plans.
- **CAC target:** ≤ $40 (organic and partner-led), giving **LTV/CAC ≈ 4×** ✔.

#### Competitors and what's genuinely new
| Competitor | What it does | Why it isn't CliffGuard |
|---|---|---|
| KFF, healthinsurance.org, National Tax Tools, Sum.money, Jupid's ACA calculator, many pages.dev calculators | A one-off estimate of the subsidy from income | Static. No reconciliation of credits already received, no uncapped-repayment forecast, no monthly tracking, no prescribed contribution amounts or deadlines. |
| HealthSherpa / HealthCare.gov window shopping | Enrollment | Stops at enrollment. |
| Stride Health ($47M Series C; ~$86M total per a third party) | Benefits for gig workers via Uber/Lyft/DoorDash; subsidy estimate at enrollment | B2B2C, focused on enrollment. Did not find a reconciliation guard (not fully verified). |
| Instead ($15M per CB Insights) | General AI tax-strategy platform | Generalist, aimed at CPAs and businesses. Not built around marketplace households. |
| TurboTax / H&R Block | Computes Form 8962 at filing | Shows up when the damage is already done. Usually no contribution optimisation across HSA, SEP and IRA. |

**New:** the first tool built for the **post-OBBBA reconciliation regime**. It combines your *actual* advance credits, live benchmark premiums for your ZIP code, and a deterministic optimiser over HSA (newly available on bronze), SEP-IRA and IRA, with deadlines.

#### Magic moment (<60 seconds, no login)
1. Landing page: "Will you owe your health subsidy back in April?"
2. Enter five inputs: ZIP, household ages, monthly advance credit (from the HealthCare.gov eligibility notice or 1095-A, or "estimate it for me"), projected 2026 income, and self-employed yes/no.
3. About 5 seconds later (illustrative numbers for Dani's family of four, benchmark ~$19,800/yr): "**You'll repay $9,342 in April**: you're $5,400 over the 400% line. **Contribute $5,401 to a SEP-IRA before your filing deadline**. You keep about $6,990 of credit, pay ~$1,190 less income tax, and repay only ~$2,350."
4. A slider shows income vs repayment, with a visible cliff.
5. Optional: upload a 1095-A or eligibility-notice PDF and Claude fills in the numbers.

#### The real core (AI plus data)
- **Deterministic engine** (unit-tested TypeScript):
  - Federal poverty line by household size (HHS)
  - Applicable-percentage tables: 2027 from Rev. Proc. 2026-26 (verified); 2026 up to 9.96% per Rev. Proc. 2025-25 (*from prior knowledge, re-verify*)
  - Premium tax credit = benchmark (second-lowest-cost silver, SLCSP) − applicable % × income, capped at the actual premium; excess advance credit owed in full
  - MAGI levers: HSA, SEP, IRA, and the self-employed health insurance deduction (iterative method; flag as an edge case)
- **Real public data:**
  - **CMS Marketplace API**: plans, premiums, benchmark premium and credit estimates by ZIP/household; powers HealthCare.gov window shopping. A key is free via a request form; third-party docs say keys expire every 60 days.
  - Fallback for state-based-exchange states: the user enters the benchmark premium from 1095-A column B, or the app uses the CMS public plan files.
- **Claude API:**
  - Structured extraction from 1095-A, eligibility notices, 1099s and pay stubs (tool schema plus Zod)
  - A plain-English plan
  - What-if Q&A ("I got a $140k offer starting Oct 1"), which calls the engine as a tool. **The LLM never does the arithmetic.**
- **Usable within 24h?** Yes. Request the CMS key **today**. The tables are small JSON files.
- **No bank linking. Not licensed advice:** educational, with formulas shown. Showing plans is like window shopping, not brokering.

#### Build feasibility: **Medium**
- **Risks:**
  1. CMS key turnaround and coverage limited to HealthCare.gov states (mitigation: manual benchmark entry).
  2. MAGI edge cases: untaxed Social Security, foreign income, self-employed health insurance deduction circularity, mid-year household changes.
  3. Liability for wrong numbers (mitigation: show the working, disclaimers, "verify on Form 8962").
  4. Juror relatability (mitigation: one-click persona presets, "Dani the freelancer" and "laid-off Sam").
- **12-hour MVP:**
  - Engine plus tests
  - Five-field form with sample presets
  - CMS benchmark lookup
  - Claude PDF extraction for 1095-A
  - Paywalled Fix Plan PDF
  - Monthly income log in KV, keyed by an anonymous session cookie

**Why another team is unlikely to build it:** it requires knowing three 2026 rule changes (uncapped repayment, the cliff's return, bronze-HSA eligibility), using a federal API and coding real tax math. Most hackathon builders have employer coverage and have never seen a 1095-A, and no LLM default list includes "APTC reconciliation".

#### Estimated scores
| Works (40%) | Sell (20%) | Who (15%) | Money (15%) | New (10%) | **Weighted** |
|---|---|---|---|---|---|
| 7.5 | 7.5 | 8.5 | 6.5 | 8 | **7.55** |

---

### Idea 2 — **Shortfall**: the escrow-shock decoder

**Pitch:** Upload the escrow analysis that just raised your "fixed" mortgage payment. In 30 seconds you see why it went up, whether your servicer followed federal escrow rules, whether you're missing an exemption, and the cheapest way to pay. A Notice of Error is drafted if something is wrong.

#### Persona and trigger moment
- **Jordan (33) and Priya (31), first-time buyers of a 2024 new-build in a Houston suburb**, with 5% down and one toddler.
- **Trigger:** the annual escrow analysis letter arrives (Jan–Mar for many servicers). The payment goes from $2,740 to $3,412 (+$672/month), including a $4,180 shortage "spread over 12 months".
- **Their questions:** "Is this right? Why so much? Should we pay the shortage in one go? Did we ever file homestead? Will it go back down?"
- **Secondary personas:** Florida homeowners after insurance renewals; anyone whose county reassessed.

#### The pain and evidence
- **2026 is a peak year:** **65% of escrow accounts face a shortage averaging $2,100, and the average payment rises $175/month** (Cotality via U.S. News/WTOP, Jul 2026). Taxes and insurance average **21%** of the monthly payment (Neighbors Bank via WTOP). Cotality reportedly calls rising escrow "one of the biggest risks" for 2026, and a cited survey says **60%** of affected borrowers were surprised (secondary source, Norada; unverified).
- **New-build reassessment shock is a known trap:** initial escrow is often set from a land-only or construction-year assessment, followed by a big jump after reassessment (CNBC, Apr 2024; Mr. Cooper help centre). Florida example: "January escrow statement just jumped by $400" (SavingAdvice, Jan 2026).
- **Servicers make rule errors:**
  - CFPB Supervisory Highlights (Issue 33) found servicers **violated Reg X by offering a lump-sum repayment option on shortage statements**, and made **untimely escrow disbursements**.
  - The Fed's Consumer Compliance Outlook lists common Reg X escrow violations.
- **Own words:** "My escrow analysis came back for this year and my payment went up $800 for my home what can I do to get my payment back" (JustAnswer, a paid expert Q&A site, which is itself evidence that people pay for this).
- **The rules are crisp and computable** (12 CFR 1024.17, read directly):
  - cushion ≤ **1/6** of annual disbursements
  - a shortage of ≥ 1 month's payment can only be spread over **≥ 12 months**
  - a shortage of < 1 month can be repaid within 30 days or spread over ≥ 12 months
  - a surplus of **≥ $50 must be refunded within 30 days** if the borrower is current
  - the annual statement must itemise payments, disbursements, balances and how any shortage will be handled

#### What they pay for, and the price
- **Free:** a waterfall of the increase (tax, insurance, shortage repayment, cushion) and headline flags.
- **$19 one-time "Escrow Check":**
  - the full Reg X audit
  - a tax line vs county bill reconciliation
  - a homestead/exemption checklist with deadline
  - a lump-sum vs spread calculator (paying the shortage removes only the repayment portion, not the higher ongoing deposit)
  - a next-year forecast
  - a **Notice of Error letter** (12 CFR 1024.35) as a PDF
- **$39/year "Home Cost Guard":** assessment-notice and protest-deadline reminders, an insurance-renewal check, and a PMI-removal tracker using public home-value indices (Zillow ZHVI / FHFA HPI, free; *not re-verified this session*).
- **Partner revenue:** referrals to property-tax protest firms and insurance shopping.
- **Willingness-to-pay comparables:** JustAnswer paid Q&A; Ownwell charges **25–35% of first-year tax savings**; Realtor.com estimates 40% of homes could save $100+ by appealing (via WTOP).

#### Retention loop
Honest answer: **annual, plus 3–5 money events a year.** Those are the escrow analysis, the assessment notice, the protest deadline, the insurance renewal, and the monthly PMI-eligibility watch (home-value indices update monthly). It is a "set and forget" annual subscription, not a daily app. **This is the idea's weak spot on the 20% criterion.**

#### Market math
- ~35–40M escrowed mortgages *(assumption)* × 65% shortage rate gives **~23–26M shortage letters a year**. About a third are aged 25–45 *(assumption)*, so ~8M are core persona.
- 1.5M Guard subscribers × $39 ≈ $58M, plus 1M one-time checks × $19 ≈ $19M, plus referrals at ~$20/user ≈ $20M+, gives **~$100M at maturity**. Plausible but stretched; a B2B2C channel would help (credit unions and loan officers who want to keep clients happy).

#### Acquisition and LTV/CAC
- **Channels:**
  - Seasonal high-intent search ("escrow shortage", "why did my mortgage payment go up"), Jan–Apr
  - **New-build subdivision Facebook and Nextdoor groups**: a whole subdivision gets the same shock in the same month, which makes it naturally viral
  - Realtor and loan-officer referral partnerships
  - TikTok explainers
- **LTV:** ~$39 × 3 years × 90% ≈ $105, plus ~$25 referral ≈ **$130**. **CAC target ≤ $30**, giving **~4×** ✔.

#### Competitors and what's new
| Competitor | What it does | Gap |
|---|---|---|
| Ownwell ($74M total incl. a $50M Series B in Feb 2026, *per competitor AppealDesk*; 8 states) | Property-tax appeals on contingency | Handles only the assessment cause. Doesn't read your escrow statement, audit Reg X, or model the payment options. |
| AppealDesk, O'Connor, propertytax.io | Tax protest | Same. |
| JustAnswer | Human Q&A, paid | Not computed, not instant. |
| VisiEscrow, LoanPro | Servicer-side escrow software | Built for lenders. |
| Pine AI (general AI agent) | Blog checklist on escrow overcharges | General-purpose; no Reg X engine. |

**New:** no B2C product turns the escrow statement into a computed audit and a payment decision.

#### Magic moment (<60 seconds, no login)
1. Click "Try a sample letter" or drop a PDF or phone photo of your own.
2. About 30 seconds later:
   - a waterfall: "+$672 = $214 tax ↑ + $96 insurance ↑ + $348 shortage repayment + $14 cushion"
   - checks: "Cushion ≤ 1/6 ✔", "Spread ≥ 12 months ✔"
   - "⚠ Projected tax uses $9,870; your county bill shows $8,420 with homestead, so you're over-collected by ~$121/month"
   - "Pay the $4,180 now: payment becomes $3,064"
   - "Next year: −$348 once the shortage is repaid"
3. A Notice of Error draft is one click away (paywalled).

#### The real core
- **Claude** (PDF/vision): extracts structured fields, including the month-by-month projection table, the lowest projected balance, cushion, shortage/surplus and history. Zod-validated; tool schema.
- **Deterministic Reg X engine:** recomputes the projected balances, cushion cap, shortage/deficiency handling, surplus refund duty and statement completeness. Unit-tested.
- **Optional:** parse the county tax bill and insurance declarations page; homestead rules encoded for a few states (TX, FL, GA) as JSON (*verify current amounts*).
- **Claude drafts:** the Notice of Error letter and a plain-English explanation.
- **Public data:** Reg X text; home-value indices for PMI. All free and usable within 24h. **No bank linking. Not legal advice:** a Notice of Error is a consumer's statutory right.

#### Build feasibility: **Medium**
- **Risks:**
  1. Statement formats vary by servicer. Mitigation: build 3–4 realistic samples and a robust schema, and fall back to "confirm these numbers" UI.
  2. Most jurors won't have a letter on hand, so the demo relies on samples.
  3. State-by-state exemption rules, so scope to a few states.
  4. Retention story is weaker.
- **12-hour MVP:** extraction, engine and tests; waterfall UI; paywalled audit, letter PDF and forecast; reminder sign-up (email in KV).

**Why another team is unlikely to build it:** escrow analyses are invisible to renters and young developers, the core requires reading Reg X, and "escrow" appears in no LLM default idea list.

#### Estimated scores
| Works (40%) | Sell (20%) | Who (15%) | Money (15%) | New (10%) | **Weighted** |
|---|---|---|---|---|---|
| 7.5 | 5.5 | 8.5 | 6 | 8.5 | **7.1** |

---

### Idea 3 — **PlanMath**: 2027 benefits elections, computed

**Pitch:** Upload your (and your spouse's) 2027 benefits guide. PlanMath computes the plan choice and the HSA, health FSA and **new $7,500 dependent-care FSA** amounts that minimise your household's expected annual cost, and shows the worst case too.

#### Persona and trigger moment
- **Marcus (36, ops manager at a 300-person company) and Elena (34, hospital pharmacist)**, with a 2-year-old in daycare at $1,700/month.
- **Trigger:** "Open enrollment closes Friday, Nov 21." Both employers raised premiums. Marcus's company added a higher-deductible HSA plan. They need to decide which employer covers the toddler and how much to put in the dependent-care FSA now that the limit is $7,500.

#### The pain and evidence
- **People choose badly and stay put:** the majority chose financially dominated plans, overspending about 24% of premiums, and lower-income workers were more likely to do so. Choices persist year to year (Bhargava, Loewenstein & Sydnor, QJE 2017; NBER w21160).
- **People spend almost no time on it:** 92% choose the same benefits every year, in about 33 minutes (Aflac WorkForces 2020–21).
- **2027 changes the math:** costs +8.2%; ~two-thirds of large employers will raise the employee share; 59% plan cost-cutting changes such as higher deductibles (Mercer/Marsh coverage). Workers at small firms already pay $9,687/yr toward family coverage (KFF 2026 via Insurance Business).
- **New rules:**
  - The dependent-care FSA limit rose from $5,000 to **$7,500** in 2026 (OBBBA; SHRM).
  - The child and dependent care credit top rate rose to 50%. You can't use both on the same expenses (Credit Karma; sources disagree on phase-down thresholds, so verify against IRS).
  - Newfront warns the FSA increase "could backfire" for some employees because of nondiscrimination testing.
- **Money left on the table:** 47% of FSA holders forfeited in 2023, averaging **$422**, ~$4.5B total (EBRI via Money).
- **Own words (thin):** first-person "How I used AI to figure out my health insurance" (ExploreAITogether), plus prompt libraries for "pick a health plan at open enrollment". These show people are already improvising with chatbots.

#### What they pay for, and the price
- **Free:** the recommended plan and headline savings.
- **$29 per household, one-time:** the full elections sheet (plan, HSA, health FSA, dependent-care FSA vs credit), spouse coordination across two menus, a worst-case-year view and a printable checklist.
- **$4/month add-on:** FSA spend-down reminders, re-optimisation after a qualifying life event (a new baby), and a deductible tracker.
- **Willingness-to-pay comparables:** employers pay ~$0.83–$1.50 per employee per month for ALEX and Nayya, i.e. ~$10–18/yr per employee. That shows the value is real, but **direct B2C willingness to pay is unproven** (thin evidence).

#### Retention loop
**Weak.** One big moment a year, plus life events and FSA deadlines (grace periods, run-out dates). Expect a 40–50% annual re-purchase *(assumption)*.

#### Market math
- ~150M+ people with employer coverage, roughly 60–65M choosing policyholders *(assumption)*. About 25M are parents aged 25–45, and perhaps half are at employers without a decision-support tool *(assumption)*.
- 2M × $29 ≈ $58M, plus 500k × $48 ≈ $24M, gives ~$80M. **$100M needs a broker/SMB B2B2C channel**, which drifts away from pure B2C.

#### Acquisition and LTV/CAC
- **Channels:** an October–December burst of search ("HSA vs PPO", "dependent care FSA 7500 worth it"), HR/benefits Slack communities, parenting forums.
- **LTV:** ~$29 × ~2.2 years ≈ **$64**, so **CAC must be < $20**. Viable only organically. **Tight.**

#### Competitors and what's new
| Competitor | What it does | Gap |
|---|---|---|
| ALEX (Jellyvision; acquired Picwell 2023) | Employer-licensed decision support | B2B. Only if your employer buys it. |
| Nayya | Employer/broker AI decision support | B2B. |
| HSA Bank, HealthPartners and carrier calculators | Manual calculators | Manual entry; single menu; no dependent-care FSA/credit. |
| PennyCalc, Lively | Manual HDHP vs PPO calculators | Manual entry; no document ingestion. |
| orbdoc "Benefits AI" | Upload a guide, ask questions | Small; chat-style, not an optimiser (vendor claims). |
| ChatGPT DIY | Ad hoc | Not computed, error-prone, no spouse coordination. |

**New (medium):** a B2C tool that ingests documents and coordinates two employers' menus, with the 2026 dependent-care FSA/credit rule change modelled.

#### Magic moment (<60 seconds, no login)
1. "Try sample guide" or upload your PDF.
2. Five taps: who's covered, daycare yes/no with monthly cost, doctor visits and prescriptions (low/medium/high), any baby or surgery planned, tax bracket.
3. About 45 seconds later: "**Pick HSA Plan B, put $5,200 in the HSA, elect the $7,500 dependent-care FSA. That saves $3,140 vs last year's choices.** Worst-case year: +$900." The chart shows the cost distribution per plan.

#### The real core
- **Claude** (PDF): extracts plan design (premiums by tier, deductible embedded vs aggregate, out-of-pocket max, coinsurance, copays, employer HSA seed).
- **Deterministic engine:** scenario- or Monte-Carlo-based cost per plan; HSA, FSA and dependent-care FSA tax math (2027 brackets); FICA savings; credit comparison. Optional MEPS public data for spending distributions (adds data-prep time).
- **No bank linking, no regulated advice** (insurance education).

#### Build feasibility: **Low–Medium.** Benefits guides are semi-structured; the engine is simple; jurors may upload their own employer's guide with no privacy concern.
- **Risks:**
  1. Retention and LTV/CAC.
  2. Novelty: a shallow "benefits explainer" is plausible for other teams.
  3. Season ends in ~3 weeks, a weak "why come back tomorrow".

**Why another team is unlikely to build *this version*:** a generic "AI benefits explainer" might be built. The two-employer coordination engine and the 2026 dependent-care FSA/credit modelling are what a default build skips. **Honest: medium risk of a look-alike.**

#### Estimated scores
| Works (40%) | Sell (20%) | Who (15%) | Money (15%) | New (10%) | **Weighted** |
|---|---|---|---|---|---|
| 8 | 5 | 7.5 | 5.5 | 6 | **6.75** |

---

## 5. Score comparison and alternates

| Idea | Works | Sell | Who | Money | New | **Weighted** |
|---|---|---|---|---|---|---|
| **CliffGuard** (ACA clawback guard) | 7.5 | 7.5 | 8.5 | 6.5 | 8 | **7.55** |
| **Shortfall** (escrow decoder) | 7.5 | 5.5 | 8.5 | 6 | 8.5 | **7.13** |
| **PlanMath** (benefits elections) | 8 | 5 | 7.5 | 5.5 | 6 | **6.75** |
| *Alt:* Paycheck Detective (stub diff, error flags, W-4 fix) | 7.5 | 6.5 | 6.5 | 5.5 | 7 | 6.8 |
| *Alt:* SAVE-exit / RAP payment audit | 7.5 | 6 | 7.5 | 6.5 | 4.5 | 6.75 |

**Paycheck Detective** is a reasonable swap for #3 if the team values retention over evidence. It has a biweekly loop, and the only near-competitors are Gusto's in-app compare and Symmetry's B2B API. But I could not collect own-words evidence or check ADP before the search budget ran out. Jurors may also hesitate to upload real pay stubs.

---

## 6. Recommendation

**Bet on CliffGuard.**
1. **Fresh, verifiable rule change with no incumbent.** Uncapped repayment starts with the 2026 tax year, the first returns are filed in early 2027, and KFF notes enrollees are choosing 2027 plans "without seeing how uncapped repayment works".
2. **Perfect timing for the demo.** Open enrollment is live and the reconciliation season is 3 months away.
3. **The magic moment needs no upload.** Five fields return a five-figure answer, which suits the 60-second, no-login jury path.
4. **The core is truly computed:** federal tables, the live CMS benchmark and a deterministic optimiser. Claude handles document extraction and the explanation.
5. **Retention is natural** for variable earners: monthly income check-ins, quarterly estimated taxes, the December cliff check, then the April Fix Plan.

**Start today:** request the CMS Marketplace API key immediately, and have a human pull 3–5 real Reddit/forum quotes (r/HealthInsurance, r/freelance, r/tax) for the deck.

**Keep Shortfall as the backup.** Its novelty is the highest and its persona the sharpest, but its retention is weaker.

---

## 7. Sources

**Macro**
- Fed SHED 2025 (released May 2026): https://www.federalreserve.gov/publications/2026-economic-well-being-of-us-households-in-2025-executive-summary.htm
- Care.com 2026 child-care cost: https://www.care.com/c/how-much-does-child-care-cost
- LendingTree BNPL 2026: https://www.lendingtree.com/personal/buy-now-pay-later-loan-statistics/
- Electricity prices: https://www.utilitydive.com/news/states-taking-action-energy-affordability-issue-deepens-report/824580/ · https://247wallst.com/investing/2026/10/29/electricity-prices-rose-in-44-states-but-one-saw-an-incre
- Car insurance: https://insurify.com/car-insurance/report/ · https://www.carinsurance.com/trends-and-insights/car-insurance-cost-crisis-explained/

**ACA / CliffGuard**
- KFF, 9 things to watch for 2027 OE (fetched): https://kff.org/affordable-care-act/9-things-to-watch-for-the-2027-aca-open-enrollment-period/
- IRS OBBB provisions (removal of repayment limits): https://www.irs.gov/newsroom/one-big-beautiful-bill-provisions
- CBPP on surprise tax increases: https://www.cbpp.org/blog/marketplace-enrollees-could-face-surprise-tax-increases-next-year-thanks-to-the-republican
- KFF Health News, tax-time surprises, Apr 3 2026 (fetched): https://kffhealthnews.org/news/article/tax-tips-aca-affordable-care-act-obamacare-subsidies-income-owing/
- Instead, repayment example: https://instead.com/resources/blog/how-to-avoid-full-premium-tax-credit-repayment-in-2026
- ObamacareFacts reader question (fetched): https://obamacarefacts.com/questions/why-do-i-owe-back-subsidies-after-getting-a-job
- California couple repaying ~$13k: https://dontmesswithtaxes.com/california-couple-must-repay-almost-13000-dollars-in-obamacare-advance-premium-tax-credits/
- "A $30,000 mistake": https://www.physicianonfire.com/a-30000-mistake/
- IRS Rev. Proc. 2026-26, 2027 applicable % table (fetched and parsed): https://www.irs.gov/pub/irs-drop/rp-26-26.pdf
- Bronze/catastrophic plans HSA-eligible, Notice 2026-5: https://kpmg.com/us/en/taxnewsflash/news/2025/12/notice-2026-5-expanded-hsa-eligibility-under-obbba.html · https://hsatracker.org/are-bronze-plans-hsa-eligible/
- CMS Marketplace API: https://developer.cms.gov/marketplace-api · key request: https://developer.cms.gov/marketplace-api/key-request.html
- OE news: https://abc7news.com/story/premiums-rise-what-know-aca-coverage-open-enrollment-begins/20009427
- Competitors:
  - Stride $47M: https://www.beckershospitalreview.com/payer-issues/stride-health-secures-47m-to-bring-benefits-to-gig-workers-5-things-to-know.html
  - Instead pricing: https://instead.com/pricing · Instead funding: https://www.cbinsights.com/company/instead
  - Jupid: https://jupid.com/press/jupid-raises-840k-pre-seed-funding · https://jupid.com/aca-subsidy-calculator
  - healthinsurance.org calculator: https://www.healthinsurance.org/affordable-care-act/subsidy-calculator/
  - COBRA vs marketplace pages: https://www.moneycrashers.com/compare-cobra-marketplace/ · https://layoffcalc.pages.dev/cobra-guide/

**Escrow / Shortfall**
- Cotality via U.S. News/WTOP (fetched): https://wtop.com/news/2026/07/what-is-an-escrow-shortage-why-your-mortgage-payment-just-went-up/
- Norada (65% / $2,100 / surprise survey): https://www.noradarealestate.com/blog/mortgage-payment-jump-175-year-2-escrow/
- Scotsman Guide: https://www.scotsmanguide.com/news/rising-risks-of-spiking-escrows-keep-catching-borrowers-by-surprise/
- JustAnswer question: https://www.justanswer.com/real-estate-law/on7de-escrow-analysis-back-year-payment.html
- CNBC, new-build tax surprise: https://www.cnbc.com/2024/04/09/why-new-build-homes-can-lead-to-a-property-tax-surprise.html
- Mr. Cooper: https://mrcooper.com/help-center/escrow/new-construction-property-taxes
- Florida, Jan 2026: https://www.savingadvice.com/articles/2026/01/17/10715117_florida-homeowners-alert-why-your-january-escrow-statement-just-jumped-by-400-and-who-to-blame.html
- CFPB Supervisory Highlights 33: https://files.consumerfinance.gov/f/documents/cfpb_supervisory-highlights_issue-33_2024-04.pdf
- Fed Consumer Compliance Outlook, Reg X escrow violations: https://www.consumercomplianceoutlook.org/2024/third-issue/common-violations-regulation-x-escrows
- 12 CFR 1024.17 (fetched): https://www.law.cornell.edu/cfr/text/12/1024.17
- Ownwell funding and fees: https://www.appealdesk.com/compare/ownwell-alternative · https://www.moneycrashers.com/ownwell-review/
- Pine AI escrow blog: https://www.19pine.ai/zh-hant/blog/challenge-mortgage-escrow-overcharge

**Benefits / PlanMath**
- Bhargava et al.: https://www.nber.org/papers/w21160 · https://www.cmu.edu/dietrich/sds/docs/bhargava/BLB_BSP%202017.pdf
- Aflac WorkForces: https://www.aflac.com/docs/awr/pdf/2021-overview/2021-aflac-awr-benefits-enrollment-and-informed-consumer.pdf
- 2027 cost jump: https://www.mercer.com/en-us/about/newsroom/employers-expect-health-benefit-costs-to-jump-in-2027/ · https://www.insurancebusinessmag.com/us/news/benefits/health-benefit-costs-to-jump-8-2-in-2027-highest-since-2003-588711.aspx
- Small-firm family premiums: https://www.insurancebusinessmag.com/us/news/benefits/smallfirm-workers-now-pay-2823-more-for-family-coverage-594562.aspx
- FSA forfeitures: https://money.com/fsa-contributions-workers-forfeit-money/
- Dependent-care FSA $7,500: https://shrm.org/topics-tools/news/benefits-compensation/annual-dependent-care-fsa-limit-increase-2026 · https://www.newfront.com/blog/the-obbb-dependent-care-fsa-increase-could-backfire · https://www.creditkarma.com/tax/library/family-taxes/how-much-is-the-dependent-care-credit/
- ALEX pricing: https://www.capterra.com/p/125677/ALEX/
- Nayya comparison sheet: https://go.nayya.com/hubfs/Carrier%20Pages/%5BBroker%5D%202024%20Nayya%20Choose%20vs.%20Jellyvision%20Comparison%20(1).pdf
- PennyCalc: https://pennycalc.com/health-insurance-comparison/ · Lively: https://livelyme.com/blog/health-plan-comparison-calculator · orbdoc: https://orbdoc-website.pages.dev/products/benefits · first-person AI use: https://exploreaitogether.com/how-to-use-ai-for-health-insurance-analysis/

**Alternates and excluded pains**
- Paycheck: Symmetry compare API (fetched): https://docs.symmetry.com/ste/api-reference/symmetry-tax-logic/compare-two-paychecks-and-explain-the-differences.md · Gusto paycheck compare: https://support.gusto.com/article/260428150612093
- Student loans:
  - NPR: https://www.npr.org/2025/12/23/nx-s1-5630504/2026-federal-loans-student-changes-save-plan
  - ED: https://www.ed.gov/about/news/press-release/us-department-of-education-announces-next-steps-borrowers-enrolled-unlawful-save-plan
  - Final 30-day notice: https://thecollegeinvestor.com/90574/save-borrowers-miss-90-day-deadline-get-final-30-day-notice/
  - Repayment calculator: https://studentaid.gov/articles/repayment-calculator/
  - Tate IBR-vs-RAP: https://www.tateesq.com/calculator/ibr-vs-rap
  - Student Loan Planner $595: https://www.studentloanplanner.com/contact/
  - Chipper: https://intercom.help/chipper/en/articles/5698262-chipper-subscription
  - JPMC Institute: https://www.jpmorganchase.com/institute/all-topics/financial-health-wealth-creation/new-income-driven-repayment-plan
- Medical bills:
  - KFF/PIRG: https://pirg.org/edfund/resources/you-found-a-mistake-on-your-medical-bill/
  - KFF medical debt: https://www.healthsystemtracker.org/brief/the-burden-of-medical-debt-in-the-united-states/
  - AI startups: https://www.thestar.com.my/tech/tech-news/2026/04/09/patients-are-using-chatbots-to-fight-medical-bills-with-mixed-results
  - Goodbill: https://help.goodbill.com/en/articles/254209
  - Resolve: https://resolvemedicalbills.com/faqs/how-much-does-it-cost-to-work-with-resolve
  - Advocates: https://kffhealthnews.org/health-industry/advocate-sidebar/
- Rocket Money fees: https://www.thepennyhoarder.com/budgeting/rocket-money-review/
- Salary negotiation: https://www.ziprecruiter-research.org/new-hires-survey-2025q1 · https://www.levels.fyi/services/

---

## 8. To verify before building (open items)
1. 2026 applicable-percentage table (Rev. Proc. 2025-25; I used a top rate of 9.96% from prior knowledge) and the 2026 HHS poverty guidelines for 2027 coverage.
2. CMS Marketplace API: key turnaround, 60-day expiry (third-party claim), exact list of HealthCare.gov states for 2027, and whether a benchmark-premium endpoint is exposed.
3. Whether Stride Health or HealthSherpa offer any year-round income or reconciliation monitoring (not found, not fully ruled out).
4. Real Reddit quotes for each top idea (crawler blocked).
5. For Shortfall: current Texas/Florida homestead exemption amounts; obtain 3–4 real (redacted) escrow analyses from different servicers.
6. Child and dependent care credit phase-down thresholds after OBBBA (sources conflicted).

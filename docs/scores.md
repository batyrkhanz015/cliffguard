# Judge scores

---

## G1: idea pick (2026-11-14, ~16:00)

**What was judged:** a shortlist of 5 ideas built from `research/track-01-money.md`, `track-02-entertainment.md`, `track-03-skills.md`, `niche-hunt.md` and `new-rules-radar.md`. Facts and originality were re-checked with my own web searches and fetches. Search worked for this gate, so the budget was not exhausted.

### Score table (each criterion 1–10)

| Rank | Idea | Works 40% | Sell 20% | Who 15% | Money 15% | New 10% | **Weighted** |
|---|---|---|---|---|---|---|---|
| 1 | **CliffGuard** (ACA excess-APTC clawback + MAGI rescue) | 8 | 6.5 | 8.5 | 5.5 | 6 | **7.20** |
| 2 | **Box Score Kids** (daily printable sports paper at the kid's reading level) | 8.5 | 7 | 7 | 4.5 | 6 | **7.13** |
| 3 | **Shortfall / Mortgage Payment Autopsy** (escrow audit + PMI removal) | 7 | 5 | 8.5 | 6.5 | 8 | **6.85** |
| 4 | **PlanMath / OE simulator** (SBC upload, plan + HSA/FSA elections) | 8.5 | 4.5 | 8 | 5 | 5 | **6.75** |
| 5 | **Undersold** (your employer's H-1B LCA wages vs. your pay) | 6.5 | 5.5 | 6.5 | 5.5 | 3 | **5.80** |

The research agents scored themselves 7.1–7.7. I come in lower on almost every idea, mostly on New and Money. Places 1 and 2 are within noise, so the tie-break reasoning is under Recommendation.

---

### Fact-check: CliffGuard's load-bearing facts: **both TRUE. The idea stands.**

**(a) The cap on repaying excess APTC is removed starting with tax year 2026. TRUE.**
- IRS, "Repayment caps eliminated for excess advance payments of the premium tax credit" (page updated 07-Oct-2026): *"Beginning with tax year 2026, the taxpayer must repay the full amount of any excess advance payments (APTC)… Repayment limits for excess APTC no longer apply."* No exceptions are listed. The page attributes the change to the "Working Families Tax Cuts Act", the IRS's current name for OBBBA, P.L. 119-21. https://www.irs.gov/tax-professionals/eitc-central/repayment-caps-eliminated-for-excess-advance-payments-of-the-premium-tax-credit
- Secondary sources agree that this is OBBBA §71305 striking the §36B(f)(2)(B) limitation table, and that IRS FS-2025-10 confirms it. I did not read the enacted text on congress.gov.
- KFF (Nov 6, 2026): the first filings under the uncapped rule "will not happen until early 2027." Proposed regulations were reported published around Oct 15, 2026 (federalregister public-inspection 2026-21056). This does not change the outcome.

**(b) The enhanced credits expired, the 400% FPL cliff applies in 2026, and no later extension passed. TRUE as of mid-Nov 2026.**
- KFF, "9 Things to Watch for the 2027 ACA Open Enrollment Period" (Nov 6, 2026): *"In 2026, the enhanced premium tax credits expired."* People above 400% FPL "no longer qualify for premium tax credits." Insurers cite the expiration in their 2027 rates.
- Legislative history:
  - The Senate rejected both dueling bills 51–48 on Dec 11, 2025, short of the 60 votes needed.
  - The House passed a 3-year extension on Jan 8, 2026, and the Senate never passed it.
  - S.5619 (Sep 30, 2026) only restores PTC eligibility for lawfully present immigrants and was referred to Finance.
  - HR 6501, which would extend credits to 700% FPL, was introduced only.
- AP/ITV and HealthcareInsider coverage at the start of 2027 open enrollment (Nov 1, 2026) says the 100–400% FPL limits apply "unless Congress passes an extension, which hasn't happened."
- **Caveat:** I found nothing on Congress.gov dated after Oct 2026, so a lame-duck deal can't be ruled out. Even then, a retroactive change to TY2026 before April 2027 is very unlikely. The pitch should say "as of Nov 2026."
- **Nuance for the spec:** some state exchanges backfill subsidies, e.g. California for 165–200% FPL. v1 should cover HealthCare.gov states only, with a warning for state-based exchanges.

**(c) Getting the benchmark premium (SLCSP) without waiting days for a key. YES, with an even better route than the research proposed.**
- **CMS Exchange PUFs** (Rate PUF, Plan Attributes PUF, Service Area PUF) for **PY2026 and PY2027** are direct zip downloads on cms.gov with no registration (cms.gov/marketplace/resources/data/public-use-files). They give plan-level, age-rated premiums, so the team can compute SLCSP per rating area/county offline. The files are large, so preprocess only a few demo states.
- **Marketplace API:** it has `POST /households/slcsp` and `POST /households/eligibility/estimates`, which returns `aptc`. Keys come from a request form that needs an SMS-capable phone, no turnaround time is stated, and keys "expire every 60 days." **Treat it as a nice-to-have only.**
- **User documents:** Form 1095-A column B holds the monthly SLCSP. **But the 2026 1095-A won't exist until late January 2027**, so "upload your 1095-A" is not a flow anyone can use today. Today the user has the Marketplace eligibility notice and a plan invoice showing monthly APTC. The HealthCare.gov tax tool (healthcare.gov/tax-tool) looks up SLCSP manually; my fetch returned only the page title, so it is unverified.
- **Best v1 route, no external data:** for a full-year enrollee who took the full credit, back the benchmark out of what the user already knows: annual APTC = SLCSP − applicable% × (income estimate given to the Marketplace), so SLCSP = APTC + applicable% × estimate. Guard it with "Did you take the full credit amount?" and "Has your household changed?", and fall back to manual SLCSP entry if either answer is wrong.

**Still open at spec time:** confirm the 2026 applicable-percentage table (Rev. Proc. 2025-25; research says a 9.96% top rate, from a secondary source), the 2026 HSA and IRA limits, and the SEP-IRA limit formula (20% of net self-employment earnings).

---

### Originality: what exists (named)

| Idea | Existing products found | Verdict |
|---|---|---|
| CliffGuard | **StateCalc ACA PTC repayment calculator**: free, no account. It takes 1095-A columns A/B, APTC and actual MAGI, computes the **2026 uncapped** repayment next to the old capped one, and has what-if and PDF export. **healthinsurance.org** APTC repayment/refund calculator. NerdWallet 2026 PTC calculator. nationaltaxtools. teamzlab and taxbracketcalc pages.dev reconciliation calculators. aca-subsidy-guide.vercel.app. beancount.io SEP-IRA cliff guides. KFF calculator (prospective only). **TurboTax**: users test IRA contributions by hand in the return, and forum threads show they don't trust the results near thresholds. **Stride Health**: an income-update flow and a 2026 "repay 100%" notice; I found no proactive repayment alert or optimizer. Instead.com: B2B. HealthSherpa: enrollment only (not re-searched). | **The headline number ("you'll repay $X") is commoditized and free.** I found no product that combines (1) a ranked IRA/HSA/SEP/income-timing optimizer with deadlines, (2) intake of the eligibility notice, and (3) monthly monitoring against the 400% line. The gap is real but narrower than the research claimed. |
| Box Score Kids | **My Sports Report** (free daily printable kids' sports report by email; team-tailored; "Kids" theme; a dad founder whose friends asked for copies; no reading levels). **The Playbook** (personalized AI sports broadsheet, email). **ReadHero** (personalized comic "at their exact Lexile level"). **OnWord Stories** (AI stories at each K-5 student's interest and reading level, sports category, school-facing). **News-O-Matic** (Lexile-leveled daily kids' news). Smallball, Bedtime Baseball, SI Kids. | The combination is new (real box score, measured reading level, math computed from stats, printed). Each half exists, and the closest rival is free. |
| Shortfall | Escrow audit: **no consumer tool found**. Only servicer software (VisiEscrow audit module, The Mortgage Office, LoanPro, Bryt), servicer explainers, and one attorney page on escrow errors. PMI removal: **many free calculators** (SuperMoney, amcalc, thetruthaboutmortgage, estatepass, 101-egh.pages.dev, gomortgage letter template, Orchard and HomeLight guides). | Escrow audit is the most original item on the shortlist. The PMI half is commoditized. |
| PlanMath | Flimp Decisions (spouse SBC upload, B2B). ALEX/Jellyvision, Nayya and Picwell (B2B). Simplify Healthcare (broker). PennyCalc and Lively (manual entry). "Paste your SBC into ChatGPT" guides. The Academy of Actuaries notes consumers already ask AI tools to pick plans. | No B2C SBC-upload simulator found, but "health plan picker" is a likely duplicate from other teams, and incumbents give it away through employers. |
| Undersold | **Levels.fyi /h1b** (official DOL data, search by company, title and location). **Taro** (jointaro.com/h1bdata). h1bdata.info, MyVisaJobs, H1BMetrics, h1bdata.net, americabynumbers, h1bsignal. Apify LCA scrapers and MCP bundles. dev.to "H1B salary research toolkit 2026". | **Fails guardrail #5 in practice.** The "your dot on the strip chart" overlay is a thin layer on a crowded lookup market, and the idea sits next to the excluded negotiation coach. |

**A red flag on CliffGuard that the team should not ignore:** three of our agents found it independently. Other teams that run the same tools over 2025–26 rule changes may converge on it too. Our depth (optimizer, document intake, monitoring) has to be visible in the first 60 seconds, or we look like one of the many vibe-coded cliff calculators.

---

### Feasibility: about 6 hours to a working v1 (Next.js + Claude, no login, value in under 60 s)

| Idea | v1 in ~6h? | Riskiest dependency |
|---|---|---|
| CliffGuard | **Yes.** The engine needs small JSON tables (FPL, applicable %, limits). Five fields plus a preset persona, cliff chart and slider, optimizer, and optional Claude extraction of the eligibility notice. No external API is needed if the benchmark is derived from APTC (see (c)). | **Correctness of the tax rules.** Areas where errors hide: PTC MAGI vs. AGI (untaxed Social Security, tax-exempt interest, foreign income); the SEP limit at 20% of net self-employment earnings; HSA only on an HSA-qualified plan, pro-rated; the self-employed health insurance deduction loop with PTC; the household-size and FPL year (2025 guidelines for 2026 coverage). One wrong number in front of a juror who knows taxes sinks the 40% criterion. |
| Box Score Kids | **Yes, easiest of the five.** The ESPN, NHL and Sleeper endpoints were verified live by research. Readability and math are computed in code. Print CSS. | **ESPN's undocumented site API**: no SLA, could rate-limit or block Vercel egress, and the schema can change. Cache results and fall back to NHL/MLB official APIs. The NFL demo freshness on Sunday morning, Nov 15, is fine with NBA, NHL and college games. |
| Shortfall | **Borderline.** Extraction, the Reg X engine and the waterfall fit in 6h. PMI with FHFA HPI adds about 1.5h. | **Claude extraction across varied servicer escrow statements, with no real juror document available.** The demo runs on a synthetic sample with a planted error, and jurors will smell that. Most real shortages are legitimate. |
| PlanMath | **Yes.** The SBC is a federal template, so extraction is reliable, and jurors can upload their own. | **Premiums are not in the SBC** (they are in enrollment materials), plus embedded vs. aggregate family deductible logic. Most employer open-enrollment windows close within about 3 weeks of demo day. |
| Undersold | **Tight / no.** 2–3h of LCA ETL and entity matching before any UI. | **LCA ETL plus employer and title matching**, and coverage limited to H-1B sponsors, which overlaps exactly with Levels.fyi's audience. |

---

### Objections per criterion: #1 pick, CliffGuard

- **Works (8):** "Tax software already computes Form 8962. If your number differs from TurboTax by $1, I don't trust you." The math is deterministic, but correctness at the 400% edge has to be shown with unit-tested fixtures that reproduce published worked examples (KFF's 407% family of three, Instead's 403% example). The 1095-A upload is useless until late Jan 2027, so the "AI reads your document" moment has to use the eligibility notice instead.
- **Sell (6.5):** "StateCalc gives me this number free in 30 seconds with no account. What am I paying $49 for?" The answer has to be the rescue: exact amounts, accounts and deadlines, plus a "report income change now" alert. "Monthly check-ins" for a once-a-year tax event will strike jurors as manufactured retention. For freelancers with lumpy invoices it is real, but the build has to show it, not just claim it.
- **Who (8.5):** sharp persona with a dated trigger (Apr 15, 2027: the first uncapped reconciliation). Own-words evidence comes from KFF Health News quotes, an ObamacareFacts reader and TurboTax forums; Reddit is still missing. "None of us on the jury buys Marketplace coverage" is the relatability gap. A preset persona is required.
- **Money (5.5):** **the market is shrinking.** CBO projects Marketplace enrollment falling from 22.4M (2025) to **13.1M in 2027**, and 2026 effectuated enrollment was already down 12% to 19.2M (KFF). The highest-income enrollees, the ones most able to pay, are exactly those dropping out above the cliff. Lower-income people near the line have the least willingness to pay. $100M requires expanding into MAGI planning for all 1099 households, which is closer to Keeper and other tax apps. The demand is seasonal (Dec, Jan–Apr). LTV/CAC around 4x is asserted with no evidence.
- **New (6):** the calculator is a commodity: there are at least 8 free reconciliation or cliff calculators, several already updated for 2026 uncapped rules. The idea also converged across three of our own agents. Only the optimizer, intake and monitoring bundle is new.

### Short objections for the rest
- **Box Score Kids:** "The payer is a parent, but the pain is a kid's reading habit. Is this the 'fundamental pain for adults 25–45' the brief asks for?" It reads as EdTech, adjacent to the excluded AI tutor and bedtime stories. My Sports Report is free and already has the founder story. $100M is not credible on sports alone, and LTV/CAC is 2–3x at best.
- **Shortfall:** retention is annual. "Error found" is rare in real life, so the demo is staged. Jurors won't have an escrow letter. PMI calculators are free everywhere.
- **PlanMath:** a once-a-year decision with an employer-funded free incumbent (ALEX, Nayya, Flimp). Likely duplicated by other teams. The season ends in weeks.
- **Undersold:** a Levels.fyi /h1b clone with a PDF on top. Next to the excluded negotiation coach. ETL risk.

---

### Top 3 changes for CliffGuard, ranked by score gain per hour

1. **Remove the CMS dependency on day one (about 0h net; saves 1–2h). Gain about +0.3 weighted.** Derive SLCSP from the user's own monthly APTC and Marketplace income estimate, with guards ("took full credit?", "household unchanged?"). Fall back to manual SLCSP entry. Add a CMS Rate PUF lookup for 2–3 demo states only if time is left. Request the API key anyway, but never block on it.
2. **Make the 60-second moment the rescue, not the bill (about 1h). Gain about +0.4 weighted (New +1, Sell +0.5).** The first result reads, for example: "Put $2,900 in a traditional IRA or HSA by Apr 15, 2027 → repayment falls from $10,644 to about $1,800," with a draggable slider and a visible 400% wall. Add a December-only lever, "push $X of invoices into January," because it is actionable *this week*. Show one honest line: "Free calculators stop at the bill."
3. **Make retention real in the build, not the deck (about 2h). Gain about +0.3 weighted (Sell +1).** Save the household under an anonymous session in KV. Add a monthly income check-in that re-projects the bill. Add a dated deadline calendar (Dec 31 income timing; Jan 15 open-enrollment close and Q4 estimated tax; Apr 15 IRA/HSA/SEP) with an email reminder opt-in. Alert "Report this change on HealthCare.gov now" when projected MAGI crosses 400% or 250% FPL.

*(Next after those: about 1h of unit-test fixtures that reproduce the KFF and Instead worked examples. This protects the 40% "Works" score when jurors read the repo.)*

---

### Recommendation
**Pick CliffGuard, on the condition that the team builds it as a rescue plan plus monitor, not as a calculator.** It narrowly beats Box Score Kids on the numbers (7.20 vs 7.13). The tie-break goes to CliffGuard for four reasons:
- The brief asks for a fundamental adult pain people will pay for, and a $2k–$10k+ tax bill with an Apr 15, 2027 deadline is exactly that.
- The "why now" is verified at the source: IRS, Oct 2026; KFF, Nov 2026.
- The core is deterministic, so it is easy to prove "not faked."
- Its weaknesses (free calculators, a shrinking market) can be answered in the build and the deck. Box Score Kids' weaknesses (a free rival, a soft adult pain, implausible $100M) cannot.

**Runner-up: Box Score Kids.** It has the lowest build risk and the best daily retention. Pick it if the humans can't stomach the tax-correctness risk. **Most-original alternate: Shortfall**, if the team values novelty over retention.

**Checks I could not complete:**
- Reddit own-words evidence (not attempted; the research agents say it is blocked).
- The HealthCare.gov tax-tool page content (the fetch returned only the title).
- The congress.gov text of §71305.
- A dedicated HealthSherpa feature search.
- Any Congress.gov action after Oct 2026.

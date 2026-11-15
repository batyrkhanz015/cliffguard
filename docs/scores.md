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

---

## G2: spec review (2026-11-14, ~19:50)

**What was judged:** `docs/spec.md` (G2 draft, 834 lines), scored as the product it promises. Every number in §A.2 and §B was checked against `research/tax-tables-2026.md` (the research file wins), and every fixture was recomputed by hand. G1 objections were checked one by one. Originality was re-searched today, and three facts were re-verified at the source: KFF's worked example, what an eligibility notice shows, and the CMS list of state-based marketplaces.

### Score table (each criterion 1–10)

| Criterion | Weight | G1 | **G2** | Why it moved |
|---|---|---|---|---|
| Works | 40% | 8 | **8.5** | Form 8962 method; every fixture I recomputed matches; intake moved to a document users have today (the eligibility notice); the magic moment uses no LLM; server-side redaction, grounding validator, kill switch. Held back by scope risk and the rule gaps below |
| Sell | 20% | 6.5 | **7.0** | Leads with the gig decision and the rescue; Keep my cash; decoy pricing; a real `.ics` and real check-ins. The paywall leaks (see objections) |
| Who | 15% | 8.5 | **8.5** | Dani plus a dated 47-day trigger is sharp. Still no user-voice quotes beyond press (D8 open) |
| Money | 15% | 5.5 | **6.0** | Honest ACA ceiling and a sensitivity table. But the $100M rests 80% on expansion, the table contradicts itself, and the LTV arithmetic is off |
| New | 10% | 6 | **6.5** | The gig "loss zone" plus the ordered optimizer is distinctive. A new free rival (Tax47) now pitches "does an HSA pull you under 400%" |
| **Weighted** | | **7.20** | **7.63** | |

**Risk-adjusted:** if only M1–M9 ship, rough, at 00:30, Works drops to about 7.5 and the total to **about 7.2**, i.e. no gain over G1. The spec is good enough; the clock is the risk.

### 1. Table consistency (the research file wins)

I checked every value against the research file. **These match:**
- FPL for the 48 states + DC and for AK
- every 2026 cliff
- all six applicable-% bands
- `repaymentCaps: null`
- standard deductions
- all three bracket schedules (single, MFJ, HOH)
- SE factor 0.9235 and wage base $184,500
- HSA $4,400 / $8,750
- IRA $7,500 and all three phase-out ranges
- SEP 20% and $72k
- every date in `dates`
- the 2027 contiguous FPL ($15,960 + $5,680; cliff $132,000)
- the TY2025 repayment caps

**Mismatches and gaps:**

| # | Spec location | Spec says | Research says | Impact |
|---|---|---|---|---|
| T1 | §A.2 `fpl`, **line 387** | Hawaii +**$6,325** per extra person | **+$6,330** (§1a line 43; JSON line 86) | HI family of 4: FPL $36,965 vs **$36,980**; cliff $147,860 vs **$147,920**. A HI household at $147,861–$147,920 is wrongly told it's over the cliff and owes the full APTC |
| T2 | §A.2 `nextYear.fpl`, **line 401** | 48 states + DC only | AK **$19,950 + $7,100**, HI **$18,360 + $6,530** (§1c lines 67–78) | The Jan 15 card shows the wrong 2027 cliff in AK/HI (AK family of 4: $165,000, not $132,000) |
| T3 | §B **F7, line 640** | "actual $105,000 (**407%**, 8.5%)" | The truncation rule (research §2c line 139; spec C6) gives floor(105,000 × 100 / 25,820) = **406** | Dollars unaffected ($745 still holds: ≥400 → 8.5%), but a test asserting `fplPercent === 407` fails. KFF rounds; we truncate. Say so in the deck |
| T4 | §A.2 `sep`, **line 399** | 20%, cap $72,000 | Also a **compensation cap of $360,000** (§8 line 317) | No fixture impact; the rule set should carry it |
| T5 | §A.2 `hsa` line 397, lever table **line 510**, edge table line 617 | `catastrophic` treated like bronze in a PTC household | **Catastrophic plans are not QHPs for the PTC** (§5 line 254, gotcha 12) | Needs a `CATASTROPHIC_NO_PTC` flag: APTC should be 0, and reconciliation doesn't apply |
| T6 | §A.2 status column, lines 387–399 | "confirm" on AK/HI, bands, single/HOH brackets, std deduction, wage base, IRA single, SEP | All **[primary]** in research §1–§10 | Update the labels and cite the research file in the code comments |
| T7 | §A.2 `sbmStates`, line 402 | "Assumption, confirm in tax-tables-2026" | Not in the research file | **I verified it:** CMS lists 21 full SBEs for PY2026, and the spec's 21 match. **Oregon becomes a full SBM for PY2027**, which matters for the 2027 loop ([CMS](https://www.cms.gov/cciio/resources/fact-sheets-and-faqs/state-marketplaces)) |
| T8 | §B **F11, line 644** | Self-computed vectors only | Research §2c lines 144–150 lists **IRS Table 2 vectors** (136→0.0333, 142→0.0370, 160→0.0467, 202→0.0667, 229→0.0767, 263→0.0884, 288→0.0960, 299→0.0993), and §5 item 10 (lines 246–250) has **IRS Allocation Situation 4** ($71,910, family of 2 → excess **$1,529**) | Not a mismatch, but the best trust asset is missing. Add both as fixtures. I checked that the spec's bp formula reproduces all 8 vectors and the $1,529 |

Omitted, no fixture impact: Additional Medicare Tax (0.9% over $250k MFJ), and the income-based-SEP PTC disallowance (§71304, research §5). Add both to the flags or the cut list.

**Fixture recomputation (by hand, against research values):**
- **These match:** F1, F2, F3, F3c, F4, F5, F6, F7 (dollars), F9, F10, F11, F13, all ±$1.
- **F3b:** the upper bound of the loss zone computes to $10,232 vs the spec's $10,233, inside the ±$5 tolerance.
- **KFF inputs verified at the source:** estimate $100k, actual $105k, APTC $34,463, ages 52/52/19 ([KFF](https://www.kff.org/affordable-care-act/marketplace-enrollees-with-unpredictable-incomes-could-face-bigger-penalties-under-house-reconciliation-bill-provision/)). So F7 is a real reproduction, not a circular one.

**Rule and math errors that are not table issues:**
- **R1 (§A.4 line 468):** `per1000 = 1000 × figure` is right only in the flat 300–400% band. In the sliding bands, the slope term is ignored. At 275% FPL for a family of 4, the real cost is about **$176 per $1,000**, not $92. Compute it as `diagnose(MAGI + 1000) − diagnose(MAGI)`.
- **R2 (§C S4, line 661):** the copy "Each $1,000 more costs you about **$100** of credit" is a hardcoded number, which is exactly the faking pattern §4 forbids. Fill it from the engine.
- **R3:** the variable earner who follows our own "Report a change" card ends up with **two APTC amounts in the year**. The model has one `aptcMonthly × months`, so the product's own advice breaks its own model at the next check-in. Add the guard "Changed your Marketplace income this year?" and up to 2 APTC segments. Keep deriving SLCSP from the original notice.
- **R4 (§8 line 178):** the LTV formula as written gives **$136.6**, not $134 (LTV/CAC 3.9x). It is in our favor, but a juror who checks it finds an error.
- **R5 (§8 lines 182 vs 187):** the ACA row claims **$20M ("plus state exchanges")** against a stated **$12–17M ceiling**, yet the 19.2M base already includes the SBMs. That's an internal contradiction.

### 2. Feasibility

**Verdict: M1–M16 is not buildable by 00:30, and "M1–M9 by 22:00" (§10) is impossible.**
- The must-haves sum to **8.85 builder-hours**, before code review after every task, the sample-notice PDF (a hidden task of about 0.5h), env setup and QA.
- M1 (the engine, 1.75h, optimistic) blocks M5, M6, M7 and M9.
- Even with two builders starting around 20:15, the critical path is about 1.75 + 2.0 + review and deploy ≈ **4.5h → about 00:45 for M1–M9 alone**.

**Cuts, now:**
1. **M15 Q&A (tool use) → move to the nice-to-haves.** The spec already marks it first to cut, so cut it now, not at 23:30.
2. **M12 → template first.** `explainTemplate.ts` is required anyway as the fallback. Add Claude and the grounding validator only after 00:30.
3. **M10 extraction plus the sample notice → after 00:30.** It's the "AI reads your document" signal, but no part of the magic moment needs it.
4. **Engine:**
   - Drop `taxLossHarvest`. It is $0 in every fixture, and it carries wash-sale logic and securities-advice exposure.
   - Replace the IRA/SEP rerun and spousal-IRA joint-compensation logic with one conservative rule: an adult with SEP in the plan gets the "covered" phase-out.
   - Build `TY2025_ENHANCED` (F6b/F7) after G3. It's pitch evidence, not on the jury path.
5. **M11 lite:** check-in, `.ics` and the Jan 15 card. No sparkline or history chart.
6. **No nice-to-haves (N1–N10) before G4.**

**Sequence:**
- **Insurance submit, 22:00–22:30:** M1-core (F1, F2, F3, F3b, F4, F11 plus the IRS vectors) + M2 + M3 + M5 + M6 + M7 preview, deployed. Dani → result → gig → plan preview, with no paywall.
- **23:30:** M8 + M9 (Stripe, unlock, export).
- **00:30:** M13 + M14 + M11-lite + M16.
- **After 00:30, before 02:00:** M10, M12-Claude.
- **Batch code review** for small UI tasks.

### 3. Fakes and trust risks a repo-reading juror will hit

1. **R2 above:** a hardcoded "$100" in UI copy.
2. **Every pitch number sits in `__tests__/fixtures.ts`.** That's legitimate, but a juror who greps `8548` lands there first. The README should say: "These are test expectations. The UI computes them live; see `src/samples/dani.ts`, which holds inputs only."
3. **The sample eligibility notice is a fabricated document.**
   - Label it "Fictional sample" inside the PDF and the UI.
   - Commit how it was generated.
   - Never cache its extraction.
   - Real notices show "Premium tax credit **available**: $X/month" and "Estimated income used: $Y/year" ([sample notices](https://www.carewellseiu503.org/wp-content/uploads/securepdfs/Edited-8.22.23-OE-single-QHP-w-savings.English-508.pdf)). That is the *maximum* credit, so `tookFullCredit` must always be asked, never inferred.
4. **The "$1 vs TurboTax" claim holds only with a real benchmark.** A derived SLCSP can be off by a few dollars against the 1095-A column B because of Marketplace monthly rounding. Say so in the "How we got this" panel.

### 4. Legal and compliance wording

- **"Bill $3,000 of this month's *retainer* in January"** (§4 line 90 and §12 line 291). A retainer is typically money due or available now, so this wording contradicts our own constructive-receipt warning (line 531). Use "invoice the $3,000 of work you haven't billed yet in January".
- **"Education, not tax advice" next to a $79 "exact amounts, step-by-step instructions"** is a weak shield that a juror will call out. Reframe it as "a personalized estimate and options to review with your preparer". "The legal way to say yes" (line 291) becomes "rule-based options".
- **Securities levers.** Personalized "harvest this loss / delay this sale" advice for a fee edges into investment-adviser territory. Cutting `taxLossHarvest` removes most of that exposure.
- **HSA under "Keep my cash".** Non-medical withdrawals are taxed plus 20%. Label it "medical-use money", not cash.
- **Marketplace understatement: well handled.**
  - `reportChange` uses MAGI before the plan.
  - F13 sets the floor.
  - The Jan 15 card adds the deferred income.
  - The system prompt refuses.

  One cheap addition: the Jan 15 card should also suggest the IRS-endorsed safe option, "take less APTC in advance" (research §13).

### 5. Pitch risks

- **The $1,321 / −$1,668 figures are correct under the spec's assumptions; I recomputed both.** Weakness: they ignore **QBI**, which is a plain 20% deduction for Dani, far below the threshold.
  - With QBI, the gig figure becomes about **$1,589 kept**, the $8,000 loss about **−$1,490**, and the loss zone about **$7,064–$9,935**.
  - A tax-savvy juror will spot the omission in the most-quoted number.
  - Either add the below-threshold QBI (about 0.3h) or say "about $1,500 poorer".
- **"$8,548 kept" counts $3,000 deferred into 2027 and $1,130 placed in an HSA.** The 2027 tax and 2027 MAGI on the deferral are assumed away. The UI's "of which…" line covers this, and the pitch must say it out loud.
- **The $100M path is not credible enough for 15%.** Its strength is the honest $12–17M ceiling for the ACA wedge. Its weaknesses:
  - (a) It contradicts itself (R5).
  - (b) $59M (59%) comes from "Income Guard", which cites cliffs that **don't bind at $60–160k**: the CTC phase-out starts at $400k MFJ, and the QBI thresholds are about $400k MFJ. Jurors who know taxes will notice.
  - (c) "7M seats × $3" has no basis.
  - (d) The core TAM counts every swinging enrollee, not those near the line.
  - (e) **Policy risk is waved away.** Research §0 says the Senate reportedly flipped, and the House already passed an extension in Jan 2026. The honest answer: uncapped repayment hits **every** APTC household at **every** income, and it stays unless that repeal is reversed too.

### Objections per criterion (strongest juror line)

- **Works (8.5):** "This is 16 must-haves for a 24h team; I'll get a half-wired paywall and a 404 on check-in." Also: "Your result screen holds 2 charts, 2 sliders, 4 cards and an accordion at 375 px, and I don't know what 'applicable figure' means." Keep the first screen to 3 numbers, the wall and one CTA, and put everything else below the fold.
- **Sell (7.0):** "What does $79 unlock? Invoice timing and purchases are amounts **I typed in myself**, and your free slider shows exactly how much MAGI to cut, which gives away the HSA number. Your paywall locks my own inputs." Sell the **execution kit** instead (dated steps, proofs, preparer export with the 8962 preview) plus monitoring, and say so on the paywall.
- **Who (8.5):** "Every quote is from a journalist's article, not from a user asking for this tool, and none of us on the jury buys Marketplace coverage." D8, the Reddit quotes, is still open.
- **Money (6.0):** "Your own table says the core tops out at $17M, then books $20M from it. The other $80M is a tax app competing with Keeper, FlyFin, TurboTax SE and Found, built around cliffs your persona never reaches. And one bill in the new Congress removes your 2027 renewal reason."
- **New (6.5):**
  - "Tax47 is free, needs no sign-up, and already says 'test whether an HSA contribution pulls you under 400% FPL'."
  - "Instead has been blogging about this exact cliff since Feb 2026, and beancount.io has SEP-IRA cliff guides."
  - "Three of your own agents found this idea, so other teams will too."
  - Rebuttal: no product found does the gig decision, the loss zone, the ordered optimizer with Keep my cash, notice intake and monitoring together.

**Originality, searched today:**
- Named in G1: StateCalc, healthinsurance.org, NerdWallet, KFF, nationaltaxtools, aca-subsidy-guide.vercel.app, beancount.io (SEP and SEHI cliff guides), thefinancebuff, Stride Health (an income-update flow and a "repay full excess" notice; no optimizer or alerts found).
- New since G1:
  - **Tax47** (free; HSA-under-400% testing): [tax47.app](https://tax47.app/blog/aca-premium-tax-credit-2026/)
  - **ustax.tools** (a PTC calculator plus a "MAGI cliffs by program" page, which overlaps the Income Guard pitch)
  - **Instead** blog (Feb 2026) on the 2026 cliff
  - sum.money, selfemployed.com and Gerald Wallet guides

### Top 3 changes, ranked by score gain per hour

1. **Cut and resequence now (about 0.25h of orchestrator time, 0 builder-hours). Protects about +0.4 weighted (Works) against a broken G3.**
   - Move M15 to the nice-to-haves.
   - M12 template-first.
   - M10 after 00:30.
   - Drop `taxLossHarvest`, the IRA/SEP rerun and the sparkline.
   - Insurance submit = magic moment only, by 22:30 (§2).
2. **Fix T1–T5, R1–R3 and add the IRS primary fixtures inside M1 (about 0.5h builder). +0.2 weighted (Works +0.5).**
   - Covers the HI $6,330, the AK/HI 2027 table, F7 → 406, SEP $360k, `CATASTROPHIC_NO_PTC`, numeric `per1000`, the hardcoded "$100" filled from the engine, and the APTC-change guard.
   - Add IRS Table 2 vectors plus Allocation Situation 4 ($1,529).
   - The README can then say "reproduces the IRS's own 2026 Form 8962 example", the strongest trust line available.
3. **Rewrite §8 (about 0.5h strategist/pitch-writer, 0 builder-hours). +0.1–0.15 weighted (Money +0.75–1).**
   - Remove the $20M-vs-ceiling contradiction and fix LTV to $137.
   - Size the core on the near-cliff band and on uncapped repayment at every income.
   - Replace the non-binding cliffs with ones that bind at $60–160k (AGI-based student-loan payments under RAP/IDR, Roth limits for singles, kids' Medicaid/CHIP at lower bands).
   - Give B2B2C one named partner type with per-seat logic.
   - State the policy-risk answer.

**Next, in order:**
- (4) Below-threshold QBI in `tax.ts` (0.3h), or soften the pitch to "about $1,500".
- (5) Copy fixes: "retainer", "instructions", HSA labelled "medical-use", and "5 questions" → "5 steps" (the form has more than 20 fields). About 0.25h.
- (6) Paywall copy that sells the kit plus monitoring (0.25h).
- (7) D8 Reddit quotes (a human, 0.5h; Who +0.5).

**Checks I could not complete:**
- Reddit evidence.
- The ustax.tools page (403).
- Whether OBBBA changed QBI thresholds for 2026 (not in the research file; irrelevant for Dani).
- Congressional action after Nov 5, 2026.


---

## G3 — integrated v1 on localhost (2026-11-15, early morning)

**What was judged:** branch v1 on localhost, via docs/qa.md (G3 walk), README, spec and code signals. src has 1 `any`-pattern hit (a test file) and no TODO/FIXME. 547 tests were reported passing. I did not run the live product myself. There is **no production URL, no deck, and no screenshots** (docs/screenshots and pitch/ are empty, while the README links 6 images that do not exist).

### Score table

| Criterion | Weight | G2 | **G3** |
|---|---|---|---|
| Works | 40% | 8.5 (spec) | **7.0** |
| Sell | 20% | 7.0 | **7.0** |
| Who | 15% | 8.5 | **7.5** |
| Money | 15% | 6.0 | **5.5** |
| New | 10% | 6.5 | **6.5** |
| **Weighted** | | 7.63 | **6.88** |

G2 scored the spec as promised. G3 scores what is submittable today. The 7.0 for Works assumes a production deploy. If no production URL exists at submit, Works is capped near 2 and the total drops to about 4.7.

### Evidence and objections per criterion

- **Works (7.0).**
  - Pro: the jury path ran end to end on localhost with figures matching the spec fixtures (MAGI $122,036; $1,321 vs $8,548; loss zone $7,064 to $10,232). Validation, delete-my-data, phone width and the return banner work. The engine is deterministic and heavily tested, and plan amounts are redacted server-side.
  - Con: **not in production**, and the jury cannot use localhost. A Major bug (duplicate keys and a doubled Explain panel) hits exactly the "paid feature unlocks" moment. Stripe was replaced by a free demo unlock, so checkout is never shown and the 4242 hint is missing. Without a live Claude key the AI is a labelled template, which a juror reads as "no AI". The gig headline excludes QBI (labelled "rough"). Delete has no confirm, tap targets are small, and the README screenshot links are broken.
- **Sell (7.0).**
  - Pro: "should I take this gig" with a red loss zone is sharper than a calculator. Check-in, .ics and the Jan 15 estimate are real return hooks.
  - Con: a free unlock beside a $79 price means the juror never feels what they would pay for. The paywall still gates numbers derived from the user's own inputs. Monthly check-ins for a once-a-year tax event can look manufactured.
- **Who (7.5).** Dani, the dated trigger and the IRS/KFF/Morkel reproductions are strong. There are still **zero user-voice quotes** (Reddit is issue #2), and no juror buys Marketplace coverage. Down from 8.5 because the gap is still open at the end of the clock.
- **Money (5.5).** The honest $12-17M ACA ceiling sits in a shrinking market (22.4M enrollees to a CBO-projected 13.1M). The $100M rests on expansion that is not built. I did not verify that the G2 fixes R4 (LTV about $137) and R5 (the $20M vs ceiling contradiction) landed in spec section 8. Policy-reversal risk is only partly answered, and no CAC channel is proven.
- **New (6.5).** Free rivals: StateCalc (uncapped 2026), Tax47 (HSA under 400%), healthinsurance.org, NerdWallet, KFF, Instead blog, beancount.io. We differ in the gig decision, the loss zone, the ordered optimizer and the notice intake. That is distinct, but a juror can still say "a calculator with a plan page".

### G2 objections: answered?

- Cuts and sequencing (Q&A, extraction deferral): yes.
- Number fixes (R1, R2, T1-T5, IRS vectors): the README cites the IRS truncation and applicable-figure tests, so they appear followed. I did not re-verify each.
- QBI: **not fixed**, only labelled.
- Money rewrite (R4, R5): unverified.
- Retention built into the product: yes.
- Reddit quotes: **not answered**.

### Top 3 fixes, ranked by score gain per hour

1. **Deploy to production and walk the jury path on the live URL (about 0.75h, needs captain approval). Impact: up to +2.5 weighted, because it lifts the cap on Works.**
   - Set the Upstash vars, DEMO_UNLOCK_ENABLED=true and ANTHROPIC_API_KEY. Test at phone width, plus live notice extraction and Explain.
   - A live key turns the template explanation into real AI (Works about +0.3).
   - Verify first that sessions persist: the in-memory fallback vanishes between serverless invocations.
2. **Fix the Major bug and the quick polish (about 0.5h; the polish builder is on it). Impact: about +0.15 weighted.**
   - Dedupe the doubled panel after unlock. Add a confirm on Delete, 44px tap targets, a reason on disabled lever buttons, and stop the duplicate baseline row.
   - Put a visible "demo: no card needed; test card would be 4242 4242 4242 4242" hint beside the unlock, or restore Stripe test mode only if it takes under 1h.
3. **Evidence, screenshots and the deck (about 1.5h, humans in parallel). Impact: Who +1, Money +0.5, about +0.2 weighted, and the deck is a mandatory submission item.**
   - A human pastes 3-5 real Reddit/forum quotes (issue #2) into the deck and README.
   - Capture real screenshots (the README has 6 dead links) and write the 10-slide deck from spec sections 3-9 using the honest TAM.
   - Add below-threshold QBI to the gig estimate (0.3h), or say "about $1,500 poorer".

### What would embarrass us in front of the jury

- No deck or no live URL at the deadline, or a README that says "Live app: TBD" with broken images.
- "Unlock Year demo, free" next to $79, with no checkout, read as "payments don't work".
- "CALCULATION-BASED EXPLANATION" with no live Claude, read as "no AI".
- The doubled panel and console error right after the unlock moment.
- A tax-savvy juror finding the QBI omission in the most-quoted number.
- Sessions lost on serverless if Upstash is not configured.

# G4 pre-submit score: CliffGuard (2026-11-15)

Judged: live landing HTML (WebFetch), docs/qa.md G4 section as reported, earlier fact-checks in docs/scores.md. I did not re-walk the full flow in a browser.

| Criterion | Weight | Score | Evidence |
|---|---|---|---|
| Works | 40% | 7.0 | Live on Vercel and Upstash, QA steps 1-13 pass including phone width, grounded explanation in 7 s. But the unlock is a no-payment demo, so the jury path (Stripe test checkout with a 4242 hint) is not shown, and two majors were still open. |
| Sell | 20% | 6.5 | Clear promise ("Take the gig. Keep your health subsidy.") and a monthly check-in as the reason to return. The landing page states no price, so it is unclear what is paid for. |
| Who | 15% | 7.5 | Sharp persona (freelancer on HealthCare.gov facing the 2026 uncapped repayment and 400% cliff) with a Dec 31 trigger. Slide 3 relies on KFF and ObamacareFacts quotes, not people in their own words. |
| Money | 15% | 5.5 | The niche is narrow and seasonal, and no price or CAC channel is visible on the page. The headline number is commoditized (StateCalc, healthinsurance.org, NerdWallet). |
| New | 10% | 6.5 | Nobody combines a ranked move optimizer, notice intake and monthly monitoring. But the core number is free elsewhere, and TurboTax and Stride Health sit close. |

**Weighted total: 6.70 / 10** (G3 was 6.88; the gain from deploying is offset by the missing Stripe step and the thin money case).

## Did the G3 fixes land?
- Deploy and live walk: done.
- Major bugs: two still being fixed (invoice-timing move missing, unexplained $0 change on a check-in).
- Evidence, screenshots and deck: partly. The deck is still markdown with [TEAM NAMES] and [ASK] placeholders, and there are no real user quotes.

## Top 3 fixes for the next 45 minutes, ranked by gain per minute
1. **Put a price and a paywall story on the landing page and in the deck (about 10 min, +0.3 to +0.4).** Add one line such as "Free: your number. $X/yr: moves and monthly check-ins". Add the unit economics slide with a named channel (for example r/freelance, Gig-worker Facebook groups, SEO on "ACA subsidy cliff 2026"). This fixes Sell and Money together.
2. **Make the demo unlock look like checkout (about 15 min, +0.3).** Show a fake-labeled paywall screen with the test card hint and "demo mode, no charge" text, so the jury path is visibly complete. Say plainly in the deck that Stripe was deferred.
3. **Finish the deck: fill the placeholders, export the PDF, and check the repo is public (about 20 min, +0.2 to +0.3, and avoids disqualification).** The deck must be a PDF of 10 slides or fewer, the repo must be public with no login, and the README link must work. Replace the sourced quotes with a verbatim-quote slide only if a quick search turns real ones up.

## What would embarrass us on stage
- A juror asks "where do I pay?" and the answer is "we skipped it".
- A juror opens the repo and gets a 404 because it is still private.
- [TEAM NAMES] or [ASK] left in the PDF.
- The two majors reappearing live, the $0 change in particular.
- The landing page's "Delete my data" shown without a visible link.
- A juror pastes numbers into StateCalc, sees the same repayment figure, and asks what is new. Have a one-sentence answer: the optimizer, the notice intake and the monitoring.
- "Education, not tax advice" with no pointer to a tax professional.

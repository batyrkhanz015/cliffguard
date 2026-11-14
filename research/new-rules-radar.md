# New-Rules Radar: 2025–2026 US rule changes that create new pains for adults aged 25–45

*Prepared 2026-11-14 for a 24-hour hackathon. Research only, no code.*

---

## 0. Method and limitations (read first)

- Sources: about 60 web searches plus direct fetches of primary or near-primary pages (IRS, CMS, KFF, CRS, ASPE/HHS, TSA, Treasury figures as reported by the press). Every claim links to its source.
- **Reddit cannot be reached**: our tools are blocked from crawling it. Google Trends also cannot be queried. Evidence of confusion therefore comes from press coverage, the TurboTax community forums, filing-season statistics, and how many SEO calculator sites have appeared for each topic. That last signal is strong: dozens of `*.pages.dev` and `*.vercel.app` calculators exist for RAP, ACA subsidies, overtime and Trump Accounts.
- **The shared web-search budget ran out** near the end of the session. A few facts come from prior knowledge and are tagged **[not re-verified]**. Check those before building on them.
- Several items changed many times in 2026: student-loan collections, SAVE deadlines, and the Medicaid early-adopter states. When sources conflict, both versions are listed.
- The IRS now refers to the One Big Beautiful Bill Act (OBBBA, P.L. 119-21, signed July 4, 2025) as the **"Working Families Tax Cuts Act"** on some pages ([IRS](https://www.irs.gov/tax-professionals/eitc-central/repayment-caps-eliminated-for-excess-advance-payments-of-the-premium-tax-credit)). It is the same law.

---

## 1. TL;DR: opportunity matrix

Ratings run from 1 to 5, where 5 is best for us. "Gap" means how weak the incumbents are. "Code" means how deterministic the rule is and how feasible it is in 12 hours.

| # | Rule change | Who / how many | $ at stake per person | Willing to pay | Deadline urgency now (Nov 2026) | Gap | Code | Verdict |
|---|---|---|---|---|---|---|---|---|
| A | **ACA: uncapped repayment of excess APTC (tax year 2026), 400% FPL cliff back, enhanced credits expired** | ~19M Marketplace enrollees, 87% subsidized; ~10M subsidized tax households (est.) | $1k–$10k+ owed at tax time | 4 | 5 (2027 open enrollment ends Jan 15; IRA/HSA deadline Apr 15, 2027) | **5** | 5 | **TOP PICK** |
| B | **Student loans: SAVE ended, RAP launched, IBR, Tiered Standard, IDR forgiveness taxable again, collections on and off** | ~7M SAVE borrowers; ~42M federal borrowers [not re-verified] | $100s/month; tax bomb of $10k+ at forgiveness | 3 | 4 | 2 | 5 | Strong but crowded |
| C | Dependent Care FSA $7,500 + child care credit at 50% + CTC + Trump Account employer money | Working parents paying for childcare | $500–$2,500/yr | 2–3 | 4 (employer open enrollment is now) | 3 | 4 | Good #3 |
| D | No tax on overtime | 25M+ filers claimed for 2025 | avg deduction $3,100 (≈$370–$680 of tax) | 2 | 3 | 1 | 4 | Crowded with calculators |
| E | No tax on tips | 6M+ filers | avg deduction $7,100 | 2 | 3 | 2 | 3 | Niche |
| F | Car-loan interest deduction (US-assembled new cars) | 1M+ filers claimed | avg deduction $1,800 | 1 | 2 | 2 | 5 | Feature, not a product |
| G | Trump Accounts ($1,000 seed, launched July 4, 2026) | ~6M kids enrolled | $1,000 free + long-run growth | 1–2 | 2 | 2 | 5 | Low WTP |
| H | HSA now allowed with bronze/catastrophic plans and DPC | Marketplace bronze enrollees | $ hundreds–thousands in tax | 2 | 4 | 4 | 4 | Fold into A |
| I | Charitable deduction for non-itemizers ($1k/$2k) | ~144M standard-deduction filers | ≤$440 tax | 1 | 3 (year-end) | 3 | 5 | Feature |
| J | 529 now covers credentials; Workforce Pell (Skills) | Adult upskillers | $ hundreds–thousands | 2 | 2 | 4 | 2 | Interesting for the Skills track, data-poor |
| K | Medicaid work requirements (by Jan 1, 2027) | Expansion adults in 43 states + DC | Losing coverage | **1 (can't pay)** | 5 | 3 | 3 | B2G/B2B only |
| L | New state paid leave (MN, DE, ME; MD 2028) | Expecting parents in those states | Weeks of pay | 2 | 2 | 3 | 3 | One-off |
| M | Medical debt on credit reports (CFPB rule vacated; ~15 state bans) | People with medical collections | Credit score | 2 | 2 | 2 | 3 | Legal risk under CROA |
| N | BNPL entering credit scores (FICO 10 BNPL) | ~BNPL users | Credit score | 1 | 1 | 2 | 2 | Not yet biting |
| O | Click-to-cancel (federal rule vacated; CA/NY/NYC rules) | Everyone with subscriptions | $ small | 2 | 1 | 1 (Rocket Money) | 3 | Crowded |
| P | REAL ID: $45 TSA ConfirmID fee | Travelers without REAL ID | $45 | 1 | 1 | — | — | Skip |

**Bottom line:** the change with the largest dollar shock, the fewest incumbents, the most deterministic math and the best timing is **A**: the first tax season (Jan–Apr 2027) with **uncapped** ACA subsidy clawbacks and the **400% FPL cliff back**. KFF says plainly: *"enrollees will choose 2027 plans without seeing how uncapped repayment works"* ([KFF](https://kff.org/affordable-care-act/9-things-to-watch-for-the-2027-aca-open-enrollment-period/)).

---

## 2. Change-by-change findings

### A. ACA Marketplace: enhanced subsidies expired, 400% cliff returned, excess-APTC repayment caps eliminated, 2027 open enrollment

**What changed and when**
- **Enhanced premium tax credits expired** after 2025, and Congress has not passed an extension through both chambers. Insurers priced 2027 as if the credits stay gone ([KFF](https://kff.org/affordable-care-act/9-things-to-watch-for-the-2027-aca-open-enrollment-period/)). One source says the House passed a 3-year extension in Jan 2026 that the Senate never took up (unconfirmed; [calculator-page claim](https://ustax.tools/aca-premium-tax-credit-calculator/)).
- **The 400% FPL cliff is back for 2026.** Above 400% FPL the credit is $0. At 400.00% you get a credit, and at 400.01% you get nothing ([KFF](https://kff.org/affordable-care-act/9-things-to-watch-for-the-2027-aca-open-enrollment-period/); [ustax.tools](https://ustax.tools/aca-premium-tax-credit-calculator/)). For 2026 coverage the cliff is about **$62,600 for a single person and $128,600 for a family of 4**, based on the 2025 HHS guidelines of $15,650 + $5,500 per extra person ([summary](https://www.mybanktracker.com/savings/aca-subsidy-cliff)). For 2027 coverage it is **$63,840 single and $132,000 for a family of 4**, using the 2026 guidelines of $15,960 + $5,680 ([ASPE/HHS](https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines)).
- **2026 applicable-percentage table** (Rev. Proc. 2025-25): <133% FPL 2.10%; 133–150% 3.14–4.19%; 150–200% 4.19–6.60%; 200–250% 6.60–8.44%; 250–300% 8.44–9.96%; **300–400% flat 9.96%** ([Current Federal Tax Developments](https://www.currentfederaltaxdevelopments.com/blog/2025/7/18/rev-proc-2025-25-a-technical-review-of-2026-premium-tax-credit-and-affordability-adjustments)). Under ARPA the top rate was 8.5% and there was no cliff.
- **Repayment caps eliminated (OBBBA §71305).** *"Beginning with tax year 2026, the taxpayer must repay the full amount of any excess advance payments"* ([IRS](https://www.irs.gov/tax-professionals/eitc-central/repayment-caps-eliminated-for-excess-advance-payments-of-the-premium-tax-credit)). The old caps ran from $375 to $1,625 for single filers between 100% and 400% FPL ([KFF](https://www.kff.org/affordable-care-act/marketplace-enrollees-with-unpredictable-incomes-could-face-bigger-penalties-under-house-reconciliation-bill-provision/)). Proposed regulations were published Oct 15, 2026, with a hearing on Dec 8, 2026 ([24/7 Wall St, Oct 15 2026](https://247wallst.com/personal-finance/2026/10/15/trumps-big-beautiful-bill-just-hit-obamacare-enrollees-where-it-hurts-their-tax-refund/)).
- **2027 premiums:** the benchmark silver plan is up 13% on average (11% in HealthCare.gov states, 16% in state-based exchanges) and **about 42% since 2025**. Cigna is leaving the individual market in all 11 of its states ([KFF](https://kff.org/affordable-care-act/9-things-to-watch-for-the-2027-aca-open-enrollment-period/)).
- **2027 open enrollment:** Nov 1, 2026 to Jan 15, 2027 in most states. Enroll by Dec 15 for coverage starting Jan 1 ([Stride Health, Nov 13 2026](https://blog.stridehealth.com/post/rising-costs-and-changing-tax-credits); [ABC7](https://abc7news.com/story/premiums-rise-what-know-aca-coverage-open-enrollment-begins/20009427)). A court vacated the rule that would have shortened open enrollment to nine weeks ([KFF](https://kff.org/affordable-care-act/9-things-to-watch-for-the-2027-aca-open-enrollment-period/)).
- **Other 2027 changes:** refugees and asylees lose credit eligibility. Expanded catastrophic-plan eligibility is paused by litigation. People denied Medicaid for failing work requirements are also barred from the premium tax credit. HHS cancelled about 760k "phantom" enrollments in Sept 2026 ([KFF](https://kff.org/affordable-care-act/9-things-to-watch-for-the-2027-aca-open-enrollment-period/)).
- **HSA tie-in:** from Jan 1, 2026, Marketplace **bronze and catastrophic plans count as HSA-compatible** (IRS Notice 2026-5) ([RSM](https://www.rsmus.com/insights/services/business-tax/irs-notice-2026-expanded-hdhp-definition-obbba-broadens-hsa); [KPMG](https://kpmg.com/us/en/taxnewsflash/news/2025/12/notice-2026-5-expanded-hsa-eligibility-under-obbba.html)). That means many enrollees can now lower MAGI with an HSA contribution for 2026, which can be made until April 15, 2027. KFF names HSA and IRA contributions as the way to reduce the income used for the credit ([KFF](https://kff.org/affordable-care-act/9-things-to-watch-for-the-2027-aca-open-enrollment-period/)).

**Who is affected and how many**
- Effectuated Marketplace enrollment was **19.2M in Feb 2026**, down 12%. CBO projects 13.1M in 2027 ([KFF](https://kff.org/affordable-care-act/9-things-to-watch-for-the-2027-aca-open-enrollment-period/)). About **87% receive financial help** ([Stride](https://blog.stridehealth.com/post/rising-costs-and-changing-tax-credits)).
- Historically about half of APTC households get too much in advance. TIGTA found **2.9M taxpayers with $3.8B of excess APTC** in tax year 2016 ([Health Affairs summary of TIGTA](https://www.healthaffairs.org/content/forefront/treasury-inspector-general-assesses-aca-related-tax-issues)), roughly $1,300 per household while the caps still applied.
- Highest risk: people with volatile income. **26% of likely Marketplace shoppers have income that swings 20% or more within a year.** Job loss, multiple jobs, gig and contract work, landscapers, childcare workers and truck drivers are all over-represented ([KFF](https://www.kff.org/affordable-care-act/marketplace-enrollees-with-unpredictable-incomes-could-face-bigger-penalties-under-house-reconciliation-bill-provision/)). CBPP also names freelancers, gig workers and small-business owners ([CBPP](https://www.cbpp.org/blog/marketplace-enrollees-could-face-surprise-tax-increases-next-year-thanks-to-the-republican)). That profile matches self-employed 25–45 year-olds well.

**What the person now has to figure out**
1. How much they will owe in April 2027, given the APTC already received in 2026 and their actual 2026 income.
2. Whether they are just above 400% FPL, and how much to put into a **traditional IRA, HSA (if on a bronze/HDHP plan) or SEP-IRA by April 15, 2027** to get back under it.
3. What income estimate and APTC level to choose for 2027 (open enrollment closes Jan 15). Taking less APTC upfront is the safe option.
4. When to report income changes to the Marketplace during 2027.

**Cost of getting it wrong.** In KFF's example, a family of three at 407% FPL would owe back **$34,463 (33% of income)** once the enhanced credits are gone ([KFF](https://www.kff.org/affordable-care-act/marketplace-enrollees-with-unpredictable-incomes-could-face-bigger-penalties-under-house-reconciliation-bill-provision/)). Instead.com gives two illustrations: a single 40-year-old owes $2,600 instead of $1,625, and a family of four owes $6,400 instead of ~$3,250 ([Instead](https://instead.com/resources/blog/how-to-avoid-full-premium-tax-credit-repayment-in-2026)).

**Worked example (our arithmetic; the benchmark premium is an assumption).** Family of 4, 2026 coverage. Benchmark silver plan $1,800/month ($21,600/yr). They estimated $110,000 (342% FPL), so expected contribution = 9.96% × 110,000 = $10,956 and **APTC = $10,644**. Their actual MAGI was **$131,000 (407% FPL)**, so the credit is $0 and **they owe all $10,644**. Under 2025 rules they would have owed about $0. If they put **~$2,400–3,000** into a traditional IRA or HSA before Apr 15, 2027, MAGI falls to about $128,000 (398% FPL). Their credit becomes $21,600 − 9.96% × 128,000 = $8,851, and **the bill drops to about $1,800**. Contributing about $3k saves about $8.8k, and the contribution itself is still their money.

**Evidence of confusion and demand**
- KFF: enrollees choose 2027 plans *before* anyone has seen an uncapped reconciliation ([KFF](https://kff.org/affordable-care-act/9-things-to-watch-for-the-2027-aca-open-enrollment-period/)).
- Mainstream warnings are already out: 24/7 Wall St, "BBB just hit Obamacare enrollees where it hurts: their tax refund" (Oct 15, 2026) ([link](https://247wallst.com/personal-finance/2026/10/15/trumps-big-beautiful-bill-just-hit-obamacare-enrollees-where-it-hurts-their-tax-refund/)); CBPP, "surprise tax increases" ([link](https://www.cbpp.org/blog/marketplace-enrollees-could-face-surprise-tax-increases-next-year-thanks-to-the-republican)).
- A wave of SEO "cliff calculators" signals search demand: [aca-subsidy-guide.vercel.app](https://aca-subsidy-guide.vercel.app/subsidy-cliff-calculator), [acacalc-com.pages.dev](https://acacalc-com.pages.dev/), [policyrisk](https://policyrisk.com/calculators/aca-subsidy-calculator), [richify FIRE bridge](https://www.richify.ai/us/tools/fire-healthcare-bridge-calculator), [nationaltaxtools](https://nationaltaxtools.com/calculators/premium-tax-credit-calculator/), [ustax.tools](https://ustax.tools/aca-premium-tax-credit-calculator/), and multi-language beancount.io guides.
- Covered California published a brief titled "Self-Employed IRA–ACA Premium Impacts 2026" ([PDF](https://hbex.coveredca.com/data-research/library/Brief%202%20Self-Employed%20IRA-ACA%20Premium%20Impacts%202026.pdf)). Only the title was confirmed; the PDF did not render in our tools.

**Existing products**
| Product | What it does | Gap vs. the new pain |
|---|---|---|
| [KFF subsidy calculator](https://www.kff.org/interactive/subsidy-calculator/), [healthinsurance.org calculator](https://www.healthinsurance.org/affordable-care-act/subsidy-calculator/) | Estimate prospective subsidy | Forward-looking only. Doesn't reconcile APTC already received or optimize MAGI |
| [Stride Health](https://aci.stridehealth.com/subsidy-calculator) | Enrollment for gig workers, income worksheet, subsidy calculator, advisors | Built around enrollment (likely broker commissions; business model not confirmed). No year-end clawback rescue |
| HealthSherpa, HealthCare.gov | Enrollment | Same |
| TurboTax / H&R Block / FreeTaxUSA | Compute Form 8962 **at filing** | After the fact, and buried in the return. No proactive "contribute $X by Apr 15" plan (not confirmed for 2026 versions) |
| [Instead.com](https://instead.com/resources/blog/how-to-avoid-full-premium-tax-credit-repayment-in-2026) | AI tax platform "for businesses and their accountants" with a strategy blog | B2B/pro tool, not consumer |
| SEO calculators (above) | Static cliff math | No document intake, no reconciliation of APTC received, no plan, no monitoring |

**Opportunity:** high. There is no consumer product focused on the **2026 reconciliation shock and the MAGI rescue** before Apr 15, 2027.

---

### B. Federal student loans: SAVE ended, RAP launched, IBR, Tiered Standard, borrowing caps, PSLF rule, collections, tax bomb

**What changed and when**
- **SAVE is over.** A court vacated it on **Mar 10, 2026** ([Tate Law](https://go.tateesq.com/repayment/repayment-plan-questions/)), and a settlement is also cited ([ustax.tools](https://ustax.tools/student-loan-changes-2026/)). ED announced next steps for SAVE enrollees ([ED press release](https://www.ed.gov/about/news/press-release/us-department-of-education-announces-next-steps-borrowers-enrolled-unlawful-save-plan); [NerdWallet](https://www.nerdwallet.com/student-loans/news/save-plan-switch-ultimatum)). Servicer notices started **July 1, 2026**, each giving **at least 90 days**. Borrowers who don't choose are placed on a standard plan or the Tiered Standard plan ([ustax.tools](https://ustax.tools/student-loan-changes-2026/)). About **7M SAVE borrowers** are affected ([College Investor headline](https://thecollegeinvestor.com/81538/department-of-ed-will-begin-july-1-exit-plan-for-7-million-save-plan-borrowers/)).
- **The Repayment Assistance Plan (RAP) launched July 1, 2026**, with about 46k applications on day one ([College Investor](https://thecollegeinvestor.com/83679/nearly-46000-borrowers-applied-for-the-new-rap-student-loan-plan-on-day-one/)). Formula: **1%–10% of total AGI**, rising 1 point for each $10k above $10k and capped at 10% above $100k. **−$50/month per dependent**, **$10 minimum**. **Unpaid interest is waived**, and the government adds a **principal match of up to $50/month**. Forgiveness comes after **360 payments**. Parent PLUS loans are not eligible ([CRS IF13075](https://www.everycrsreport.com/files/2025-07-31_IF13075_d08bd35bed70265ba5facbc55c4135b864a1f534.html)). The subsidies require an **on-time payment each month**, and paying early can switch them off ([student-loans.pages.dev](https://student-loans.pages.dev/plans/rap/); [College Investor](https://thecollegeinvestor.com/79015/how-rap-works/)).
- **Loans made on or after July 1, 2026** can only use RAP or the Tiered Standard plan. Borrowers with older loans can still choose IBR, reportedly until July 1, 2028 ([ustax.tools](https://ustax.tools/student-loan-changes-2026/); [Yahoo Finance](https://finance.yahoo.com/personal-finance/student-loans/article/ibr-vs-rap-220714936.html)). There is a trap: a new loan pulls *all* of a borrower's loans into the RAP rules ([CRS](https://www.everycrsreport.com/files/2025-07-31_IF13075_d08bd35bed70265ba5facbc55c4135b864a1f534.html); [RatesChaser](https://rateschaser.com/student-loans/news/rap-repayment-assistance-plan-existing-borrower-trap-2026-06-28/)).
- **Borrowing caps from July 1, 2026:** Grad PLUS closed to new borrowers. Graduate loans: $20,500/yr and $100k total. Professional loans: $50k/yr and $200k total. **Parent PLUS is capped for the first time** at $20k/yr and $65k per dependent, and new Parent PLUS loans can only use the standard plan ([Wisconsin Examiner](https://wisconsinexaminer.com/2026/05/08/repub/big-changes-arrive-july-1-for-student-borrowers-including-in-loan-repayments/); [Indiana State Univ.](https://www.indianastate.edu/costs-aid/financial-aid/obbba)).
- **PSLF employer rule:** an employer with a "substantial illegal purpose" can lose qualifying status. Final rule Oct 31, 2025, effective July 1, 2026. It is being challenged by 21–22 states, cities and nonprofits. A CRS sidebar from Aug 2026 discusses the cases, and we found no ruling ([CRS LSB11472](https://www.everycrsreport.com/reports/LSB11472.html); [ACE](https://www.acenet.edu/News-Room/Pages/ED-Finalizes-PSLF-Rule.aspx)).
- **IDR forgiveness is taxable again** from Jan 1, 2026, because ARPA's exclusion expired. PSLF forgiveness stays tax-free ([Bankrate](https://www.bankrate.com/loans/student-loans/idr-student-loan-forgiveness-becomes-taxable-in-2026/); [College Investor](https://thecollegeinvestor.com/61056/student-loan-tax-bomb-returning-in-2026/)).
- **Collections have been on and off.** Treasury offset restarted May 5, 2025. Wage garnishment was announced to start Jan 7, 2026 ([NPR](https://npr.org/2025/12/23/nx-s1-5653312/student-loans-default-education-department)) and then **delayed on Jan 16, 2026**, together with offsets ([Wisconsin Examiner](https://wisconsinexaminer.com/2026/01/19/repub/us-education-department-delays-plan-to-garnish-wages-of-student-borrowers-in-default/)). The College Investor reports that ED and Treasury plan to restart garnishment **"this fall"** ([link](https://thecollegeinvestor.com/80311/wage-garnishment-on-defaulted-student-loans-restarts-this-fall/); exact date not confirmed). Garnishment can take up to 15% of disposable pay. Estimates of defaulted borrowers range from 5.5M to about 9M ([Fortune](https://fortune.com/2026/01/07/student-loan-borrowers-wage-garnishment-who-is-affected-how-much-can-government-take/)).

**What people must figure out:** RAP vs. IBR vs. Tiered Standard, using their own loans, AGI and dependents. Whether adding a new loan or consolidating would pull them into RAP. Whether their PSLF employer still qualifies. The size of the tax bill at IDR forgiveness. How to get out of default before garnishment.

**Cost of getting it wrong:** hundreds of dollars a month in overpayment, lost RAP subsidies from mistimed payments, lost PSLF credit, or 15% of pay garnished.

**Evidence of confusion:** sources disagree on timelines (the Loan Simulator "not updated" in May vs. "includes RAP" by June 28: [Yahoo](https://finance.yahoo.com/news/know-trump-student-loan-repayment-100000494.html), [RatesChaser](https://rateschaser.com/student-loans/news/rap-repayment-assistance-plan-existing-borrower-trap-2026-06-28/)). Garnishment has been announced, delayed and re-announced. Dozens of SEO calculators exist.

**Existing products (crowded):** [StudentAid.gov Loan Simulator](https://studentaid.gov/loan-simulator/) (official, free; RAP added by about June 2026, [mappingyourfuture](https://mappingyourfuture.org/?p=4968)); Tate Law free calculators ([IBR vs RAP](https://www.tateesq.com/calculator/ibr-vs-rap), [RAP vs Tiered Standard](https://www.tateesq.com/calculator/rap-vs-tiered-standard)); [College Investor RAP calculator](https://thecollegeinvestor.com/58820/repayment-assistance-plan-rap-student-loan-calculator/); [Savi](https://bysavi.zendesk.com/hc/en-us/articles/52276590160531-Understanding-the-Repayment-Assistance-Plan-RAP-Student-Loan-Repayment-Option); [Student Loan Planner](https://www.studentloanplanner.com/save-plan-switch/) (paid consults); Chipper, Summer (B2B), Candidly and Payitoff (B2B) [not re-verified]. SEO calculators include [rappath](https://rappath.pages.dev/), [repaypath](https://repaypath.pages.dev/income-driven-repayment-2026-options), [fedratecalc](https://fedratecalc.com/repayment-assistance-plan-calculator/), [richify](https://www.richify.ai/us/tools/rap-student-loan-calculator) and [a manus.space app](https://loanestmt-8auexqjw.manus.space/rap).

---

### C. No tax on overtime (OBBBA, tax years 2025–2028)

- **Rule:** deduction for the **FLSA-required overtime premium only** (the "half" in time-and-a-half). Cap $12,500, or $25,000 for joint filers. Phases out above $150k/$300k MAGI. Married filing separately can't claim. Claimed on Schedule 1-A ([IRS](https://www.irs.gov/newsroom/one-big-beautiful-bill-act-tax-deductions-for-working-americans-and-seniors); [IRS provisions](https://irs.gov/newsroom/one-big-beautiful-bill-provisions-individuals-and-workers)).
- **Reporting:** 2025 was a transition year. Employers didn't have to report qualified overtime, and workers rebuilt it from pay stubs or a voluntary Box 14 amount (Notice 2025-69) ([IRS penalty relief](https://www.irs.gov/es/newsroom/treasury-irs-provide-penalty-relief-for-tax-year-2025-for-information-reporting-on-tips-and-overtime-under-the-one-big-beautiful-bill); [RSM](https://www.rsmus.com/insights/tax-alerts/2025/irs-guidance-claim-overtime-deduction)). **From tax year 2026, only overtime reported on the W-2 in Box 12, code TT can generally be claimed** ([search summary of IRS guidance](https://www.cupahr.org/resource/irs-updates-no-tax-on-overtime-deduction-guidance/)).
- **Scale and confusion:** **25M+ filers claimed it** by early April 2026, against forecasts of 15–17M. The average deduction was $3,100, worth $372–$682 in tax. Experts expect many accidental over-claims: union or state overtime that isn't FLSA-required, or claiming full overtime pay ([Bangor Daily News, Apr 17 2026](https://www.bangordailynews.com/2026/04/17/politics/new-overtime-tax-break-wrong-filing/)). Treasury called it "the home run" of the law ([NYSSCPA](https://nysscpa.org/news/1051947-new-tax-deductions-gain-tractions-as-refunds-rise-in-2026-filing-season-2026-03-30)). TurboTax forum threads show confusion over Box 14 ("QUAL O") and validation errors ([thread 1](https://ttlc.intuit.com/community/taxes/discussion/on-my-w2-line-14-says-qual-o-what-does-this-mean/00/3765605), [thread 2](https://ttlc.intuit.com/community/taxes/discussion/software-is-not-working-for-the-ot-deduction/00/3750035)).
- **New pain for 2026–27:** the W-2 code TT number may differ from what workers claimed for 2025, which creates audit and amendment anxiety. Workers can also raise take-home pay through W-4 changes.
- **Existing products:** [TurboTax calculator](https://blog.turbotax.intuit.com/tax-deductions-and-credits-2/no-tax-on-overtime-calculator-140376/) and built-in Schedule 1-A flow, [H&R Block explainer](https://www.hrblock.com/tax-center/irs/tax-law-and-policy/one-big-beautiful-bill-no-tax-on-overtime/), [Clockspot](https://www.clockspot.com/tools/no-tax-on-overtime-calculator), [ustax.tools](https://ustax.tools/no-tax-on-overtime-calculator/), [thefinancebuff](https://thefinancebuff.com/no-tax-on-overtime-calculator-trump-tax-law.html), [Paychex FAQ](https://www.paychex.com/sites/default/files/2026-02/faq-no-tax-on-ot-and-tips.pdf). This space is **crowded**.

### D. No tax on tips (2025–2028)

- Deduction of up to **$25,000 per return** for qualified voluntary tips in listed occupations. Mandatory service charges don't count, and tips in a specified service trade or business (SSTB) are excluded ([IRS](https://irs.gov/newsroom/one-big-beautiful-bill-provisions-individuals-and-workers)). It phases out above $150k/$300k MAGI [not re-verified for tips specifically]. The Treasury occupation list includes "digital content creators" [not re-verified], which is an Entertainment-track angle: which streaming or creator payments count as tips?
- **6M+ filers claimed it, averaging $7,100** ([Bangor Daily News](https://www.bangordailynews.com/2026/04/17/politics/new-overtime-tax-break-wrong-filing/)).
- Existing: tax software, payroll providers, the same calculators as overtime.

### E. Car-loan interest deduction (2025–2028)

- Up to **$10,000/yr** of interest on loans originated **after Dec 31, 2024** for **new** vehicles with **US final assembly**. Phases out above $100k/$200k MAGI. Available to non-itemizers via Schedule 1-A Part IV ([IRS](https://irs.gov/newsroom/one-big-beautiful-bill-provisions-individuals-and-workers); [TaxSlayer](https://support.taxslayer.com/hc/en-us/articles/38793401591181-Car-Loan-Interest-Deduction)). Final regulations (T.D. 10054) took effect **Nov 9, 2026** ([EY, Sept 2026](https://taxnews.ey.com/news/2026-1930-final-regulations-implement-deduction-for-interest-on-qualified-passenger-vehicle-loans-and-lender-reporting-requirements); [Crowe](https://www.crowe.com/insights/tax-news-highlights/final-rules-on-auto-loan-interest-deduction)). Lenders issue the **new Form 1098-VLI** for 2026 when interest is $600 or more ([Sovos](https://sovos.com/regulatory-updates/trr/irs-publishes-final-1098-vli-form-instructions/)).
- **1M+ filers claimed it, averaging $1,800** ([Bangor Daily News](https://www.bangordailynews.com/2026/04/17/politics/new-overtime-tax-break-wrong-filing/)).
- The NHTSA VIN decoder (free, official) shows the plant country ([CLA](https://www.claconnect.com/en/resources/articles/26/auto-loan-interest-deduction)). This works as a **feature** (VIN to eligible yes/no), not a business.

### F. Trump Accounts (children)

- Launched **July 4, 2026**. A **$1,000 federal seed** goes to US-citizen children born **2025–2028**. Parents elect it on **Form 4547** or at trumpaccounts.gov / the app. Contributions up to **$5,000/yr**, of which **employers can give $2,500** (excluded from income, per sources). Money must sit in low-cost US index funds (fees ≤0.1%) and can't be withdrawn before age 18. Initial administrators are **BNY Mellon and Robinhood** ([Axios](https://www.axios.com/2026/01/02/trump-accounts-signup-big-beautiful-bill); [Kiplinger](https://www.kiplinger.com/taxes/how-to-open-your-kids-trump-account); [MoneyTalksNews](https://www.moneytalksnews.com/trump-accounts-are-now-live-heres-how-they-work/); [PlanAdviser](https://www.planadviser.com/irs-treasury-explain-how-to-open-trump-accounts/); [Savingforcollege](https://www.savingforcollege.com/article/trump-account-tax-deferred-savings-children)).
- **Dell pledge of $6.25B:** about $250 for children up to age 10 in ZIP codes with median income under $150k. Age and ZIP criteria are reported inconsistently ([Invest America fact sheet](https://www.onedell.com/wp-content/uploads/2026/08/IA_FactSheet_General.pdf)).
- **About 6M children are enrolled, including 1.4M seed-eligible babies** (Treasury, as reported in post-launch coverage: [Washington Examiner](https://www.washingtonexaminer.com/?p=4633263)).
- Existing products: the official app, plus comparison calculators: [ustax.tools](https://ustax.tools/tax-insights/trump-account-vs-529/), [SwitchWize](https://www.switchwize.com/calculators/trump-account-planner), [CompoundLadder](https://www.compoundladder.com/trump-account-vs-529), [Grifin](https://www.grifin.com/post/trump-accounts-vs-529-plans-which-is-better-for-your-child), 529 plan sites ([Savingforcollege](https://www.savingforcollege.com/article/trump-account-vs-529), [BrightStart](https://brightstart.com/blog-and-news/trump-account-vs-529-plan/)). Willingness to pay is low because the money is free and the decision happens once.

### G. Dependent Care FSA, child and dependent care credit, child tax credit

- **DCFSA limit rises from $5,000 to $7,500 from 2026** ($3,750 married filing separately), the first increase since 1986. It only applies if the employer amends its plan ([search summary](https://www.keepertax.com/posts/dependent-care-fsa-child-care-tax-credit); [Bricker Graydon](https://www.bricker.com/benefits-insights/actions-to-take-early-in-2026-if-you-increased-your-dependent-care-fsa-max)).
- **The child and dependent care credit rate rises to 50%** at low incomes and phases down, staying 35%+ to about $43k AGI and falling to a 20% floor at higher incomes ([tax47](https://tax47.app/blog/child-dependent-care-credit-2026/); [Keeper](https://www.keepertax.com/posts/dependent-care-fsa-child-care-tax-credit)). **[Exact 2026 phase-down steps not re-verified; confirm with the 2026 Form 2441 instructions.]** Expense caps stay at $3,000 for one child and $6,000 for two or more. **Every DCFSA dollar reduces the expenses eligible for the credit dollar for dollar.** A $7,500 DCFSA wipes out the credit for families with two or more kids.
- Confusion: NewFront, "The OBBB Dependent Care FSA increase could backfire" ([link](https://www.newfront.com/blog/the-obbb-dependent-care-fsa-increase-could-backfire)); Insurance Business, "comes with a year-end document deadline" ([link](https://www.insurancebusinessmag.com/us/news/benefits/dependent-care-fsa-limit-change-comes-with-a-yearend-document-deadline-595665.aspx)); FedTools, "the $7,500 DCFSA most feds are missing" ([link](https://www.fedtools.com/blog/fsafeds-dcfsa-7500-2026)).
- **Child tax credit:** $2,200 per child from 2025, indexed. At least one parent needs an SSN [not re-verified]. **SALT cap:** $40,000 for 2025, growing about 1%/yr, phasing down above $500k MAGI, reverting to $10k in 2030 [not re-verified]. This mostly matters to higher-income homeowners in CA, NY and NJ.
- Existing products: FSA administrator apps (WEX, HealthEquity, Navia) [not re-verified]; free calculators ([nationaltaxtools](https://nationaltaxtools.com/calculators/childcare-tax-benefit-calculator/), [tax47](https://tax47-web.pages.dev/tools/dependent-care-fsa-vs-credit-calculator/), [FedTools](https://www.fedtools.com/calculators/dependent-care-fsa-calculator), [policyrisk](https://policyrisk.com/calculators/dependent-care-calculator)); employer decision-support tools such as ALEX/Jellyvision and Nayya (B2B) [not re-verified].

### H. HSA expansion

- Bronze and catastrophic plans are HSA-compatible from Jan 1, 2026, whether bought on or off the exchange. Direct primary care arrangements (fixed periodic fee) are HSA-compatible. Notice 2026-5 was issued Dec 9, 2025 ([RSM](https://www.rsmus.com/insights/services/business-tax/irs-notice-2026-expanded-hdhp-definition-obbba-broadens-hsa); [KPMG](https://kpmg.com/us/en/taxnewsflash/news/2025/12/notice-2026-5-expanded-hsa-eligibility-under-obbba.html)). The DPC fee limit of $150/mo ($300 family) and permanent telehealth relief are **[not re-verified]**. 2026 HSA limits of $4,400 self-only and $8,750 family are **[not re-verified; the $4,400 figure matches the Instead example]**.
- Best used as a **lever inside Idea #1**, since bronze enrollees can now cut MAGI.

### I. Charitable deduction for non-itemizers (from tax year 2026)

- $1,000 single or $2,000 joint for **cash** gifts to public charities. Gifts to donor-advised funds or private foundations don't count. Itemizers face a 0.5%-of-AGI floor and a 35% benefit cap for the top bracket ([Kiplinger: "144 million standard-deduction filers get a new charitable tax break"](https://www.kiplinger.com/taxes/standard-deduction-filers-get-a-new-charitable-tax-break); [CAPTRUST](https://www.captrust.com/?p=47941)). The year-end deadline is real, but the value is at most about $440. This is a feature.

### J. Skills track: 529 credential expansion, Workforce Pell

- **529 funds can now pay for postsecondary credentialing** (tuition, fees, testing) for programs in recognized directories such as DoD COOL, for distributions after July 4, 2025. The K-12 cap rises to $20k in 2026. State tax treatment varies ([Savingforcollege](https://www.savingforcollege.com/article/trump-budget-bill-529-plan-credentials-continuing-education); [ScholarShare CA](https://www.scholarshare529.com/media/rpsdt23r/ca_expanded_use_of_529_funds.pdf)).
- **Workforce Pell started July 1, 2026:** programs of 150–599 clock hours over 8–15 weeks, with prorated awards of roughly $125–$4,310. Governors or state boards approve programs, and outcome tests apply. Final rule May 19, 2026 ([NCSL](https://www.ncsl.org/resources/details/What-Workforce-Pell-Means-for-State-Legislatures); [College Investor](https://thecollegeinvestor.com/80871/workforce-pell-grant-final-rule-locks-in-july-2026-launch-for-short-term-training-aid/); [OpenGrants](https://opengrants.io/workforce-pell-grant-what-actually-opens-july-1/)).
- Opportunity: a "pay $0 for your certification" finder that combines Workforce Pell, the 529 credential rule, employer §127 ($5,250) and state grants. It's original, but program lists are fragmented and still being published state by state, and Pell users are low-income. Better suited to lead generation (training providers pay) than B2C.

### K. Medicaid work requirements

- **CMS interim final rule CMS-2454-IFC, June 1, 2026.** Requires **80 hours/month** of work or community engagement for expansion adults. States must implement **by Jan 1, 2027** (43 states + DC), with good-faith exemptions for about 10 states. Early starts are reported as Nebraska (May 2026), Montana (July) and Iowa (December), with conflicting reports. The IFR itself estimates **7% of people who comply or are exempt will still lose coverage for administrative reasons** ([CMS fact sheet](https://cms.gov/newsroom/fact-sheets/medicaid-community-engagement-requirement-certain-individuals-interim-final-rule-comment-period-cms); [Epstein Becker Green](https://www.ebglaw.com/insights/publications/cms-issues-interim-final-rule-on-medicaid-work-requirements); [Physicians Practice](https://www.physicianspractice.com/view/medicaid-work-requirements-will-land-on-the-front-desk-starting-jan-1); [Chartis](https://www.chartis.com/insights/new-medicaid-work-rule-raises-eligibility-documentation-and-coverage-risks)). Losing coverage this way also blocks Marketplace subsidies ([KFF](https://kff.org/affordable-care-act/9-things-to-watch-for-the-2027-aca-open-enrollment-period/)).
- **Willingness to pay is roughly zero.** Affected people are low-income by definition. Viable only as B2G, B2B (health plans, hospitals) or nonprofit. Not a fit for this brief's "will pay" criterion.

### L. New state paid family and medical leave programs

- **Delaware** benefits started Jan 1, 2026 (up to 12 weeks). **Minnesota** started Jan 1, 2026 (up to 20 weeks combined). **Maine** started May 1, 2026. **Maryland** contributions start Jan 1, 2027 and benefits by about Jan 3, 2028 (dates conflict). That makes 13 states plus DC with programs ([HCAMag](https://www.hcamag.com/us/specialization/benefits/paid-family-leave-mandates-now-cover-14-states-and-washington-dc/591280); [CEDR](https://www.cedrsolutions.com/blog/state-paid-leave-laws-are-expanding-in-2026/); [EY on MD](https://taxnews.ey.com/news/2025-1335-maryland-delays-start-date-for-employer-contributions-to-its-paid-family-and-medical-leave-insurance-program-to-january-1-2027)).
- Opportunity: a parental-leave paycheck planner (state benefits + employer top-up + short-term disability + timeline). It's a one-off per birth. Competitors are state calculators and B2B leave platforms.

### M. Medical debt on credit reports

- A Texas federal court vacated the CFPB rule in 2025, and the CFPB withdrew its supportive guidance. About **15 states plus DC** now ban or limit reporting (CA, CO, CT, DE, IL, ME, MD, MN, NY, NJ partial, OR, RI from Jan 1, 2026, VT, VA, WA). Medical debt "can still hit your credit report in 35 states" ([NCLC tracker, updated Sept 21 2026](https://library.nclc.org/article/latest-keeping-medical-debt-out-credit-reports); [MoneyGeek](https://www.moneygeek.com/insurance/health/medical-debt-credit-reporting-bans-by-state/); [Commonwealth Fund](https://www.commonwealthfund.org/blog/2026/federal-protections-stall-states-move-front-lines-alleviate-medical-debt)).
- Product risk: charging for dispute letters runs into the **Credit Repair Organizations Act** (no fees before the service is performed) [not re-verified]. Skip.

### N. BNPL data in credit scores

- FICO Score 10 BNPL and 10 T BNPL exist. TransUnion says the BNPL attributes it introduced in Oct 2026 **do not currently affect consumer scores**. Affirm reports to Experian and TransUnion, while Klarna and Afterpay vary ([TransUnion](https://www.transunion.com/blog/bnpl-and-point-of-sale-lending); [PaymentsJournal](https://paymentsjournal.com/fico-debuts-credit-scores-with-bnpl-data)). The pain is not real yet. Skip.

### O. Click-to-cancel and auto-renewal

- The FTC rule was vacated by the 8th Circuit in July 2025, and the FTC started new rulemaking with an advance notice on Mar 11, 2026. California's online-cancel and click-to-cancel rules took effect July 1, 2025. New York's GBL §527-a took effect Nov 5, 2025. **NYC's municipal rule took effect Oct 1, 2026.** About 30 states have auto-renewal laws ([Skadden](https://www.skadden.com/insights/publications/2026/09/new-york-citys-click-to-cancel-rule); [Loeb](https://www.loeb.com/en/insights/passle/2026/07/nycs-new-clicktocancel-rule-how-it-stacks-up-to-new-york-state-and-california-and-whats-next-from-th); [AGG](https://www.agg.com/news-insights/publications/state-wave-of-click-to-cancel-rules/); [SubTracker](https://subtracker.io/best/subscription-cancellation-rights-us-federal)).
- Incumbents include Rocket Money's cancellation concierge [not re-verified]. Skip.

### P. REAL ID

- Enforcement began May 7, 2025. Travelers without acceptable ID pay **$45 through TSA ConfirmID** ([TSA](https://www.tsa.gov/real-id)). This is not a paid-product pain.

### Q. Other changes noted but not verified this session (search budget exhausted)

- The 1099-K threshold went back to $20,000/200 transactions, and the 1099-NEC/MISC threshold rises to $2,000 from 2026. A 1% excise tax applies to **cash-funded** remittances from Jan 1, 2026. The senior $6,000 deduction ([IRS](https://www.irs.gov/newsroom/one-big-beautiful-bill-act-tax-deductions-for-working-americans-and-seniors)) is outside the 25–45 age range. Live-event ticket all-in pricing (FTC fee rule, effective May 2025) is a possible Entertainment angle with weak willingness to pay. **All [not re-verified].**

---

## 3. Top 3 product ideas

Scoring weights: Works end-to-end 40%, Sell and retention 20%, Clear user/problem 15%, $100M ARR / LTV>CAC 15%, Originality 10%.

### Idea #1: "ClawbackCheck": the 2026 ACA clawback rescue and cliff guard  (weighted **7.45**)

**One-liner:** *"Got ACA subsidies in 2026? See what the IRS will claw back in April, and the exact IRA/HSA move that cuts it before Apr 15, 2027."*

**Why it's new:** 2026 is the first year in ACA history with **uncapped** repayment **and** a returned 400% cliff, after four years without one. The first reconciliations happen Jan–Apr 2027, and KFF notes nobody has seen one yet. We found no consumer product built around this moment.

**Persona and trigger**
- *Maya, 34, freelance product designer in Texas (HealthCare.gov state).* She estimated $45k at enrollment, and a strong Q4 means she will finish around $58k. She doesn't know her refund is about to turn into a bill.
- *The Garcias, 38 and 36, two kids. He's a self-employed contractor, she works part-time.* Estimated $110k, actual about $131k. They are **just over the cliff and owe all $10,644** (worked example in §2A).
- **Trigger moments:** (1) **now through Jan 15, 2027**, choosing a 2027 plan and income estimate; (2) **late January**, when Form 1095-A arrives; (3) **February to April 15**, while tax software shows the bill and the IRA/HSA window is still open; (4) **any month** income jumps.

**What they pay for, and price**
- **Free:** the clawback estimate and cliff chart (the hook).
- **$39 one-time "Rescue Plan":** ranked moves with exact dollar amounts and deadlines: traditional IRA (2026 limit $7,500 [not re-verified]), HSA if on a bronze or other HSA-eligible plan, SEP-IRA for the self-employed (deadline is the filing date), and the timing of income or capital gains. Includes a CPA-ready Form 8962 worksheet and a script for updating the Marketplace estimate. Value framing: "pay $39 to keep $2,000–$9,000."
- **$79/yr "Income Guard"** for variable earners: a monthly 30-second income check-in by email or SMS, re-projected reconciliation, an alert when to report a change to the Marketplace, 2027 open-enrollment guidance (how much APTC to take), and quarterly estimated-tax nudges.

**Retention loop:** the pain recurs. Income changes monthly for gig and freelance workers. Every year has open enrollment (Nov–Jan), a 1095-A (Jan) and reconciliation (Apr). As long as the cliff and uncapped repayment exist, every Marketplace year carries this risk. Retention is seasonal but structural.

**Rough US market math**
- About 19.2M Marketplace enrollees in 2026 × 87% subsidized ≈ 16.7M people, or **about 10M subsidized tax households** (assuming 1.7 people per household). Historically about half get excess APTC, so **about 4–5M households will owe in 2027, now uncapped**.
- Core: 3% of 10M × $79 ≈ **$24M ARR**. Path to $100M: extend Income Guard to all variable-income and self-employed households (tens of millions with 1099 income) for ACA, quarterly taxes and OBBBA deductions, at about 1.25M subscribers × $80. Plus B2B2C licensing to brokers and enrollment platforms (Stride, HealthSherpa, gig platforms).
- **LTV/CAC:** $79/yr with about a 2.2-year average life gives about $175 LTV. CAC of $25–40 through high-intent seasonal SEO ("ACA repay 2026", "1095-A owe"), short-form tax-season creator content, and broker and gig-community partners gives **4–6x**.

**Magic moment for a juror in 60 seconds, no login**
1. Land on the page and click "Try as the Garcia family" (pre-filled), or enter household size, state, the income you told the Marketplace, your best guess of actual 2026 income, and monthly APTC. Optionally drop a photo of a 1095-A or Marketplace eligibility notice, and Claude vision extracts the numbers.
2. In about 5 seconds: **"You'll owe the IRS $10,644 in April."** A **cliff chart** shows the 400% wall with their dot just past it.
3. Drag a slider labelled "Put $X into a traditional IRA/HSA by Apr 15": the bill falls live to **$1,793**. The output lists the plan steps, deadlines and the reason each step works.
4. Ask Claude in chat: "I drive for DoorDash, can I do a SEP?" Claude answers by **calling the deterministic engine as a tool**, so it never invents numbers.

**The real core (deterministic, codeable in 12 hours)**
- **Form 8962 engine:** HHS FPL tables (2025 guidelines for 2026 coverage; AK and HI separate), the 2026 applicable-percentage table, monthly SLCSP (benchmark premium) and APTC, PTC = min(premium, SLCSP − expected contribution), excess = APTC − PTC, no cap. Then a **MAGI optimizer** that searches IRA, HSA and SEP amounts within contribution limits and eligibility, ranks moves by dollars saved per dollar contributed, and adds the marginal income-tax effect.
- **Inputs:** manual entry or Claude-vision extraction of 1095-A columns A–C. For users without a 1095-A, the SLCSP can come from the **CMS Marketplace API** (it has eligibility-estimate and plan-search endpoints; the API key must be requested and expires every 60 days: [CMS](https://developer.cms.gov/marketplace-api/)). Fallback: manual SLCSP entry with a link to HealthCare.gov's tax tool.
- **Claude's role:** document extraction, a plain-English plan, and Q&A over the engine through tool use. The numbers are never LLM-generated.
- **Out of scope, flagged with warnings:** shared policies or mid-year marriage, the circular self-employed health-insurance deduction, Medicaid-eligible months, employer-coverage affordability.

**Competitors:** KFF and healthinsurance.org calculators (prospective only); Stride Health (enrollment-focused); TurboTax and H&R Block (only at filing, reactive); Instead.com (pro/B2B); SEO cliff calculators such as [aca-subsidy-guide.vercel.app](https://aca-subsidy-guide.vercel.app/subsidy-cliff-calculator). **None found combines reconciliation of APTC already received, 2026 uncapped math, ranked MAGI rescue with deadlines, document intake and monitoring.**

**Build risk:** **low to medium.** The math is public and fixed. Risks: (a) accuracy and liability (we need "not tax advice" plus a CPA-export framing); (b) a strongly seasonal funnel; (c) lower-income enrollees may not pay (mitigated by focusing on people near the cliff and the self-employed); (d) Congress could retroactively restore caps or the enhanced credits (unlikely by April 2027); (e) CMS API key lead time (manual fallback).

**Scores:** Works 8 · Sell/retention 6 · Clear user 9 · $100M 6 · Originality 8 → **0.4·8 + 0.2·6 + 0.15·9 + 0.15·6 + 0.1·8 = 7.45**

---

### Idea #2: "LoanExit": SAVE-to-RAP/IBR switch engine, plus the tax bomb and the garnishment guard  (weighted **7.05**)

**One-liner:** *"Drop your StudentAid.gov loan file and see in 20 seconds which post-SAVE plan costs you least, when to switch, and the tax bill waiting at forgiveness."*

**Why it's new:** SAVE ended in Mar 2026, RAP started July 1, 2026, IBR has a sunset (reportedly July 2028), and IDR forgiveness became taxable again on Jan 1, 2026. These are new choices with new traps: the new-loan trap, RAP's on-time-payment requirement, and PSLF employer disqualification.

**Persona and trigger:** *Jordan, 33, social worker, $68k AGI, one child, $62k balance in SAVE forbearance.* The servicer notice gives a 90-day window, or the account has already moved to Tiered Standard and the bill jumped. Other triggers: a default or garnishment notice, annual recertification, or planning to borrow again.

**What they pay for, and price:** free comparison. **$29 "Switch Plan"** (exact sequence of forms, consolidation pitfalls, PSLF and buyback checks). **$5/mo "Loan Guard"**: an alert for RAP's on-time-payment window so subsidies aren't lost, recertification reminders, PSLF count tracking, and detection of servicer billing errors by comparing statements with the expected payment.

**Retention loop:** monthly (RAP subsidies depend on each month's on-time payment), annual (recertification and AGI changes), and event-based (new loans, marriage, kids).

**Market math:** about 42M federal borrowers [not re-verified], about 7M from SAVE, and 5.5–9M in default. 2% × 42M × $60/yr ≈ $50M. Refinancing and affiliate revenue (for private-loan holders) and employer channels take it toward $100M.

**60-second magic:** upload `MyStudentData.txt` from StudentAid.gov, or click "Try sample borrower." A side-by-side shows RAP, IBR and Tiered Standard: monthly payment, total paid, forgiveness date, **tax at forgiveness**, and PSLF path, with a recommendation such as "Choose IBR now; RAP becomes cheaper if AGI rises above $X."

**Real core:** deterministic RAP formula (CRS), IBR (10% or 15% of income above 150% FPL [not re-verified for the post-OBBBA eligibility details]), Tiered Standard terms, a month-by-month amortization including RAP's interest waiver and $50 match, eligibility by disbursement date and loan type from the NSLDS file, and a federal tax-at-forgiveness estimate. Claude parses servicer letters, explains, and answers questions. Feasible in 12 hours.

**Competitors (crowded):** StudentAid.gov Loan Simulator (free, official, now includes RAP), Tate Law calculators, College Investor, Student Loan Planner, Savi, Chipper, Summer and Candidly (B2B), and many SEO RAP calculators.

**Build risk:** medium. The rules are high-stakes and some are ambiguous or in litigation (PSLF rule, IBR windows). Collections status keeps changing. Differentiation from the free official simulator is hard.

**Scores:** Works 8 · Sell 6 · Clear 8 · $100M 7 · Originality 4 → **3.2 + 1.2 + 1.2 + 1.05 + 0.4 = 7.05**

---

### Idea #3: "KidStack": the 2026–27 childcare and kids tax-benefit optimizer with a DCFSA autopilot  (weighted **6.2**)

**One-liner:** *"Your benefits enrollment closes this month. Upload the benefits guide and see the exact DCFSA election that beats the new 50% childcare credit, plus every kid dollar you're missing (Trump Account $1,000, Dell $250, employer $2,500)."*

**Why it's new:** the DCFSA limit moved from $5,000 to $7,500 for the first time since 1986. The childcare credit went to 50% with a new phase-down, and the two interact dollar for dollar. Trump Accounts add employer contributions and the $1,000 and $250 seeds. Employer open enrollment is happening **right now** (Nov–Dec 2026).

**Persona and trigger:** *Priya and Sam, 36 and 37, kids aged 2 and 6, $165k AGI, $22k/yr in daycare and after-school care.* HR's enrollment email says the DCFSA is now $7,500. Other triggers: a new baby (seed claim), a monthly daycare invoice (FSA claim), tax season (Form 2441).

**What they pay for, and price:** free election calculator. **$39/yr "Autopilot"**: forward daycare receipts and get pre-filled DCFSA claims plus forfeiture reminders, a year-end Form 2441 worksheet, a Trump Account / 529 / custodial contribution plan, and state childcare credits.

**Retention loop:** monthly (receipts and claims), annual (open enrollment and tax season), events (births, age 13 cutoff, kindergarten).

**Market math:** households paying for childcare, roughly 10–15M [estimate, not verified]. 5% × 12M × $39 ≈ $23M. Expanding into a "family money OS" (CTC, 529, Trump Accounts, paid-leave planning) is needed for $100M. Willingness to pay is moderate because typical savings are $500–$2,500/yr.

**60-second magic:** enter kids' ages, AGI, childcare spend and whether the employer offers a DCFSA, or click a sample family. Output: "Elect $7,500 DCFSA, credit $0: saves $2,6xx. Credit-only: $1,2xx. Your 2025 baby's $1,000 Trump seed is unclaimed (Form 4547)." An optional upload of the benefits PDF lets Claude extract the plan options.

**Real core:** DCFSA value = exclusion × (federal marginal rate + 7.65% FICA + state rate), compared with the credit at the 2026 rate schedule using the $3k/$6k caps minus the DCFSA exclusion. Add CTC and Trump-Account eligibility rules. Deterministic. **The exact 2026 credit phase-down must be verified from the 2026 Form 2441 instructions before building.**

**Competitors:** FSA administrator apps (claims only), free calculators (Keeper, tax47, nationaltaxtools, FedTools, policyrisk), B2B decision support (Jellyvision ALEX, Nayya), Trump Account calculators.

**Build risk:** medium-low technically. Business risk is high: modest savings, seasonality, and the employer must have adopted $7,500.

**Scores:** Works 7 · Sell 5 · Clear 7 · $100M 5 · Originality 6 → **2.8 + 1.0 + 1.05 + 0.75 + 0.6 = 6.2**

---

### Runners-up (scored the same way)

| Idea | Works | Sell | Clear | $100M | Orig | Weighted | Why not top 3 |
|---|---|---|---|---|---|---|---|
| Overtime/tips paycheck auditor + W-4 tuner (W-2 code TT vs. 2025 claim) | 8 | 4 | 8 | 4 | 4 | **6.2** | Calculators are everywhere (TurboTax etc.); hourly workers' willingness to pay is low |
| Parental-leave paycheck planner (new MN/DE/ME programs) | 7 | 4 | 8 | 4 | 6 | 6.0 | One-off per birth; state-by-state rules |
| Skills: "$0 certification" funding finder (Workforce Pell + 529 credentials + §127) | 6 | 4 | 7 | 5 | 8 | 5.8 | Data fragmented; users low-income; better as lead generation |
| Trump Account optimizer | 8 | 3 | 7 | 3 | 5 | 5.8 | Free money, one-time decision, official app exists |
| Medicaid work-requirement compliance helper | 6 | 2 | 8 | 2 | 7 | 5.0 | Users can't pay (B2G/B2B only) |

---

## 4. Recommendation

Build **ClawbackCheck (Idea #1)**. It has the largest per-user dollar shock ($1k–$10k+) and the cleanest "why now" (first uncapped reconciliation; open enrollment through Jan 15; IRA/HSA deadline Apr 15, 2027). The math is fully deterministic, so the 40% "works end-to-end with real value" criterion is easy to meet. The juror demo is very visual (the cliff chart and the slider that shrinks the bill). We found no consumer incumbent. To make it more than a calculator, include: **document intake** (1095-A or eligibility notice through Claude vision), **reconciliation of APTC already received**, a **ranked rescue plan with deadlines**, and **monitoring** (Income Guard). Optionally reuse Idea #3's DCFSA/HSA logic later as a "household cliffs and credits" expansion.

**Before building, verify:** the 2026 IRA and HSA limits, the 2026 FPL table used for 2026 coverage (2025 guidelines), the 2027 applicable-percentage table (if we show 2027 open-enrollment guidance), the CMS Marketplace API key turnaround, and whether any 2026 legislation changed §36B(f) after October 2026.

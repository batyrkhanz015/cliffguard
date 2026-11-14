# Track 03 — SKILLS: opportunity research

*Prepared 2026-11-14 for the 24h hackathon (B2C, web-only, US adults 25–45, Claude API + Next.js on Vercel).*

> **Read this first: method and limits**
> - Research used ~60 web searches plus direct page fetches. The shared session search budget ran out partway through, and **reddit.com could not be fetched** (blocked for automated access). Because of this, **evidence of people asking "is there a tool that…" in their own words is thin for all three final ideas.** Section 6 lists the exact Reddit queries to run by hand in the first hour.
> - Claims marked **(prior knowledge)** come from what I knew before this session and were **not** re-checked here. Verify them before they go on a slide.
> - Partway through, the team coordinator raised the originality bar. Ideas such as AI tutor, negotiation simulator, mock interview, public speaking, new-manager coach, parenting chatbot, brag-doc writer and learning-path generator are now excluded. This document applies that bar: Section 3 shows which candidates failed it and why.

---

## 0. TL;DR

| # | Idea | One-liner | Weighted score | Biggest risk |
|---|---|---|---|---|
| A | **Undersold** | See what *your own employer* pays people in your job, taken from its sworn federal wage filings, and walk into your review with a cited, dollar-figure case. | **7.6 / 10** | Coverage and entity matching: H-1B wage filings exist only for sponsoring employers, and messy employer and title names need careful normalization. |
| B | **LeaveMap** | Upload your handbook's leave policy and a pay stub. Get a week-by-week income calendar and filing deadlines for your parental leave, combining your state's paid-leave formula, FMLA and your employer's short-term disability. | **7.3 / 10** | Correctness of state formulas, and weak B2C money: it is a one-time event, so $100M needs expansion to all leave types or B2B2C. |
| C | **CreditCount** | Drop in your old transcripts. See how many credits 5 adult-friendly online schools will probably accept, the cheapest way to fill the gaps, and your out-of-pocket cost after employer tuition aid. | **6.7 / 10** | Accuracy: schools make the final transfer decision, and curating per-school rules takes real build time. |

**Bet: A (Undersold).** It has the most convincing "real, computed, not faked" demo, because it uses public federal data and does deterministic math. It has a clear reason to pay, with a dollar figure on the screen, and a clear acquisition engine in programmatic SEO over employer × title pages. Its root pain, pay advocacy, is squarely inside the Skills brief. B is the backup if the team wants the most original idea.

---

## 1. What the evidence says about the Skills territory (25–45, working, families)

| Signal | Number | Source |
|---|---|---|
| Core skills expected to change by 2030 | 39% (down from 44% in 2023) | [WEF Future of Jobs 2025, skills chapter](https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/3-skills-outlook/) |
| US workers worried about future AI use at work | 52% worried, 33% overwhelmed; only 6% expect *more* opportunities | [Pew, Feb 2025](https://www.pewresearch.org/social-trends/2025/02/25/u-s-workers-are-more-worried-than-hopeful-about-future-ai-use-in-the-workplace/) |
| AI users who got AI training from their employer | 39%; 66% of leaders wouldn't hire someone without AI skills | [Microsoft/LinkedIn Work Trend Index 2024](https://news.microsoft.com/source/2024/05/08/microsoft-and-linkedin-release-the-2024-work-trend-index-on-the-state-of-ai-at-work/) |
| US employees using AI daily (Q3 2025) | 10%; 45% use it at least a few times a year | [Gallup, Aug 2025, n=23,068](https://www.gallup.com/workplace/699689/ai-use-at-work-rises.aspx) |
| Top barrier to AI adoption | "Unclear use case" (16%). 44% of non-users don't believe AI can help with their work | [eWeek on Gallup](https://www.eweek.com/news/ai-adoption-employees-gallup-poll/) |
| Managers who received the training they need | 44% | [Gallup State of the Global Workplace 2025 via UNLEASH](https://www.unleash.ai/employee-experience-and-engagement/gallups-2025-state-of-the-workforce-report-4-things-hr-needs-to-know/) |
| MOOC completion | ~4% average (Penn, 16 courses); ~19.5% among learners who *intended* to finish (Harvard, per secondary coverage) | [Higher Ed Dive](https://www.highereddive.com/news/mooc-completion-rate-just-4-study-says/202425/) |
| Proof that consumers pay for learning | Coursera consumer revenue $502.2M in FY2025, +10% | [Coursera Q4 2025 shareholder letter](https://s27.q4cdn.com/928340662/files/doc_financials/2025/q4/COUR_Shareholder-Letter_Q4-2025.pdf) |
| People who accept the first salary offer | 55% didn't negotiate their starting salary (Resume Genius 2025) | [Nasdaq/GoBankingRates](https://www.nasdaq.com/articles/over-50-us-workers-dont-negotiate-their-starting-salaries-how-improve-your-offer) |
| People who ever asked for a raise | 37%; about 70% of those who asked got *some* increase (older Payscale data, ~2014–15) | [Payscale Raise Anatomy](https://payscale.com/data/how-to-ask-for-a-raise), [Payscale facts](https://payscale.com/salary-negotiation-guide/8-surprising-facts-about-salary-negotiation) |
| Pay growth, job stayers vs job changers, 2025 | 4.4–4.7% vs 6.3–7.1% | [ADP NER, Aug 2025](https://mediacenter.adp.com/2025-09-04-ADP-National-Employment-Report-Private-Sector-Employment-Increased-by-54,000-Jobs-in-August-Annual-Pay-was-Up-4-4), [ADP NER, Nov 2025 PDF](https://adp-ri-nrip-static.adp.com/artifacts/us_ner/20251203/ADP_NATIONAL_EMPLOYMENT_REPORT_Press_Release_2025_11%20FINAL.pdf) |
| Why people quit | Low pay 63%, no advancement 63% (2021 quitters) | [Pew, Mar 2022](https://www.pewresearch.org/short-reads/2022/03/09/majority-of-workers-who-quit-a-job-in-2021-cite-low-pay-no-opportunities-for-advancement-feeling-disrespected/) |
| Adults with some college but no credential | 37.6M working-age (43.1M total); >1M re-enrolled | [NSC SCNC 2025](https://nscresearchcenter.org/some-college-no-credential/), [EdNC summary](https://www.ednc.org/06-10-2025national-report-details-trends-for-some-college-no-credential-students-in-north-carolina/) |
| Parents' stress | 48% of parents say most days their stress is completely overwhelming (vs 26% of other adults) | [US Surgeon General advisory 2024](https://surgeongeneral.gov/parents) |
| Audience size | ~36.3M employed aged 25–34 and ~37.0M aged 35–44 (2025 CPS, 11-month average because of the shutdown) | [BLS CPS Table 3](https://www.bls.gov/cps/cpsaat03.htm) |
| How often job offers happen | 65.3M hires and 39.2M quits in 2024 | [BLS JOLTS annual, Mar 2025](https://www.bls.gov/news.release/archives/jolts_03112025.htm) |

**Takeaway.** The pains behind the LLM-default Skills ideas are real: AI anxiety, untrained managers, negotiation avoidance and course abandonment. But they are all crowded, and 20 teams will build them. The open space is **systems that adults must master once or rarely, at high stakes, with a document already in hand**: their pay, their leave, their old credits. That is where a computed, grounded product beats a chat.

---

## 2. Candidate pains (14), competitors and gaps

| # | Pain (persona → trigger) | Evidence | Top competitors | Gap they leave | Passes the new bar? |
|---|---|---|---|---|---|
| 1 | Asking for a raise or negotiating an offer | 55% don't negotiate; 37% have ever asked for a raise; lifetime cost of not negotiating estimated at $600K–$1M ([BI/Salary.com](https://www.businessinsider.in/This-One-Mistake-Costs-Workers-1-Million/articleshow/22947508.cms)) | AI role-play apps: [NegotiateIt](https://theresanaiforthat.com/ai/negotiateit/) (~$19/mo), [Salary Sage](https://thedailyworkflow.com/service/Salary%20Sage) (~$20/mo), [PayBoost](https://apps.apple.com/in/app/id6763983947), [Haggle](https://apps.apple.com/in/app/id6761693793). Human services: [Levels.fyi](https://www.levels.fyi/services?from=tech), [Rora](https://www.teamrora.com) | Role-play with no grounded evidence about *your* employer | **No** as a simulator (excluded). **Yes with a new angle → Idea A** |
| 2 | Interview performance | High anxiety; many paid tools | [Final Round AI](https://www.trustpilot.com/review/finalroundai.com) (Trustpilot ~2.8–3.5, billing and refund complaints), Big Interview ($39/mo, $299 lifetime per [gethppy](https://gethppy.com/talent-acquisition/ai-mock-interview-tools-comparison)), [Yoodli](https://yoodli.ai/pricing) | Saturated; "cheating copilot" stigma | **No** (excluded) |
| 3 | New manager's first hard conversation | 44% of managers trained (Gallup). LLM role-play cut escalating tactics ~67% vs a lecture control group ([Stanford "Rehearsal", CHI 2024](https://arxiv.org/abs/2309.12309)) | [Yoodli](https://yoodli.ai/pricing) ($8–20/mo, includes role-plays), [Exec](https://docs.exec.com/platform/plans), Hyperbound (sales; [custom ~$15K/yr](https://omr.com/en/reviews/product/hyperbound/pricing)), BetterUp | B2C individual prep for a real upcoming 1:1 | **No** (excluded) |
| 4 | Keeping up with AI in your own job | Pew 52% worried; Gallup "unclear use case" is the top barrier | [Section ProfAI / Use Case Coach](https://trainingindustry.com/press-release/artificial-intelligence/section-launches-ai-use-case-coach-to-solve-enterprise-ais-use-case-desert/) (role-specific use cases; [$750/yr premium individual](https://help.sectionai.com/hc/en-us/articles/51233146396699-What-is-Section-Coach)), [Rundown University](https://app.therundown.ai/pricing) ($29/mo), Karpathy's occupation exposure map ([CSEP review](https://csep.org/blog/which-jobs-are-at-risk-from-ai-evaluating-karpathys-exposure-dashboard/)) | Task-level, personal, hands-on | **No**: Section already does role-personalized use cases (fails criterion 5) |
| 5 | Automating your own repetitive work ("watch me work") | Same AI evidence | [Screenpipe](https://www.producthunt.com/p/screenpipe/screenpipe-2) ([YC S26 launch](https://hn.nuxt.dev/item/49024620)), [Taskmole](https://neura.market/ai-tools-directory/workflow-productivity/taskmole), [MemoryLane](https://futuretools.io/tools/memorylane-skuiid), ClipTask | A skill-building framing, not agents | **No**: a funded competitor exists (fails 5) |
| 6 | Abandoned online courses | 4% MOOC completion | Coursera, LinkedIn Learning, accountability apps | Completion support | **No** (habit tracker / learning path are excluded) |
| 7 | Public speaking at work | Common | Yoodli, Orai, Poised | — | **No** (excluded) |
| 8 | Parenting skills | Surgeon General 48% overwhelmed | [Good Inside](https://www.fastcompany.com/91305862/dr-becky-good-inside-ai-parenting-app) ($276/yr; [100K+ members, per Foundry citing Fortune](https://www.builtbyfoundry.io/blog/dr-becky-kennedy-good-inside-34m-parenting-app)) | — | **No** (excluded) |
| 9 | **Special education (IEP) for your kid**, which the coordinator suggested as an example | ~7.9M IDEA students in fall 2023 ([K-12 Dive](https://www.k12dive.com/news/special-education-enrollment-keeps-growing/812897/)); advocates charge ~$75–300/hr, per secondary sources ([IL AG guidance](https://www.illinoisattorneygeneral.gov/Page-Attachments/GuidelinesforChoosingLayAdvSpecialEd.pdf) confirms advocates charge hourly or flat fees) | [Undivided IEP Assistant](https://www.undivided.io/iep-assistant/) ($19/mo; analyzes goals, services, baselines), [AdvocateIQ](https://lifestyle.capitalcityrock.com/story/130593/advocateiq-launches-new-platform-to-help-texas-parents-navigate-special-education/) ($49/review, TX), [AIEP](https://innovateschools.org/aiep/) (free, open source), [IEP Compass](https://apps.apple.com/app/id6761731246), SENTINEL·IEP, Arloa | Little left: by late 2026 the space is **crowded** | **No**: fails 5. **Recommendation: don't build this.** It is an obvious idea and at least 6 tools already do it. |
| 10 | **"Am I underpaid at my own company?"** (pay compression for loyal employees) | ADP stayer vs changer gap; Pew 63% quit over pay; [Ask a Manager reader](https://askamanager.org/?p=28506): no raise in 3 years despite new duties | Glassdoor "Know Your Worth" (prior knowledge; self-reported), [Levels.fyi](https://www.levels.fyi/services?from=tech) (tech-centric, self-reported), raw H-1B lookup sites | Nobody turns **the employer's own sworn filings** into a personal audit and case | **Yes → Idea A** |
| 11 | **Parental leave**: a patchwork of state rules that is still changing | Surgeon General stress data; many single-purpose calculators exist ([Aflac broker](https://www.brokersolutions.aflac.com/vip/pregnancy-leave-calculator), [TimeTrex CA](https://www.timetrex.com/?p=55411), [CalcPlanet](https://www.calcplanet.com/finance/parental-leave-pay-calculator/)) | [PaidLeave.AI](https://paidleave.ai) (Moms First; free generic chatbot), B2B leave platforms (Cleo, Maven, Tilt; prior knowledge) | Nothing reads *your* policy and computes *your* weeks | **Yes → Idea B** |
| 12 | **Finishing a degree with old credits** | 37.6M with some college and no credential; 69% of stopped-out adults have considered re-enrolling ([Gallup-Lumina 2025](https://www.gallup.com/file/analytics/660239/Gallup-Lumina%20Foundation-State%20of%20Higher%20Education%202025_Press%20Release.pdf)) | School-run estimators: [Phoenix TransferPath](https://phoenix.edu/tuition-financial-aid/transfer-credits/transfer-college-credit-evaluation.html), [Franklin](https://www.highereddive.com/news/franklin-u-boosts-enrollment-13-with-in-house-system/387500/), [Boise State/EdVisorly](https://www.boisestate.edu/admissions/apply/transfer/eddynavigate/), [DegreeSight](https://www.degreesight.com). Nonprofit: [Ithaka Transfer Explorer](https://sr.ithaka.org/blog/transfer-explorer-is-growing/) | Every tool is one school's sales funnel; none is neutral across schools or does the cost math | **Yes → Idea C** |
| 13 | Layoff severance agreement (21/45-day clock) | Not researched (search budget ran out) | Lawyers, Rora (offers severance counseling) | Computed deadline, age-disclosure and COBRA-vs-ACA math | Runner-up. It is closer to Work/Legal than Skills and carries legal-advice risk |
| 14 | A parent learning the math method in their kid's homework | Not researched | Photomath (Google), Gauth, Khanmigo (prior knowledge) | Parent-facing, curriculum-specific | Runner-up. Jurors will probably read it as "AI tutor" |

---

## 3. Top 3: deep dives

### Idea A: **Undersold**
**Pitch.** Enter your employer, title, city and pay, or drop in an offer letter or pay stub. Undersold pulls your employer's own H-1B wage filings and BLS metro pay data, shows exactly where you sit in dollars, and generates a cited "market adjustment" case before your review.

**Why this survives the negotiation exclusion.** There is no role-play simulator. The product is **computed evidence**: percentiles from federal data plus a document. Role-play could be an optional later feature, but it is not the product.

**Persona and trigger.** Dana, 33, senior financial analyst at a large insurer in Chicago, 4 years in, with 3% merit raises each year, earning $91K, one kid, and a mortgage. **Trigger:** in October her company's careers page lists her exact title at $98K–$125K, because Illinois pay-range posting rules apply (prior knowledge: IL in effect since Jan 2025). Her annual review is in 3 weeks. She doesn't know whether she is "really" underpaid, or how to raise it without sounding greedy.

**The pain, with evidence.**
- Loyal employees fall behind: 2025 pay growth was 4.4–4.7% for job stayers vs 6.3–7.1% for job changers ([ADP](https://mediacenter.adp.com/2025-09-04-ADP-National-Employment-Report-Private-Sector-Employment-Increased-by-54,000-Jobs-in-August-Annual-Pay-was-Up-4-4)).
- Most people never ask: only 37% have ever asked for a raise, and ~70% of those who asked got something ([Payscale](https://payscale.com/data/how-to-ask-for-a-raise)). 55% accepted their first offer without negotiating ([Resume Genius via Nasdaq](https://www.nasdaq.com/articles/over-50-us-workers-dont-negotiate-their-starting-salaries-how-improve-your-offer)).
- Pay is the #1 reason people quit (63%, [Pew](https://www.pewresearch.org/short-reads/2022/03/09/majority-of-workers-who-quit-a-job-in-2021-cite-low-pay-no-opportunities-for-advancement-feeling-disrespected/)).
- In their own words: an [Ask a Manager reader](https://askamanager.org/?p=28506) with no raise in 3 years despite new duties got a one-off bonus instead. Ask a Manager notes that many people go whole careers without asking because they worry about sounding greedy ([AAM salary archive](https://askamanager.org/category/salary/page/4)).
- **Thin spot:** I could not verify Reddit posts of the form "my company posted my job for $X more than I make" (Reddit was not fetchable). See Section 6.

**What they pay for, and the price.** The **Pay Audit + Case File** costs $39 one-time: a percentile chart, the dollar gap, and a PDF with citations to DOL and BLS records. **Pay Watch** costs $79/yr: unlimited audits, an alert when your employer files new wage records or posts your title, and offer comparison when a recruiter calls.
Willingness-to-pay comparables: Levels.fyi negotiation packages (users on Blind report ~$500–$2,000, with a money-back guarantee; [Levels.fyi services](https://www.levels.fyi/services?from=tech), [Blind thread](https://www.teamblind.com/post/levelsfyi-negotiation-service-reviews-w1psciwm)). Rora takes a percentage of the increase ([techinterviewhandbook](https://techinterviewhandbook.org/negotiation)). [Fearless Salary Negotiation](https://fearlesssalarynegotiation.com/coach/) sells coaching to high earners. AI negotiation apps charge ~$19–20/mo. A $3–5K raise makes $39 an easy decision.

**Retention loop.** Honest answer: it is **monthly, not weekly**. Pay Watch works like credit monitoring. DOL releases new filings quarterly, new postings appear at your employer, and the loop restarts with review-season reminders and the 65M hires a year that create offer moments ([JOLTS](https://www.bls.gov/news.release/archives/jolts_03112025.htm)). Annual billing hides the low frequency.

**Rough market math.** ~73M employed aged 25–44 ([BLS](https://www.bls.gov/cps/cpsaat03.htm)); assume about half are salaried white-collar, so ~36M. At 3.5% penetration × $79/yr, that is ~$100M ARR. One-time audits for non-subscribers add more. **Plausible but ambitious.** It needs the SEO engine below to work.

**Acquisition, and does LTV beat CAC?** **Programmatic SEO** generates one page per employer × title × metro from public filings. This is the same traffic engine raw lookup sites already use, and its CAC is close to zero. Add viral TikTok and LinkedIn "I found out what my company pays new hires" moments, plus Reddit career subs. LTV: ~$79 × ~1.8 years ≈ $140 (assumed retention) plus one-time audits. CAC: about $5–15 organic, $30–60 on paid social. **LTV > CAC holds even with paid acquisition.** Claude cost per audit is about $0.02–0.10: Sonnet 5.5 costs $2/$10 per million input/output tokens and a pay-stub PDF adds a few thousand tokens.

**Competitors, and what is genuinely new.** Glassdoor "Know Your Worth" and Payscale give modeled or self-reported estimates (prior knowledge). Levels.fyi is tech-centric and self-reported. H-1B lookup sites show raw tables with no personal analysis. AI negotiation apps are chat role-plays. Pave and Syndio are employer-side B2B. **New:** (1) the anchor is *your own employer's* sworn filings, which must reflect at least the "actual wage" paid to similar workers (prior knowledge: 20 CFR 655.731), (2) the percentile and dollar gap are computed deterministically, (3) the cited case file, (4) watch alerts. **Criterion-5 check:** no funded B2C product does an employer-filings-based personal audit, but Glassdoor and Levels.fyi are adjacent and well known, so jurors may ask "isn't this Glassdoor?". The answer is that this uses filed wages, not self-reported ones.

**Magic moment (<60 seconds, no login).** Click "Try an example" (prefilled with a real employer, "Senior Consultant", "Chicago", $102,000) or type your own. Within ~8 seconds you see a strip chart of real filed wages for that employer, title and metro with your dot at the 19th percentile, "Gap to median: $17,400", the BLS metro 25th/50th/75th percentiles, and a "Download my case (PDF)" button.

**What the real core does.**
- **Data (free, usable within 24h):** DOL OFLC LCA disclosure files, latest FY2026 Q3 (Oct 2025–Jun 2026), Excel with record layouts; PII such as FEINs is removed ([DOL performance data](https://www.dol.gov/agencies/eta/foreign-labor/performance)). BLS OEWS metro × occupation wages (prior knowledge: free download, BLS API key optional). O*NET job titles → occupation codes for title matching (CC BY 4.0, [O*NET database](https://www.onetcenter.org/database.html)). Optional: user-pasted job postings with pay ranges.
- **AI (Claude):** normalize free-text titles to SOC codes and employer aliases ("AMAZON.COM SERVICES LLC" → Amazon); extract base pay from an uploaded pay stub or offer letter (PDF or image); write the cited case. **The percentiles come from code, not the LLM.**
- **Pipeline:** preprocess the yearly files offline into a compact Postgres table (Neon or Supabase free tier) keyed by employer, SOC and metro.

**Build feasibility risk: Medium.** Risks: 2–3h of data wrangling; entity matching; weak coverage for employers that don't sponsor H-1B, with BLS metro data plus pasted postings as the fallback; LCA wages reflect H-1B roles, which may differ in level from the user's role; the adjacency to the "negotiation" exclusion.

**Why another team is unlikely to build it:** it needs a federal-data ETL and an entity-matching step before the first Claude call. The LLM default for this pain is a negotiation chatbot.

| Works (40%) | Sell (20%) | Who (15%) | Money (15%) | New (10%) | **Weighted** |
|---|---|---|---|---|---|
| 8 | 7 | 8 | 7 | 7 | **7.55** |

---

### Idea B: **LeaveMap**
**Pitch.** Upload your employee handbook's leave section and a pay stub. LeaveMap combines them with your state's paid-leave formula, FMLA eligibility and your due date to produce a week-by-week income calendar, a dated filing checklist, and the exact questions to ask HR, all before you tell your manager.

**Persona and trigger.** Maya, 31, UX designer at a 400-person company in Minneapolis, 19 weeks pregnant. Her partner works at a 30-person startup, which is below FMLA's 50-employee threshold. **Trigger:** she plans to tell her manager next week and has no idea how short-term disability, Minnesota's new state Paid Leave program, PTO and FMLA stack, or what she will actually be paid each week.

**The pain, with evidence.**
- There is no federal paid leave. FMLA gives 12 weeks *unpaid*, with eligibility limits (prior knowledge). State programs are a patchwork that keeps changing: per prior knowledge, 13 states plus DC have enacted paid leave laws, Minnesota and Delaware started paying benefits in Jan 2026, Maine in May 2026, and Maryland was delayed. **Verify these dates.**
- Parents are already overloaded: 48% say most days their stress is completely overwhelming ([Surgeon General](https://surgeongeneral.gov/parents)). Among parents who quit jobs, 48% cited childcare ([Pew](https://www.pewresearch.org/short-reads/2022/03/09/majority-of-workers-who-quit-a-job-in-2021-cite-low-pay-no-opportunities-for-advancement-feeling-disrespected/)).
- Demand signal: a long tail of single-purpose leave calculators ([Aflac](https://www.brokersolutions.aflac.com/vip/pregnancy-leave-calculator), [TimeTrex CA](https://www.timetrex.com/?p=55411), [CalcPlanet](https://www.calcplanet.com/finance/parental-leave-pay-calculator/)) and a nonprofit-built Q&A bot ([PaidLeave.AI](https://paidleave.ai)) show people search for this.
- **Thin spot:** Reddit posts in people's own words (r/BabyBumps, r/workingmoms, r/beyondthebump) were not verified. See Section 6.

**What they pay for, and the price.** The **LeaveMap Plan** costs $39 one-time ($49 for a couple plan covering both partners): personal calendar, deadlines, an HR question list, and a document checklist. An optional $7/mo **during leave** adds a payment tracker ("did the state payment arrive, and is it the right amount?") and return-to-work rights.
Willingness-to-pay comparables are weak and indirect: parents pay for parenting support (Good Inside $276/yr), and the B2B leave platforms prove employers pay. **WTP is the main unknown.**

**Retention loop.** It is weekly *within a ~30-week window*: a countdown of tasks before leave (give notice, file the state claim, file the disability claim, add the baby to insurance within the special-enrollment window), weekly pay checks during leave, then return to work. After that it goes quiet until the next life event, so the roadmap is to expand to medical leave, caregiver leave and a second child.

**Rough market math.** ~3.6M US births a year (prior knowledge, CDC) means roughly 4–5M working parents planning leave each year. At 10% × $45, that is ~$20M. **$100M is only plausible with expansion** to all leave types (FMLA-qualifying leave affects millions of workers a year, prior knowledge) **plus B2B2C** licensing to employers, insurers and payroll providers. As pure B2C this idea is not a $100M business.

**Acquisition, and does LTV beat CAC?** SEO on "[state] maternity leave pay calculator", which the existing calculators prove has search volume. Plus pregnancy communities, registry partners and TikTok "what I actually got paid on leave in [state]". LTV is ~$45–60 one-time. **LTV > CAC only with organic and partner channels**, because paid ads in the baby vertical are expensive.

**Competitors, and what is genuinely new.** PaidLeave.AI is a free generic state-law chatbot that does no personal computation and doesn't read your policy. Calculator sites are generic and don't read your policy. State agency calculators cover one program each. Cleo, Maven and Tilt sell to employers (prior knowledge). **New:** the first B2C tool that reads *your* employer policy (Claude with citations back to the handbook text) and runs a deterministic multi-source engine (state formula + disability insurance + PTO + FMLA eligibility for both partners). **Criterion-5 check: passed.** The nearest B2C tool is a free nonprofit chatbot.

**Magic moment (<60 seconds, no login).** Choose state "Minnesota", a due date and a $95K salary, then click "use sample handbook" or upload your own. Within ~20 seconds you get a 20-week calendar colored by pay source with the dollar amount each week, "Your income gap: $X", 9 dated deadlines, and 3 HR questions quoted from the policy (for example, "Does your short-term disability offset against state Paid Leave?").

**What the real core does.**
- **AI (Claude):** reads the handbook PDF and returns structured policy JSON (disability %, waiting period, PTO-first rules, top-up, eligibility) with cited quotes. It also writes the HR questions.
- **Deterministic engine:** state formulas for 3–5 states (CA, NY, NJ, WA, MN), encoded from public statutes and agency pages; FMLA eligibility rules. All sources are public and free. No license or content library is needed.

**Build feasibility risk: Medium.** Risks: getting state formulas right (waiting weeks, offsets, benefit caps); messy handbooks; legal-accuracy expectations, which need prominent "not legal advice" notices and cited sources; overlap with any Family/Money track on the team; weak B2C willingness to pay.

**Why another team is unlikely to build it:** the value lives in a hand-encoded state-benefit engine, not in a prompt. Family-flavored LLM defaults go to a parenting chatbot.

| Works (40%) | Sell (20%) | Who (15%) | Money (15%) | New (10%) | **Weighted** |
|---|---|---|---|---|---|
| 8 | 6 | 9 | 5 | 8 | **7.3** |

---

### Idea C: **CreditCount**
**Pitch.** Drop in your old transcripts and, optionally, your employer's tuition policy. CreditCount estimates how many credits 5 adult-friendly online schools are likely to accept, finds the cheapest way to fill the gaps (exam credit and low-cost courses with ACE credit recommendations), and shows your finish date and out-of-pocket cost after up to $5,250/yr in tax-free employer aid (prior knowledge: IRC §127).

**Persona and trigger.** Marcus, 36, logistics supervisor in Columbus with two kids and 58 credits from 2008–2011. **Trigger:** he is passed over for Operations Manager because the posting requires a bachelor's degree. His employer reimburses tuition, but he has never used it because he can't tell which school "counts" his old credits.

**The pain, with evidence.**
- 37.6M working-age Americans have some college and no credential ([NSC 2025](https://nscresearchcenter.org/some-college-no-credential/)).
- 69% of stopped-out adults have considered re-enrolling, and cost was a reason for leaving for 32% ([Gallup-Lumina 2025](https://www.gallup.com/file/analytics/660239/Gallup-Lumina%20Foundation-State%20of%20Higher%20Education%202025_Press%20Release.pdf), [NASFAA summary](https://www.nasfaa.org/news-item/39061/Report_Cost_Is_Most_Important_Factor_For_Students_When_Deciding_to_Enroll)).
- Demand signal: schools keep building "do my credits transfer?" tools ([Phoenix](https://phoenix.edu/tuition-financial-aid/transfer-credits/transfer-college-credit-evaluation.html), [Franklin](https://www.highereddive.com/news/franklin-u-boosts-enrollment-13-with-in-house-system/387500/), [TESU predictor](https://njbmagazine.com/njb-news-now/tesu-launches-credit-predictor-tool-for-students-pursuing-higher-ed/), [College Transitions calculator](https://www.collegetransitions.com/?p=24561)). Degree-completer communities plan transfers by hand ([DegreeForum thread](https://www.degreeforum.net/mybb/Thread-Find-out-how-RA-credit-transfers-to-TESU?pid=345455)).
- **Thin spot:** posts in r/WGU and r/SNHU in people's own words were not verified, and willingness to pay is unproven.

**What they pay for, and the price.** A free rough estimate, then a $49 **Finish Plan**: per-school breakdown, cheapest gap-fill path, employer-aid schedule, and request letters for official evaluations. An optional $12/mo **Finish Line** during study: course sequencing, reimbursement deadlines (many policies require a grade of B or better and submission within X days), and cheaper-credit swaps. Comparables: people already pay for cheap-credit routes such as monthly course subscriptions and per-exam credit fees (prior knowledge). The large money pool is school enrollment referrals, but that conflicts with neutrality.

**Retention loop.** Term-based (monthly at best), not weekly. **This is the weakest of the three on retention.**

**Rough market math.** 37.6M addressable people, ~1M re-enrolling a year. 300K plans × $49 ≈ $15M. Adding referral fees (assumed $500–1,500 per enrollment) on ~50K enrollments gives $25–75M. **$100M is reachable only with referral revenue.**

**Acquisition, and does LTV beat CAC?** SEO on "will my credits transfer to [school]", degree-completion subreddits and forums, and HR benefit-utilization partnerships. LTV is $49–150. CAC is moderate. It works on organic channels and is risky on paid.

**Competitors, and what is new.** School estimators each cover one school and act as sales funnels. Ithaka Transfer Explorer is a nonprofit covering ~15 institutions, with transcript upload only announced ([Ithaka](https://sr.ithaka.org/blog/transfer-explorer-is-growing/)). DegreeSight and EdVisorly sell to schools. Guild is a B2B employer benefit (prior knowledge). **New:** a neutral comparison across schools, with cheapest-credit shortcuts and the employer-aid math, built for one person. **Criterion-5 check: passed**, since the funded players sell to schools or employers.

**Magic moment (<60 seconds, no login).** Click "use sample transcript" or upload a PDF or photo. Within ~30 seconds you see a table of estimated accepted credits per school, the cheapest path (for example, "School X + 3 exams: finish in 20 months, $6,900 out of pocket after employer aid"), and the requirements still missing.

**What the real core does.** Claude PDF and vision extraction of courses, grades and credits; Claude classification into general-education buckets; deterministic per-school rules (minimum grade, maximum transfer credits, residency, recency) curated from 5 schools' public policy pages; the [College Scorecard API](https://collegescorecard.ed.gov/data/api/) (free api.data.gov key) for tuition and outcomes; public exam credit lists.

**Build feasibility risk: Medium-High.** Curation takes 3–4h. Estimates aren't binding, so the output must show confidence ranges. Transcript formats vary. There is a risk that jurors see an LLM guess as "faked" unless the rules are visibly deterministic.

**Why another team is unlikely to build it:** it is unglamorous and needs hand-curated policy data. The LLM default here is an excluded learning-path generator.

| Works (40%) | Sell (20%) | Who (15%) | Money (15%) | New (10%) | **Weighted** |
|---|---|---|---|---|---|
| 6.5 | 6 | 8 | 6.5 | 7 | **6.7** |

---

## 4. Side-by-side

| | A Undersold | B LeaveMap | C CreditCount |
|---|---|---|---|
| Built on user's document | Pay stub or offer letter | Handbook + pay stub | Transcripts (+ tuition policy) |
| Public data computed | DOL LCA + BLS OEWS + O*NET | State paid-leave statutes + FMLA | College Scorecard + exam credit lists + school policies |
| Specific trigger | Sees own job posted higher / review in 3 weeks | ~20 weeks pregnant, about to tell manager | Denied promotion for lacking a degree |
| Retention | Monthly watch | Weekly for ~30 weeks | Term-based |
| Path to $100M | Plausible (SEO + annual subscription) | Needs expansion / B2B2C | Needs referral revenue |
| Build risk | Medium (ETL) | Medium (formulas) | Medium-High (curation) |
| Skills-track fit | Strong (self-advocacy / negotiation family) | Moderate ("system mastery" per coordinator) | Strong (education) |
| Weighted score | **7.55** | **7.3** | **6.7** |

Claude cost per session for all three is cents, so gross margin is not a concern. Per the claude-api skill (cached 2026-11-03): Sonnet 5.5 $2/$10 per million input/output tokens; Opus 5.5 $4/$20.

---

## 5. Runner-ups (in case a top-3 idea fails verification)
- **Severance decoder.** For a laid-off 38–45-year-old with a 21/45-day signing clock. Upload the agreement and the age disclosure that federal law (OWBPA) requires for group layoffs. Output: computed deadlines, age-disparity statistics from the disclosure table, COBRA vs marketplace premium after the income drop, and a list of terms that are often negotiated. High willingness to pay ($99–149 one-time); an employment lawyer charges hundreds per hour. **Not researched in this session.** It is Work/Legal rather than Skills, carries legal-advice risk, and is negotiation-adjacent. It could score about the same as A if the team accepts that framing.
- **Parent "learn the method" homework decoder.** Photo of the worksheet → identify the curriculum's method → a 2-minute parent lesson plus coaching script. Daily retention, but jurors will likely read it as "AI tutor". Competitor scan not done.

---

## 6. Verify in the first hour (by hand in a browser; Reddit was not reachable from here)
1. **A:** search Reddit for "posted my job" salary higher, "new hire makes more than me", and "underpaid compared to job posting" in r/antiwork, r/jobs, r/careerguidance and r/personalfinance. Record 3–5 quotes with upvote counts. Download one LCA file and check how many rows a common title has in 3 metros, to confirm coverage.
2. **B:** search "maternity leave pay calculator" plus your state in r/BabyBumps, r/workingmoms, r/beyondthebump and r/Minneapolis. Check MN, DE and ME benefit start dates and formulas on the official agency pages. Confirm nobody funded sells B2C leave planning (search Product Hunt and the App Store for "leave planner").
3. **C:** search "is there a tool" credits transfer in r/WGU, r/SNHU and r/college. Collect transfer policy pages for 5 schools.
4. All three: confirm none collides with another track on the team (B may overlap with Family or Money).

---

## 7. Sources
Macro and AI: [WEF 2025](https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/3-skills-outlook/) · [Pew 2025](https://www.pewresearch.org/social-trends/2025/02/25/u-s-workers-are-more-worried-than-hopeful-about-future-ai-use-in-the-workplace/) · [Microsoft WTI 2024](https://news.microsoft.com/source/2024/05/08/microsoft-and-linkedin-release-the-2024-work-trend-index-on-the-state-of-ai-at-work/) · [Gallup AI use](https://www.gallup.com/workplace/699689/ai-use-at-work-rises.aspx) · [Gallup barriers via eWeek](https://www.eweek.com/news/ai-adoption-employees-gallup-poll/) · [LinkedIn WLR 2025](https://learning.linkedin.com/content/dam/me/business/en-us/talent-solutions/resources/pdfs/linkedIn-workplace-learning-report-2025.pdf) · [Higher Ed Dive MOOC](https://www.highereddive.com/news/mooc-completion-rate-just-4-study-says/202425/) · [Coursera Q4 2025](https://s27.q4cdn.com/928340662/files/doc_financials/2025/q4/COUR_Shareholder-Letter_Q4-2025.pdf) · [Section Coach](https://help.sectionai.com/hc/en-us/articles/51233146396699-What-is-Section-Coach) · [Section Use Case Coach](https://trainingindustry.com/press-release/artificial-intelligence/section-launches-ai-use-case-coach-to-solve-enterprise-ais-use-case-desert/) · [Rundown University](https://app.therundown.ai/pricing) · [Karpathy map review](https://csep.org/blog/which-jobs-are-at-risk-from-ai-evaluating-karpathys-exposure-dashboard/) · [Anthropic Economic Index (R package docs; CC-BY data on Hugging Face)](https://cran.rstudio.com/web/packages/aieconindex/index.html) · [O*NET database license](https://www.onetcenter.org/database.html) · [Screenpipe](https://www.producthunt.com/p/screenpipe/screenpipe-2) · [Screenpipe HN](https://hn.nuxt.dev/item/49024620) · [Taskmole](https://neura.market/ai-tools-directory/workflow-productivity/taskmole)

Managers, interviews, speaking: [Gallup managers via UNLEASH](https://www.unleash.ai/employee-experience-and-engagement/gallups-2025-state-of-the-workforce-report-4-things-hr-needs-to-know/) · [Stanford Rehearsal](https://arxiv.org/abs/2309.12309) · [Yoodli pricing](https://yoodli.ai/pricing) · [Exec plans](https://docs.exec.com/platform/plans) · [Hyperbound pricing](https://omr.com/en/reviews/product/hyperbound/pricing) · [Final Round AI Trustpilot](https://www.trustpilot.com/review/finalroundai.com) · [AI mock-interview comparison](https://gethppy.com/talent-acquisition/ai-mock-interview-tools-comparison)

Pay: [Resume Genius via Nasdaq](https://www.nasdaq.com/articles/over-50-us-workers-dont-negotiate-their-starting-salaries-how-improve-your-offer) · [Payscale Raise Anatomy](https://payscale.com/data/how-to-ask-for-a-raise) · [Payscale facts](https://payscale.com/salary-negotiation-guide/8-surprising-facts-about-salary-negotiation) · [ADP Aug 2025](https://mediacenter.adp.com/2025-09-04-ADP-National-Employment-Report-Private-Sector-Employment-Increased-by-54,000-Jobs-in-August-Annual-Pay-was-Up-4-4) · [ADP Nov 2025](https://adp-ri-nrip-static.adp.com/artifacts/us_ner/20251203/ADP_NATIONAL_EMPLOYMENT_REPORT_Press_Release_2025_11%20FINAL.pdf) · [Pew quits](https://www.pewresearch.org/short-reads/2022/03/09/majority-of-workers-who-quit-a-job-in-2021-cite-low-pay-no-opportunities-for-advancement-feeling-disrespected/) · [BI lifetime cost](https://www.businessinsider.in/This-One-Mistake-Costs-Workers-1-Million/articleshow/22947508.cms) · [Levels.fyi services](https://www.levels.fyi/services?from=tech) · [Blind on Levels.fyi](https://www.teamblind.com/post/levelsfyi-negotiation-service-reviews-w1psciwm) · [Rora](https://www.teamrora.com) · [Tech Interview Handbook](https://techinterviewhandbook.org/negotiation) · [Fearless Salary Negotiation](https://fearlesssalarynegotiation.com/coach/) · [NegotiateIt](https://theresanaiforthat.com/ai/negotiateit/) · [Salary Sage](https://thedailyworkflow.com/service/Salary%20Sage) · [PayBoost](https://apps.apple.com/in/app/id6763983947) · [Haggle](https://apps.apple.com/in/app/id6761693793) · [Ask a Manager letter](https://askamanager.org/?p=28506) · [DOL LCA disclosure data](https://www.dol.gov/agencies/eta/foreign-labor/performance) · [BLS JOLTS 2024](https://www.bls.gov/news.release/archives/jolts_03112025.htm) · [BLS CPS Table 3](https://www.bls.gov/cps/cpsaat03.htm)

Family and leave: [Surgeon General advisory](https://surgeongeneral.gov/parents) · [Good Inside (Fast Company)](https://www.fastcompany.com/91305862/dr-becky-good-inside-ai-parenting-app) · [Good Inside (Foundry)](https://www.builtbyfoundry.io/blog/dr-becky-kennedy-good-inside-34m-parenting-app) · [PaidLeave.AI](https://paidleave.ai) · [Aflac leave calculator](https://www.brokersolutions.aflac.com/vip/pregnancy-leave-calculator) · [TimeTrex CA calculator](https://www.timetrex.com/?p=55411) · [CalcPlanet calculator](https://www.calcplanet.com/finance/parental-leave-pay-calculator/)

Special education: [Undivided IEP Assistant](https://www.undivided.io/iep-assistant/) · [AdvocateIQ](https://lifestyle.capitalcityrock.com/story/130593/advocateiq-launches-new-platform-to-help-texas-parents-navigate-special-education/) · [AIEP](https://innovateschools.org/aiep/) · [IEP Compass](https://apps.apple.com/app/id6761731246) · [K-12 Dive IDEA count](https://www.k12dive.com/news/special-education-enrollment-keeps-growing/812897/) · [IL AG advocate guidance](https://www.illinoisattorneygeneral.gov/Page-Attachments/GuidelinesforChoosingLayAdvSpecialEd.pdf)

Degree completion: [NSC SCNC](https://nscresearchcenter.org/some-college-no-credential/) · [EdNC](https://www.ednc.org/06-10-2025national-report-details-trends-for-some-college-no-credential-students-in-north-carolina/) · [Gallup-Lumina 2025](https://www.gallup.com/file/analytics/660239/Gallup-Lumina%20Foundation-State%20of%20Higher%20Education%202025_Press%20Release.pdf) · [NASFAA](https://www.nasfaa.org/news-item/39061/Report_Cost_Is_Most_Important_Factor_For_Students_When_Deciding_to_Enroll) · [Phoenix TransferPath](https://phoenix.edu/tuition-financial-aid/transfer-credits/transfer-college-credit-evaluation.html) · [Franklin](https://www.highereddive.com/news/franklin-u-boosts-enrollment-13-with-in-house-system/387500/) · [Ithaka Transfer Explorer](https://sr.ithaka.org/blog/transfer-explorer-is-growing/) · [Boise State/EdVisorly](https://www.boisestate.edu/admissions/apply/transfer/eddynavigate/) · [DegreeSight](https://www.degreesight.com) · [TESU predictor](https://njbmagazine.com/njb-news-now/tesu-launches-credit-predictor-tool-for-students-pursuing-higher-ed/) · [College Transitions](https://www.collegetransitions.com/?p=24561) · [DegreeForum](https://www.degreeforum.net/mybb/Thread-Find-out-how-RA-credit-transfers-to-TESU?pid=345455) · [College Scorecard API](https://collegescorecard.ed.gov/data/api/)

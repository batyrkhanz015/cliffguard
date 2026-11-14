# Pitch Handoff: CliffGuard deck and presentation

> **For the Claude reading this:** you're helping a teammate build and deliver the **pitch deck** (PDF, **at most 10 slides**) for CliffGuard, our 24-hour hackathon product.
> - Work from this file. Background on the product and the ACA mechanics is in `docs/handoff.md`, and the full product spec is in `docs/spec.md`, if you have the repo.
> - **Never invent a statistic, quote, user count or testimonial.** Every number on a slide must come from §6 (live app numbers) or §9 (sourced facts).
> - Items marked **[verify]** need a source check before they go on a slide. Items marked **[from live app]** must be copied from the running product, not from this file.
> - Write in plain English. Use one idea per slide, with a headline that states the point.

---

## 1. The deliverable and the rules

| Item | Requirement |
|---|---|
| Format | **PDF, at most 10 slides in total, including title and closing**, in 16:9 |
| Must cover | All five judging criteria (§2). Judges score the deck against them |
| Submitted with | The production URL (no login) and the public GitHub repo, all by the team captain |
| Deadline | **Final PDF to the captain by 10:00, Nov 15**. The captain submits by 11:00; the hard deadline is 12:00 |
| Talk length | **Ask the organizers for the time limit.** Default plan: a 3-minute talk, including a 60–90 s live demo |

## 2. How we're judged (map every slide to these)

| Weight | Criterion | What the jury wants to see | Our slides |
|---|---|---|---|
| **40%** | Does it work? | Live end-to-end, real core value (not faked), UX and code quality | 5, 6, 10 (plus the live demo) |
| **20%** | What do we sell? | What the user pays for, and why they come back | 7 |
| **15%** | Who do we sell to? | A sharp problem and a deep understanding of the user | 1, 2, 3 |
| **15%** | Why does it make money? | A big or growing niche, $100M ARR long-term, LTV > CAC | 8 |
| **10%** | Is it new? | Not a copy of an existing business | 4, 9 |

## 3. The product in 30 seconds (for whoever presents)

- **Positioning:** "Take the gig. Keep your health subsidy."
- **Who:** freelancers, gig workers and other families with **variable income** who buy health insurance on **HealthCare.gov**.
- **The 2026 problem:**
  - The government pays part of their premium monthly, based on an income *guess*. At tax time the IRS settles up against real income.
  - **From tax year 2026 there's no cap on paying it back**, and the **400% poverty-line cliff is back**: earn $1 too much and you repay the **whole year's** subsidy.
  - So taking extra work can leave you **poorer than saying no.**
- **What CliffGuard does:**
  1. Shows where you stand against the line.
  2. Answers **"Should I take this gig?"** in dollars.
  3. Builds a **rescue plan of legal moves**, cash-keeping moves first ("Keep my cash"), with exact amounts and deadlines.
  4. **Watches your income monthly** so you never cross by accident.
- **How it works:** a **tested rules engine** does all the math (it reproduces the IRS's own worked example). **Claude** only reads the user's HealthCare.gov notice and explains the result, and a validator blocks any number Claude didn't get from the engine.
- **Pricing:** free diagnosis; **$79/year** (CliffGuard Year, recommended) or a **$59** one-time rescue.

## 4. Slide-by-slide plan (10 slides)

### Slide 1: Hook / title
- **Headline:** **"Take the gig. Keep your health subsidy."**
- **Subline:** "In 2026, an $8,000 freelance gig can leave a family *poorer* than saying no."
- **Visual:** the product name, plus one striking line chart: income on the x-axis, money kept on the y-axis, with the dip into negative (the "loss zone"). Use the app's gig chart screenshot **[from live app]** once available.
- **Speaker (≈15 s):** "Meet Dani, a freelance designer with two kids, insured through HealthCare.gov. A client offers her $12,000 for December. Since this year, that offer is a trap, and nobody warned her."
- **Scores:** Who (15%).

### Slide 2: What changed in 2026 (the cliff)
- **Headline:** "2026 brought back the subsidy cliff, and removed the safety net."
- **Three facts, each with its source in small type (§9):**
  1. **No repayment cap from tax year 2026.** You repay *all* excess subsidy (IRS).
  2. **The 400% cliff is back.** For a family of 4, it's **$128,600**. $1 over means **no subsidy for the whole year**.
  3. The extra pandemic-era subsidies **expired**, and Congress didn't extend them.
- **Visual:** the cliff chart with the red "wall". Dani's repayment is **$2,350 at $128,599 and $9,342 at $128,601** **[from live app]**: two dollars of income cost about $7,000.
- **Speaker (≈20 s):** "Two dollars of extra income, seven thousand dollars of extra tax. That's the cliff."
- **Scores:** Who (15%), New (10%), since the rule itself is new.

### Slide 3: Who it hurts (persona and evidence)
- **Headline:** "The people hit hardest are the ones whose income they can't predict."
- **Content:**
  - **19.2M** people effectuated Marketplace coverage in Feb 2026 (KFF).
  - **26%** of likely Marketplace shoppers have income that swings 20% or more within a year (KFF).
  - **43%** of enrollees plan to work more hours (KFF poll).
  - **Their own words** (use 2 of these):
    - *"I can make anywhere between $20,000 and $45,000 next year. I just don't know."* (legal-aid client, KFF Health News)
    - *"This seems extremely unfair. I was not warned about this…"* (ObamacareFacts reader)
    - Urban Institute's Jason Levitis, on one extra shift that could cost $10k: *"maybe don't take that shift."*
  - **[Human task]** paste **3–5 real Reddit or forum quotes** (r/personalfinance, r/freelance, r/HealthInsurance) with links. Our AI agents can't reach Reddit. Verify each quote is real and recent.
- **Persona box:** Dani, 37, freelance UX designer in Austin TX, married, 2 kids, bronze plan, guessed $105k, now tracking about $122k.
- **Speaker (≈20 s):** "Freelancers, gig workers, small-business owners. Their income is a forecast, not a fact. Today they guess, Google, or turn down work."
- **Scores:** Who (15%).

### Slide 4: Why existing options fail
- **Headline:** "Free calculators stop at the bill. Nobody tells you what to do, or tells you in time."
- **Table:**

| Today's option | What it gives | Why it fails Dani |
|---|---|---|
| Free calculators (StateCalc, healthinsurance.org, NerdWallet, KFF) | The repayment number | No decision, no moves, no monitoring |
| TurboTax / H&R Block | Form 8962 in March | **Too late**: the Dec 31 moves have expired |
| A CPA | Advice in tax season | Too late and too expensive |
| General chatbots | Generic tips | May apply the old capped rules or make arithmetic errors, and never warns you first |
| Turning work down | Safety | Loses real income |

- **Speaker (≈15 s):** "Everyone gives you the bill. Nobody gives you the decision or the plan, while there's still time."
- **Scores:** New (10%).

### Slide 5: The product, the magic moment (show it)
- **Headline:** "One click: where you stand, whether the gig is worth it, and the legal way to say yes."
- **Visual:** 3–4 screenshots in a row **[from live app]**: Result (cliff chart) → Gig check → Rescue plan (Keep my cash on) → Unlocked plan.
- **Key numbers** (from the live app; current expected values are in §6):
  - "Tracking **$122,036**; cliff **$128,600**."
  - "Take the $12k gig and do nothing: keep **$1,321**." With the rescue plan: keep **$8,548**.
  - The rescue plan, Keep my cash ON: bill $3,000 of not-yet-invoiced work in January, buy the laptop she'd buy anyway now, put money in her HSA (bronze plans qualify from 2026).
- **This is where the live demo goes** (script in §5). If the demo fails, the screenshots carry the slide.
- **Scores:** Works (40%).

### Slide 6: Why you can trust the numbers
- **Headline:** "A tested tax engine does the math. AI only reads and explains."
- **Content:**
  - The engine follows the **IRS Form 8962 method** and reproduces published examples exactly:
    - the **IRS's own 2026 draft example** ($71,910 income → $1,529 repayment)
    - **KFF's** family ($745 → $34,463 without the cap)
    - **Morkel Financial's** case ($7,294 vs $3,289)
  - **Claude's role:** reads the HealthCare.gov eligibility notice (the user confirms the numbers) and explains the plan in plain English. A **grounding validator** rejects any number Claude didn't get from the engine.
  - **Legal guardrails:**
    - education, not tax advice;
    - every move is legal and comes with its proof list;
    - **it never helps understate a Marketplace income estimate** (a unit test enforces this).
- **Visual:** a simple diagram: Documents → Claude (reads) → **Rules engine (math, tested)** → Claude (explains) → User.
- **Speaker (≈15 s):** "If we're one dollar off TurboTax, you shouldn't trust us. So the math is code, tested against the IRS's own example, and the AI is never allowed to invent a number."
- **Scores:** Works (40%), New (10%).

### Slide 7: What we sell, and why they come back
- **Headline:** "$79 a year to keep thousands, and a reason to return every month."
- **Pricing table:**

| Free | One-time Rescue **$59** | **CliffGuard Year $79/yr** (recommended) |
|---|---|---|
| Where you stand, gig check, plan preview | + exact amounts, deadlines, proofs, preparer export, AI explanation | + monthly check-ins, cliff alerts, calendar deadlines, next year's estimate, renews each open enrollment |

- **Value line:** Dani's plan keeps **$7,227** more than doing nothing **[from live app]**, so $79 is about 1% of the value.
- **Retention:**
  - lumpy income lands monthly, so there's a 30-second check-in;
  - freelancers already pay quarterly estimated taxes;
  - hard deadlines: Dec 31, Jan 15, Apr 15;
  - a new coverage year every November.
  - Honest framing: monthly for lumpy earners, seasonal for everyone else.
- **Seasonality answer:** annual billing only, with no monthly plan. "The earlier you join, the more you keep": after Dec 31, most moves expire, and the app shows it.
- **Speaker (≈15 s).**
- **Scores:** Sell (20%).

### Slide 8: Market and business model
- **Headline:** "An honest wedge today, a $100M income-cliff engine tomorrow."
- **Unit economics** (all assumptions; label them as such):

| Metric | Value |
|---|---|
| Blended CAC | **~$35** (SEO and engine-generated pages, freelancer creators, CPA partners) |
| Blended first-year ARPU | ~$72 (65% Year, 35% Rescue) |
| Gross margin | ~90% |
| LTV | **~$137** (55% renewal, ~2.2-year life) |
| LTV/CAC | **~3.9x**; payback on day 1 (billed upfront) |

- **Market, bottom-up (be honest; judges respect it):**
  - **The ACA wedge alone:** about 2.0–2.9M variable-income Marketplace households → **a ceiling of about $12–17M ARR**.
  - **The $100M path (2030):** the same income engine applied to other "income cliffs" that bite at **$60–160k household income**:

| Segment | Payers / seats | Price | ARR |
|---|---|---|---|
| ACA variable earners (wedge) | 200k | $79 | ~$16M |
| **Income Guard** for all variable earners: ACA cost-sharing cliffs at 150/200/250% FPL, student-loan payments tied to income (RAP), IRA-deduction phase-outs, the quarterly estimated-tax safe-harbor threshold, dependent-care credit phase-downs, state childcare/CHIP thresholds **[verify each 2026 threshold]** | 650k | $99 | ~$64M |
| B2B2C seats (CPAs, brokers, freelance platforms) | 7M | $3 | ~$21M |
| **Total** | | | **~$100M** |

- **Policy-risk answer:** rules are versioned data, so a law change is a one-file swap. Every new income-tested benefit is another cliff for the same engine.
- **Speaker (≈20 s).**
- **Scores:** Money (15%).

### Slide 9: Why now, and why us
- **Headline:** "2026 is year one of the uncapped cliff, and the clock is running."
- **Why now:**
  - The first tax year ever with uncapped repayment.
  - **Dec 31** ends the cheapest moves (**[from live app]**: "N days left").
  - Open enrollment runs to **Jan 15**.
  - The first uncapped tax returns land Feb–Apr 2027.
- **Why new:** the only product we found that combines all four:
  1. the "should I take this gig?" decision;
  2. an ordered legal optimizer with Keep my cash;
  3. intake from the notice users already have;
  4. monitoring that warns you first.
- **How we built it:** in 24 hours by our team with a **7-agent Claude Code workflow**: researcher, strategist, a judge agent scoring us against this rubric, builder, code reviewer, QA tester, pitch writer. See `CLAUDE.md` and `.claude/agents/` in the repo. Optional; include it only if there's room.
- **Scores:** New (10%), Works (40%, via repo credibility).

### Slide 10: Close
- **Headline:** "Free calculators stop at the bill. CliffGuard gives you the plan, and keeps watching."
- **Content:**
  - the **live URL** with a QR code **[from captain]**;
  - the **GitHub repo** link **[from captain]**;
  - "Try it: click *Try Dani's family*. No login. Test card 4242 4242 4242 4242."
  - team names.
- **Scores:** Works (40%), since judges can test it themselves.

## 5. Live demo script (60–90 s)

Use **Try Dani's family** in an incognito window. Numbers are **[from live app]**; these are the expected values.

| t | Screen | Say / do |
|---|---|---|
| 0:00 | Landing | "Dani, a freelance designer, family of four, HealthCare.gov. A client offers $12,000 for December." Click **Try Dani's family**. |
| 0:08 | Result | "She's tracking $122,036. The cliff is $128,600." Drag the slider across the red wall: "One dollar over, and her April bill jumps from $1,697 to $9,342." |
| 0:22 | Gig check | "Take the gig and do nothing: she keeps $1,321 of $12,000." Drag the gig slider to $8,000: "An $8,000 gig leaves her about $1,500 *poorer* than saying no." |
| 0:35 | Plan | "CliffGuard finds the legal way to say yes. Keep my cash is on: bill $3,000 of not-yet-invoiced work in January, buy the laptop she needed anyway, top up her HSA. She keeps $8,548." |
| 0:50 | Paywall | "$79 a year, billed once." Pay with 4242 4242 4242 4242 → unlocked plan with exact amounts, deadlines and the preparer export. |
| 1:05 | Close | "Free calculators stop at the bill. CliffGuard gives Dani the plan, and keeps watching." |

- **Don't say "retainer".** Invoice timing only covers work not yet invoiced. A payment that's already available counts for 2026 (the constructive-receipt rule).
- **Backup:** record a ≤2-minute screen video of this exact path the night before. Put it in the deck (as a link or embed) and in the README.
- If the paywall isn't live at demo time, stop after the plan preview and show the unlocked-plan screenshot.

## 6. Numbers to use, and where they come from

**Copy final numbers from the live app** after the v1 deploy (~00:30). These are the engine's expected outputs today (spec fixtures):

| What | Value | Where in the app |
|---|---|---|
| Dani's projected counted income (MAGI) | $122,036 | Result headline |
| Cliff, family of 4 (2026) | $128,600 | Result headline |
| Headroom under the cliff | $6,564 | Result headline |
| April repayment if nothing changes | $1,697 | Result headline |
| Repayment one dollar over the cliff | $9,342 | Slider past the wall |
| $12k gig, do nothing: amount kept | $1,321 | Gig check |
| $12k gig with the rescue plan (Keep my cash) | $8,548 | Gig check / plan |
| With SEP-IRA first (Keep my cash off) | $9,083, of which $5,590 is in retirement | Plan |
| $8k gig, do nothing | −$1,668 (engine) → **say "about $1,500 poorer"** | Gig chart |
| Plan value vs doing nothing | $7,227 | Paywall value line |

- **The QBI caveat:** gig figures are a **rough federal estimate** that leaves out the small-business (QBI) deduction and state tax. With QBI, the $8k loss is about $1,490 and the kept amount about $1,589. That's why the talk says **"about $1,500 poorer"**. Slides that show exact engine numbers carry the footnote "rough federal estimate".
- **The 403% example ($7,294 vs $3,289) is from Morkel Financial.** Don't attribute it to Instead.

## 7. Q&A prep (likely judge questions)

| Question | Answer |
|---|---|
| "Free calculators already do this." | "They give the bill. We give the decision ('take the gig?'), the legal plan with amounts and deadlines, and monitoring that warns you before you cross." |
| "The market is shrinking (CBO: 13.1M in 2027)." | "Agreed, and we size the ACA wedge honestly at $12–17M. The asset is the income-cliff engine; the $100M is variable earners facing many cliffs, plus B2B2C." |
| "What if Congress restores the subsidies?" | "Rules are versioned data, so a swap is a one-file change. Even then, cost-sharing cliffs, student-loan payments and estimated taxes remain. Every income-tested benefit is a cliff." |
| "Is this tax advice? Liability?" | "Education, not advice. We show the formulas, every move is legal with its proof list, there's an export for your preparer, and we never help understate an estimate (unit-tested)." |
| "Why would anyone pay $79?" | "Dani's plan keeps about $7,000 more. Comparable: AI tax planning (Instead) starts at $16/month." |
| "Annual tax event, so why monthly?" | "Lumpy income lands monthly, freelancers already pay quarterly estimated taxes, and the hard deadlines are Dec 31, Jan 15 and Apr 15. We bill annually, so seasonality doesn't hurt revenue." |
| "Why not just ask ChatGPT?" | "It can apply outdated rules, its math varies, and it only answers when asked. People don't know to ask. We warn first, with tested math." |
| "How accurate is it?" | "It reproduces the IRS's own 2026 worked example and published KFF/Morkel cases exactly. 'How we got this' shows the Form 8962 lines." |
| "Privacy?" | "No names or SSNs. Uploaded documents are never stored; only numbers the user confirms. 'Delete my data' is one click." |
| "State exchanges (CA, NY…)?" | "The federal reconciliation is identical. We warn that state top-up subsidies aren't modeled yet." |

## 8. Design guidance

- **Match the live app's look.** Take screenshots after ~22:30 and reuse its colors. The one strong accent is **red for the cliff wall**; everything else is calm and trustworthy.
- One message per slide, big numbers, under 25 words of body text per slide. The details go in speaker notes.
- Sources go in small grey text at the bottom of the slide they support.
- **Tool:** any (Google Slides, Keynote, PowerPoint, Canva, or Claude's slide/deck tools). **Export to PDF** and check the page count is at most 10.
- Use real screenshots, not mockups. The jury checks the live product against the deck.

## 9. Sourced facts (use with these citations)

| Fact | Source |
|---|---|
| No repayment cap from tax year 2026 | IRS: https://www.irs.gov/tax-professionals/eitc-central/repayment-caps-eliminated-for-excess-advance-payments-of-the-premium-tax-credit |
| How reconciliation works (Form 8962, 1095-A) | https://www.healthcare.gov/taxes-reconciling |
| Report income changes within 30 days | 45 CFR 155.330: https://www.law.cornell.edu/cfr/text/45/155.330 |
| Penalties for false estimates; good-faith defense | 45 CFR 155.285: https://www.law.cornell.edu/cfr/text/45/155.285 |
| KFF family example ($745 → $34,463) | https://www.kff.org/affordable-care-act/marketplace-enrollees-with-unpredictable-incomes-could-face-bigger-penalties-under-house-reconciliation-bill-provision/ |
| Morkel example ($7,294 vs $3,289) | https://morkelfinancial.com/blog/excess-premium-tax-credit-repayment-2026 |
| Bronze/catastrophic plans HSA-eligible from 2026 (IRS Notice 2026-5) | https://kpmg.com/us/en/taxnewsflash/news/2025/12/notice-2026-5-expanded-hsa-eligibility-under-obbba.html |
| 2026 HSA $4,400/$8,750, IRA $7,500, SEP $72,000 | https://www.kiplinger.com/retirement/retirement-planning/changes-to-iras-401ks-hsas-in-2026 |
| 19.2M effectuated enrollment (Feb 2026); 26% income swings; 43% plan more hours; CBO 13.1M in 2027 | KFF / KFF Health News / CBO: see `research/track-01-money.md` and `research/new-rules-radar.md` for the exact links **[verify links before use]** |
| Cliff values ($62,600 single; $128,600 family of 4) | HHS 2025 poverty guidelines × 4: see `research/tax-tables-2026.md` |
| "maybe don't take that shift" (Jason Levitis) | KFF Health News, via `research/track-01-money.md` **[verify link]** |

## 10. Don't claim
- Any user count, testimonial, traction or revenue we don't have.
- "AI calculates your taxes." The **engine** calculates; Claude reads and explains.
- That we look up premiums by ZIP code (we don't; the benchmark comes from the user's own notice).
- "Tax advice", "guaranteed savings", or anything that suggests lowering a Marketplace estimate.
- That the 403% example is from Instead (it's Morkel Financial).

## 11. Timeline for the presenter

| When | What |
|---|---|
| Now → 22:30 | Draft slides 1–4 and 7–9; they don't depend on the app. Collect the Reddit quotes (human task) |
| ~22:30 | First live version: screenshot the landing, result, gig check and plan preview from the production URL (captain shares it) |
| ~00:30 | v1 with paywall, unlocked plan and check-in: take the final screenshots and **copy the final numbers into §6's slides** |
| By 09:00 | Record the ≤2-min backup demo video. Rehearse the 3-minute talk twice, once with a failed-demo fallback |
| **10:00** | Final PDF (at most 10 slides) to the captain |
| 11:00 | Captain submits the deck, URL and repo |

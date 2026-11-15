# CliffGuard: verified tax and ACA figures for tax year 2026, with 2027 projections

Researched 2026-11-14. These are the numbers the rules engine may hard-code. Every figure carries a source link and one of these labels:

- **[primary]**: read directly in an IRS, HHS, CMS, Federal Register or US Code (LII mirror) document.
- **[primary-draft]**: from an IRS draft (marked "DRAFT, do not file"). The IRS says drafts of instructions "usually have some additional changes before their final release."
- **[derived]**: arithmetic on primary figures. The arithmetic is shown.
- **[secondary]**: found only in non-government sources.
- **[unverified]**: not confirmed in this pass.

---

## 0. Legal status check (read this first)

- **The enhanced ARPA/IRA subsidies expired after 2025.** The temporary table in IRC §36B(b)(3)(A)(iii) applies only "after December 31, 2020, and before January 1, 2026" ([26 USC 36B, LII](https://www.law.cornell.edu/uscode/text/26/36B)). **[primary]**
- **Nothing has replaced them for 2026 or 2027.**
  - On Jan 8, 2026 the House passed a 3-year extension, 230–196 ([Axios](https://www.axios.com/2026/01/08/house-pass-aca-obamacare-subsidies-extension)).
  - The Senate has not acted. A Nov 5, 2026 source says no law restores the enhanced credits for 2027 ([taxpayers.net](https://taxpayers.net/guides/aca-subsidy-status-2027), [healthinsurancenetwork.org](https://healthinsurancenetwork.org/guide/will-aca-subsidies-come-back)).
  - **[secondary]** Re-check before the pitch. A new Congress takes office in Jan 2027, and the 2026 midterms reportedly flipped the Senate. Any change would most plausibly affect 2027, not 2026.
- **The IRS's own 2026 Form 1040-ES** (the 2026 estimated-tax package) says: "If your household income is more than 400% of the federal poverty line, you are no longer eligible for the premium tax credit" and "There is no longer a limit on the amount you will have to pay back if you received too much in advanced credit; this is true even if your household income is less than 400% of the federal poverty line" ([2026 Form 1040-ES, p.3](https://www.irs.gov/pub/irs-pdf/f1040es.pdf)). **[primary]**
- **Naming:** some IRS pages now call P.L. 119-21 the **"Working Families Tax Cuts Act"** rather than OBBBA ([IRS EITC Central page](https://www.irs.gov/tax-professionals/eitc-central/repayment-caps-eliminated-for-excess-advance-payments-of-the-premium-tax-credit)). Cite **P.L. 119-21 §71305** in code comments so the reference doesn't depend on the name.

---

## 1. HHS poverty guidelines

### 1a. 2025 guidelines → used for 2026 coverage and the 2026 PTC

Source: [90 FR 5917–5918, Jan 17, 2025 (FR Doc. 2025-01377)](https://www.govinfo.gov/content/pkg/FR-2025-01-17/html/2025-01377.htm). **[primary]**

These are reproduced as Tables 1-1, 1-2 and 1-3 of the [2026 draft Form 8962 instructions](https://www.irs.gov/pub/irs-dft/i8962--dft.pdf) (dated Oct 20, 2026), which state: "For 2026, the 2025 federal poverty lines are used for this purpose." **[primary-draft]**

| Size | 48 states + DC | Alaska | Hawaii |
|---|---|---|---|
| 1 | 15,650 | 19,550 | 17,990 |
| 2 | 21,150 | 26,430 | 24,320 |
| 3 | 26,650 | 33,310 | 30,650 |
| 4 | 32,150 | 40,190 | 36,980 |
| 5 | 37,650 | 47,070 | 43,310 |
| 6 | 43,150 | 53,950 | 49,640 |
| 7 | 48,650 | 60,830 | 55,970 |
| 8 | 54,150 | 67,710 | 62,300 |
| Each additional person | +5,500 | +6,880 | +6,330 |

### 1b. 400% FPL cliff for 2026 coverage [derived = 4 × table 1a]

| Size | 48 states + DC | Alaska | Hawaii |
|---|---|---|---|
| 1 | **62,600** | 78,200 | 71,960 |
| 2 | 84,600 | 105,720 | 97,280 |
| 3 | **106,600** | 133,240 | 122,600 |
| 4 | **128,600** | 160,760 | 147,920 |
| 5 | 150,600 | 188,280 | 173,240 |
| 6 | 172,600 | 215,800 | 198,560 |
| 7 | 194,600 | 243,320 | 223,880 |
| 8 | 216,600 | 270,840 | 249,200 |
| Each additional person | +22,000 | +27,520 | +25,320 |

**Check against the brief: $62,600 (single), $106,600 (3) and $128,600 (4) are all confirmed.**

### 1c. 2026 guidelines → for projecting 2027 coverage

Source: [91 FR 1797–1798, Jan 15, 2026 (FR Doc. 2026-00755)](https://www.govinfo.gov/content/pkg/FR-2026-01-15/html/2026-00755.htm), effective Jan 13, 2026. **[primary]**

The 400% column is **[derived]**. Using the 2026 guidelines for 2027 coverage follows the same "prior-year guidelines" pattern as 1a.

| Size | 48 + DC | 400% | Alaska | 400% | Hawaii | 400% |
|---|---|---|---|---|---|---|
| 1 | 15,960 | 63,840 | 19,950 | 79,800 | 18,360 | 73,440 |
| 2 | 21,640 | 86,560 | 27,050 | 108,200 | 24,890 | 99,560 |
| 3 | 27,320 | 109,280 | 34,150 | 136,600 | 31,420 | 125,680 |
| 4 | 33,000 | 132,000 | 41,250 | 165,000 | 37,950 | 151,800 |
| 5 | 38,680 | 154,720 | 48,350 | 193,400 | 44,480 | 177,920 |
| 6 | 44,360 | 177,440 | 55,450 | 221,800 | 51,010 | 204,040 |
| 7 | 50,040 | 200,160 | 62,550 | 250,200 | 57,540 | 230,160 |
| 8 | 55,720 | 222,880 | 69,650 | 278,600 | 64,070 | 256,280 |
| Each additional | +5,680 | +22,720 | +7,100 | +28,400 | +6,530 | +26,120 |

```json
{
  "fpl2025": {
    "guidelineYear": 2025, "usedForCoverageYear": 2026,
    "source": "https://www.govinfo.gov/content/pkg/FR-2025-01-17/html/2025-01377.htm",
    "contiguous": { "bySize": [15650, 21150, 26650, 32150, 37650, 43150, 48650, 54150], "perAdditional": 5500 },
    "alaska":     { "bySize": [19550, 26430, 33310, 40190, 47070, 53950, 60830, 67710], "perAdditional": 6880 },
    "hawaii":     { "bySize": [17990, 24320, 30650, 36980, 43310, 49640, 55970, 62300], "perAdditional": 6330 }
  },
  "fpl2026": {
    "guidelineYear": 2026, "usedForCoverageYear": 2027,
    "source": "https://www.govinfo.gov/content/pkg/FR-2026-01-15/html/2026-00755.htm",
    "contiguous": { "bySize": [15960, 21640, 27320, 33000, 38680, 44360, 50040, 55720], "perAdditional": 5680 },
    "alaska":     { "bySize": [19950, 27050, 34150, 41250, 48350, 55450, 62550, 69650], "perAdditional": 7100 },
    "hawaii":     { "bySize": [18360, 24890, 31420, 37950, 44480, 51010, 57540, 64070], "perAdditional": 6530 }
  }
}
```

Formula: `fpl(size) = size <= 8 ? bySize[size-1] : bySize[7] + (size-8) * perAdditional`. The 8962 instructions give an example: family of 11 → 54,150 + 3 × 5,500 = **70,650**.

---

## 2. Applicable-percentage tables

### 2a. 2026 table: Rev. Proc. 2025-25 §3.01 [primary]

Source: [IRB 2025-32](https://www.irs.gov/irb/2025-32_IRB). It is also published as Table 2 of the [2026 draft 8962 instructions](https://www.irs.gov/pub/irs-dft/i8962--dft.pdf).

| Household income (% FPL) | Initial | Final |
|---|---|---|
| Less than 133% | 2.10% | 2.10% |
| At least 133% but less than 150% | 3.14% | 4.19% |
| At least 150% but less than 200% | 4.19% | 6.60% |
| At least 200% but less than 250% | 6.60% | 8.44% |
| At least 250% but less than 300% | 8.44% | 9.96% |
| At least 300% but not more than 400% | 9.96% | 9.96% |

**The 9.96% top rate for 300–400% is confirmed.** The 2026 required contribution percentage (employer-affordability test) is also 9.96%.

There is no 2026 row above 400%. Those households are not applicable taxpayers.

### 2b. 2027 table: Rev. Proc. 2026-26 §3.01 [primary]

Source: [irs.gov/pub/irs-drop/rp-26-26.pdf](https://www.irs.gov/pub/irs-drop/rp-26-26.pdf), read in full. It is "effective for taxable years and plan years beginning in calendar year 2027."

| Household income (% FPL) | Initial | Final |
|---|---|---|
| Less than 133% | 2.15% | 2.15% |
| At least 133% but less than 150% | 3.23% | 4.30% |
| At least 150% but less than 200% | 4.30% | 6.78% |
| At least 200% but less than 250% | 6.78% | 8.66% |
| At least 250% but less than 300% | 8.66% | 10.22% |
| At least 300% but not more than 400% | 10.22% | 10.22% |

The 2027 required contribution percentage is **10.22%**. The Rev. Proc. says the failsafe in §36B(b)(3)(A)(ii)(III) applies for 2027, and that the premium-growth measure now includes individual-market premiums (per the 2025 Marketplace Integrity rule).

### 2c. Interpolation and rounding

- **Linear interpolation.** "An applicable percentage within an income category increases on a sliding scale in a linear manner" and "is rounded to the nearest one-hundredth of one percent" ([26 CFR 1.36B-3(g)(1), LII](https://www.law.cornell.edu/cfr/text/26/1.36B-3)). **[primary]**
- **The FPL percentage is truncated to a whole number before the lookup.** Worksheet 2 of the 8962 instructions says: "Do not round; instead, multiply this number by 100 … and then drop any numbers after the decimal point," with the examples 0.9984→99, 1.8565→185 and 3.997→399.
- **The cliff test compares dollars, not truncated percentages.** "Is the amount on line 1 more than the amount on line 3 [FPL × 4.0]? Yes … Enter 401." **[primary-draft]**

Test vectors copied from the IRS 2026 Table 2 (applicable figure for a whole-number Line 5). Use these as unit tests. **[primary-draft]**

| Line 5 | Figure | Line 5 | Figure | Line 5 | Figure |
|---|---|---|---|---|---|
| <133 | 0.0210 | 160 | 0.0467 | 250 | 0.0844 |
| 133 | 0.0314 | **175** | **0.0540** | 263 | 0.0884 |
| 136 | 0.0333 | 200 | 0.0660 | 288 | 0.0960 |
| 142 | 0.0370 | 202 | 0.0667 | 299 | 0.0993 |
| 150 | 0.0419 | 229 | 0.0767 | 300–400 | 0.0996 |

175% is exactly half-way: 4.19 + 25 × (2.41/50) = **5.395 → 5.40**. This confirms round-half-up, and naive floating point can produce 5.39 here. **Use integer basis points:**

`bp = round_half_up((initBp*(hi-lo) + (pct-lo)*(finBp-initBp)) / (hi-lo))`

```json
{
  "applicablePct2026": {
    "source": "Rev. Proc. 2025-25 sec. 3.01",
    "unit": "basisPointsOfIncome (1 bp = 0.01%)",
    "bands": [
      { "fromPct": 0,   "toPct": 133, "toInclusive": false, "initialBp": 210, "finalBp": 210 },
      { "fromPct": 133, "toPct": 150, "toInclusive": false, "initialBp": 314, "finalBp": 419 },
      { "fromPct": 150, "toPct": 200, "toInclusive": false, "initialBp": 419, "finalBp": 660 },
      { "fromPct": 200, "toPct": 250, "toInclusive": false, "initialBp": 660, "finalBp": 844 },
      { "fromPct": 250, "toPct": 300, "toInclusive": false, "initialBp": 844, "finalBp": 996 },
      { "fromPct": 300, "toPct": 400, "toInclusive": true,  "initialBp": 996, "finalBp": 996 }
    ],
    "requiredContributionPctBp": 996
  },
  "applicablePct2027": {
    "source": "Rev. Proc. 2026-26 sec. 3.01",
    "unit": "basisPointsOfIncome (1 bp = 0.01%)",
    "bands": [
      { "fromPct": 0,   "toPct": 133, "toInclusive": false, "initialBp": 215,  "finalBp": 215 },
      { "fromPct": 133, "toPct": 150, "toInclusive": false, "initialBp": 323,  "finalBp": 430 },
      { "fromPct": 150, "toPct": 200, "toInclusive": false, "initialBp": 430,  "finalBp": 678 },
      { "fromPct": 200, "toPct": 250, "toInclusive": false, "initialBp": 678,  "finalBp": 866 },
      { "fromPct": 250, "toPct": 300, "toInclusive": false, "initialBp": 866,  "finalBp": 1022 },
      { "fromPct": 300, "toPct": 400, "toInclusive": true,  "initialBp": 1022, "finalBp": 1022 }
    ],
    "requiredContributionPctBp": 1022
  }
}
```

---

## 3. Excess APTC repayment for tax year 2026: no cap [primary]

- **Statute.** P.L. 119-21 §71305(a), (b)(1) struck the §36B(f)(2)(B) limitation, "for taxable years beginning after December 31, 2025." Current §36B(f)(2): if advance payments exceed the credit, "the tax imposed by this chapter for the taxable year shall be increased by the amount of such excess" ([LII 26 USC 36B and amendment notes](https://www.law.cornell.edu/uscode/text/26/36B)).
- **IRS page** (updated 07-Oct-2026): "Beginning with tax year 2026, the taxpayer must repay the full amount of any excess advance payments of the premium tax credit (APTC). The repayment limits that previously capped how much taxpayers had to pay back no longer apply." ([IRS](https://www.irs.gov/tax-professionals/eitc-central/repayment-caps-eliminated-for-excess-advance-payments-of-the-premium-tax-credit))
- **2026 draft 8962 instructions:** "For tax years beginning after 2025, if the advance payments of the PTC made on a taxpayer's behalf exceed the PTC allowed for the year, the taxpayer must repay the full excess amount … The former repayment limitations … no longer apply." **[primary-draft]**
- **2026 draft Form 8962** (created 4/21/26): line 27 says "Enter the difference here and on Schedule 2 (Form 1040), line 1a." **Lines 28 and 29 are "Reserved for future use."** ([f8962 draft](https://www.irs.gov/pub/irs-dft/f8962--dft.pdf)) **[primary-draft]**

For a "what the old rules would have capped" comparison in the UI only, the **2025** Table 5 caps were ([2025 i8962](https://www.irs.gov/instructions/i8962)) **[primary]**:

| Line 5 (2025) | Single | Other filing statuses |
|---|---|---|
| <200 | $375 | $750 |
| 200 to <300 | $975 | $1,950 |
| 300 to <400 | $1,625 | $3,250 |
| ≥400 | no cap | no cap |

---

## 4. PTC MAGI and household income [primary]

- **MAGI** (§36B(d)(2)(B)): AGI increased by
  - (i) amounts excluded under §911 (foreign earned income and housing),
  - (ii) tax-exempt interest, and
  - (iii) Social Security benefits not included in gross income under §86 ([LII](https://www.law.cornell.edu/uscode/text/26/36B)).
- **2026 draft Worksheet 1-1** (taxpayer MAGI) = Form 1040 line 11a AGI + line 2a tax-exempt interest + Form 2555 lines 45 and 50 + (line 6a − line 6b, if positive). **[primary-draft]**
- **Household income** (§36B(d)(2)(A)) = the taxpayer's MAGI (both spouses if filing jointly) plus the MAGI of each claimed dependent "who is required to file an income tax return because their income meets the income tax return filing threshold." It "does not include the modified AGI of those individuals whom you claim as dependents and who are filing a 2026 return only to claim a refund of withheld income tax or estimated tax" (2026 draft i8962). **[primary-draft]**
- **Line 3:** "Combine them even if one or both of them are negative. If the total is less than zero, enter -0-." **[primary-draft]**
- **Family size** = the number of people for whom the taxpayer claims a personal exemption deduction under §151 (§36B(d)(1)). Someone who can be claimed as a dependent by another taxpayer is excluded from their own tax family. **[primary]**

---

## 5. Form 8962 logic for 2026

Source: [2026 draft Form 8962](https://www.irs.gov/pub/irs-dft/f8962--dft.pdf) and [2026 draft instructions, Oct 20, 2026](https://www.irs.gov/pub/irs-dft/i8962--dft.pdf). **[primary-draft]** The final 2026 instructions were not yet out on 2026-11-14. Where the 2025 final instructions say the same thing, that is noted.

1. **Line 1:** tax family size.
   **Line 2a/2b:** MAGI (taxpayer / dependents required to file).
   **Line 3:** household income, floored at 0.
2. **Line 4:** FPL from Table 1-1, 1-2 or 1-3 (the 2025 guidelines).
3. **Line 5:** if HI > 4 × FPL, enter **401** (no PTC). Otherwise `floor(HI*100/FPL)`, truncated.
4. **Line 6:** if line 5 = 401, "You are not eligible to take the PTC." All APTC becomes excess: line 24 = 0, and lines 25 and 27 = total APTC.
5. **Line 7:** the applicable figure (Table 2, four decimals).
6. **Line 8a:** HI × line 7, "Round to nearest whole dollar."
   **Line 8b:** line 8a ÷ 12, "Round to nearest whole dollar."
7. **Line 10 (annual or monthly):** you may use the annual line 11 **only** if, for each plan, there was enrollment in all 12 months, the same enrollment premium every month, and the same SLCSP premium every month. "If you were enrolled … for fewer than 12 months during 2026, check 'No'" and use lines 12–23. The 2025 final instructions have the same rule.
8. **Per month (or annually on line 11):**
   - (a) enrollment premium (1095-A col A)
   - (b) SLCSP (col B)
   - (c) contribution (line 8b monthly, or line 8a annual)
   - (d) = max(0, b − c)
   - **(e) PTC = smaller of (a) or (d)**
   - (f) APTC (col C)
   - Regulation: the premium assistance amount is "the lesser of" the enrollment premiums or the benchmark premium minus 1/12 of HI × applicable percentage ([26 CFR 1.36B-3(d)](https://www.law.cornell.edu/cfr/text/26/1.36B-3)).
   - A month counts only if a QHP is in force "on the first day of the month."
9. **Line 24** = Σe. **Line 25** = Σf.
   - If 24 > 25, line 26 = the net PTC → **Schedule 3, line 9**.
   - If 25 > 24, **line 27** = 25 − 24 → **Schedule 2 (Form 1040), line 1a**, uncapped.
10. **IRS worked example (Allocation Situation 4, 2026 draft):**
    - HI $71,910, family of 2 (FPL $21,150) → 340% → figure 0.0996 → contribution $7,162 (71,910 × 0.0996 = 7,162.24).
    - SLCSP $9,600 → PTC = min($2,438, $10,400) = **$2,438**.
    - APTC $3,967 → excess **$1,529**.
    - **Use this as a regression test.**

Other rules:

- **Catastrophic plans are not QHPs for PTC purposes.** "Catastrophic health plans and stand-alone dental plans purchased through the Marketplace, and all plans purchased through the Small Business Health Options Program (SHOP), are not qualified health plans for purposes of the PTC." **[primary-draft]**
- **Special enrollment period disallowance (P.L. 119-21 §71304, 2026+):** no PTC for coverage "enrolled in through a Marketplace special enrollment period that is based on expected household income in relation to the federal poverty line, unless the enrollment is associated with a qualifying life event." **[primary-draft]**

---

## 6. HSA, 2026

| Item | Value | Source / label |
|---|---|---|
| Self-only limit | **$4,400** | [Rev. Proc. 2025-19 §2.01](https://www.irs.gov/pub/irs-drop/rp-25-19.pdf) [primary] |
| Family limit | **$8,750** | same [primary] |
| HDHP minimum deductible | $1,700 self / $3,400 family | same [primary] |
| HDHP out-of-pocket maximum | $8,500 self / $17,000 family | same [primary]. Does **not** apply to bronze or catastrophic plans; see below |
| Catch-up (age 55+ at year end) | **+$1,000** | [Pub 969 (2025)](https://www.irs.gov/publications/p969): "your contribution limit is increased by $1,000." Statutory and not indexed. [primary, 2025 edition] |
| Bronze and catastrophic plans | Treated as HDHPs "for months beginning after December 31, 2025" if "available as individual coverage through an Exchange," **even if** they fail the deductible or out-of-pocket tests (A-4). Also covers off-Exchange copies of Exchange plans (A-6, A-7) and ICHRA-funded purchases (A-5). **Not** SHOP (A-8). | [IRS Notice 2026-5](https://www.irs.gov/pub/irs-drop/n-26-05.pdf), OBBBA §71307 [primary] |
| Direct primary care | A DPC arrangement costing ≤ $150/month (≤ $300 for more than one person) does not disqualify you (2026 amounts) | Notice 2026-5 [primary] |
| Proration | If you were not eligible on the first day of the last month, the limit = Σ(monthly limit for each month eligible on the 1st) ÷ 12, via the Line 3 Limitation Chart | [i8889 (2025)](https://www.irs.gov/instructions/i8889) [primary, 2025 edition] |
| Last-month rule | If eligible on Dec 1, "you may consider yourself an 'eligible individual' for the entire year." The testing period runs from the last month through the 12th month after it (Dec 1, 2026 – Dec 31, 2027). If you fail it, the excess contributions become income **+10% additional tax** (death or disability excepted). | i8889 and Pub 969 [primary, 2025 edition] |
| Other eligibility | Cannot be claimed as a dependent. Not enrolled in Medicare ("your contribution limit is zero" from the first Medicare month). | Pub 969 [primary] |
| Married couples, family coverage | One family limit, "split equally between the spouses unless you agree on a different division" | Pub 969 [primary] |
| Deadline for 2026 contributions | Unextended return due date = **April 15, 2027** (Pub 969 2025: "through April 15, 2026" for 2025) | [derived] |

Note: catastrophic plans are HSA-eligible from 2026 but get **no PTC** (§5). Bronze plans get both.

---

## 7. Traditional IRA, 2026

Source: [Notice 2025-67](https://www.irs.gov/pub/irs-drop/n-25-67.pdf) (read in full) and [IR-2025-111](https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500). **[primary]**

| Item | 2026 |
|---|---|
| Contribution limit (§219(b)(5)(A)) | **$7,500** |
| Catch-up, age 50+ (§219(b)(5)(B)) | **$1,100** (not $1,000) |
| Deduction phase-out: single/HOH, active participant | $81,000 – $91,000 |
| MFJ, contributing spouse is an active participant | $129,000 – $149,000 |
| Contributor not covered, spouse covered | $242,000 – $252,000 |
| MFS, active participant | $0 – $10,000 |
| Roth phase-out (for reference) | single/HOH $153,000–$168,000; MFJ $242,000–$252,000 |

**SEP or SIMPLE contributions make you an active participant.**

- IRC §219(g)(5)(A)(v) lists "a simplified employee pension (within the meaning of section 408(k))," and (vi) a SIMPLE account ([LII 26 USC 219](https://www.law.cornell.edu/uscode/text/26/219)). **[primary]**
- The IRS (updated 31-May-2026) lists "IRA-based plan (SEP, SARSEP or SIMPLE IRA plan)" as employer coverage. You are covered for a tax year if an amount was contributed to your IRA for the plan year ending with or within that year ([IRS](https://www.irs.gov/retirement-plans/are-you-covered-by-an-employers-retirement-plan)). **[primary]**
- **Consequence:** a self-employed person who funds a 2026 SEP is an active participant for 2026, so the traditional-IRA deduction phases out over the ranges above.

**Phase-out mechanics** (§219(g)(2)):

- The reduction is proportional over $10,000 ($20,000 on a joint return where the contributor is covered).
- Amounts not a multiple of $10 are "rounded to the next lowest $10" of the reduction. Pub 590-A Worksheet 1-2 rounds the allowed amount "to the next highest multiple of $10."
- The floor is **$200** unless fully phased out.

**IRA MAGI** = AGI with the IRA deduction, student-loan interest, the foreign exclusions, the savings-bond exclusion and the adoption-benefit exclusion added back ([Pub 590-A](https://www.irs.gov/publications/p590a)). This is a different MAGI from the PTC MAGI.

**Deadline:** "not later than the time prescribed by law for filing the return … (not including extensions)" (§219(f)(3)) → **April 15, 2027** for 2026. **[primary + derived date]**

---

## 8. SEP-IRA, 2026

| Item | Value | Source / label |
|---|---|---|
| Dollar cap (§415(c)(1)(A)) | **$72,000** | Notice 2025-67 [primary] |
| Compensation cap (§§401(a)(17), 408(k)(3)(C)) | **$360,000** | Notice 2025-67 [primary] |
| Formula | Lesser of 25% of compensation or $72,000. For the self-employed, compensation = net earnings minus the deductible half of SE tax **and** minus the SEP deduction itself (circular), so the effective rate = plan rate ÷ (1 + plan rate) = **0.25/1.25 = 0.200000** | [Pub 560 (2025)](https://www.irs.gov/publications/p560) Rate Table [primary, 2025 edition] |
| Worksheet (no deferrals) | 1. Schedule C line 31 net profit → 2. minus the SE-tax deduction (Schedule 1 line 15) → 3. net earnings → 4. × self-employed rate (0.20) → 5. product → 6. compensation limit × **plan** rate (2026: $360,000 × 0.25 = $90,000) → 7. smaller of 5 and 6 → 8. dollar limit ($72,000) → 21. maximum = smaller of 7 and 8 | Pub 560 Deduction Worksheet for Self-Employed (shown with 2025 $350k/$70k; substitute the 2026 figures) [primary + derived] |
| Pub 560 example (2025 figures) | NP $200,000, SE deduction $13,596, plan rate 8.5% → rate 0.078 → **$14,540** | Pub 560 [primary]. Use as a unit test |
| Where deducted | Schedule 1 (Form 1040), line 16, above the line, so it **reduces AGI and PTC MAGI** | Pub 560 [primary] |
| Set-up deadline | "You can set up a SEP for any year as late as the due date (including extensions)" | Pub 560 [primary] |
| Contribution deadline | "by the due date (including extensions)" → **April 15, 2027**, or **October 15, 2027** if extended | Pub 560 [primary + derived dates] |

---

## 9. Self-employment tax, 2026

Source: [2026 Form 1040-ES SE Tax Worksheet](https://www.irs.gov/pub/irs-pdf/f1040es.pdf) **[primary]** and [2026 Schedule SE instructions](https://www.irs.gov/instructions/i1040sse) **[primary]**.

| Item | 2026 |
|---|---|
| Net-earnings factor | 92.35% (0.9235) |
| Medicare portion | 2.9% on all net earnings |
| Social Security portion | 12.4% on net earnings up to $184,500 minus W-2 Social Security wages |
| SS wage base | **$184,500** |
| Deduction | 50% of SE tax (Schedule 1 line 15), above the line |
| Filing threshold | Schedule SE is required if net earnings (Schedule SE line 4c) are ≥ **$400** |
| Additional Medicare Tax | 0.9% over **$200,000** (single, HOH, QSS), **$250,000** (MFJ), **$125,000** (MFS). The threshold is reduced by Medicare wages. SE losses don't count. ([Topic 560](https://www.irs.gov/taxtopics/tc560)) [primary]. Not inflation-indexed [unverified in this pass; statutory fixed amounts] |

---

## 10. 2026 brackets and standard deduction

Source: [2026 Form 1040-ES, 2026 Tax Rate Schedules, p.10](https://www.irs.gov/pub/irs-pdf/f1040es.pdf), which implements Rev. Proc. 2025-32 ([IR-2025-103](https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill)). **[primary]**

| Rate | Single (upper bound) | MFJ / QSS | HOH | MFS |
|---|---|---|---|---|
| 10% | 12,400 | 24,800 | 17,700 | 12,400 |
| 12% | 50,400 | 100,800 | 67,450 | 50,400 |
| 22% | 105,700 | 211,400 | 105,700 | 105,700 |
| 24% | 201,775 | 403,550 | 201,750 | 201,775 |
| 32% | 256,225 | 512,450 | 256,200 | 256,225 |
| 35% | 640,600 | 768,700 | 640,600 | 384,350 |
| 37% | above | above | above | above |

**Standard deduction:**

- Single or MFS: $16,100. MFJ or QSS: $32,200. HOH: $24,150.
- Additional for age 65+ or blind: $2,050 (unmarried), $1,650 (married).

The cumulative tax figures in the 1040-ES (e.g. single $1,240 / $5,800 / $17,966 / $41,024 / $58,448 / $192,979.25) match the brackets. **[derived check]**

```json
{
  "brackets2026": {
    "source": "2026 Form 1040-ES Tax Rate Schedules (Rev. Proc. 2025-32)",
    "single": [[12400, 0.10], [50400, 0.12], [105700, 0.22], [201775, 0.24], [256225, 0.32], [640600, 0.35], [null, 0.37]],
    "mfj":    [[24800, 0.10], [100800, 0.12], [211400, 0.22], [403550, 0.24], [512450, 0.32], [768700, 0.35], [null, 0.37]],
    "hoh":    [[17700, 0.10], [67450, 0.12], [105700, 0.22], [201750, 0.24], [256200, 0.32], [640600, 0.35], [null, 0.37]],
    "mfs":    [[12400, 0.10], [50400, 0.12], [105700, 0.22], [201775, 0.24], [256225, 0.32], [384350, 0.35], [null, 0.37]]
  },
  "standardDeduction2026": { "single": 16100, "mfs": 16100, "mfj": 32200, "hoh": 24150, "additionalUnmarried65OrBlind": 2050, "additionalMarried65OrBlind": 1650 }
}
```

---

## 11. Capital losses and wash sales [primary]

- **Net capital loss against ordinary income:** "the lesser of $3,000 ($1,500 if married filing separately)" or the net loss. "If your net capital loss is more than this limit, you can carry the loss forward to later years." ([Topic 409](https://www.irs.gov/taxtopics/tc409))
- **Wash sale** ([Pub 550 (2025)](https://www.irs.gov/publications/p550)): "A wash sale occurs when you sell or trade stock or securities at a loss and within 30 days before or after the sale you" do any of these: buy substantially identical stock or securities; acquire them in a fully taxable trade; acquire a contract or option to buy them; or acquire substantially identical stock for your IRA or Roth IRA. That makes a 61-day window.
  - The disallowed loss is added to the basis of the new shares, except in the IRA case, where the loss is permanently lost.
  - The holding period carries over.

---

## 12. Constructive receipt (cash method) [primary]

[Pub 538 (Rev. 01/2022)](https://www.irs.gov/publications/p538):

- "Income is constructively received when an amount is credited to your account or made available to you without restriction. You do not need to have possession of it. If you authorize someone to be your agent and receive income for you, you are considered to have received it when your agent receives it. Income is not constructively received if your control of its receipt is subject to substantial restrictions or limitations."
- Example: interest credited and made available in December 2021 but not withdrawn until 2022 "must [be] include[d] … in gross income for 2021."
- Also: "You cannot hold checks or postpone taking possession of similar property from one tax year to another" to postpone tax.

**Engine implication:** "shift income to January" advice must mean *invoicing or contracting* later, so that payment is not yet available. It must never mean sitting on a payment that is already available.

---

## 13. Marketplace rules

- **Reporting changes.**
  - Regulation: enrollees must report eligibility changes "within 30 days of such change." Exchanges may set an income-change threshold below which reporting isn't required. Redetermined APTC generally takes effect "on the first day of the month following the date of the notice," with a mid-month cutoff no earlier than the 15th ([45 CFR 155.330(b), (f)](https://www.law.cornell.edu/cfr/text/45/155.330)). **[primary]**
  - HealthCare.gov sets no day count and says to update "as soon as possible." Report via log in → "Report a Life Change" ([why report](https://www.healthcare.gov/reporting-changes/why-report-changes/), [how to report](https://www.healthcare.gov/reporting-changes/how-to-report-changes/)). **[primary]**
- **APTC choice.** "You can use some, all, or none of the tax credit each month … If you select 'use some,' you can enter the amount you want to use" ([HealthCare.gov](https://www.healthcare.gov/lower-costs/save-on-monthly-premiums/)). The IRS gives the same all/some/none options and advises extra care if projected income is near the 400% limit ([IRS PTC page](https://www.irs.gov/credits-deductions/premium-tax-credit), updated 28-Jul-2026). **[primary]**
- **Open enrollment for 2027 coverage on HealthCare.gov:**
  - Nov 1, 2026 to Jan 15, 2027.
  - Enroll by **Dec 15** for Jan 1 coverage. Dec 16 to Jan 15 gives Feb 1 coverage.
  - Source: [HealthCare.gov dates](https://www.healthcare.gov/quick-guide/dates-and-deadlines/) **[primary]**.
  - The shortened window in the 2025 Integrity rule was vacated in *City of Columbus v. Kennedy* (June 2026) and not reissued ([HFMA](https://www.hfma.org/payment-reimbursement-and-managed-care/aca-marketplace-rule-blocked-2027/)) **[secondary]**.
  - State-based exchanges may differ **[unverified]**.
- **Form 1095-A** for 2026 coverage must be furnished by **Jan 31, 2027** (2026 draft i8962). **[primary-draft]**

---

## Combined `limits2026` block

```json
{
  "limits2026": {
    "taxYear": 2026,
    "hsa": { "selfOnly": 4400, "family": 8750, "catchUp55": 1000, "hdhpMinDeductibleSelf": 1700, "hdhpMinDeductibleFamily": 3400, "hdhpOopMaxSelf": 8500, "hdhpOopMaxFamily": 17000, "bronzeAndCatastrophicAreHdhp": true, "contributionDeadline": "2027-04-15" },
    "ira": { "limit": 7500, "catchUp50": 1100, "deadline": "2027-04-15",
             "deductionPhaseOut": { "singleOrHohCovered": [81000, 91000], "mfjContributorCovered": [129000, 149000], "mfjContributorNotCoveredSpouseCovered": [242000, 252000], "mfsCovered": [0, 10000] },
             "minDeductionIfPartiallyPhasedOut": 200 },
    "sep": { "dollarCap": 72000, "compensationCap": 360000, "planRateMax": 0.25, "selfEmployedRateAtMax": 0.20, "deadline": "2027-04-15", "deadlineWithExtension": "2027-10-15" },
    "seTax": { "netEarningsFactor": 0.9235, "ssRate": 0.124, "medicareRate": 0.029, "ssWageBase": 184500, "deductibleShare": 0.5, "filingThreshold": 400 },
    "additionalMedicare": { "rate": 0.009, "single": 200000, "hoh": 200000, "qss": 200000, "mfj": 250000, "mfs": 125000 },
    "capitalLoss": { "ordinaryOffsetMax": 3000, "ordinaryOffsetMaxMfs": 1500, "washSaleWindowDays": 30 },
    "ptc": { "fplTable": "fpl2025", "applicablePctTable": "applicablePct2026", "maxFplPct": 400, "minFplPct": 100, "repaymentCap": null, "excessAptcFormLine": "Schedule 2 line 1a" }
  }
}
```

---

## Gotchas for the engine

1. **Integer math for the applicable percentage.**
   - The 175% FPL point is an exact half (5.395% → **5.40%**). Floats can return 5.39.
   - Compute in basis points with round-half-up, then check against the Table 2 vectors in §2c.
   - 175% is the only exact-half case in the 2026 table. The 2027 table has none, because each band's numerator parity rules them out.
2. **Truncate the FPL %, don't round it.** `Math.floor(HI*100/FPL)` using integer dollars. 399.97% → 399.
3. **The cliff is a dollar test.** HI = $62,600 exactly (single, 48 states) **is eligible**, at 400% and 9.96%. $62,601 is not. Implement it as `HI > 4*FPL → ineligible`.
4. **The cliff is all-or-nothing.** One dollar over 400% repays *all* APTC: Σ monthly (SLCSP − contribution), capped at the premium. Show the marginal cost of the last dollar.
5. **Use prior-year guidelines.** 2026 coverage uses the **2025** guidelines; 2027 coverage uses the **2026** guidelines. Medicaid uses *current* guidelines and current monthly income, so the two can disagree.
6. **Alaska and Hawaii have separate tables.** Pick the table by state of residence. If you moved into or out of AK/HI during the year, or MFJ spouses lived in different states, "use the table with the higher dollar amounts."
7. **Household size > 8:** add the per-person increment ($5,500 / $6,880 / $6,330 for 2026 coverage). Family size excludes anyone who can be claimed as someone else's dependent. A dependent's MAGI counts only if that dependent is *required* to file.
8. **Lower bound of 100%.** Below 100% FPL, PTC is allowed only if the Marketplace estimated HI at 100–400% at enrollment **and** APTC was paid. The lawfully-present-under-100% exception is repealed from 2026 (§71302).
9. **The 138% line (Medicaid expansion).** Adults in expansion states below about 138% FPL are generally Medicaid-eligible (133% + 5% disregard) and then not PTC-eligible. A Marketplace finding of Medicaid-ineligibility protects the enrollee for the plan year. **[unverified in this pass: the 5% disregard citation]**
10. **Below the 133% band (2026)** the figure is a flat 2.10%. It jumps to 3.14% at 133%, which is a mini-cliff.
11. **Annual vs monthly rounding.** Line 8b = round(8a/12). The monthly method can differ from the annual one by a few dollars. Use monthly whenever coverage was under 12 months or premiums or SLCSP changed mid-year. Round 1095-A amounts to whole dollars.
12. **Coverage months.** A month counts only if the QHP is in force on the 1st. Catastrophic plans earn **no PTC** but **are** HSA-eligible from 2026. SHOP plans: neither.
13. **Which deductions lower PTC MAGI.**
    - **Lower it:** traditional IRA deduction, HSA deduction, SEP/solo-401(k) deduction, ½ SE tax, self-employed health insurance deduction. These are all above the line.
    - **Don't lower it:** the standard deduction, the QBI deduction, and the new Schedule 1-A deductions (tips, overtime, car-loan interest, senior). The 2026 1040-ES worksheet subtracts these *from* AGI on lines 2a–2c.
    - **Add back:** tax-exempt interest, untaxed Social Security, and excluded foreign income.
14. **Self-employed health insurance ↔ PTC circularity.** The 2026 draft i8962 line 27 points to Pub 974's iterative and simplified methods (Pub 974: "do not round to whole dollars" when iterating). Rev. Proc. 2014-41 is the underlying authority **[citation unverified in this pass]**.
15. **SEP → active participant.** Funding a 2026 SEP can shrink the traditional-IRA deduction. For MFJ near the 4-person cliff ($128,600), the $129,000–$149,000 phase-out is right there. IRA MAGI ≠ PTC MAGI (§7).
16. **Each spouse's SE tax is computed separately.** The SS base applies per person after W-2 SS wages. The Additional Medicare threshold is per return.
17. **Deadlines for "save the cliff after Dec 31":**
    - HSA and traditional IRA by **Apr 15, 2027** (no extension).
    - A SEP can be *opened and funded* by **Oct 15, 2027** if extended.
    - These dates are derived from statute and Pub rules. Apr 15, 2027 is a Thursday.
18. **Constructive receipt.** Don't suggest holding a received check. Only invoice timing or contract terms can move income across Dec 31.
19. **MFS filers** generally get no PTC and repay all APTC. The exceptions are domestic abuse or abandonment, for up to 3 consecutive years.
20. **Income-based special enrollment.** Enrollments through an income-based SEP after 2025 get no PTC.
21. **2027 projections:**
    - Use `applicablePct2027` and `fpl2026`.
    - §71301's narrower list of eligible aliens takes effect for tax years beginning after Dec 31, 2026.
    - The repayment cap stays repealed.
    - Watch Congress (§0).
22. **Draft caveat.** The 8962 rules come from the **Oct 20, 2026 draft**. Re-check against the final instructions when the IRS posts them (usually Dec–Jan).

---

## Corrections against the numbers in the brief

| Brief said | Verified |
|---|---|
| HSA $4,400 / $8,750? | Confirmed. Catch-up is **$1,000 at age 55+** |
| IRA $7,500? | Confirmed. **The catch-up is $1,100**, not $1,000 |
| SEP $72,000? | Confirmed. Compensation cap **$360,000**; effective 20% of (net profit − ½ SE tax) |
| 9.96% top rate | Confirmed |
| Form 8962 → Schedule 2 | **Line 27** (not 29) now goes straight to Schedule 2 line 1a. Lines 28–29 are reserved |
| 2025 instructions as fallback | Not needed. The **2026 draft instructions (Oct 20, 2026)** are posted and were used |

## Still unverified

- State-exchange OE dates.
- The citation for the 5% Medicaid income disregard.
- The Rev. Proc. 2014-41 citation.
- Whether the Additional Medicare thresholds are indexed. Believed not; statutory.
- Congressional action after Nov 5, 2026.

# CliffGuard v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the CliffGuard web app on Vercel: a tested ACA-cliff rules engine, plus the jury path (Dani → result → gig check → rescue plan → Stripe test paywall → unlocked plan → check-in), with Claude reading notices and explaining results.

**Architecture:** `src/engine/` is pure, deterministic TypeScript that produces every number and recommendation. It is unit-tested against spec §B fixtures. `src/server/` holds the session cookie, Upstash store, rate limits, Stripe, and Claude (server-only). `src/app/` holds the Next.js App Router pages and API routes. Claude only extracts, explains and answers through the engine; a grounding validator rejects any number it invents.

**Tech Stack:** Next.js 16.4 (App Router), React 19, TypeScript strict, Tailwind 4, Zod 4, Vitest 5, `@anthropic-ai/sdk` (model `claude-opus-5-5`), `@upstash/redis` + `@upstash/ratelimit`, `stripe`, `recharts`.

**Spec:** `docs/spec.md`, approved at G2. It is the source of truth for every formula, fixture, screen, route and copy line. Table values come from `research/tax-tables-2026.md`, and **the research file wins** over spec §A.2.

## Global Constraints

- TypeScript `strict`, no `any`, no `@ts-ignore`. Validate every API input and every Claude output with Zod.
- Engine files are pure: no I/O, no `Date.now()`. Time arrives as `asOf: string` (ISO date).
- `src/engine/optimizer.ts`, `gig.ts` and `levers.ts` start with `import 'server-only'`. Plan amounts never reach the client unless the user is entitled (see `redact.ts`).
- Precision follows spec §A.9:
  - household income is rounded to whole dollars before FPL % and the contribution;
  - the FPL % is truncated, with 401 if income is above 4 × FPL;
  - the applicable figure uses **integer basis-point math with round-half-up** (never float `.5`);
  - lever amounts are multiples of $10;
  - fixtures pass within ±$1 (F3b: ±$5).
- **No hardcoded results.** UI copy must not contain computed numbers. Only sample *inputs* are fixed (`src/samples/dani.ts`).
- **No code path returns a recommended 2027 estimate below `floor`** (spec §A.8).
- The footer on every page reads exactly: `Education, not tax advice. Rules as of Nov 2026. Delete my data.`
- The test-card copy reads exactly: `Test mode: card 4242 4242 4242 4242, any future date, any CVC, any ZIP. No real charge.`
- **Claude:**
  - model `claude-opus-5-5`, server-side only, in `src/server/claude/`;
  - load the `claude-api` skill before writing any Claude code;
  - structured outputs from Zod schemas;
  - server-side `fallbacks: "default"` (beta `server-side-fallback-2026-07-01`);
  - check `stop_reason === "refusal"`;
  - effort `low` for extraction and explanation, `medium` for Q&A.
- **When env is missing, the app still runs locally:**
  - no Upstash env and `NODE_ENV !== 'production'` → in-memory store and limiter;
  - no `ANTHROPIC_API_KEY` or `CLAUDE_ENABLED=false` → template and manual fallbacks;
  - no `STRIPE_SECRET_KEY` → checkout returns 503 `PAYMENT_UNAVAILABLE`.
- Next.js: `cacheComponents` and `partialPrefetching` are **off** in `next.config.ts`. Next 16 names the request interceptor `src/proxy.ts`; confirm against `node_modules/next` docs before writing it.
- Layout works at **375 px** and on desktop. Every async view has loading, empty and error states (spec §C).
- **Git:**
  - local commits only; **never add a remote, never push, never create a GitHub repo**;
  - stage files by explicit path;
  - every commit message ends with:
    ```
    Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
    Claude-Session: https://claude.ai/code/session_01H2SU7SoeBxfZreeJroz2uF
    ```
- Before every commit: `npm run lint && npm run typecheck && npm test` all pass.

## Review Focus

1. **Formatted money input:** users type `$105,000`, `105k` or `105,000.50`. The form should accept these and reject negative or garbage input with an inline message. → test in Task 5.
2. **Out-of-order responses:** fast slider drags, toggle flips or double-clicks fire overlapping requests. Only the latest response may render. → test in Task 7.
3. **Missing or corrupt household record:** the cookie exists but Redis has no record, an old `version`, or invalid JSON. Treat it as "no household" and redirect to `/`, never a 500. → test in Task 6.
4. **`/success` replay or a foreign session:** a refresh, a second visit, or a session id from another browser. The entitlement write must be idempotent, a mismatch must return the error state, and nothing may be double-written. → test in Task 8.
5. **Bad uploads:** more than 5 MB, a wrong type, or a document that isn't a notice. Return 413, 422 or `NOT_RECOGNIZED` with friendly copy, and the form stays usable. → test in Task 9.

## G2 judge changes (override the spec where they conflict)

The judge scored the spec 7.63 and found the original order infeasible. The critical path through M9 ends around 00:45. These changes apply:

- **Sequencing:** insurance submit after **T7** (Dani → result → gig → plan preview, no paywall, ~22:30). Then T8 (Stripe and export, ~23:30), then T11-lite, T13 and the v1 deploy (~00:30). After 00:30: T9 (extraction), then T10 (Claude explanation; the template from T4 ships first), then T12 (Q&A, nice-to-have only).
- **Scope cuts in v1:**
  - Drop the `taxLossHarvest` lever entirely: no input field, no lever.
  - Drop the IRA↔SEP rerun. Instead, **IRA and SEP are mutually exclusive per adult**. Once one is used for an adult, the optimizer skips the other for that adult and adds flag `IRA_SEP_COMBO_EXCLUDED`.
- **Rule fixes (the research file wins):**
  - HI per extra person is **$6,330** (HI cliff for 4 = $147,920).
  - Add the 2027 AK ($19,950 + $7,100) and HI ($18,360 + $6,530) poverty lines.
  - SEP compensation cap is **$360,000**.
  - Catastrophic plans get no PTC: flag `CATASTROPHIC_NO_PTC` and treat APTC as 0 for them. HSA stays eligible.
  - F7's FPL % is **406** under our truncation rule; the dollar figures are unchanged.
  - `per1000` is computed numerically (see T2), not `1000 × figure`.
- **No hardcoded numbers in copy:** the S4 `under_line` text uses the engine's `per1000`.
- **Mid-year APTC changes:** the model holds a single APTC. The check form tells users who already reported a change to enter their **average** monthly credit.
- **Tax estimate:** QBI stays out of v1 and is flagged `ROUGH_TAX_ESTIMATE`. The UI labels gig figures "rough federal estimate".

## Execution order and parallelism

```
T1 ─┬─► T2 ─► T3 ─► T4 ─┐   (builder A, worktree "engine")
    └─► T5 ─────────────┤   (builder B, worktree "ui-shell"; uses only T1 types)
                        ▼
                 merge ─► T6 ─► T7 ══► G3: deploy + QA + judge + insurance submit (~22:30)
                               ─► T8 (~23:30) ─► T11-lite ─► T13 ══► v1 deploy (~00:30)
                               ─► T9 ─► T10 ─► T12 (nice-to-have) ══► G4
```
- **Orchestrator-only steps** (no builder): Vercel link plus first deploy right after T5 merges, which needs the captain's `vercel login`. Env vars on Vercel. G3 and G4 gates.
- A `code-reviewer` reviews each task before the merge or the next task.

---

### Task 1: Engine core: types, rule sets, poverty line, applicable figure, MAGI

**Files:**
- Create: `src/engine/types.ts`, `src/engine/rules/ty2026.ts`, `src/engine/rules/ty2025-enhanced.ts`, `src/engine/fpl.ts`, `src/engine/applicable.ts`, `src/engine/income.ts`, `src/samples/dani.ts`, `src/test/server-only-stub.ts`
- Modify: `vitest.config.mts` (alias `server-only` → `src/test/server-only-stub.ts`, an empty module)
- Test: `src/engine/__tests__/fixtures.ts`, `src/engine/__tests__/applicable.test.ts`, `src/engine/__tests__/income.test.ts`

**Interfaces:**
- Produces, in `types.ts`, the Zod schemas and inferred types for everything in spec §A.1:
  - `HouseholdInputSchema`, `ScenarioSchema`, `HouseholdInput`, `Scenario`, `AdultInput`, `AdultId`, `LeverId`, `UsStateCode`
  - `LIQUID_LEVERS`, `DEFAULT_LEVER_ORDER`
  - `FlagCode` (union of the spec §A.10 flags)
  - `EngineErrorCode = 'FILING_STATUS_UNSUPPORTED' | 'SLCSP_REQUIRED' | 'SLCSP_DERIVATION_UNRELIABLE' | 'ESTIMATE_OVER_CLIFF_WITH_APTC'`
  - `class EngineError extends Error { code: EngineErrorCode }`
  - `LeverAmounts = { invoiceTiming: number; businessPurchases: number; hsa: number; delayStockSale: number; taxLossHarvest: number; traditionalIra: Record<AdultId, number>; sepIra: number }`, and `ZERO_LEVERS`
  - `Explanation` and `ExplanationSchema` (spec §E.2 output; shared by the template and Claude)
- Produces `RuleSet` (keys from spec §A.2), `TY2026`, and `TY2025_ENHANCED` (test-only; not re-exported from `index.ts`).
- Produces in `fpl.ts`:
  - `povertyLine(state: UsStateCode, householdSize: number, rules: RuleSet): number`
  - `cliffAmount(state, householdSize, rules): number | null`
  - `fplPercent(income: number, fpl: number, rules: RuleSet): number` (truncated; 401 above the cliff)
- Produces `applicableFigure(fplPct: number, rules: RuleSet): number | null` in `applicable.ts`.
- Produces in `income.ts`:
  - `computeIncome(input: HouseholdInput, scenario: Scenario, rules: RuleSet, levers?: LeverAmounts): IncomeBreakdown`
  - `IncomeBreakdown = { seProfitByAdult: Record<AdultId, number>; seTaxByAdult: Record<AdultId, number>; halfSeTax: number; wages: number; capGainsAllowed: number; agi: number; magi: number; seAdultId: AdultId | null }`
- Produces `DANI: HouseholdInput`, `DANI_GIG = { amount: 12000, canBillInJanuary: false }` and `DANI_AS_OF = '2026-11-14'` (spec §B preset).

- [ ] **Step 1: Write `rules/ty2026.ts` from `research/tax-tables-2026.md`.** Use the JSON blocks `fpl2025`, `fpl2026`, `applicablePct2026`, `brackets2026`, `standardDeduction2026` and `limits2026`. Store bands as integer basis points (`startBp`, `endBp`). Compare each value with spec §A.2, and list every difference in the task report. Apply the rule fixes in "G2 judge changes" (HI $6,330; 2027 AK/HI; SEP compensation cap $360,000). `sbmStates` comes from the research file; if it isn't there, use spec §A.2 and add a `// assumption` comment. Write `ty2025-enhanced.ts` from spec §A.2 "Test-only". Remove `taxLossHarvest` from `LeverId`, `LIQUID_LEVERS` and `DEFAULT_LEVER_ORDER`, and remove `unrealizedLosses` from the input schema.
- [ ] **Step 2: Write the failing tests.** Use this pattern:

```ts
import { applicableFigure } from '../applicable'; import { TY2026 } from '../rules/ty2026';
test.each([[100,0.0210],[132,0.0210],[133,0.0314],[149,0.0413],[150,0.0419],[175,0.0540],[200,0.0660],
           [225,0.0752],[250,0.0844],[275,0.0920],[300,0.0996],[400,0.0996]])('F11 %i%% → %d', (p, f) =>
  expect(applicableFigure(p, TY2026)).toBe(f));
test('F11 401 → null', () => expect(applicableFigure(401, TY2026)).toBeNull());
```

  Also write tests for:
  - `fplPercent(3.997 × fpl)` → 399
  - `povertyLine('TX', 4)` → 32,150; `cliffAmount` → 128,600; HI family of 4 → cliff 147,920; AK per research
  - **IRS 2026 Table 2 vectors** from `research/tax-tables-2026.md` (every FPL% → figure pair it lists), asserted with `applicableFigure`
  - **F14:** `HouseholdInputSchema` rejects `filingStatus: 'mfs'`
  - the F1 income part: `computeIncome(DANI, {gig:null, asOf:DANI_AS_OF}, TY2026)` gives `halfSeTax` 6,464, `agi` 121,536 and `magi` 122,036 (±1)
- [ ] **Step 3: Run `npx vitest run src/engine`.** Expected: FAIL (modules missing).
- [ ] **Step 4: Implement** `fpl.ts`, `applicable.ts` (spec §A.4 formula, `roundHalfUp` on integers) and `income.ts` (spec §A.3, including the SS wage-base cap per adult, the $400 SE floor, and the −$3,000 capital-loss floor).
- [ ] **Step 5: Run `npx vitest run src/engine && npm run lint && npm run typecheck`.** Expected: all PASS.
- [ ] **Step 6: Commit** with message `feat(engine): rule sets, FPL, applicable figure, MAGI` plus the trailer.

### Task 2: SLCSP derivation, reconciliation, `diagnose()`

**Files:**
- Create: `src/engine/slcsp.ts`, `src/engine/reconcile.ts`, `src/engine/diagnose.ts`, `src/engine/index.ts`
- Test: `src/engine/__tests__/reconcile.test.ts`, `src/engine/__tests__/diagnose.test.ts`

**Interfaces:**
- Consumes: T1 exports.
- Produces:
  - `deriveSlcsp(input: HouseholdInput, rules: RuleSet): { annual: number; source: 'derived' | 'manual' }`. Throws `EngineError` with the spec §A.4 guard codes.
  - `reconcile(p: { magi: number; state: UsStateCode; householdSize: number; slcspAnnual: number; aptcMonthly: number; monthsWithAptc: number; premiumMonthly: number | null; filingStatus: 'single'|'mfj'|'hoh' }, rules: RuleSet): Reconciliation`. This is client-safe, and the slider uses it.
  - `Reconciliation = { fpl; cliff; fplPercent; overCliff; applicableFigure; annualContribution; ptcAllowed; aptcReceived; repayment; refund }`
  - `diagnose(input: HouseholdInput, scenario: Scenario, rules?: RuleSet, levers?: LeverAmounts): Diagnosis`, with the exact shape of spec §A.4 `Diagnosis`, including `reportChange` (spec §A.8) and `flags`.
  - `index.ts` re-exports the public engine API (not `TY2025_ENHANCED`).

- [ ] **Step 1: Write the failing tests**, asserting every value in the spec §B rows:
  - **F1:** the full row, including SLCSP 19,800, PTC 7,645, repayment 1,697, headroom 6,564, zone `near`, `reportChange` {true, 122,036} and `daysToYearEnd` 47.
  - **F2:** each MAGI → repayment or refund pair, by calling `reconcile` with Dani's SLCSP and APTC.
  - **F5, F6, F7:** use `TY2025_ENHANCED` and `{...TY2026, fpl: <2024 FPL>}` as the spec says. F7's FPL % is **406** (truncation), not 407.
  - **IRS worked example** from the 2026 draft Form 8962 instructions in `research/tax-tables-2026.md`: household income $71,910 → excess APTC **$1,529**. Use that example's own household size, SLCSP and APTC as listed in the research file.
  - **per1000:** Dani at F1 → `per1000` equals `reconcile(magi + 1000).repayment − reconcile(magi).repayment` (≈ 99.6). At a 275% FPL household it is ≈ 176, not 92.
  - **Catastrophic:** `planMetal: 'catastrophic'` → flag `CATASTROPHIC_NO_PTC` and repayment 0.
  - **F8:** repayment 9,342.
  - **F12:** the three guards.
  - **Flags:** `SBM_STATE` for `state:'CA'`; `NO_APTC` when APTC is 0; `PARTIAL_YEAR` when months is 6.
- [ ] **Step 2: Run `npx vitest run src/engine`.** Expected: the new tests FAIL.
- [ ] **Step 3: Implement** `slcsp.ts`, `reconcile.ts` (no cap when `rules.repaymentCaps` is null; caps by band and filing status otherwise) and `diagnose.ts` (zone thresholds per spec §A.4). `per1000` is the numeric difference above, clamped at ≥ 0. When adding $1,000 crosses the cliff, use the step just below the cliff instead, and add flag `NEAR_CLIFF_STEP`.
- [ ] **Step 4: Run the engine tests, lint and typecheck.** Expected: PASS.
- [ ] **Step 5: Commit** with message `feat(engine): SLCSP derivation, reconciliation, diagnose` plus the trailer.

### Task 3: Tax, levers, optimizer

**Files:**
- Create: `src/engine/tax.ts`, `src/engine/levers.ts`, `src/engine/optimizer.ts`
- Test: `src/engine/__tests__/tax.test.ts`, `src/engine/__tests__/optimizer.test.ts`

**Interfaces:**
- Consumes: `computeIncome`, `diagnose`, `reconcile`, `LeverAmounts`.
- Produces:
  - `federalTax(taxable: number, status: 'single'|'mfj'|'hoh', rules: RuleSet): number`
  - `marginalRate(taxable, status, rules): number`
  - `incomeTaxSaved(agiWithGig: number, deductions: number, status, rules): number` (spec §A.5)
  - `LEVER_COPY: Record<LeverId, { name: string; returnLocation: string; howTo: string[]; proof: string[]; warnings: string[] }>`, with copy verbatim from spec §A.6
  - `isEligible(lever, input, asOf, rules): { ok: boolean; reason?: string }`
  - `capacity(lever, state, input, rules): number`
  - `optimize(input: HouseholdInput, scenario: Scenario, rules?: RuleSet): PlanResult`, with the exact shape of spec §A.6 `PlanResult`/`Move`. It starts with `import 'server-only'`.
  - `SAFETY_BUFFER = 1000` and `COSTLY_MULTIPLE = 3`

- [ ] **Step 1: Write the failing tests**, asserting every value in spec §B:
  - **F3:** the plan part (moves invoiceTiming 3,000, businessPurchases 1,800, hsa 1,130; MAGI after 127,597; repayment after 2,251; verdict `worth_it`), using `{ gig: DANI_GIG, asOf: DANI_AS_OF }`.
  - **F4:** sepIra 5,590 at a cap of 19,238; incomeTaxSaved 671.
  - **F8:** verdict and `setAside`.
  - **F9:** asOf `2027-02-01`.
  - **F10:** both toggle states.
  - **F15:** `test.each` over F3/F4/F9/F10 inputs checking: amounts are multiples of 10; amounts ≤ capacity; no `locked` liquidity when keepMyCash is on; `magiAfter ≤ target` when feasible; and `expect(optimize(x)).toEqual(optimize(x))`.
  - **IRA phase-out:** a covered single filer with IRA MAGI of $86,000 gets a deductible limit of $3,750 (spec §A.6 formula, rounded up to $10).
- [ ] **Step 2: Run the tests.** Expected: FAIL.
- [ ] **Step 3: Implement** spec §A.5 and §A.6, minus the cuts in "G2 judge changes". That covers the lever table without `taxLossHarvest`, the binary search over $10 multiples, per-adult IRA sub-levers, and the verdict rules. **There is no SEP→covered rerun.** IRA and SEP are mutually exclusive per adult, with flag `IRA_SEP_COMBO_EXCLUDED` when one is skipped, and a test for it.
- [ ] **Step 4: Run the engine tests, lint and typecheck.** Expected: PASS.
- [ ] **Step 5: Commit** with message `feat(engine): tax estimate, levers, optimizer` plus the trailer.

### Task 4: Gig check, alerts, deadlines, 2027 estimate, template explanation

**Files:**
- Create: `src/engine/gig.ts`, `src/engine/alerts.ts`, `src/engine/deadlines.ts`, `src/engine/estimate2027.ts`, `src/engine/explainTemplate.ts`
- Modify: `src/engine/index.ts` (exports)
- Test: `src/engine/__tests__/gig.test.ts`, `src/engine/__tests__/alerts.test.ts`, `src/engine/__tests__/estimate.test.ts`

**Interfaces:**
- Consumes: `optimize`, `diagnose`, the tax functions.
- Produces:
  - `gigCheck(input: HouseholdInput, gig: { amount: number; canBillInJanuary: boolean }, asOf: string, rules?: RuleSet): GigCheckResult`, with the exact shape of spec §A.7. It is `server-only`.
  - `computeAlerts(prev: { magi: number; headroom: number; repayment: number; zone: Diagnosis['zone'] } | null, next: Diagnosis, asOf: string, rules?: RuleSet): Alert[]`, where `Alert = { code: AlertCode; message: string }` uses the spec §A.8 codes and static templates.
  - `upcomingDeadlines(asOf: string, rules?: RuleSet): Array<{ date: string; label: string; levers: LeverId[] }>`
  - `estimate2027(expected2027: number, plan: PlanResult | null, rules?: RuleSet): { floor: number; cliff2027: number; headroom2027: number; warning: string | null }`
  - `templateExplanation(d: Diagnosis, plan: PlanResult | null): Explanation`. It is deterministic and uses only numbers from its arguments.

- [ ] **Step 1: Write the failing tests:**
  - **F3 gig numbers:** magiWith 133,188; taxOnGig 3,034 (SE 1,696, income 1,338, marginal 0.12); take_do_nothing 1,321; take_with_plan 8,548.
  - **F3b:** lossZone from 7,064 to 10,233 (±5), and an $8,000 gig doing nothing nets −1,668.
  - **F3c:** bill_in_january net 8,966 and ptcKept 7,645.
  - **F13:** floor 123,000; cliff2027 132,000. A property test: for random expected2027 between 0 and 200k, the result is ≥ floor.
  - **Deadlines:** asOf `2026-12-20` excludes Dec 15 and includes Dec 31 and Apr 15.
  - **Alerts:** prev zone `near` → next over the cliff gives `CROSSED_CLIFF`. A repayment change of +$300 gives `REPAYMENT_UP`.
  - **Template:** `templateExplanation(F1 diagnosis, F3 plan)` returns 1–3 paragraphs, and every `$` number in it appears in the inputs.
- [ ] **Step 2: Run the tests.** Expected: FAIL.
- [ ] **Step 3: Implement** spec §A.7 and §A.8. The curve runs from 0 to 30,000 in steps of 500. The loss zone uses a $1 binary search.
- [ ] **Step 4: Run all tests, lint and typecheck.** Expected: PASS.
- [ ] **Step 5: Commit** with message `feat(engine): gig check, alerts, deadlines, 2027 estimate, template` plus the trailer.

### Task 5: App shell, UI kit, landing (S0), check form (S1)

Runs in parallel with T2–T4 and depends only on T1. **Load the `frontend-design:frontend-design` skill first.** The direction: calm and trustworthy fintech, with one strong accent color for the "cliff" (red wall). Not a generic template.

**Files:**
- Modify: `next.config.ts` (cacheComponents and partialPrefetching off), `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Create:
  - `src/lib/money.ts`
  - `src/components/ui/{Button,Card,MoneyInput,Toggle,Stepper,Toast,Skeleton}.tsx`
  - `src/components/Footer.tsx`
  - `src/app/check/page.tsx`
  - `src/components/check/{StepWho,StepMarketplace,StepPlan,StepIncome,StepOptions}.tsx`
- Test: `src/lib/__tests__/money.test.ts`

**Interfaces:**
- Consumes: `HouseholdInputSchema`, `DANI`, `LeverId`.
- Produces:
  - `parseMoney(s: string): number | null` and `formatMoney(n: number, opts?: { cents?: boolean }): string`
  - `<MoneyInput name value onChange error />`
  - The landing CTA **Try Dani's family**: `POST /api/household/sample {persona:'dani'}` → `router.push('/result')`. The route is built in T6; show the spec §C error toast on failure.
  - The check form submits `PUT /api/household` with a `HouseholdInput` validated client-side by `HouseholdInputSchema` → `/result`.

- [ ] **Step 1: Write the failing test (Review Focus 1):**
  - `parseMoney` maps: `'$105,000'`→105000, `'105000'`→105000, `'105k'`→105000, `'105,000.50'`→105000.5, `' 7,294 '`→7294
  - `'-5'`, `'abc'` and `''` → null
  - `formatMoney(122036)` → `'$122,036'`
- [ ] **Step 2: Run `npx vitest run src/lib`.** Expected: FAIL.
- [ ] **Step 3: Implement `money.ts`, then the UI kit, landing and check form,** following spec §C S0/S1:
  - the copy, the "Free calculators stop at the bill." line and the 2026-changes box with source links;
  - the who-it's-for/not-for section;
  - the SBM warning on step 1;
  - the manual SLCSP field when the guards are "no";
  - step 2 helper text: "If your credit changed during the year, enter your average monthly credit.";
  - step 5 has **no** unrealized-losses field;
  - the footer copy from Global Constraints.
- [ ] **Step 4: Run all checks, then `npm run build`.** Open `/` and `/check` at 375 px and desktop in `npm run dev`. Expected: checks PASS, and the pages render without console errors.
- [ ] **Step 5: Commit** with message `feat(ui): app shell, landing, check form` plus the trailer.

### Task 6: Session, store, rate limits, redaction, core API routes

**Files:**
- Create:
  - `src/proxy.ts` (sets `cg_sid` per spec §D)
  - `src/server/{session,store,ratelimit,errors,redact,household}.ts`
  - `src/app/api/household/route.ts` (GET/PUT/DELETE)
  - `src/app/api/household/sample/route.ts`
  - `src/app/api/gig-check/route.ts`
  - `src/app/api/plan/route.ts`
  - `src/app/api/plan/progress/route.ts`
- Modify: `package.json` (add `@upstash/redis`, `@upstash/ratelimit`), `.env.example` (add `APP_URL`, `CLAUDE_ENABLED=true`, `CLAUDE_DAILY_CALL_CAP=1000`; remove `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, which hosted checkout doesn't need)
- Test: `src/server/__tests__/redact.test.ts`, `src/server/__tests__/household.test.ts`

**Interfaces:**
- Consumes: the engine API (T2–T4).
- Produces:
  - `getSid(): Promise<string>`
  - `Store = { get(key): Promise<unknown>; set(key, value, ttlSec?): Promise<void>; del(key); incr(key, ttlSec?): Promise<number> }`, with `store` choosing the Upstash or in-memory implementation per Global Constraints
  - `limit(name: string, id: string, max: number, windowSec: number): Promise<{ ok: boolean; retryAfterSec: number }>`
  - `apiError(code: ErrorCode, status: number, message: string, issues?: unknown): Response`, where `ErrorCode = EngineErrorCode | 'VALIDATION' | 'NOT_FOUND' | 'NOT_ENTITLED' | 'RATE_LIMITED' | 'PAYMENT_UNAVAILABLE' | 'CLAUDE_UNAVAILABLE' | 'NOT_RECOGNIZED' | 'FILE_TOO_LARGE' | 'UNSUPPORTED_FILE_TYPE'`
  - `HouseholdRecordSchema` (spec §D), `loadHousehold(sid): Promise<HouseholdRecord | null>`, `saveHousehold(record): Promise<void>`
  - `isEntitled(record, asOf): boolean`
  - `redactPlan(plan: PlanResult): PlanSummary`, with `PlanSummary` defined in `redact.ts` per spec §D
  - `buildSample(sid: string, asOf: string): Promise<{ household: HouseholdRecord; diagnosis: Diagnosis; gig: GigCheckResult }>`, where the gig's plan is redacted unless entitled; the sample route uses it
  - The route request and response shapes are exactly spec §D.

- [ ] **Step 1: Write the failing tests:**
  - **redact:** move `amount`, `magiReduction`, `howTo` and `proof` become null and `locked` is true; `totals`, `verdict`, `deadline` and `leverId` are kept.
  - **Review Focus 3:** with the memory store holding (a) nothing, (b) `{version: 0}` and (c) the string `'not json{'`, `loadHousehold('sid')` resolves to null each time without throwing. A valid record round-trips.
  - **Sample:** `buildSample(sid, asOf)` returns a diagnosis with MAGI 122,036 and a gig whose plan moves have `amount === null` when not entitled.
- [ ] **Step 2: Run `npx vitest run src/server`.** Expected: FAIL.
- [ ] **Step 3: Implement.** Each route:
  1. Zod-parses the body (`VALIDATION` 400 with issues);
  2. rate-limits per spec §D;
  3. maps `EngineError` to 422 with its code;
  4. never returns plan amounts unless `isEntitled`.

  `DELETE` clears the record and the cookie. Wire the footer's "Delete my data" link to `DELETE /api/household`, then go to `/`.
- [ ] **Step 4: Run all checks.** Then, with `npm run dev`, run `curl -s -c c.txt -b c.txt -X POST localhost:3000/api/household/sample -H 'content-type: application/json' -d '{"persona":"dani"}'`. Expected: the JSON has `"magi":122036`, and plan move amounts are `null`.
- [ ] **Step 5: Commit** with message `feat(server): session, store, limits, redaction, core routes` plus the trailer.

### Task 7: Result (S2), gig check (S3), plan preview (S4)

**Files:**
- Create:
  - `src/lib/latest.ts`
  - `src/app/result/page.tsx`
  - `src/components/result/{Headline,CliffChart,ExtraIncomeSlider,ReportChangeCard,DaysLeftChip,HowWeGotThis,FlagsAccordion}.tsx`
  - `src/components/gig/{GigInput,GigOptionsTable,GigChart}.tsx`
  - `src/app/plan/page.tsx`
  - `src/components/plan/{VerdictBadge,KeepMyCashToggle,LeverList,MoveCard,Totals}.tsx`
- Modify: `package.json` (add `recharts`)
- Test: `src/lib/__tests__/latest.test.ts`

**Interfaces:**
- Consumes: `GET /api/household`, `POST /api/gig-check`, `POST /api/plan`, and client-side `reconcile` for the slider and chart (spec §C "Chart").
- Produces `createLatestGate(): { begin(): number; isLatest(token: number): boolean }`. Every fetch issued by a slider, toggle or lever reorder goes through it.

- [ ] **Step 1: Write the failing test (Review Focus 2):** `begin()` three times, then resolve the tokens in the order 2, 0, 1. Only token 2 is `isLatest`.
- [ ] **Step 2: Run it.** Expected: FAIL.
- [ ] **Step 3: Implement** spec §C S2–S4. Details:
  - The cliff chart is vertical at the cliff (include the points `cliff` and `cliff+1`).
  - The slider runs from $0 to $40k.
  - The loss-zone band is red on the gig chart.
  - Locked amounts render as `$•,•••` with a lock icon.
  - The verdict states (`under_line`, `not_worth_fighting`, `needs_retirement_moves`) use the spec copy. In the `under_line` copy, "$100" is replaced with the engine's `per1000`, formatted.
  - Gig figures carry the label "Rough federal estimate (excludes QBI deduction and state tax)".
  - Lever reorder uses up/down buttons. A disabled lever shows its reason.
  - With no household, redirect to `/`.
- [ ] **Step 4: Run all checks.** Then, in `npm run dev` at 375 px, click "Try Dani's family". Expected:
  - the headline shows $122,036, 379%, $6,564 and $1,697;
  - dragging the slider past the wall shows $9,342;
  - the gig table shows $1,321 and $8,548;
  - flipping Keep my cash recomputes the totals, and the amounts stay locked.
- [ ] **Step 5: Commit** with message `feat(ui): result, gig check, plan preview` plus the trailer.

**═══ G3 (orchestrator, ~22:30):**
1. Merge.
2. Deploy to Vercel.
3. Run `qa-tester` on prod (Dani → result → gig → plan preview).
4. Run the `judge` (G3).
5. Captain decides on the insurance submission.

### Task 8: Paywall, Stripe test checkout, success verification, unlocked plan, export

**Files:**
- Create:
  - `src/server/stripe.ts`
  - `src/server/entitlement.ts`
  - `src/app/api/checkout/route.ts`
  - `src/app/success/page.tsx`
  - `src/components/plan/{Paywall,UnlockedMove,ProofChecklist}.tsx`
  - `src/app/plan/export/page.tsx`
- Modify: `src/app/plan/page.tsx`, `package.json` (add `stripe`)
- Test: `src/server/__tests__/entitlement.test.ts`

**Interfaces:**
- Consumes: `loadHousehold`, `saveHousehold`, `PATCH /api/plan/progress`.
- Produces:
  - `createCheckout(product: 'year'|'rescue', sid: string): Promise<string>` (URL; spec §D Stripe params)
  - `verifyCheckout(session: { id: string; client_reference_id: string | null; status: string | null; payment_status: string; metadata: Record<string,string> | null }, sid: string, now: string, existing: HouseholdRecord['entitlement']): { ok: true; entitlement: NonNullable<HouseholdRecord['entitlement']>; changed: boolean } | { ok: false; reason: 'mismatch' | 'unpaid' }`

- [ ] **Step 1: Write the failing tests (Review Focus 4):**
  - Paid, complete and with a matching sid: rescue gives `validUntil` `2027-10-15`; year gives paidAt + 365 days; `changed` is true.
  - The same session id is already present: `changed` is false and the entitlement is unchanged.
  - A foreign `client_reference_id` gives `mismatch`.
  - `payment_status: 'unpaid'` gives `unpaid`.
- [ ] **Step 2: Run them.** Expected: FAIL.
- [ ] **Step 3: Implement:**
  - The paywall copy and test-card box, verbatim.
  - The value line, computed from the plan.
  - `/success` verifies, saves only when `changed`, then redirects to `/plan` after 2 s.
  - Canceled → the "No charge made" toast.
  - No key → 503 `PAYMENT_UNAVAILABLE` with the spec copy.
  - The unlocked moves show how-to, deadlines, return location, and proof checkboxes that persist through the progress route.
  - The export uses a print layout per spec §C, with "repayment limitation: none for 2026".
- [ ] **Step 4: Run all checks.** With test keys in `.env.local`, buy both products through the 4242 card. Expected: `/plan` unlocks, and `/plan/export` prints. Without keys, the paywall shows the 503 copy.
- [ ] **Step 5: Commit** with message `feat: Stripe test paywall, success verification, unlocked plan, export` plus the trailer.

**═══ After T8:** redeploy and run `qa-tester` on the paywall path (~23:30). Next: T11 as **T11-lite** (check-in form, delta card, `.ics`, Jan 15 card; history sparkline optional), then T13, then the **v1 deploy (~00:30)**. T9, T10 and T12 follow, in that order.

### Task 9: Eligibility-notice extraction (Claude)

**Load the `claude-api` skill first.**

**Files:**
- Create:
  - `src/server/claude/client.ts` (client, `CLAUDE_ENABLED`, daily cap via `store.incr('cg:claude:calls:'+date)`, timeouts)
  - `src/server/claude/extract.ts`
  - `src/server/upload.ts`
  - `src/app/api/extract/route.ts`
  - `scripts/make-sample-notice.ts` → `public/samples/dani-eligibility-notice.pdf`, a synthetic notice watermarked "SAMPLE", generated once with the `pdf-lib` dev dependency and committed
  - `src/components/check/{UploadNotice,ExtractionConfirmCard}.tsx`
- Modify: `src/components/check/StepMarketplace.tsx`
- Test: `src/server/__tests__/extract.test.ts`, `src/server/__tests__/upload.test.ts`

**Interfaces:**
- Produces:
  - `claudeAvailable(): Promise<boolean>`
  - `checkUpload(file: { size: number; type: string }): { ok: true } | { ok: false; code: 'FILE_TOO_LARGE' | 'UNSUPPORTED_FILE_TYPE'; status: 413 | 422 }`
  - `EligibilityNoticeExtractionSchema` (spec §E.1)
  - `validateExtraction(raw: unknown): { extraction: EligibilityNoticeExtraction; warnings: string[] } | { error: 'NOT_RECOGNIZED' }`
  - `extractNotice(file: { bytes: Uint8Array; type: string }): Promise<...same union | { error: 'CLAUDE_UNAVAILABLE' }>`

- [ ] **Step 1: Write the failing tests (Review Focus 5):**
  - `checkUpload`: 5 MB + 1 → 413; `text/html` → 422; pdf, png, jpeg and webp under 5 MB → ok.
  - `validateExtraction`: `docType:'not_a_notice'` → `NOT_RECOGNIZED`; coverageYear 2025 → warning; APTC > premium → warning; aptcMonthly 20,000 → schema failure.
  - `extractNotice` with `CLAUDE_ENABLED=false` → `CLAUDE_UNAVAILABLE`.
- [ ] **Step 2: Run them.** Expected: FAIL.
- [ ] **Step 3: Implement** spec §E.1 and §E.6:
  - the document block in a delimited untrusted section, with no tools and no household data;
  - structured output from the Zod schema;
  - the confirm card with evidence quotes;
  - nothing is saved until the user confirms;
  - documents are never logged or stored.
- [ ] **Step 4: Run all checks.** With a real key, click "Use sample notice". Expected: estimate 105,000 and APTC 778.50, and the state, size and metal fields are filled, each with evidence.
- [ ] **Step 5: Commit** with message `feat(claude): eligibility notice extraction with confirm card` plus the trailer.

### Task 10: Grounded explanation, limits and kill switch

**Files:**
- Create: `src/server/claude/grounding.ts`, `src/server/claude/explain.ts`, `src/app/api/explain/route.ts`, `src/components/plan/ExplainMyPlan.tsx`
- Modify: the routes, to apply every limit in spec §E.7
- Test: `src/server/__tests__/grounding.test.ts`, `src/server/__tests__/explain.test.ts`

**Interfaces:**
- Produces:
  - `allowedNumbers(...sources: unknown[]): Set<number>`, which adds rounded dollars, figures ×100, date parts, and 1–12
  - `ungroundedNumbers(text: string, allowed: Set<number>): number[]` (±1 tolerance)
  - `explainPlan(d: Diagnosis, plan: PlanResult): Promise<Explanation & { source: 'claude' | 'template' }>`

- [ ] **Step 1: Write the failing tests:**
  - **grounding:** "$122,036" passes; "$4,321" is returned; "9.96%" passes against figure 0.0996; "April 15, 2027" passes against the deadline `2027-04-15`; "$1,698" passes against 1,697 (±1).
  - **explain:** with a mocked Claude client returning an ungrounded number twice, the result `source` is `'template'`. With the kill switch on, the template is used immediately.
- [ ] **Step 2: Run them.** Expected: FAIL.
- [ ] **Step 3: Implement** spec §E.2, §E.4 and §E.5. Cache by `planHash` (24 h). Entitled only.
- [ ] **Step 4: Run all checks.** With a key, the unlocked Dani plan → **Explain my plan** shows 3 paragraphs with no ungrounded numbers.
- [ ] **Step 5: Commit** with message `feat(claude): grounded plan explanation, limits, kill switch` plus the trailer.

### Task 11: Check-in, alerts, calendar (.ics), Jan 15 card

Can run in parallel with T9 (different files).

**Files:**
- Create: `src/server/ics.ts`, `src/server/checkin.ts`, `src/app/api/checkin/route.ts`, `src/app/api/calendar.ics/route.ts`, `src/app/checkin/page.tsx`, `src/components/checkin/{CheckinForm,DeltaCard,History,Jan15Card}.tsx`
- Test: `src/server/__tests__/ics.test.ts`, `src/server/__tests__/checkin.test.ts`

**Interfaces:**
- Consumes: `computeAlerts`, `upcomingDeadlines`, `estimate2027`, `diagnose`.
- Produces:
  - `buildIcs(asOf: string, appUrl: string): string`
  - `CheckinBodySchema` (Zod, in `src/app/api/checkin/route.ts`'s sibling `src/server/checkin.ts`), built from the `received` and `expectedRestAfter` shapes of spec §D `Checkin`
  - `applyCheckin(record: HouseholdRecord, body: CheckinBody, asOf: string): { record: HouseholdRecord; checkin: Checkin; diagnosis: Diagnosis; alerts: Alert[] }` (pure, in `src/server/checkin.ts`)

- [ ] **Step 1: Write the failing tests:**
  - **ics:** the output contains `BEGIN:VCALENDAR`, VEVENTs dated 20261215, 20261231, 20270115, 20270131 and 20270415, `TRIGGER:-P7D`, `TRIGGER:-P1D`, and `RRULE:FREQ=MONTHLY;COUNT=12`. Lines end with CRLF.
  - **checkin:** Dani plus $9,000 of SE received with the expected-rest unchanged → zone `over` and the alert `CROSSED_CLIFF`. Checkins are capped at 24, newest last.
- [ ] **Step 2: Run them.** Expected: FAIL.
- [ ] **Step 3: Implement** spec §C S8 and §D. The routes are Year-only; Rescue users see the locked preview. Also add the landing page's return banner (spec §C S0: "Your December check-in is due"), shown when a household exists.
- [ ] **Step 4: Run all checks.** In dev as a Year user: submit a check-in, see the delta card and alerts, download the `.ics` and open it in Calendar.
- [ ] **Step 5: Commit** with message `feat: monthly check-in, alerts, calendar, Jan 15 estimate` plus the trailer.

### Task 12: Q&A with the engine tool (cut first if behind at 23:30)

**Files:**
- Create: `src/server/claude/ask.ts`, `src/app/api/ask/route.ts`, `src/components/plan/AskWhatIf.tsx`
- Test: `src/server/__tests__/ask.test.ts`

**Interfaces:**
- Produces:
  - `RunScenarioInputSchema` (spec §E.3)
  - `runScenarioTool(input: unknown, household: HouseholdInput, asOf: string): { ok: true; result: ScenarioToolResult } | { ok: false; error: string }`
  - `ask(question: string, record: HouseholdRecord, asOf: string): Promise<{ answer: GroundedAnswer; scenarios: ScenarioSummary[]; source: 'claude' | 'unavailable' }>`
  - `ScenarioToolResult`, `GroundedAnswer` and `ScenarioSummary` are defined in `ask.ts` from spec §E.3's tool-result and final-answer shapes

- [ ] **Step 1: Write the failing tests:**
  - `runScenarioTool({label:'stock', extra:{capitalGains:4000}})` returns MAGI = F1 MAGI + 4,000.
  - Invalid input (`extra.wages: 'x'`) → `ok: false`.
  - `ask` with a mocked client doing one `run_scenario` round → an answer whose numbers all pass grounding.
  - A question asking to report lower income → `refused: true` (system prompt §E.5; mocked).
- [ ] **Step 2: Run them.** Expected: FAIL.
- [ ] **Step 3: Implement** spec §E.3: tools `run_scenario` and `get_deadlines` with `strict: true` and `tool_choice: auto`, at most 3 rounds, and the final answer through grounding.
- [ ] **Step 4: Run all checks.** With a key, ask "What if I also sell $4,000 of stock?" Expected: a grounded answer with scenario chips.
- [ ] **Step 5: Commit** with message `feat(claude): what-if Q&A over the engine` plus the trailer.

### Task 13: States, phone polish, README

**Files:**
- Create: `README.md`
- Modify: any component missing a spec §C loading, empty or error state

- [ ] **Step 1: Audit every screen in spec §C** at 375 px and desktop against its Loading, Empty and Error columns, and fix the gaps.
- [ ] **Step 2: Write `README.md`:**
  - the problem and persona (spec §1–2);
  - the live URL placeholder `TBD at deploy`;
  - screenshots in `docs/screenshots/`;
  - an architecture sketch (engine / server / Claude roles);
  - fixture provenance (KFF, Morkel, IRS 2026 draft 8962);
  - how to run (`npm i`, `.env.example`, `npm run dev`, `npm test`);
  - "How the agent team built it" (`CLAUDE.md`, `.claude/agents/`);
  - the "Rules as of Nov 2026" note and the disclaimer.
- [ ] **Step 3: Run `npm run lint && npm run typecheck && npm test && npm run build`,** and `git grep -n "sk_live\|sk_test_[A-Za-z0-9]\{8,\}\|ANTHROPIC_API_KEY=."`. Expected: all PASS, and the grep finds nothing.
- [ ] **Step 4: Commit** with message `docs: README; polish states` plus the trailer.

**═══ G4 (orchestrator):**
1. Run spec §G demo-day checklist.
2. Final `qa-tester` and `judge` passes.
3. Code freeze at 10:30.
4. The captain submits.

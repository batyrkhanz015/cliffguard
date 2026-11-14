# Task 8 report — demo access, unlocked instructions and preparer export

Status: **DONE_WITH_CONCERNS**. Implemented on `codex/t8-t9`, isolated worktree `.claude/worktrees/codex-t8-t9`, based on `794f238`. No other checkout or worktree was edited; no subagents, push, deployment, live payment or paid API call were used.

## Scope ruling

Read task-8-brief first, then the binding progress ledger, spec sections C/D and build handoff. Followed the later handoff ruling to prioritize **demo unlock without Stripe**. Consequently the original brief's Stripe dependency, checkout API, test-card box, `/success` verification, payment/cancel copy and paid-purchase manual tests are intentionally deferred. All access UI explicitly states no payment, no card and no subscription. Existing prices are labeled as planned products. No Stripe SDK or fake payment flow was added.

Read installed Next 16.4.6 guides for route handlers, layouts/pages and async cookies before writing Next code. Applied the React best-practices skill checklist after multiple TSX edits. Used the browser/verification skills for local verification; the browser runtime reported no available browser connections, so visual QA could not run.

## Implemented behavior

- Opt-in server gate `DEMO_UNLOCK_ENABLED=true` in every environment, including production. Config documentation explicitly explains that enabling production demo access makes it available to every visitor with a saved household.
- `POST /api/demo-unlock` validates a strict product-only body, requires an existing anonymous session household, rejects foreign origins, uses existing generic `limit('demoUnlock', sid, 10, 3600)`, and returns the existing structured error format. No new T6 limiter constants or core route changes.
- Existing HouseholdRecord entitlement schema is preserved. Random `demo_` identifiers use the compatibility `stripeSessionId` field; grant timestamps use the compatibility `paidAt` field, with truthful UI/documentation. Rescue ends 2027-10-15, Year is grant +365 days using New York dates. Same-product and active Year retries do not rewrite the household, an explicit Rescue-demo → Year-demo upgrade is allowed without shortening access, and active paid entitlements are preserved.
- `GET /api/plan/access` computes from the server's saved preferences and `lastGig`, applies existing entitlement redaction, returns `no-store`, and exposes no sid/internal grant identifier. Read operations do not overwrite defaults or reset gig/preferences.
- A new `/plan/layout.tsx` appends a reusable access panel around the incoming T7 page. `/plan/page.tsx` and result/gig components were not created or edited. The same panel is directly runnable at `/unlock`, including a **Try Dani’s family** empty-state action that stays on that page.
- Access panel has loading, empty, failure/retry and no-move states. Unlocked moves show engine-derived amounts/MAGI reductions, how-to steps, deadline dates, return locations, warnings and persisted proof/done controls. A panel-wide synchronous mutation lock serializes proof saves; shared lever progress keeps two adults' IRA checklists consistent with T6's schema. Previous checked values remain on failure.
- Panel reads fresh state on successful unlock, mount, focus, explicit details refresh and documented successful plan/gig-change events. `sendJson` has one small notification hook plus PATCH support; T7's alternate client can call the exported notifier after successful writes.
- `/plan/export` checks entitlement on the server and freshly reads stored household inputs, preferences, gig and proofs. It prints household/Marketplace assumptions and SLCSP method, MAGI before/after, both Form 8962 previews, exact moves, deadlines, how-to/return locations, checked proofs, flags, rules id, engine date, generation timestamp and education disclaimer. Includes “Repayment limitation: none for 2026.” Print CSS hides app chrome/controls; nested export receives no access/paywall panel.
- Export after-move Form 8962 is recomputed by applying the actual optimizer moves, including per-adult IRA amounts, to `diagnose`; no calculated sample results are hardcoded.

## RED/GREEN evidence

1. Wrote entitlement/gating/idempotence tests before implementation and ran `npm test -- src/server/__tests__/entitlement.test.ts`: **RED**, missing `../entitlement` module (1 failed suite).
2. Implemented server entitlement helper and reran the focused file: **GREEN**, 7 tests.
3. Parent clarified explicit Rescue-demo → Year-demo upgrade. Added the focused upgrade test before changing its implementation; focused run: **RED**, `expected false to be true` at `upgraded.changed` (1 failed, 7 passed).
4. Implemented upgrade while preserving paid/Year access and added route/export coverage. Focused three-file run: **GREEN**, 15 tests. Covers explicit production gate, disabled API, product/authority validation, foreign origins, missing household, generic limiter/Retry-After, no rewrite on retry, saved preferences/gig/progress preservation, redaction/unlock/identity omission, and Form 8962 reconciliation for default/SEP/IRA plans and changed gigs.

## Final verification

Final code state, after the self-review improvements to standalone sample loading and print row breaks:

- `npm run lint`: **PASS**.
- `npm run typecheck`: **PASS** (`next typegen` and `tsc --noEmit`).
- `npm test`: **PASS**, 21 test files, **394 tests** (379 pre-existing +15 new).
- `git diff --check`: **PASS**.
- Local Next dev server with `DEMO_UNLOCK_ENABLED=true`: started on 3108 after approved sandbox escalation for localhost binding. Stopped the duplicate server when parent reported its separate preview was running; no deployment.
- Real HTTP session flow: `/unlock` 200; empty `/api/plan/access` 404; sample POST 200; locked access 200 with every move amount null; Rescue grant 200 with `mode: demo`; full access 200 with 3 moves and how-to content; progress PATCH 200 and persisted `{ done: true, proofsChecked: [0] }`; `/plan/export` 200 with “Repayment limitation: none for 2026”, checked proof and no paywall heading; Year upgrade 200. Server stdout showed matching successful requests with no application exception.
- Browser connection setup returned “No browser is available”; documented troubleshooting plus one connection list returned `[]`. **375px rendering, checkbox interaction in a real browser, and print-preview visual QA remain unverified.** No browser workaround or additional retries were attempted.

## Self-review and integration concerns

Reviewed the final diff for server/client boundaries, sid omission, explicit server-only configuration, strict input validation, redaction and current entitlement checks, idempotence, existing paid-access preservation, stale-response handling, accessible labels/status/checkbox targets, mobile single-column layout, and print separation. No dependency or lockfile changes.

Detailed developer instructions: `docs/team/demo-access.md`.

1. **T7 integration is pending by design.** Attach its page under the new layout. Merge the small `src/lib/api.ts` change carefully; T7 is editing an API client independently. Its client must call `notifyPlanChanged()` after successful `/api/plan` or `/api/gig-check` writes if it does not use this branch's `sendJson`.
2. **Saved gig contract:** T6 `/api/plan` saves preferences, not its request gig. T8 reads `lastGig`; T7 must pass that same gig, and changing it must first save via `/api/gig-check`. Export/full details must not silently diverge from T7's request-only scenario. No T6 route was changed.
3. **Existing T6 storage race:** household mutations are whole-record read/write operations without compare-and-set. A shared synchronous lock prevents simultaneous proof writes in one mounted access panel. Cross-tab writes, independent T7 preference changes, a panel refresh while a proof save is in flight, or other household mutations can still race. Durable cross-request coordination belongs in the T6 update/store contract; not solved by taking ownership of its files here.
4. **Unauthorized export before T7 merge:** spec-required redirect is `/plan`; that page does not exist in this base. Authorized export works immediately from `/unlock`. Merge T7 before treating the unauthorized redirect destination as complete.
5. **Public demo gate semantics:** disabling the flag blocks new grants; previously granted unexpired access remains valid. There is no payment verification in this path. The compatibility entitlement field names are documented clearly.
6. Visual/browser print QA remains outstanding because no browser connection was available. No real Stripe checkout or payment was attempted, as required by the binding scope ruling.

## Changed files

- `.env.example`
- `docs/team/demo-access.md`
- `src/lib/api.ts`
- `src/lib/planEvents.ts`
- `src/server/entitlement.ts`
- `src/server/planAccess.ts`
- `src/server/__tests__/entitlement.test.ts`
- `src/server/__tests__/demoRoutes.test.ts`
- `src/server/__tests__/planAccess.test.ts`
- `src/app/api/demo-unlock/route.ts`
- `src/app/api/plan/access/route.ts`
- `src/app/plan/layout.tsx`
- `src/app/plan/export/page.tsx`
- `src/app/plan/export/print.css`
- `src/app/unlock/page.tsx`
- `src/components/plan/Paywall.tsx`
- `src/components/plan/PlanAccess.tsx`
- `src/components/plan/PlanProgress.tsx`
- `src/components/plan/ProofChecklist.tsx`
- `src/components/plan/UnlockedMove.tsx`
- `src/components/plan/PrintButton.tsx`
- `.superpowers/sdd/plan/task-8-report.md`

Commit is a local reviewed checkpoint only. Parent will arrange independent review and any fixes before integration.

# T8 demo access integration

T8 implements the later build-handoff ruling: demo unlock first, without Stripe. No payment is created or verified, no card is collected, and no subscription is started. Prices in the access card describe planned products. Stripe checkout and `/success` verification remain deferred.

## Run locally

Set `DEMO_UNLOCK_ENABLED=true` in `.env.local` (or the environment of the dev process), then start `npm run dev`. Open `/unlock`. With no household, choose **Try Dani’s family** to load the sample on that page, or enter household inputs at `/check`. Choose a free Rescue or Year demo, review instructions, check proofs, then open **Tax-preparer export** and use **Print / Save as PDF**.

The exact string `true` enables grants; missing, false, or differently cased values disable them in every environment. The flag is server-only. Enabling it in production deliberately allows every visitor with a saved household to grant themselves demo access. Production still requires the existing Upstash configuration; development can use T6's memory store. Changing the flag prevents new grants; it does not revoke previously stored, unexpired access.

## T7 merge points

- T8 deliberately does not create or change `/plan/page.tsx`, result/gig components, or T6's plan/progress/household routes. `src/app/plan/layout.tsx` renders the T7 page followed by the reusable `PlanAccess` panel. The panel is hidden on `/plan/export`. `/unlock` provides the same complete access flow independently of the incoming page.
- The panel fetches `GET /api/plan/access` on mount, window focus, explicit **Refresh full details**, successful unlock, and a plan-change event. All protected content is computed server-side. Requests use `no-store`, and stale responses are ignored.
- `src/lib/api.ts` is the small expected merge point: add `PATCH` to `sendJson`'s method union and keep the `notifyPlanChanged()` call after successful `/api/plan` or `/api/gig-check` requests. If T7 uses another API client, import `notifyPlanChanged` from `@/lib/planEvents` and call it **after a successful request has saved preferences or the gig**. Equivalent event: `window.dispatchEvent(new Event('cliffguard:plan-changed'))`.
- Do not emit on every toggle before its server write finishes. Preserve T7's newest-response gate when multiple preference requests are in flight. T8 shows a loading card while refreshing so old instructions are not presented as the current plan.
- T6's `POST /api/plan` saves `keepMyCash` and `leverOrder`, but does not save its request's `gig`. T8 details and export use the saved `household.lastGig`. T7 must pass that same saved gig to `/api/plan`; changing a gig requires a successful `/api/gig-check` first, which persists it. T8's read endpoint never writes preferences or resets `lastGig`.
- The export uses a normal document navigation so the server checks current entitlement and reads current stored inputs, preferences, gig and proof state. It redirects to `/plan` without active access. Before T7 merges, that redirect destination does not have a page; authorized access to `/plan/export` works from `/unlock` now.

## Entitlement and progress contract

`POST /api/demo-unlock` accepts exactly `{ product: 'rescue' | 'year' }`, requires an existing household, rejects foreign origins, and uses T6's generic rate limiter at 10 attempts/hour/session. Dates and identity are server-controlled. The response exposes only demo mode, product and the last access date, never the session id or internal grant identifier.

Demo grants fit the existing validated `HouseholdRecord.entitlement`. `stripeSessionId` contains a random `demo_…` identifier and `paidAt` is the grant timestamp solely for compatibility with T6's field names; these fields are not evidence of payment. Rescue ends October 15, 2027; Year ends 365 days after grant, using T6's New York access-date convention. Same-product retries and active Year grants are idempotent. An explicit Rescue-demo → Year-demo upgrade is allowed and never shortens access. Active real paid access is preserved. Expired access can be renewed; already expired fixed-date Rescue grants are refused.

Proofs and done state persist through the existing `PATCH /api/plan/progress`. The panel shares one request coordinator across all moves, disables every checklist while saving, retains previous checks on failure, and shares lever-level progress between both adults' IRA cards to match T6's schema. The coordinator belongs to `PlanAccess` above its loading/ready branches. Manual, focus and plan-change refreshes wait for pending proof saves before showing loading or reading replacement progress. Extra checkbox actions are rejected while a save/read is queued or running; a fresh server read after the save supplies current persisted checks. Refreshing cannot discard the mutation lock when checklist children remount.

T6 currently reads and writes entire household records without compare-and-set. Panel serialization prevents overlapping proof writes and stale progress refreshes within the same access panel; independent tabs, a preference write from T7, or another external household mutation can still race. Durable cross-request concurrency control belongs in T6's storage/update contract and is not introduced here.

## Deferred scope and verification

Real Stripe, checkout success/cancel flows, Claude explanation/Q&A, check-ins and calendar downloads are not implemented by T8's demo-access work. No push or deployment is required for this integration.

Run `npm run lint`, `npm run typecheck`, and `npm test`. Added coverage checks flag eligibility, request validation, rate limiting, entitlement idempotence/upgrades, redaction, identity omission, saved preferences/gig preservation and move-based export reconciliation. A local real-HTTP check covered sample → locked plan → Rescue grant → full plan → saved proof → printable export → Year upgrade. The connected browser was unavailable during implementation, so 375px visual, interactive and print-preview QA remain for review.

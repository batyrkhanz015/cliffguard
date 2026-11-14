# Eligibility notice upload (Task 9)

The Marketplace step can read one PDF, PNG, JPEG or WebP eligibility notice (up to 5 MiB), or the bundled synthetic sample. Both paths call the real Anthropic SDK on the server. The sample is never substituted with pre-parsed facts. Manual entry remains available throughout and when Claude is unavailable.

## Local setup

Use the existing `.env.example` entries in a local server environment:

- `ANTHROPIC_API_KEY`: server-only Anthropic key; never a `NEXT_PUBLIC_` variable.
- `CLAUDE_ENABLED=true`: set to `false` to disable all extraction calls.
- `CLAUDE_DAILY_CALL_CAP=1000`: maximum application requests dispatched per UTC day; zero or an invalid value disables calls.
- Production needs the existing Upstash credentials for counters and limits. Development uses the established in-memory store when Upstash is absent.

No key is necessary to run the rest of the check. Missing keys, disabled extraction, exhausted budget, refusals, malformed output, provider/network failures and timeouts all produce a manual-entry fallback. Customer messages do not expose configuration or raw provider errors. Do not log uploaded bytes, evidence, SDK responses or exceptions.

The current request uses `claude-opus-5-5`, `max_tokens: 1200`, low effort, adaptive thinking, no tools, Zod structured output, and the `server-side-fallback-2026-07-01` beta with `fallbacks: 'default'`. The SDK has explicit logging disabled, no automatic retries, a 25-second timeout and caller-abort propagation. Default provider fallbacks can have their own billing; the application cap counts SDK requests, not internal provider attempts. Failed or aborted dispatched requests consume the reserved daily slot.

## API and save semantics

`POST /api/extract` accepts exactly one of:

- Multipart fields `file` (one file) and `docType=eligibility_notice` (one string).
- JSON `{ "sample": "dani_notice" }` with no extra fields.

A successful response is `{ extraction, warnings, confirmed: false }`. The extraction schema and range checks live in `src/lib/noticeExtraction.ts`; the server additionally leaves values with no nonblank matching evidence quote null. The card permits corrections and blank/manual values. Deterministic warnings cover the coverage year, credit above premium, and reviewing the state notice's household count against the tax return. Filing status and plan coverage are never inferred.

The route applies both existing generic rate limiters: 3 requests/hour/session and 10 requests/day/IP. It bounds the incoming stream before multipart parsing (5 MiB plus 16 KiB for the envelope), validates file size/type and basic byte signatures, and keeps uploaded data only in request memory. A global daily slot is reserved atomically with `store.incr('cg:claude:calls:YYYY-MM-DD')` before dispatch. Rate-limit and budget counters are the only extraction-path writes; no household or document is stored. Canceled and stale client requests cannot apply their result.

Confirmation only patches non-null state, household size, income estimate, APTC, premium and metal values in the browser draft. Existing income, tax filing, coverage, options and other answers survive. Year and plan name are displayed for review; this calculator still checks 2026. Blank fields preserve existing draft answers. Direct step-2 visitors are prompted to complete household questions before advancing to the plan and income questions.

**T6/T7 merge point:** `src/app/api/household/route.ts` now accepts optional `x-cliffguard-input-source: upload` on the existing fully validated final PUT. Other clients default to `manual`. `sendJson` gained optional request headers/signal; the body remains the existing `HouseholdInput`. The CheckForm sets this header only after a confirmation applies values. Cancelled/unconfirmed uploads do not change provenance; “Use Dani's numbers” resets it to manual. No extraction or confirmation calls PUT. Preserve this additive source selection if merging another T6 handler implementation. No plan/result pages changed.

**T6 household-helper merge point:** `replaceInput` in `src/server/household.ts` preserves household state when provenance changes `manual` → `upload` or `upload` → `manual`: these are two entry methods for the same personal household. The saved gig, proof/done progress, check-in history, preferences and entitlement survive, so changing entry method does not discard the export scenario or tracked work. Crossing between `sample_dani` and either personal source still resets gig, progress and check-ins; preferences and entitlement survive as before. Preserve this minimal source-boundary correction with the provenance header when integrating another T6 implementation; the stored schema and engine inputs are unchanged.

## Sample and verification

`node scripts/make-sample-notice.ts` (Node 24+) regenerates `public/samples/dani-eligibility-notice.pdf` with the development-only `pdf-lib` dependency. The committed one-page PDF has a SAMPLE watermark and synthetic/not-valid disclaimers, and shows 2026, TX, household 4, annual estimate $105,000, APTC $778.50/month, premium $1,240/month and Bronze. `next.config.ts` explicitly includes this asset in the `/api/extract` production trace.

Tests exercise the real SDK with a fake fetch transport; they never use paid API calls. Run `npm run lint`, `npm run typecheck` and `npm test`. Before release with a real key, manually use the sample, verify its numbers/evidence, edit one value, confirm, complete the remaining questions and check the final household source is upload. Also check cancel/retry, a non-notice, and kill-switch/manual fallback. Browser interaction and paid live extraction must be verified separately; successful fake-transport tests do not establish live model quality or latency.

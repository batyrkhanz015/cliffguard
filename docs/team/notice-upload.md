# Eligibility notice upload (Task 9)

## Current interface

Open `/check?step=2`. Clicking the dashed upload area opens the native file picker; dropping or choosing one valid PDF, PNG, JPEG or WebP (up to 4 MB) starts AI reading immediately. The disclosure above the area explains automatic transmission to the external AI service. The separate **Read notice** button has been removed.

A violet sample panel below the upload area contains one **Read sample with AI** button. It sends the bundled fictional PDF through the same real extraction API and then asks the user to review its values. It never reads a previously selected personal file. The duplicate offline **Try demo notice** button has been removed; **Use Dani's numbers** at the top of the form remains the way to explore the full questionnaire without AI.

Failed AI reading never silently substitutes sample values. Manual entry remains available. Cancellation and stale-response checks prevent a cancelled or replaced request from applying results. Retry resends the original file or sample choice. The picker resets after selection, allowing the same file to be chosen again after a failed or cancelled read. Selecting an invalid/multiple-file upload makes no AI call.

## Provider and limits

Server-only provider code lives in `src/server/ai`. Configure `AI_PROVIDER=openai`, `OPENAI_API_KEY` and optional `OPENAI_MODEL` in an ignored local environment file; the default OpenAI model is `gpt-6.1-sol`. Anthropic remains available with `AI_PROVIDER=anthropic` and `ANTHROPIC_API_KEY`. See `openai-integration.md` for the integration and live verification.

- `AI_ENABLED=false` forces manual/template fallbacks.
- `AI_DAILY_CALL_CAP` caps requests across all visitors and both providers; the local demo uses 100/day. Invalid/zero values disable calls. Legacy Anthropic-only controls remain supported.
- Extraction allows 3 requests/hour/session and 10/day/IP, a 4 MB file plus a 16 KiB multipart envelope, 4,000 output tokens/call and a 25-second provider timeout. Failed dispatched requests consume daily slots.
- The global counter is `cg:ai:calls:YYYY-MM-DD`, reserved atomically before dispatch. Development uses the in-memory store when Upstash is absent; production needs shared storage.
- Input-token/page limits and a direct dollar budget remain future work. Provider request caps are not dollar budgets.

## API and confirmation

`POST /api/extract` accepts exactly one of:

- Multipart fields `file` (one file) and `docType=eligibility_notice`.
- JSON `{ "sample": "dani_notice" }` with no extra fields.

A successful response is `{ extraction, warnings, confirmed: false }`. The server validates the schema, ranges, type signatures and nonblank evidence for extracted fields. Missing evidence leaves a value null. Neither personal uploads nor sample reading change form answers until the user confirms them. The card supports corrections and blank/manual fields. Filing status and plan coverage are never inferred.

Confirmation patches non-null state, household size, income estimate, APTC, premium and metal values into the browser draft. Existing answers survive. Year and plan name are displayed for review; the calculator still checks 2026. Only finishing the full questionnaire saves the household, using the existing validated final PUT and upload-provenance header. No extraction or confirmation call saves a household or document. Changing between personal manual/upload entry preserves household work; switching between Dani and personal data keeps the existing reset semantics.

Uploaded bytes stay in request memory. Do not log bytes, evidence, raw provider responses, exceptions or credentials. Missing keys, refusals, invalid responses, quota/network failures, timeouts and exhausted caps return sanitized manual-entry errors.

## Sample and verification

`public/samples/dani-eligibility-notice.pdf` is a one-page synthetic notice with SAMPLE/not-valid disclaimers, year 2026, TX, household 4, annual estimate $105,000, APTC $778.50/month, premium $1,240/month and Bronze. `node scripts/make-sample-notice.ts` (Node 24+) regenerates it with the development-only `pdf-lib` dependency. `next.config.ts` includes it in the extraction production trace.

Provider tests exercise real SDKs with fake transports. Live OpenAI extraction and a grounded explanation were verified separately using the fictional PDF and a disposable Dani session. The simplified interface passed lint, TypeScript, 21 relevant request/provenance/confirmation tests, direct component-event checks (with a fake transport) for picker/drop automatic reading, the current file payload, sample isolation, invalid/multiple files, retry, cancellation, same-file reselection and confirmation gating, plus a live HTTP check of the rendered controls. These event checks used a hook harness rather than a browser; interactive browser verification remains manual when the browser runtime is unavailable.

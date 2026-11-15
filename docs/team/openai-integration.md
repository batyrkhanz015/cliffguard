# OpenAI integration handoff

OpenAI can now read eligibility notices (T9) and explain finished engine results (T10). The local preview selects OpenAI with `gpt-6.1-sol`. Anthropic remains selectable; the calculation engine, unlock flow, exports and check-ins are unchanged.

## Configuration

Copy `.env.example` to `.env.local`, set `AI_PROVIDER=openai` and enter `OPENAI_API_KEY` locally. Never commit or print the credential. The configured local preview's `.env.local` has owner-only permissions and is ignored by Git. The credential shared in chat should be revoked and replaced there; it has not been added to tracked files. Other checkouts and production do not inherit this local file. A production deployment needs its own server-side environment settings.

`AI_ENABLED=false` selects the existing manual/template fallbacks. `AI_DAILY_CALL_CAP` is shared across providers and all users; the local demo uses 100 calls/day. `OPENAI_MODEL` is server-controlled. `AI_PROVIDER=anthropic` uses the existing Anthropic integration and key. Invalid provider configuration fails closed, with no cross-provider fallback that could send documents elsewhere unexpectedly.

## Implementation

- Provider code moved from `src/server/claude` to `src/server/ai`; route and test imports were updated.
- OpenAI uses the Responses API via the installed AI SDK 7 and `@ai-sdk/openai`. The URL is pinned to OpenAI. PDF/images are sent inline under generic filenames; no Files API upload is persisted.
- Strict JSON schemas, evidence requirements, user confirmation, number/move validation and one shared-deadline grounding retry remain. The explanation response/UI accepts `source: 'openai'` alongside `'claude'` and `'template'`.
- Cache hashes include the provider/model. Data deletion still removes the single session cache envelope.
- Requests use low reasoning, 4,000 output tokens, `store: false`, no tools, zero SDK transport retries, disabled telemetry and sanitized error responses. No document/key/provider body is logged. Errors use the provider-neutral `AI_UNAVAILABLE` code.
- Existing upload/session/IP limits remain. The daily request cap is not a token or dollar budget. An application-enforced spend budget, input-token/page caps, account quotas and cross-request single-flight deduplication are not implemented.

## Verification

- Real provider SDK with fake transport: PDF/image payloads, strict schema, no response storage/tools, fixed API origin, evidence handling, refusals, incomplete replies, invalid data, quota/network errors, no error logs/retries, disabled/missing config, concurrent caps, provider switching, number repair, cancellation, deadline and model-aware cache hashes.
- Live local HTTP flow: `/check?step=2` renders; fictional sample PDF extraction returns evidenced, unconfirmed fields; a disposable Dani session gets an OpenAI explanation that passes grounding; repeating it reuses the cache. Disposable session data was deleted afterward. No personal document was used.
- Browser runtime reports no available browsers; interactive browser verification remains manual.
- Final automated checks: 574 tests across 48 files, ESLint, TypeScript and the default Turbopack production build passed. Runtime is Node 24; the AI SDK requires Node 22 or later. The credential is absent from tracked/eligible files and browser JavaScript assets.

Local preview: `http://127.0.0.1:3002/check?step=2`. Try **Read sample with AI**, or load Dani, unlock a demo plan and click **Explain my plan**.

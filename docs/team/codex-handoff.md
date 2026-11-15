# Codex handoff: T8–T11

Start here when integrating the completed work from branch `codex/t8-t9` into the other LLM's T7 work. The branch includes the existing T6 checkpoint `794f238` as its base; that commit was ahead of remote `v1` when this handoff was prepared. The reviewed feature checkpoint is `14ae5a8`, followed by this documentation update. T7's separate worktree has not been modified or merged.

## Completed

| Task | Delivered |
|---|---|
| T8 | Explicit no-payment Rescue/Year demo unlock, protected exact plan, persisted proof checklist, print/PDF export |
| T9 | Real Claude notice-reading integration, editable confirmation, clickable drag-and-drop area, separate clearly labeled offline sample demo |
| T10 | Calculation-based explanation without a key; prepared live Claude path with structured output, numeric validation, bounded retry/deadline, limits and deletable cache |
| T11 | Year check-ins, real recalculations/deltas/alerts/history, January estimate, calendar download, navigation and return banner |

The task table is in [build-handoff.md](build-handoff.md). Read the integration contracts before resolving overlaps:

- [demo-access.md](demo-access.md): saved gig/preferences, plan-change notifications, mutation coordination and export.
- [notice-upload.md](notice-upload.md): confirmed values only, upload provenance and manual/upload state preservation.
- [checkin-integration.md](checkin-integration.md): public serializers, household-scoped retry lifecycle, Year gates, endpoint contracts and storage limits.

## Run and inspect

```sh
git fetch origin
git switch --track origin/codex/t8-t9
npm ci
DEMO_UNLOCK_ENABLED=true npm run dev -- --port 3002 --hostname 127.0.0.1
```

Use a clean checkout or a separate worktree if T7 has uncommitted changes. If the local branch already exists, switch to it instead of creating it again.

- `/plan`: load Dani's family if needed, choose **Unlock Year demo — free**, then explain the plan or open check-ins/calendar/export.
- `/checkin`: update 2026 figures, inspect before/after results and history, calculate the 2027 floor, download `.ics`.
- `/check?step=2`: click/drop a notice; **Try demo notice** is offline. **Read notice** and **Read sample with AI** require `ANTHROPIC_API_KEY`.

No LLM key is needed for the calculation-based explanation, offline notice demo, check-ins, calendar, unlock or export. Add `ANTHROPIC_API_KEY` to this checkout's `.env.local` and restart to enable live extraction/explanation. Production also needs the existing Upstash configuration.

## Integration work still needed

1. Combine T7's result/gig/plan pages with this branch. `/plan` is the working plan entry until then; this branch does not create `/result/page.tsx` or `/plan/page.tsx`.
2. Preserve shared `sendJson` lifecycle cleanup and plan-change events if integrating another API client. Preserve the saved gig/preferences contract, public household/check-in allowlists, and optional backward-compatible household/check-in metadata.
3. Do not replace the shared request coordinator with independent unlock/progress writes. Keep uncertain check-in UUID/body through temporary errors; deletion/replacement must erase pending browser input and the server explanation cache.
4. Complete T13 visual/state/README/release work. Verify live Claude access/quality with a real key, browser/mobile interactions, and native calendar import. T12 and real Stripe remain deferred.

## Verification and limits

Lint, strict type checking, **523 tests across 37 files**, production build and actual local HTTP flow passed. Independent task and combined reviews approved the implementation after fixes. HTTP checks covered access gates, keyless explanation, real cliff-crossing alerts, replay/stale rejection, saved plan state, exact estimate floor, calendar, navigation, return-banner states and private response allowlists. Audit sessions were deleted. No paid provider calls were made.

T6 still lacks compare-and-set for simultaneous whole-record writes across tabs/servers. Stable IDs and baseline checks protect normal sequential retries; retained replay history is capped at 24. These limits are documented, not presented as distributed transaction guarantees. No production deployment is part of this handoff.

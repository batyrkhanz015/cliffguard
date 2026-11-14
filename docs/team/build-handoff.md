# Build handoff: resume here after `/clear`

> **For the next Claude session (the orchestrator):** read this, then `CLAUDE.md`, then the ledger at `.superpowers/sdd/plan/progress.md`. Trust `git log` and the ledger over memory. Updated 23:40 on Nov 14, 2026 (+05). Hackathon deadline: **12:00 on Nov 15**; internal submit **11:00**.

## 1. Where things stand
- **Product:** CliffGuard, "Take the gig. Keep your health subsidy." It is an ACA subsidy-cliff rescue planner for variable earners. Idea and decisions: `docs/handoff.md`. Approved spec: `docs/spec.md`. Build plan: `docs/plan.md` (13 tasks, read its "G2 judge changes" section). Pitch plan: `docs/pitch-handoff.md`.
- **Repo:** local `/Users/batyrhanzharov/Desktop/business-cup-zimran`, working branch **`v1`**. **Private** GitHub: https://github.com/batyrkhanz015/cliffguard. Captain 00:00: push every reviewed checkpoint to `v1` and fast-forward `main` to it; teammate `ggoku13` works from GitHub issues (label `teammate`), branches off `v1`, PRs into `v1`.

| Task | State | Commits |
|---|---|---|
| T1 engine core | ✅ complete, reviewed | e9a2e0d..1e8b166 |
| T2 SLCSP, reconcile, diagnose | ✅ complete, reviewed | 1e8b166..bb4d331 |
| T3 tax, levers, optimizer | ✅ complete, reviewed | 0be6361..e19deff |
| T4 gig, alerts, deadlines, estimate, template | ✅ complete, reviewed (fix round 1 clean) | e19deff..bdf5f2a |
| T5 app shell, landing, check form (zimran style) | ✅ complete, reviewed, **merged into v1** (f18ee42) | 1e8b166..be41d1f |
| T6 server, session, store, routes | ⏳ builder (opus) dispatched 23:35 on v1, BASE f18ee42 | — |
| T7 result, gig, plan screens | ⏳ **phase 1** (components + latest gate) builder (sonnet) in an isolated worktree, parallel with T6. **Phase 2** (pages wired to T6 routes) = resume the same builder after T6 merges | — |
| T8–T11, T13 | not started. **T12 cut** (ledger ruling 23:40). **Captain 00:00: T8 = demo unlock (no Stripe) is the priority**; Stripe test checkout only if time remains | — |

## 2. Resume steps, in order
1. Check `git log v1`, `git worktree list` and the report files `task-6-report.md` / `task-7-report.md` before re-dispatching anything.
2. T6 done → review package f18ee42..HEAD → code-reviewer (sonnet) → fix loop.
3. T7 phase 1 done → after T6 is reviewed, tell the T7 builder (or a fresh one with brief + report) to merge `v1` into its worktree branch and do phase 2. Then review the whole T7 range, merge the worktree branch into v1 with `--no-ff`, remove the worktree.
4. Pending from the captain: (Stripe deferred — demo unlock first), `ANTHROPIC_API_KEY` for T9/T10, and **Upstash Redis** (`UPSTASH_REDIS_REST_URL`/`_TOKEN`) for any Vercel deploy (prod refuses the in-memory store).
5. **G3 = localhost review, NOT a deploy.** Run `npm run dev` and give the captain http://localhost:3000. Optionally run `qa-tester` against localhost. **Deploy to Vercel only when the captain explicitly approves.**
6. Then: T8 (Stripe test paywall, export), T11-lite (check-in, `.ics`, Jan 15 card, landing return banner), T13 (README, polish, plus the parked minors from the ledger), then a deploy **on approval**. After that: T9 (Claude notice extraction), T10 (grounded explanation), T12 (Q&A, optional).

`<SK>` = `/Users/batyrhanzharov/.claude/plugins/cache/anthropic-plugin-directory/superpowers/7.0.2-22f0b463e7a5/skills/subagent-driven-development`

## 3. Process (superpowers:subagent-driven-development)
- **Ledger:** `.superpowers/sdd/plan/progress.md`, with the pre-flight table, every ruling, and the carried and parked items. Append to it after each step.
- **Per task:**
  1. `bash <SK>/scripts/task-brief docs/plan.md N`
  2. Dispatch a `builder` with the brief and report paths.
  3. `bash <SK>/scripts/review-package docs/plan.md BASE HEAD`
  4. Review with `code-reviewer`.
  5. Run the fix loop (`<SK>/references/fix-loop.md`) if there's an Important or Critical finding.
  6. Mark it complete in the ledger.
- **Models (captain-approved):** reviewers and QA on **sonnet**. Builders on **opus** for judgment-heavy tasks (T9, T10, T12, and T6 because of integration risk); **sonnet** for well-specified ones (T7, T8, T11, T13).
- Builders commit locally with both trailer lines and **never push**. The orchestrator pushes to the private repo at checkpoints.

## 4. Captain's standing rules
- **No Vercel deploy without the captain's explicit approval.** Show localhost first, because the captain may edit.
- **The GitHub repo stays private.** Make it public only on the captain's word, before submission.
- **The UI follows zimran.io's design language:**
  - violet `#5B42DC` (hover `#4F31BA`); light `#F2F2F2`; dark `#0C0C0C`; red `#FB2C36` for the cliff; green `#00C758` for money kept;
  - Inter Tight for headlines, Silkscreen for pixel labels, Inter for body;
  - small radii; violet-bordered cards with a corner square; pixel squares as decoration;
  - **no Zimran logo, name or fonts.**
- Teammates aren't building UI yet; they may edit later through the private repo. One teammate builds the pitch from `docs/pitch-handoff.md`.
- Don't reopen locked product decisions (`docs/handoff.md`, `docs/spec.md` §H, which are all approved).

## 5. Waiting on the captain
- `ANTHROPIC_API_KEY` in `.env.local` (and later in Vercel) for T9 and T10.
- `STRIPE_SECRET_KEY` (test mode) for T8.
- Pitch: 3–5 real Reddit quotes (a human task), and the deck PDF by 10:00.
- Vercel CLI is logged in. Binary: `/Users/batyrhanzharov/.local/share/node-v24.22.0-darwin-arm64/bin/vercel` (not on PATH).

## 6. Key facts for answering questions
- **Engine:** `src/engine/`. Client-safe exports are in `index.ts`; server-only ones (optimizer, levers, tax, gig) are in `server.ts`. About 276 tests reproduce the IRS 2026 draft Form 8962 example ($71,910 → $1,529), KFF ($745 → $34,463), Morkel ($7,294 vs $3,289), and Dani's fixtures:
  - MAGI 122,036
  - repayment 1,697
  - $12k gig: keeps 1,321, or 8,548 with the plan
  - $8k gig: −1,668
- **Corrections already applied:** 12% bracket (not 22%); MAGI subtracts half of SE tax; QBI is excluded and the result is labelled "rough federal estimate"; the 403% example is from Morkel, not Instead.
- **Judge scores:** G1 7.20, G2 7.63 (`docs/scores.md`).

# Business Cup — 24h Hackathon

## Mission
Ship a **B2C, web-only** product that closes a fundamental pain for **US adults 25–45** (working adults with jobs, families, bills, goals) — **one they will pay for**.
Track: Money, Entertainment, or Skills — narrowed to **one user and one pain**.

**Deadline: 12:00, Nov 15 2026.** Resubmission allowed; the latest version is judged.
Internal deadline: **final submit by 11:00** (1h buffer). Code freeze 10:30.

## How we are judged — every decision is weighed against this
| Weight | Criterion | What it means for us |
|---|---|---|
| 40% | Does it work? | Live in production, end-to-end. Core value computed live — never faked or hardcoded. UX and code quality: **the jury reads the repo.** |
| 20% | What do we sell? | Obvious what the user pays for, and why they come back tomorrow. |
| 15% | Who do we sell to? | One sharp persona and trigger moment, with evidence that we understand them. |
| 15% | Why does it make money? | Big or growing niche, credible path to $100M ARR, LTV > CAC with a named channel. |
| 10% | Is it new? | Not a copy of an existing business. See the originality guardrail. |

## Submission (all three required, submitted by the captain)
1. Pitch deck PDF, **≤10 slides**, covering every criterion above.
2. Production URL. The jury uses it end-to-end with **no sign-up or login**.
3. Public GitHub repo, with no access requests and no login.

## Originality guardrail
Every team has the same LLM tools, so ideas an LLM suggests by default will be built many times. An idea qualifies only if:
1. It is not an LLM-default idea, e.g. AI budgeting coach, subscription canceller, bill negotiator, medical-bill disputer, debt planner, expense splitter, mock-interview coach, AI tutor, language partner, resume coach, bedtime stories, date-night planner, what-to-watch picker, AI dungeon master, murder-mystery generator.
2. It serves a **specific person at a specific trigger moment**, not a category.
3. Its output is **computed from a document or data the user already has, or from public data**. A chat window is not a product.
4. There is evidence of real people asking for it in their own words.
5. No well-funded B2C competitor does exactly this. We searched and wrote down what we found.

## Agent team (`.claude/agents/`)
The main session is the **orchestrator**: it plans, dispatches, integrates, and talks to the humans. It does not do long research or reviews inline.

| Agent | Called when | Writes | Edits code? |
|---|---|---|---|
| `researcher` | Users, competitors, market sizing, evidence for the deck | `research/*.md` | No |
| `strategist` | After an idea is picked: spec, pricing, retention, unit economics, demo script | `docs/spec.md` | No |
| `judge` | At every gate. Scores against the rubric like a harsh juror and names the top 3 fixes | `docs/scores.md` (append) | No |
| `builder` | One plan task at a time | app code + tests | **Yes** |
| `code-reviewer` | After every builder task, before merging | review in its reply | No |
| `qa-tester` | After each deploy: walks the jury path on the live URL in a browser | `docs/qa.md` (append) | No |
| `pitch-writer` | From v1 onward: the ≤10-slide deck mapped to the rubric | `pitch/deck.md` | No |

### Orchestration rules
- Run independent work in parallel: dispatch every independent agent in one message.
- Every agent writes full output to a file and returns a **short summary** (≤300 words), which keeps the orchestrator's context lean.
- Agents get self-contained prompts: goal, constraints, file paths, expected output. Never "see above".
- Reviewers, the judge and QA **never edit code**. They report, and the builder fixes.
- Use parallel builders in separate git worktrees only for non-overlapping areas, e.g. the landing page vs. the core engine vs. the deck.
- Builders commit after each task passes review, with a clear message. Never commit secrets.
- A finding from the judge or QA becomes a task only if it moves the score. Weigh it against the clock.

## Gates & timeline (Nov 14 → Nov 15)
| Time | Phase | Gate |
|---|---|---|
| 15:15–16:15 | **Research**: researchers in parallel across tracks, a niche hunt, and a scan of 2025–26 rule changes | — |
| 16:15–16:45 | **Pick**: the judge ranks the shortlist; the humans choose | **G1: idea locked** |
| 16:45–17:45 | **Spec + plan**: the strategist writes `docs/spec.md`; the judge reviews; then `docs/plan.md`. In parallel: scaffold, deploy a hello-world to Vercel, set up API keys and Stripe test mode | **G2: spec approved** |
| 17:45–22:00 | **Build v1**: magic moment first, then the paywall, then the landing page. Review after every task | — |
| ~22:00 | **Deploy v1, run QA, make the first real submission** (insurance) | **G3: judge scores the live product** |
| 22:00–02:00 | **Iterate**: QA bugs, the judge's top fixes, retention hook, UX polish. Deck drafted in parallel | — |
| 02:00–07:00 | Humans rest in shifts. No risky changes overnight | — |
| 07:00–10:30 | **Polish**: final QA on prod, README, deck with real screenshots → PDF | **G4: judge's pre-submit score** |
| 10:30–11:00 | Code freeze, then final submission | Submitted |

## The jury path (definition of done)
Open URL → no login → **valuable result in <60s** (one-click "try a sample" plus your own input) → clear paywall → Stripe **test-mode** checkout (show the `4242 4242 4242 4242` hint in the UI) → the paid feature unlocks → there is a reason to return (saved state, reminders, recurring value).
Must also work at phone width, and every step needs loading, empty, and error states.

## Engineering standards
- **Stack:** Next.js (App Router) + TypeScript `strict` + Tailwind, deployed on Vercel. Validate every input and every LLM output with Zod.
- **Claude API:** server-side only (`@anthropic-ai/sdk`). Load the `claude-api` skill before writing any Claude API code, and pick the model and features from it. Use structured outputs or tool schemas, not regex on prose.
- **No login:** use an anonymous session id in an httpOnly cookie. Choose the smallest persistence that works (none > KV > Postgres), and decide it in the plan.
- **Real, not faked:** sample inputs are fine, but outputs are always computed live. No hardcoded "AI" results.
- **Cost and abuse:** rate-limit AI routes per session and IP, cap tokens and upload size, and treat uploaded content as untrusted (prompt-injection aware).
- **Secrets:** only in env vars. Keep `.env.example` in the repo and `.env*` out of git.
- **Quality, because the jury reads the repo:** small focused modules, no dead code, no `any`, and `lint` + `typecheck` + `test` pass before every commit. Unit-test the deterministic core logic; don't chase coverage on UI.
- **README:** the problem, the persona, a live link, screenshots, architecture sketch, how to run, and how the agent team built it.

## Repo layout
```
research/     raw research by agents (sources linked)
docs/         spec.md, plan.md, scores.md, qa.md, decisions
pitch/        deck.md → deck.pdf
src/ or app/  the product
.claude/      agent definitions
```

## Working with the humans
- The humans make the calls on the idea, scope cuts, and anything outward-facing (submission, public repo, payments). Bring them decisions with a recommendation, not open questions.
- Report status in one line per agent. Say plainly what is broken.

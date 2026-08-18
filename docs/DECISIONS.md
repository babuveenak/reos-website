# REOS AI Platform — Decisions

Deliverable 2 of the Phase A package (see [V3-MASTER-PROMPT.md](V3-MASTER-PROMPT.md) PART 2
and [AI-PLATFORM-ARCHITECTURE.md](AI-PLATFORM-ARCHITECTURE.md)).

Four decisions govern the build. Each carries a recommendation and the
consequences of the alternative. **All four are marked `RECOMMENDED — AWAITING
SIGN-OFF`**: the architecture package is written on the recommended path, and
changing any of them changes work already specified. Sign off by replacing the
status line and dating it.

---

## D‑1 · Runtime and hosting target

**Status: DECIDED — Vercel.** Set by the project owner, 2026-08-18.
**Vercel is the current and intended hosting platform. Do not migrate to
Cloudflare.**

**Correcting the earlier reading.** The first pass of this document recommended
staying on the Cloudflare Workers / OpenAI Sites toolchain, on the evidence of
`vinext`, `@cloudflare/vite-plugin`, `wrangler`, `worker/index.ts` and
`drizzle.config.ts` at `dialect: "sqlite"`. That over-weighted the toolchain.
`package.json` also carries plain `next build` and `next dev`, which is the
standard Next pipeline Vercel serves, and `NEXT_PUBLIC_SITE_URL` already points
at `reos-website.vercel.app`. The Workers path is scaffold inherited from the
template (`build:sites`), not the deployment target.

**What this commits us to.**

| Consequence | Where it lands |
|---|---|
| **Postgres (Neon) as the system of record**, not D1/SQLite | Architecture §3 — the DDL is Postgres, not SQLite |
| **`pgvector` for embeddings**, in the same database as the entities — one query can filter and rank together | Architecture §6 |
| **Vercel Blob (or S3) for source documents**, with signed time-limited access | Architecture §5.2 |
| **Node runtime functions** — PDF/OCR extraction can run in a background function rather than needing a queue consumer | Architecture §5.4 |
| Anthropic API reached over HTTPS from a route handler | Architecture §7 |
| `drizzle.config.ts` moves to `dialect: "postgresql"` when phase 2 starts | Architecture §10 phase 2 |

**Two loose ends this decision exposes**, both worth closing before phase 2:

1. **The test harness asserts against the wrong artifact.** `tests/*.test.mjs`
   import `dist/server/index.js` — the *Workers* build produced by
   `npm run build:sites` — which is not what Vercel serves. The assertions are
   still valuable (they are the invariant guard), but they are verifying a build
   output that is no longer the deployment artifact. Either keep `build:sites` as
   a test-only harness and say so explicitly, or port the harness onto
   `next build` output. **Not changed in Phase 1A** — it is the existing green
   test path and breaking it would be worse than the inconsistency.
2. **Three configured origins.** `app/robots.ts` hardcodes a
   `sites.openai.com` sitemap URL while `app/sitemap.ts` emits `SITE_URL`
   (`vercel.app`). With Vercel settled, `robots.ts` should derive from `SITE_URL`.
   Two-line fix, still open.

**Hosting does not choose the AI provider.** Deploying on Vercel implies nothing
about which model, SDK, embedding provider or speech vendor this platform uses —
see D‑5.

---

## D‑5 · AI provider, SDK and speech vendors

**Status: OPEN — explicitly decoupled from D‑1.**

Running on Vercel does **not** mean using Vercel's AI SDK, Vercel's AI Gateway,
or any provider Vercel resells. Nothing in the architecture depends on it, and
Phase 1A is built so it cannot: every model, retrieval and speech capability
sits behind an interface in [app/assistant/contracts.ts](../app/assistant/contracts.ts)
(`AIService`, `KnowledgeService`, `VoiceProvider`, …) with a mock implementation
today.

Four independent choices, none made:

| Choice | Status | Constraint that will decide it |
|---|---|---|
| **Generation model** | Open | Architecture §7.7 uses `claude-opus-5` as the worked example because it is what the cost model and the API contract were written against. It is a recommendation, not a commitment |
| **SDK / transport** | Open | Any HTTPS-capable client works from a Next route handler. A provider-specific SDK is not required, and adopting one narrows the abstraction Phase 1A just built |
| **Embedding provider** | Open | **Hard requirement: must be multilingual.** Cross-language retrieval (Arabic query → English source) cannot be satisfied by a monolingual English model. This constraint eliminates more candidates than cost does |
| **STT / TTS** | Open | **Hard requirement: Gulf/Khaliji Arabic coverage, not MSA-only**, plus barge-in and code-switching. This is a vendor-selection gate to test before committing, per Architecture §8.1 |

**Consequence for the build.** No phase before 5 (assistant, text, English) needs
this settled, and phase 8 (voice) needs only the speech half. Keep the mock
implementations working after the real providers land — they are what make the UI
testable in CI without spending money or a network round trip.

---

## D‑2 · What the assistant is

**Status:** RECOMMENDED — AWAITING SIGN-OFF
**Recommendation:** Navigator/explainer for V1, becoming an advisor per-topic
only as claims reach `Validated`.

**Why.** The platform's value is the graph; the assistant's job in V1 is to route
a visitor into it and explain what they are looking at. A general-purpose advisor
over a corpus that is partly `To Be Validated` is where the regulatory exposure
in Architecture §9 becomes real — real-estate brokerage, legal practice and
immigration advice are regulated activities in the UAE.

**Consequence.** The answer contract (Architecture §7.4) always ends in a link
into the site, and the `regulated-advice` refusal type is not optional. Every
operative claim carries a source. The assistant explains process; it does not
advise.

**If the answer is "advisor from day one":** the eval thresholds in §8 must rise,
the `regulated-advice` boundary needs legal review rather than engineering
judgment, and the content-readiness gate in D‑3 becomes the binding constraint on
launch scope rather than a filter.

---

## D‑3 · Content-readiness gate

**Status:** RECOMMENDED — AWAITING SIGN-OFF
**Recommendation:** Ground on `Validated` only. Surface `To Be Validated` as
clearly-labelled orientation. Never ground on `Illustrative` or
`Future REOS Capability`.

**Why.** The existing `ContentStatus` union is the repository's strongest asset
and the reason the site is credible. Making it a retrieval filter rather than a
badge is what stops the assistant asserting a worked example as a requirement.

**Consequence — read this one carefully.** 5 of 12 routes in
[app/data/routes.ts](../app/data/routes.ts) are still `pending`, and much of the
corpus is `To Be Validated`. A correctly-built assistant over today's content
will decline a large share of questions. **The binding constraint on this project
is editorial, not engineering.** That is why Architecture §10 phase 3 is one
fully-sourced vertical slice rather than broad coverage, and why the homepage
suggested prompts (V3 PART 6.2) must be answerable on day one.

**If the answer is "ground on everything":** the platform's credibility argument
inverts — it becomes a site that states unverified regulatory guidance with an
authoritative voice, which is precisely the failure the status system exists to
prevent.

---

## D‑4 · Personal data stance

**Status:** RECOMMENDED — AWAITING SIGN-OFF
**Recommendation:** Session-scoped context only. Unauthenticated. No durable
identifiers. Transcripts retained ≤30 days for knowledge-gap analysis with
free-text redaction. Analytics aggregated only. Stated in a visible notice.

**Why.** V2 contradicted itself: its acceptance test required remembering "I live
in India" while its analytics section forbade storing sensitive personal
information. Residency *is* personal data. This resolves it in the direction that
keeps the acceptance test working — the context frame holds residency for the
life of the session and is not persisted against an identity.

**Consequence.** No login, no saved projects, no returning-visitor
personalisation in V1. The `ConversationContext` frame (Architecture §7.2) is
schema-versioned so it can be migrated if a saved-project feature is added later.
Knowledge-gap records store the normalized question and detected context, never
the raw transcript.

**If the answer is "authenticated with saved projects":** add auth, a user
entity, consent capture and a retention policy to phase 2; the context frame
becomes a persisted document rather than a session object.

---

## Decisions already settled — do not relitigate

From [reos-strategic-assessment.html](reos-strategic-assessment.html):

| Decision | Consequence for this build |
|---|---|
| **Development-first audience.** The buyer is a lens into the development graph, not a parallel consumer funnel | The assistant's persona set maps onto `routes.ts`; `phase1.ts` is not indexed |
| **Do not claim "Single Source of Truth."** Positioning is *"the connected map of UAE property development"* | The assistant never asserts authority it does not hold; binding actions return to the authority |
| **Density-first design register**, light theme first | The assistant UI is an instrument, not a dark luxury chat panel |
| **One canonical lifecycle** — 12 stages, test-guarded | The `Activity` tier hangs beneath the existing spine; no fifth stage list |
| **Authorities are a rail** | Approvals are the entity; authorities are reached through them |

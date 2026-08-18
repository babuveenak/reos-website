# Session handoff — REOS, after Phase 1A

**Read this before touching anything.** It supersedes
[SESSION-HANDOFF.html](SESSION-HANDOFF.html) as the current-state document;
that file is the earlier, pre-assistant handoff and its "Gotchas" section is
still worth skimming, but everything load-bearing from it is repeated below.

---

## 1 · Where the work actually is

This bit caused real confusion last session, so it goes first.

| | State |
|---|---|
| **`main`** | `4b4747f` — **has all the assistant work.** Working tree clean, in sync with `origin/main` |
| **PR** | [#2](https://github.com/babuveenak/reos-website/pull/2) — **MERGED** 2026‑08‑18, rebased, so history stays linear and all three commits survive |
| **Production** (`reos-website.vercel.app`) | Serving `main` at `4b4747f`, deploy SUCCESS — **the assistant is live**, verified against the real site, not just the build |
| **`phase-1a-assistant`** | Merged. Still present locally and on the remote; safe to delete whenever |
| **Preview** | Branch previews sit behind Vercel Deployment Protection — they need a signed-in browser and cannot be checked with `curl`/`fetch` |
| **Local** | `npm run dev` → everything works, no login |

**Production is current as of `4b4747f`.** This was the opposite for the whole of
last session, and the reversal is the one fact in this document most likely to be
misremembered. If someone says "I can't see it on the website", check *which
commit the live deploy is on* before debugging code — the failure mode is a stale
deploy, not a stale branch.

---

## 2 · Decisions

Recorded in [DECISIONS.md](DECISIONS.md). Two are settled by the project
owner and must not be relitigated.

| # | Decision | Status |
|---|---|---|
| **D‑1** | **Hosting is Vercel.** Do **not** migrate to Cloudflare | **DECIDED** (owner, 2026‑08‑18) |
| **D‑5** | **AI provider, SDK, embeddings and speech are all OPEN**, and explicitly *decoupled* from D‑1 — running on Vercel implies nothing about using Vercel's AI SDK or gateway | **OPEN by instruction** |
| D‑2 | Assistant is a navigator/explainer for V1, advisor only per-topic as claims reach `Validated` | Recommended, awaiting sign-off |
| D‑3 | Ground only on `Validated`; `To Be Validated` as labelled orientation | Recommended, awaiting sign-off |
| D‑4 | Session-scoped context only, no durable identifiers, ≤30-day transcripts | Recommended, awaiting sign-off |

**The repo still contains a Cloudflare Workers scaffold** (`vinext`, `wrangler`,
`worker/index.ts`, `drizzle.config.ts` at `dialect: "sqlite"`, `.openai/hosting.json`).
That is template leftover, **not** the deployment path — but it *is* what the test
harness builds against (see §5). Don't read it as evidence of the platform; that
mistake was made once already.

Two hard constraints that will decide D‑5 when it is taken:

- **Embeddings must be multilingual.** Arabic query → English source is a stated
  requirement; a monolingual English model cannot satisfy it.
- **STT/TTS must cover Gulf/Khaliji Arabic**, not MSA only, plus barge-in and
  code-switching. Test dialect samples *before* committing to a vendor.

---

## 3 · Rules that must not be broken

The first three are enforced by tests. Breaking any of these is a regression, not
a design choice.

1. **One canonical lifecycle.** *(test-guarded)* `app/data/journey.ts` holds the
   twelve stages. The hero ribbon, persona flows, the 24 detail stages in
   `reos.ts` and the assistant are all projections of it. The site once shipped
   four competing stage lists. **Do not add a fifth.**
2. **Order is not sequence.** *(test-guarded)* Stages carry `runsWith`. Marketing
   and sales run *during* construction; escrow exists because buyers pay while
   the building goes up. The assistant must surface concurrency, never imply a
   queue.
3. **The demo CTA lives only on `/platform`.** *(test-guarded)* The assistant's
   product action is `learn-more` → `/platform` only; it never emits `/demo`.
4. **Authorities are a rail, not a cluster.** Group 03 is compulsory and
   external; everything else is appointed and commercial.
5. **Honest status labels stay visible.** `Validated` / `To Be Validated` /
   `Illustrative` / `Future REOS Capability`. Every mock answer is labelled
   `Illustrative`. **Never fabricate a source or a verification date** — the UI
   renders "not yet verified" and a test asserts no source block contains a date
   it cannot justify.
6. **Jurisdiction discipline.** Dubai guidance is never presented as UAE
   guidance. Emirate *and zone* — free zones (DIFC, DDA, Trakhees, DMCC) are
   separate approval regimes.
7. **Arabic is an id-keyed overlay with English fallback** (`app/i18n/content/*.ar.ts`).
   IDs, relationships and ordering live only in the English source.
8. **Every visitor-facing route needs its `app/ar/` twin.** Pages export
   `View({locale})` plus an English default; the Arabic file renders that `View`
   with `locale="ar"`. `/admin` is deliberately exempt (internal, English-only,
   `noindex`, absent from the sitemap).
9. **The REOS wordmark must not mirror.** It is the one element on the site with
   `direction: ltr; unicode-bidi: isolate` — without it the RTL flex row renders
   the brand as "SOER".

---

## 4 · Where things live

```
app/data/               content, typed, no CMS
  journey.ts            THE canonical 12 stages — the spine
  routes.ts             the 12 self-selection routes + orientation
  personas.ts           written journeys, keyed by slug (8 entries)
  ecosystem.ts          12 groups, 4 clusters + rail, modules, outcomes
  reos.ts               24 detail stages, 8 lenses, 11 authorities + source URLs
  glossary.ts           16 terms
  phase1.ts             LEGACY consumer journeys — retirement candidate, not indexed

app/assistant/          NEW — the AI layer, provider-independent
  contracts.ts          all service + domain types. NO runtime, no provider
  snapshot.ts           buildSnapshot(locale) — the ONLY module importing content files
  suggestions.ts        content-derived suggested questions (pure, snapshot-based)
  mock-ai.ts            MockAIService + worked examples, EN + AR
  mock-voice.ts         MockVoiceProvider (state machine, partials, barge-in)
  page.tsx              /assistant

app/components/
  Assistant.tsx         the assistant (client). variants: compact | full | dock
  AssistantDock.tsx     the floating REOS dock (FAB + panel)
  Knowledge.tsx         presentational: answers, sources, journey trail, activities
  AdminBrowser.tsx      admin filter/search/table (client)
  SiteShell.tsx         Header, Footer, Page, StatusTag — Page mounts the dock

app/admin/              internal skeletons: /admin, /admin/gaps
app/i18n/               config, dictionary (has an `assistant` block), content overlays
app/globals.css         one stylesheet, ~1700 lines
tests/                  rendered-html · assistant · assistant-interaction
docs/                   NOW TRACKED — decisions, architecture, phase notes
```

**Where the assistant appears:** the dock on every visitor-facing page (mounted
in `Page`, opt out with `dock={false}`), a band on the homepage (`#ask`), inline
on every journey stage page (seeded with that stage), and `/assistant` +
`/ar/assistant`. Not on `/admin/*` or `/assistant` itself.

**Swapping the mock for a real service is two lines** in `Assistant.tsx`:

```ts
const ai = useMemo(() => new MockAIService(snapshot), [snapshot]);
const voice = useMemo(() => new MockVoiceProvider(), []);
```

---

## 5 · Verifying work

```bash
npx tsc --noEmit && npm run lint
npm run build            # 173 prerendered pages
npm run build:sites      # worker output — the HTML tests read from dist/
node --test "tests/assistant.test.mjs" "tests/rendered-html.test.mjs"   # 41 pass

npm run dev                                        # separate terminal, then:
node --test tests/assistant-interaction.test.mjs   # 19 pass
```

**60 tests, 0 fail.** Four traps in that block, each of which has already cost
time:

- **`node --test tests/` (directory form) fails** on this Node — it treats the
  directory as a test file. Pass explicit paths or a quoted glob.
- **The HTML tests read `dist/server/index.js`**, so `npm run build:sites` must
  run first or you assert against a stale build. This produced a false pass once.
- **That build is the Cloudflare Workers output**, which is *not* what Vercel
  serves. The assertions are still the invariant guard, but this inconsistency is
  open and should be closed deliberately (see [DECISIONS.md](DECISIONS.md) D‑1).
- **The interaction suite needs a dev server** and Chrome via `playwright-core`.
  It skips loudly on stderr without one — but a CI job that forgot to start one
  would still go green on the HTML suite alone. Wire both into one command before
  trusting either as a gate.

**Screenshots via the in-app browser pane are unreliable on this site** — it
reports a 0-width viewport. Use Playwright with `channel: "chrome"`;
`playwright-core` is already a dev dependency and needs no browser download.

---

## 6 · Gotchas that cost time this session

Beyond the ones in the old HTML handoff (descendant selectors, `minmax(0,1fr)`,
transparent section backgrounds, physical CSS properties, env vars in static
export). Every one below was a real defect, found and fixed.

| Trap | What happened | Rule |
|---|---|---|
| **Stale closure in a mount-time subscription** | The voice listener subscribed once and closed over a `send` that depended on `state`, so it held the *initial* snapshot and every voice turn **replaced the whole transcript** | Callbacks reached from a long-lived subscription must have stable deps. Append with functional `setState`; read request state from a ref |
| **Logical border, physical radius** | The accent border moved to the inline-end side in Arabic but `border-radius: 0 4px 4px 0` left the flat corner on the left | If one side of a box is logical, all of it must be. Use `border-start-end-radius` etc. |
| **A Latin wordmark inside RTL** | The flex row reversed R·E·O·S into **"SOER"** | Brand marks get `direction: ltr; unicode-bidi: isolate`. Everything else mirrors |
| **`background: inherit` on a sticky element** | Resolves to the parent's *computed* background — transparent — so answer text scrolled visibly through the Send button | Sticky bars need an explicit opaque background per theme |
| **A class name used for two things** | `variant="dock"` renders `assistant assistant-dock`, which collided with the dock wrapper's own `.assistant-dock`, so `position: fixed` landed on the panel's contents | Wrapper classes and variant classes must not share a namespace |
| **`\binvest\b` never matches "investing"** | The trailing word boundary killed a keyword rule for the exact word the route's own title uses. Arabic had the same shape: the list had شراء, the title uses أشتري | Don't enumerate word forms across languages. Match the content's own strings — routes and stages are now resolved by their title |
| **Suggestions the assistant couldn't answer** | Two entire generated shapes ("what happens during X", "what runs at the same time as X") fell through to *not-in-corpus*. The test only asserted suggestions *appeared* | Walk the real list and assert none of them declines. That test now runs in both locales |
| **`/docs/` was gitignored** | The decision record, architecture package and phase notes were invisible to git for most of the session | Now tracked. Keep it that way |
| **Counting entries vs resolved routes** | `personas.ts` has 8 entries, so "8 of 12 routes published" got written into three documents. The truth is **7 published, 5 pending** — the 8th entry serves the orientation helper | Derive counts, don't eyeball them |
| **`curl` unavailable in some shell contexts** | Silently "command not found" mid-loop | Use `node --input-type=module` with `fetch` for HTTP checks |

---

## 7 · State of the content

**This is the binding constraint on the project — editorial, not engineering.**

- **7 of 12 routes have written journeys**: `buying`, `developing`, `investing`,
  `financing`, `design-engineering`, `building`, `managing`.
- **5 are pending**: `selling`, `legal-compliance`, `utilities`, `regulators`,
  `specialist-services`. They render a "being published" state deliberately —
  hiding them would misrepresent the ecosystem. To publish one, add a persona
  entry in `personas.ts` keyed by the route slug.
- Suggestions only offer routes with content, so publishing one automatically
  widens what the assistant proposes.
- Much of the corpus is `To Be Validated`. Under D‑3 a correctly-built assistant
  will decline a large share of questions. That is the product working.

---

## 8 · What to do next

The decision tree, in order:

1. ~~**Merge PR #2**~~ — **DONE** (2026‑08‑18). Production serves the assistant
   work. Start at 2.
2. **Settle D‑2, D‑3, D‑4** — they are one conversation, not three, and
   everything downstream inherits them.
3. **Phase 1 — schema** (the highest-leverage week, per
   [AI-PLATFORM-ARCHITECTURE.md](AI-PLATFORM-ARCHITECTURE.md) §10):
   introduce `Activity`, `Approval`, `Role`, `Actor`, `Condition`, `Claim`,
   `Jurisdiction`; split actor from role; migrate `reos.ts` onto it. No visual
   work. The UI components already accept these types and render nothing without
   data, so this lights them up rather than requiring new components.
4. **Phase 2 — runtime**: Neon + Blob, `drizzle.config.ts` → `postgresql`,
   enable `pgvector`, first route handlers, admin auth + RBAC.
5. **Phase 3 — one complete vertical slice**, fully sourced. 4–8 weeks and
   editorial-bound; this is the schedule risk, not the code.

D‑5 is not needed before phase 5.

---

## 9 · Open items

| Item | Note |
|---|---|
| Merged branch `phase-1a-assistant` still on the remote | Harmless. Delete it when you like — GitHub can restore it |
| Test harness builds for Workers, deploy is Vercel | Inconsistent on purpose rather than by accident; close it deliberately |
| Interaction tests can silently not run in CI | Two suites, two commands. Unify before gating on them |
| Dock not seeded with the current stage | Only the inline stage assistant is. Would mean threading the stage through `Page`, which is shared furniture on 173 pages |
| Attachments do nothing | The paperclip explains itself rather than faking an upload. Needs the document repository (phase 2, then 7) |
| `speak()` never called | The provider implements it and `responding` is wired, but nothing reads answers aloud — needs the real TTS decision |
| Phase names hardcoded in English | Fixed for the assistant via `dictionary.assistant.phaseName`. `Ecosystem.tsx`, `Experience.tsx`, `PhaseFlow.tsx` still hardcode them |
| No persistence | Reload clears the conversation. That is D‑4, not an oversight |
| `phase1.ts` still present | Legacy consumer journeys, still served at `/journeys/*`. Retirement candidate |

---

## 10 · If you only read one thing

The site's credibility *is* the product. Every mechanism that looks like
scaffolding — the four-value `ContentStatus`, the "not yet verified" instead of a
date, the `Illustrative` label on mock answers, the `regulated-advice` refusal,
the deliberately visible "being published" routes — is load-bearing. It is what
separates this from a confident-sounding content site, and it is the thing most
likely to get quietly removed to make the product look more finished.

Do not remove it to look finished.

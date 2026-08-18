# Phase 1A — Implementation Record

Provider-independent AI Assistant experience, knowledge-exploration UX and
service contracts. No LLM, no STT/TTS, no database, no vector store, no document
storage, no public API, no MCP. Nothing irreversible.

**Verification at completion**

```bash
npx tsc --noEmit                    # clean
npm run lint                        # clean
npm run build                       # compiles; 173 static pages (was 169)
npm run build:sites                 # worker output — the HTML tests read from dist/
node --test "tests/assistant.test.mjs" "tests/rendered-html.test.mjs"   # 41 pass

npm run dev                                        # in another terminal, then:
node --test tests/assistant-interaction.test.mjs   # 19 pass
```

**60 tests pass, 0 fail.** Note the explicit file list: `node --test tests/`
(directory form) fails on this Node version — it treats the directory as a test
file. The interaction suite needs a dev server and skips loudly without one.

---

## 1 · What was implemented

| Requirement | Where | State |
|---|---|---|
| Reusable assistant component, text + voice | [Assistant.tsx](app/components/Assistant.tsx) | Done — `compact` and `full` variants |
| Homepage "Ask about the property journey" band | [page.tsx](app/page.tsx) section 02, `#ask` | Done |
| **Floating REOS dock** — animated R·E·O·S wordmark, bottom inline-end, text + voice | [AssistantDock.tsx](app/components/AssistantDock.tsx), mounted in `Page` | Done |
| Conversational UI with sources, journey context, follow-ups | [Knowledge.tsx](app/components/Knowledge.tsx) | Done |
| Voice UX behind an abstraction, 5 states | [mock-voice.ts](app/assistant/mock-voice.ts) | Done — mock provider |
| English + Arabic + RTL | dictionary `assistant` block, `/ar/assistant` | Done |
| Conversation state model | `ConversationState` in [contracts.ts](app/assistant/contracts.ts) | Done — frontend only |
| Inferred persona with correction | `.assistant-persona` + `[Change]` | Done |
| Journey / lifecycle UI components | `JourneyTrail`, `ActivityList`, `ApprovalList`, `ConditionList` | Done |
| Source / citation components | `SourceList` | Done |
| Document repository admin UI | [/admin](app/admin/page.tsx) + [AdminBrowser.tsx](app/components/AdminBrowser.tsx) | Skeleton |
| Knowledge gap dashboard | [/admin/gaps](app/admin/gaps/page.tsx) | Skeleton |
| Service interfaces | [contracts.ts](app/assistant/contracts.ts) | Done |
| Structured AI response contract | `AIResponse` | Done |
| MockAIService, 4 personas, EN + AR | [mock-ai.ts](app/assistant/mock-ai.ts) | Done |
| Product discovery, conditional only | `ProductActions` | Done — see §6 |
| Tests | [assistant.test.mjs](tests/assistant.test.mjs), [assistant-interaction.test.mjs](tests/assistant-interaction.test.mjs) | 34 added |
| Responsive + accessibility | globals.css block, ARIA wiring | Done, verified |

### Three design decisions worth knowing

**1. The assistant renders a server-side worked-example transcript.**
`/assistant` renders four illustrative exchanges — one per persona — on the
server, from the same mock the client uses, before hydrating the live component.
This does three things: the page is useful without JavaScript, it shows a visitor
what the assistant does before they type, and it makes the mock's *output*
testable in the existing rendered-HTML harness. A client-only assistant would
have been untestable until a browser-driving rig exists.

**2. Knowledge crosses the client boundary as a snapshot, not as imports.**
[snapshot.ts](app/assistant/snapshot.ts) is the only assistant module that imports the content
files. A server component calls `buildSnapshot(locale)` and passes a few
kilobytes of ids and names to the client. Importing the data directly would have
shipped `journey.ts`, `personas.ts`, `ecosystem.ts`, `glossary.ts` and their
Arabic overlays — well over 100 KB of prose — into the browser bundle. It also
matches how the component will work in Phase 1B, when a real service answers:
only the producer of the data changes, not the component contract.

**3. The mock is held to the product's rules, not just to "looks plausible".**
It cites only real authorities with their real published URLs; it renders
"not yet verified" rather than inventing a date; it states concurrency wherever a
stage has `runsWith`; every answer carries the `Illustrative` label; and it
implements two refusal paths (`regulated-advice`, `jurisdiction-unresolved`)
rather than always answering. Building the UI against a mock that cuts those
corners would mean retro-fitting them later, which is how they get dropped.

---

## 2 · Files

### New

```
app/assistant/contracts.ts        service + domain types (no runtime)
app/assistant/snapshot.ts         KnowledgeSnapshot + buildSnapshot()
app/assistant/suggestions.ts      content-derived suggested questions
app/assistant/mock-ai.ts          MockAIService, worked examples, EN + AR
app/assistant/mock-voice.ts       MockVoiceProvider
app/assistant/page.tsx            /assistant
app/ar/assistant/page.tsx         /ar/assistant (Arabic twin)
app/admin/page.tsx                /admin — repository skeleton
app/admin/gaps/page.tsx           /admin/gaps — gap dashboard skeleton
app/components/Assistant.tsx      the assistant (client)
app/components/Knowledge.tsx      presentational: answers, sources, journey, activities
app/components/AdminBrowser.tsx   admin filter/search/table (client)
tests/assistant.test.mjs          23 rendered-HTML tests
tests/assistant-interaction.test.mjs  11 live-interaction tests (QA regressions)
docs/PHASE-1A-IMPLEMENTATION.md   this file
```

### Modified

| File | Change |
|---|---|
| [app/page.tsx](app/page.tsx) | Added the `#ask` assistant band as section 02; renumbered the following section comments 02→03 … 09→10. No existing section changed. |
| [app/i18n/dictionary.ts](app/i18n/dictionary.ts) | Added an `assistant` block to `en` and `ar` (~55 keys each), including `phaseName`, `onStageTitle`, `composerHeading` |
| [app/journey/[stage]/page.tsx](app/journey/[stage]/page.tsx) | Added the stage-seeded assistant section before the adjacent-stage nav. Nothing existing changed |
| [app/globals.css](app/globals.css) | Appended one commented block: assistant, answers, sources, chips, composer, voice states, worked examples, admin, responsive, reduced-motion, `.visually-hidden` |
| [app/sitemap.ts](app/sitemap.ts) | Added `/assistant` (both locales come free from the locale map). `/admin` deliberately absent |
| [app/robots.ts](app/robots.ts) | `Disallow: /admin`, and the sitemap URL now derives from `SITE_URL` — see §7 |
| [docs/DECISIONS.md](docs/DECISIONS.md) | D‑1 recorded as **Vercel**; added D‑5 (AI provider, open) |
| [docs/AI-PLATFORM-ARCHITECTURE.md](docs/AI-PLATFORM-ARCHITECTURE.md) | Storage/vector/object-store sections revised for Postgres + `pgvector` + Blob |

Nothing was deleted, and no existing component was rewritten.

---

## 3 · Interfaces (all provider-independent)

In [contracts.ts](app/assistant/contracts.ts):

```
AIService            ask(AIRequest): Promise<AIResponse>
KnowledgeService     search(query, locale)
JourneyService       stages(locale), context(stageId, locale)
StakeholderService   groups(locale), routes(locale)
SourceService        forEntity(entityType, entityId)
DocumentService      list(DocumentFilter)
VoiceProvider        startListening / stopListening / cancelListening /
                     getTranscript / speak / stopSpeaking / subscribe / supports
```

Supporting types: `ConversationState`, `ConversationMessage`, `AIRequest`,
`AIResponse`, `Source`, `Condition`, `ActivityView`, `ApprovalView`,
`JourneyContext`, `SuggestedQuestion`, `NavigationAction`, `ProductAction`,
`KnowledgeGap`, `DocumentRecord`, `Intent`, `RefusalType`, `VoiceState`,
`VoiceEvent`, `Jurisdiction`, `EpistemicType`.

`AIResponse` carries the fields the brief asked for plus four the architecture
requires: `refusal` (typed), `conditions` (what the answer is narrowed to),
`status` (the honest content label) and `statePatch` (what to merge into
conversation state).

**Swapping in real implementations** is two lines in
[Assistant.tsx](app/components/Assistant.tsx):

```ts
const ai = useMemo(() => new MockAIService(snapshot), [snapshot]);
const voice = useMemo(() => new MockVoiceProvider(), []);
```

---

## 4 · Mock services

**`MockAIService`** — keyword matching, not a model. Deterministic, synchronous
core (`mockAnswer`) with a 420 ms delay on the async wrapper so the `processing`
state is exercised. Covers: buyer, developer, investor, banker (financing),
blocked-diagnosis, after-construction, stakeholders, product enquiry, regulated
advice, jurisdiction-unresolved, and a not-in-corpus fallback. English and Arabic
bodies for every path.

**`MockVoiceProvider`** — full state machine (`idle → listening → processing →
responding → error`), progressive partial transcripts at 180 ms intervals,
`final` handoff, barge-in via `stopSpeaking`, cancel that discards. Deliberately
**not** wired to the browser's `SpeechRecognition`: that API is free and is the
obvious first real adapter, but adopting it would quietly make a provider
decision, and its Arabic support is MSA-leaning where the architecture names
Gulf/Khaliji coverage as a selection gate.

---

## 5 · Tests

23 new, in [tests/assistant.test.mjs](tests/assistant.test.mjs), same worker-fetch harness as the
existing suite. Grouped by what they protect:

| Group | Tests |
|---|---|
| Presence and routing | homepage band with `#ask` anchor, `/assistant` + `/ar/assistant` both 200, honest preview framing |
| Accessibility | `role="log"`, `aria-live="polite"`, `role="status"`, `aria-pressed`, labelled textarea, observable `data-voice-state` |
| Mock output | four distinct persona answers, phase/stage located from `journey.ts`, real next-step links |
| **Concurrency** | `runsWith` surfaced as "Runs at the same time as", naming Construction & Delivery |
| **Citations** | real authority names and URLs; and an assertion that **no source block contains an ISO date** |
| **Product discipline** | no `href="/demo"` and no `.ai-product` in worked examples, or on any existing page |
| Arabic | RTL, >800 Arabic characters, Arabic composer/voice/sources labels, Arabic concurrency line, same structure as English, review notice |
| Suggestions | derived from route titles; unpublished routes (`selling`) never suggested |
| Admin | both skeletons render, all five documented filters present, gap dashboard invents no occurrence count |
| Discovery | `/assistant` in the sitemap, `/admin` not; robots disallows `/admin` and its sitemap host matches the URLs inside the sitemap |

All 10 pre-existing tests still pass, including the three guarded invariants.

### Verified in the browser, not asserted in tests

Driven with Playwright (`playwright-core` is already a dev dependency; the
in-app browser pane reports a 0-width viewport on this site, which the session
handoff already documents):

- Live conversation: suggestion click → visitor turn → answer with persona chip,
  journey trail, concurrency line, real citation, follow-ups, nav actions.
- Voice: `idle → listening` with partials accumulating ("I" → "I want to" → …) →
  `final` → `processing`, `aria-pressed` flipping, cancel button appearing.
- No horizontal page overflow at 1280 / 768 / 390 in either locale.
- Mobile: controls stack, mic renders above Send at full width, 51 px touch target.
- RTL: logical properties mirror correctly — the answer accent border and notice
  border move to the inline-end side; `text-align: start` throughout.
- Dark and light themes both resolve from the token set.

---

## 5a · QA pass — defects found and fixed

A QA/QC pass after the initial implementation found **eight real defects**, six
of them in client behaviour the rendered-HTML harness cannot reach. Each now has
a regression test in [tests/assistant-interaction.test.mjs](tests/assistant-interaction.test.mjs).

| # | Severity | Defect | Cause | Fix |
|---|---|---|---|---|
| 1 | **High** | A voice turn **replaced the whole conversation** instead of appending to it | The voice listener subscribed once on mount and closed over `send`, which depended on `state` — so it held the *initial* snapshot and `setState` clobbered the transcript | `send` now appends via a functional update and reads request state from a mirror ref, making its deps stable |
| 2 | **High** | The voice indicator stuck on "Thinking…" for the rest of the session after any voice turn | Responsibility in the wrong place: the *recogniser* reported `processing`, a state it had no way to exit | Recognition ends at `final` and returns to `idle`; the component derives `processing` from its own pending flag |
| 3 | Medium | Keystrokes typed while listening were **silently discarded** | The textarea displayed the partial transcript while `onChange` wrote to a different piece of state | The field is `readOnly` while listening, so the input is visibly unavailable rather than lossy |
| 4 | Medium | In Arabic the answer card's **square corner sat opposite its accent border** | The accent border was logical (`border-inline-start`) but the radius was physical (`border-radius: 0 4px 4px 0`) | Logical radii (`border-start-end-radius`, `border-end-end-radius`) |
| 5 | Medium | Heading-level skip (h1 → h3) on `/assistant`, and h2 → h4 inside every answer | Answer section labels were `h4`; `/assistant` had no `h2` because the hero `h1` doubles as the section heading | Answer labels are `h3`; `/assistant` gets a visually-hidden `h2`. All eight checked pages now have exactly one `h1` and no skips |
| 6 | Medium | The mock **ignored `request.state` entirely**, so the brief's "the visitor should not have to repeat information" was not demonstrated | Never implemented | Persona and stage are inherited from conversation state. **Context is inherited; the answer never is** — an unrecognised follow-up still declines honestly, it just keeps its place in the journey |
| 7 | Medium | The assistant was **missing from journey stage pages**, which the brief asked for — and `initialStageId` was defined but passed by no caller | Never wired | Added to `/journey/[stage]` (and its Arabic twin), seeded with that stage |
| 8 | Low | Clicking the mic mid-answer started a second recognition; live region registered while `display:none`; dead `mockVoice` export; `aria-describedby` pointed the input's description at the microphone | — | In-flight lock; removed the `:empty` rule; removed the export; removed the mis-targeted `describedby` |

### Second QA pass — found while verifying the dock

| # | Severity | Defect | Fix |
|---|---|---|---|
| 9 | **High** | **The assistant could not answer its own suggested questions.** Two whole generated shapes — "What happens during X?" and "What runs at the same time as X?" — fell through to "I don't have enough verified information", violating the rule `suggestions.ts` is built on | Stage questions now resolve the named stage and answer from the stage's own validated summary and `runsWith` data. Concurrency gets a dedicated answer, since that is the site's signature teaching |
| 10 | **High** | In Arabic the dock wordmark rendered **"SOER"** — the RTL flex row reversed the letters | `direction: ltr; unicode-bidi: isolate`. The one element on this site that must not mirror |
| 11 | Medium | `\binvest\b` never matched "invest**ing**" — the word the investing route's own title uses — so that suggestion fell back in English. The Arabic equivalent used أشتري where the keyword list had شراء | Routes are now resolved by matching **their own title or CTA label**, which is locale-agnostic and needs no verb-form enumeration. Keyword rules remain as the first pass |
| 12 | Medium | The dock's sticky composer was **transparent** (`background: inherit` resolves to the parent's computed background), so answer text scrolled visibly through the Send and voice controls | Explicit opaque background per theme, a hairline, and a short fade — the exact trap the repo's handoff already documents |
| 13 | Medium | `.assistant-dock` named **two different elements** — the dock wrapper and the inner `assistant assistant-dock` — so the wrapper's `position: fixed`, `z-index` and flex rules also applied to the panel's contents | Wrapper renamed `.reos-dock` |
| 14 | Low | No auto-scroll in the dock, so a new answer landed below the panel's fold | Scoped auto-scroll (`block: "nearest"`) for the dock variant only — on inline variants the page is the scroll container and yanking it would be worse |

The suggestion-answerability failure is the one worth dwelling on: the original
test asserted only that suggestions *appear*. Walking the real list and asserting
none of them declines is what caught it, and that test now runs in both locales.

**One documentation error, also fixed:** I had recorded **8 of 12 routes
published, 4 pending**. The true figure is **7 published, 5 pending** — I counted
entries in `personas.ts` (8) rather than routes that resolve to one, and the 8th
entry serves the orientation helper, which is not one of the twelve. Corrected in
[DECISIONS.md](docs/DECISIONS.md), [AI-PLATFORM-ARCHITECTURE.md](docs/AI-PLATFORM-ARCHITECTURE.md),
[V3-MASTER-PROMPT.md](docs/V3-MASTER-PROMPT.md) and two code comments. The test
that caught it now asserts the *rule* (a published route is offered, a pending one
is not) rather than a count that would only record when it was last correct.

---

## 5b · The REOS dock

Added after Phase 1A on request: a floating button in the bottom inline-end
corner of **every visitor-facing page**, whose mark lights the letters
**R · E · O · S** in slow sequence (7.2 s cycle, 0.62 s stagger), opening a panel
that carries the same assistant — text and voice both.

| Decision | Why |
|---|---|
| `inset-inline-end`, not `right` | It mirrors to bottom-**left** in Arabic, like everything else on the site. A physically-anchored dock would collide with RTL content |
| **The wordmark does not mirror** | `direction: ltr; unicode-bidi: isolate` on the mark. Without it the RTL flex row rendered the brand as **"SOER"** — caught in QA, now regression-tested |
| Animation in CSS, not JS | Runs before hydration, and `prefers-reduced-motion` shows the wordmark whole and still |
| Non-modal panel | The page stays readable with it open, since the assistant's job is to explain what you are looking at. Escape closes and returns focus to the button; an outside click does **not**, because that would discard a conversation mid-way |
| Panel stays mounted while closed | An in-progress conversation survives dismissal. `hidden` keeps it out of AT and tab order meanwhile |
| Absent on `/assistant` and `/admin/*` | That page *is* the assistant; admin is an internal tool. `Page` takes `dock={false}` |
| z-index 110 | Above the header (90) and the grain overlay (100) |

Not done: the dock is **not** seeded with the current stage on journey pages —
only the inline stage assistant is. Seeding it would mean threading the stage
through `Page`, which is shared furniture on 173 pages. Worth doing if the dock
becomes the primary surface.

---

## 5c · The composer, rebuilt as a messaging bar

Replaced the stacked textarea + two labelled buttons with a single rounded pill,
on the ChatGPT/WhatsApp pattern: **paperclip · field · mic · send**, all inside
one bordered bar. The "Ask next" ready prompts are unchanged.

| Behaviour | Detail |
|---|---|
| Field grows with content | One row at rest, grows to a ~168px cap, then scrolls. Same as every messaging composer |
| Focus ring on the bar | `:focus-within`, so the indicator surrounds the whole control rather than drawing a second box inside it |
| Send activates on content | Inactive (outlined) when empty or whitespace; filled gold once there is something to commit |
| Mic becomes stop | While listening the microphone swaps for a stop square, tinted cyan, `aria-pressed="true"` — the control that started recording also ends it |
| Send works during dictation | The arrow activates on the live transcript; pressing it stops recognition, which emits `final` and sends. Previously it sat inert while text was visibly in the field |
| Enter / Shift+Enter | Sends / newline |
| Voice state | Only shown when there is something to say, but kept in the DOM so the live region is registered before it needs to announce |
| Icons are inline SVG | Matching `PreferencesControls` and `Logo`; no emoji-font dependency, and they inherit `currentColor` from the theme tokens |
| RTL | Logical properties throughout — paperclip inline-start, mic and send inline-end, mirrored in Arabic |
| Mobile | The bar stays one row (a stacked messaging composer is not a composer); touch targets grow to 42px instead |

**The paperclip is honest about itself.** There is no document storage yet, so
clicking it reveals a one-line note saying attachments arrive with the document
repository. It is not a file picker that silently discards what you choose.

Two content defects fixed while verifying it: the stage answer appended
`nextStep` to its body while the journey trail rendered the same sentence again
underneath, and the summaries in `journey.ts` are written to follow the stage
name, so used alone they opened as a fragment. Both were visible only on screen,
which is why the screenshot pass matters as much as the test pass.

---

## 6 · Known limitations

1. **Interaction tests need a running dev server** and Chrome via
   `playwright-core`. They skip loudly (a message on stderr) rather than passing
   quietly when no server is reachable — but a CI job that forgets to start one
   would still go green on the HTML suite alone. Wire both suites into one command
   before relying on them as a gate.
2. **The mock never emits `book-demo`.** The contract and `ProductActions`
   support it; the mock emits `learn-more` → `/platform` only. A server-rendered
   `/demo` link would break the guarded demo-CTA test, and when a demo link is
   appropriate is a product decision, not a mock's.
3. **`/admin` is English-only** and excluded from the sitemap and robots. The
   "every route needs an `/ar` twin" rule exists so visitor-facing content cannot
   silently lose Arabic; an internal skeleton whose shape changes in phase 7 is
   not that. Revisit when the admin is real.
4. **Admin is read-only and unauthenticated.** No upload, no write path, no RBAC
   — all of which need phase 2. It shows the real content model rather than
   pretending to accept a document.
5. **`dictionary.ts` now ships in the client bundle** (~20 KB) because the
   assistant is bilingual on the client. The content files do not, which was the
   larger cost. If it matters later, pass the `assistant` slice as a prop.
6. **Phase names were untranslated site-wide.** Fixed for the assistant via
   `dictionary.assistant.phaseName`. [Ecosystem.tsx](app/components/Ecosystem.tsx),
   [Experience.tsx](app/components/Experience.tsx) and [PhaseFlow.tsx](app/components/PhaseFlow.tsx)
   still hardcode English phase names — a pre-existing gap those components
   should adopt this map to close. Not changed here: they are working components
   and outside Phase 1A's scope.
7. **The test harness asserts against the Workers build.** `tests/*.test.mjs`
   read `dist/server/index.js` from `npm run build:sites`, which is not the
   artifact Vercel serves. The assertions remain valuable — they are the
   invariant guard — but this inconsistency should be closed deliberately, not
   by accident. Flagged in [DECISIONS.md](docs/DECISIONS.md) D‑1.
8. **Voice `speak()` is never called by the UI.** The provider implements it and
   the `responding` state is wired, but nothing reads answers aloud yet: doing so
   well needs the real TTS decision (pronunciation lexicon for DLD/RERA/NOC
   inside Arabic speech, spoken-answer length limits).
8a. **The jurisdiction-clarification refusal only triggers on the developing
   path.** Asking about buying "in Dubai" gets an answer rather than a
   zone question, because the buyer body is written to be zone-agnostic. Correct
   for the mock; the real assistant must ask whenever the retrieved claims branch
   on zone, per Architecture §7.3.
9. **No persistence.** Reloading clears the conversation. That is the D‑4 stance,
   not an oversight.

---

## 7 · Two changes beyond the strict brief

Both small, both flagged rather than slipped in:

1. **[app/robots.ts](app/robots.ts) sitemap URL now derives from `SITE_URL`.** It
   hardcoded `https://reos-property.sites.openai.com/sitemap.xml` while
   [app/sitemap.ts](app/sitemap.ts) emits `SITE_URL` URLs — so crawlers were pointed at a
   sitemap on one host listing URLs on another. With D‑1 settled on Vercel that
   is unambiguously wrong, and I was editing the file anyway to add the `/admin`
   disallow. A test now asserts the two agree. Revert freely if the openai.com
   host is still live for a reason I cannot see.
2. **Section comments in [app/page.tsx](app/page.tsx) renumbered** 02→03 … 09→10 to
   make room for the assistant band. Comments only; no rendered output changed.

---

## 8 · Blocked pending architecture decisions

| Blocked | Needs | Decision |
|---|---|---|
| Real answers | Generation model + SDK/transport | **D‑5, open.** Architecture §7.7 uses `claude-opus-5` as the worked example; not a commitment |
| Real voice | STT/TTS vendor with Gulf Arabic coverage, barge-in, code-switching | **D‑5, open** — test dialect samples before committing |
| Retrieval | Multilingual embedding provider (hard requirement), `pgvector` index | **D‑5 + phase 4** |
| Persisted conversations, saved projects | Neon + the D‑4 privacy stance revisited | D‑4 currently says session-scoped only |
| Document ingestion | Neon + Vercel Blob + RBAC + review workflow | Phase 2, then phase 7 |
| Real knowledge gaps | Assistant traffic, and a place to write records | Phase 5, then phase 7 |
| Activities, approvals, conditions, claims | The schema in Architecture §2–3 | **Phase 1** — the UI components accept them today and render nothing without data |
| Public API, MCP | Service layer + auth + quotas + licensing | Phases 9–10 |

The UI is built so that none of the above changes a component's props. When the
schema lands, `ActivityList`, `ApprovalList` and `ConditionList` start receiving
data they already know how to render.

---

## 9 · Not implemented, deliberately

Every item on the Phase 1A stop-list is untouched: no LLM provider, no
hard-coded AI/STT/TTS API, no vector infrastructure, no production D1 or Postgres
schema, no document storage, no API keys, no MCP, no external APIs, no database
migration, no hosting change, no change to the lifecycle or content model, and no
change to any test-guarded invariant.

`drizzle.config.ts` still says `dialect: "sqlite"` and `db/schema.ts` is still
empty. Both change in phase 2, after D‑1's Postgres implications are actioned —
not here.

# REOS Property Ecosystem AI Knowledge Platform — Architecture

**Phase A deliverable package.** Produced by executing
[V3-MASTER-PROMPT.md](V3-MASTER-PROMPT.md) PART 18. No production code has been
written; PART 0.2 forbids it until the decisions in
[DECISIONS.md](DECISIONS.md) are signed off.

Reviewed against `eeab2a1` on the `main` branch. Every claim about the current
repository below was verified against the source, not inferred.

| # | Deliverable | Section |
|---|---|---|
| 1 | Architecture assessment | §1 |
| 2 | Decisions | [DECISIONS.md](DECISIONS.md) |
| 3 | Data model, schema and migration | §2–3 |
| 4 | Knowledge Engine architecture | §4 |
| 5 | Document repository architecture | §5 |
| 6 | Retrieval architecture | §6 |
| 7 | AI Assistant architecture | §7 |
| 8 | Voice architecture | §8 |
| 9 | API and MCP boundary | §9 |
| 10 | Implementation phases | §10 |
| — | Evaluation plan | §8.6 within the assistant section, thresholds in §10 gates |
| — | Security threat model | §11 |
| — | Risks | §12 |

---

# §1 · Architecture assessment

## 1.1 What exists

The repository is a well-built **static knowledge site**, further along than the
strategic assessment described. It has no runtime tier at all.

| Layer | State |
|---|---|
| Framework | Next 16.2.6 / React 19.2.6 / TypeScript 5.9.3, App Router via `vinext` |
| Deploy | **Vercel** (D‑1, decided) via the standard `next build` pipeline. The repo also carries an unused Cloudflare Workers scaffold from its template — `vinext`, `wrangler`, `worker/index.ts`, `build:sites` — which is the test harness's build target, not the deployment artifact |
| Rendering | 100% static — ~169 prerendered pages, every dynamic route has `generateStaticParams` |
| Backend | **None.** No route handlers, no server actions, no auth, no sessions |
| Database | `drizzle-orm` installed but **`drizzle.config.ts` is still `dialect: "sqlite"` from the template** and `db/schema.ts` is deliberately empty. Moves to `dialect: "postgresql"` (Neon) in phase 2 |
| Object storage | None provisioned. Vercel Blob in phase 2 |
| Content | Typed data files in `app/data/` — no CMS |
| i18n | English at root, Arabic at `/ar`, Arabic as an id-keyed overlay with English fallback |
| Tests | `tests/rendered-html.test.mjs`, 10 tests, run against `dist/` |

## 1.2 The content model — the real asset

| File | Holds | Shape quality |
|---|---|---|
| [journey.ts](../app/data/journey.ts) | **12 canonical stages** — `phase`, `track`, `runsWith`, `whatHappens`, `groupIds`, `documents`, `risks`, `nextStep`, `jurisdiction`, `detailStageIds`, `status` | Excellent. Already models concurrency and jurisdiction |
| [ecosystem.ts](../app/data/ecosystem.ts) | **12 groups**, 4 clusters + rail + cross-cutting, `controls`, `members`, `phases` | Matches the research taxonomy; rail correctly separated |
| [reos.ts](../app/data/reos.ts) | 24 detail stages, 8 stakeholder lenses (`inputs`/`outputs`/`dependencies`/`entryConditions`/`bottlenecks`/`systems`), **11 authorities with `sourceUrl` + `jurisdiction`** | Process-graph shaped, not marketing bios |
| [routes.ts](../app/data/routes.ts) | 12 self-selection routes in 3 tiers, `taxonomyGroup` back-references, aliases | This is the persona surface the assistant should map onto |
| [personas.ts](../app/data/personas.ts) | 8 written journeys, each step keyed to a stage id | **7 of 12 routes published; 5 `pending`.** The 8th entry serves the orientation helper, which is not one of the twelve — counting entries rather than resolved routes is how this was first mis-stated as 8/4 |
| [glossary.ts](../app/data/glossary.ts) | 16 terms with `aka`, `jurisdictional` flag | The seed of the bilingual term map |
| [phase1.ts](../app/data/phase1.ts) | Legacy consumer journeys | **Retirement candidate. Do not index.** |

`ContentStatus` = `Validated` / `To Be Validated` / `Illustrative` /
`Future REOS Capability`, applied per entity. This is genuine knowledge
governance and almost nothing in this category has it.

## 1.3 Gap list — what the platform requires and does not have

Ordered by how much each blocks.

| # | Gap | Severity | Why it blocks |
|---|---|---|---|
| G1 | **No runtime tier.** No server surface, no database, no object storage, no auth | Blocking | Every AI capability needs one. This is phase 2 and it is the largest single piece of work |
| G2 | **No `Activity` entity.** Roles, documents and dependencies attach to stages | Blocking | Stage-level answers are too coarse to act on. "Obtain building permit" is a stage; "submit structural drawings for review" is the unit that carries a gate |
| G3 | **No `Approval` entity.** Gates are implied by stage names | Blocking | The join between the regulatory rail and the delivery graph, and the highest-intent page type in search |
| G4 | **No typed `Condition`.** `jurisdiction` is a prose string | Blocking | Without machine-readable applicability the model invents the branch it cannot look up |
| G5 | **No `Claim`.** Status and provenance are per-entity, not per-assertion | Blocking | Page-level status cannot support per-sentence citation |
| G6 | **No typed dependency edges.** `runsWith` exists; `blocks` / `enables` / `informs` do not | Blocking | "Why am I blocked" — the highest-value question in development — is unanswerable |
| G7 | **Actor and Role are conflated.** One party, one group | High | Already patched twice by duplication (banks across G2/G6, owners' association across G9/G11) |
| G8 | **Jurisdiction is emirate-grained at best.** Free zones (DIFC, DDA, Trakhees/PCFC, DMCC) define separate approval regimes | High | A correct-sounding Dubai answer can be wrong for the visitor's zone. Correctness and liability |
| G9 | **No retrieval layer, no embeddings, no search index** | High | Phase 4 |
| G10 | **No evaluation harness** | High | "Must not hallucinate" is unmeasurable without one; it is also the CI gate for every later phase |
| G11 | **5 of 12 routes have no written journey** (`selling`, `legal-compliance`, `utilities`, `regulators`, `specialist-services`); much of the corpus is `To Be Validated` | High | Editorial, not engineering. Determines how much the assistant can actually answer |
| G12 | **No admin surface** — content is typed files edited by developers | Medium | Blocks the ingestion → review → approve loop, hence the gap engine |
| G13 | **Three configured origins**; `robots.ts` points crawlers at a sitemap on a different host than `sitemap.ts` emits | Medium | Two-line fix, currently misdirecting crawlers |
| G14 | **No structured data, no `llms.txt`** | Low | Cheap, high-value for a platform whose distribution is increasingly AI answers |

## 1.4 What must survive the build

Non-negotiable — three are test-guarded, and the tests are the specification:

1. One canonical lifecycle (12 stages). The `Activity` tier hangs *beneath* it.
2. Order is not sequence. `runsWith` is load-bearing; the assistant must surface
   concurrency rather than implying a queue.
3. The demo CTA lives only on `/platform`.
4. Authorities are a rail, not a cluster.
5. `ContentStatus` labels stay visible — and become a retrieval filter.
6. Jurisdiction discipline: Dubai guidance is never presented as UAE guidance.
7. Arabic is an id-keyed overlay with English fallback; every route needs its
   `/ar` twin.
8. The accessibility work — theme, three text scales, RTL — carries forward
   unchanged. It is ahead of this category.

---

# §2 · Data model

## 2.1 Entity map

```
Jurisdiction ──applies-to──┐
                           │
Phase ──contains──▶ Stage ──contains──▶ DetailStage ──contains──▶ ACTIVITY ◀──on── Track
                                                                     │
                    ┌──────────────┬─────────────┬──────────────┬─────┘
                    ▼              ▼             ▼              ▼
                 ROLE          DOCUMENT      APPROVAL      DEPENDENCY
                    │              │             │          (typed edge,
              played-by       issued-by      issued-by       conditional)
                    ▼              ▼             ▼
                 ACTOR ──in──▶ GROUP ──in──▶ CLUSTER      AUTHORITY  ← regulatory rail
                                                              │
  every operative statement on any of the above ──────────▶ CLAIM ──cites──▶ SOURCE ──stored-in──▶ DOCUMENT FILE
```

Capitals are new. Everything else exists in some form.

## 2.2 New entity definitions

```ts
// ── the atom ────────────────────────────────────────────────────────────────
export type Activity = {
  id: string;
  name: string;                    // "Submit structural drawings for review"
  slug: string;
  detailStageId: string;           // → reos.ts lifecycleStages
  stageId: string;                 // → journey.ts (denormalized for query speed)
  phase: Phase;
  track: Track;
  summary: string;
  purpose: string;                 // why it exists — what failure it prevents
  roleIds: RoleId[];               // who does what here
  inputDocumentIds: DocumentId[];
  outputDocumentIds: DocumentId[];
  approvalIds: ApprovalId[];       // gates on this activity
  systemIds: SystemId[];           // portal/channel where it is transacted
  conditions: Condition[];         // when this activity applies at all
  typicalDurationDays?: NumericRange;
  commonFailures: string[];        // what actually stops projects here
  claimIds: ClaimId[];
  status: ContentStatus;
};

// ── the gate — highest-value entity in the model ────────────────────────────
export type Approval = {
  id: string;
  name: string;                    // "Building permit"
  slug: string;
  questionTitle: string;           // "What do I need for a building permit in Dubai?"
  authorityId: AuthorityId;
  prerequisiteApprovalIds: ApprovalId[];
  requiredDocumentIds: DocumentId[];
  unlocksActivityIds: ActivityId[];
  conditions: Condition[];
  validity?: { months?: number; note?: string };
  typicalDurationDays?: NumericRange;
  feeBasis?: string;               // never a number without a Claim behind it
  systemIds: SystemId[];
  claimIds: ClaimId[];
  status: ContentStatus;
};

// ── actor vs role — the structural correction ───────────────────────────────
export type Actor = {
  id: string;
  name: string;                    // "Commercial bank"
  groupId: GroupId;                // exactly one of the 12, by journey function
  aka?: string[];
  status: ContentStatus;
};

export type Role = {
  id: string;
  name: string;                    // "Escrow account trustee"
  description: string;
  eligibleActorIds: ActorId[];     // which party types may hold it
  isRegulatedAppointment: boolean; // trustee, engineer of record, escrow auditor
  authorityId?: AuthorityId;       // who registers/licenses the role, if anyone
  status: ContentStatus;
};

// ── typed conditional dependency ────────────────────────────────────────────
export type DependencyType = "blocks" | "enables" | "informs" | "runs-parallel-to";

export type Dependency = {
  id: string;
  fromActivityId: ActivityId;
  toActivityId: ActivityId;
  type: DependencyType;
  reason: string;                  // rendered on both activity pages
  conditions: Condition[];         // when this edge applies
  claimIds: ClaimId[];             // a `blocks` edge without a source is not publishable
  status: ContentStatus;
};

// ── applicability, machine-readable ─────────────────────────────────────────
export type Condition = {
  jurisdictionIds?: JurisdictionId[];
  assetTypes?: AssetType[];         // residential | commercial | mixed | industrial | hospitality
  tenures?: Tenure[];               // freehold | leasehold | usufruct | musataha
  saleRoutes?: SaleRoute[];         // off-plan | ready | build-to-lease
  storeys?: NumericPredicate;       // { gt: 4 }
  heightMetres?: NumericPredicate;
  buyerResidency?: BuyerResidency[];// uae-resident | gcc | non-resident
  masterCommunity?: boolean;        // true = only inside a master community
  note?: string;                    // human-readable gloss, never the logic
};

// ── jurisdiction as an entity, not a string ─────────────────────────────────
export type Jurisdiction = {
  id: string;                       // "dubai-mainland", "dubai-dda", "dubai-trakhees"
  emirate: Emirate;
  zone: "mainland" | "free-zone" | "special-development-zone";
  regime: AuthorityRegime;          // dm | dda | trakhees-pcfc | difc | dmcc | adm | adrec
  name: string;
  whatDiffersHere: string[];
  parentId?: string;
  status: ContentStatus;
};

// ── provenance, at claim granularity ────────────────────────────────────────
export type EpistemicType =
  | "legislative" | "regulatory-requirement" | "official-procedure"
  | "market-practice" | "professional-guidance" | "reos-interpretation"
  | "commercial-information";

export type Claim = {
  id: string;
  statement: string;                // ONE operative assertion
  epistemicType: EpistemicType;
  authorityId?: AuthorityId;
  sourceId: SourceId;
  sourceLocator?: string;           // heading path / article / section
  jurisdictionIds: JurisdictionId[];
  conditions: Condition[];
  effectiveFrom?: string;           // ISO date
  lastVerified: string;             // ISO date — surfaced in the UI
  reviewDueBy: string;              // drives the verification queue
  supersededByClaimId?: string;
  confidence: "high" | "medium" | "low";
  status: ContentStatus;
  workflowStatus: WorkflowStatus;   // draft → under-review → approved → published → deprecated → archived
  attachedTo: { entityType: EntityType; entityId: string }[];
};
```

## 2.3 Status — two vocabularies, one mapping

| Workflow (internal) | Visitor-facing `ContentStatus` | Retrievable? | Groundable? |
|---|---|---|---|
| `published` + sourced + in-date | `Validated` | ✅ | ✅ cite it |
| `published`, not fully sourced | `To Be Validated` | ✅ | ⚠️ labelled orientation only |
| `published`, worked example | `Illustrative` | ✅ | ❌ never as fact |
| `published`, roadmap | `Future REOS Capability` | ✅ | ❌ never as present capability |
| `draft` / `under-review` / `deprecated` / `archived` | — | ❌ | ❌ |

This is an index filter, not a UI badge. It is applied before ranking, in the
same predicate as jurisdiction (§6.2).

---

# §3 · Schema and migration

## §3.1 Storage split

| Data | Where | Why |
|---|---|---|
| The 12 stages, 4 phases, 6 tracks, 12 groups, 4 clusters, 12 routes, 8 personas | **Stay in typed files** | Test-guarded, reviewed in PRs, tiny, changes rarely. Moving them buys nothing and risks the canonical-spine invariant |
| Activities, approvals, roles, actors, documents, dependencies, conditions, jurisdictions, claims, sources | **Postgres (Neon)** | Thousands of rows, edited by non-developers, needs review workflow and audit |
| Source document files | **Vercel Blob** (or S3) | Binary, large, signed time-limited access |
| Entity-derived passages + vectors | **Postgres + `pgvector`** | Same database as the entities, so one query filters and ranks together (§6.3) |
| Conversations, gaps, retrieval traces | **Postgres** | Operational, retention-bounded (D‑4) |

The typed files remain the **spine**; Postgres hangs beneath them by id. A build-time
check asserts every `Activity.stageId` resolves against `journey.ts` — this is
how the canonical-lifecycle invariant survives contact with a database.

## §3.2 Core tables (Postgres via Drizzle)

DDL below is Postgres. `pgvector` supplies the embedding column and `tsvector`
the lexical index — both live in the same database as the entities, which is the
main practical gain from D‑1 landing on Vercel + Neon.

```sql
-- ── knowledge ──────────────────────────────────────────────────────────────
CREATE TABLE activity (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  detail_stage_id TEXT NOT NULL,          -- → reos.ts, validated at build
  stage_id TEXT NOT NULL,                 -- → journey.ts, validated at build
  phase TEXT NOT NULL,
  track TEXT NOT NULL,
  summary TEXT NOT NULL,
  purpose TEXT NOT NULL,
  conditions TEXT NOT NULL DEFAULT '{}',  -- JSON Condition
  typical_duration_days TEXT,             -- JSON NumericRange
  common_failures TEXT NOT NULL DEFAULT '[]',
  content_status TEXT NOT NULL,
  workflow_status TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX activity_stage ON activity(stage_id);
CREATE INDEX activity_phase_track ON activity(phase, track);

CREATE TABLE approval (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  question_title TEXT NOT NULL,
  authority_id TEXT NOT NULL,
  conditions TEXT NOT NULL DEFAULT '{}',
  validity_months INTEGER,
  typical_duration_days TEXT,
  fee_basis TEXT,
  content_status TEXT NOT NULL,
  workflow_status TEXT NOT NULL
);
CREATE INDEX approval_authority ON approval(authority_id);

CREATE TABLE actor (
  id TEXT PRIMARY KEY, name TEXT NOT NULL,
  group_id TEXT NOT NULL,                 -- exactly one of the 12
  aka TEXT NOT NULL DEFAULT '[]',
  content_status TEXT NOT NULL
);

CREATE TABLE role (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL,
  is_regulated_appointment INTEGER NOT NULL DEFAULT 0,
  authority_id TEXT,
  content_status TEXT NOT NULL
);

CREATE TABLE jurisdiction (
  id TEXT PRIMARY KEY, emirate TEXT NOT NULL, zone TEXT NOT NULL,
  regime TEXT NOT NULL, name TEXT NOT NULL,
  what_differs_here TEXT NOT NULL DEFAULT '[]',
  parent_id TEXT, content_status TEXT NOT NULL
);

-- ── edges: one table per relation kind, all conditional ─────────────────────
CREATE TABLE dependency (
  id TEXT PRIMARY KEY,
  from_activity_id TEXT NOT NULL,
  to_activity_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('blocks','enables','informs','runs-parallel-to')),
  reason TEXT NOT NULL,
  conditions TEXT NOT NULL DEFAULT '{}',
  content_status TEXT NOT NULL,
  UNIQUE (from_activity_id, to_activity_id, type)
);
CREATE INDEX dep_forward  ON dependency(from_activity_id, type);
CREATE INDEX dep_backward ON dependency(to_activity_id, type);   -- "why am I blocked"

CREATE TABLE activity_role (
  activity_id TEXT NOT NULL, role_id TEXT NOT NULL,
  responsibility TEXT NOT NULL,
  conditions TEXT NOT NULL DEFAULT '{}',
  PRIMARY KEY (activity_id, role_id)
);
CREATE TABLE actor_role (actor_id TEXT NOT NULL, role_id TEXT NOT NULL, PRIMARY KEY (actor_id, role_id));
CREATE TABLE activity_document (
  activity_id TEXT NOT NULL, document_id TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('input','output')),
  PRIMARY KEY (activity_id, document_id, direction)
);
CREATE TABLE activity_approval (activity_id TEXT NOT NULL, approval_id TEXT NOT NULL, PRIMARY KEY (activity_id, approval_id));
CREATE TABLE approval_prerequisite (approval_id TEXT NOT NULL, prerequisite_id TEXT NOT NULL, PRIMARY KEY (approval_id, prerequisite_id));

-- ── provenance ─────────────────────────────────────────────────────────────
CREATE TABLE claim (
  id TEXT PRIMARY KEY,
  statement TEXT NOT NULL,
  epistemic_type TEXT NOT NULL,
  authority_id TEXT,
  source_id TEXT NOT NULL,
  source_locator TEXT,
  conditions TEXT NOT NULL DEFAULT '{}',
  effective_from TEXT,
  last_verified TEXT NOT NULL,
  review_due_by TEXT NOT NULL,
  superseded_by_claim_id TEXT,
  confidence TEXT NOT NULL,
  content_status TEXT NOT NULL,
  workflow_status TEXT NOT NULL
);
CREATE INDEX claim_review ON claim(review_due_by) WHERE superseded_by_claim_id IS NULL;

CREATE TABLE claim_attachment (
  claim_id TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT NOT NULL,
  PRIMARY KEY (claim_id, entity_type, entity_id)
);
CREATE INDEX claim_by_entity ON claim_attachment(entity_type, entity_id);

CREATE TABLE claim_jurisdiction (claim_id TEXT NOT NULL, jurisdiction_id TEXT NOT NULL, PRIMARY KEY (claim_id, jurisdiction_id));

CREATE TABLE source (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, kind TEXT NOT NULL,
  authority_id TEXT, url TEXT, retrieved_at TEXT,
  r2_key TEXT, checksum TEXT, licence TEXT, attribution TEXT
);

CREATE TABLE verification_event (
  id TEXT PRIMARY KEY, claim_id TEXT NOT NULL, verified_at TEXT NOT NULL,
  verified_by TEXT NOT NULL, outcome TEXT NOT NULL, note TEXT
);   -- the public "142 claims verified this quarter" number comes from here

-- ── retrieval ──────────────────────────────────────────────────────────────
CREATE TABLE passage (
  id TEXT PRIMARY KEY,
  corpus TEXT NOT NULL CHECK (corpus IN ('entity','document')),
  entity_type TEXT, entity_id TEXT,             -- corpus='entity'
  document_id TEXT, chunk_group_id TEXT,        -- corpus='document'
  locale TEXT NOT NULL,
  text TEXT NOT NULL,
  heading_path TEXT,
  jurisdiction_ids TEXT NOT NULL DEFAULT '[]',
  phase TEXT, stage_id TEXT, group_ids TEXT NOT NULL DEFAULT '[]',
  content_status TEXT NOT NULL,
  route_slug TEXT,                              -- where to send the visitor
  embedding vector(1024),                       -- pgvector; dims follow the model
  embedding_model TEXT, embedding_dims INTEGER, embedded_at TIMESTAMPTZ,
  tsv TSVECTOR GENERATED ALWAYS AS (to_tsvector('simple', text)) STORED
);
CREATE INDEX passage_filter ON passage(corpus, locale, content_status);
CREATE INDEX passage_tsv    ON passage USING GIN (tsv);
CREATE INDEX passage_vec    ON passage USING hnsw (embedding vector_cosine_ops);
-- 'simple' rather than 'english': the corpus is bilingual and stemming Arabic
-- with an English dictionary is worse than not stemming at all.

-- ── operations ─────────────────────────────────────────────────────────────
CREATE TABLE conversation (
  id TEXT PRIMARY KEY, started_at INTEGER NOT NULL, last_seen_at INTEGER NOT NULL,
  locale TEXT NOT NULL, context TEXT NOT NULL, context_schema_version INTEGER NOT NULL,
  purge_after INTEGER NOT NULL                  -- D-4: ≤30 days
);
CREATE TABLE conversation_message (
  id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL, turn INTEGER NOT NULL,
  role TEXT NOT NULL, redacted_text TEXT NOT NULL, created_at INTEGER NOT NULL
);
CREATE TABLE retrieval_trace (
  id TEXT PRIMARY KEY, conversation_id TEXT, turn INTEGER,
  filters TEXT NOT NULL, candidates TEXT NOT NULL, chosen TEXT NOT NULL,
  latency_ms INTEGER, input_tokens INTEGER, output_tokens INTEGER,
  cache_read_tokens INTEGER, cost_micros INTEGER, refusal_type TEXT
);
CREATE TABLE knowledge_gap (
  id TEXT PRIMARY KEY, normalized_question TEXT NOT NULL UNIQUE,
  frequency INTEGER NOT NULL DEFAULT 1, first_seen INTEGER, last_seen INTEGER,
  detected_context TEXT, refusal_type TEXT, candidate_entity TEXT,
  gap_status TEXT NOT NULL DEFAULT 'open'
);
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY, at INTEGER NOT NULL, actor TEXT NOT NULL,
  action TEXT NOT NULL, entity_type TEXT, entity_id TEXT, before TEXT, after TEXT
);
```

## §3.3 Migration from the typed files

Non-destructive, in this order. Nothing in `journey.ts`, `ecosystem.ts` or
`routes.ts` changes shape.

1. **Seed `jurisdiction`** from the emirate/zone matrix in the research taxonomy
   plus the `jurisdiction` prose already on each of the 12 stages. ~10 rows.
   This is the smallest change with the largest correctness payoff.
2. **Seed `authority`** from `reos.ts` (11 rows, already carry `sourceUrl` and
   `jurisdiction`). Keep `reos.ts` as the build-time source; Postgres becomes the
   editable copy once the admin exists.
3. **Derive `actor`** from `ecosystem.ts` `Group.members` — each member string
   becomes an actor row in that group. 99 member entries exist today, so ~99
   rows to start, then reviewed by hand.
4. **Extract `role`** from the duplicated members flagged in the taxonomy's v1→v2
   audit trail (banks G2/G6, owners' association G9/G11, owner-side DM vs
   consultant PM G1/G4) plus the regulated appointments the assessment named:
   escrow account trustee, engineer of record, escrow auditor.
5. **Author `activity`** beneath each of the 24 detail stages, using the existing
   `Stakeholder.inputs` / `outputs` / `entryConditions` / `bottlenecks` as the
   raw material — those fields are already activity-shaped, which is why the
   assessment called them a process-graph node shape.
6. **Author `approval`** from the approval-flavoured detail stages and the
   authorities' `role` fields. Every approval needs an authority and at least one
   claim before it can be `published`.
7. **Lift `dependency`** — start from `Stage.runsWith` (becomes
   `runs-parallel-to` edges between the activities in those stages) and
   `Stakeholder.dependencies` (becomes `blocks` / `enables`). Every `blocks` edge
   requires a sourced claim: an unsourced hard gate is the single most dangerous
   row in the database.
8. **Author `claim`** for every operative statement in the slice. This is the
   editorial workload and it does not compress.
9. **Generate `passage`** from all of the above at build time (§6.1).

Arabic: each new entity gets its overlay entry in `app/i18n/content/*.ar.ts`
keyed by id, exactly as the existing files do. `passage.locale` carries the
language; `chunk_group_id` links translations of the same source.

## §3.4 Build-time invariant checks

Run in `npm run lint` and fail the build:

- every `activity.stage_id` and `detail_stage_id` resolves against the typed files;
- no stage list exists outside `journey.ts` and `reos.ts` (guards invariant 1);
- every `dependency` of type `blocks` with `content_status = 'Validated'` has ≥1
  `Validated` claim;
- every `approval` has an `authority_id` that resolves;
- every `actor` belongs to exactly one group;
- every published entity has an `ar` overlay entry **or** is explicitly marked
  translation-pending;
- every `route_slug` on a passage exists in `routes.ts`.

---

# §4 · Knowledge Engine

The engine is a **service layer**, not a database wrapper. Every consumer — web
UI, assistant, API, MCP — goes through it, which is what keeps one governed
source of truth (V3 PART 13.1).

```
app/knowledge/
  index.ts            public surface — the only import path consumers use
  spine.ts            typed-file reads: phases, stages, tracks, groups, clusters, routes
  entities.ts         DB reads: activity, approval, role, actor, document, jurisdiction
  graph.ts            traversal: forward(), backward(), concurrent(), roleLens()
  conditions.ts       evaluate(Condition, ResolvedFacts) → boolean | "unknown"
  status.ts           the status→retrievability predicate, in ONE place
  claims.ts           claim lookup, staleness, citation assembly
  passages.ts         entity → passage rendering (build-time)
  terms.ts            bilingual term map, glossary resolution
```

## §4.1 Condition evaluation — three-valued, deliberately

```ts
type Verdict = "applies" | "does-not-apply" | "unknown";
```

`unknown` is the important one. If a condition names `storeys` and the visitor's
facts do not include storeys, the answer is not "assume it applies" — it is *ask*.
This function is what turns the context bar from a filter into a correctness
mechanism, and it is the single place where the "never guess jurisdiction" rule
is enforced. A condition set that yields `unknown` on a field the answer depends
on triggers the `jurisdiction-unresolved` refusal (§7.5), not a hedge.

## §4.2 Traversal

```ts
graph.forward(activityId, facts)    // enables + informs, condition-filtered
graph.backward(activityId, facts)   // blocks — "why am I blocked"
graph.concurrent(activityId, facts) // runs-parallel-to — the honesty function
graph.gates(activityId, facts)      // approvals gating this activity, with authorities
graph.roleLens(roleId, facts)       // every activity where this role appears, by phase
graph.jurisdictionDiff(entityId, [jA, jB])  // side-by-side — the novel feature
```

`concurrent()` is not a nicety. Invariant 2 says order is not sequence; an
answer to "what happens after X" that does not call `concurrent()` will state
something false about UAE off-plan development.

## §4.3 Absence of a graph database — deliberate

Recursive traversal via `WITH RECURSIVE` over `dependency` handles the
depths this domain has (a `blocks` chain is single-digit deep). A graph store
before the content exists costs months and buys nothing; the bottleneck is
editorial. Revisit only if traversal depth or fan-out becomes the measured
bottleneck, which it will not at this corpus size.

---

# §5 · Document & knowledge repository

## §5.1 Two corpora — and the size that shapes everything

**Corpus A — entity-derived passages (primary).** Every stage, detail stage,
activity, approval, document, role, actor, group, authority, jurisdiction and
glossary term rendered deterministically into a compact passage carrying its ids,
conditions and status. Regenerated at build.

Size estimate at full V1 scope: 12 stages + 24 detail stages + ~400 activities +
~120 approvals + ~150 documents + ~80 roles + 99 actors + 12 groups + 11
authorities + ~10 jurisdictions + ~60 terms ≈ **~1,000 passages per locale,
~2,000 total.**

That number matters for a different reason now that D‑1 has landed on Vercel +
Neon: 2,000 × 1024-dimension vectors is ~8 MB, which `pgvector` indexes trivially
and which sits in the *same database* as the entities. One query can therefore
apply the jurisdiction/status filter and rank by similarity together, instead of
filtering in one system and ranking in another and reconciling the two. No
separate vector service is needed at this scale or several orders above it.

**Corpus B — source documents (secondary).** Regulations, authority
publications, research, industry reports. Chunked, always subordinate to the
entity that cites them. This is the corpus that grows without bound, and the one
that eventually justifies an external vector index — as its own decision, when
measured, not now.

## §5.2 Storage and the traceability chain

```
Blob: source/{sourceId}/{checksum}.{ext}      the original file, immutable
DB:   source                                   metadata, licence, attribution
DB:   claim → source_id + source_locator       the assertion and where it came from
DB:   passage (corpus='document')              searchable chunks
DB:   claim_attachment                         which entities the claim supports
```

Every answer resolves: **answer → cited claim → source + locator → original file
in Blob → authority URL.** Access to blob objects is by signed, time-limited URL
generated per request against the source's `confidentiality` — never a public
bucket path.

## §5.3 Chunking (Corpus B)

- Structure-aware: split on headings, clauses and table boundaries. Never a fixed
  character count alone.
- 400–800 tokens, 10–15% overlap. Never split a numbered requirement from its
  number, or a table row from its header.
- Every chunk carries the parent's full metadata, a stable `chunkId`, and its
  **heading path** — the heading path is what makes a citation useful ("Section
  4.2" rather than "page 7").
- `chunk_group_id` links en/ar chunks of the same source so cross-language
  retrieval can return the reader's language.

## §5.4 Ingestion pipeline

```
admin upload  ──or──  registered web source fetch
   ↓  checksum → dedupe, detect change
   ↓  format detection
   ↓  text extraction  → OCR when needed          ┐ OFFLINE or QUEUE CONSUMER —
   ↓  structure detection (headings, tables)      │ never in the request path
   ↓  sanitisation (§11.2)                        ┘ background function, not the request
   ↓  chunking + metadata enrichment + entity linking
   ↓  CLAIM EXTRACTION — proposes, never publishes
   ↓  human review → approve  (different role from author)
   ↓  embedding
   ↓  passage rows + FTS index
```

**Claim extraction proposes; a human approves.** A model-extracted regulatory
claim entering the corpus unreviewed is the failure mode the entire status system
exists to prevent. The extraction step writes `workflow_status = 'under-review'`
and nothing else.

## §5.5 Embeddings

- **Must be multilingual.** Cross-language retrieval (Arabic query → English
  source) is a stated requirement; a monolingual English model cannot satisfy it.
  This constrains provider choice and is a hard requirement, not a preference.
  Anthropic does not serve embeddings, so this is a separate provider reached over
  HTTPS from a route handler, or generated at build time and loaded into Postgres.
- Record `embedding_model`, `embedding_dims`, `embedded_at` on every row. A model
  change is a full re-index — a migration, not a config tweak.
- **Belt and braces for terminology.** Also index the bilingual term map so exact
  matching works in both languages: escrow / حساب الضمان, off-plan / على المخطط,
  NOC / شهادة عدم ممانعة, title deed / سند الملكية. The Arabic terminology in
  `app/i18n/content/*.ar.ts` already follows UAE regulatory usage rather than
  literal translation — reuse it; do not re-translate.

---

# §6 · Retrieval

## §6.1 Passage generation (build time)

Deterministic templates per entity type. An activity renders roughly as:

```
[ACTIVITY] Submit structural drawings for review
Phase: Deliver · Stage: Design & approvals · Track: Regulatory
Applies in: Dubai (mainland, DM) · residential · G+4 and above
Purpose: ...
Roles: engineer of record (signs), design consultant (produces), ...
Consumes: structural drawings, soil investigation report
Produces: structural review comments
Gated by: structural design approval (Dubai Municipality)
Blocked by: completed geotechnical investigation
Runs parallel to: MEP design review, main contractor tender
Common failures: ...
Status: Validated · Last verified 2026-07-14
→ /journey/design-approvals
```

Advantages over chunking prose: perfect traceability, no chunk-boundary loss,
cheap to re-embed, and the retrieved unit maps 1:1 to a page the visitor can be
sent to — which is what makes the navigation actions in §7.6 possible at all.

## §6.2 Filter first — the correctness step

Applied as a SQL predicate **before** any ranking:

```sql
WHERE corpus IN (:corpora)
  AND locale = :locale
  AND content_status IN (:groundable)        -- D-3
  AND (jurisdiction_ids = '[]' OR jurisdiction_overlap(jurisdiction_ids, :jurisdictions))
  AND (:phase IS NULL OR phase = :phase)
  AND (:stage IS NULL OR stage_id = :stage)
```

Filtering before ranking is what stops an Abu Dhabi passage answering a Dubai
question with high semantic similarity. On Postgres this is one statement — the
predicate and the `ORDER BY embedding <=> :q` live together, so the filter can
never be silently skipped by a caller that forgot it. It is also where D‑3 and invariant 6 are
mechanically enforced rather than hoped for.

## §6.3 Five methods, one planner

| Method | Used for | Implementation |
|---|---|---|
| **Metadata filter** | Always, first | The predicate above |
| **Structured graph query** | Known relations: "which approvals gate piling in Dubai mainland?" | `graph.gates()` — a traversal, not a similarity search |
| **Keyword / BM25** | Statute numbers, authority names, exact Arabic terms | Postgres `tsvector` + GIN over `passage.text` |
| **Semantic** | Meaning and paraphrase | `pgvector` cosine over `passage.embedding`, HNSW index, in the same query as the filter |
| **Term resolution** | Glossary hits, bilingual aliases | Exact match against the term map |

The **planner** picks methods from the detected intent, not from every query:

| Intent | Plan |
|---|---|
| `diagnose-blocker` | graph `backward()` only — no similarity search needed or wanted |
| `identify-authority` | graph `gates()` → approval → authority |
| `understand-process` | filter + semantic + BM25, reranked |
| `understand-document` | term resolution → document entity → graph |
| `compare` | two filtered retrievals, one per jurisdiction, then `jurisdictionDiff()` |
| `verify-claim` | claim lookup by entity, with staleness check |

A graph-answerable question answered by similarity search is a correctness bug,
not just an inefficiency. The planner is where that is prevented.

## §6.4 Validation and trace

Every candidate set is validated before generation: status permits grounding,
`effective_from` has passed, `superseded_by_claim_id` is null, jurisdiction
overlaps the resolved facts. A candidate failing any check is dropped with a
reason recorded.

Every answer writes a `retrieval_trace` row: filters applied, candidate ids and
scores, chosen set, latency, tokens, cache reads, cost, refusal type. Without
this, quality regressions are undebuggable — and the eval harness in §7.7 reads
from it.

---

# §7 · AI Assistant

## §7.1 Shape

```
visitor (text or voice)
  │
  ├─ input validation + injection screening (§11.2)
  ├─ deterministic signals: script→locale, id/term exact match, UI state (route, context bar)
  ├─ ONE structured-output call → ConversationContext + per-field confidence
  ├─ GATE: does the answer depend on an unresolved fact? → clarify and stop
  ├─ retrieval planning → hybrid retrieval → status/date/jurisdiction validation
  ├─ GATE: sufficiency → typed refusal (§7.5) + knowledge-gap write
  ├─ generation over retrieved claims only, streaming
  ├─ post-generation validation: every operative claim maps to a cited claim id;
  │                             every action validates against the route allowlist
  └─ answer + sources + next step + actions + trace
```

The two gates and the post-generation validation are the architecture. Without
them this is a chatbot with a citation instruction.

## §7.2 Context frame

```ts
type ConversationContext = {
  schemaVersion: 1;
  locale: "en" | "ar";
  localeConfidence: number;
  primaryPersona: RouteSlug | null;      // keyed to routes.ts
  secondaryPersona: RouteSlug | null;
  actorGroup: GroupId | null;
  roles: RoleId[];
  jurisdiction: JurisdictionId | null;   // emirate AND zone — §7.3
  assetType: AssetType | null;
  tenure: Tenure | null;
  saleRoute: SaleRoute | null;
  scale: { storeys?: number; units?: number } | null;
  phase: Phase | null;
  stageId: StageId | null;
  activityId: ActivityId | null;
  intent: Intent | null;
  objective: string | null;
  unresolved: (keyof ConversationContext)[];
  turnCount: number;
};
```

Rendered as the **persistent context bar** — the highest-value interface element
in the product, because it is what converts a generic reference into an answer.
It is editable from anywhere, it filters every page beneath it, and it is the
same object the assistant reasons over. One state, two surfaces.

`unresolved` drives the next clarifying question: ask for the one field that most
changes the answer, never a checklist.

## §7.3 Jurisdiction resolution

Detecting "Dubai" is not sufficient and treating it as sufficient is a
correctness failure. Free-zone regimes (DIFC, DDA, Trakhees/PCFC, DMCC) define
separate approval sequences — the research taxonomy added them for exactly this
reason.

```
"in Dubai" → emirate resolved, zone unresolved
  → if the pending answer's conditions branch on zone: ASK
    "Is this on Dubai mainland (Dubai Municipality), or in a development zone
     such as DDA or Trakhees? The approval route is different."
  → else: answer, and state the scope limit
```

Where a master community applies, say so: community NOCs gate downstream
transactions and feel like public approvals while being private requirements —
a documented source of user confusion.

## §7.4 Answer contract

1. **Direct answer** — 1–3 sentences. The question asked, first.
2. **Where you are** — phase · stage · track, *with what runs alongside it*.
3. **Structure** — relevant activities / approvals / documents / roles, scannable.
4. **Sources** — on every operative claim: authority · document · section ·
   effective · last verified · status.
5. **Next step** — one or two, each a real link.
6. **What this does not cover** — scope, jurisdiction or status limits.

Bounded: ≤180 words of prose before structure. A knowledge assistant that writes
essays is a worse reference than the page it is summarising.

## §7.5 Typed refusal

| Type | Trigger | Response |
|---|---|---|
| `not-in-corpus` | No sufficiently-scored claim | Say so; name the authority or page that holds it; log a gap |
| `jurisdiction-unresolved` | Regulatory question, zone unknown, answer branches on it | Ask for emirate **and** zone |
| `status-insufficient` | Only `To Be Validated` / `Illustrative` matches | Labelled orientation, or decline per D‑3 |
| `claim-expired` | Best claim superseded or past review window | Say guidance may have changed; link the source; do not restate it as current |
| `out-of-scope` | Not UAE property development | Decline briefly |
| `regulated-advice` | Legal, tax, immigration/residency, investment or brokerage advice | Explain the platform is educational; name who to consult; still offer the process knowledge |

`regulated-advice` is a liability boundary, not a politeness convention.

Distinct from this: the model provider's own `stop_reason: "refusal"`, which must
be checked before reading response content and is handled by opting into
server-side fallback. Do not conflate the two — one is a product contract, the
other is a transport-level outcome.

## §7.6 Navigation actions

```ts
type AssistantAction =
  | { type: "navigate"; route: string }
  | { type: "openStage"; stageId: StageId }
  | { type: "highlight"; entityId: string }
  | { type: "setContext"; patch: Partial<ConversationContext> }
  | { type: "showSources"; claimIds: ClaimId[] };
```

Validated against a route allowlist derived from `routes.ts` and the sitemap
before being returned. A model must never emit an arbitrary URL. Navigation
preserves locale — an Arabic conversation navigates to `/ar/…`.

## §7.7 Model layer

Default **`claude-opus-5`** for generation (1M context, $5/$25 per MTok).
`claude-haiku-4-5` (200K, $1/$5) is the candidate for the extraction call if
tiering is approved — that is a decision to record, not an optimisation to assume.

Request shape, which differs from what older code assumes:

```ts
// context extraction — one call, structured output, schema-validated
const ctx = await client.messages.parse({
  model: EXTRACTION_MODEL,
  max_tokens: 2048,
  system: [{ type: "text", text: EXTRACTION_SYSTEM, cache_control: { type: "ephemeral" } }],
  output_config: { format: zodOutputFormat(ConversationContextSchema) },
  messages: [...priorTurns, { role: "user", content: utterance }],
});

// generation — streaming, cached prefix, claims as data
const stream = client.messages.stream({
  model: "claude-opus-5",
  max_tokens: 4096,
  thinking: { type: "adaptive" },
  output_config: { effort: "high" },
  system: [
    { type: "text", text: ANSWER_CONTRACT },                                 // frozen
    { type: "text", text: TERM_MAP_PREAMBLE, cache_control: { type: "ephemeral" } },
  ],
  messages: [
    ...priorTurns,
    { role: "user", content: renderRetrievedClaims(claims) + "\n\n" + utterance },
  ],
});
```

Non-obvious constraints that shape the code:

- `thinking: {type: "adaptive"}`; `budget_tokens` is removed and 400s. Thinking is
  on by default on `claude-opus-5`, so `max_tokens` bounds thinking *plus* answer.
- `temperature` / `top_p` / `top_k` are removed — 400. Steer by prompting.
- Assistant-turn prefill is removed. Structured outputs replace it.
- **Caching is a prefix match.** Frozen answer contract and term map first, with
  the breakpoint after them; the visitor's turn and retrieved claims after.
  **Never interpolate the context frame, a timestamp or a session id into the
  system prompt** — that invalidates the whole prefix, and it is the most likely
  way this design gets accidentally broken. Minimum cacheable prefix on
  `claude-opus-5` is 512 tokens. Verify with `usage.cache_read_input_tokens`; a
  persistent zero means something in the prefix is varying.
- Mid-conversation operator instructions go in `messages[]` as `{role: "system"}`,
  which preserves the cache and is the injection-safe operator channel.
- Check `stop_reason === "refusal"` before reading `content`.

### Cost estimate — per answer, cache warm

| Component | Tokens | Rate | Cost |
|---|---|---|---|
| Extraction input (Opus 5) | 1,500 | $5/MTok | $0.0075 |
| Extraction output | 250 | $25/MTok | $0.0063 |
| Generation system prefix, cached read | 4,000 | ~$0.50/MTok | $0.0020 |
| Retrieved claims + turn, uncached | 3,000 | $5/MTok | $0.0150 |
| Generation output | 600 | $25/MTok | $0.0150 |
| **Per answer** | | | **≈ $0.046** |
| **5-turn conversation** | | | **≈ $0.23** |

With extraction on `claude-haiku-4-5` the per-answer figure drops to ≈ $0.035.
These are estimates from list prices and assumed token counts — **re-baseline
with `messages.count_tokens()` against the real prompts before setting any
budget**, and read actual spend from `retrieval_trace.cost_micros`. A hard monthly
ceiling with a circuit breaker is specified in §11.3.

---

# §8 · Voice

Same conversation engine, same knowledge engine, same context. Voice is an
interface, not a second brain.

```
mic → VAD / turn detection → streaming STT → [the §7 pipeline] → streaming TTS → audio
                                   │                                    │
                              barge-in cancels ──────────────────────────┘
```

## §8.1 The parts that decide whether it works

| Concern | Design |
|---|---|
| **Latency** | ≤800 ms target, ≤1.2 s p95 from end-of-speech to first audio. Stream STT partials; begin retrieval on a stable partial; stream TTS from the first complete sentence. Beyond 1.2 s, an earcon — never silence |
| **Barge-in** | Speech onset cancels TTS playback *and* in-flight generation. Non-negotiable for a reference tool people interrupt |
| **Arabic dialect** | Choose STT with **Gulf/Khaliji** coverage, not MSA-only. MSA-only recognition of spoken Emirati Arabic degrades badly. Test with dialect samples before committing to a vendor — this is a vendor-selection gate, not a tuning task |
| **Code-switching** | UAE speakers mix English terms into Arabic sentences constantly ("الـ escrow", "NOC", "الـ off-plan"). Do not force one recognition language per utterance; keep the bilingual term map in the loop |
| **TTS pronunciation** | DLD, RERA, NOC, DEWA inside Arabic speech need a pronunciation lexicon or they are mangled |
| **Low confidence** | Below threshold, confirm rather than guess: *"Did you say Trakhees?"* Never act on a low-confidence jurisdiction or authority token — that is where a misrecognition becomes a wrong regulatory answer |
| **Answer length** | Spoken answers carry the direct answer plus one next step. Structure and sources go on screen. Never read a URL aloud |
| **Accessibility** | Voice is additive. Full transcript on screen, keyboard-operable controls, explicit mic permission |

## §8.2 Abstraction

`app/assistant/speech/` exposes `transcribe()` and `synthesize()` behind an
interface with a null implementation. Phase 5 ships the interface; phase 8 plugs
in vendors. This is what makes "voice if the services are ready, otherwise the
interface" a real plan rather than an intention.

---

# §9 · API and MCP boundary

## §9.1 Layering

```
Knowledge Engine (§4)  ← the only thing that reads storage
        │
   ┌────┴────┬──────────┬─────────┐
   ▼         ▼          ▼         ▼
 web UI  assistant   API v1     MCP
```

MCP wraps the **service layer**, never the database. The API and the assistant
answer from the same governed source, which is the entire point of the ecosystem
vision.

## §9.2 API v1 — read-only, versioned

```
GET /api/v1/knowledge/search      GET /api/v1/stages          GET /api/v1/activities
GET /api/v1/approvals             GET /api/v1/authorities     GET /api/v1/documents
GET /api/v1/groups                GET /api/v1/actors          GET /api/v1/roles
GET /api/v1/jurisdictions         GET /api/v1/terms           GET /api/v1/journeys
```

Required from the first public endpoint — every one of these was absent from V2:

- `/v1` in the path, with a written deprecation policy.
- API keys per consumer, scoped to public-approved knowledge only.
- Quotas and rate limits, `429` with `Retry-After`.
- Cursor pagination, `ETag` / `If-None-Match`, explicit cache headers.
- **Licence and attribution in every response envelope.** Third parties
  republishing UAE regulatory guidance sourced here is the point of the ecosystem
  vision *and* the main way its reputation gets damaged. Machine-readable terms
  and a required attribution string.
- **Status and provenance in every payload.** Never serve a claim without its
  status, effective date and source.
- OpenAPI document as a build artefact.

```json
{
  "data": { "...": "..." },
  "meta": { "status": "Validated", "lastVerified": "2026-07-14",
            "jurisdiction": "dubai-mainland" },
  "sources": [{ "authority": "…", "url": "…", "locator": "…", "effectiveFrom": "…" }],
  "licence": { "terms": "https://…/api-terms", "attribution": "Source: REOS — …" },
  "links": { "self": "…", "next": null }
}
```

## §9.3 MCP — designed for, not built now

Tools: `search_knowledge` · `get_stage` · `get_activity` · `get_approval` ·
`get_authority` · `get_group` · `get_role` · `get_journey` · `get_jurisdiction` ·
`resolve_term`.

Resources: canonical entity documents at stable URIs — `reos://stage/{id}`,
`reos://approval/{id}`, `reos://activity/{id}`.

Each tool needs a JSON Schema, a described error contract, and an auth story.
Same governance as the API: approved knowledge only, provenance in every payload,
no write surface.

## §9.4 AI-crawler discoverability

Cheap and currently absent. Structured data (typed markup for processes,
definitions, how-to steps) on every entity page; `llms.txt` pointing at canonical
entity documents; question-shaped titles on approval and document pages
(`Approval.questionTitle` exists in the schema for exactly this). **Fix the
`robots.ts` / `sitemap.ts` origin mismatch first** — until then, crawlers are
being pointed at a sitemap on the wrong host.

---

# §10 · Implementation phases

Each phase is independently useful and ends at a gate. The verification command
set (V3 PART 0.3) runs at every gate; `npm run build:sites` before
`node --test` or the tests assert stale output.

| Phase | Content | Effort | Depends on | Gate |
|---|---|---|---|---|
| **0** | Sign off D‑1…D‑4. Fix the `robots.ts`/`sitemap.ts` origin mismatch (2 lines, do it now) | days | — | Decisions dated in `DECISIONS.md` |
| **1** | **Schema.** `Activity`, `Approval`, `Role`, `Actor`, `Condition`, `Claim`, `Jurisdiction`, `Dependency`. Migrate per §3.3 steps 1–4. Build-time invariant checks (§3.4). No visual work | 1–2 weeks | 0 | `tsc` clean, 10 existing tests green, no fifth stage list |
| **2** | **Runtime foundation.** Provision Neon + Blob, enable `pgvector`, switch `drizzle.config.ts` to `postgresql`. Migrations. First route handlers. Admin auth + RBAC. Audit log | 2–3 weeks | 1, D‑1 | Deploys on Vercel; the ~169 static pages unaffected |
| **3** | **One complete vertical slice** — "develop a residential building in Dubai mainland": activities, approvals, documents, roles, conditions, every claim sourced and dated | **4–8 weeks, editorial-bound** | 1, 2 | A domain expert reads it end to end without hitting an unsourced gate |
| **4** | **Retrieval.** Passage generation, multilingual embeddings, filter + `tsvector` + `pgvector` + graph, planner, trace records. No LLM | 2–3 weeks | 3 | Retrieval recall@10 ≥ 0.90 on the golden set |
| **5** | **Assistant — text, English.** Context extraction, gates, answer contract, citations, typed refusal, actions, streaming, context bar. Speech abstraction with null impl | 3–4 weeks | 4 | All §10.1 thresholds |
| **6** | **Arabic text.** Overlay entries for new entities, cross-language retrieval, RTL, `/ar` twins | 2 weeks | 5 | Cross-language parity ≥ 0.85 of English recall |
| **7** | **Admin + gap engine.** Ingestion UI, review/approve workflow, verification dates and queue, gap dashboard | 3–4 weeks | 2, 5 | Round trip: upload → review → approve → retrievable → cited |
| **8** | **Voice.** Behind the phase-5 abstraction | 2–3 weeks | 5 | Latency and dialect targets (§8.1) |
| **9** | **API v1.** Read endpoints, auth, quotas, licensing, OpenAPI | 2 weeks | 4 | Contract tests + one real external consumer |
| **10** | **MCP.** Wrapping the service layer | 1–2 weeks | 9 | An external agent answers correctly, with provenance |

Engineering effort is roughly 20–26 weeks. **Phase 3 is the schedule risk and it
is not an engineering task** — see §12.

Do **not** build in V1: a graph database, the full API surface, a public MCP
server, agent-to-agent architecture, microservices, or a second datastore without
a measured reason.

## §10.1 Evaluation — the gate for phases 4–8

**Golden set:** ≥120 questions — ≥10 per published route, ≥30 Arabic, ≥20
deliberately unanswerable, ≥10 jurisdiction-ambiguous, ≥10 requiring a
`regulated-advice` refusal, ≥10 injection attempts. Each carries expected entity
ids, expected refusal type where applicable, and an expected citation set.

| Metric | Threshold | Why this number |
|---|---|---|
| Retrieval recall@10 on expected entity ids | ≥ 0.90 | Below this, generation quality is irrelevant |
| **Citation accuracy** | ≥ 0.98 | An uncited regulatory claim is the category-ending failure |
| **Groundedness** (no unsupported operative statements) | ≥ 0.98 | Same |
| Correct refusal on unanswerable questions | ≥ 0.95 | Given D‑3, refusing well *is* the product |
| Jurisdiction clarification when required | ≥ 0.95 | §7.3 correctness |
| Cross-language retrieval parity | ≥ 0.85 of English | Arabic is first-class |
| Injection resistance | 100% | §11.2 |
| p95 first token, text | ≤ 1.5 s | |
| p95 end-of-speech → first audio | ≤ 1.2 s | §8.1 |

Groundedness and citation accuracy are the two that matter. A confidently wrong
regulatory answer ends the platform's credibility; a slow one is an annoyance.

## §10.2 Two changes worth making this week

Independent of everything above, requiring no decision:

1. **Fix the origin mismatch** — make `app/robots.ts` derive its sitemap URL from
   `SITE_URL` instead of hardcoding a different host.
2. **Publish the four pending routes' journeys** or state the publication date on
   them. They are the visible edge of G11, and the assistant will inherit exactly
   the coverage the site has.

---

# §11 · Security threat model

## §11.1 Baseline

Admin authentication · RBAC with **author / reviewer / approver / admin as
distinct roles** (approval must not be self-service) · public–private document
classification · retrieval filtering by classification · API authentication and
rate limiting · audit log on every knowledge mutation and approval · signed
time-limited blob URLs · secret management · input validation · private documents
never reachable by public visitors.

## §11.2 Prompt injection — the primary attack surface

This system ingests **government PDFs and third-party web pages**. Indirect
injection through ingested content is the main risk, and V2 gave it one bullet.

- Retrieved content is **data, never instruction.** Wrapped in a delimited block,
  with the model told that nothing inside can change its instructions, tools or
  policies.
- Ingested text is screened for instruction-like patterns and **flagged for human
  review** rather than silently indexed.
- **No tool authority from content.** No retrieved document can cause a
  navigation, an API call, a link emission or a context mutation.
- **Output-side allowlist.** URLs in answers must resolve to known site routes or
  to source URLs already stored on the cited claim. Never echo a URL that first
  appeared inside retrieved text.
- HTML, script and zero-width characters stripped on ingest.
- Admin-uploaded documents are **also** untrusted. An authorised uploader is not
  a vouched document.
- Operator instructions travel as `{role: "system"}` messages, which is the
  non-spoofable channel — never as text inside a user turn that ingested content
  could imitate.
- A red-team fixture set runs in CI (≥10 cases, 100% pass, §10.1).

## §11.3 Abuse and cost

Per-IP and per-session rate limits · max turns per conversation · max tokens per
turn · request-size caps · **cost circuit breaker with a hard monthly ceiling**
read from `retrieval_trace.cost_micros` · STT minute caps per session.

---

# §12 · Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **Editorial capacity is the binding constraint.** ~400 activities × jurisdiction variants × sourced, re-verified claims is a sustained specialist workload. Every engineering finding here is fixable in weeks; this is the multi-year commitment and it determines whether the product exists | Highest | Depth-first, never breadth-first — phase 3 is one jurisdiction, one asset class, one route, fully sourced. A complete citable spine beats seven emirates at 20% |
| **Regulatory decay.** Fees, thresholds, portals and mandates change. A stale `blocks` edge someone sequenced a project on is credibility-ending — and dependency edges are precisely what cannot be spot-checked | Highest | Every `blocks` edge requires a sourced claim (§3.4). `review_due_by` drives a queue. Status is a retrieval filter and a user-facing filter. Verification count published (§9.2) |
| **Hallucinated regulation** | Highest | §7 gates, post-generation citation validation, typed refusal, CI eval gate |
| **Injection via ingested government documents** | High | §11.2 |
| **Regulated-activity exposure** — brokerage, legal, immigration | High | `regulated-advice` refusal; disclaimers strengthen as authority grows, never soften |
| **Audience collapse — has already happened once.** The consumer funnel out-competed the development model inside this codebase without a decision being made | High | D‑2 and the development-first decision written down; `phase1.ts` not indexed |
| **Cost runaway** from voice + hybrid retrieval per turn | Medium | Model tiering as a recorded decision, prompt caching, circuit breaker, per-answer cost in every trace |
| **Complexity outrunning comprehension.** A fully typed graph only its author can use | Medium | Complexity lives in the data; the context bar narrows it before anything is shown |
| **Arabic quality gap** — dialect STT, code-switching, review backlog | Medium | Dialect-capable vendor as a selection gate, bilingual term map, visible Arabic review notice |
| **Breaking a guarded invariant** during the build | Medium | §3.4 build checks plus the existing 10 tests at every gate; extend the suite, never weaken it |
| **Embedding model change forces a full re-index** | Low | `embedding_model` / `dims` / `embedded_at` recorded per row; treated as a migration |

---

# §13 · The architecture in one paragraph

A development-first knowledge graph for UAE property development, built on the
existing static site rather than replacing it. Actors — the 12 groups in four
clusters over a regulatory rail — play typed roles on activities; activities sit
in the existing 12-stage spine across four phases and six concurrent tracks;
activities consume and produce documents, are gated by approvals issued by
authorities, and connect through typed conditional dependencies that make "why am
I blocked" answerable. Every operative statement is a sourced, dated claim. The
visitor resolves jurisdiction and asset facts once in a persistent context bar,
then reads the same graph through whichever lens they occupy, in English or
Arabic, by text or voice. An assistant assembles paths across this graph, cites
at claim granularity, and is architecturally unable to assert anything the graph
does not carry — the same service layer later answering an API and an MCP server
so every channel speaks from one governed source.

> Knowledge → Intelligence → Guidance → Execution → Ecosystem

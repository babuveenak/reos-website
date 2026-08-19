/**
 * PHASE 1A SERVICE CONTRACTS
 *
 * Types only — no runtime, no provider, no network. Every service below is an
 * interface the UI codes against, so the LLM, speech, storage and retrieval
 * providers can be chosen later without touching a component.
 *
 * These shapes are deliberately narrower than the Phase 1 architecture in
 * docs/AI-PLATFORM-ARCHITECTURE.md: Activity, Approval, Condition and Claim
 * exist here as UI-facing types with no data behind them yet. When the schema
 * lands, these become views over it rather than a second model — which is why
 * ids are typed against the existing content model rather than as bare strings.
 */

import type { ContentStatus } from "../data/reos";
import type { Locale } from "../i18n/config";

/* ── identifiers, bound to the existing content model ───────────────────── */

/** A stage id from app/data/journey.ts — the canonical seven. */
export type StageId = string;
/** A route slug from app/data/routes.ts. This is the persona surface. */
export type RouteSlug = string;
/** A group number 1–12 from app/data/ecosystem.ts. */
export type GroupId = string;
/** An authority id from app/data/reos.ts. */
export type AuthorityId = string;

export type Phase = "Originate" | "Deliver" | "Own" | "Evolve";

/* ── jurisdiction ───────────────────────────────────────────────────────── */

/**
 * Emirate AND zone. Free-zone regulators define separate approval regimes, so
 * an emirate alone is not enough to answer a regulatory question correctly.
 * `zone: null` means unresolved — never "assume mainland".
 */
export type Jurisdiction = {
  emirate: "dubai" | "abu-dhabi" | "sharjah" | "ajman" | "rak" | "fujairah" | "uaq";
  zone: "mainland" | "free-zone" | "development-zone" | null;
  regime?: AuthorityId;
  label: string;
};

/* ── conversation state (frontend contract) ─────────────────────────────── */

export type Intent =
  | "learn"
  | "understand-process"
  | "understand-regulation"
  | "understand-document"
  | "understand-cost"
  | "understand-timeline"
  | "identify-authority"
  | "identify-responsibility"
  | "diagnose-blocker"
  | "compare"
  | "plan-sequence"
  | "navigate"
  | "verify-claim"
  | "product-enquiry"
  | "out-of-scope";

export type MessageRole = "visitor" | "assistant";

export type ConversationMessage = {
  id: string;
  role: MessageRole;
  text: string;
  /** Present on assistant messages. */
  response?: AIResponse;
  at: number;
};

/**
 * Frontend-only for Phase 1A. Nothing here is persisted server-side, and the
 * personal-data stance in docs/DECISIONS.md (D-4) keeps it session-scoped.
 * `schemaVersion` exists so this can be migrated rather than guessed at when
 * the backend frame lands.
 */
export type ConversationState = {
  schemaVersion: 1;
  sessionId: string;
  language: Locale;
  persona: RouteSlug | null;
  secondaryPersona: RouteSlug | null;
  /** Free-text as the visitor said it ("I live in India"). Not a jurisdiction. */
  location: string | null;
  jurisdiction: Jurisdiction | null;
  intent: Intent | null;
  /** Which route's journey the visitor appears to be on.
   *  NOTE: `AIResponse.journey` is a different shape — a `JourneyContext`
   *  describing where in the lifecycle the answer sits. Both names come from the
   *  brief, so they are kept rather than silently renamed; when reading a patch,
   *  `ConversationState.journey` is always the route slug. */
  journey: RouteSlug | null;
  lifecycleStage: StageId | null;
  /** Fields the assistant knows it does not know. Drives the next question. */
  unresolved: string[];
  messages: ConversationMessage[];
};

export function newConversation(language: Locale, sessionId: string): ConversationState {
  return {
    schemaVersion: 1,
    sessionId,
    language,
    persona: null,
    secondaryPersona: null,
    location: null,
    jurisdiction: null,
    intent: null,
    journey: null,
    lifecycleStage: null,
    unresolved: [],
    messages: [],
  };
}

/* ── sources and citations ──────────────────────────────────────────────── */

export type EpistemicType =
  | "legislative"
  | "regulatory-requirement"
  | "official-procedure"
  | "market-practice"
  | "professional-guidance"
  | "reos-interpretation";

/**
 * A citation. `lastVerified` is deliberately nullable and the UI renders
 * "not yet verified" when it is absent — a fabricated verification date is
 * worse than an honest gap, and Phase 1A has no verification pipeline.
 */
export type Source = {
  id: string;
  /** Authority name as published, e.g. "Dubai Land Department / RERA". */
  authority: string;
  authorityId?: AuthorityId;
  /** Document or page title. */
  title: string;
  /** Section or heading path within the document, when known. */
  locator?: string;
  url?: string;
  jurisdiction?: string;
  epistemicType: EpistemicType;
  effectiveFrom?: string;
  lastVerified: string | null;
  status: ContentStatus;
};

/* ── lifecycle / journey / activity view types ──────────────────────────── */

/** Narrows an answer to the cases it actually applies to. */
export type Condition = {
  label: string;
  value: string;
  /** True when the visitor has not supplied the fact this condition needs. */
  unresolved?: boolean;
};

export type ActivityView = {
  id: string;
  name: string;
  stageId: StageId;
  roles?: string[];
  inputs?: string[];
  outputs?: string[];
  status: ContentStatus;
};

export type ApprovalView = {
  id: string;
  name: string;
  authority: string;
  authorityId?: AuthorityId;
  unlocks?: string;
  status: ContentStatus;
};

/** Where the visitor is, and what runs alongside it. */
export type JourneyContext = {
  routeSlug: RouteSlug | null;
  routeTitle: string | null;
  stageId: StageId | null;
  stageName: string | null;
  stageNumber: number | null;
  phase: Phase | null;
  /** Stage names that run at the same time. Order is not sequence. */
  concurrentWith: string[];
  nextStep: string | null;
};

/* ── assistant request / response ───────────────────────────────────────── */

export type AIRequest = {
  question: string;
  language: Locale;
  /** The conversation so far. The visitor must never repeat themselves. */
  state: ConversationState;
};

export type RefusalType =
  | "not-in-corpus"
  | "jurisdiction-unresolved"
  | "status-insufficient"
  | "claim-expired"
  | "out-of-scope"
  | "regulated-advice";

export type NavigationAction = {
  kind: "navigate" | "open-stage" | "open-route";
  /** A path that must exist in routes.ts or the sitemap. Validated before use. */
  path: string;
  label: string;
};

/** Education first. Only ever present when intent is `product-enquiry`. */
export type ProductAction = {
  kind: "learn-more" | "book-demo";
  path: string;
  label: string;
};

export type SuggestedQuestion = {
  text: string;
  /** Where this suggestion came from, so the UI can group them. */
  origin: "route" | "stage" | "term" | "follow-up";
  path?: string;
};

export type AIResponse = {
  answer: string;
  language: Locale;
  persona: RouteSlug | null;
  intent: Intent | null;
  /** Where in the lifecycle this answer sits. Not the same field as
   *  `ConversationState.journey`, which is a route slug — see the note there. */
  journey: JourneyContext | null;
  confidence: "high" | "medium" | "low";
  /** Set when the assistant declines. `answer` then explains the route out. */
  refusal: RefusalType | null;
  sources: Source[];
  conditions: Condition[];
  activities: ActivityView[];
  approvals: ApprovalView[];
  suggestedQuestions: SuggestedQuestion[];
  navigationActions: NavigationAction[];
  productAction: ProductAction | null;
  /** Honest label for the answer itself. Mock answers are `Illustrative`. */
  status: ContentStatus;
  /** Patch to merge into conversation state. */
  statePatch: Partial<ConversationState>;
};

/* ── services ───────────────────────────────────────────────────────────── */

export interface AIService {
  readonly name: string;
  ask(request: AIRequest): Promise<AIResponse>;
}

export interface KnowledgeService {
  search(query: string, locale: Locale): Promise<{ id: string; title: string; path: string; status: ContentStatus }[]>;
}

export interface JourneyService {
  stages(locale: Locale): { id: StageId; number: number; name: string; phase: Phase }[];
  context(stageId: StageId, locale: Locale): JourneyContext | null;
}

export interface StakeholderService {
  groups(locale: Locale): { id: GroupId; number: number; name: string }[];
  routes(locale: Locale): { slug: RouteSlug; title: string; ctaLabel: string }[];
}

export interface SourceService {
  forEntity(entityType: string, entityId: string): Promise<Source[]>;
}

export interface DocumentService {
  list(filter: DocumentFilter): Promise<DocumentRecord[]>;
}

export type DocumentFilter = {
  query?: string;
  status?: ContentStatus | "all";
  language?: Locale | "all";
  routeSlug?: RouteSlug | "all";
  stageId?: StageId | "all";
  authorityId?: AuthorityId | "all";
};

export type DocumentRecord = {
  id: string;
  title: string;
  kind: "regulation" | "official-procedure" | "research" | "authority-page" | "internal";
  authority?: string;
  jurisdiction?: string;
  language: Locale;
  routeSlugs: RouteSlug[];
  stageIds: StageId[];
  status: ContentStatus;
  lastVerified: string | null;
};

/* ── knowledge gaps ─────────────────────────────────────────────────────── */

export type KnowledgeGap = {
  id: string;
  question: string;
  occurrences: number;
  /** Why the assistant could not answer. */
  refusal: RefusalType;
  detectedRoute: RouteSlug | null;
  detectedStage: StageId | null;
  gapStatus: "needs-review" | "in-progress" | "resolved";
};

/* ── voice ──────────────────────────────────────────────────────────────── */

export type VoiceState = "idle" | "listening" | "processing" | "responding" | "error";

export type VoiceEvent =
  | { type: "state"; state: VoiceState }
  | { type: "partial"; transcript: string }
  | { type: "final"; transcript: string }
  | { type: "error"; message: string };

/**
 * Speech abstraction. Phase 1A ships a mock; a real STT/TTS vendor plugs in
 * behind this without the UI changing. Arabic dialect coverage and barge-in are
 * vendor-selection criteria recorded in the architecture, not implemented here.
 */
export interface VoiceProvider {
  readonly name: string;
  /** False for the mock, and when the browser lacks the APIs. */
  readonly isRealProvider: boolean;
  supports(language: Locale): boolean;
  subscribe(listener: (event: VoiceEvent) => void): () => void;
  startListening(language: Locale): Promise<void>;
  stopListening(): Promise<void>;
  cancelListening(): void;
  getTranscript(): string;
  speak(text: string, language: Locale): Promise<void>;
  stopSpeaking(): void;
}

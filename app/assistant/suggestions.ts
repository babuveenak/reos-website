/**
 * SUGGESTED QUESTIONS, DERIVED FROM CONTENT
 *
 * Pure functions over a KnowledgeSnapshot, so the same implementation runs on
 * the server (initial render) and in the client (follow-ups after an answer)
 * without a second copy.
 *
 * Two deliberate rules:
 *
 *  - Generated from the content model, never hard-coded, so a renamed route or
 *    a new stage cannot leave a stale suggestion behind, and every suggestion
 *    resolves to a page that exists.
 *  - Only routes with published content are suggested. A suggested question the
 *    assistant cannot answer is worse than no suggestion, and 5 of the 12
 *    routes have no written journey yet.
 */

import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import type { SuggestedQuestion } from "./contracts";
import type { KnowledgeSnapshot } from "./snapshot";

const L = (locale: Locale, path: string) => (locale === DEFAULT_LOCALE ? path : `/ar${path}`);

const PHRASE: Record<Locale, {
  route: (title: string) => string;
  stage: (name: string) => string;
  concurrency: (name: string) => string;
  ecosystem: string;
}> = {
  en: {
    route: (title) => `${title} — where do I start?`,
    stage: (name) => `What happens during ${name}?`,
    // Phrased to invite the concurrency answer rather than a sequence.
    concurrency: (name) => `What runs at the same time as ${name}?`,
    ecosystem: "Who are the stakeholders involved?",
  },
  ar: {
    route: (title) => `${title} — من أين أبدأ؟`,
    stage: (name) => `ما الذي يحدث في مرحلة ${name}؟`,
    concurrency: (name) => `ما الذي يجري بالتوازي مع ${name}؟`,
    ecosystem: "من هم أصحاب المصلحة المشاركون؟",
  },
};

/**
 * The opening set: the routes people actually arrive for, plus one concurrency
 * question — because concurrency is the thing this site teaches that the rest
 * of the market does not.
 */
export function homepageSuggestions(snapshot: KnowledgeSnapshot): SuggestedQuestion[] {
  const locale = snapshot.locale;
  const p = PHRASE[locale] ?? PHRASE.en;

  const lead = snapshot.routes
    .filter((r) => r.hasContent && r.tier <= 2)
    .slice(0, 3)
    .map<SuggestedQuestion>((r) => ({
      text: p.route(r.title),
      origin: "route",
      path: L(locale, `/intelligence/guides/${r.slug}`),
    }));

  const extras: SuggestedQuestion[] = [];
  const concurrent = snapshot.stages.find((s) => s.runsWithNames.length > 0);
  if (concurrent) {
    extras.push({ text: p.concurrency(concurrent.name), origin: "stage", path: L(locale, `/property-journey/${concurrent.id}`) });
  }
  extras.push({ text: p.ecosystem, origin: "route", path: L(locale, "/ecosystem") });

  return [...lead, ...extras].slice(0, 5);
}

/** Follow-ups scoped to a stage and its neighbours. */
export function stageSuggestions(snapshot: KnowledgeSnapshot, stageId: string): SuggestedQuestion[] {
  const locale = snapshot.locale;
  const p = PHRASE[locale] ?? PHRASE.en;
  const stage = snapshot.stages.find((s) => s.id === stageId);
  if (!stage) return homepageSuggestions(snapshot);

  const out: SuggestedQuestion[] = [
    { text: p.stage(stage.name), origin: "stage", path: L(locale, `/property-journey/${stage.id}`) },
  ];
  if (stage.runsWithNames.length > 0) {
    out.push({ text: p.concurrency(stage.name), origin: "stage", path: L(locale, `/property-journey/${stage.id}`) });
  }
  const next = snapshot.stages.find((s) => s.number === stage.number + 1);
  if (next) {
    out.push({ text: p.stage(next.name), origin: "follow-up", path: L(locale, `/property-journey/${next.id}`) });
  }
  return out;
}

/**
 * THE ASSISTANT PAGE'S OPENING SET.
 *
 * Editorial rather than generated — and that is a deliberate exception to the
 * rule at the top of this file, taken for one reason: the derived shapes
 * ("what happens during X") read like a site explaining itself, and this page
 * has to read like an intelligence tool being interrogated.
 *
 * The rule the generated set exists to protect is not "never write a question
 * down", it is "never offer a question the assistant cannot answer". That is
 * enforced directly: tests/assistant-interaction.test.mjs walks these chips on
 * both /assistant and /ar/assistant, clicks each one, and fails if any answer
 * comes back as not-in-corpus. Two earlier candidates were cut by exactly that
 * check — questions about approvals and documents at a named stage, which the
 * corpus holds but the mock has no answer shape for yet.
 *
 * Each entry is phrased so the resolver can place it: it names a stage, a role
 * or a mechanism the content model already knows.
 */
const ASSISTANT_OPENERS: Record<Locale, { text: string; path: string }[]> = {
  en: [
    { text: "How do I verify an off-plan property before signing?", path: "/property-journey/sales-transfer" },
    { text: "Why can't construction start yet?", path: "/property-journey/authorities-approvals" },
    { text: "When is the title deed issued and who is involved?", path: "/property-journey/sales-transfer" },
    { text: "Who controls the escrow account and when is it released?", path: "/property-journey/sales-transfer" },
    { text: "Which stakeholders are involved in handover?", path: "/property-journey/living-operations" },
    { text: "What risks should an investor check before committing?", path: "/property-journey/asset-growth-intelligence" },
  ],
  ar: [
    { text: "كيف أتحقق من عقار على المخطط قبل التوقيع؟", path: "/property-journey/sales-transfer" },
    { text: "لماذا لا أستطيع البدء في الإنشاء؟", path: "/property-journey/authorities-approvals" },
    { text: "متى يُصدر سند الملكية ومن يشارك في ذلك؟", path: "/property-journey/sales-transfer" },
    { text: "من يتحكم في حساب الضمان ومتى يُفرج عن الأموال؟", path: "/property-journey/sales-transfer" },
    { text: "من هم أصحاب المصلحة المشاركون في التسليم؟", path: "/property-journey/living-operations" },
    { text: "ما المخاطر التي ينبغي أن يتحقق منها المستثمر قبل الالتزام؟", path: "/property-journey/asset-growth-intelligence" },
  ],
};

export function assistantSuggestions(snapshot: KnowledgeSnapshot): SuggestedQuestion[] {
  const locale = snapshot.locale;
  return (ASSISTANT_OPENERS[locale] ?? ASSISTANT_OPENERS.en).map((q) => ({
    text: q.text,
    origin: "stage" as const,
    path: L(locale, q.path),
  }));
}

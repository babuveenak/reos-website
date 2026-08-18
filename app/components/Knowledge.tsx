/**
 * KNOWLEDGE PRESENTATION COMPONENTS
 *
 * Pure presentation, no state, no client hooks — so the same markup renders on
 * the server (the worked-example transcript on /assistant, which is what makes
 * the mock testable in the HTML harness) and inside the client conversation.
 *
 * Everything here is driven by the Phase 1A contracts. Where the backend does
 * not exist yet — activities, approvals, conditions — the component renders
 * nothing rather than a placeholder, so an empty section never reads as a real
 * finding of "none".
 */

import Link from "next/link";
import type {
  ActivityView,
  AIResponse,
  ApprovalView,
  Condition,
  JourneyContext,
  ProductAction,
  Source,
  SuggestedQuestion,
} from "../assistant/contracts";
import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import { getDict } from "../i18n/dictionary";
import { StatusTag } from "./SiteShell";

/* ── sources ─────────────────────────────────────────────────────────────── */

export function SourceList({ sources, locale = DEFAULT_LOCALE }: { sources: Source[]; locale?: Locale }) {
  if (sources.length === 0) return null;
  const d = getDict(locale).assistant;
  return (
    <section className="ai-sources" aria-label={d.sourcesLabel}>
      <h3>{d.sourcesLabel}</h3>
      <ul>
        {sources.map((source) => (
          <li key={source.id}>
            <div className="ai-source-head">
              <b>{source.authority}</b>
              <StatusTag status={source.status} locale={locale} />
            </div>
            <p className="ai-source-title">{source.title}</p>
            <dl>
              {source.jurisdiction && (
                <div><dt>{d.jurisdictionLabel}</dt><dd>{source.jurisdiction}</dd></div>
              )}
              {source.locator && (
                <div><dt>{d.sectionLabel}</dt><dd>{source.locator}</dd></div>
              )}
              <div>
                <dt>{d.lastVerifiedLabel}</dt>
                {/* Never invent a date. An honest gap is the credibility signal. */}
                <dd>{source.lastVerified ?? <em>{d.notVerified}</em>}</dd>
              </div>
            </dl>
            {source.url && (
              <a className="ai-source-link" href={source.url} target="_blank" rel="noopener noreferrer">
                {d.openSource} <span aria-hidden="true">↗</span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── conditions — what the answer is narrowed to ─────────────────────────── */

export function ConditionList({ conditions, locale = DEFAULT_LOCALE }: { conditions: Condition[]; locale?: Locale }) {
  if (conditions.length === 0) return null;
  const d = getDict(locale).assistant;
  return (
    <section className="ai-conditions" aria-label={d.conditionsLabel}>
      <h3>{d.conditionsLabel}</h3>
      <ul>
        {conditions.map((condition) => (
          <li key={condition.label} className={condition.unresolved ? "is-unresolved" : undefined}>
            <span>{condition.label}</span>
            <b>{condition.value}</b>
            {condition.unresolved && <small>{d.unresolvedNote}</small>}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── journey context — where you are, and what runs alongside ────────────── */

export function JourneyTrail({ journey, locale = DEFAULT_LOCALE }: { journey: JourneyContext; locale?: Locale }) {
  const d = getDict(locale).assistant;
  return (
    <section className="ai-journey" aria-label={d.whereYouAre}>
      <h3>{d.whereYouAre}</h3>
      <ol className="ai-trail">
        {journey.routeTitle && <li><span>{d.stakeholderLabel}</span><b>{journey.routeTitle}</b></li>}
        {journey.phase && <li><span>{d.phaseLabel}</span><b>{d.phaseName[journey.phase]}</b></li>}
        {journey.stageName && (
          <li>
            <span>{d.stageLabel}</span>
            <b>{journey.stageNumber ? `${String(journey.stageNumber).padStart(2, "0")} · ` : ""}{journey.stageName}</b>
          </li>
        )}
      </ol>
      {/* Order is not sequence. If a stage runs alongside others, say so. */}
      {journey.concurrentWith.length > 0 && (
        <p className="ai-concurrent">
          <b>{d.runsWithLabel}</b> {journey.concurrentWith.join(" · ")}
        </p>
      )}
      {journey.nextStep && (
        <p className="ai-nextstep"><b>{d.nextStepLabel}</b> {journey.nextStep}</p>
      )}
    </section>
  );
}

/* ── activity / approval — contracts present, data pending ───────────────── */

export function ActivityList({ activities, locale = DEFAULT_LOCALE }: { activities: ActivityView[]; locale?: Locale }) {
  if (activities.length === 0) return null;
  const d = getDict(locale).assistant;
  return (
    <section className="ai-activities" aria-label={d.activitiesLabel}>
      <h3>{d.activitiesLabel}</h3>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id}>
            <div className="ai-source-head"><b>{activity.name}</b><StatusTag status={activity.status} locale={locale} /></div>
            {activity.roles && activity.roles.length > 0 && <p><span>{d.rolesLabel}</span> {activity.roles.join(", ")}</p>}
            {activity.inputs && activity.inputs.length > 0 && <p><span>{d.inputsLabel}</span> {activity.inputs.join(", ")}</p>}
            {activity.outputs && activity.outputs.length > 0 && <p><span>{d.outputsLabel}</span> {activity.outputs.join(", ")}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ApprovalList({ approvals, locale = DEFAULT_LOCALE }: { approvals: ApprovalView[]; locale?: Locale }) {
  if (approvals.length === 0) return null;
  const d = getDict(locale).assistant;
  return (
    <section className="ai-approvals" aria-label={d.approvalsLabel}>
      <h3>{d.approvalsLabel}</h3>
      <ul>
        {approvals.map((approval) => (
          <li key={approval.id}>
            <div className="ai-source-head"><b>{approval.name}</b><StatusTag status={approval.status} locale={locale} /></div>
            <p><span>{d.issuedByLabel}</span> {approval.authority}</p>
            {approval.unlocks && <p><span>{d.unlocksLabel}</span> {approval.unlocks}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── follow-ups and actions ──────────────────────────────────────────────── */

export function NextQuestions({
  questions,
  locale = DEFAULT_LOCALE,
  onAsk,
}: {
  questions: SuggestedQuestion[];
  locale?: Locale;
  /** Omitted on the server: the suggestions render as links instead of buttons. */
  onAsk?: (question: string) => void;
}) {
  if (questions.length === 0) return null;
  const d = getDict(locale).assistant;
  return (
    <section className="ai-next" aria-label={d.nextLabel}>
      <h3>{d.nextLabel}</h3>
      <ul>
        {questions.map((question) => (
          <li key={question.text}>
            {onAsk ? (
              <button type="button" className="ai-chip" onClick={() => onAsk(question.text)}>
                {question.text}
              </button>
            ) : question.path ? (
              <Link className="ai-chip" href={question.path}>{question.text}</Link>
            ) : (
              <span className="ai-chip is-static">{question.text}</span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/**
 * Product actions. Education first: this renders only when the response carries
 * one, and the mock only ever emits it for `product-enquiry` intent.
 *
 * Note the mock deliberately emits `learn-more` (→ /platform) and never
 * `book-demo` (→ /demo). A test asserts /demo is linked from no page except
 * /platform, and a server-rendered demo link would break it. The contract and
 * this component support both; the decision about when a demo link is
 * appropriate belongs with the product owner, not the mock.
 */
export function ProductActions({ action }: { action: ProductAction | null }) {
  if (!action) return null;
  return (
    <p className="ai-product">
      <Link className="button ghost" href={action.path}>{action.label}</Link>
    </p>
  );
}

/* ── the whole answer ────────────────────────────────────────────────────── */

export function AnswerCard({
  response,
  locale = DEFAULT_LOCALE,
  onAsk,
}: {
  response: AIResponse;
  locale?: Locale;
  onAsk?: (question: string) => void;
}) {
  const d = getDict(locale).assistant;
  return (
    <article className={`ai-answer${response.refusal ? " is-refusal" : ""}`}>
      <header className="ai-answer-head">
        <span className="ai-who">{d.assistantName}</span>
        <StatusTag status={response.status} locale={locale} />
        <span className="ai-confidence">{d.confidenceLabel}: {d.confidence[response.confidence]}</span>
      </header>

      <p className="ai-answer-text">{response.answer}</p>

      {response.journey && <JourneyTrail journey={response.journey} locale={locale} />}
      <ConditionList conditions={response.conditions} locale={locale} />
      <ActivityList activities={response.activities} locale={locale} />
      <ApprovalList approvals={response.approvals} locale={locale} />
      <SourceList sources={response.sources} locale={locale} />

      {response.navigationActions.length > 0 && (
        <p className="ai-actions">
          {response.navigationActions.map((action) => (
            <Link key={action.path + action.label} className="ai-chip is-action" href={action.path}>
              {action.label} <span aria-hidden="true">→</span>
            </Link>
          ))}
        </p>
      )}

      <NextQuestions questions={response.suggestedQuestions} locale={locale} onAsk={onAsk} />
      <ProductActions action={response.productAction} />
    </article>
  );
}

/** The visitor's own turn. */
export function VisitorTurn({ text, locale = DEFAULT_LOCALE }: { text: string; locale?: Locale }) {
  const d = getDict(locale).assistant;
  return (
    <article className="ai-visitor">
      <span className="ai-who">{d.you}</span>
      <p>{text}</p>
    </article>
  );
}

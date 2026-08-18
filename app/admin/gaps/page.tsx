import type { Metadata } from "next";
import Link from "next/link";
import { Page, SectionIntro, StatusTag } from "../../components/SiteShell";
import type { KnowledgeGap } from "../../assistant/contracts";
import { DEFAULT_LOCALE } from "../../i18n/config";

/**
 * KNOWLEDGE GAP DASHBOARD — UI skeleton.
 *
 * The loop this closes: every question the assistant cannot answer writes a gap
 * record, gaps are clustered by frequency and context, and the queue becomes the
 * editorial roadmap. The assistant's failures are the content plan.
 *
 * There are no real gaps to show. The assistant has taken no traffic, and no
 * traffic means no occurrence counts — so rather than invent "23 occurrences",
 * this page shows the empty state plus one row explicitly labelled Illustrative
 * so the shape of a record is visible to whoever builds phase 7.
 */
export const metadata: Metadata = {
  title: "Knowledge Gaps | REOS",
  robots: { index: false, follow: false },
};

/** Shape demonstration only — labelled Illustrative on screen. */
const SHAPE_EXAMPLE: KnowledgeGap = {
  id: "example",
  question: "What approval is required before piling can start?",
  occurrences: 0,
  refusal: "not-in-corpus",
  detectedRoute: "developing",
  detectedStage: "design-approvals",
  gapStatus: "needs-review",
};

const REFUSAL_MEANING: Record<KnowledgeGap["refusal"], string> = {
  "not-in-corpus": "No sourced claim covered the question. Author one.",
  "jurisdiction-unresolved": "The visitor did not resolve emirate and zone, and the answer branches on it.",
  "status-insufficient": "Content exists but is not Validated, so it could not be grounded on.",
  "claim-expired": "The best claim is past its review window or superseded.",
  "out-of-scope": "Not UAE property development. No action needed.",
  "regulated-advice": "Correctly declined. No content gap — this is the liability boundary working.",
};

export default function GapsPage() {
  return (
    <Page className="admin-page" locale={DEFAULT_LOCALE} dock={false}>
      <section className="inner-hero">
        <span className="eyebrow">INTERNAL · PHASE 1A SKELETON</span>
        <h1>Knowledge gaps.</h1>
        <p>
          Unanswered questions, low-confidence answers and stale sources, ranked
          by how often visitors hit them. This is the queue that turns the
          assistant&rsquo;s failures into the content roadmap.
        </p>
        <p className="assistant-more">
          <Link className="ai-chip is-action" href="/admin">Repository →</Link>
        </p>
      </section>

      <section className="section-pad">
        <SectionIntro
          label="QUEUE"
          title="No gaps recorded yet."
          copy="Gap records are written when the assistant declines to answer. It has taken no traffic, so there are none — and an occurrence count invented to fill this table would be the first fabricated number in the system. The row below shows the record shape and is labelled accordingly."
        />

        <div className="admin-tablewrap">
          <table className="admin-table">
            <caption className="visually-hidden">Knowledge gap records</caption>
            <thead>
              <tr>
                <th scope="col">Question</th>
                <th scope="col">Occurrences</th>
                <th scope="col">Why it failed</th>
                <th scope="col">Route</th>
                <th scope="col">Stage</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{SHAPE_EXAMPLE.question} <StatusTag status="Illustrative" locale={DEFAULT_LOCALE} /></td>
                <td>{SHAPE_EXAMPLE.occurrences}</td>
                <td><code>{SHAPE_EXAMPLE.refusal}</code></td>
                <td>{SHAPE_EXAMPLE.detectedRoute}</td>
                <td>{SHAPE_EXAMPLE.detectedStage}</td>
                <td>{SHAPE_EXAMPLE.gapStatus}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="section-pad">
        <SectionIntro
          label="REFUSAL TYPES"
          title="Not every refusal is a gap."
          copy="Two of these are the system working correctly rather than a hole to fill. Collapsing them into one 'unanswered' bucket would push editorial effort at the wrong problems."
        />
        <dl className="gap-legend">
          {(Object.keys(REFUSAL_MEANING) as KnowledgeGap["refusal"][]).map((type) => (
            <div key={type}>
              <dt><code>{type}</code></dt>
              <dd>{REFUSAL_MEANING[type]}</dd>
            </div>
          ))}
        </dl>
      </section>
    </Page>
  );
}

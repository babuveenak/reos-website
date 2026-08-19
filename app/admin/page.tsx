import type { Metadata } from "next";
import Link from "next/link";
import { AdminBrowser } from "../components/AdminBrowser";
import { Page, SectionIntro } from "../components/SiteShell";
import type { DocumentRecord } from "../assistant/contracts";
import { authorities, lifecycleStages } from "../data/reos";
import { stages } from "../data/journey";
import { DEFAULT_LOCALE } from "../i18n/config";

/**
 * ADMIN SKELETON — internal surface.
 *
 * English-only and excluded from the sitemap and from robots (see app/robots.ts).
 * The "every route needs an /ar twin" rule exists so visitor-facing content
 * cannot silently lose Arabic; an internal tool is not visitor-facing, and
 * translating a skeleton whose shape will change in phase 7 would be waste.
 * Revisit when the admin is real and has actual operators.
 *
 * Records are derived from the real content model. Nothing is invented: the
 * seven stages and eleven authorities below are the repository as it stands.
 */
export const metadata: Metadata = {
  title: "Knowledge Administration | REOS",
  robots: { index: false, follow: false },
};

function records(): DocumentRecord[] {
  const stageRecords: DocumentRecord[] = stages.map((stage) => ({
    id: `stage-${stage.id}`,
    title: stage.name,
    kind: "internal",
    jurisdiction: stage.jurisdiction ? "jurisdiction note present" : undefined,
    language: "en",
    routeSlugs: [],
    stageIds: [stage.id],
    status: stage.status,
    lastVerified: null,
  }));

  const authorityRecords: DocumentRecord[] = authorities.map((authority) => ({
    id: `authority-${authority.id}`,
    title: authority.name,
    kind: "authority-page",
    authority: authority.name,
    jurisdiction: authority.jurisdiction,
    language: "en",
    routeSlugs: [],
    stageIds: authority.stageIds ?? [],
    status: authority.status,
    lastVerified: null,
  }));

  return [...stageRecords, ...authorityRecords];
}

export default function AdminPage() {
  const stageList = stages.map((s) => ({ id: s.id, name: s.name }));
  return (
    <Page className="admin-page" locale={DEFAULT_LOCALE} dock={false}>
      <section className="inner-hero">
        <span className="eyebrow">INTERNAL · PHASE 1A SKELETON</span>
        <h1>Knowledge administration.</h1>
        <p>
          The browse, filter and status surface for the knowledge repository.
          Read-only: there is no storage engine, no authentication and no write
          path yet. {lifecycleStages.length} detail stages and {authorities.length} authorities
          are modelled today.
        </p>
        <p className="assistant-more">
          <Link className="ai-chip is-action" href="/admin/gaps">Knowledge gaps →</Link>
        </p>
      </section>

      <section className="section-pad">
        <SectionIntro
          label="REPOSITORY"
          title="What the repository holds today."
          copy="Every row below comes from the typed content model. Documents, claims, activities and approvals are not here because they do not exist yet — the schema for them is specified in docs/AI-PLATFORM-ARCHITECTURE.md and lands in phase 1."
        />
        <AdminBrowser records={records()} stages={stageList} authorities={authorities.map((a) => ({ id: a.id, name: a.name }))} />
      </section>
    </Page>
  );
}

import { getStages, getPersonas } from "../../i18n/content";
import { DEFAULT_LOCALE, localePath, type Locale } from "../../i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, StatusTag } from "../../components/SiteShell";
import { Assistant } from "../../components/Assistant";
import { buildSnapshot } from "../../assistant/snapshot";
import { getDict } from "../../i18n/dictionary";
import { withTerms } from "../../components/Term";
import { groupById } from "../../data/ecosystem";
import { stageById, stages } from "../../data/journey";
import { relationshipLevelLabels, relationshipsByStage } from "../../data/relationships";
import { RouteGovernance } from "../../components/Governance";
import { LandVisionGuide } from "../../components/LandVisionGuide";

import { stageById as detailById } from "../../data/reos";

type Props = { params: Promise<{ stage: string }> };

export function generateStaticParams() {
  return stages.map((stage) => ({ stage: stage.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stage: slug } = await params;
  const stage = stageById[slug];
  if (!stage) return {};
  return {
    title: `${stage.name} — UAE Property Journey | REOS`,
    description: stage.summary,
  };
}

export async function View({ params, locale = DEFAULT_LOCALE }: Props & { locale?: Locale }) {
  const { stage: slug } = await params;
  const all = getStages(locale);
  const stage = all.find((s) => s.id === slug);
  if (!stage) notFound();

  const previous = all[stage.number - 2];
  const next = all[stage.number];
  const parallel = stage.runsWith.map((id) => all.find((s) => s.id === id)).filter(Boolean) as typeof all;
  const details = stage.detailStageIds.map((id) => detailById[id]).filter(Boolean);
  const relevantPersonas = getPersonas(locale).filter((p) => p.steps.some((s) => s.stageId === stage.id));
  const stageRelationships = relationshipsByStage(stage.id);
  const d = getDict(locale);
  const L = (path: string) => localePath(locale, path);

  return <Page className="inner-page stage-page" locale={locale}>
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link href="/property-journey">Property journey</Link>
      <span aria-hidden="true">/</span>
      <b>{stage.name}</b>
    </nav>

    <section className="stage-hero">
      <div className="stage-hero-number">{String(stage.number).padStart(2, "0")}</div>
      <div>
        <span className="eyebrow">{stage.track.toUpperCase()} · STAGE {stage.number} OF {all.length}</span>
        <h1>{stage.name}</h1>
        <p>{stage.summary}</p>
        <StatusTag status={stage.status} />
      </div>
    </section>

    {parallel.length > 0 && (
      <section className="parallel-note">
        <b>This stage does not wait its turn.</b>
        <p>
          It runs at the same time as {parallel.map((s, i) => (
            <span key={s.id}>{i > 0 && (i === parallel.length - 1 ? " and " : ", ")}<Link href={`/property-journey/${s.id}`}>{s.name}</Link></span>
          ))}. Treating these as a sequence is one of the most common misunderstandings of UAE development.
        </p>
      </section>
    )}

    <section className="at-a-glance" aria-label="Stage summary">
      <div>
        <small>Participants</small>
        <div className="chip-row">{stage.groupIds.map((id) => <span key={id}>{groupById[id]?.short}</span>)}</div>
      </div>
      <div>
        <small>Documents</small>
        <div className="chip-row">{stage.documents.slice(0, 3).map((d) => <span key={d}>{d}</span>)}</div>
      </div>
      <div>
        <small>Most common failure</small>
        <p>{stage.risks[0]}</p>
      </div>
      <div>
        <small>{next ? "Next gate" : "Ends the journey"}</small>
        <p>{next ? next.name : "Succession, refinancing or a new cycle."}</p>
      </div>
    </section>

    {stage.id === "land-vision" && (
      <LandVisionGuide
        locale={locale}
        salesTransferHref={L("/property-journey/sales-transfer")}
      />
    )}

    <section className="section-pad stage-body">
      <article className="stage-main">
        <h2>What happens</h2>
        <ol className="numbered-list">
          {stage.whatHappens.map((item) => <li key={item}>{withTerms(item)}</li>)}
        </ol>

        <h2>What can go wrong</h2>
        <ul className="risk-list">
          {stage.risks.map((item) => <li key={item}>{item}</li>)}
        </ul>

        <div className="jurisdiction-note">
          <b>Where you are changes the answer</b>
          <p>{withTerms(stage.jurisdiction)}</p>
        </div>

        <div className="next-step">
          <small>PRACTICAL NEXT STEP</small>
          <p>{stage.nextStep}</p>
        </div>
      </article>

      <aside className="stage-aside">
        <div className="aside-block">
          <small>Who is involved</small>
          <ul className="link-list">
            {stage.groupIds.map((id) => (
              <li key={id}><Link href={`/stakeholders/${id}`}>{groupById[id]?.name}</Link></li>
            ))}
          </ul>
        </div>

        <div className="aside-block">
          <small>Documents in play</small>
          <ul className="plain-list">
            {stage.documents.map((doc) => <li key={doc}>{doc}</li>)}
          </ul>
        </div>

        {relevantPersonas.length > 0 && (
          <div className="aside-block">
            <small>Whose journey passes through here</small>
            <ul className="link-list">
              {relevantPersonas.map((p) => (
                <li key={p.slug}><Link href={`/intelligence/guides/${p.slug}`}>{p.name}</Link></li>
              ))}
            </ul>
          </div>
        )}

        {details.length > 0 && stage.id !== "land-vision" && (
          <div className="aside-block">
            <small>Detailed activities</small>
            <ul className="link-list">
              {details.map((d) => (
                <li key={d.id}><Link href={`/lifecycle/${d.id}`}>{d.name}</Link></li>
              ))}
            </ul>
          </div>
        )}
      </aside>
    </section>

    <section className="stage-relationship-section section-pad">
      <div className="timeline-header">
        <span>{String(stage.number).padStart(2, "0")}</span>
        <h2>Stakeholders<br /><em>in this stage.</em></h2>
      </div>
      <p className="rail-callout">Select a relationship to see how the group participates, what it controls, and which processes, documents and dependencies are involved.</p>
      <div className="stage-relationship-cards">
        {stageRelationships.map((relationship) => {
          const group = groupById[relationship.stakeholderId];
          return <Link href={L(relationship.detailRoute)} key={relationship.id}>
            <span>{String(group.number).padStart(2, "0")}</span>
            <div><small>{relationshipLevelLabels[relationship.relationshipLevel]}</small><b>{group.name}</b><p>{relationship.role}</p></div>
            <i aria-hidden="true">↗</i>
          </Link>;
        })}
      </div>
      <Link className="text-link" href={L(`/ecosystem?view=journey&stage=${stage.id}`)}>Open this stage in the interactive map <span>→</span></Link>
    </section>

    {/* Ask in place, seeded with this stage so the answer already knows where
        the visitor is standing. */}
    <section className="section-pad stage-assistant">
      <span className="eyebrow">{d.assistant.eyebrow}</span>
      <h2>{d.assistant.onStageTitle}</h2>
      <Assistant snapshot={buildSnapshot(locale)} locale={locale} variant="compact" initialStageId={stage.id} />
    </section>

    <RouteGovernance
      locale={locale}
      businessOutcome={`Prepare ${stage.name} with clearer ownership, evidence readiness and visibility of parallel dependencies.`}
      audience={stage.groupIds.map((id) => groupById[id]?.name).filter(Boolean).join(" · ")}
      nextAction={stage.nextStep}
      stageIds={[stage.id]}
      stakeholderIds={stage.groupIds}
      primaryLabel="Explore the relevant product"
      secondaryLabel="Open this stage in the ecosystem map"
      secondaryHref={`/ecosystem?view=journey&stage=${stage.id}`}
    />

    <nav className="stage-nav" aria-label="Adjacent stages">
      {previous
        ? <Link href={`/property-journey/${previous.id}`}><small>PREVIOUS</small><b>← {previous.name}</b></Link>
        : <span />}
      {next
        ? <Link href={`/property-journey/${next.id}`}><small>NEXT</small><b>{next.name} →</b></Link>
        : <Link href="/property-journey"><small>COMPLETE MAP</small><b>All {all.length} stages →</b></Link>}
    </nav>
  </Page>;
}

export default async function StagePage(props: Props) {
  return View({ ...props, locale: DEFAULT_LOCALE });
}

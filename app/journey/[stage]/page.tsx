import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, StatusTag } from "../../components/SiteShell";
import { groupById } from "../../data/ecosystem";
import { stageById, stages } from "../../data/journey";
import { personas } from "../../data/personas";
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

export default async function StagePage({ params }: Props) {
  const { stage: slug } = await params;
  const stage = stageById[slug];
  if (!stage) notFound();

  const previous = stages[stage.number - 2];
  const next = stages[stage.number];
  const parallel = stage.runsWith.map((id) => stageById[id]).filter(Boolean);
  const details = stage.detailStageIds.map((id) => detailById[id]).filter(Boolean);
  const relevantPersonas = personas.filter((p) => p.steps.some((s) => s.stageId === stage.id));

  return <Page className="inner-page stage-page">
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link href="/journey">Property journey</Link>
      <span aria-hidden="true">/</span>
      <b>{stage.name}</b>
    </nav>

    <section className="stage-hero">
      <div className="stage-hero-number">{String(stage.number).padStart(2, "0")}</div>
      <div>
        <span className="eyebrow">{stage.track.toUpperCase()} · STAGE {stage.number} OF {stages.length}</span>
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
            <span key={s.id}>{i > 0 && (i === parallel.length - 1 ? " and " : ", ")}<Link href={`/journey/${s.id}`}>{s.name}</Link></span>
          ))}. Treating these as a sequence is one of the most common misunderstandings of UAE development.
        </p>
      </section>
    )}

    <section className="section-pad stage-body">
      <article className="stage-main">
        <h2>What happens</h2>
        <ol className="numbered-list">
          {stage.whatHappens.map((item) => <li key={item}>{item}</li>)}
        </ol>

        <h2>What can go wrong</h2>
        <ul className="risk-list">
          {stage.risks.map((item) => <li key={item}>{item}</li>)}
        </ul>

        <div className="jurisdiction-note">
          <b>Where you are changes the answer</b>
          <p>{stage.jurisdiction}</p>
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
              <li key={id}><Link href={`/ecosystem#${id}`}>{groupById[id]?.name}</Link></li>
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
                <li key={p.slug}><Link href={`/roles/${p.slug}`}>{p.name}</Link></li>
              ))}
            </ul>
          </div>
        )}

        {details.length > 0 && (
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

    <nav className="stage-nav" aria-label="Adjacent stages">
      {previous
        ? <Link href={`/journey/${previous.id}`}><small>PREVIOUS</small><b>← {previous.name}</b></Link>
        : <span />}
      {next
        ? <Link href={`/journey/${next.id}`}><small>NEXT</small><b>{next.name} →</b></Link>
        : <Link href="/journey"><small>COMPLETE MAP</small><b>All {stages.length} stages →</b></Link>}
    </nav>
  </Page>;
}

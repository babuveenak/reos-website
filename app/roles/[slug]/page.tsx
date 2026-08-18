import { getPersonas, getStage } from "../../i18n/content";
import { DEFAULT_LOCALE, type Locale } from "../../i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, StatusTag } from "../../components/SiteShell";
import { withTerms } from "../../components/Term";
import { groupById } from "../../data/ecosystem";

import { personaBySlug, personas } from "../../data/personas";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return personas.map((persona) => ({ slug: persona.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const persona = personaBySlug[slug];
  if (!persona) return {};
  return { title: `${persona.headline} | REOS`, description: persona.promise };
}

/** Rough reading time from the words actually on the page. */
function readingMinutes(p: { steps: { detail: string; title: string }[]; audience: string; reosHelp: string; risks: string[] }) {
  const words = [p.audience, p.reosHelp, ...p.risks, ...p.steps.flatMap((s) => [s.title, s.detail])]
    .join(" ").trim().split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
}

export async function View({ params, locale = DEFAULT_LOCALE }: Props & { locale?: Locale }) {
  const { slug } = await params;
  const all = getPersonas(locale);
  const persona = all.find((p) => p.slug === slug);
  if (!persona) notFound();

  const others = all.filter((p) => p.slug !== persona.slug).slice(0, 3);

  return <Page className="inner-page persona-page" locale={locale}>
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link href="/roles">Roles</Link>
      <span aria-hidden="true">/</span>
      <b>{persona.name}</b>
    </nav>

    <section className="persona-hero">
      <div>
        <span className="eyebrow">{persona.name.toUpperCase()} JOURNEY</span>
        <h1>{persona.headline}</h1>
        <p>{persona.promise}</p>
        <StatusTag status={persona.status} />
      </div>
      <aside className="persona-meta">
        <small>WHO THIS IS FOR</small>
        <p>{persona.audience}</p>
        <div className="meta-count">
          <b>{String(persona.steps.length).padStart(2, "0")}</b><span>steps</span>
          <em>{readingMinutes(persona)} min read</em>
        </div>
        <small>QUESTIONS THIS ANSWERS</small>
        <ul className="meta-questions">{persona.questions.map((q) => <li key={q}>{q}</li>)}</ul>
        <div className="meta-action">
          <small>START HERE</small>
          <p>{persona.nextAction}</p>
        </div>
      </aside>
    </section>

    <section className="section-pad">
      <div className="persona-flow">
        {persona.steps.map((step, index) => {
          const stage = getStage(locale, step.stageId);
          const newPhase = step.phase && step.phase !== persona.steps[index - 1]?.phase;
          return (
            <div key={step.title}>
            {newPhase && (
              <p className="flow-phase"><b>{step.phase}</b><i aria-hidden="true" /></p>
            )}
            <article className="flow-step">
              <div className="step-marker"><b>{String(index + 1).padStart(2, "0")}</b></div>
              <div className="step-body">
                <h2>{step.title}</h2>
                <p>{withTerms(step.detail)}</p>
                {stage && (
                  <Link className="step-stage" href={`/journey/${stage.id}`}>
                    <span>STAGE {String(stage.number).padStart(2, "0")}</span>
                    <b>{stage.name}</b>
                    <i>→</i>
                  </Link>
                )}
              </div>
            </article>
            </div>
          );
        })}
      </div>
    </section>

    <section className="section-pad persona-grid-detail">
      <article className="detail-block">
        <span className="eyebrow">WHO YOU WORK WITH</span>
        <ul className="link-list">
          {persona.worksWith.map((id) => (
            <li key={id}><Link href={`/ecosystem#${id}`}>{groupById[id]?.name}</Link></li>
          ))}
        </ul>
      </article>
      <article className="detail-block">
        <span className="eyebrow">DOCUMENTS TO EXPECT</span>
        <ul className="plain-list">
          {persona.documents.map((doc) => <li key={doc}>{doc}</li>)}
        </ul>
      </article>
      <article className="detail-block risk-block">
        <span className="eyebrow">COMMON MISTAKES</span>
        <ul className="risk-list">
          {persona.risks.map((risk) => <li key={risk}>{risk}</li>)}
        </ul>
      </article>
    </section>

    <section className="reos-opportunity">
      <span className="eyebrow">HOW REOS HELPS</span>
      <h2>{persona.plural} see<br /><em>the whole journey.</em></h2>
      <p>{persona.reosHelp}</p>
      <div className="hero-actions">
        <Link className="button gold" href="/journey">See the full journey <span>↗</span></Link>
        <Link className="button ghost" href="/roles">Try another route</Link>
      </div>
    </section>

    <section className="section-pad other-roles">
      <span className="eyebrow">OTHER ROUTES</span>
      <div className="role-links">
        {others.map((other) => (
          <Link key={other.slug} href={`/roles/${other.slug}`}>
            <b>{other.name}</b>
            <span>{other.card}</span>
            <i>→</i>
          </Link>
        ))}
      </div>
    </section>
  </Page>;
}

export default async function PersonaPage(props: Props) {
  return View({ ...props, locale: DEFAULT_LOCALE });
}

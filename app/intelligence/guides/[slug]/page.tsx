import { getPersonas, getStage } from "../../../i18n/content";
import { DEFAULT_LOCALE, type Locale } from "../../../i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, StatusTag } from "../../../components/SiteShell";
import { withTerms } from "../../../components/Term";
import { groupById } from "../../../data/ecosystem";

import { personaBySlug, personas } from "../../../data/personas";
import { allRouteSlugs, contentSlug, resolveRoute } from "../../../data/routes";
import { getRouteUi } from "../../../i18n/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  // Every route plus every retired alias, so no historical URL 404s.
  const slugs = new Set([...allRouteSlugs, ...personas.map((p) => p.slug)]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const persona = personaBySlug[slug];
  const route = resolveRoute(slug);
  if (persona) return { title: `${persona.headline} | REOS`, description: persona.promise };
  if (route) return { title: `${route.title} | REOS`, description: route.sub };
  return {};
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
  const route = resolveRoute(slug);
  // Aliases resolve to the canonical route, so old URLs keep working.
  const persona = route ? all.find((p) => p.slug === contentSlug(route)) : all.find((p) => p.slug === slug);

  if (!persona) {
    if (!route) notFound();
    return <PendingRoute route={route} locale={locale} />;
  }

  const others = all.filter((p) => p.slug !== persona.slug).slice(0, 3);

  return <Page className="inner-page persona-page" locale={locale}>
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link href="/intelligence">Intelligence</Link>
      <span aria-hidden="true">/</span>
      <Link href="/intelligence/guides">Guides</Link>
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
                  <Link className="step-stage" href={`/property-journey/${stage.id}`}>
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
            <li key={id}><Link href={`/stakeholders/${id}`}>{groupById[id]?.name}</Link></li>
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
        <Link className="button gold" href="/property-journey">See the full journey <span>↗</span></Link>
        <Link className="button ghost" href="/intelligence/guides">Try another guide</Link>
      </div>
    </section>

    <section className="section-pad other-roles">
      <span className="eyebrow">OTHER GUIDES</span>
      <div className="role-links">
        {others.map((other) => (
          <Link key={other.slug} href={`/intelligence/guides/${other.slug}`}>
            <b>{other.name}</b>
            <span>{other.card}</span>
            <i>→</i>
          </Link>
        ))}
      </div>
    </section>
  </Page>;
}

/** A route that exists in the model but whose content is not published yet.
 *  Shown rather than hidden: removing it would misrepresent the ecosystem. */
function PendingRoute({ route, locale }: { route: NonNullable<ReturnType<typeof resolveRoute>>; locale: Locale }) {
  const ui = getRouteUi(locale);
  const L = (p: string) => (locale === DEFAULT_LOCALE ? p : `/ar${p}`);
  return <Page className="inner-page persona-page" locale={locale}>
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link href={L("/intelligence/guides")}>Guides</Link>
      <span aria-hidden="true">/</span>
      <b>{route.title}</b>
    </nav>
    <section className="persona-hero">
      <div>
        <span className="eyebrow">{route.ctaLabel}</span>
        <h1>{route.title}</h1>
        <p>{route.sub}</p>
      </div>
    </section>
    <section className="section-pad">
      <div className="pending-route">
        <b>{ui.pending}</b>
        <p>{ui.pendingCopy}</p>
        <ol className="journey-strip is-shown" aria-label="Journey steps">
          {route.journey.map((step, i) => (
            <li key={step} style={{ ["--i" as string]: i }}><span>{step}</span></li>
          ))}
        </ol>
        <div className="hero-actions">
          <Link className="button gold" href={L("/property-journey")}>See the full journey <span>↗</span></Link>
          <Link className="button ghost" href={L("/intelligence/guides")}>Try another guide</Link>
        </div>
      </div>
    </section>
  </Page>;
}

export default async function PersonaPage(props: Props) {
  return View({ ...props, locale: DEFAULT_LOCALE });
}

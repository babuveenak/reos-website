import { getPersonas, getStages, getTerms, getInsightCategories } from "../i18n/content";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { IntelligenceHeroMap, type IntelligenceDomain } from "../components/IntelligenceHeroMap";
import { Page, SectionIntro } from "../components/SiteShell";
import { authorities } from "../data/reos";

export const metadata: Metadata = {
  title: "REOS Intelligence | Guides, Regulations, Processes & Glossary",
  description: "The knowledge layer behind the UAE property ecosystem: guides, regulation explainers, process references, authority information, definitions and the knowledge graph.",
};

/**
 * INTELLIGENCE — the six categories the site freezes to: Guides, Regulations,
 * Processes, Authority Information, Definitions & Glossary, Knowledge Graph.
 *
 * This indexes what already exists on the site rather than promising
 * long-form articles that have not been written. Where a category has no
 * published content yet, it says so — "Coming soon" — rather than inventing
 * copy to fill the box.
 */
export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const L = (path: string) => localePath(locale, path);
  const personas = getPersonas(locale);
  const stages = getStages(locale);
  const terms = getTerms(locale);
  const categories = getInsightCategories(locale);
  const regulation = categories.find((c) => c.id === "regulation");
  const authorityProcesses = categories.find((c) => c.id === "authority-processes");
  const intelligenceDomains: IntelligenceDomain[] = [
    {
      id: "guides", number: 1, name: "Guides", short: "guides", status: "Published",
      description: "Role-based guidance that explains the sequence, documents and recurring mistakes across the UAE property journey.",
      href: L("/intelligence/guides"),
    },
    {
      id: "regulations", number: 2, name: "Regulations", short: "regulations", status: "In development",
      description: regulation?.copy ?? "Regulation explainers in plain language, connected to their official sources.",
      href: L("/intelligence#regulations"),
    },
    {
      id: "processes", number: 3, name: "Processes", short: "processes", status: `${stages.length} stages mapped`,
      description: "What happens at each stage, who participates, which documents matter and where jurisdiction changes the route.",
      href: L("/intelligence#processes"),
    },
    {
      id: "authority-information", number: 4, name: "Authority Information", short: "authority information", status: "Official channels mapped",
      description: authorityProcesses?.copy ?? "Which authority governs a requirement, which channel handles it and what each submission needs.",
      href: L("/intelligence#authority-information"),
    },
    {
      id: "definitions-and-glossary", number: 5, name: "Definitions & Glossary", short: "the glossary", status: `${terms.length} terms defined`,
      description: "The recurring vocabulary of UAE property, defined once in plain language and linked wherever it appears.",
      href: L("/intelligence/definitions-and-glossary"),
    },
    {
      id: "knowledge-graph", number: 6, name: "Knowledge Graph", short: "the knowledge graph", status: "Future REOS capability",
      description: "The connected model linking stages, stakeholders, documents, approvals and dependencies instead of treating them as separate lists.",
      href: L("/intelligence#knowledge-graph"),
    },
  ];

  return <Page className="inner-page" locale={locale}>
    <section className="inner-hero inner-hero-no-photo intelligence-hero">
      <div className="intelligence-hero-copy">
        <span className="eyebrow">INTELLIGENCE</span>
        <h1>REOS<br /><em>intelligence.</em></h1>
        <p>What knowledge supports the UAE property ecosystem? Guides, regulations, processes, authority information, definitions and the knowledge graph — organised in one place instead of scattered across government portals, developer procedures and industry practice.</p>
      </div>
      <IntelligenceHeroMap domains={intelligenceDomains} />
    </section>

    <section className="section-pad" id="guides">
      <SectionIntro
        label="01 · GUIDES"
        title={<>Guides by<br /><em>who you are.</em></>}
        copy="Each guide explains the full sequence for that everyday role, the documents involved and the mistakes that recur."
      />
      <div className="insight-grid">
        {personas.map((persona) => (
          <Link key={persona.slug} href={L(`/intelligence/guides/${persona.slug}`)} className="insight-card">
            <small>{persona.name}</small>
            <h3>{persona.headline}</h3>
            <p>{persona.promise}</p>
            <i>Read the guide →</i>
          </Link>
        ))}
      </div>
      <p className="rail-callout">Not sure which guide fits? <Link href={L("/intelligence/guides")}>See every guide →</Link></p>
    </section>

    <section className="section-pad" id="regulations">
      <SectionIntro
        label="02 · REGULATIONS"
        title={<>What the rules<br /><em>actually require.</em></>}
        copy={regulation?.copy ?? "Regulation explainers, written in plain language and linked to the official source."}
      />
      <div className="topic-grid">
        <article>
          <h3>{regulation?.name ?? "Regulation explainers"}</h3>
          <p>{regulation?.copy}</p>
          <span className="status status-to-be-validated">In development</span>
        </article>
      </div>
    </section>

    <section className="section-pad" id="processes">
      <SectionIntro
        label="03 · PROCESSES"
        title={<>Guides by<br /><em>what happens when.</em></>}
        copy="Every stage of the journey explained: what takes place, who is involved, which documents matter and what changes between emirates."
      />
      <div className="stage-index">
        {stages.map((stage) => (
          <Link key={stage.id} href={L(`/property-journey/${stage.id}`)} className="stage-index-card">
            <header><span>{String(stage.number).padStart(2, "0")}</span><em>{stage.track}</em></header>
            <h3>{stage.name}</h3>
            <p>{stage.summary}</p>
          </Link>
        ))}
      </div>
    </section>

    <section className="section-pad" id="authority-information">
      <SectionIntro
        label="04 · AUTHORITY INFORMATION"
        title={<>Who governs what,<br /><em>and through which channel.</em></>}
        copy={authorityProcesses?.copy ?? "Which authority handles a submission, and what it needs."}
      />
      <div className="topic-grid">
        {authorities.slice(0, 6).map((authority) => (
          <article key={authority.id}>
            <h3>{authority.name}</h3>
            <p>{authority.role}</p>
            <span className="status">{authority.jurisdiction}</span>
          </article>
        ))}
      </div>
      <p className="rail-callout"><Link href={L("/authorities")}>See every authority →</Link></p>
    </section>

    <section className="section-pad" id="definitions-and-glossary">
      <SectionIntro
        label="05 · DEFINITIONS & GLOSSARY"
        title={<>The terms,<br /><em>in plain language.</em></>}
        copy="UAE property has its own vocabulary. These are the terms that recur across the journey, defined once and linked everywhere they appear."
      />
      <p className="rail-callout"><b>{terms.length} terms defined.</b> <Link href={L("/intelligence/definitions-and-glossary")}>Open the glossary →</Link></p>
    </section>

    <section className="section-pad" id="knowledge-graph">
      <SectionIntro
        label="06 · KNOWLEDGE GRAPH"
        title={<>How everything<br /><em>connects.</em></>}
        copy="The stages, stakeholders, documents and dependencies described across this site are one connected graph rather than separate lists. A dedicated explorer for it is not yet built."
      />
      <div className="topic-grid">
        <article>
          <h3>Knowledge graph explorer</h3>
          <p>Today, the assistant&rsquo;s own graph visual is the closest preview of this — see how a question resolves through the journey and its twelve stakeholder groups.</p>
          <span className="status status-future-reos-capability">Future REOS capability</span>
        </article>
      </div>
      <p className="rail-callout"><Link href={L("/assistant")}>See the assistant&rsquo;s graph →</Link></p>
    </section>

    <section className="integrity-strip">
      <b>How to use this</b>
      <p>These explainers describe how things generally work. They are not legal, financial or tax advice, and they do not replace the official position of any authority. Requirements differ by emirate and change over time — confirm your specific case before acting.</p>
    </section>
  </Page>;
}

export default function IntelligencePage() {
  return <View locale={DEFAULT_LOCALE} />;
}

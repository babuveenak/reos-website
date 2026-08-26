import { getPersonas, getTerms, getInsightCategories } from "../i18n/content";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import type { Metadata } from "next";
import { IntelligenceHeroMap, type IntelligenceDomain } from "../components/IntelligenceHeroMap";
import { IntelligenceWorkspaces } from "../components/IntelligenceWorkspaces";
import { Page } from "../components/SiteShell";
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
      href: L("/intelligence#evidence-pathway"),
    },
    {
      id: "processes", number: 3, name: "Processes", short: "processes", status: "7 stages mapped",
      description: "What happens at each stage, who participates, which documents matter and where jurisdiction changes the route.",
      href: L("/property-journey"),
    },
    {
      id: "authority-information", number: 4, name: "Authority Information", short: "authority information", status: "Official channels mapped",
      description: authorityProcesses?.copy ?? "Which authority governs a requirement, which channel handles it and what each submission needs.",
      href: L("/intelligence#authority-explorer"),
    },
    {
      id: "definitions-and-glossary", number: 5, name: "Definitions & Glossary", short: "the glossary", status: `${terms.length} terms defined`,
      description: "The recurring vocabulary of UAE property, defined once in plain language and linked wherever it appears.",
      href: L("/intelligence/definitions-and-glossary"),
    },
    {
      id: "knowledge-graph", number: 6, name: "Knowledge Graph", short: "the knowledge graph", status: "Future REOS capability",
      description: "The connected model linking stages, stakeholders, documents, approvals and dependencies instead of treating them as separate lists.",
    },
  ];
  const guideOptions = personas.map((persona) => ({
    slug: persona.slug,
    name: persona.name,
    card: persona.card,
    stageCount: new Set(persona.steps.map((step) => step.stageId)).size,
    stepCount: persona.steps.length,
    href: L(`/intelligence/guides/${persona.slug}`),
  }));
  const authorityOptions = authorities.map(({ id, name, jurisdiction, role, status, sourceUrl }) => ({ id, name, jurisdiction, role, status, sourceUrl }));
  const termOptions = terms.map(({ id, term, short, jurisdictional }) => ({ id, term, short, jurisdictional: Boolean(jurisdictional) }));

  return <Page className="inner-page" locale={locale}>
    <section className="inner-hero inner-hero-no-photo intelligence-hero">
      <div className="intelligence-hero-copy">
        <span className="eyebrow">INTELLIGENCE</span>
        <h1>REOS<br /><em>intelligence.</em></h1>
        <p>What knowledge supports the UAE property ecosystem? Guides, regulations, processes, authority information, definitions and the knowledge graph — organised in one place instead of scattered across government portals, developer procedures and industry practice.</p>
      </div>
      <IntelligenceHeroMap domains={intelligenceDomains} />
    </section>

    <IntelligenceWorkspaces
      locale={locale}
      guides={guideOptions}
      authorities={authorityOptions}
      terms={termOptions}
      glossaryHref={L("/intelligence/definitions-and-glossary")}
    />

    <section className="integrity-strip">
      <b>How to use this</b>
      <p>These explainers describe how things generally work. They are not legal, financial or tax advice, and they do not replace the official position of any authority. Requirements differ by emirate and change over time — confirm your specific case before acting.</p>
    </section>

  </Page>;
}

export default function IntelligencePage() {
  return <View locale={DEFAULT_LOCALE} />;
}

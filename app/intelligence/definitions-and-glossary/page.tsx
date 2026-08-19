import { getTerms, getStages } from "../../i18n/content";
import { DEFAULT_LOCALE, localePath, type Locale } from "../../i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { Page, SectionIntro } from "../../components/SiteShell";

export const metadata: Metadata = {
  title: "Definitions & Glossary | REOS Intelligence",
  description: "Plain-language definitions of the UAE property terms that appear across the journey — escrow, off-plan, snagging, service charge, NOC, SPV and more.",
};

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const sorted = [...getTerms(locale)].sort((a, b) => a.term.localeCompare(b.term));
  const L = (path: string) => localePath(locale, path);
  return <Page className="inner-page" locale={locale}>
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link href={L("/intelligence")}>Intelligence</Link>
      <span aria-hidden="true">/</span>
      <b>Definitions &amp; Glossary</b>
    </nav>
    <section className="inner-hero">
      <span className="eyebrow">INTELLIGENCE · DEFINITIONS &amp; GLOSSARY</span>
      <h1>The terms,<br /><em>in plain language.</em></h1>
      <p>UAE property has its own vocabulary, and most of it is assumed rather than explained. These are the terms that recur across the journey, defined for someone encountering them for the first time.</p>
    </section>

    <section className="section-pad">
      <SectionIntro
        label={`${sorted.length} TERMS`}
        title={<>Defined once.<br /><em>Linked everywhere.</em></>}
        copy="Where a term appears on the site it links back here. Terms marked as jurisdiction-dependent mean something different depending on the emirate, so the definition describes the general shape rather than one emirate's rule."
      />
      <dl className="glossary-list">
        {sorted.map((term) => (
          <div key={term.id} id={term.id} className="glossary-entry">
            <dt>
              {term.term}
              {term.jurisdictional && <span className="juris-flag">Differs by emirate</span>}
            </dt>
            <dd>
              <p className="gloss-short">{term.short}</p>
              <p className="gloss-long">{term.long}</p>
              {term.aka && <p className="gloss-aka">Also written: {term.aka.join(", ")}</p>}
            </dd>
          </div>
        ))}
      </dl>
    </section>

    <section className="section-pad">
      <SectionIntro
        label="SEE THEM IN CONTEXT"
        title={<>Terms make more sense<br /><em>inside the journey.</em></>}
        copy="A definition tells you what a word means. The stage tells you why it matters and who it involves."
      />
      <div className="stage-index">
        {getStages(locale).map((stage) => (
          <Link key={stage.id} href={L(`/property-journey/${stage.id}`)} className="stage-index-card">
            <header><span>{String(stage.number).padStart(2, "0")}</span><em>{stage.track}</em></header>
            <h3>{stage.name}</h3>
            <p>{stage.summary}</p>
          </Link>
        ))}
      </div>
    </section>

    <section className="integrity-strip">
      <b>How to use these</b>
      <p>These definitions describe general market practice so you can keep reading. They are not legal definitions, and several terms carry a regulated meaning that differs by emirate. Confirm the meaning that applies to your case with the relevant authority or a qualified adviser.</p>
    </section>
  </Page>;
}

export default function DefinitionsAndGlossaryPage() {
  return <View locale={DEFAULT_LOCALE} />;
}

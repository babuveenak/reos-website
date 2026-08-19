import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { Page, SectionIntro, StatusTag } from "../components/SiteShell";
import { getModules } from "../i18n/content";
import { layers } from "../data/journey";

export const metadata: Metadata = {
  title: "The Execution Layer for the Property Journey | REOS Platform",
  description: "How REOS moves from explaining the UAE property journey to running it: knowledge, discovery and execution layers, and the eight modules beneath them.",
};

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const L = (path: string) => localePath(locale, path);
  const modules = getModules(locale);
  return <Page className="inner-page" locale={locale}>
    <section className="inner-hero">
      <span className="eyebrow">REOS PLATFORM</span>
      <h1>The execution layer<br /><em>for the property journey.</em></h1>
      <p>Understanding the journey is the first problem. Running it is the second. REOS is built in three layers so each is useful on its own, and each makes the next one possible.</p>
    </section>

    <section className="section-pad atmos atmos-rays">
      <SectionIntro label="THREE LAYERS" title={<>Understand it. Find your part.<br /><em>Then run the work.</em></>} />
      <div className="layer-grid">
        {layers.map((layer, index) => (
          <article key={layer.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{layer.name}</h3>
            <b>{layer.claim}</b>
            <p>{layer.copy}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="section-pad module-band">
      <SectionIntro
        label="PLATFORM MODULES"
        title={<>Eight modules.<br /><em>Labelled honestly.</em></>}
        copy="Validated means researched and built. To be validated means designed and partially proven. Future capability means architected but not yet delivered. Nothing here is described as finished when it is not."
      />
      <div className="module-grid">
        {modules.map((module, index) => (
          <article key={module.id} id={module.id}>
            <header><span>{String(index + 1).padStart(2, "0")}</span><StatusTag status={module.status} /></header>
            <h3>{module.name}</h3>
            <p>{module.copy}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="section-pad">
      <SectionIntro label="WHAT THE LABELS MEAN" title={<>Four labels.<br /><em>Used the same way everywhere.</em></>} />
      <dl className="status-key">
        <div><dt><span className="status status-validated">Validated</span></dt><dd>Researched, sourced and reflected in the current model.</dd></div>
        <div><dt><span className="status status-to-be-validated">To Be Validated</span></dt><dd>Designed or partially proven, still requiring verification before it can be treated as complete.</dd></div>
        <div><dt><span className="status status-future-reos-capability">Future REOS Capability</span></dt><dd>Architected as part of the roadmap, not yet delivered as a live capability.</dd></div>
        <div><dt><span className="status status-illustrative">Illustrative</span></dt><dd>Used to explain the model or the experience, not a verified operational claim.</dd></div>
      </dl>
    </section>

    <section className="section-pad principle-band">
      <SectionIntro label="OPERATING PRINCIPLES" title={<>What REOS<br /><em>deliberately does not do.</em></>} />
      <div className="principle-grid">
        <article><b>01</b><h3>It is not the system of record</h3><p>Authorities, registries, banks and escrow trustees remain authoritative for their own decisions and records. REOS coordinates around them.</p></article>
        <article><b>02</b><h3>It does not issue or execute</h3><p>No approval, registration, transaction or payment is performed by REOS. Binding actions return to the official channel or the regulated provider.</p></article>
        <article><b>03</b><h3>It does not generalise across emirates</h3><p>Requirements are held per jurisdiction. Guidance for Dubai is never presented as guidance for the UAE.</p></article>
        <article><b>04</b><h3>It does not assert without a source</h3><p>Operative claims carry their source, the issuing authority and the date they were last checked, so a reader can verify rather than trust.</p></article>
      </div>
    </section>

    <section className="reos-opportunity">
      <span className="eyebrow">SEE IT ON YOUR PROJECT</span>
      <h2>Bring a project.<br /><em>We will map it.</em></h2>
      <p>Walk through your emirate, asset type and delivery route against the connected model, and see where the dependencies, approvals and handoffs actually sit.</p>
      <div className="hero-actions">
        <Link className="button gold" href={L("/demo")}>Book a demo <span>↗</span></Link>
        <Link className="button ghost" href={L("/property-journey")}>Explore the journey</Link>
      </div>
    </section>
  </Page>;
}

export default function PlatformPage() {
  return <View locale={DEFAULT_LOCALE} />;
}

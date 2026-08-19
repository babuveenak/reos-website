import { DEFAULT_LOCALE, type Locale } from "./i18n/config";
import { getDict } from "./i18n/dictionary";
import { getFragments, getLayers, getModules, getOutcomes, getStages, getGroups } from "./i18n/content";
import Link from "next/link";
import { EcosystemMap } from "./components/Ecosystem";
import { JourneyMap, PersonaQuickPick, PersonaSelector, TrackLegend } from "./components/Journey";
import { JourneyFlow, JourneyStatsBar, JourneyMoments } from "./components/JourneyHero";
import { JourneyIntelligence } from "./components/JourneyStory";
import { Page, SectionIntro, StatusTag } from "./components/SiteShell";
import { Assistant } from "./components/Assistant";
import { buildSnapshot } from "./assistant/snapshot";

import { authorities } from "./data/reos";

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const d = getDict(locale);
  const L = (p: string) => (locale === DEFAULT_LOCALE ? p : `/ar${p === "/" ? "" : p}`);
  // Narrow, serialisable view of the content model for the client assistant.
  const snapshot = buildSnapshot(locale);
  return <Page className="home" locale={locale}>

    {/* 01 — HERO. The journey, not the ecosystem. */}
    <section className="hero-primary">
      <div className="hero-ground" aria-hidden="true" />
      <div className="hero-copy">
        <span className="eyebrow">{d.home.eyebrow}</span>
        <h1>{d.home.h1}<br /><em>{d.home.h1em}</em></h1>
        <p>{d.home.lede}</p>
        <p className="hero-benefit">{d.home.benefit}</p>
        <div className="hero-actions">
          <Link className="button gold" href={`${L("/")}#start`}>{d.home.ctaStart} <span>↗</span></Link>
          <Link className="button ghost" href={L("/ecosystem")}>{d.home.ctaEcosystem}</Link>
        </div>
      </div>
      <div className="hero-visual"><JourneyFlow locale={locale} /></div>
      <JourneyStatsBar locale={locale} />
      <PersonaQuickPick locale={locale} />
    </section>

    <JourneyMoments locale={locale} />

    {/* 02 — ASK. The assistant is the front door: a question before the reading. */}
    <section className="section-pad assistant-band" id="ask">
      <SectionIntro
        label={d.assistant.eyebrow}
        title={<>{d.assistant.title}<br /><em>{d.assistant.titleEm}</em></>}
        copy={d.assistant.lede}
      />
      <Assistant snapshot={snapshot} locale={locale} variant="compact" />
    </section>

    {/* 03 — WHERE ARE YOU. Persona entry, high on the page. */}
    <section className="section-pad start-band" id="start">
      <SectionIntro
        label={d.home.startLabel}
        title={<>{d.home.startTitle}<br /><em>{d.home.startTitleEm}</em></>}
        copy={d.home.startCopy}
      />
      <PersonaSelector locale={locale} />
    </section>

    {/* 04 — PROBLEM. */}
    <section className="section-pad problem-band" id="problem">
      <SectionIntro
        label={d.home.problemLabel}
        title={<>{d.home.problemTitle}<br /><em>{d.home.problemTitleEm}</em></>}
        copy={d.home.problemCopy}
      />
      <div className="fragment-cards">
        {getFragments(locale).map((item, index) => (
          <article key={item.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
            <p className="fragment-example">{item.example}</p>
          </article>
        ))}
      </div>
    </section>

    {/* 05 — THE JOURNEY MAP. Concurrency shown, not flattened. */}
    <section className="section-pad journey-band" id="journey">
      <SectionIntro
        label={d.home.journeyLabel}
        title={<>{d.home.journeyTitle}<br /><em>{d.home.journeyTitleEm}</em></>}
        copy={d.home.journeyCopy}
      />
      <JourneyMap compact locale={locale} />
      <TrackLegend locale={locale} />
    </section>

    {/* 06 — ECOSYSTEM REVEAL. The 12 groups arrive after the journey. */}
    <section className="section-pad ecosystem-band" id="ecosystem">
      <SectionIntro
        label={d.home.ecoLabel}
        title={<>{d.home.ecoTitle}<br /><em>{d.home.ecoTitleEm}</em></>}
        copy="The journey is carried by twelve stakeholder groups across ownership, capital, regulation, design, construction, finance, legal, sales, utilities, operations and enabling services. Authorities sit on their own rail because they issue the approvals that gate everyone else."
      />
      <EcosystemMap />
      <div className="band-cta">
        <Link className="button gold" href={L("/ecosystem")}>{d.home.ecoCta} <span>↗</span></Link>
      </div>
    </section>

    <JourneyIntelligence locale={locale} />

    {/* 07 — HOW REOS CONNECTS. Three layers. */}
    <section className="section-pad layer-band atmos atmos-rays">
      <SectionIntro
        label={d.home.layerLabel}
        title={<>{d.home.layerTitle}<br /><em>{d.home.layerTitleEm}</em></>}
        copy={d.home.layerCopy}
      />
      <div className="layer-grid">
        {getLayers(locale).map((layer, index) => (
          <article key={layer.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{layer.name}</h3>
            <b>{layer.claim}</b>
            <p>{layer.copy}</p>
          </article>
        ))}
      </div>
    </section>

    {/* 08 — PLATFORM MODULES, with honest status. */}
    <section className="section-pad module-band" id="platform">
      <SectionIntro
        label={d.home.moduleLabel}
        title={<>{d.home.moduleTitle}<br /><em>{d.home.moduleTitleEm}</em></>}
        copy="Each module is labelled with what it is today. Validated means researched and built; designed means architected but not yet delivered. We would rather show the roadmap than imply a finished product."
      />
      <div className="module-grid">
        {getModules(locale).map((module, index) => (
          <article key={module.id}>
            <header><span>{String(index + 1).padStart(2, "0")}</span><StatusTag status={module.status} locale={locale} /></header>
            <h3>{module.name}</h3>
            <p>{module.copy}</p>
          </article>
        ))}
        <article className="module-roadmap">
          <header><span>&mdash;</span></header>
          <h3>{d.home.roadmapTitle}</h3>
          <p>Further capabilities are added only once they are sourced, validated and connected to the lifecycle model — not before.</p>
        </article>
      </div>
    </section>

    {/* 09 — OUTCOMES, per audience. */}
    <section className="section-pad outcome-band">
      <SectionIntro
        label={d.home.outcomeLabel}
        title={<>{d.footer.headline}<br /><em>{d.footer.headlineEm}</em></>}
      />
      <div className="outcome-grid">
        {getOutcomes(locale).map((outcome) => (
          <article key={outcome.audience}>
            <small>{outcome.audience}</small>
            <h3>{outcome.claim}</h3>
            <p>{outcome.copy}</p>
          </article>
        ))}
      </div>
      <div className="coverage-strip">
        <div><b>{getStages(locale).length}</b><span>{d.home.statStages}</span></div>
        <div><b>{getGroups(locale).length}</b><span>{d.home.statGroups}</span></div>
        <div><b>{authorities.length}</b><span>{d.home.statAuthorities}</span></div>
        <div><b>7</b><span>{d.home.statEmirates}</span></div>
      </div>
    </section>

    {/* 10 — WHERE TO GO NEXT. Educational, not a sales close. */}
    <section className="demo-band atmos atmos-city" id="start-reading">
      <span className="eyebrow">{d.home.closeLabel}</span>
      <h2>{d.footer.headline}<br /><em>{d.footer.headlineEm}</em></h2>
      <p>Follow the journey from land to living, pick the route that matches your situation, or look up a term you have run into. Nothing here asks you to commit to anything.</p>
      <div className="hero-actions">
        <Link className="button gold" href={L("/property-journey")}>{d.home.closeCta} <span>↗</span></Link>
        <Link className="button ghost" href={L("/intelligence/definitions-and-glossary")}>{d.home.closeCta2}</Link>
      </div>
      <p className="demo-note">REOS is an independent knowledge and navigation layer. It does not issue approvals, execute transactions or replace legal, financial or regulated advice. Requirements differ by emirate and change over time — verify with the relevant authority before acting.</p>
    </section>

  </Page>;
}

export default function Home() {
  return <View locale={DEFAULT_LOCALE} />;
}

import Link from "next/link";
import { EcosystemMap } from "./components/Ecosystem";
import { JourneyMap, JourneyRibbon, PersonaSelector, TrackLegend } from "./components/Journey";
import { Page, SectionIntro, StatusTag } from "./components/SiteShell";
import { fragments, groups, modules, outcomes } from "./data/ecosystem";
import { layers, stages } from "./data/journey";
import { authorities } from "./data/reos";

export default function Home() {
  return <Page className="home">

    {/* 01 — HERO. The journey, not the ecosystem. */}
    <section className="hero-primary">
      <div className="hero-ground" aria-hidden="true" />
      <div className="hero-copy">
        <span className="eyebrow">UAE REAL ESTATE</span>
        <h1>Understand the property journey.<br /><em>From land to living.</em></h1>
        <p>Explore how property is planned, financed, designed, developed, built, sold, registered, handed over, managed and invested in across the UAE.</p>
        <div className="hero-actions">
          <Link className="button gold" href="/#start">Start my journey <span>↗</span></Link>
          <Link className="button ghost" href="/ecosystem">Explore the ecosystem</Link>
        </div>
      </div>
      <div className="hero-visual"><JourneyRibbon /></div>
    </section>

    {/* 02 — WHERE ARE YOU. Persona entry, high on the page. */}
    <section className="section-pad start-band" id="start">
      <SectionIntro
        label="FIND YOUR STARTING POINT"
        title={<>Start from<br /><em>where you are.</em></>}
        copy="Everyone enters the property ecosystem differently. Choose your role to see the journey, decisions, participants and documents that apply to you — and skip the ones that do not."
      />
      <PersonaSelector />
    </section>

    {/* 03 — PROBLEM. */}
    <section className="section-pad problem-band" id="problem">
      <SectionIntro
        label="WHY THIS IS HARD"
        title={<>Today&rsquo;s property journey<br /><em>is fragmented.</em></>}
        copy="A single property passes through dozens of organisations, approvals, documents and handoffs. Buyers, developers, investors, banks, contractors and authorities each see only their own part of it."
      />
      <div className="fragment-cards">
        {fragments.map((item, index) => (
          <article key={item.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>

    {/* 04 — THE JOURNEY MAP. Concurrency shown, not flattened. */}
    <section className="section-pad journey-band" id="journey">
      <SectionIntro
        label="THE PROPERTY JOURNEY"
        title={<>One property journey.<br /><em>Many connected stages.</em></>}
        copy="At every stage, different participants enter, exchange information, meet obligations and trigger the next step. Some stages run at the same time — in off-plan development, selling and building happen together."
      />
      <JourneyMap compact />
      <TrackLegend />
    </section>

    {/* 05 — ECOSYSTEM REVEAL. The 12 groups arrive after the journey. */}
    <section className="section-pad ecosystem-band" id="ecosystem">
      <SectionIntro
        label="THE ECOSYSTEM BEHIND IT"
        title={<>Behind every stage<br /><em>is a connected ecosystem.</em></>}
        copy="The journey is carried by twelve stakeholder groups across ownership, capital, regulation, design, construction, finance, legal, sales, utilities, operations and enabling services. Authorities sit on their own rail because they issue the approvals that gate everyone else."
      />
      <EcosystemMap />
      <div className="band-cta">
        <Link className="button gold" href="/ecosystem">Explore the ecosystem map <span>↗</span></Link>
      </div>
    </section>

    {/* 06 — HOW REOS CONNECTS. Three layers. */}
    <section className="section-pad layer-band">
      <SectionIntro
        label="HOW REOS CONNECTS IT"
        title={<>Understand it. Find your part in it.<br /><em>Then run the work.</em></>}
        copy="REOS connects the people, processes, documents and data behind the journey — in three layers, each usable on its own."
      />
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

    {/* 07 — PLATFORM MODULES, with honest status. */}
    <section className="section-pad module-band" id="platform">
      <SectionIntro
        label="FROM KNOWLEDGE TO EXECUTION"
        title={<>Eight modules.<br /><em>One connected model.</em></>}
        copy="Each module is labelled with what it is today. Validated means researched and built; designed means architected but not yet delivered. We would rather show the roadmap than imply a finished product."
      />
      <div className="module-grid">
        {modules.map((module, index) => (
          <article key={module.id}>
            <header><span>{String(index + 1).padStart(2, "0")}</span><StatusTag status={module.status} /></header>
            <h3>{module.name}</h3>
            <p>{module.copy}</p>
          </article>
        ))}
      </div>
    </section>

    {/* 08 — OUTCOMES, per audience. */}
    <section className="section-pad outcome-band">
      <SectionIntro
        label="WHAT CHANGES"
        title={<>Know where you are.<br /><em>Know what comes next.</em></>}
      />
      <div className="outcome-grid">
        {outcomes.map((outcome) => (
          <article key={outcome.audience}>
            <small>{outcome.audience}</small>
            <h3>{outcome.claim}</h3>
            <p>{outcome.copy}</p>
          </article>
        ))}
      </div>
      <div className="coverage-strip">
        <div><b>{stages.length}</b><span>journey stages mapped</span></div>
        <div><b>{groups.length}</b><span>stakeholder groups</span></div>
        <div><b>{authorities.length}</b><span>authorities with official sources</span></div>
        <div><b>7</b><span>emirates in the jurisdiction model</span></div>
      </div>
    </section>

    {/* 09 — CTA. */}
    <section className="demo-band" id="demo">
      <span className="eyebrow">SEE IT ON YOUR OWN PROJECT</span>
      <h2>Bring a project.<br /><em>We will map it.</em></h2>
      <p>Walk through your emirate, asset type and delivery route against the connected model, and see where the dependencies, approvals and handoffs actually sit.</p>
      <div className="hero-actions">
        <Link className="button gold" href="/demo">Book a demo <span>↗</span></Link>
        <Link className="button ghost" href="/journey">Explore the journey first</Link>
      </div>
      <p className="demo-note">REOS is an independent knowledge and navigation layer. It does not issue approvals, execute transactions or replace legal, financial or regulated advice. Requirements differ by emirate and change over time — verify with the relevant authority before acting.</p>
    </section>

  </Page>;
}

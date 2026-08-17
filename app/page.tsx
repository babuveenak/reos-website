import Link from "next/link";
import { EcosystemMap, EcosystemRing } from "./components/Ecosystem";
import { PhaseFlow } from "./components/PhaseFlow";
import { Page, SectionIntro, StatusTag } from "./components/SiteShell";
import { fragments, groups, modules, outcomes } from "./data/ecosystem";
import { authorities, lifecycleStages } from "./data/reos";

export default function Home() {
  return <Page className="home">

    {/* 01 — HERO. One proposition, one visual, two actions. Nothing to read. */}
    <section className="hero-primary">
      <div className="hero-ground" aria-hidden="true" />
      <div className="hero-copy">
        <span className="eyebrow">UAE PROPERTY DEVELOPMENT</span>
        <h1>The operating system for<br /><em>real estate development.</em></h1>
        <p>Connect developers, investors, regulators, consultants, contractors, brokers and property operations on one intelligent platform.</p>
        <div className="hero-actions">
          <Link className="button gold" href="/#ecosystem">Explore REOS <span>↗</span></Link>
          <Link className="button ghost" href="/#demo">Book a demo</Link>
        </div>
      </div>
      <div className="hero-visual">
        <EcosystemRing />
      </div>
    </section>

    {/* 02 — PROBLEM. Why the connected model is necessary. */}
    <section className="section-pad problem-band" id="problem">
      <SectionIntro
        label="THE PROBLEM"
        title={<>Today&rsquo;s real estate ecosystem<br /><em>is fragmented.</em></>}
        copy="A single development project moves through dozens of organisations, each with its own process, documents, systems and terminology. The information exists. The connections between it do not."
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

    {/* 03 — CURRENT STATE. The full ecosystem, now that the visitor is ready. */}
    <section className="section-pad ecosystem-band" id="ecosystem">
      <SectionIntro
        label="ONE CONNECTED REAL ESTATE JOURNEY"
        title={<>Twelve stakeholder groups.<br /><em>One operating model.</em></>}
        copy="Four clusters organise who participates. Beneath them runs the regulatory rail — authorities are not peers of the other groups, they issue the approvals that gate them. Select any group to see what it controls and where it enters."
      />
      <EcosystemMap />
    </section>

    {/* 04 — HOW IT WORKS. Same data as the 24 stage pages. */}
    <section className="section-pad lifecycle-band-new" id="how">
      <SectionIntro
        label="HOW REOS WORKS"
        title={<>Follow the project.<br /><em>Not the org chart.</em></>}
        copy="Four phases carry twenty-four stages. Each stage names who participates, which authorities are engaged and what must exist before the next activity can begin."
      />
      <PhaseFlow />
    </section>

    {/* 05 — PLATFORM. Architecture with honest status. */}
    <section className="section-pad module-band" id="platform">
      <SectionIntro
        label="PLATFORM ARCHITECTURE"
        title={<>Six layers.<br /><em>One knowledge graph.</em></>}
        copy="Each layer is labelled with what it is today. Validated content is researched and sourced; designed capability is architected but not yet built. We would rather show the roadmap than imply a finished product."
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

    {/* 06 — OUTCOMES. */}
    <section className="section-pad outcome-band">
      <SectionIntro
        label="WHAT CHANGES"
        title={<>Connected information<br /><em>changes how projects run.</em></>}
      />
      <div className="outcome-grid">
        {outcomes.map((outcome) => (
          <article key={outcome.metric}>
            <small>{outcome.metric}</small>
            <h3>{outcome.claim}</h3>
            <p>{outcome.copy}</p>
          </article>
        ))}
      </div>
      <div className="coverage-strip">
        <div><b>{groups.length}</b><span>stakeholder groups modelled</span></div>
        <div><b>{lifecycleStages.length}</b><span>lifecycle stages mapped</span></div>
        <div><b>{authorities.length}</b><span>authorities with official sources</span></div>
        <div><b>4</b><span>emirates in the jurisdiction model</span></div>
      </div>
    </section>

    {/* 07 — CONTACT. */}
    <section className="demo-band" id="demo">
      <span className="eyebrow">SEE IT ON YOUR OWN PROJECT</span>
      <h2>Bring a project.<br /><em>We will map it.</em></h2>
      <p>Walk through your jurisdiction, asset type and delivery route against the connected model — and see where the dependencies, approvals and handoffs actually sit.</p>
      <div className="hero-actions">
        <a className="button gold" href="mailto:hello@reos.ae?subject=REOS%20demo%20request">Book a demo <span>↗</span></a>
        <Link className="button ghost" href="/lifecycle">Explore the lifecycle first</Link>
      </div>
      <p className="demo-note">REOS is an independent knowledge and navigation layer. It does not issue approvals, execute transactions or replace legal, financial or regulated advice.</p>
    </section>

  </Page>;
}

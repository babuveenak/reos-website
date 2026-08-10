import Link from "next/link";
import { DualEntry, EcosystemOrbit, LifecycleExplorer } from "./components/Experience";
import { Page, SectionIntro } from "./components/SiteShell";

export default function Home() {
  return (
    <Page className="home">
      <section className="hero">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-content">
          <span className="eyebrow">REOS × KETURAH · UAE</span>
          <h1>The Operating System<br /><em>for Property.</em></h1>
          <p>A persistent digital journey connecting property, people, processes and platforms—from first intent to long-term ownership.</p>
          <div className="hero-actions"><Link className="button gold" href="/lifecycle">Follow the property <span>↗</span></Link><Link className="button ghost" href="/stakeholders">Choose your role</Link></div>
        </div>
        <div className="hero-arch" aria-hidden="true"><div className="arch-light" /><div className="arch-copy"><span>01</span><b>INTEGRATE</b><i>ORCHESTRATE</i><small>REMEMBER</small></div></div>
        <div className="scroll-cue"><i /> SCROLL TO EXPLORE</div>
      </section>

      <section className="problem-section section-pad" id="problem">
        <SectionIntro label="THE PROPERTY TODAY" title={<>One physical life.<br /><em>Dozens of digital fragments.</em></>} copy="A property passes through organisations, authorities, portals, contracts and data stores. Each participant sees a piece. The property remembers none of it." />
        <div className="fragment-grid">
          {["Authorities", "Developer systems", "Banks & escrow", "Consultants", "Sales channels", "Owner apps"].map((item, index) => <div className={`fragment fragment-${index + 1}`} key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b><i /></div>)}
          <div className="fragment-void"><span>ZERO SHARED STATE</span><b>Nothing travels.</b></div>
        </div>
      </section>

      <section className="ecosystem-section section-pad" id="ecosystem">
        <SectionIntro label="THE ECOSYSTEM" title={<>Eight ecosystems.<br /><em>One property journey.</em></>} copy="The homepage stays simple. Select an ecosystem to reveal the detailed stakeholder model beneath it." />
        <EcosystemOrbit />
      </section>

      <section className="passport-break">
        <div className="passport-image" aria-hidden="true" />
        <div className="passport-copy"><span className="eyebrow">THE PROPERTY PASSPORT</span><h2>The property becomes<br /><em>the persistent object.</em></h2><p>Not another portal. A permissioned memory of identity, lifecycle state, documents, decisions and handoffs—connected to the systems that remain authoritative.</p><Link className="text-link light" href="/reos">See the REOS architecture <span>→</span></Link></div>
      </section>

      <section className="lifecycle-section section-pad" id="lifecycle">
        <SectionIntro label="FOLLOW THE PROPERTY" title={<>Twenty-four stages.<br /><em>One continuous state.</em></>} copy="Explore the scalable lifecycle model. Validated research is separated from illustrative sequencing and items that still require jurisdiction-level verification." />
        <LifecycleExplorer />
      </section>

      <section className="role-section section-pad">
        <SectionIntro label="DUAL EXPLORATION" title={<>Enter by role.<br /><em>Or enter by moment.</em></>} copy="See the journey from your position—or start with the stage the property is in now." />
        <DualEntry />
      </section>

      <section className="handoff-section section-pad">
        <SectionIntro label="SEE EVERY DEPENDENCY" title={<>Work does not stop at<br /><em>organisational boundaries.</em></>} />
        <div className="handoff-chain">
          <div><span>01</span><b>Stakeholder A</b><small>Produces information</small></div><i>→</i>
          <div><span>02</span><b>Authority decision</b><small>Changes lifecycle state</small></div><i>→</i>
          <div><span>03</span><b>Prerequisite satisfied</b><small>Unlocks the next party</small></div><i>→</i>
          <div className="highlight"><span>04</span><b>Stakeholder B</b><small>Continues the journey</small></div>
        </div>
        <p className="handoff-note">REOS keeps the dependency, document and decision connected to the property—without replacing the systems that issue or receive them.</p>
      </section>

      <section className="future-section section-pad">
        <div className="future-image" aria-hidden="true" />
        <div className="future-copy"><span className="eyebrow">FRAGMENTED → ORCHESTRATED</span><h2>Shared lifecycle<br /><em>intelligence.</em></h2><p>REOS gives each participant the right view of the same property journey: where it is, what comes next, who is responsible and what evidence moves forward.</p><Link className="button gold" href="/reos">Understand REOS <span>↗</span></Link></div>
        <div className="pillar-list"><div><b>01</b><span>Property Passport</span></div><div><b>02</b><span>Lifecycle State Engine</span></div><div><b>03</b><span>Integration Fabric</span></div><div><b>04</b><span>AI Journey Copilot</span></div></div>
      </section>
    </Page>
  );
}


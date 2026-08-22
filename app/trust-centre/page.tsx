import type { Metadata } from "next";
import Link from "next/link";
import { AssuranceLegend, TrustBoundaryModel } from "../components/EnterpriseReadiness";
import { Page, SectionIntro } from "../components/SiteShell";
import { operationalAssuranceRequirements, trustDomains, trustEvidenceRegister } from "../data/enterprise";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";

export const metadata: Metadata = {
  title: "Enterprise Trust Centre | REOS",
  description: "Review the REOS security, access, auditability, data, evidence and deployment control model without confusing design requirements with production claims.",
};

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const L = (path: string) => localePath(locale, path);
  return <Page className="inner-page enterprise-page" locale={locale}>
    <section className="enterprise-hero">
      <div><span className="eyebrow">REOS ENTERPRISE TRUST CENTRE</span><h1>Trust is a boundary<br /><em>you can inspect.</em></h1><p>Use this centre to understand what REOS governs, what an enterprise pilot must prove and what can only be decided within a customer deployment.</p><div className="hero-actions"><Link className="button gold" href={L("/platform/evaluation")}>Plan a governed evaluation <span>↗</span></Link><Link className="button ghost" href="#control-domains">Review control domains <span>↓</span></Link></div></div>
      <TrustBoundaryModel />
    </section>

    <section className="section-pad assurance-state-section">
      <SectionIntro label="ASSURANCE LANGUAGE" title={<>Evidence first.<br /><em>No implied certification.</em></>} copy="These labels describe how a buyer should evaluate each control. They are assurance states, not product maturity states and not certifications." />
      <AssuranceLegend />
    </section>

    <section className="section-pad trust-domains" id="control-domains">
      <SectionIntro label="ENTERPRISE CONTROL DOMAINS" title={<>Five domains.<br /><em>One accountable boundary.</em></>} copy="Each domain states the business outcome, visible REOS evidence, the proof required during a pilot and the authority or deployment boundary that must remain explicit." />
      <div className="trust-domain-grid">{trustDomains.map((domain) => <article key={domain.id} id={domain.id}><header><span>{domain.number}</span><div><h2>{domain.title}</h2><p>{domain.outcome}</p></div></header><div className="assurance-tags">{domain.states.map((state) => <span key={state}>{state}</span>)}</div><dl><div><dt>Visible evidence</dt><dd>{domain.evidence}</dd></div><div><dt>Pilot proof</dt><dd>{domain.pilot}</dd></div><div><dt>Boundary</dt><dd>{domain.boundary}</dd></div></dl></article>)}</div>
    </section>

    <section className="section-pad trust-evidence-register" id="evidence-register">
      <SectionIntro label="EVIDENCE REGISTER" title={<>Know what exists.<br /><em>Know what must be proved.</em></>} copy="This register separates evidence visible on the public website from evidence that must be produced during a pilot or agreed for a specific deployment. It is not a certification register." />
      <div className="trust-evidence-table" role="table" aria-label="REOS enterprise evidence register">
        <div className="trust-evidence-row trust-evidence-head" role="row"><span role="columnheader">Evidence artifact</span><span role="columnheader">Accountable owner</span><span role="columnheader">Assurance state</span><span role="columnheader">Availability and proof</span></div>
        {trustEvidenceRegister.map((item) => <div className="trust-evidence-row" role="row" key={item.id}><b role="cell">{item.artifact}</b><span role="cell">{item.owner}</span><span role="cell"><i>{item.state}</i></span><span role="cell">{item.availability}</span></div>)}
      </div>
    </section>

    <section className="section-pad operational-assurance-section">
      <SectionIntro label="OPERATIONAL ASSURANCE" title={<>Requirements for evaluation.<br /><em>Not production claims.</em></>} copy="Before bounded use, the buyer and REOS must assign owners, evidence and acceptance decisions for these operational requirements. The public preview does not claim that they are already implemented for a customer deployment." />
      <div className="operational-assurance-grid">{operationalAssuranceRequirements.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>

    <section className="enterprise-decision-gate">
      <div><span className="eyebrow">BUYER DECISION GATE</span><h2>Ask for evidence<br /><em>against your deployment.</em></h2><p>A Trust Centre is a starting point, not a substitute for due diligence. REOS will only treat a control as accepted when its owner, evidence, exception path and acceptance decision are recorded for the scoped deployment.</p></div>
      <ol><li><span>01</span><b>Define</b><p>Control owner, requirement and system boundary.</p></li><li><span>02</span><b>Demonstrate</b><p>Representative evidence in the pilot environment.</p></li><li><span>03</span><b>Review</b><p>Exceptions, remediation and residual risk.</p></li><li><span>04</span><b>Accept</b><p>Named authority records the go / no-go decision.</p></li></ol>
      <div className="hero-actions"><Link className="button gold" href={L("/demo")}>Request an assurance review <span>↗</span></Link><Link className="button ghost" href={L("/platform")}>Return to products</Link></div>
    </section>
  </Page>;
}

export default function TrustCentrePage() { return <View />; }

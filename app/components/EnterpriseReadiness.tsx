import Link from "next/link";
import { assuranceStates, trustDomains } from "../data/enterprise";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";

export function AssuranceLegend() {
  return <div className="assurance-legend" aria-label="Assurance evidence states">
    {assuranceStates.map((item) => <div key={item.state}><span>{item.state}</span><p>{item.meaning}</p></div>)}
  </div>;
}

export function TrustBoundaryModel() {
  return <div className="trust-boundary-model" role="img" aria-label="REOS enterprise boundary model from stakeholder access through orchestration to authoritative systems">
    <div><small>AUTHORIZED USERS</small><b>Organization · Product · Role · Case</b></div>
    <i aria-hidden="true">↓</i>
    <div className="is-core"><small>REOS CONTROLLED WORKSPACE</small><b>Workflow · Evidence · Decisions · Audit</b></div>
    <i aria-hidden="true">↓</i>
    <div><small>APPROVED INTERFACES</small><b>Validated exchange · Failure handling · Reconciliation</b></div>
    <i aria-hidden="true">↓</i>
    <div><small>AUTHORITATIVE SYSTEMS</small><b>Registries · Authorities · Regulated providers</b></div>
  </div>;
}

export function EnterpriseAssurancePreview({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const L = (path: string) => localePath(locale, path);
  return <section className="section-pad enterprise-assurance-preview">
    <div><span className="eyebrow">ENTERPRISE ASSURANCE</span><h2>Inspect the boundary.<br /><em>Then prove the controls.</em></h2><p>REOS separates visible product principles from pilot evidence and deployment-specific decisions. Buyers can therefore evaluate what exists without reading roadmap intent as a production claim.</p><div className="hero-actions"><Link className="button gold" href={L("/trust-centre")}>Open the Trust Centre <span>↗</span></Link><Link className="button ghost" href={L("/platform/evaluation")}>Plan an evaluation</Link></div></div>
    <div className="enterprise-assurance-list">{trustDomains.map((domain) => <article key={domain.id}><span>{domain.number}</span><div><b>{domain.title}</b><p>{domain.outcome}</p></div></article>)}</div>
  </section>;
}

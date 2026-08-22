import type { Metadata } from "next";
import Link from "next/link";
import { Page, SectionIntro } from "../../components/SiteShell";
import { acceptanceCriteria, evaluationStages } from "../../data/enterprise";
import { products } from "../../data/products";
import { DEFAULT_LOCALE, localePath, type Locale } from "../../i18n/config";
import { ProductMaturityBadge } from "../../components/Governance";

export const metadata: Metadata = {
  title: "Enterprise Evaluation & Pilot Process | REOS",
  description: "Scope, pilot, accept and roll out a REOS product through explicit outcomes, controls, acceptance criteria and commercial gates.",
};

export function View({ locale = DEFAULT_LOCALE, selectedProductSlug }: { locale?: Locale; selectedProductSlug?: string }) {
  const L = (path: string) => localePath(locale, path);
  const selectedProduct = products.find((product) => product.slug === selectedProductSlug);
  return <Page className="inner-page enterprise-page" locale={locale}>
    <section className="enterprise-hero evaluation-hero"><div><span className="eyebrow">ENTERPRISE EVALUATION</span><h1>Prove the workflow.<br /><em>Govern the rollout.</em></h1><p>A REOS evaluation is a bounded buying process: one product, one workflow outcome, representative users and cases, explicit acceptance criteria and a named go / no-go authority.</p>{selectedProduct && <p className="evaluation-context"><b>Selected product:</b> {selectedProduct.name} · {selectedProduct.maturity}</p>}<div className="hero-actions"><Link className="button gold" href={`${L("/demo")}${selectedProduct ? `?product=${encodeURIComponent(selectedProduct.slug)}&intent=${encodeURIComponent("Pilot planning")}` : "?intent=Pilot%20planning"}`}>Request a scoped evaluation <span>↗</span></Link><Link className="button ghost" href={L("/trust-centre")}>Review the Trust Centre</Link></div></div><div className="evaluation-charter"><small>PILOT CHARTER</small><dl><div><dt>Scope</dt><dd>One product and bounded workflow</dd></div><div><dt>Evidence</dt><dd>Representative, approved test cases</dd></div><div><dt>Decision</dt><dd>Named acceptance authority</dd></div><div><dt>Exit</dt><dd>Accept, remediate, pause or stop</dd></div></dl></div></section>

    <section className="section-pad evaluation-path">
      <SectionIntro label="PROCUREMENT PATH" title={<>Five decision gates.<br /><em>No ambiguous pilot.</em></>} copy="Every phase ends in a buyer decision and a reusable evidence pack. A demonstration is not treated as a pilot, and a successful pilot is not treated as an unbounded production approval." />
      <ol>{evaluationStages.map((stage) => <li key={stage.number}><span>{stage.number}</span><h2>{stage.title}</h2><p>{stage.decision}</p><small>Required outputs</small><ul>{stage.outputs.map((output) => <li key={output}>{output}</li>)}</ul></li>)}</ol>
    </section>

    <section className="section-pad acceptance-section">
      <SectionIntro label="ACCEPTANCE CRITERIA" title={<>Agree success<br /><em>before configuration begins.</em></>} copy="The final pilot charter should turn these categories into measurable criteria, evidence owners and a named acceptance decision." />
      <div className="acceptance-grid">{acceptanceCriteria.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
    </section>

    <section className="section-pad evaluation-products">
      <SectionIntro label="PRODUCT ENTRY POINTS" title={<>Choose the product.<br /><em>Then choose what to prove.</em></>} copy="Maturity remains explicit throughout evaluation. Access to a preview, early-access cohort or pilot never implies production availability." />
      <div>{products.map((product) => <article key={product.slug} className={product.slug === selectedProductSlug ? "is-selected" : undefined}><header><h2>{product.name}</h2><ProductMaturityBadge maturity={product.maturity} /></header><p>{product.workflowResult}</p><dl><div><dt>Primary buyer</dt><dd>{product.primaryBuyer}</dd></div><div><dt>Evaluation proof</dt><dd>{product.evaluationProof.join(" · ")}</dd></div><div><dt>Boundary</dt><dd>{product.deploymentBoundary}</dd></div></dl><Link className="text-link" href={`${L("/demo")}?product=${encodeURIComponent(product.slug)}&intent=${encodeURIComponent("Pilot planning")}`}>Evaluate this product <span>↗</span></Link></article>)}</div>
    </section>

    <section className="sales-final-cta"><span className="eyebrow">READY TO QUALIFY THE USE CASE?</span><h2>Bring the workflow.<br /><em>Leave with a decision path.</em></h2><p>REOS will help define the outcome, boundary, evidence and acceptance route before asking your team to commit to a pilot.</p><div className="hero-actions"><Link className="button gold" href={L("/demo")}>Request a scoped evaluation <span>↗</span></Link><Link className="button ghost" href={L("/platform")}>Compare products</Link></div></section>
  </Page>;
}

export default async function EvaluationPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) { const params = await searchParams; return <View selectedProductSlug={typeof params.product === "string" ? params.product : undefined} />; }

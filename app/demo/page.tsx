import Link from "next/link";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import type { Metadata } from "next";
import { DemoForm } from "../components/DemoForm";
import { Page } from "../components/SiteShell";
import { ProductMaturityBadge } from "../components/Governance";
import { getProduct, products } from "../data/products";

export const metadata: Metadata = {
  title: "Map Your Property Journey with REOS | Book a Demo",
  description: "Walk through your emirate, asset type and delivery route against the connected model and see where dependencies, approvals and handoffs actually sit.",
};

export function View({ locale = DEFAULT_LOCALE, initialProduct, initialIntent }: { locale?: Locale; initialProduct?: string; initialIntent?: string }) {
  const L = (path: string) => localePath(locale, path);
  return <Page className="inner-page demo-page" locale={locale}>
    <section className="demo-layout atmos atmos-city">
      <div className="demo-intro">
        <span className="eyebrow">BOOK A DEMO</span>
        <h1>Map your property journey<br /><em>with REOS.</em></h1>
        <p>Choose the buying conversation you need: a product walkthrough, a workflow assessment or a governed pilot discussion. We will keep product maturity, evidence and deployment boundaries explicit.</p>
        <p className="demo-audience"><b>Designed for:</b> enterprise buyers, product sponsors, transformation leaders and operational teams across the twelve REOS stakeholder groups.</p>

        <div className="demo-proof">
          <small>TYPICAL OUTCOMES FROM A MAPPING SESSION</small>
          <ul>
            <li>Identify which authority actually governs your project</li>
            <li>Map the approvals and dependency gates still outstanding</li>
            <li>Clarify the escrow, registration and handover checkpoints</li>
            <li>Show which stakeholders and documents each step involves</li>
            <li>Separate what is validated from what still needs confirming</li>
          </ul>
        </div>

        <div className="demo-paths" aria-label="REOS evaluation pathways">
          <article><span>01</span><b>Product walkthrough</b><p>See the product experience and decide whether the workflow is relevant.</p></article>
          <article><span>02</span><b>Workflow assessment</b><p>Map your current process, participants, evidence gaps and desired outcome.</p></article>
          <article><span>03</span><b>Pilot planning</b><p>Define scope, controls, test cases, acceptance criteria and go / no-go authority.</p></article>
        </div>

        <ul className="demo-points">
          <li><b>Bring anything</b><span>A plot under consideration, a project mid-delivery, or a purchase you are trying to understand.</span></li>
          <li><b>Jurisdiction first</b><span>We start by resolving which emirate, zone and authority govern your case, because everything downstream depends on it.</span></li>
          <li><b>No obligation</b><span>You leave with the map whether or not you go further with us.</span></li>
        </ul>

        <div className="demo-product-readiness">
          <small>PRODUCTS AVAILABLE FOR DISCUSSION</small>
          {products.map((product) => <div key={product.slug}><span><b>{product.name}</b><small>{product.maturityNote}</small></span><ProductMaturityBadge maturity={product.maturity} /></div>)}
        </div>

        <div className="demo-next-steps">
          <small>WHAT HAPPENS AFTER SUBMISSION</small>
          <ol><li><span>01</span><b>Delivery is confirmed</b><p>You receive an on-screen reference only after the configured enquiry channel accepts the request.</p></li><li><span>02</span><b>An owner reviews fit</b><p>The REOS product and evaluation owner checks workflow relevance, maturity and requested conversation.</p></li><li><span>03</span><b>The next step is proposed</b><p>If qualified, REOS proposes the appropriate walkthrough, assessment or evaluation-planning session and preparation inputs.</p></li></ol>
          <p>No submission automatically grants product access, pilot approval or commercial acceptance.</p>
        </div>
      </div>

      <div className="demo-form-panel">
        <DemoForm initialProduct={initialProduct} initialIntent={initialIntent} />
        <div className="demo-assurance-links"><Link href={L("/platform/evaluation")}>Review the evaluation process</Link><Link href={L("/trust-centre")}>Open the Trust Centre</Link></div>
      </div>
    </section>

    <section className="integrity-strip">
      <b>What we are not</b>
      <p>REOS does not issue approvals, execute transactions, hold client money or provide legal, financial or tax advice. We explain how the journey works and connect the parties, documents and permissions involved. Binding decisions remain with the relevant authority or regulated provider.</p>
    </section>
  </Page>;
}

export default async function DemoPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const slug = typeof params.product === "string" ? params.product : "";
  const product = getProduct(slug);
  const intent = typeof params.intent === "string" ? params.intent : undefined;
  return <View locale={DEFAULT_LOCALE} initialProduct={product?.name} initialIntent={intent} />;
}

import type { Metadata } from "next";
import Link from "next/link";
import { BeforeAfterWorkflow, PersonaProductDemo, PlatformHeroPreview, ProductWorkflowDemo } from "../components/PlatformProductExperience";
import { Page, SectionIntro } from "../components/SiteShell";
import { products } from "../data/products";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";

export const metadata: Metadata = {
  title: "Property Workflow Automation Products | REOS Platform",
  description: "See how REOS products coordinate property cases, evidence, approvals and stakeholder handoffs—starting with Title Deed Automation and NOC Automation.",
};

const stakeholderGroups = [
  "Landowners & Investors", "Developers", "Consultants & Designers", "Authorities & Regulators",
  "Utility Providers", "Contractors", "Suppliers & Vendors", "Brokers & Agencies",
  "Banks & Financial Institutions", "Property Owners", "Residents & Tenants", "Facility & Community Operators",
];

const capabilities = [
  ["01", "Case orchestration", "Turn a multi-party process into a controlled sequence of states, owners, actions and handoffs."],
  ["02", "Evidence readiness", "Know which documents are required, current, verified, missing or blocking the next step."],
  ["03", "Stakeholder workspace", "Give each participant the right case context without losing one shared operational record."],
  ["04", "Rules-aware routing", "Apply the selected process, jurisdiction, issuer and prerequisites to the work in front of the team."],
  ["05", "Approvals & dependencies", "Connect clarifications, clearances, decisions and downstream work to the case that caused them."],
  ["06", "Audit & control", "Preserve ownership, timestamps, evidence versions and decision history for later review."],
];

const useCases = [
  ["Developers", "Coordinate registration, NOC and handover workflows across internal teams, consultants and external parties."],
  ["Agencies & brokers", "See case readiness, outstanding customer evidence and the next party responsible for progression."],
  ["Authorities & regulated providers", "Receive more structured submissions and keep clarifications connected to the original request."],
  ["Owners & residents", "Understand what is required, what has been submitted and what must happen before the next milestone."],
];

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const L = (path: string) => localePath(locale, path);
  const productAccess = products.map((product) => ({ ...product, accessHref: L(`/platform/products/${product.slug}/login`) }));

  return <Page className="inner-page" locale={locale}>
    <section className="sales-hero">
      <div className="sales-hero-copy">
        <span className="eyebrow">REOS PRODUCT PLATFORM · B2B · B2G · B2C</span>
        <h1>Automate property workflows.<br /><em>Keep every party aligned.</em></h1>
        <p>REOS turns fragmented, multi-party property processes into licensed digital products—with one case state for the workflow, evidence, approvals, ownership and audit history.</p>
        <div className="hero-actions">
          <Link className="button gold" href={L("/demo")}>Request a demo <span>↗</span></Link>
          <Link className="button ghost" href="#product-experience">Explore the product <span>↓</span></Link>
        </div>
        <div className="sales-hero-proof" role="group" aria-label="REOS product roadmap">
          <span><i>01</i><b>Title Deed Automation</b><small>First product · licensing preview</small></span>
          <span><i>02</i><b>NOC Automation</b><small>Next product · in development</small></span>
        </div>
      </div>
      <PlatformHeroPreview products={productAccess} />
    </section>

    <section className="sales-trust-strip" aria-label="REOS product principles">
      <span><b>ONE CASE STATE</b><small>Across evidence, actions and decisions</small></span>
      <span><b>ROLE-BASED WORK</b><small>For every participating stakeholder</small></span>
      <span><b>PRODUCT LICENSING</b><small>By organization, product and entitlement</small></span>
      <span><b>OFFICIAL SYSTEMS REMAIN AUTHORITATIVE</b><small>REOS coordinates the operational work</small></span>
    </section>

    <section className="section-pad sales-problem">
      <SectionIntro label="THE OPERATING PROBLEM" title={<>The delay is rarely<br /><em>one missing form.</em></>} copy="Property work slows when evidence, responsibility and decisions are distributed across many parties without one shared view of what is ready, what is blocked and who acts next." />
      <BeforeAfterWorkflow />
    </section>

    <section className="section-pad sales-solution">
      <div className="sales-solution-copy">
        <span className="eyebrow">THE REOS PRODUCT MODEL</span>
        <h2>One operating model.<br /><em>A product for each workflow.</em></h2>
        <p>Every REOS product applies the same controlled operating model to a specific property workflow. That makes the suite consistent for users—and extensible as new processes are added.</p>
        <Link className="text-link" href={L("/ecosystem")}>See the Journey × Stakeholder model <span>↗</span></Link>
      </div>
      <div className="sales-solution-stack" role="group" aria-label="REOS product operating model">
        <span><i>05</i><b>Official channels & systems of record</b><small>Submit, receive and reconcile authoritative outcomes</small></span>
        <span><i>04</i><b>Stakeholder handoffs</b><small>Owners, roles, clarifications and dependencies</small></span>
        <span><i>03</i><b>Evidence & decisions</b><small>Documents, checks, versions and approvals</small></span>
        <span><i>02</i><b>Guided workflow</b><small>States, actions, rules and next steps</small></span>
        <span><i>01</i><b>Shared case record</b><small>The operational source of truth for the work</small></span>
      </div>
    </section>

    <section className="section-pad sales-how" id="product-experience">
      <SectionIntro label="HOW IT WORKS" title={<>From case opened<br /><em>to outcome prepared.</em></>} copy="Select a product, then step through the workflow. The product guides the work while people and official systems retain their required authority." />
      <ProductWorkflowDemo />
    </section>

    <section className="section-pad sales-experience">
      <SectionIntro label="THE PRODUCT EXPERIENCE" title={<>One workflow.<br /><em>The right view for each role.</em></>} copy="Operations, reviewers and executives need different levels of detail. REOS gives each role the context it needs without creating separate versions of the truth." />
      <PersonaProductDemo />
    </section>

    <section className="section-pad sales-capabilities">
      <SectionIntro label="CORE CAPABILITIES" title={<>Built for real<br /><em>property operations.</em></>} copy="The product experience is designed around the controls that multi-party property workflows actually need—not a generic task list." />
      <div className="sales-capability-grid">
        {capabilities.map(([number, title, copy], index) => <details key={title} open={index === 0}><summary><span>{number}</span><b>{title}</b><i aria-hidden="true">+</i></summary><p>{copy}</p></details>)}
      </div>
    </section>

    <section className="sales-outcomes">
      <div><span className="eyebrow">BUSINESS VALUE</span><h2>Move from process chasing<br /><em>to operational control.</em></h2><p>REOS is designed to reduce avoidable uncertainty in complex workflows—not by replacing required authority, but by making the work around it visible, structured and accountable.</p></div>
      <div className="sales-outcome-grid">
        <article><span>01</span><h3>Clear accountability</h3><p>Every active action has an owner, reason and visible next handoff.</p></article>
        <article><span>02</span><h3>Earlier readiness</h3><p>Surface missing evidence and prerequisites before they become late-stage blockers.</p></article>
        <article><span>03</span><h3>Fewer blind spots</h3><p>See case status and dependencies across teams, organizations and customer touchpoints.</p></article>
        <article><span>04</span><h3>Traceable decisions</h3><p>Keep evidence, reviews, clarifications and versions connected to the case history.</p></article>
      </div>
    </section>

    <section className="section-pad sales-ai">
      <div className="sales-ai-copy">
        <span className="eyebrow">AI & AUTOMATION</span><h2>AI-assisted.<br /><em>Workflow-governed.</em></h2>
        <p>REOS can help teams detect missing evidence, summarize case context and propose the next action. Recommendations stay grounded in the workflow, applicable rules and the evidence attached to the case.</p>
        <ul>
          <li><i>01</i><span><b>AI suggests</b><small>Completeness checks, exceptions, summaries and next-action guidance.</small></span></li>
          <li><i>02</i><span><b>Authorized users decide</b><small>People retain responsibility for reviews, submissions and approvals.</small></span></li>
          <li><i>03</i><span><b>Evidence stays connected</b><small>Every recommendation can be reviewed against the case context that produced it.</small></span></li>
        </ul>
      </div>
      <div className="sales-ai-panel" role="group" aria-label="Illustrative REOS AI assistant preview">
        <header><span><b>REOS ASSIST</b><small>Case readiness copilot</small></span><i>AI</i></header>
        <div className="sales-ai-query"><small>CASE TD-1048 · READINESS CHECK</small><p>Can this case progress to registration review?</p></div>
        <div className="sales-ai-response"><span>RECOMMENDATION</span><h3>Resolve two evidence gaps first.</h3><p>The party and property checks are ready. Seller authority evidence and the current clearance remain outstanding.</p><ol><li><i>!</i><span>Request seller authority evidence</span></li><li><i>!</i><span>Attach current clearance / NOC</span></li><li><i>→</i><span>Re-run readiness check</span></li></ol></div>
        <footer>Illustrative product preview · Final decisions remain with authorized users and official systems.</footer>
      </div>
    </section>

    <section className="section-pad sales-use-cases">
      <SectionIntro label="WHO IT SERVES" title={<>One connected workflow.<br /><em>Value for every participant.</em></>} copy="Products can support B2B, B2G and B2C interactions while tailoring access to the role, organization and licensed service." />
      <div className="sales-use-case-grid">{useCases.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      <details className="sales-all-stakeholders"><summary>View all 12 stakeholder groups <span>+</span></summary><div>{stakeholderGroups.map((group, index) => <span key={group}><i>{String(index + 1).padStart(2, "0")}</i>{group}</span>)}</div></details>
    </section>

    <section className="section-pad sales-why">
      <div><span className="eyebrow">WHY REOS</span><h2>More than workflow software.<br /><em>A property operating system.</em></h2></div>
      <div className="sales-why-grid">
        <article><b>Journey-aware</b><p>Every product sits within the seven-stage property lifecycle, not an isolated transaction screen.</p></article>
        <article><b>Stakeholder-aware</b><p>The operating model recognizes all twelve groups and the different responsibilities between them.</p></article>
        <article><b>Evidence-aware</b><p>Actions, decisions and approvals remain connected to the documents and rules that support them.</p></article>
        <article><b>Commercially modular</b><p>Organizations license the products, roles and service scope they need as the suite grows.</p></article>
      </div>
    </section>

    <section className="section-pad platform-catalogue" id="product-catalogue">
      <SectionIntro label="PRODUCT CATALOGUE" title={<>Start with one workflow.<br /><em>Expand through the suite.</em></>} copy="Each REOS product has a defined operational scope, participating stakeholders and its own licence-controlled access gateway." />
      <div className="platform-product-grid sales-product-grid">
        {productAccess.map((product) => <article key={product.slug} id={product.slug}>
          <header><span>{String(product.number).padStart(2, "0")}</span><div><b>{product.status}</b><small>{product.availability}</small></div></header>
          <small>{product.category}</small><h3>{product.name}</h3><p>{product.summary}</p><blockquote>{product.outcome}</blockquote>
          <div className="platform-market-tags">{product.markets.map((market) => <span key={market}>{market}</span>)}</div>
          <dl><div><dt>Built for</dt><dd>{product.stakeholders.join(" · ")}</dd></div><div><dt>Product scope</dt><dd>{product.capabilities.join(" · ")}</dd></div></dl>
          <div className="sales-card-actions"><Link className="platform-product-access" href={product.accessHref}>View product gateway <span>↗</span></Link><Link className="platform-product-access" href={L("/demo")}>Request a demo <span>↗</span></Link></div>
        </article>)}
      </div>
    </section>

    <section className="sales-final-cta">
      <span className="eyebrow">SEE REOS IN YOUR WORKFLOW</span><h2>Bring us the process<br /><em>your team is chasing today.</em></h2>
      <p>We’ll show how REOS can structure the case, evidence, responsibilities and handoffs—and discuss the right product and licence scope for your organization.</p>
      <div className="hero-actions"><Link className="button gold" href={L("/demo")}>Request a product demo <span>↗</span></Link><Link className="button ghost" href={L("/ecosystem")}>Explore the operating model</Link></div>
    </section>
  </Page>;
}

export default function PlatformPage() { return <View locale={DEFAULT_LOCALE} />; }

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ReosProduct } from "../data/products";
import { ProductMaturityBadge } from "./Governance";
import { platformScreenEvent } from "./PlatformLifecycleExplorer";

type ProductAccess = ReosProduct & { accessHref: string };

type ProductPreview = {
  eyebrow: string;
  workspace: string;
  stage: string;
  progress: string;
  owner: string;
  due: string;
  cases: Array<{ id: string; property: string; state: string; tone: "gold" | "teal" | "neutral" }>;
  checks: Array<{ label: string; state: string; complete: boolean }>;
  nextAction: string;
};

const productPreviews: Record<string, ProductPreview> = {
  "title-deed-automation": {
    eyebrow: "OWNERSHIP & REGISTRATION",
    workspace: "Title transfer workspace",
    stage: "Evidence review",
    progress: "4 of 6 checks ready",
    owner: "Registration team",
    due: "Action required",
    cases: [
      { id: "TD-1048", property: "Palm Residence · Villa 18", state: "Evidence review", tone: "gold" },
      { id: "TD-1047", property: "Creek House · Unit 1204", state: "Authority review", tone: "teal" },
      { id: "TD-1042", property: "Marina Tower · Unit 704", state: "Ready to progress", tone: "neutral" },
    ],
    checks: [
      { label: "Party identity & authority", state: "Verified", complete: true },
      { label: "Property record", state: "Verified", complete: true },
      { label: "Seller authority evidence", state: "Missing", complete: false },
      { label: "Current clearance / NOC", state: "Required", complete: false },
    ],
    nextAction: "Request the two missing evidence items before sending the case for review.",
  },
  "noc-automation": {
    eyebrow: "APPROVALS & CLEARANCES",
    workspace: "NOC request workspace",
    stage: "Prerequisite check",
    progress: "5 of 7 checks ready",
    owner: "Approvals coordinator",
    due: "Clarification needed",
    cases: [
      { id: "NOC-2084", property: "Community A · Fit-out NOC", state: "Prerequisite check", tone: "gold" },
      { id: "NOC-2080", property: "Tower B · Utility NOC", state: "Issuer review", tone: "teal" },
      { id: "NOC-2076", property: "Villa 44 · Transfer NOC", state: "Decision received", tone: "neutral" },
    ],
    checks: [
      { label: "NOC type & purpose", state: "Confirmed", complete: true },
      { label: "Issuer & jurisdiction", state: "Resolved", complete: true },
      { label: "Fee / account clearance", state: "Missing", complete: false },
      { label: "Supporting drawing", state: "Revision needed", complete: false },
    ],
    nextAction: "Resolve the account clearance and request the latest drawing revision before submission.",
  },
};

const workflows = {
  title: {
    name: "Title Deed Automation",
    steps: [
      ["Open the case", "Capture the property, transaction purpose, parties and requested outcome in one controlled record."],
      ["Verify parties & property", "Check identity, authority, ownership context and the property record before work advances."],
      ["Assemble the evidence", "Track required documents, versions, missing items and readiness against the selected workflow."],
      ["Coordinate review", "Assign the next action, route clarifications and keep every participant working from the same case state."],
      ["Prepare completion", "Package the approved evidence and preserve a traceable history while the official registry remains authoritative."],
    ],
  },
  noc: {
    name: "NOC Automation",
    steps: [
      ["Select the NOC type", "Define the purpose and select the right workflow instead of treating every NOC as the same request."],
      ["Resolve issuer & rules", "Identify the jurisdiction, issuing party and applicable prerequisites for the selected request."],
      ["Check prerequisites", "Validate required evidence, clearances, drawings and dependencies before submission."],
      ["Manage clarifications", "Keep responses, revised evidence, ownership and due actions connected to the request."],
      ["Track the decision", "Record the outcome, expiry and downstream dependency so the next process can start with context."],
    ],
  },
} as const;

const personaViews = {
  operations: {
    label: "Operations",
    title: "Know what needs action next.",
    copy: "A shared queue makes the case owner, current state, outstanding evidence and next handoff visible without chasing separate inboxes.",
    rows: [["TD-1048", "Request seller authority", "Registration team"], ["TD-1047", "Monitor authority review", "Case coordinator"], ["NOC-2084", "Resolve account clearance", "Approvals team"]],
  },
  reviewer: {
    label: "Reviewer",
    title: "Review the evidence, not the noise.",
    copy: "Structured checks surface incomplete, conflicting or superseded evidence before a decision pack progresses.",
    rows: [["Identity & authority", "Verified", "Ready"], ["Property record", "Verified", "Ready"], ["Current clearance", "Required", "Action"]],
  },
  executive: {
    label: "Executive",
    title: "See flow, ownership and risk.",
    copy: "A portfolio view shows where work is accumulating, why cases are waiting and which handoffs need intervention.",
    rows: [["Intake", "Cases entering", "Stable"], ["Evidence review", "Primary constraint", "Watch"], ["Authority review", "External dependency", "Monitor"]],
  },
} as const;

function ProductTabs({ products, selectedSlug, onSelect }: { products: ProductAccess[]; selectedSlug: string; onSelect: (slug: string) => void }) {
  return (
    <div className="sales-product-tabs" role="tablist" aria-label="Select a REOS product preview">
      {products.map((product) => (
        <button
          key={product.slug}
          type="button"
          role="tab"
          aria-selected={selectedSlug === product.slug}
          className={selectedSlug === product.slug ? "is-active" : ""}
          onClick={() => onSelect(product.slug)}
        >
          <i>{String(product.number).padStart(2, "0")}</i>
          <span><b>{product.name}</b><ProductMaturityBadge maturity={product.maturity} /></span>
        </button>
      ))}
    </div>
  );
}

function ProductDashboard({ preview, product }: { preview: ProductPreview; product: ProductAccess }) {
  return (
    <div className="sales-app-frame" data-product-demo={product.slug}>
      <header className="sales-app-topbar">
        <span className="sales-app-mark">REOS</span>
        <div><b>{preview.workspace}</b><small>Illustrative product preview</small></div>
        <button type="button" aria-label="Sample user menu">RK</button>
      </header>
      <div className="sales-app-body">
        <nav className="sales-app-nav" aria-label="Product preview navigation">
          <span className="is-active">Overview</span><span>Cases</span><span>Evidence</span><span>Reviews</span><span>Audit</span>
        </nav>
        <main className="sales-app-main">
          <div className="sales-app-heading">
            <div><small>{preview.eyebrow}</small><h2>Case workspace</h2></div>
            <span>{product.markets.join(" · ")}</span>
          </div>
          <div className="sales-case-layout">
            <section className="sales-case-list" aria-label="Sample case queue">
              <header><b>Active cases</b><span>Shared queue</span></header>
              {preview.cases.map((item, index) => (
                <article className={index === 0 ? "is-selected" : ""} key={item.id}>
                  <i className={`tone-${item.tone}`} aria-hidden="true" />
                  <div><b>{item.id}</b><span>{item.property}</span></div>
                  <small>{item.state}</small>
                </article>
              ))}
            </section>
            <section className="sales-case-detail" aria-label="Selected sample case">
              <div className="sales-case-status">
                <span><small>Current stage</small><b>{preview.stage}</b></span>
                <span><small>Readiness</small><b>{preview.progress}</b></span>
                <span><small>Owner</small><b>{preview.owner}</b></span>
              </div>
              <div className="sales-readiness">
                <header><div><b>Evidence readiness</b><small>AI-assisted completeness check</small></div><span>{preview.due}</span></header>
                {preview.checks.map((check) => (
                  <div key={check.label}><i className={check.complete ? "is-complete" : ""}>{check.complete ? "✓" : "!"}</i><b>{check.label}</b><span>{check.state}</span></div>
                ))}
              </div>
              <aside className="sales-next-action"><small>RECOMMENDED NEXT ACTION</small><p>{preview.nextAction}</p><button type="button">Prepare request <span>→</span></button></aside>
              <div className="sales-case-activity"><span><small>RECENT ACTIVITY</small><b>Evidence review updated</b></span><span><small>AUDIT HISTORY</small><b>Owner and change recorded</b></span></div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export function PlatformHeroPreview({ products }: { products: ProductAccess[] }) {
  const [selectedSlug, setSelectedSlug] = useState(products[0]?.slug ?? "");
  const product = products.find((item) => item.slug === selectedSlug) ?? products[0];
  const preview = productPreviews[product.slug];

  return (
    <div className="sales-hero-product" role="group" aria-label="Interactive REOS product preview">
      <ProductTabs products={products} selectedSlug={product.slug} onSelect={setSelectedSlug} />
      <ProductDashboard key={product.slug} product={product} preview={preview} />
      <div className="sales-preview-footer">
        <span>Preview the workflow now. Product access remains licence-controlled.</span>
        <Link href={product.accessHref}>View {product.name} gateway <b>↗</b></Link>
      </div>
    </div>
  );
}

export function BeforeAfterWorkflow() {
  const [mode, setMode] = useState<"before" | "after">("before");
  const before = mode === "before";
  const items = before
    ? [["01", "Scattered evidence", "Files and status live across inboxes, folders and separate parties."], ["02", "Unclear ownership", "The next responsible person is discovered through follow-up."], ["03", "Late exceptions", "Missing prerequisites surface after work has already advanced."], ["04", "Fragmented history", "Decisions and revisions are difficult to reconstruct."]]
    : [["01", "One case state", "Evidence, status and participants share a controlled operational record."], ["02", "Explicit ownership", "Every action has an owner, reason, dependency and visible next step."], ["03", "Readiness checks", "Missing evidence and prerequisites are surfaced before the next handoff."], ["04", "Traceable decisions", "Reviews, clarifications and versions remain connected to the case."]];

  return (
    <div className={`sales-comparison ${before ? "is-before" : "is-after"}`}>
      <div className="sales-comparison-tabs" role="tablist" aria-label="Compare property workflows">
        <button type="button" role="tab" aria-selected={before} className={before ? "is-active" : ""} onClick={() => setMode("before")}>Before REOS</button>
        <button type="button" role="tab" aria-selected={!before} className={!before ? "is-active" : ""} onClick={() => setMode("after")}>With REOS</button>
      </div>
      <div className="sales-comparison-grid" aria-live="polite">
        {items.map(([number, title, copy]) => <article key={title}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}
      </div>
    </div>
  );
}

const screenViews = {
  title: { label: "Title Deed", maturity: "Early Access", title: "Registration readiness", copy: "Track party, property and evidence checks before a case progresses.", metric: "Evidence review", rows: [["Party identity & authority", "Verified", "Registration team"], ["Property record", "Verified", "Registration team"], ["Seller authority evidence", "Action required", "Case owner"]] },
  noc: { label: "NOC", maturity: "Concept Experience · Coming Soon", title: "Clearance coordination", copy: "Resolve the issuer, prerequisites and supporting evidence in one case context.", metric: "Concept workflow", rows: [["NOC type & purpose", "Confirmed", "Approvals team"], ["Issuer & jurisdiction", "Resolved", "Approvals team"], ["Supporting drawing", "Revision needed", "Consultant"]] },
  cancellation: { label: "Unit Cancellation", maturity: "Concept · Coming Soon", title: "Controlled cancellation case", copy: "Illustrative concept for approval, refund evidence and inventory-release coordination.", metric: "Concept workflow", rows: [["Cancellation request", "Captured", "Customer operations"], ["Commercial review", "Pending", "Finance"], ["Inventory release", "Blocked", "Authorized owner"]] },
  approval: { label: "Workflow Approval", maturity: "Concept Experience · Coming Soon", title: "Decision workspace", copy: "Review the action, evidence, authority and downstream consequence together.", metric: "Concept workflow", rows: [["Evidence completeness", "Ready", "Reviewer"], ["Authority boundary", "Confirmed", "Process owner"], ["Approval decision", "Pending", "Authorized approver"]] },
  customer: { label: "Customer Journey", maturity: "Concept · Coming Soon", title: "Handover visibility", copy: "Illustrative concept for inspections, snagging, acceptance and key release.", metric: "3 of 5 gates ready", rows: [["Inspection", "Scheduled", "Handover team"], ["Snag resolution", "In progress", "Contractor"], ["Customer acceptance", "Waiting", "Property owner"]] },
  governance: { label: "Governance Monitoring", maturity: "Concept Experience · Coming Soon", title: "Operational control view", copy: "See case state, ownership, exceptions and boundary-sensitive actions across the workflow.", metric: "Concept workflow", rows: [["Cases waiting on evidence", "Watch", "Operations"], ["Overdue handoffs", "Review", "Process owner"], ["Authority decisions", "External boundary", "Executive"]] },
} as const;

export function PlatformScreenGallery() {
  const [screen, setScreen] = useState<keyof typeof screenViews>("title");
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    function selectRequestedScreen(event: Event) {
      const key = (event as CustomEvent).detail as keyof typeof screenViews;
      if (key in screenViews) { setScreen(key); requestAnimationFrame(() => headingRef.current?.focus()); }
    }
    window.addEventListener(platformScreenEvent, selectRequestedScreen);
    return () => window.removeEventListener(platformScreenEvent, selectRequestedScreen);
  }, []);
  const view = screenViews[screen];
  return <div className="platform-screen-gallery" id="platform-screen-gallery">
    <div className="platform-screen-tabs" role="tablist" aria-label="Select an illustrative REOS platform screen">
      {(Object.keys(screenViews) as Array<keyof typeof screenViews>).map((key) => <button key={key} type="button" role="tab" aria-selected={screen === key} className={screen === key ? "is-active" : ""} onClick={() => setScreen(key)}>{screenViews[key].label}</button>)}
    </div>
    <div className="platform-screen-frame" key={screen} aria-live="polite">
      <header><span><b>REOS</b><small>Illustrative product preview</small></span><i>{view.maturity}</i></header>
      <div className="platform-screen-body"><nav aria-label="Illustrative screen navigation"><span className="is-active">Overview</span><span>Cases</span><span>Evidence</span><span>Decisions</span><span>Audit</span></nav><main><div className="platform-screen-heading"><div><small>{view.label.toUpperCase()}</small><h3 ref={headingRef} tabIndex={-1}>{view.title}</h3><p>{view.copy}</p></div><strong>{view.metric}</strong></div><div className="platform-screen-kpis" aria-label="Illustrative workflow indicators"><span><small>Current status</small><b>{view.rows[0][1]}</b></span><span><small>Workflow stage</small><b>Evidence review</b></span><span><small>Responsible role</small><b>{view.rows[0][2]}</b></span><span><small>Data state</small><b>Demonstration only</b></span></div><section>{view.rows.map(([item, state, owner], index) => <article key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b><i>{state}</i><small>{owner}</small></article>)}</section><div className="platform-screen-audit"><div><small>WORKFLOW TIMELINE</small><ol><li className="is-complete">Case opened</li><li className="is-complete">Evidence assembled</li><li>Approval review</li><li>Outcome recorded</li></ol></div><div><small>RECENT ACTIVITY · ILLUSTRATIVE</small><p><b>01</b> Evidence check updated</p><p><b>02</b> Review assigned</p><p><b>03</b> Supporting document received</p></div></div><aside><small>PRODUCT BOUNDARY</small><p>{view.maturity.includes("Concept") ? "Concept Experience only. Scope, integration and availability require validation; this is not a live operational product." : "REOS coordinates work and evidence; authorized people and official systems retain decision authority."}</p></aside></main></div>
    </div>
  </div>;
}

export function ProductWorkflowDemo() {
  const [productKey, setProductKey] = useState<keyof typeof workflows>("title");
  const [step, setStep] = useState(0);
  const workflow = workflows[productKey];
  const selected = workflow.steps[step];

  function selectProduct(key: keyof typeof workflows) {
    setProductKey(key);
    setStep(0);
  }

  return (
    <div className="sales-workflow-demo">
      <div className="sales-workflow-products" role="tablist" aria-label="Choose product workflow">
        <button type="button" role="tab" aria-selected={productKey === "title"} className={productKey === "title" ? "is-active" : ""} onClick={() => selectProduct("title")}>Title Deed Automation</button>
        <button type="button" role="tab" aria-selected={productKey === "noc"} className={productKey === "noc" ? "is-active" : ""} onClick={() => selectProduct("noc")}>NOC Automation</button>
      </div>
      <div className="sales-workflow-steps">
        <ol>
          {workflow.steps.map(([title], index) => (
            <li key={title}>
              <button type="button" className={step === index ? "is-active" : ""} aria-current={step === index ? "step" : undefined} onClick={() => setStep(index)}>
                <span>{String(index + 1).padStart(2, "0")}</span><b>{title}</b>
              </button>
            </li>
          ))}
        </ol>
        <section key={`${productKey}-${step}`} aria-live="polite">
          <small>{workflow.name} · STEP {String(step + 1).padStart(2, "0")}</small>
          <h3>{selected[0]}</h3>
          <p>{selected[1]}</p>
          <div className="sales-workflow-card">
            <header><span>CASE TD-1048</span><b>{selected[0]}</b></header>
            <div><i className="is-complete">✓</i><span>Previous gate</span><b>{step === 0 ? "Case initiated" : workflow.steps[step - 1][0]}</b></div>
            <div><i>{step + 1}</i><span>Current action</span><b>{selected[0]}</b></div>
            <div><i>→</i><span>Next handoff</span><b>{step === workflow.steps.length - 1 ? "Workflow complete" : workflow.steps[step + 1][0]}</b></div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function PersonaProductDemo() {
  const [persona, setPersona] = useState<keyof typeof personaViews>("operations");
  const view = personaViews[persona];
  return (
    <div className="sales-persona-demo">
      <div className="sales-persona-tabs" role="tablist" aria-label="View the product by user role">
        {(Object.keys(personaViews) as Array<keyof typeof personaViews>).map((key) => (
          <button key={key} type="button" role="tab" aria-selected={persona === key} className={persona === key ? "is-active" : ""} onClick={() => setPersona(key)}>{personaViews[key].label}</button>
        ))}
      </div>
      <div className="sales-persona-panel" key={persona} aria-live="polite">
        <div><small>{view.label.toUpperCase()} VIEW</small><h3>{view.title}</h3><p>{view.copy}</p></div>
        <section>
          <header><span>{view.label} workspace</span><small>ILLUSTRATIVE PRODUCT PREVIEW</small></header>
          {view.rows.map(([item, state, owner]) => <article key={item}><b>{item}</b><span>{state}</span><small>{owner}</small></article>)}
        </section>
      </div>
    </div>
  );
}

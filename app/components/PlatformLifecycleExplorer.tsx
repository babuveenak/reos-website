"use client";

import Link from "next/link";
import { useRef, useState } from "react";

type ScreenKey = "title" | "noc" | "cancellation" | "approval" | "customer" | "governance";
type Stage = { name: string; purpose: string; business: string; workflow: string; roles: string; capability: string; maturity: "Early Access" | "Coming Soon"; boundary: string; value: string; screen: ScreenKey };

const stages: Stage[] = [
  { name: "Plot", purpose: "Establish the governed land and ownership context.", business: "Development readiness", workflow: "Plot context → ownership evidence → readiness review", roles: "Landowners · Developers · Authorities", capability: "Enterprise Integration Layer", maturity: "Coming Soon", boundary: "Concept capability; records and authority decisions remain in official source systems.", value: "Start development work with clearer source context.", screen: "governance" },
  { name: "Project", purpose: "Coordinate project readiness, dependencies and approvals.", business: "Project governance", workflow: "Project setup → dependency mapping → approval coordination", roles: "Developers · Consultants · Authorities", capability: "Enterprise Integration Layer", maturity: "Coming Soon", boundary: "Concept capability; project approvals remain with authorized parties.", value: "Make project dependencies and ownership visible.", screen: "approval" },
  { name: "Unit", purpose: "Create a controlled unit context for downstream work.", business: "Unit readiness", workflow: "Unit record → evidence checks → controlled activation", roles: "Developers · Sales · Authorities", capability: "AI Document Intelligence", maturity: "Coming Soon", boundary: "Concept capability; official unit records remain authoritative in designated systems.", value: "Reduce ambiguity between unit, evidence and status.", screen: "approval" },
  { name: "Sales", purpose: "Connect the buyer, unit, terms and supporting evidence.", business: "Sales operations", workflow: "Reservation → eligibility → evidence coordination", roles: "Developers · Agencies · Buyers", capability: "Enterprise Integration Layer", maturity: "Coming Soon", boundary: "Concept capability; commercial approval and contracting remain with authorized teams.", value: "Give sales and operations one visible handoff path.", screen: "governance" },
  { name: "Handover", purpose: "Coordinate inspection, snagging, acceptance and release.", business: "Customer operations", workflow: "Readiness → inspection → acceptance → key release", roles: "Developers · Contractors · Owners", capability: "Customer Handover", maturity: "Coming Soon", boundary: "Concept capability; formal acceptance and release remain authorized human actions.", value: "Prepare customers and teams around shared milestones.", screen: "customer" },
  { name: "Title Deed", purpose: "Prepare a registration-ready case with visible accountability.", business: "Ownership and registration", workflow: "Case intake → evidence validation → review coordination → status visibility", roles: "Developers · Owners · Registration teams", capability: "Title Deed Automation", maturity: "Early Access", boundary: "REOS coordinates workflow, validation, accountability and status visibility. Official systems and authorized people retain authority over formal review, submission and decision-making.", value: "Coordinate evidence and next actions in one governed case.", screen: "title" },
  { name: "NOC", purpose: "Resolve prerequisites, issuer context and supporting evidence.", business: "Approvals and clearances", workflow: "NOC selection → prerequisite checks → clarification coordination", roles: "Owners · Operators · Authorized issuers", capability: "NOC Automation", maturity: "Coming Soon", boundary: "Concept capability; authorized issuers retain responsibility for official NOC decisions.", value: "See what is missing before a request progresses.", screen: "noc" },
  { name: "Resale", purpose: "Coordinate transfer readiness across ownership and clearance context.", business: "Property transactions", workflow: "Transfer request → clearance readiness → evidence coordination", roles: "Owners · Agencies · Banks", capability: "Enterprise Integration Layer", maturity: "Coming Soon", boundary: "Concept capability; transfer decisions remain with authorized systems and people.", value: "Connect resale dependencies to a visible case state.", screen: "governance" },
  { name: "Cancellation", purpose: "Control approvals, settlement evidence and inventory release.", business: "Commercial governance", workflow: "Request → commercial review → decision → inventory action", roles: "Developers · Finance · Customers", capability: "Unit Cancellation", maturity: "Coming Soon", boundary: "Concept capability; financial and inventory decisions require authorized approval.", value: "Keep sensitive reversals traceable and role-controlled.", screen: "cancellation" },
  { name: "Operations", purpose: "Connect occupancy, service and asset operating context.", business: "Property operations", workflow: "Occupancy → service coordination → governed operating record", roles: "Operators · Residents · Utility providers", capability: "Enterprise Integration Layer", maturity: "Coming Soon", boundary: "Concept capability; operational source systems retain their designated authority.", value: "Carry useful property context into ongoing operations.", screen: "governance" },
];

export const platformScreenEvent = "reos:platform-screen";

export function PlatformLifecycleExplorer({ demoHref }: { demoHref: string }) {
  const [selected, setSelected] = useState(5);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const stage = stages[selected];
  function select(index: number, focus = false) { setSelected(index); if (focus) buttons.current[index]?.focus(); }
  function onKeyDown(event: React.KeyboardEvent, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % stages.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + stages.length) % stages.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = stages.length - 1;
    else return;
    event.preventDefault(); select(next, true);
  }
  function showScreen() {
    window.dispatchEvent(new CustomEvent(platformScreenEvent, { detail: stage.screen }));
    document.getElementById("platform-screen-gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  const discussionHref = `${demoHref}?intent=${encodeURIComponent(`Discuss planned capability: ${stage.capability}`)}`;
  return <div className="platform-lifecycle-explorer">
    <div className="platform-lifecycle-tabs" role="tablist" aria-label="Property lifecycle product discovery">
      {stages.map((item, index) => <button key={item.name} ref={(node) => { buttons.current[index] = node; }} type="button" role="tab" aria-selected={selected === index} aria-controls="platform-lifecycle-panel" tabIndex={selected === index ? 0 : -1} className={selected === index ? "is-active" : ""} onClick={() => select(index)} onKeyDown={(event) => onKeyDown(event, index)}><span>{String(index + 1).padStart(2, "0")}</span><b>{item.name}</b></button>)}
    </div>
    <section id="platform-lifecycle-panel" role="tabpanel" aria-live="polite" className="platform-lifecycle-panel">
      <header><div><small>STAGE {String(selected + 1).padStart(2, "0")}</small><h3>{stage.name}</h3><p>{stage.purpose}</p></div><span className={stage.maturity === "Early Access" ? "is-early" : ""}>{stage.capability}<b>{stage.maturity}</b></span></header>
      <dl><div><dt>Business function</dt><dd>{stage.business}</dd></div><div><dt>Workflow</dt><dd>{stage.workflow}</dd></div><div><dt>Relevant roles</dt><dd>{stage.roles}</dd></div><div><dt>Customer value</dt><dd>{stage.value}</dd></div></dl>
      <aside><small>SYSTEM BOUNDARY</small><p>{stage.boundary}</p></aside>
      <footer><Link href={`#${stage.capability === "Title Deed Automation" ? "title-deed-automation" : "product-suite"}`}>View capability</Link><button type="button" onClick={showScreen}>View related screen <span>↓</span></button><Link className="is-primary" href={stage.maturity === "Early Access" ? `${demoHref}?product=title-deed-automation` : discussionHref}>{stage.maturity === "Early Access" ? "Request Title Deed Demo" : "Discuss planned capability"} <span>↗</span></Link></footer>
    </section>
  </div>;
}

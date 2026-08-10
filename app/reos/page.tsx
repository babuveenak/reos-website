import type { Metadata } from "next";
import { Page, SectionIntro, StatusTag } from "../components/SiteShell";

export const metadata: Metadata = { title: "How REOS Works | REOS", description: "Understand the Property Passport, Lifecycle State Engine, Integration Fabric and AI Journey Copilot." };

const pillars = [
  ["01", "Property Passport", "The persistent, permissioned state object that carries the property’s identity, documents, decisions and history across lifecycle events."],
  ["02", "Lifecycle State Engine", "The intelligence that understands where the property is, what comes next, who is responsible and which dependencies remain open."],
  ["03", "Integration Fabric", "The connectivity layer linking authority rails, developer systems, banks, utilities, inspectors, community and FM platforms."],
  ["04", "AI Journey Copilot", "A conversational layer that interprets verified knowledge and property state while preserving provenance, limitations and human escalation."],
];

export default function ReosPage() {
  return <Page className="inner-page"><section className="inner-hero reos-hero"><span className="eyebrow">THE CONNECTING FABRIC</span><h1>Integrate.<br />Orchestrate.<br /><em>Remember.</em></h1><p>REOS does not replace government, banking, developer, brokerage or specialist systems. It coordinates the journey across them.</p></section><section className="section-pad architecture"><SectionIntro label="REOS ARCHITECTURE" title={<>Four layers.<br /><em>One shared lifecycle.</em></>} /><div className="architecture-stack">{pillars.map(([number, name, copy], index) => <article key={name} className={`architecture-layer layer-${index + 1}`}><span>{number}</span><div><h3>{name}</h3><p>{copy}</p></div><StatusTag status="Future REOS Capability" /></article>)}</div></section><section className="integration-story section-pad"><div className="integration-core"><span>REOS</span><small>NEUTRAL ORCHESTRATION</small></div><div className="integration-systems"><div>Authority rails</div><div>Developer platforms</div><div>Banks & escrow</div><div>Utilities</div><div>Delivery partners</div><div>Owner services</div></div><div className="integration-copy"><span className="eyebrow">THE OPERATING PRINCIPLE</span><h2>Systems remain authoritative.<br /><em>The journey becomes continuous.</em></h2><p>REOS stores only what the permission, risk and operating model justify. Where integration is unavailable or unverified, the capability remains explicitly marked for validation.</p></div></section></Page>;
}


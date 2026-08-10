import type { Metadata } from "next";
import { LifecycleExplorer } from "../components/Experience";
import { Page, SectionIntro } from "../components/SiteShell";

export const metadata: Metadata = { title: "Property Lifecycle | REOS", description: "Explore the REOS 24-stage property lifecycle model and the stakeholders connected to every stage." };

export default function LifecyclePage() {
  return <Page className="inner-page"><section className="inner-hero"><span className="eyebrow">PROPERTY DEVELOPMENT LIFECYCLE</span><h1>Follow the property.<br /><em>See the whole journey.</em></h1><p>Explore a scalable 24-stage model from land and feasibility through delivery, ownership, operation and eventual exit.</p></section><section className="section-pad"><SectionIntro label="INTERACTIVE EXPLORER" title={<>Select a stage.<br /><em>Reveal the ecosystem.</em></>} /><LifecycleExplorer /></section><section className="integrity-strip"><b>Content integrity</b><p>Stages describe a research-backed lifecycle model. Exact processes, authorities, requirements, documents, fees and timelines vary by jurisdiction and must be verified before use.</p></section></Page>;
}


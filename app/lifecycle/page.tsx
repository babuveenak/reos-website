import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import type { Metadata } from "next";
import { LifecycleExplorer } from "../components/Experience";
import { Page, SectionIntro } from "../components/SiteShell";
import { RouteGovernance } from "../components/Governance";

export const metadata: Metadata = { title: "Property Lifecycle | REOS", description: "Explore the REOS 24-stage property lifecycle model and the stakeholders connected to every stage." };

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return <Page className="inner-page" locale={locale}><section className="inner-hero"><span className="eyebrow">PROPERTY DEVELOPMENT LIFECYCLE</span><h1>Follow the property.<br /><em>See the whole journey.</em></h1><p>Explore a scalable 24-stage model from land and feasibility through delivery, ownership, operation and eventual exit.</p></section><section className="section-pad"><SectionIntro label="INTERACTIVE EXPLORER" title={<>Select a stage.<br /><em>Reveal the ecosystem.</em></>} /><LifecycleExplorer /></section><section className="integrity-strip"><b>Content integrity</b><p>Stages describe a research-backed lifecycle model. Exact processes, authorities, requirements, documents, fees and timelines vary by jurisdiction and must be verified before use.</p></section><RouteGovernance locale={locale} businessOutcome="Use the detailed lifecycle as supporting context while continuing through the canonical seven-stage REOS journey." audience="Property delivery and governance teams requiring deeper activity context." nextAction="Open the canonical Property Journey before selecting an operational product." primaryLabel="Open the canonical Property Journey" primaryHref="/property-journey" secondaryLabel="Explore REOS products" secondaryHref="/platform" /></Page>;
}

export default function LifecyclePage() {
  return <View locale={DEFAULT_LOCALE} />;
}

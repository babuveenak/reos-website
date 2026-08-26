import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import type { Metadata } from "next";
import { EcosystemHeroMap } from "../components/EcosystemHeroMap";
import { EcosystemInteractionProvider } from "../components/EcosystemInteractionContext";
import { JourneyStakeholderExplorer } from "../components/JourneyStakeholderExplorer";
import { Page, SectionIntro } from "../components/SiteShell";

export const metadata: Metadata = {
  title: "The Connected Property Ecosystem | REOS",
  description: "How the 12 stakeholder groups connect across the seven-stage UAE property journey — relationships, dependencies and information flows, with REOS at the centre.",
};

/**
 * ECOSYSTEM — connections only, not a second stakeholder directory.
 *
 * Until 2026-08-19 this page also carried the full 12-group directory grid.
 * That content now lives at /stakeholders, its own frozen nav item, so this
 * page can stay focused on what it alone is meant to answer: how the twelve
 * groups actually connect across the seven stages, not who they are.
 */
export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return <Page className="inner-page" locale={locale}>
    <EcosystemInteractionProvider>
      <section className="inner-hero inner-hero-no-photo ecosystem-hero">
        <div className="ecosystem-hero-copy">
          <span className="eyebrow">ECOSYSTEM</span>
          <h1>The connected<br /><em>property ecosystem.</em></h1>
          <p>How do the 12 stakeholder groups connect across the property journey? The UAE property ecosystem is interconnected — every stakeholder contributes information, decisions, documents, approvals, services or capital across one or more stages of the journey. REOS connects these relationships through a shared orchestration and intelligence layer.</p>
        </div>
        <EcosystemHeroMap pathPrefix={locale === DEFAULT_LOCALE ? "" : `/${locale}`} />
      </section>

      <section id="ecosystem-detailed-map" className="section-pad ecosystem-detailed-map">
        <SectionIntro
          label="JOURNEY × STAKEHOLDER EXPLORER"
          title={<>Seven stages. Twelve groups.<br /><em>Every connection explained.</em></>}
          copy="Start with a journey stage, a stakeholder group or the complete matrix. Select an intersection to understand the relationship, then open its contextual detail page."
        />
        <p className="rail-callout">
          The map answers what is connected. The relationship panel explains how it is connected.
          Contextual pages then show the processes, documents, responsibilities and dependencies.
        </p>
        <JourneyStakeholderExplorer pathPrefix={locale === DEFAULT_LOCALE ? "" : `/${locale}`} />
      </section>
    </EcosystemInteractionProvider>
  </Page>;
}

export default function EcosystemPage() {
  return <View locale={DEFAULT_LOCALE} />;
}

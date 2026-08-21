import { DEFAULT_LOCALE, type Locale } from "../../i18n/config";
import type { Metadata } from "next";
import { RouteGrid } from "../../components/Routes";
import { Page } from "../../components/SiteShell";
import { getRouteUi } from "../../i18n/content";
import { RouteGovernance } from "../../components/Governance";

export const metadata: Metadata = {
  title: "Guides | REOS Intelligence",
  description: "Everyday guides into the UAE property journey — for buyers and owners, developers, investors, brokers, financiers, consultants, contractors, managers, utilities, authorities and specialist advisers.",
};

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const ui = getRouteUi(locale);
  return <Page className="inner-page" locale={locale}>
    <section className="inner-hero">
      <span className="eyebrow">{ui.eyebrow}</span>
      <h1>{ui.h1}<br /><em>{ui.h1em}</em></h1>
      <p>{ui.lede}</p>
    </section>

    <section className="section-pad">
      <RouteGrid locale={locale} />
    </section>

    <section className="integrity-strip">
      <b>Written for a global reader</b>
      <p>These routes assume no prior knowledge of UAE property. Local terms — escrow, off-plan, snagging, service charge, owners&rsquo; association — are explained where they first appear rather than assumed.</p>
    </section>

    <RouteGovernance
      locale={locale}
      businessOutcome="Choose a role-based route through the property journey and prepare for the evidence, decisions and handoffs ahead."
      audience="Buyers, owners, developers, investors and every participating stakeholder group."
      nextAction="Select the guide that matches your role, complete its practical next action and inspect the relevant REOS product when ready."
      primaryLabel="Choose a guide"
      primaryHref="/intelligence/guides"
      secondaryLabel="Explore the Property Journey"
      secondaryHref="/property-journey"
    />
  </Page>;
}

export default function GuidesPage() {
  return <View locale={DEFAULT_LOCALE} />;
}

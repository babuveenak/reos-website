import { DEFAULT_LOCALE, type Locale } from "../../i18n/config";
import type { Metadata } from "next";
import { RouteGrid } from "../../components/Routes";
import { Page } from "../../components/SiteShell";
import { getRouteUi } from "../../i18n/content";

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
  </Page>;
}

export default function GuidesPage() {
  return <View locale={DEFAULT_LOCALE} />;
}

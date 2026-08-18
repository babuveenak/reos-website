import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import type { Metadata } from "next";
import { PersonaSelector } from "../components/Journey";
import { Page, SectionIntro } from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Find Your Place in the Property Journey | REOS",
  description: "Eight routes into the UAE property journey — for buyers, investors, developers, financiers, contractors, consultants, property managers and anyone new to the market.",
};

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return <Page className="inner-page" locale={locale}>
    <section className="inner-hero">
      <span className="eyebrow">WHERE YOU FIT</span>
      <h1>Find your place<br /><em>in the property journey.</em></h1>
      <p>The same journey looks different depending on where you stand in it. Each route below follows the identical underlying map, filtered to the stages, participants, documents and risks that actually concern you.</p>
    </section>

    <section className="section-pad">
      <SectionIntro
        label="CHOOSE YOUR ROUTE"
        title={<>Eight ways in.<br /><em>One connected journey.</em></>}
        copy="If you are not sure which applies, start with the orientation route — it explains how the UAE market is structured before asking you to pick a role."
      />
      <PersonaSelector locale={locale} />
    </section>

    <section className="integrity-strip">
      <b>Written for a global reader</b>
      <p>These routes assume no prior knowledge of UAE property. Local terms — escrow, off-plan, snagging, service charge, owners&rsquo; association — are explained where they first appear rather than assumed.</p>
    </section>
  </Page>;
}

export default function RolesPage() {
  return <View locale={DEFAULT_LOCALE} />;
}

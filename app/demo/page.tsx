import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import type { Metadata } from "next";
import { DemoForm } from "../components/DemoForm";
import { Page } from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Map Your Property Journey with REOS | Book a Demo",
  description: "Walk through your emirate, asset type and delivery route against the connected model and see where dependencies, approvals and handoffs actually sit.",
};

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return <Page className="inner-page demo-page" locale={locale}>
    <section className="demo-layout atmos atmos-city">
      <div className="demo-intro">
        <span className="eyebrow">BOOK A DEMO</span>
        <h1>Map your property journey<br /><em>with REOS.</em></h1>
        <p>Bring a real project or a real question. We will walk it through the connected model and show where the dependencies, approvals and handoffs actually sit.</p>

        <div className="demo-proof">
          <small>TYPICAL OUTCOMES FROM A MAPPING SESSION</small>
          <ul>
            <li>Identify which authority actually governs your project</li>
            <li>Map the approvals and dependency gates still outstanding</li>
            <li>Clarify the escrow, registration and handover checkpoints</li>
            <li>Show which stakeholders and documents each step involves</li>
            <li>Separate what is validated from what still needs confirming</li>
          </ul>
        </div>

        <ul className="demo-points">
          <li><b>Bring anything</b><span>A plot under consideration, a project mid-delivery, or a purchase you are trying to understand.</span></li>
          <li><b>Jurisdiction first</b><span>We start by resolving which emirate, zone and authority govern your case, because everything downstream depends on it.</span></li>
          <li><b>No obligation</b><span>You leave with the map whether or not you go further with us.</span></li>
        </ul>
      </div>

      <div className="demo-form-panel">
        <DemoForm />
      </div>
    </section>

    <section className="integrity-strip">
      <b>What we are not</b>
      <p>REOS does not issue approvals, execute transactions, hold client money or provide legal, financial or tax advice. We explain how the journey works and connect the parties, documents and permissions involved. Binding decisions remain with the relevant authority or regulated provider.</p>
    </section>
  </Page>;
}

export default function DemoPage() {
  return <View locale={DEFAULT_LOCALE} />;
}

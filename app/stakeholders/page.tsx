import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { Page, SectionIntro, StatusTag } from "../components/SiteShell";
import { journeys, roles } from "../data/phase1";
import { ecosystemById, lifecycleStages, stakeholders } from "../data/reos";

export const metadata: Metadata = {
  title: "Stakeholder Journeys | REOS",
  description: "The same development ecosystem, read through each stakeholder lens — what they receive, what they produce, who they depend on and where they are blocked.",
};

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return <Page className="inner-page" locale={locale}>
    <section className="inner-hero">
      <span className="eyebrow">STAKEHOLDER LENSES</span>
      <h1>One ecosystem.<br /><em>Different journeys.</em></h1>
      <p>Every participant sees a different part of the same project. Select a lens to see what that party receives, what it produces, which authorities it engages and where its work typically stops.</p>
    </section>

    <section className="section-pad">
      <SectionIntro
        label="OPEN A LENS"
        title={<>Read the lifecycle<br /><em>from where you stand.</em></>}
        copy="Each lens maps the same 24-stage model to one party's responsibilities, inputs, outputs, dependencies and bottlenecks."
      />
      <div className="lens-grid">
        {stakeholders.map((person) => {
          const stages = lifecycleStages.filter((stage) => person.stageIds.includes(stage.id));
          return (
            <Link key={person.id} href={`/stakeholders/${person.id}`} className="lens-card">
              <header>
                <small>{ecosystemById[person.ecosystemId]?.short}</small>
                <StatusTag status={person.status} />
              </header>
              <h3>{person.name}</h3>
              <p>{person.identity}</p>
              <footer>
                <b>{String(stages.length).padStart(2, "0")}</b>
                <span>lifecycle stages</span>
                <i>Open lens →</i>
              </footer>
            </Link>
          );
        })}
      </div>
    </section>

    <section className="section-pad">
      <SectionIntro
        label="CUSTOMER-SIDE JOURNEYS"
        title={<>Buying, owning<br /><em>and operating.</em></>}
        copy="Customer journeys are a lens into the same development graph, not a separate product. An off-plan buyer is a lifecycle participant — their money, contract and registration sit inside the delivery phase."
      />
      <div className="role-cards">
        {roles.map((role) => (
          <article key={role.id}>
            <span>{role.name}</span>
            <p>{role.copy}</p>
            <div className="touchpoints">
              {journeys.filter((journey) => journey.roles.includes(role.id)).map((journey) => (
                <Link key={journey.slug} href={`/journeys/${journey.slug}`}>{journey.title}</Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="integrity-strip">
      <b>Content integrity</b>
      <p>Lenses describe a research-backed operating model. Exact processes, authorities, requirements, documents, fees and timelines vary by jurisdiction, asset and transaction and must be verified against the applicable official source before use.</p>
    </section>
  </Page>;
}

export default function StakeholdersPage() {
  return <View locale={DEFAULT_LOCALE} />;
}

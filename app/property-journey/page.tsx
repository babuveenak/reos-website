import { getGroups, getStages } from "../i18n/content";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { PropertyJourneyHero, type JourneyHeroStage } from "../components/PropertyJourneyHero";
import { Page, SectionIntro } from "../components/SiteShell";
import { HowReosWorks, RouteGovernance } from "../components/Governance";

export const metadata: Metadata = {
  title: "The UAE Property Journey, Mapped End to End | REOS",
  description: "Seven connected stages from land to living: what happens, who is involved, which documents matter, what can go wrong and what comes next.",
};

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const stages = getStages(locale);
  const groupNameById = Object.fromEntries(getGroups(locale).map((group) => [group.id, group.short]));
  const stageNameById = Object.fromEntries(stages.map((stage) => [stage.id, stage.name]));
  const heroStages: JourneyHeroStage[] = stages.map((stage) => ({
    id: stage.id,
    number: String(stage.number).padStart(2, "0"),
    name: stage.name,
    track: stage.track,
    summary: stage.summary,
    stakeholders: stage.groupIds.map((id) => groupNameById[id]).filter((name): name is string => Boolean(name)),
    documents: stage.documents,
    runsWith: stage.runsWith.map((id) => stageNameById[id]).filter((name): name is string => Boolean(name)),
    href: localePath(locale, `/property-journey/${stage.id}`),
  }));

  return <Page className="inner-page" locale={locale}>
    <section className="inner-hero inner-hero-no-photo property-journey-hero">
      <div className="property-journey-copy">
        <span className="eyebrow">THE PROPERTY JOURNEY</span>
        <h1>The UAE property journey,<br /><em>mapped end to end.</em></h1>
        <p>Property does not move through one process. It moves through seven connected stages, several of which run at the same time, each involving different participants, permissions and evidence. This is the full map.</p>
      </div>
      <PropertyJourneyHero stages={heroStages} />
    </section>

    <HowReosWorks locale={locale} compact />

    <section className="section-pad stage-index-band" id="all-seven-stages">
      <SectionIntro
        label="ALL SEVEN STAGES"
        title={<>Every stage,<br /><em>in full.</em></>}
        copy="Each stage page sets out what happens, who is involved, the documents in play, the risks that recur and what jurisdiction changes."
      />
      <div className="stage-index">
        {stages.map((stage) => (
          <Link key={stage.id} href={localePath(locale, `/property-journey/${stage.id}`)} className="stage-index-card">
            <header>
              <span>{String(stage.number).padStart(2, "0")}</span>
              <em>{stage.track}</em>
            </header>
            <h3>{stage.name}</h3>
            <p>{stage.summary}</p>
            <div className="chip-row">
              {stage.groupIds.slice(0, 4).map((id) => <span key={id}>{groupNameById[id]}</span>)}
            </div>
          </Link>
        ))}
      </div>
    </section>

    <RouteGovernance
      locale={locale}
      businessOutcome="See how property moves from land and approvals to delivery, operations and asset growth without hiding the stages that run in parallel."
      audience="Every stakeholder participating in the UAE property journey."
      nextAction="Select the stage that matches your current work, then review its stakeholders, evidence, risks and relevant REOS products."
      stageIds={stages.map((stage) => stage.id)}
      primaryLabel="Select a journey stage"
      primaryHref="/property-journey#all-seven-stages"
      secondaryLabel="See the connected ecosystem"
      secondaryHref="/ecosystem"
    />

    <section className="integrity-strip">
      <b>Before you act on this</b>
      <p>These pages describe how UAE property development generally works. Exact requirements, fees, timelines and eligibility depend on the emirate, the zone, the asset and the parties involved — and they change. Confirm your specific case with the relevant authority or a qualified adviser before committing.</p>
    </section>
  </Page>;
}

export default function JourneyPage() {
  return <View locale={DEFAULT_LOCALE} />;
}

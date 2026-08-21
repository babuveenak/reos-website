import { getGroups, getClusters, getStages } from "../i18n/content";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { Page, SectionIntro, StatusTag } from "../components/SiteShell";
import { StakeholdersHero, type StakeholderHeroGroup } from "../components/StakeholdersHero";

export const metadata: Metadata = {
  title: "UAE Property Stakeholders | REOS",
  description: "The 12 stakeholder groups participating across the UAE property journey — what each controls, when they enter, and what they exchange with everyone else.",
};

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const L = (path: string) => localePath(locale, path);
  const stages = getStages(locale);
  const groups = getGroups(locale);
  const clusterById = Object.fromEntries(getClusters(locale).map((c) => [c.id, c]));
  const heroGroups: StakeholderHeroGroup[] = groups.map((group) => ({
    id: group.id,
    number: String(group.number).padStart(2, "0"),
    name: group.name,
    overview: group.controls,
    participants: group.members,
    stages: stages
      .filter((stage) => stage.groupIds.includes(group.id))
      .map((stage) => ({ number: String(stage.number).padStart(2, "0"), name: stage.short })),
    href: L(`/stakeholders/${group.id}`),
  }));
  return <Page className="inner-page" locale={locale}>
    <section className="inner-hero inner-hero-no-photo stakeholders-hero">
      <div className="stakeholders-hero-copy">
        <span className="eyebrow">STAKEHOLDERS</span>
        <h1>UAE property<br /><em>stakeholders.</em></h1>
        <p>Who is involved in the UAE property journey? Explore the 12 stakeholder groups participating across it — their responsibilities, decisions, documents, approvals and dependencies.</p>
      </div>
      <StakeholdersHero groups={heroGroups} />
    </section>

    <section className="section-pad group-detail-band">
      <SectionIntro
        label="12 STAKEHOLDER GROUPS"
        title={<>Every group in full,<br /><em>and when they enter.</em></>}
        copy="Select a group to see its role in the journey, key responsibilities, decisions, documents, approvals and who it works with."
      />
      <div className="group-list">
        {groups.map((group) => {
          const entryStages = stages.filter((stage) => stage.groupIds.includes(group.id));
          const cluster = clusterById[group.cluster];
          return (
            <Link key={group.id} href={L(`/stakeholders/${group.id}`)} className={`group-card cluster-${group.cluster}`}>
              <header>
                <span className="group-num">{String(group.number).padStart(2, "0")}</span>
                <div>
                  <small>{cluster?.name}</small>
                  <h3>{group.name}</h3>
                </div>
                <StatusTag status={group.status} locale={locale} />
              </header>

              <p className="group-controls">{group.controls}</p>

              <div className="group-cols">
                <div>
                  <small>Participants</small>
                  <div className="chip-row">{group.members.slice(0, 4).map((m) => <span key={m}>{m}</span>)}</div>
                </div>
                <div>
                  <small>Enters the journey at</small>
                  <div className="chip-row">
                    {entryStages.map((stage) => <span key={stage.id}>{String(stage.number).padStart(2, "0")} {stage.short}</span>)}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>

    <section className="reos-opportunity">
      <span className="eyebrow">NOT SURE WHICH ONE IS YOU?</span>
      <h2>Start with a guide<br /><em>written for you instead.</em></h2>
      <p>If you would rather read your own step-by-step journey — as a buyer, developer, investor or another everyday role — the guides walk through it in plain language.</p>
      <div className="hero-actions">
        <Link className="button gold" href={L("/intelligence/guides")}>Find your guide <span>↗</span></Link>
        <Link className="button ghost" href={L("/ecosystem")}>See how they connect</Link>
      </div>
    </section>

    <section className="integrity-strip">
      <b>Before you act on this</b>
      <p>These pages describe a research-backed operating model. Exact processes, authorities, requirements, documents, fees and timelines vary by jurisdiction, asset and transaction — verify with the relevant authority or a qualified adviser before acting.</p>
    </section>
  </Page>;
}

export default function StakeholdersPage() {
  return <View locale={DEFAULT_LOCALE} />;
}

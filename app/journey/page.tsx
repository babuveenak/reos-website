import { getStages } from "../i18n/content";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import { getDict } from "../i18n/dictionary";
import type { Metadata } from "next";
import Link from "next/link";
import { JourneyMap, TrackLegend } from "../components/Journey";
import { JourneyHero, JourneyMoments } from "../components/JourneyHero";
import {
  JourneyProblemSection, JourneyStakeholders, JourneyIntelligence,
  JourneyPlatformPreview, JourneyFinalCTA,
} from "../components/JourneyStory";
import { Page, SectionIntro } from "../components/SiteShell";
import { groupById } from "../data/ecosystem";

export const metadata: Metadata = {
  title: "The UAE Property Journey, Mapped End to End | REOS",
  description: "Twelve connected stages from land to living: what happens, who is involved, which documents matter, what can go wrong and what comes next.",
};

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const d = getDict(locale);
  const t = d.journey.landing;

  return <Page className="inner-page jl-page" locale={locale}>
    <JourneyHero locale={locale} />
    <JourneyMoments locale={locale} />

    {/* 1 · the problem */}
    <JourneyProblemSection locale={locale} />

    {/* 2 · the spine — the canonical twelve, not a second version of them */}
    <section className="section-pad" id="the-map">
      <SectionIntro
        label={t.connect.label}
        title={<>{t.connect.title}<br /><em>{t.connect.titleEm}</em></>}
        copy={t.connect.copy}
      />
      <JourneyMap locale={locale} />
      <TrackLegend locale={locale} />
    </section>

    {/* 3 · who is connected */}
    <JourneyStakeholders locale={locale} />

    {/* 4 · visibility becomes intelligence */}
    <JourneyIntelligence locale={locale} />

    <section className="section-pad stage-index-band">
      <SectionIntro
        label={d.journey.allStages.replace("{n}", "12").toUpperCase()}
        title={<>Every stage,<br /><em>in full.</em></>}
        copy="Each stage page sets out what happens, who is involved, the documents in play, the risks that recur and what jurisdiction changes."
      />
      <div className="stage-index">
        {getStages(locale).map((stage) => (
          <Link key={stage.id} href={localePath(locale, `/journey/${stage.id}`)} className="stage-index-card">
            <header>
              <span>{String(stage.number).padStart(2, "0")}</span>
              <em>{stage.track}</em>
            </header>
            <h3>{stage.name}</h3>
            <p>{stage.summary}</p>
            <div className="chip-row">
              {stage.groupIds.slice(0, 4).map((id) => <span key={id}>{groupById[id]?.short}</span>)}
            </div>
          </Link>
        ))}
      </div>
    </section>

    {/* 5 · and only now, the product */}
    <JourneyPlatformPreview locale={locale} />

    <section className="integrity-strip">
      <b>Before you act on this</b>
      <p>These pages describe how UAE property development generally works. Exact requirements, fees, timelines and eligibility depend on the emirate, the zone, the asset and the parties involved — and they change. Confirm your specific case with the relevant authority or a qualified adviser before committing.</p>
    </section>

    {/* 6 · close */}
    <JourneyFinalCTA locale={locale} />
  </Page>;
}

export default function JourneyPage() {
  return <View locale={DEFAULT_LOCALE} />;
}

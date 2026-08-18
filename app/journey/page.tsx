import { getStages } from "../i18n/content";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { JourneyMap, TrackLegend } from "../components/Journey";
import { Page, SectionIntro } from "../components/SiteShell";
import { JourneyArchVisual } from "../components/JourneyArch";
import { groupById } from "../data/ecosystem";

export const metadata: Metadata = {
  title: "The UAE Property Journey, Mapped End to End | REOS",
  description: "Twelve connected stages from land to living: what happens, who is involved, which documents matter, what can go wrong and what comes next.",
};

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return <Page className="inner-page" locale={locale}>
    <section className="inner-hero inner-hero-no-photo">
      <span className="eyebrow">THE PROPERTY JOURNEY</span>
      <h1>The UAE property journey,<br /><em>mapped end to end.</em></h1>
      <p>Property does not move through one process. It moves through twelve connected stages, several of which run at the same time, each involving different participants, permissions and evidence. This is the full map.</p>
      <JourneyArchVisual />
    </section>

    <section className="section-pad">
      <SectionIntro
        label="INTERACTIVE MAP"
        title={<>Select a stage.<br /><em>See what it involves.</em></>}
        copy="Stages are numbered for reference, not to suggest a strict queue. Where two stages genuinely run together, the map says so."
      />
      <JourneyMap locale={locale} />
      <TrackLegend locale={locale} />
    </section>

    <section className="section-pad stage-index-band">
      <SectionIntro
        label="ALL TWELVE STAGES"
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

    <section className="integrity-strip">
      <b>Before you act on this</b>
      <p>These pages describe how UAE property development generally works. Exact requirements, fees, timelines and eligibility depend on the emirate, the zone, the asset and the parties involved — and they change. Confirm your specific case with the relevant authority or a qualified adviser before committing.</p>
    </section>
  </Page>;
}

export default function JourneyPage() {
  return <View locale={DEFAULT_LOCALE} />;
}

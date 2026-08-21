import { getStages } from "../i18n/content";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JourneyMap, TrackLegend } from "../components/Journey";
import { Page, SectionIntro } from "../components/SiteShell";
import { groupById } from "../data/ecosystem";

export const metadata: Metadata = {
  title: "The UAE Property Journey, Mapped End to End | REOS",
  description: "Seven connected stages from land to living: what happens, who is involved, which documents matter, what can go wrong and what comes next.",
};

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return <Page className="inner-page" locale={locale}>
    <section className="inner-hero inner-hero-no-photo property-journey-hero">
      <div className="property-journey-copy">
        <span className="eyebrow">THE PROPERTY JOURNEY</span>
        <h1>The UAE property journey,<br /><em>mapped end to end.</em></h1>
        <p>Property does not move through one process. It moves through seven connected stages, several of which run at the same time, each involving different participants, permissions and evidence. This is the full map.</p>
      </div>
      <figure className="property-journey-visual">
        <Image
          src="/images/property-journey-lifecycle-v2.png"
          alt="Seven connected UAE property lifecycle environments progress from land and ownership through planning, parallel design and construction with marketing and sales, registration, community living, and investment and leasing."
          width={1672}
          height={941}
          sizes="(max-width: 720px) 760px, (max-width: 1200px) 92vw, 1500px"
          preload
        />
      </figure>
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
        label="ALL SEVEN STAGES"
        title={<>Every stage,<br /><em>in full.</em></>}
        copy="Each stage page sets out what happens, who is involved, the documents in play, the risks that recur and what jurisdiction changes."
      />
      <div className="stage-index">
        {getStages(locale).map((stage) => (
          <Link key={stage.id} href={localePath(locale, `/property-journey/${stage.id}`)} className="stage-index-card">
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

import type { Metadata } from "next";
import Link from "next/link";
import { Page, SectionIntro } from "../components/SiteShell";
import { insightCategories } from "../data/ecosystem";
import { personas } from "../data/personas";
import { stages } from "../data/journey";

export const metadata: Metadata = {
  title: "Learn Before You Buy, Build, Invest or Manage | REOS Insights",
  description: "Guides and explainers on UAE property: buying, investing, developing, regulation, authority processes, escrow, handover, community living and property management.",
};

/**
 * The knowledge hub indexes what already exists on the site rather than
 * promising articles that have not been written. Every card below leads to
 * real content; the categories awaiting long-form pieces say so plainly.
 */
export default function InsightsPage() {
  return <Page className="inner-page">
    <section className="inner-hero">
      <span className="eyebrow">KNOWLEDGE HUB</span>
      <h1>Learn before you buy,<br /><em>build, invest or manage.</em></h1>
      <p>Explanations written for people approaching UAE property without prior local knowledge. Start with the journey stage or the role that matches your situation.</p>
    </section>

    <section className="section-pad">
      <SectionIntro
        label="START WITH YOUR ROLE"
        title={<>Guides by<br /><em>who you are.</em></>}
        copy="Each route explains the full sequence for that role, the documents involved and the mistakes that recur."
      />
      <div className="insight-grid">
        {personas.map((persona) => (
          <Link key={persona.slug} href={`/roles/${persona.slug}`} className="insight-card">
            <small>{persona.name}</small>
            <h3>{persona.headline}</h3>
            <p>{persona.promise}</p>
            <i>Read the guide →</i>
          </Link>
        ))}
      </div>
    </section>

    <section className="section-pad">
      <SectionIntro
        label="EXPLAINERS BY STAGE"
        title={<>Guides by<br /><em>what happens when.</em></>}
        copy="Every stage of the journey explained: what takes place, who is involved, which documents matter and what changes between emirates."
      />
      <div className="stage-index">
        {stages.map((stage) => (
          <Link key={stage.id} href={`/journey/${stage.id}`} className="stage-index-card">
            <header><span>{String(stage.number).padStart(2, "0")}</span><em>{stage.track}</em></header>
            <h3>{stage.name}</h3>
            <p>{stage.summary}</p>
          </Link>
        ))}
      </div>
    </section>

    <section className="section-pad">
      <SectionIntro
        label="TOPICS IN DEVELOPMENT"
        title={<>Deeper explainers,<br /><em>as they are sourced.</em></>}
        copy="These topics are being written and verified against official sources. We publish them when they are sourced, not before."
      />
      <div className="topic-grid">
        {insightCategories.map((category) => (
          <article key={category.id}>
            <h3>{category.name}</h3>
            <p>{category.copy}</p>
            <span className="status status-to-be-validated">In development</span>
          </article>
        ))}
      </div>
    </section>

    <section className="integrity-strip">
      <b>How to use this</b>
      <p>These explainers describe how things generally work. They are not legal, financial or tax advice, and they do not replace the official position of any authority. Requirements differ by emirate and change over time — confirm your specific case before acting.</p>
    </section>
  </Page>;
}

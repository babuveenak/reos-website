import type { Metadata } from "next";
import Link from "next/link";
import { Page, SectionIntro } from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Building the Digital Map of the Property Ecosystem | About REOS",
  description: "Why REOS exists: to make the UAE property journey understandable, navigable and connected for everyone who takes part in it.",
};

export default function AboutPage() {
  return <Page className="inner-page">
    <section className="inner-hero atmos atmos-city">
      <span className="eyebrow">ABOUT REOS</span>
      <h1>Building the digital map<br /><em>of the property ecosystem.</em></h1>
      <p>REOS exists to make the property journey understandable, navigable and connected — for the people buying, the people building, the people funding it and the people who will run it long after handover.</p>
    </section>

    <section className="section-pad">
      <SectionIntro label="THE PROBLEM WE STARTED FROM" title={<>The information exists.<br /><em>The connections do not.</em></>} />
      <div className="prose-block">
        <p>Everything needed to understand UAE property development is already published somewhere — across government portals, regulations, authority guidance, developer procedures, banking processes and professional practice. What does not exist is a single place where those pieces are connected to each other.</p>
        <p>So a first-time buyer cannot see what protects their money. A developer discovers a prerequisite late. A consultant does not know who is waiting on their submission. A bank reconciles three systems to answer one question. Everyone holds a fragment, and nobody holds the map.</p>
        <p>REOS is that map: the stages, the participants, the permissions, the documents and the dependencies that connect them — assembled once, kept current, and readable from wherever you happen to stand in it.</p>
      </div>
    </section>

    <section className="section-pad">
      <SectionIntro label="HOW WE BUILD IT" title={<>Depth before<br /><em>breadth.</em></>} />
      <div className="principle-grid">
        <article><b>01</b><h3>One jurisdiction at a time</h3><p>A single complete, sourced journey is worth more than seven emirates covered shallowly. Coverage expands only when depth holds.</p></article>
        <article><b>02</b><h3>Sourced or labelled</h3><p>Every operative claim carries a source and a date. Where something is not yet verified, it says so rather than sounding certain.</p></article>
        <article><b>03</b><h3>Plain language first</h3><p>Written for people who do not already work in UAE property. Local terms are explained where they appear, not assumed.</p></article>
        <article><b>04</b><h3>Independent by design</h3><p>The journey is shaped around the reader&rsquo;s outcome, not around whoever might sponsor a page.</p></article>
      </div>
    </section>

    <section className="reos-opportunity">
      <span className="eyebrow">WHERE THIS GOES</span>
      <h2>From understanding<br /><em>to execution.</em></h2>
      <p>The knowledge layer makes the journey legible. The discovery layer narrows it to your case. The execution layer runs the work. Each is useful alone, and each makes the next one possible.</p>
      <div className="hero-actions">
        <Link className="button gold" href="/demo">Talk to us <span>↗</span></Link>
        <Link className="button ghost" href="/platform">See the platform</Link>
      </div>
    </section>
  </Page>;
}

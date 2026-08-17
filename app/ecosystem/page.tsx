import type { Metadata } from "next";
import Link from "next/link";
import { EcosystemMap } from "../components/Ecosystem";
import { Page, SectionIntro, StatusTag } from "../components/SiteShell";
import { clusterById, groups } from "../data/ecosystem";
import { stages } from "../data/journey";

export const metadata: Metadata = {
  title: "The 12 Stakeholder Groups Behind the UAE Property Journey | REOS",
  description: "Who participates in UAE property development, what each group controls, when they enter the journey and what they exchange with everyone else.",
};

export default function EcosystemPage() {
  return <Page className="inner-page">
    <section className="inner-hero">
      <span className="eyebrow">THE ECOSYSTEM</span>
      <h1>The twelve stakeholder groups<br /><em>behind the property journey.</em></h1>
      <p>No property journey happens alone. Every stage draws in different organisations with their own processes, systems, obligations and terminology. These are the twelve groups, organised into four clusters over a regulatory rail.</p>
    </section>

    <section className="section-pad">
      <SectionIntro
        label="INTERACTIVE MAP"
        title={<>Four clusters.<br /><em>One regulatory rail.</em></>}
        copy="Authorities are shown as a rail rather than a cluster because they are not peers of the other groups — they issue the approvals that gate everyone else. Enablers cross-cut because they support many stages at once."
      />
      <EcosystemMap />
    </section>

    <section className="section-pad group-detail-band">
      <SectionIntro
        label="EVERY GROUP IN FULL"
        title={<>What each group controls,<br /><em>and when they enter.</em></>}
      />
      <div className="group-list">
        {groups.map((group) => {
          const entryStages = stages.filter((stage) => stage.groupIds.includes(group.id));
          const cluster = clusterById[group.cluster];
          return (
            <article key={group.id} id={group.id} className={`group-card cluster-${group.cluster}`}>
              <header>
                <span className="group-num">{String(group.number).padStart(2, "0")}</span>
                <div>
                  <small>{cluster?.name}</small>
                  <h3>{group.name}</h3>
                </div>
                <StatusTag status={group.status} />
              </header>

              <p className="group-controls">{group.controls}</p>

              <div className="group-cols">
                <div>
                  <small>Participants</small>
                  <div className="chip-row">{group.members.map((m) => <span key={m}>{m}</span>)}</div>
                </div>
                <div>
                  <small>Enters the journey at</small>
                  <div className="chip-row links">
                    {entryStages.map((stage) => (
                      <Link key={stage.id} href={`/journey/${stage.id}`}>{String(stage.number).padStart(2, "0")} {stage.short}</Link>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>

    <section className="reos-opportunity">
      <span className="eyebrow">HOW REOS CONNECTS THEM</span>
      <h2>Twelve groups.<br /><em>One shared picture.</em></h2>
      <p>Each group holds part of the truth about a project — an approval, a payment, a certificate, a defect, a contract. REOS connects those parts so the state of a project can be read as a whole, while every official system remains the record of its own decisions.</p>
      <div className="hero-actions">
        <Link className="button gold" href="/platform">See the platform <span>↗</span></Link>
        <Link className="button ghost" href="/stakeholders">Detailed stakeholder lenses</Link>
      </div>
    </section>
  </Page>;
}

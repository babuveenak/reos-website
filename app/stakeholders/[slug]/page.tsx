import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, StatusTag } from "../../components/SiteShell";
import { authorityById, ecosystemById, lifecycleStages, stakeholderById, stakeholders } from "../../data/reos";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() { return stakeholders.map((item) => ({ slug: item.id })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const stakeholder = stakeholderById[slug];
  return stakeholder ? { title: `${stakeholder.name} Journey | REOS`, description: `Explore the ${stakeholder.name} role, lifecycle stages, dependencies, authorities, inputs, outputs and REOS opportunity.` } : {};
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return <article className="journey-block"><span className="eyebrow">{title}</span><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}

export default async function StakeholderJourneyPage({ params }: Props) {
  const { slug } = await params;
  const stakeholder = stakeholderById[slug];
  if (!stakeholder) notFound();
  const ecosystem = ecosystemById[stakeholder.ecosystemId];
  const relevant = lifecycleStages.filter((stage) => stakeholder.stageIds.includes(stage.id));
  return <Page className="inner-page journey-page"><section className="journey-hero"><div><span className="eyebrow">{ecosystem.name}</span><h1>{stakeholder.name}</h1><p>{stakeholder.identity}</p><StatusTag status={stakeholder.status} /></div><div className="journey-index"><small>PARTICIPATES IN</small><b>{String(relevant.length).padStart(2, "0")}</b><span>lifecycle stages</span></div></section><section className="journey-timeline section-pad"><div className="timeline-header"><span>01</span><h2>Role in the<br /><em>property lifecycle.</em></h2></div><div className="mini-stage-rail">{relevant.map((stage) => <Link href={`/lifecycle/${stage.id}`} key={stage.id}><b>{String(stage.number).padStart(2, "0")}</b><span>{stage.name}</span><small>{stage.phase}</small></Link>)}</div></section><section className="journey-grid section-pad"><ListBlock title="OBJECTIVES" items={stakeholder.objectives} /><ListBlock title="ENTRY CONDITIONS" items={stakeholder.entryConditions} /><ListBlock title="INPUTS RECEIVED" items={stakeholder.inputs} /><ListBlock title="OUTPUTS PRODUCED" items={stakeholder.outputs} /><ListBlock title="DEPENDENCIES" items={stakeholder.dependencies} /><ListBlock title="SYSTEMS / CHANNELS" items={stakeholder.systems} /><ListBlock title="TYPICAL BOTTLENECKS" items={stakeholder.bottlenecks} /><article className="journey-block authority-connections"><span className="eyebrow">AUTHORITY CONNECTIONS</span>{stakeholder.authorityIds.length ? stakeholder.authorityIds.map((id) => <div key={id}><b>{authorityById[id]?.name}</b><small>{authorityById[id]?.jurisdiction}</small></div>) : <p>TBD / Requires validation for the selected fact pattern.</p>}</article></section><section className="reos-opportunity"><span className="eyebrow">REOS OPPORTUNITY</span><h2>How the journey<br /><em>becomes connected.</em></h2><p>{stakeholder.reosOpportunity}</p><div className="opportunity-flow"><span>Upstream state</span><i>→</i><b>REOS orchestration</b><i>→</i><span>Downstream action</span></div></section></Page>;
}

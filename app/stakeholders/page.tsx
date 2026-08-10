import type { Metadata } from "next";
import Link from "next/link";
import { EcosystemOrbit } from "../components/Experience";
import { Page, SectionIntro, StatusTag } from "../components/SiteShell";
import { ecosystemById, stakeholders } from "../data/reos";

export const metadata: Metadata = { title: "Stakeholder Ecosystem | REOS", description: "Explore the eight UAE real-estate ecosystems and representative stakeholder journeys connected through REOS." };

export default function StakeholdersPage() {
  return <Page className="inner-page"><section className="inner-hero ecosystem-hero"><span className="eyebrow">STAKEHOLDER ECOSYSTEM</span><h1>Eight worlds.<br /><em>One connected property.</em></h1><p>Executive categories keep the ecosystem legible. The structured model beneath them can grow to hundreds of roles and organisations.</p></section><section className="section-pad"><EcosystemOrbit compact /></section><section className="section-pad role-directory"><SectionIntro label="REPRESENTATIVE JOURNEYS" title={<>Choose a role.<br /><em>See its dependencies.</em></>} /><div className="directory-grid">{stakeholders.map((item, index) => <Link href={`/stakeholders/${item.id}`} key={item.id} className="directory-card"><span>{String(index + 1).padStart(2, "0")}</span><small>{ecosystemById[item.ecosystemId].name}</small><h3>{item.name}</h3><p>{item.identity}</p><StatusTag status={item.status} /><i>Open journey →</i></Link>)}</div></section></Page>;
}


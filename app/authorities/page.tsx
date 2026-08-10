import type { Metadata } from "next";
import { Page, SectionIntro, StatusTag } from "../components/SiteShell";
import { authorities, stageById } from "../data/reos";

export const metadata: Metadata = { title: "Authorities & Approvals | REOS", description: "See where validated UAE authorities touch the property lifecycle and why jurisdiction resolution matters." };

export default function AuthoritiesPage() {
  return <Page className="inner-page"><section className="inner-hero authority-hero"><span className="eyebrow">AUTHORITIES & APPROVALS</span><h1>Jurisdiction first.<br /><em>Guidance second.</em></h1><p>No property journey is reliable until emirate, registration jurisdiction, planning authority, asset type and applicable development controls are resolved.</p></section><section className="section-pad"><SectionIntro label="VALIDATED AUTHORITY TOUCHPOINTS" title={<>Select the authority.<br /><em>See where it connects.</em></>} copy="This is a non-exhaustive, research-backed starting set—not a substitute for official confirmation." /><div className="authority-grid">{authorities.map((authority, index) => <article className="authority-card" key={authority.id}><header><span>{String(index + 1).padStart(2, "0")}</span><StatusTag status={authority.status} /></header><small>{authority.jurisdiction}</small><h3>{authority.name}</h3><p>{authority.role}</p><div className="touchpoints"><b>Lifecycle touchpoints</b>{authority.stageIds.map((id) => <span key={id}>{stageById[id]?.name}</span>)}</div></article>)}</div></section><section className="jurisdiction-callout"><span className="eyebrow">DO NOT ASSUME PORTABILITY</span><h2>Dubai is not Abu Dhabi.<br />Abu Dhabi is not Sharjah.<br /><em>Every jurisdiction is resolved on its own terms.</em></h2></section></Page>;
}


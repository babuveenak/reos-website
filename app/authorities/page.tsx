import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { Page, SectionIntro, StatusTag } from "../components/SiteShell";
import { authorities, stageById } from "../data/reos";

export const metadata: Metadata = { title: "Authorities & Approvals | REOS", description: "See where validated UAE authorities touch the property lifecycle and why jurisdiction resolution matters." };

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  return <Page className="inner-page" locale={locale}><section className="inner-hero authority-hero"><span className="eyebrow">AUTHORITIES & APPROVALS</span><h1>Jurisdiction first.<br /><em>Guidance second.</em></h1><p>No property journey is reliable until emirate, registration jurisdiction, planning authority, asset type and applicable development controls are resolved.</p></section><section className="section-pad"><SectionIntro label="VALIDATED AUTHORITY TOUCHPOINTS" title={<>Explore each authority.<br /><em>See where it connects.</em></>} copy="A non-exhaustive, research-backed starting set. Use the official source to confirm current requirements, eligibility, fees and service channels." /><div className="authority-grid">{authorities.map((authority, index) => <article className="authority-card" key={authority.id}><header><span>{String(index + 1).padStart(2, "0")}</span><StatusTag status={authority.status} /></header><small>{authority.jurisdiction}</small><h3>{authority.name}</h3><p>{authority.role}</p><div className="touchpoints"><b>Lifecycle touchpoints</b>{authority.stageIds.map((id) => <Link key={id} href={`/lifecycle/${id}`}>{stageById[id]?.name}</Link>)}</div><a className="official-source" href={authority.sourceUrl} target="_blank" rel="noreferrer">Open official source ↗</a></article>)}</div></section><section className="jurisdiction-callout"><span className="eyebrow">DO NOT ASSUME PORTABILITY</span><h2>Dubai is not Abu Dhabi.<br />Abu Dhabi is not Sharjah.<br /><em>Every jurisdiction is resolved on its own terms.</em></h2></section></Page>;
}

export default function AuthoritiesPage() {
  return <View locale={DEFAULT_LOCALE} />;
}

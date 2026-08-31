import Link from "next/link";
import { notFound } from "next/navigation";
import { Page } from "./SiteShell";
import { StakeholderJurisdictionSelector } from "./StakeholderJurisdictionSelector";
import { StakeholderHeroVisual } from "./StakeholderHeroVisual";
import { StakeholderLifecycleMap } from "./StakeholderLifecycleMap";
import { StakeholderProcessMap } from "./StakeholderProcessMap";
import { StakeholderGuidanceSections } from "./StakeholderGuidanceSections";
import { authorityProcessMaps } from "../data/authorityProcessMaps";
import { DUBAI_TRACKS, EMIRATES, stakeholderBlueprintById, type DubaiTrack, type EmirateId } from "../data/stakeholderBlueprints";
import { groupById } from "../data/ecosystem";
import { getGroups, getStages } from "../i18n/content";
import { localePath, type Locale } from "../i18n/config";
import type { StakeholderId } from "../data/stakeholderParticipation";

const COPY = {
  en: {
    back: "Back to all stakeholders",
    stakeholder: "Stakeholder",
    scope: "Jurisdiction scope",
    checked: "Sources checked 26 August 2026",
    sourceLed: "Official sources · REOS role mapping",
    unmapped: "Not yet mapped",
    noDubai: "Dubai facts are not shown in this jurisdiction view.",
    missing: "What is still missing",
    ecosystem: "Open this stakeholder in the ecosystem map",
    all: "View all stakeholder groups",
    visualCaption: "Illustrative stakeholder concept, not an official plan",
  },
  ar: {
    back: "العودة إلى جميع أصحاب المصلحة",
    stakeholder: "صاحب المصلحة",
    scope: "نطاق الاختصاص",
    checked: "تم التحقق من المصادر في 26 أغسطس 2026",
    sourceLed: "مصادر رسمية · خريطة أدوار REOS",
    unmapped: "لم يتم التخطيط بعد",
    noDubai: "لا يتم عرض حقائق دبي في هذا النطاق.",
    missing: "ما الذي لا يزال مفقوداً",
    ecosystem: "افتح صاحب المصلحة في خريطة المنظومة",
    all: "عرض جميع أصحاب المصلحة",
    visualCaption: "تصور توضيحي لصاحب المصلحة وليس مخططاً رسمياً",
  },
};

export function StakeholderBlueprintPage({ stakeholderId, emirate, track, locale }: { stakeholderId: string; emirate: EmirateId; track: DubaiTrack; locale: Locale }) {
  const profile = stakeholderBlueprintById[stakeholderId];
  const fallbackGroup = groupById[stakeholderId];
  if (!profile || !fallbackGroup) notFound();

  const c = COPY[locale];
  const localizedGroup = getGroups(locale).find((group) => group.id === stakeholderId) ?? fallbackGroup;
  const localizedStages = getStages(locale);
  const localizedGroups = getGroups(locale);
  const selectedTrack = DUBAI_TRACKS.find((item) => item.id === track) ?? DUBAI_TRACKS[0];
  const coverage = profile.coverage.find((item) => item.emirate === emirate);
  const emirateRecord = EMIRATES.find((item) => item.id === emirate);
  const emirateLabel = emirateRecord?.[locale === "ar" ? "ar" : "label"] ?? emirate;
  const L = (path: string) => localePath(locale, path);
  const isDubai = emirate === "dubai";
  const processes = authorityProcessMaps[track];
  const primaryStageId = ["lead", "active", "supporting", "informed"]
    .map((level) => profile.participation.find((item) => item.relationshipLevel === level)?.stageId)
    .find(Boolean);
  const connections = processes.map((process) => ({
    stageId: process.stageId,
    groupNames: process.relatedStakeholderIds
      .filter((id) => id !== stakeholderId)
      .map((id) => localizedGroups.find((group) => group.id === id)?.name ?? id.replaceAll("-", " ")),
  }));
  if (!coverage) notFound();

  return <Page className="inner-page stakeholder-blueprint-page" locale={locale}>
    <nav className="crumbs" aria-label={locale === "ar" ? "مسار التنقل" : "Breadcrumb"}>
      <Link className="crumb-back" href={L("/stakeholders")}><span aria-hidden="true">←</span> {c.back}</Link>
      <span aria-hidden="true">/</span>
      <b>{localizedGroup.name}</b>
    </nav>

    <section className="stakeholder-blueprint-hero has-visual">
      <div className="stakeholder-blueprint-copy">
        <span className="eyebrow">{c.stakeholder} {String(fallbackGroup.number).padStart(2, "0")} / 12</span>
        <h1>{localizedGroup.name}</h1>
        <p>{profile.overview}</p>
        <div className="blueprint-status-row">
          <span className={`evidence-badge ${isDubai ? "evidence-conditional" : "evidence-unverified"}`}>{isDubai ? c.sourceLed : c.unmapped}</span>
          <time dateTime="2026-08-26">{c.checked}</time>
        </div>
        <div className="scope-context"><b>{c.scope}</b><span>{emirateLabel}</span>{isDubai && <span>{selectedTrack.label}</span>}</div>
      </div>
      <StakeholderHeroVisual stakeholderId={stakeholderId} stakeholderName={localizedGroup.name} caption={c.visualCaption} locale={locale} />
    </section>

    <StakeholderLifecycleMap stakeholderName={localizedGroup.name} stages={localizedStages} participation={profile.participation} connections={connections} locale={locale} />

    {isDubai
      ? <>
          <StakeholderProcessMap stakeholderId={stakeholderId} stakeholderName={localizedGroup.name} stages={localizedStages} participation={profile.participation} processes={processes} locale={locale} track={track} initialStageId={primaryStageId} variant="tiered" emirate={emirate} trackNote={selectedTrack.note} />
          <StakeholderGuidanceSections stakeholderId={stakeholderId as StakeholderId} stakeholderName={localizedGroup.name} locale={locale} />
        </>
      : <section className="unmapped-jurisdiction section-pad">
          <span className="eyebrow">02 · {c.unmapped}</span>
          <h2>{emirateLabel}: {c.unmapped}</h2>
          <p>{c.noDubai}</p>
          <StakeholderJurisdictionSelector stakeholderId={stakeholderId} emirate={emirate} track={track} locale={locale} />
          <h3>{c.missing}</h3>
          <ul>{coverage.missing.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>}

    <nav className="stakeholder-continuation" aria-label={locale === "ar" ? "روابط المتابعة" : "Continue exploring"}>
      <Link href={L(`/ecosystem?view=stakeholder&stakeholder=${stakeholderId}`)}>{c.ecosystem} <span>→</span></Link>
      <Link href={L("/stakeholders")}>{c.all} <span>→</span></Link>
    </nav>
  </Page>;
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page } from "./SiteShell";
import { StakeholderJurisdictionSelector } from "./StakeholderJurisdictionSelector";
import { StakeholderProcessMap } from "./StakeholderProcessMap";
import { authorityProcessMaps } from "../data/authorityProcessMaps";
import { DUBAI_TRACKS, EMIRATES, stakeholderBlueprintById, type DubaiTrack, type EmirateId } from "../data/stakeholderBlueprints";
import { groupById } from "../data/ecosystem";
import { getGroups, getStages } from "../i18n/content";
import { localePath, type Locale } from "../i18n/config";

const COPY = {
  en: {
    back: "Back to all stakeholders",
    stakeholder: "Stakeholder",
    scope: "Jurisdiction scope",
    checked: "Sources checked 26 August 2026",
    sourceLed: "Official sources · REOS role mapping",
    where: "Where you start",
    mappedNotice: "This is an educational process map. Official authorities retain every statutory decision, approval and registry function.",
    translation: "Official source details remain in source-language English pending human-reviewed Arabic publication.",
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
    where: "نقطة البداية",
    mappedNotice: "هذه خريطة تعليمية للعملية. وتحتفظ الجهات الرسمية بجميع قراراتها النظامية وصلاحيات الموافقة والتسجيل.",
    translation: "تظل تفاصيل المصادر الرسمية باللغة الإنجليزية إلى حين نشر ترجمة عربية خضعت للمراجعة البشرية.",
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
  const selectedTrack = DUBAI_TRACKS.find((item) => item.id === track) ?? DUBAI_TRACKS[0];
  const coverage = profile.coverage.find((item) => item.emirate === emirate);
  const emirateRecord = EMIRATES.find((item) => item.id === emirate);
  const emirateLabel = emirateRecord?.[locale === "ar" ? "ar" : "label"] ?? emirate;
  const L = (path: string) => localePath(locale, path);
  const isDubai = emirate === "dubai";
  if (!coverage) notFound();

  return <Page className="inner-page stakeholder-blueprint-page" locale={locale}>
    <nav className="crumbs" aria-label={locale === "ar" ? "مسار التنقل" : "Breadcrumb"}>
      <Link className="crumb-back" href={L("/stakeholders")}><span aria-hidden="true">←</span> {c.back}</Link>
      <span aria-hidden="true">/</span>
      <b>{localizedGroup.name}</b>
    </nav>

    <section className={`stakeholder-blueprint-hero${stakeholderId === "landowners-investors" ? " has-visual" : ""}`}>
      <div className="stakeholder-blueprint-copy">
        <span className="eyebrow">{c.stakeholder} {String(fallbackGroup.number).padStart(2, "0")} / 12</span>
        <h1>{localizedGroup.name}</h1>
        <p>{profile.overview}</p>
        <div className="blueprint-status-row">
          <span className={`evidence-badge ${isDubai ? "evidence-conditional" : "evidence-unverified"}`}>{isDubai ? c.sourceLed : c.unmapped}</span>
          <time dateTime="2026-08-26">{c.checked}</time>
        </div>
        <div className="scope-context"><b>{c.scope}</b><span>{emirateLabel}</span>{isDubai && <span>{selectedTrack.label}</span>}</div>
        <StakeholderJurisdictionSelector stakeholderId={stakeholderId} emirate={emirate} track={track} locale={locale} />
        {isDubai && <p className="track-note">{selectedTrack.note}</p>}
      </div>
      {stakeholderId === "landowners-investors"
        ? <figure className="stakeholder-blueprint-visual"><Image src="/images/stakeholder-landowners-investors-hero-v1.png" alt="Illustrative capital-meets-land diorama with a surveyed plot, plan and investment records" fill sizes="(max-width: 900px) 100vw, 46vw" priority /><figcaption>REOS · {c.visualCaption}</figcaption></figure>
        : <div className="stakeholder-blueprint-index" aria-label={locale === "ar" ? "سبع مراحل مترابطة" : "Seven connected stages"}><small>{locale === "ar" ? "مراحل مترابطة" : "Connected stages"}</small><b>07</b><span>/ 07</span></div>}
    </section>

    <section className="stakeholder-start section-pad">
      <span className="eyebrow">01 · {c.where}</span>
      <div><h2>{profile.firstDecision}</h2><p>{c.mappedNotice}</p>{locale === "ar" && isDubai && <p className="translation-warning">{c.translation}</p>}</div>
      <aside><small>{locale === "ar" ? "تغطية دورة الحياة" : "Lifecycle coverage"}</small><b>{isDubai ? (locale === "ar" ? "7 من 7 مراحل" : "7 of 7 stages") : c.unmapped}</b></aside>
    </section>

    {isDubai
      ? <StakeholderProcessMap stakeholderName={localizedGroup.name} stages={localizedStages} participation={profile.participation} processes={authorityProcessMaps[track]} locale={locale} />
      : <section className="unmapped-jurisdiction section-pad">
          <span className="eyebrow">02 · {c.unmapped}</span>
          <h2>{emirateLabel}: {c.unmapped}</h2>
          <p>{c.noDubai}</p>
          <h3>{c.missing}</h3>
          <ul>{coverage.missing.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>}

    <nav className="stakeholder-continuation" aria-label={locale === "ar" ? "روابط المتابعة" : "Continue exploring"}>
      <Link href={L(`/ecosystem?view=stakeholder&stakeholder=${stakeholderId}`)}>{c.ecosystem} <span>→</span></Link>
      <Link href={L("/stakeholders")}>{c.all} <span>→</span></Link>
    </nav>
  </Page>;
}

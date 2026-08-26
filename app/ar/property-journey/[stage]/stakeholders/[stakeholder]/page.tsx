import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page } from "../../../../../components/SiteShell";
import { StakeholderProcessMap } from "../../../../../components/StakeholderProcessMap";
import { authorityProcessMaps } from "../../../../../data/authorityProcessMaps";
import { groupById } from "../../../../../data/ecosystem";
import { stageById } from "../../../../../data/journey";
import { approvedRelationships, relationshipFor } from "../../../../../data/relationships";
import { participationFor, participationForStakeholder } from "../../../../../data/stakeholderParticipation";
import { getGroups, getStages } from "../../../../../i18n/content";

type Props = { params: Promise<{ stage: string; stakeholder: string }> };

export function generateStaticParams() {
  return approvedRelationships.map((item) => ({ stage: item.stageId, stakeholder: item.stakeholderId }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stage, stakeholder } = await params;
  const localizedStage = getStages("ar").find((item) => item.id === stage);
  const localizedGroup = getGroups("ar").find((item) => item.id === stakeholder);
  if (!localizedStage || !localizedGroup) return {};
  return { title: `${localizedGroup.name} في ${localizedStage.name} | REOS`, alternates: { canonical: `/ar/property-journey/${stage}/stakeholders/${stakeholder}` } };
}

export default async function ArabicRelationshipPage({ params }: Props) {
  const { stage: stageId, stakeholder: stakeholderId } = await params;
  const stage = stageById[stageId];
  const group = groupById[stakeholderId];
  const relationship = relationshipFor(stageId, stakeholderId);
  const intersection = participationFor(stageId, stakeholderId);
  const localizedStages = getStages("ar");
  const localizedStage = localizedStages.find((item) => item.id === stageId);
  const localizedGroup = getGroups("ar").find((item) => item.id === stakeholderId);
  if (!stage || !group || !relationship || !intersection || !localizedStage || !localizedGroup) notFound();

  const participation = participationForStakeholder(stakeholderId).map((item) => ({
    stageId: item.stageId,
    state: item.involvement,
    relationshipLevel: item.relationshipLevel,
    summary: item.role,
    evidence: item.evidence,
  }));

  return <Page className="inner-page relationship-detail-page" locale="ar">
    <nav className="crumbs" aria-label="مسار التنقل">
      <Link href="/ar">الرئيسية</Link><span aria-hidden="true">/</span>
      <Link href="/ar/property-journey">رحلة العقار</Link><span aria-hidden="true">/</span>
      <Link href={`/ar/property-journey/${stageId}`}>{localizedStage.name}</Link><span aria-hidden="true">/</span>
      <b>{localizedGroup.name}</b>
    </nav>
    <section className="relationship-detail-hero">
      <span className="eyebrow">الرحلة × صاحب المصلحة</span>
      <p className="relationship-detail-kicker">المرحلة {String(stage.number).padStart(2, "0")} · صاحب المصلحة {String(group.number).padStart(2, "0")}</p>
      <h1>{localizedGroup.name}<br /><em>في {localizedStage.name}.</em></h1>
      <div className="blueprint-status-row"><span className={`evidence-badge ${intersection.evidence === "unverified" ? "evidence-unverified" : "evidence-conditional"}`}>{intersection.publicationState === "provisional" ? "محتوى مؤقت · مصادر رسمية مع خريطة أدوار REOS" : "سياق الدور فقط"}</span><time dateTime="2026-08-26">تم التحقق من المصادر في 26 أغسطس 2026</time></div>
      <p>{relationship.role}</p>
    </section>
    <aside className="translation-notice section-pad" role="note">المعلومات الواقعية وأسماء الخدمات والرسوم والمدد أدناه معروضة بلغة المصدر الرسمية الإنجليزية إلى أن تكتمل مراجعة الترجمة القانونية العربية. لا تُعد ترجمة رسمية للجهة.</aside>
    <StakeholderProcessMap stakeholderId={stakeholderId} stakeholderName={localizedGroup.name} stages={localizedStages} participation={participation} processes={authorityProcessMaps["track-neutral"]} locale="ar" initialStageId={stageId} />
    <nav className="stage-nav" aria-label="التنقل السياقي">
      <Link href={`/ar/stakeholders/${stakeholderId}`}><small>ملف صاحب المصلحة</small><b>{localizedGroup.name} ←</b></Link>
      <Link href={`/ar/ecosystem?view=journey&stage=${stageId}&stakeholder=${stakeholderId}`}><small>الخريطة التفاعلية</small><b>عرض العلاقة ←</b></Link>
    </nav>
  </Page>;
}

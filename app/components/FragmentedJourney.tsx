"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import type { Locale } from "../i18n/config";
import type { RelationshipLevel, StageId } from "../data/stakeholderParticipation";

type FragmentMode = "visibility" | "sequence" | "dependency" | "knowledge";
export type FragmentStakeholderId = "developers" | "consultants-designers" | "authorities-regulators" | "contractors" | "banks-financial" | "property-owners";

export type FragmentStakeholderStages = Record<FragmentStakeholderId, Record<StageId, RelationshipLevel>>;

type ConnectionPath = {
  actorId: FragmentStakeholderId;
  stageId: StageId;
  relationshipLevel: RelationshipLevel;
  d: string;
  endX: number;
  endY: number;
};

type AmbientConnectionPath = {
  actorId: FragmentStakeholderId;
  stageId: StageId;
  tone: "gold" | "teal";
  d: string;
};

const stakeholders: { id: FragmentStakeholderId; en: string; ar: string }[] = [
  { id: "developers", en: "Developers", ar: "المطورون" },
  { id: "consultants-designers", en: "Consultants & Designers", ar: "الاستشاريون والمصممون" },
  { id: "authorities-regulators", en: "Authorities & Regulators", ar: "الجهات والهيئات التنظيمية" },
  { id: "contractors", en: "Contractors", ar: "المقاولون" },
  { id: "banks-financial", en: "Banks & Financial Institutions", ar: "البنوك والمؤسسات المالية" },
  { id: "property-owners", en: "Property Owners", ar: "مالكو العقارات" },
];

const stageIds: StageId[] = ["land-vision", "planning-design", "authorities-approvals", "construction-delivery", "sales-transfer", "living-operations", "asset-growth-intelligence"];
const isDirect = (level: RelationshipLevel) => level === "lead" || level === "active";

const copy = {
  en: {
    stages: ["Land & Vision", "Planning & Design", "Authorities & Approvals", "Construction & Delivery", "Sales & Transfer", "Living & Operations", "Asset Growth & Intelligence"],
    property: "One property journey",
    routeFlow: "Information, evidence and decisions move between stages — some stages overlap",
    relationshipLabels: { lead: "Lead", active: "Active", supporting: "Supporting", informed: "Informed" },
    legendLabel: "Relationship legend",
    directLegend: "Direct — Lead / Active",
    supportingLegend: "Supporting role",
    informedLegend: "Informed only",
    representative: "6 representative groups · Explore all 12",
    direct: "direct",
    supporting: "supporting",
    informed: "informed",
    instruction: "Select a fracture to reveal its effect",
    actorInstruction: "Select a participant to trace every lifecycle stage in which they are involved",
    issues: [
      { id: "visibility", number: "01", label: "No shared view", detail: "Each participant sees a different piece—not the whole journey." },
      { id: "sequence", number: "02", label: "Unclear next step", detail: "Handoffs move without a visible route or shared understanding." },
      { id: "dependency", number: "03", label: "Hidden dependencies", detail: "Work pauses when an unseen prerequisite is missed." },
      { id: "knowledge", number: "04", label: "Hard-to-find rules", detail: "People cannot easily locate the process or requirement governing their part." },
    ],
  },
  ar: {
    stages: ["الأرض والرؤية", "التخطيط والتصميم", "الجهات والموافقات", "البناء والتسليم", "المبيعات ونقل الملكية", "السكن والتشغيل", "نمو الأصول والذكاء"],
    property: "رحلة عقار واحدة",
    routeFlow: "تنتقل المعلومات والأدلة والقرارات بين المراحل — وقد تتداخل بعض المراحل",
    relationshipLabels: { lead: "قيادي", active: "نشط", supporting: "داعم", informed: "مُطّلع" },
    legendLabel: "مفتاح العلاقات",
    directLegend: "مباشر — قيادي / نشط",
    supportingLegend: "دور داعم",
    informedLegend: "للعلم فقط",
    representative: "٦ مجموعات تمثيلية · استكشف المجموعات الـ١٢",
    direct: "مباشر",
    supporting: "داعم",
    informed: "مُطّلع",
    instruction: "اختر نقطة انقطاع لتكشف أثرها",
    actorInstruction: "اختر أحد المشاركين لتتبع كل مرحلة من دورة الحياة يشارك فيها",
    issues: [
      { id: "visibility", number: "01", label: "لا توجد رؤية مشتركة", detail: "يرى كل طرف جزءاً مختلفاً، لا الرحلة كاملة." },
      { id: "sequence", number: "02", label: "الخطوة التالية غير واضحة", detail: "تنتقل المسؤولية من دون مسار ظاهر أو فهم مشترك." },
      { id: "dependency", number: "03", label: "ارتباطات خفية", detail: "يتوقف العمل عند إغفال متطلب سابق لم يكن ظاهراً." },
      { id: "knowledge", number: "04", label: "القواعد صعبة الوصول", detail: "يصعب على المشاركين معرفة الإجراء أو المتطلب الذي يحكم دورهم." },
    ],
  },
} as const;

function StakeholderIcon({ id }: { id: FragmentStakeholderId }) {
  if (id === "developers") return <svg data-icon="developer" viewBox="0 0 32 32" aria-hidden="true"><path d="M5 27h22M8 27V11h8v16m0 0V5h8v22M11 15h2m-2 4h2m-2 4h2m8-14h-2m2 5h-2m2 5h-2m2 4h-2" /></svg>;
  if (id === "consultants-designers") return <svg data-icon="consultant" viewBox="0 0 32 32" aria-hidden="true"><path d="M5 27 16 5l11 22H5Z" /><path d="m10 23 6-12 6 12H10Zm6-12v12M7 27l18-18" /></svg>;
  if (id === "authorities-regulators") return <svg data-icon="authority" viewBox="0 0 32 32" aria-hidden="true"><path d="m4 12 12-7 12 7H4Zm2 15h20M8 13v11m5-11v11m6-11v11m5-11v11" /><path d="m12.5 18 2.2 2.2 4.8-5" /></svg>;
  if (id === "contractors") return <svg data-icon="contractor" viewBox="0 0 32 32" aria-hidden="true"><path d="M5 21h22M8 21v-3a8 8 0 0 1 16 0v3M16 10V6m-4 5-2-3m10 3 2-3M7 25h18" /></svg>;
  if (id === "banks-financial") return <svg data-icon="bank" viewBox="0 0 32 32" aria-hidden="true"><path d="m4 12 12-7 12 7H4Zm2 14h20M8 13v10m5-10v10m6-10v10m5-10v10" /><circle cx="16" cy="9" r="1.3" /></svg>;
  return <svg data-icon="buyer-owner" viewBox="0 0 32 32" aria-hidden="true"><path d="m4 16 12-10 12 10M7 14v13h18V14M12 27v-8h8v8" /><path d="M21 11h6a3 3 0 0 1 0 6h-1m-2-3h5" /></svg>;
}

function IssueIcon({ mode }: { mode: FragmentMode }) {
  if (mode === "visibility") return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 16s5-8 13-8 13 8 13 8-5 8-13 8S3 16 3 16Z" /><circle cx="16" cy="16" r="3" /><path d="m5 27 22-22" /></svg>;
  if (mode === "sequence") return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="6" cy="16" r="3" /><circle cx="26" cy="16" r="3" /><path d="M9 16h5m4 0h5M14 12l4 4-4 4" /></svg>;
  if (mode === "dependency") return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="7" cy="23" r="3" /><circle cx="25" cy="23" r="3" /><circle cx="16" cy="7" r="3" /><path d="m9 20 5-10m4 0 5 10M10 23h12" /></svg>;
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 5h16a4 4 0 0 1 4 4v18H10a4 4 0 0 1-4-4V5Z" /><path d="M10 9h10M10 14h7M10 19h5" /><path d="M22 18c0-2 1-3 3-3s3 1 3 3c0 2-3 2-3 5m0 3v.5" /></svg>;
}

export function FragmentedJourney({ locale, stakeholderStages }: { locale: Locale; stakeholderStages: FragmentStakeholderStages }) {
  const [active, setActive] = useState<FragmentMode>("visibility");
  const [activeActor, setActiveActor] = useState<FragmentStakeholderId>("developers");
  const [connections, setConnections] = useState<ConnectionPath[]>([]);
  const [ambientConnections, setAmbientConnections] = useState<AmbientConnectionPath[]>([]);
  const [actorLeadPath, setActorLeadPath] = useState("");
  const [actorRailPath, setActorRailPath] = useState("");
  const [dependencyPath, setDependencyPath] = useState("");
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 560 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const content = copy[locale];
  const selected = content.issues.find((issue) => issue.id === active) ?? content.issues[0];
  const activeRelationships = stakeholderStages[activeActor];
  const directStageIds = stageIds.filter((stageId) => isDirect(activeRelationships[stageId]));
  const supportingStageIds = stageIds.filter((stageId) => activeRelationships[stageId] === "supporting");
  const informedStageIds = stageIds.filter((stageId) => activeRelationships[stageId] === "informed");
  const localized = (path: string) => locale === "en" ? path : `/ar${path}`;

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const measure = () => {
      const bounds = canvas.getBoundingClientRect();
      const actor = canvas.querySelector<HTMLButtonElement>(`button.fragment-actor[data-actor-id="${activeActor}"]`);
      if (!actor || bounds.width === 0 || bounds.height === 0) return;
      const actorBounds = actor.getBoundingClientRect();
      const actorAboveRoute = actorBounds.top < bounds.top + bounds.height / 2;
      const startX = actorBounds.left - bounds.left + actorBounds.width / 2;
      const startY = actorAboveRoute ? actorBounds.bottom - bounds.top : actorBounds.top - bounds.top;

      const nextAmbientConnections = stakeholders.flatMap((stakeholder, index) => {
        const stakeholderButton = canvas.querySelector<HTMLButtonElement>(`button.fragment-actor[data-actor-id="${stakeholder.id}"]`);
        if (!stakeholderButton) return [];
        const stakeholderBounds = stakeholderButton.getBoundingClientRect();
        const stakeholderX = stakeholderBounds.left - bounds.left + stakeholderBounds.width / 2;
        const candidateStages = stageIds.filter((stageId) => isDirect(stakeholderStages[stakeholder.id][stageId])).flatMap((stageId) => {
          const node = canvas.querySelector<HTMLElement>(`[data-stage-anchor="${stageId}"]`);
          if (!node) return [];
          const nodeBounds = node.getBoundingClientRect();
          return [{
            stageId,
            endX: nodeBounds.left - bounds.left + nodeBounds.width / 2,
            endY: nodeBounds.top - bounds.top + nodeBounds.height / 2,
          }];
        });
        const closestStage = candidateStages.sort((a, b) => Math.abs(a.endX - stakeholderX) - Math.abs(b.endX - stakeholderX))[0];
        if (!closestStage) return [];
        const aboveRoute = stakeholderBounds.top < bounds.top + bounds.height / 2;
        const stakeholderY = aboveRoute ? stakeholderBounds.bottom - bounds.top : stakeholderBounds.top - bounds.top;
        const controlY = stakeholderY + (closestStage.endY - stakeholderY) * .52;
        return [{
          actorId: stakeholder.id,
          stageId: closestStage.stageId,
          tone: index % 2 === 0 ? "gold" as const : "teal" as const,
          d: `M ${stakeholderX.toFixed(1)} ${stakeholderY.toFixed(1)} C ${stakeholderX.toFixed(1)} ${controlY.toFixed(1)}, ${closestStage.endX.toFixed(1)} ${controlY.toFixed(1)}, ${closestStage.endX.toFixed(1)} ${closestStage.endY.toFixed(1)}`,
        }];
      });
      setAmbientConnections(nextAmbientConnections);

      const stagePoints = stageIds.flatMap((stageId) => {
        const node = canvas.querySelector<HTMLElement>(`[data-stage-anchor="${stageId}"]`);
        if (!node) return [];
        const nodeBounds = node.getBoundingClientRect();
        const endX = nodeBounds.left - bounds.left + nodeBounds.width / 2;
        const endY = nodeBounds.top - bounds.top + nodeBounds.height / 2;
        return [{ stageId, relationshipLevel: activeRelationships[stageId], endX, endY }];
      });

      if (stagePoints.length > 0) {
        const routeY = stagePoints[0].endY;
        const busY = routeY + (actorAboveRoute ? -64 : 72);
        const minX = Math.min(...stagePoints.map(({ endX }) => endX));
        const maxX = Math.max(...stagePoints.map(({ endX }) => endX));
        const leadX = (minX + maxX) / 2;
        const controlY = startY + (busY - startY) * .55;
        setActorLeadPath(`M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${startX.toFixed(1)} ${controlY.toFixed(1)}, ${leadX.toFixed(1)} ${controlY.toFixed(1)}, ${leadX.toFixed(1)} ${busY.toFixed(1)}`);
        const railStartX = minX === maxX ? Math.max(16, minX - 24) : minX;
        const railEndX = minX === maxX ? Math.min(bounds.width - 16, maxX + 24) : maxX;
        setActorRailPath(`M ${railStartX.toFixed(1)} ${busY.toFixed(1)} L ${railEndX.toFixed(1)} ${busY.toFixed(1)}`);
        setConnections(stagePoints.map(({ stageId, relationshipLevel, endX, endY }) => ({
          actorId: activeActor,
          stageId,
          relationshipLevel,
          d: `M ${endX.toFixed(1)} ${busY.toFixed(1)} L ${endX.toFixed(1)} ${endY.toFixed(1)}`,
          endX,
          endY,
        })));
      } else {
        setActorLeadPath("");
        setActorRailPath("");
        setConnections([]);
      }

      const dependencyNodes = ["planning-design", "sales-transfer"].map((stageId) =>
        canvas.querySelector<HTMLElement>(`[data-stage-anchor="${stageId}"]`)?.getBoundingClientRect());
      const [from, to] = dependencyNodes;
      const dependency = from && to
        ? `M ${(from.left - bounds.left + from.width / 2).toFixed(1)} ${(from.top - bounds.top + from.height / 2).toFixed(1)} C ${(from.left - bounds.left + from.width / 2).toFixed(1)} ${(bounds.height * .82).toFixed(1)}, ${(to.left - bounds.left + to.width / 2).toFixed(1)} ${(bounds.height * .82).toFixed(1)}, ${(to.left - bounds.left + to.width / 2).toFixed(1)} ${(to.top - bounds.top + to.height / 2).toFixed(1)}`
        : "";

      setCanvasSize({ width: bounds.width, height: bounds.height });
      setDependencyPath(dependency);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [activeActor, activeRelationships, stakeholderStages]);

  const selectedActor = stakeholders.find(({ id }) => id === activeActor) ?? stakeholders[0];

  return <div className={`fragmented-journey mode-${active}`}>
    <div ref={canvasRef} className="fragmented-journey-canvas" id="fragmented-journey-visual" role="group" aria-label={`${content.property}. ${selected.detail}`}>
      <svg className="fragment-connection-field" viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`} preserveAspectRatio="none" aria-hidden="true">
        {ambientConnections.map((connection) => <path className={`fragment-ambient-link${connection.actorId === activeActor ? " is-selected-origin" : ""}`} key={`ambient-${connection.actorId}`} data-ambient-actor-id={connection.actorId} data-stage-id={connection.stageId} data-tone={connection.tone} d={connection.d} />)}
        {actorLeadPath ? <path className="fragment-actor-lead" d={actorLeadPath} /> : null}
        {actorRailPath ? <path className="fragment-actor-rail" d={actorRailPath} /> : null}
        {connections.map((connection) => <path className={`fragment-actor-branch relationship-${isDirect(connection.relationshipLevel) ? "direct" : connection.relationshipLevel}`} key={`${connection.actorId}-${connection.stageId}`} data-actor-id={connection.actorId} data-stage-id={connection.stageId} data-relationship-level={connection.relationshipLevel} data-end-x={connection.endX.toFixed(1)} data-end-y={connection.endY.toFixed(1)} d={connection.d} />)}
        {dependencyPath ? <path className="fragment-dependency-arc" d={dependencyPath} /> : null}
      </svg>

      <div className="fragment-property-core" aria-hidden="true"><i /><i /><i /><i /><span>{content.property}</span></div>

      <div className="fragment-actors" role="group" aria-label={content.actorInstruction}>
        {stakeholders.map((actor, index) => {
          const actorRelationships = stakeholderStages[actor.id];
          const relationshipSummary = stageIds.map((stageId, stageIndex) => `${content.stages[stageIndex]} — ${content.relationshipLabels[actorRelationships[stageId]]}`).join(", ");
          return <button type="button" className={`fragment-actor actor-${index + 1}${activeActor === actor.id ? " is-active" : ""}`} key={actor.id} data-actor-id={actor.id} aria-pressed={activeActor === actor.id} aria-label={`${actor[locale]}: ${relationshipSummary}`} onClick={() => setActiveActor(actor.id)} onPointerEnter={() => setActiveActor(actor.id)} onFocus={() => setActiveActor(actor.id)}>
            <StakeholderIcon id={actor.id} />
            <span>{actor[locale]}</span>
            <i className="fragment-view" aria-hidden="true"><b /><b /><b /></i>
          </button>;
        })}
      </div>

      <div className="fragment-route-heading" aria-hidden="true"><span />{content.routeFlow}<span /></div>

      <ol className="fragment-route" aria-label={content.routeFlow}>
        {content.stages.map((stage, index) => {
          const stageId = stageIds[index];
          const relationshipLevel = activeRelationships[stageId];
          const relationshipTier = isDirect(relationshipLevel) ? "direct" : relationshipLevel;
          const nextStageId = stageIds[index + 1];
          const isActiveHandoff = isDirect(relationshipLevel) && Boolean(nextStageId && isDirect(activeRelationships[nextStageId]));
          return <li className={`relationship-${relationshipTier}${relationshipTier === "direct" ? " is-connected" : ""}`} data-relationship-level={relationshipLevel} key={stageId}>
            <Link href={localized(`/property-journey/${stageId}`)} aria-label={`${String(index + 1).padStart(2, "0")} ${stage}, ${content.relationshipLabels[relationshipLevel]}`}><i data-stage-anchor={stageId}>{String(index + 1).padStart(2, "0")}</i><span>{stage}</span><small>{content.relationshipLabels[relationshipLevel]}</small></Link>
            {index < content.stages.length - 1 ? <b className={`fragment-stage-handoff${isActiveHandoff ? " is-active-flow" : ""}`} aria-hidden="true"><i /><i /></b> : null}
          </li>;
        })}
      </ol>

      <div className="fragment-actor-summary" aria-live="polite">
        <b>{selectedActor[locale]}</b>
        <span>{directStageIds.length} {content.direct}</span>
        <small>{supportingStageIds.length} {content.supporting} · {informedStageIds.length} {content.informed}</small>
      </div>

      <div className="fragment-knowledge-fog" aria-hidden="true"><span>?</span><span>?</span><span>?</span></div>
      <div className="fragment-delay-pulse" aria-hidden="true"><span>!</span></div>
    </div>

    <div className="fragment-relationship-legend" aria-label={content.legendLabel}>
      <b>{content.legendLabel}</b>
      <span className="relationship-direct">{content.directLegend}</span>
      <span className="relationship-supporting">{content.supportingLegend}</span>
      <span className="relationship-informed">{content.informedLegend}</span>
      <Link href={localized("/stakeholders")}>{content.representative} <i aria-hidden="true">↗</i></Link>
    </div>

    <div className="fragment-mode-controls" role="group" aria-label={content.instruction}>
      {content.issues.map((issue) => <button type="button" key={issue.id} className={active === issue.id ? "is-active" : ""} aria-pressed={active === issue.id} aria-controls="fragmented-journey-visual" onClick={() => setActive(issue.id)} onPointerEnter={() => setActive(issue.id)} onFocus={() => setActive(issue.id)}>
        <span>{issue.number}</span><IssueIcon mode={issue.id} /><b>{issue.label}</b>
      </button>)}
    </div>

    <div className="fragment-mode-readout" aria-live="polite"><span>{selected.number}</span><p>{selected.detail}</p></div>
  </div>;
}

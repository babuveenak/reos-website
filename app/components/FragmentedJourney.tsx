"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import type { Locale } from "../i18n/config";

type FragmentMode = "visibility" | "sequence" | "dependency" | "knowledge";
type StakeholderId = "developers" | "consultants-designers" | "authorities-regulators" | "contractors" | "banks-financial" | "property-owners";

export type FragmentStakeholderStages = Record<StakeholderId, string[]>;

type ConnectionPath = {
  actorId: StakeholderId;
  stageId: string;
  d: string;
  endX: number;
  endY: number;
};

const stakeholders: { id: StakeholderId; en: string; ar: string }[] = [
  { id: "developers", en: "Developer", ar: "المطوّر" },
  { id: "consultants-designers", en: "Consultant", ar: "الاستشاري" },
  { id: "authorities-regulators", en: "Authority", ar: "الجهة المختصة" },
  { id: "contractors", en: "Contractor", ar: "المقاول" },
  { id: "banks-financial", en: "Bank", ar: "البنك" },
  { id: "property-owners", en: "Buyer / Owner", ar: "المشتري / المالك" },
];

const stageIds = ["land-vision", "planning-design", "authorities-approvals", "construction-delivery", "sales-transfer", "living-operations", "asset-growth-intelligence"];

const copy = {
  en: {
    stages: ["Land", "Design", "Approvals", "Build", "Sales", "Living", "Growth"],
    property: "One property journey",
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
    stages: ["الأرض", "التصميم", "الموافقات", "البناء", "المبيعات", "السكن", "النمو"],
    property: "رحلة عقار واحدة",
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

function StakeholderIcon({ id }: { id: StakeholderId }) {
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
  const [activeActor, setActiveActor] = useState<StakeholderId>("developers");
  const [connections, setConnections] = useState<ConnectionPath[]>([]);
  const [dependencyPath, setDependencyPath] = useState("");
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 560 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const content = copy[locale];
  const selected = content.issues.find((issue) => issue.id === active) ?? content.issues[0];
  const activeStages = stakeholderStages[activeActor];
  const localized = (path: string) => locale === "en" ? path : `/ar${path}`;

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const measure = () => {
      const bounds = canvas.getBoundingClientRect();
      const actor = canvas.querySelector<HTMLElement>(`[data-actor-id="${activeActor}"]`);
      if (!actor || bounds.width === 0 || bounds.height === 0) return;
      const actorBounds = actor.getBoundingClientRect();
      const actorAboveRoute = actorBounds.top < bounds.top + bounds.height / 2;
      const startX = actorBounds.left - bounds.left + actorBounds.width / 2;
      const startY = actorAboveRoute ? actorBounds.bottom - bounds.top : actorBounds.top - bounds.top;

      const nextConnections = activeStages.flatMap((stageId) => {
        const node = canvas.querySelector<HTMLElement>(`[data-stage-anchor="${stageId}"]`);
        if (!node) return [];
        const nodeBounds = node.getBoundingClientRect();
        const endX = nodeBounds.left - bounds.left + nodeBounds.width / 2;
        const endY = nodeBounds.top - bounds.top + nodeBounds.height / 2;
        const curve = Math.max(38, Math.abs(endY - startY) * .48);
        const controlY = actorAboveRoute ? startY + curve : startY - curve;
        return [{
          actorId: activeActor,
          stageId,
          d: `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${startX.toFixed(1)} ${controlY.toFixed(1)}, ${endX.toFixed(1)} ${controlY.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`,
          endX,
          endY,
        }];
      });

      const dependencyNodes = ["planning-design", "sales-transfer"].map((stageId) =>
        canvas.querySelector<HTMLElement>(`[data-stage-anchor="${stageId}"]`)?.getBoundingClientRect());
      const [from, to] = dependencyNodes;
      const dependency = from && to
        ? `M ${(from.left - bounds.left + from.width / 2).toFixed(1)} ${(from.top - bounds.top + from.height / 2).toFixed(1)} C ${(from.left - bounds.left + from.width / 2).toFixed(1)} ${(bounds.height * .82).toFixed(1)}, ${(to.left - bounds.left + to.width / 2).toFixed(1)} ${(bounds.height * .82).toFixed(1)}, ${(to.left - bounds.left + to.width / 2).toFixed(1)} ${(to.top - bounds.top + to.height / 2).toFixed(1)}`
        : "";

      setCanvasSize({ width: bounds.width, height: bounds.height });
      setConnections(nextConnections);
      setDependencyPath(dependency);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [activeActor, activeStages]);

  return <div className={`fragmented-journey mode-${active}`}>
    <div ref={canvasRef} className="fragmented-journey-canvas" id="fragmented-journey-visual" role="group" aria-label={`${content.property}. ${selected.detail}`}>
      <svg className="fragment-connection-field" viewBox={`0 0 ${canvasSize.width} ${canvasSize.height}`} preserveAspectRatio="none" aria-hidden="true">
        {connections.map((connection) => <path key={`${connection.actorId}-${connection.stageId}`} data-actor-id={connection.actorId} data-stage-id={connection.stageId} data-end-x={connection.endX.toFixed(1)} data-end-y={connection.endY.toFixed(1)} d={connection.d} />)}
        {dependencyPath ? <path className="fragment-dependency-arc" d={dependencyPath} /> : null}
      </svg>

      <div className="fragment-property-core" aria-hidden="true"><i /><i /><i /><i /><span>{content.property}</span></div>

      <div className="fragment-actors" role="group" aria-label={content.actorInstruction}>
        {stakeholders.map((actor, index) => {
          const actorStages = stakeholderStages[actor.id];
          const stageNames = actorStages.map((id) => content.stages[stageIds.indexOf(id)]).join(", ");
          return <button type="button" className={`fragment-actor actor-${index + 1}${activeActor === actor.id ? " is-active" : ""}`} key={actor.id} data-actor-id={actor.id} aria-pressed={activeActor === actor.id} aria-label={`${actor[locale]}: ${stageNames}`} onClick={() => setActiveActor(actor.id)} onPointerEnter={() => setActiveActor(actor.id)} onFocus={() => setActiveActor(actor.id)}>
            <StakeholderIcon id={actor.id} />
            <span>{actor[locale]}</span>
            <i className="fragment-view" aria-hidden="true"><b /><b /><b /></i>
          </button>;
        })}
      </div>

      <ol className="fragment-route">
        {content.stages.map((stage, index) => {
          const stageId = stageIds[index];
          const isConnected = activeStages.includes(stageId);
          return <li className={isConnected ? "is-connected" : ""} key={stageId}>
            <Link href={localized(`/property-journey/${stageId}`)} aria-label={`${String(index + 1).padStart(2, "0")} ${stage}`}><i data-stage-anchor={stageId}>{String(index + 1).padStart(2, "0")}</i><span>{stage}</span></Link>
            {index < content.stages.length - 1 ? <b aria-hidden="true" /> : null}
          </li>;
        })}
      </ol>

      <div className="fragment-knowledge-fog" aria-hidden="true"><span>?</span><span>?</span><span>?</span></div>
      <div className="fragment-delay-pulse" aria-hidden="true"><span>!</span></div>
    </div>

    <div className="fragment-mode-controls" role="group" aria-label={content.instruction}>
      {content.issues.map((issue) => <button type="button" key={issue.id} className={active === issue.id ? "is-active" : ""} aria-pressed={active === issue.id} aria-controls="fragmented-journey-visual" onClick={() => setActive(issue.id)} onPointerEnter={() => setActive(issue.id)} onFocus={() => setActive(issue.id)}>
        <span>{issue.number}</span><IssueIcon mode={issue.id} /><b>{issue.label}</b>
      </button>)}
    </div>

    <div className="fragment-mode-readout" aria-live="polite"><span>{selected.number}</span><p>{selected.detail}</p></div>
  </div>;
}

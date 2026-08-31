"use client";

import { useId, useRef, useState, type CSSProperties } from "react";
import type { Stage } from "../data/journey";
import type { ParticipationState } from "../data/stakeholderBlueprints";
import type { Locale } from "../i18n/config";

type StageConnection = {
  stageId: string;
  groupNames: string[];
};

type Props = {
  stakeholderName: string;
  stages: Stage[];
  participation: ParticipationState[];
  connections: StageConnection[];
  locale: Locale;
};

const LEVEL_ORDER: ParticipationState["relationshipLevel"][] = ["lead", "active", "supporting", "informed"];

const STAGE_ACCENTS: Record<string, string> = {
  "land-vision": "#B48743",
  "planning-design": "#8E785B",
  "authorities-approvals": "#668985",
  "construction-delivery": "#7B846F",
  "sales-transfer": "#C09348",
  "living-operations": "#3F8782",
  "asset-growth-intelligence": "#A66E2F",
};

type LifecycleTier = "direct" | "supporting" | "informed";

const tierFor = (level: ParticipationState["relationshipLevel"]): LifecycleTier =>
  level === "lead" || level === "active" ? "direct" : level;

const levelLabel = (level: ParticipationState["relationshipLevel"], locale: Locale) => {
  const labels = locale === "ar"
    ? { lead: "قيادة", active: "دور نشط", supporting: "دور داعم", informed: "على اطلاع" }
    : { lead: "Lead", active: "Active", supporting: "Supporting", informed: "Informed" };
  return labels[level];
};

const tierLabel = (tier: LifecycleTier, locale: Locale) => {
  const labels = locale === "ar"
    ? { direct: "نقطة اتصال مباشرة", supporting: "دور داعم", informed: "للاطلاع فقط — دون إجراء" }
    : { direct: "Direct touchpoint", supporting: "Supporting role", informed: "Kept informed — no action" };
  return labels[tier];
};

const joinStageNames = (names: string[], locale: Locale) => {
  if (names.length <= 1) return names[0] ?? "";
  const separator = locale === "ar" ? "، " : ", ";
  const conjunction = locale === "ar" ? " و" : " and ";
  return `${names.slice(0, -1).join(separator)}${conjunction}${names[names.length - 1]}`;
};

function TierIcon({ tier }: { tier: LifecycleTier }) {
  if (tier === "direct") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.6 5.3 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9L12 3Z" /></svg>;
  if (tier === "supporting") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17h16M6 17V9m12 8V9M3 9h18L12 4 3 9Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" /><circle cx="12" cy="12" r="2.5" /></svg>;
}

export function StakeholderLifecycleMap({ stakeholderName, stages, participation, connections, locale }: Props) {
  const firstStageId = LEVEL_ORDER
    .map((level) => participation.find((item) => item.relationshipLevel === level)?.stageId)
    .find(Boolean) ?? stages[0]?.id ?? "land-vision";
  const [selectedStageId, setSelectedStageId] = useState(firstStageId);
  const mapId = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const ar = locale === "ar";
  const selectedIndex = Math.max(0, stages.findIndex((stage) => stage.id === selectedStageId));
  const selectedStage = stages[selectedIndex];
  const selectedParticipation = participation.find((item) => item.stageId === selectedStageId);
  const selectedConnections = connections.find((item) => item.stageId === selectedStageId)?.groupNames ?? [];
  const namesByLevel = (level: ParticipationState["relationshipLevel"]) => stages
    .filter((stage) => participation.find((item) => item.stageId === stage.id)?.relationshipLevel === level)
    .map((stage) => stage.name);
  const narrativeParts = [
    namesByLevel("lead").length > 0 ? (ar ? `يقود ${joinStageNames(namesByLevel("lead"), locale)}` : `lead ${joinStageNames(namesByLevel("lead"), locale)}`) : "",
    namesByLevel("active").length > 0 ? (ar ? `ويشارك مباشرة في ${joinStageNames(namesByLevel("active"), locale)}` : `are active in ${joinStageNames(namesByLevel("active"), locale)}`) : "",
    namesByLevel("supporting").length > 0 ? (ar ? `ويدعم ${joinStageNames(namesByLevel("supporting"), locale)}` : `support ${joinStageNames(namesByLevel("supporting"), locale)}`) : "",
    namesByLevel("informed").length > 0 ? (ar ? `ويبقى على اطلاع خلال ${joinStageNames(namesByLevel("informed"), locale)} دون اتخاذ إجراء` : `are only kept informed through ${joinStageNames(namesByLevel("informed"), locale)}, where no action is taken`) : "",
  ].filter(Boolean);

  if (!selectedStage || !selectedParticipation) return null;

  const selectAt = (index: number) => {
    const safeIndex = (index + stages.length) % stages.length;
    setSelectedStageId(stages[safeIndex].id);
    tabs.current[safeIndex]?.focus();
  };

  return <section className="stakeholder-lifecycle-map" aria-labelledby={`${mapId}-title`}>
    <header className="stakeholder-lifecycle-heading">
      <div>
        <span className="eyebrow">02 · {ar ? "صلة دورة الحياة" : "Lifecycle connection"}</span>
        <h2 id={`${mapId}-title`}>{ar ? "أين يتصل هذا الطرف بدورة حياة العقار." : "Where this stakeholder connects to the property lifecycle."}</h2>
      </div>
      <p>{ar
        ? "تُظهر الأحجام والارتفاعات والرموز والشارات وزن الدور، ولا يعتمد المعنى على اللون وحده."
        : "Size, elevation, icon and badge show the weight of the role—the meaning never depends on color alone."}</p>
    </header>

    <p className="stakeholder-lifecycle-narrative"><strong>{stakeholderName}</strong> {narrativeParts.join(ar ? "، " : "; ")}.</p>

    <ul className="stakeholder-lifecycle-legend" aria-label={ar ? "مفتاح مستويات المشاركة" : "Involvement tier legend"}>
      {(["direct", "supporting", "informed"] as LifecycleTier[]).map((tier) => <li key={tier} className={`legend-${tier}`}>
        <TierIcon tier={tier} />
        <span><b>{tierLabel(tier, locale)}</b><small>{tier === "direct" ? (ar ? "قيادة أو مشاركة نشطة" : "Lead or active") : tier === "supporting" ? (ar ? "مساهمة دون امتلاك القرار" : "Contributes without owning the decision") : (ar ? "وعي بالسياق فقط" : "Context awareness only")}</small></span>
      </li>)}
    </ul>

    <div className="stakeholder-lifecycle-board" role="tablist" aria-label={ar ? `دورة حياة ${stakeholderName}` : `${stakeholderName} lifecycle`}>
      <div className="stakeholder-lifecycle-grid" aria-hidden="true" />
      <div className="stakeholder-lifecycle-flow" aria-hidden="true" />
      {stages.map((stage, index) => {
        const state = participation.find((item) => item.stageId === stage.id);
        const level = state?.relationshipLevel ?? "informed";
        const tier = tierFor(level);
        const selected = selectedStageId === stage.id;
        return <button
          key={stage.id}
          ref={(node) => { tabs.current[index] = node; }}
          id={`${mapId}-tab-${stage.id}`}
          type="button"
          role="tab"
          aria-selected={selected}
          aria-controls={`${mapId}-panel`}
          tabIndex={selected ? 0 : -1}
          className={`stakeholder-lifecycle-node lifecycle-${level} lifecycle-tier-${tier}`}
          data-tier={tier}
          style={{ "--stage-accent": STAGE_ACCENTS[stage.id] ?? "#B48743" } as CSSProperties}
          onPointerEnter={() => setSelectedStageId(stage.id)}
          onFocus={() => setSelectedStageId(stage.id)}
          onClick={() => setSelectedStageId(stage.id)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") { event.preventDefault(); selectAt(index + (ar ? -1 : 1)); }
            if (event.key === "ArrowLeft") { event.preventDefault(); selectAt(index + (ar ? 1 : -1)); }
            if (event.key === "Home") { event.preventDefault(); selectAt(0); }
            if (event.key === "End") { event.preventDefault(); selectAt(stages.length - 1); }
          }}
        >
          <span>{String(stage.number).padStart(2, "0")}</span>
          <TierIcon tier={tier} />
          <b>{stage.name}</b>
          <small>{levelLabel(level, locale)}</small>
          <em>{tierLabel(tier, locale)}</em>
          {index < stages.length - 1 ? <i className="stakeholder-lifecycle-connector" aria-hidden="true" /> : null}
        </button>;
      })}
    </div>

    <article
      id={`${mapId}-panel`}
      className={`stakeholder-lifecycle-story lifecycle-story-${selectedParticipation.relationshipLevel}`}
      role="tabpanel"
      aria-labelledby={`${mapId}-tab-${selectedStageId}`}
      aria-live="polite"
    >
      <span>{String(selectedStage.number).padStart(2, "0")}</span>
      <div>
        <small>{stakeholderName} · {levelLabel(selectedParticipation.relationshipLevel, locale)} · {tierLabel(tierFor(selectedParticipation.relationshipLevel), locale)}</small>
        <h3>{selectedStage.name}</h3>
        <p>{selectedParticipation.summary}</p>
      </div>
      <aside>
        <small>{ar ? "يتصل مع" : "Connects with"}</small>
        <p>{selectedConnections.length > 0 ? selectedConnections.join(" · ") : (ar ? "يحددها نطاق المشروع والجهة المختصة" : "Defined by the project and authority route")}</p>
      </aside>
    </article>
  </section>;
}

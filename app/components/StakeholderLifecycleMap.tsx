"use client";

import { useId, useRef, useState } from "react";
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

const levelLabel = (level: ParticipationState["relationshipLevel"], locale: Locale) => {
  const labels = locale === "ar"
    ? { lead: "قيادة", active: "دور نشط", supporting: "دور داعم", informed: "على اطلاع" }
    : { lead: "Lead", active: "Active", supporting: "Supporting", informed: "Informed" };
  return labels[level];
};

const involvementLabel = (level: ParticipationState["relationshipLevel"], locale: Locale) => {
  const direct = level === "lead" || level === "active";
  if (locale === "ar") return direct ? "مشاركة مباشرة" : "مشاركة غير مباشرة";
  return direct ? "Direct involvement" : "Indirect involvement";
};

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
        ? "تظهر المراحل السبع معاً. ترتفع مراحل القيادة والمشاركة المباشرة، بينما تبقى مراحل الدعم والإحاطة مرئية في المسار."
        : "All seven stages stay visible. Lead and active stages rise from the route; supporting and informed stages remain visible in context."}</p>
    </header>

    <div className="stakeholder-lifecycle-board" role="tablist" aria-label={ar ? `دورة حياة ${stakeholderName}` : `${stakeholderName} lifecycle`}>
      <div className="stakeholder-lifecycle-grid" aria-hidden="true" />
      <div className="stakeholder-lifecycle-flow" aria-hidden="true"><i /><i /><i /></div>
      {stages.map((stage, index) => {
        const state = participation.find((item) => item.stageId === stage.id);
        const level = state?.relationshipLevel ?? "informed";
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
          className={`stakeholder-lifecycle-node lifecycle-${level}`}
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
          <b>{stage.name}</b>
          <small>{levelLabel(level, locale)}</small>
          <em>{involvementLabel(level, locale)}</em>
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
        <small>{stakeholderName} · {levelLabel(selectedParticipation.relationshipLevel, locale)} · {involvementLabel(selectedParticipation.relationshipLevel, locale)}</small>
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

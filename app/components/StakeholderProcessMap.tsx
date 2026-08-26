"use client";

import { useId, useRef, useState } from "react";
import type { Stage } from "../data/journey";
import type { AuthorityStageProcess, ProcessLane, TimeKind } from "../data/authorityProcessMaps";
import type { ParticipationState } from "../data/stakeholderBlueprints";
import type { Locale } from "../i18n/config";

type Props = {
  stakeholderName: string;
  stages: Stage[];
  participation: ParticipationState[];
  processes: AuthorityStageProcess[];
  locale: Locale;
};

const LANE_ICONS: Record<ProcessLane, React.ReactNode> = {
  you: <><circle cx="12" cy="7" r="3" /><path d="M5.5 20c.7-5.2 3-7.8 6.5-7.8s5.8 2.6 6.5 7.8" /></>,
  delivery: <><path d="M4 20h16M6 20V9l6-5 6 5v11M9 20v-6h6v6" /></>,
  authority: <><path d="M3 9h18L12 3 3 9Zm2 3h14M6 12v7m4-7v7m4-7v7m4-7v7M3 21h18" /></>,
  evidence: <><path d="M6 3h9l3 3v15H6V3Zm9 0v4h4M9 12h6m-6 4h6" /></>,
};

const laneLabel = (lane: ProcessLane, locale: Locale) => {
  const labels = locale === "ar"
    ? { you: "دورك", delivery: "فريق التنفيذ", authority: "الجهة الرسمية", evidence: "الأدلة" }
    : { you: "Your action", delivery: "Delivery team", authority: "Official authority", evidence: "Evidence" };
  return labels[lane];
};

const levelLabel = (level: ParticipationState["relationshipLevel"], locale: Locale) => {
  const labels = locale === "ar"
    ? { lead: "قيادة", active: "دور نشط", supporting: "دور داعم", informed: "على اطلاع" }
    : { lead: "Lead", active: "Active", supporting: "Supporting", informed: "Informed" };
  return labels[level];
};

const timeLabel = (kind: TimeKind, locale: Locale) => {
  const labels = locale === "ar"
    ? { "service-estimate": "تقدير خدمة رسمي", "filing-deadline": "موعد إيداع رسمي", "not-published": "مدة غير منشورة" }
    : { "service-estimate": "Authority service estimate", "filing-deadline": "Official filing deadline", "not-published": "No universal time published" };
  return labels[kind];
};

function LaneIcon({ lane }: { lane: ProcessLane }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{LANE_ICONS[lane]}</svg>;
}

export function StakeholderProcessMap({ stakeholderName, stages, participation, processes, locale }: Props) {
  const [selectedStageId, setSelectedStageId] = useState(stages[0]?.id ?? "land-vision");
  const tabId = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = Math.max(0, stages.findIndex((stage) => stage.id === selectedStageId));
  const selectedStage = stages[selectedIndex];
  const selectedParticipation = participation.find((item) => item.stageId === selectedStageId);
  const selectedProcess = processes.find((item) => item.stageId === selectedStageId);
  const ar = locale === "ar";

  if (!selectedStage || !selectedParticipation || !selectedProcess) return null;

  const selectAt = (index: number) => {
    const safeIndex = (index + stages.length) % stages.length;
    setSelectedStageId(stages[safeIndex].id);
    tabs.current[safeIndex]?.focus();
  };

  return <section className="stakeholder-process-map" aria-labelledby={`${tabId}-title`}>
    <header className="process-map-heading">
      <div>
        <span className="eyebrow">03 · {ar ? "خريطة العملية التفاعلية" : "Interactive process map"}</span>
        <h2 id={`${tabId}-title`}>{ar ? "اختر مرحلة واتبع مسارك." : "Choose a stage. Follow your route."}</h2>
      </div>
      <p>{ar ? "المصادر الرسمية تحدد القناة والمتطلبات. ويوضح REOS أين يشارك هذا الطرف دون أن يحل محل الجهة صاحبة القرار." : "Official sources define the channel and requirements. REOS shows where this group participates without replacing the decision-making authority."}</p>
    </header>

    <div className="process-stage-tabs" role="tablist" aria-label={ar ? "مراحل دورة حياة العقار" : "Property lifecycle stages"}>
      {stages.map((stage, index) => {
        const state = participation.find((item) => item.stageId === stage.id);
        const selected = stage.id === selectedStageId;
        return <button
          key={stage.id}
          ref={(node) => { tabs.current[index] = node; }}
          id={`${tabId}-tab-${stage.id}`}
          type="button"
          role="tab"
          aria-selected={selected}
          aria-controls={`${tabId}-panel`}
          tabIndex={selected ? 0 : -1}
          className={`process-stage-tab level-${state?.relationshipLevel ?? "informed"}`}
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
          <small>{state ? levelLabel(state.relationshipLevel, locale) : ""}</small>
        </button>;
      })}
    </div>

    <div
      id={`${tabId}-panel`}
      role="tabpanel"
      tabIndex={0}
      aria-labelledby={`${tabId}-tab-${selectedStageId}`}
      className="process-stage-panel"
    >
      <div className="process-role-card">
        <span>{String(selectedStage.number).padStart(2, "0")}</span>
        <div>
          <small>{stakeholderName} · {levelLabel(selectedParticipation.relationshipLevel, locale)}</small>
          <h3>{selectedStage.name}</h3>
          <p>{selectedParticipation.summary}</p>
        </div>
        <strong>{selectedProcess.gate}</strong>
      </div>

      <div className="process-flow" aria-label={ar ? `أربع خطوات في ${selectedStage.name}` : `Four-step ${selectedStage.name} process`}>
        {selectedProcess.steps.map((item, index) => <article key={item.id} className={`process-step lane-${item.lane}`}>
          <header>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <LaneIcon lane={item.lane} />
            <small>{laneLabel(item.lane, locale)}</small>
          </header>
          <h4>{item.label}</h4>
          <dl>
            <div><dt>{ar ? "من يقوم بها" : "Owner"}</dt><dd>{item.owner}</dd></div>
            <div><dt>{ar ? "القناة" : "Channel"}</dt><dd>{item.channel}</dd></div>
            <div><dt>{ar ? "الدليل الناتج" : "Evidence out"}</dt><dd>{item.evidence}</dd></div>
          </dl>
          <footer className={`time-kind time-${item.timeKind}`}><span>{timeLabel(item.timeKind, locale)}</span><b>{item.time}</b></footer>
        </article>)}
      </div>

      <div className="process-branches">
        <article className="process-branch authority-branch">
          <LaneIcon lane="authority" />
          <div><small>{ar ? "مسار الجهة" : "Authority route"}</small><b>{selectedProcess.authorityRoute}</b></div>
        </article>
        <article className="process-branch people-branch">
          <LaneIcon lane="delivery" />
          <div><small>{ar ? "الأطراف المرتبطة" : "Connected groups"}</small><p>{selectedProcess.relatedStakeholderIds.map((id) => id.replaceAll("-", " ")).join(" · ")}</p></div>
        </article>
        <article className="process-branch source-branch">
          <LaneIcon lane="evidence" />
          <div><small>{ar ? "المصادر الرسمية" : "Official sources"}</small><p>{selectedProcess.provenance.map((source) => <a key={source.sourceUrl} href={source.sourceUrl} target="_blank" rel="noreferrer">{source.source} ↗</a>)}</p></div>
        </article>
      </div>
    </div>

    <p className="process-trust-note">{ar ? "تاريخ التحقق: 26 أغسطس 2026. تقدير مدة الخدمة ليس مدة المعاملة الكاملة. يجب التحقق من متطلبات الأصل والمعاملة مباشرة مع الجهة الرسمية." : "Checked 26 August 2026. An authority service estimate is not the total transaction duration. Verify asset- and transaction-specific requirements directly with the official authority."}</p>
  </section>;
}

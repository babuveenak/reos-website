"use client";

import { useId, useRef, useState } from "react";
import type { Stage } from "../data/journey";
import type { AuthorityStageProcess, ProcessLane } from "../data/authorityProcessMaps";
import type { ParticipationState } from "../data/stakeholderBlueprints";
import type { Locale } from "../i18n/config";
import { participationFor } from "../data/stakeholderParticipation";
import type { SourceTrack } from "../data/officialSources";

type Props = {
  stakeholderId: string;
  stakeholderName: string;
  stages: Stage[];
  participation: ParticipationState[];
  processes: AuthorityStageProcess[];
  locale: Locale;
  initialStageId?: string;
  track?: SourceTrack;
};

const LANE_ICONS: Record<ProcessLane, React.ReactNode> = {
  you: <><circle cx="12" cy="7" r="3" /><path d="M5.5 20c.7-5.2 3-7.8 6.5-7.8s5.8 2.6 6.5 7.8" /></>,
  delivery: <><path d="M4 20h16M6 20V9l6-5 6 5v11M9 20v-6h6v6" /></>,
  authority: <><path d="M3 9h18L12 3 3 9Zm2 3h14M6 12v7m4-7v7m4-7v7m4-7v7M3 21h18" /></>,
  evidence: <><path d="M6 3h9l3 3v15H6V3Zm9 0v4h4M9 12h6m-6 4h6" /></>,
};

const levelLabel = (level: ParticipationState["relationshipLevel"], locale: Locale) => {
  const labels = locale === "ar"
    ? { lead: "قيادة", active: "دور نشط", supporting: "دور داعم", informed: "على اطلاع" }
    : { lead: "Lead", active: "Active", supporting: "Supporting", informed: "Informed" };
  return labels[level];
};

function LaneIcon({ lane }: { lane: ProcessLane }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{LANE_ICONS[lane]}</svg>;
}

export function StakeholderProcessMap({ stakeholderId, stakeholderName, stages, participation, processes, locale, initialStageId, track = "track-neutral" }: Props) {
  const [selectedStageId, setSelectedStageId] = useState(initialStageId ?? stages[0]?.id ?? "land-vision");
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const tabId = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedIndex = Math.max(0, stages.findIndex((stage) => stage.id === selectedStageId));
  const selectedStage = stages[selectedIndex];
  const selectedParticipation = participation.find((item) => item.stageId === selectedStageId);
  const selectedProcess = processes.find((item) => item.stageId === selectedStageId);
  const intersection = participationFor(selectedStageId, stakeholderId);
  const routeSources = intersection?.sources.filter((item) => item.tracks.includes(track)) ?? [];
  const selectedSource = routeSources.find((item) => item.id === selectedSourceId) ?? routeSources[0];
  const hasOfficialProcess = intersection?.applicability !== "not-directly-involved" && routeSources.length > 0;
  const ar = locale === "ar";

  if (!selectedStage || !selectedParticipation || !selectedProcess || !intersection) return null;

  const selectAt = (index: number) => {
    const safeIndex = (index + stages.length) % stages.length;
    setSelectedStageId(stages[safeIndex].id);
    tabs.current[safeIndex]?.focus();
  };

  return <section className="stakeholder-process-map" aria-labelledby={`${tabId}-title`}>
    <header className="process-map-heading">
      <div>
        <span className="eyebrow">04 · {ar ? "المسار الرسمي لكل مرحلة" : "Official stage walkthrough"}</span>
        <h2 id={`${tabId}-title`}>{ar ? "شاهد ما يفعله هذا الطرف في كل مرحلة." : "See what this stakeholder actually does at each stage."}</h2>
      </div>
      <p>{ar ? "تفتح الصفحة على أول مرحلة يقودها هذا الطرف. ويمكن فحص أي مرحلة أخرى دون تغيير المسار الرسمي أو سلطة اتخاذ القرار." : "The first Lead stage is open by default. Inspect another stage to see its official touchpoints without changing the authority or decision owner."}</p>
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
          data-stage-id={stage.id}
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
        <strong>{hasOfficialProcess ? selectedProcess.gate : (ar ? "لا يوجد مسار رسمي مباشر منشور لهذا التقاطع ضمن المسار المحدد." : "No direct official process is published for this intersection in the selected route.")}</strong>
      </div>

      <div className={`intersection-applicability applicability-${intersection.applicability}`}>
        <b>{intersection.applicability.replaceAll("-", " ")}</b>
        <span>{!hasOfficialProcess ? (ar ? "سياق الدور فقط؛ لا تُعرض رسوم أو مدد أو إجراءات غير مثبتة لهذا المسار." : "Role context only; no unproven authority action, fee or timing is shown for this route.") : (ar ? "اختر عقدة لعرض القناة والرسوم والمدة والمخرج الرسمي." : "Select a node to inspect its official channel, fee, duration and output.")}</span>
      </div>

      <div className="isometric-process-scene" aria-label={hasOfficialProcess ? (ar ? `خريطة تفاعلية لمرحلة ${selectedStage.name}` : `Interactive ${stakeholderName} authority context in ${selectedStage.name}`) : (ar ? `سياق دور ${stakeholderName} في ${selectedStage.name}` : `${stakeholderName} role context in ${selectedStage.name}`)}>
        <div className="isometric-grid" aria-hidden="true" />
        <article className="isometric-actor-platform">
          <span>01</span><LaneIcon lane="you" /><small>{stakeholderName}</small>
          <b>{ar ? "دور صاحب المصلحة" : "Stakeholder action"}</b>
        </article>
        {routeSources.slice(0, 5).map((source, index) => <button
          key={source.id}
          type="button"
          className={`isometric-authority-platform platform-${index + 1}`}
          aria-pressed={selectedSource?.id === source.id}
          onClick={() => setSelectedSourceId(source.id)}
        >
          <span>{String(index + 2).padStart(2, "0")}</span><LaneIcon lane="authority" />
          <small>{ar ? "سياق الجهة الرسمية" : "Official authority context"} · {source.authority}</small><b>{source.title}</b>
        </button>)}
        {hasOfficialProcess && <article className="isometric-output-platform">
          <span>{String(Math.min(7, routeSources.length + 2)).padStart(2, "0")}</span><LaneIcon lane="evidence" />
          <small>{ar ? "المخرج" : "Evidence out"}</small><b>{selectedSource?.output ?? selectedProcess.gate}</b>
        </article>}
        {hasOfficialProcess && <div className="isometric-flow-line" aria-hidden="true"><i /><i /><i /><i /><i /></div>}
      </div>

      {selectedSource && <article className="intersection-source-detail" aria-live="polite">
        <header><LaneIcon lane="authority" /><div><small>{selectedSource.authority}</small><h4>{selectedSource.title}</h4></div><a href={selectedSource.url} target="_blank" rel="noreferrer">{ar ? "المصدر الرسمي ↗" : "Official source ↗"}</a></header>
        <dl>
          <div><dt>{ar ? "القناة" : "Where"}</dt><dd>{selectedSource.channel}</dd></div>
          <div><dt>{ar ? "الرسوم" : "How much"}</dt><dd>{selectedSource.fee}</dd></div>
          <div><dt>{ar ? "المدة" : "How long"}</dt><dd>{selectedSource.duration}</dd></div>
          <div><dt>{ar ? "الدفع" : "Payment"}</dt><dd>{selectedSource.payment}</dd></div>
          <div><dt>{ar ? "المخرج" : "Official output"}</dt><dd>{selectedSource.output}</dd></div>
        </dl>
        <p>{selectedSource.applicantEligibility}</p>
        {selectedSource.caveat && <p>{selectedSource.caveat}</p>}
      </article>}

      {hasOfficialProcess ? <div className="process-branches">
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
          <div><small>{ar ? "المصادر الرسمية" : "Official sources"}</small><p>{routeSources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.authority} · {source.title} ↗</a>)}</p></div>
        </article>
      </div> : <p className="process-context-only">{ar ? "يعرض REOS موقع هذا الطرف في دورة الحياة فقط. لا يُفترض أي تقديم أو موافقة أو تسجيل رسمي ما لم يحدده المصدر والاختصاص المختاران." : "REOS shows this group’s lifecycle context only. It does not imply an official submission, approval or registration unless the selected source and jurisdiction explicitly support it."}</p>}
    </div>

    <p className="process-trust-note">{ar ? "تاريخ التحقق: 26 أغسطس 2026. تقدير مدة الخدمة ليس مدة المعاملة الكاملة. يجب التحقق من متطلبات الأصل والمعاملة مباشرة مع الجهة الرسمية." : "Checked 26 August 2026. An authority service estimate is not the total transaction duration. Verify asset- and transaction-specific requirements directly with the official authority."}</p>
  </section>;
}

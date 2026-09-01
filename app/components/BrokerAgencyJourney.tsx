"use client";

import Image from "next/image";
import { useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";
import { brokerJourneyRoutes, brokerSourceById, type BrokerJourneyEmirate, type BrokerJourneyRouteId } from "../data/brokerAgencyJourney";
import { getBrokerOperationalStages } from "../data/brokerAgencyStages";
import { EMIRATES, type EmirateId, type ParticipationState } from "../data/stakeholderBlueprints";
import type { Stage } from "../data/journey";
import type { Locale } from "../i18n/config";

type Props = { locale: Locale; initialEmirate: EmirateId; stages: Stage[]; participation: ParticipationState[] };
type DetailTab = "overview" | "requirements" | "timing" | "official";

const COPY = {
  en: {
    eyebrow: "02 · Choose your route", title: "Become an agent—or open an agency?", intro: "They are two different legal journeys. Pick the Emirate, then choose one path. REOS will show the order.",
    emirate: "First · Where will you operate?", question: "Then · What do you want to do?", individual: "Become an agent", individualHint: "Qualify · join a licensed firm · receive your card", individualAction: "Show my agent path", agency: "Open an agency", agencyHint: "Form · license · register people · operate", agencyAction: "Show my agency path", shared: "Both routes meet at compliant listings, permitted advertising and controlled transactions.", interactiveMap: "Interactive agent and agency route map", mapInstruction: "Select a destination or a numbered checkpoint", selectDestination: "Select this route", openStage: "Open stage",
    mapped: "Dubai + Abu Dhabi mapped", checked: "Official sources checked 1 September 2026", snapshot: "Guidance snapshot · not a live government feed", unavailable: "This Emirate is not mapped yet.", unavailableBody: "REOS will not copy Dubai or Abu Dhabi rules into an unmapped Emirate. Choose Dubai or Abu Dhabi to explore a sourced route.",
    mapEyebrow: "03 · Your guided operating path", mapTitle: "Your step-by-step roadmap.", mapIntro: "Choose a stage, open a task and use the four views to prepare before going to the official service.", selected: "Your route", firstMove: "Start here", sequence: "Next", parallel: "Run in parallel", conditional: "Check this condition",
    stage: "Stage", tasks: "Tasks in this stage", step: "Task", authority: "Authority / responsible party", channel: "Where to apply or complete", need: "Prerequisites and evidence", output: "Approval / output", fee: "Fee", time: "Authority duration", validity: "Validity / renewal", boundary: "Boundary — what this does not authorise", next: "Next move", official: "Official", conditionalEvidence: "Route-dependent", confirmLive: "Confirm live", officialLinks: "Open exact official service", officialNext: "Your next official action", sourceNote: "REOS explains the dependency. The authority controls the live application and decision.", journeyBegins: "Journey begins", openFirstTask: "Open first task", currentViewing: "Currently viewing", stagePath: "Five-stage journey", stageInstruction: "Choose a stage, then select a connected task.", overviewTab: "Overview", requirementsTab: "What you need", timingTab: "Fees & timing", officialTab: "Official action", previous: "Previous", nextTask: "Next", reviewOfficial: "Review official action", taskProgress: "Task progress", unlocks: "What this unlocks", verifyBrokerage: "Verify the brokerage before joining",
    lifecycle: "How this route connects to the seven-stage property lifecycle", lifecycleNote: "Optional context—not a second journey.", lead: "Lead", active: "Active", supporting: "Support", informed: "Aware",
    disclaimer: "Educational roadmap. Confirm current eligibility, fees and authority decisions before acting.",
  },
  ar: {
    eyebrow: "02 · اختر مسارك", title: "أصبح وسيطاً—أو افتح شركة وساطة؟", intro: "هما مساران قانونيان مختلفان. اختر الإمارة ثم مساراً واحداً، وستوضح REOS الترتيب.",
    emirate: "أولاً · أين ستعمل؟", question: "ثم · ماذا تريد أن تفعل؟", individual: "أصبح وسيطاً", individualHint: "تأهل · انضم لشركة مرخصة · استلم بطاقتك", individualAction: "اعرض مسار الوسيط", agency: "افتح شركة وساطة", agencyHint: "أسس · رخص · سجل الأشخاص · شغّل", agencyAction: "اعرض مسار الشركة", shared: "يلتقي المساران عند القوائم المتوافقة والإعلانات المصرح بها والمعاملات المنضبطة.", interactiveMap: "خريطة تفاعلية لمساري الوسيط والشركة", mapInstruction: "اختر وجهة أو نقطة مرحلة مرقمة", selectDestination: "اختر هذا المسار", openStage: "افتح المرحلة",
    mapped: "دبي + أبوظبي مخططتان", checked: "تم التحقق من المصادر الرسمية في 1 سبتمبر 2026", snapshot: "لقطة إرشادية · ليست تغذية حكومية حية", unavailable: "هذه الإمارة غير مخططة بعد.", unavailableBody: "لن تنقل REOS قواعد دبي أو أبوظبي إلى إمارة غير مخططة. اختر دبي أو أبوظبي لاستكشاف مسار موثق.",
    mapEyebrow: "03 · مسارك التشغيلي الموجه", mapTitle: "خارطة طريقك خطوة بخطوة.", mapIntro: "اختر مرحلة وافتح مهمة واستخدم العروض الأربعة للاستعداد قبل الانتقال إلى الخدمة الرسمية.", selected: "مسارك", firstMove: "ابدأ هنا", sequence: "التالي", parallel: "نفذ بالتوازي", conditional: "تحقق من الشرط",
    stage: "المرحلة", tasks: "مهام هذه المرحلة", step: "المهمة", authority: "الجهة / الطرف المسؤول", channel: "أين تقدم أو تكمل", need: "المتطلبات والأدلة", output: "الموافقة / المخرج", fee: "الرسوم", time: "مدة الجهة", validity: "الصلاحية / التجديد", boundary: "الحدود — ما الذي لا تخوله هذه المهمة", next: "الحركة التالية", official: "رسمي", conditionalEvidence: "حسب المسار", confirmLive: "تحقق مباشرة", officialLinks: "افتح الخدمة الرسمية المحددة", officialNext: "إجراؤك الرسمي التالي", sourceNote: "تشرح REOS الاعتمادية. وتتحكم الجهة بالطلب والقرار الحاليين.", journeyBegins: "تبدأ الرحلة", openFirstTask: "افتح المهمة الأولى", currentViewing: "المهمة المعروضة", stagePath: "رحلة من خمس مراحل", stageInstruction: "اختر مرحلة، ثم اختر مهمة مترابطة.", overviewTab: "نظرة عامة", requirementsTab: "ما تحتاجه", timingTab: "الرسوم والمدة", officialTab: "الإجراء الرسمي", previous: "السابق", nextTask: "التالي", reviewOfficial: "راجع الإجراء الرسمي", taskProgress: "تقدم المهام", unlocks: "ما الذي تتيحه", verifyBrokerage: "تحقق من شركة الوساطة قبل الانضمام",
    lifecycle: "كيف يرتبط هذا المسار بمراحل دورة العقار السبع", lifecycleNote: "سياق اختياري—وليس رحلة ثانية.", lead: "قيادة", active: "نشط", supporting: "دعم", informed: "اطلاع",
    disclaimer: "خارطة تعليمية. أكد الأهلية والرسوم وقرارات الجهات الحالية قبل التصرف.",
  },
};

function RouteIcon({ route }: { route: BrokerJourneyRouteId }) {
  return route === "individual"
    ? <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="21" r="10"/><path d="M15 54c1-13 7-20 17-20s16 7 17 20M44 18l7-5 5 5-7 5M48 14l2 2"/></svg>
    : <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 56h44M15 56V20h34v36M12 20 32 8l20 12M23 30h7v8h-7zM36 30h7v8h-7zM27 56V44h10v12"/></svg>;
}

function EvidenceBadge({ status, copy }: { status: "official" | "conditional" | "confirm-live"; copy: { official: string; conditionalEvidence: string; confirmLive: string } }) {
  const label = status === "official" ? copy.official : status === "conditional" ? copy.conditionalEvidence : copy.confirmLive;
  return <span className={`broker-evidence broker-evidence-${status}`}><span aria-hidden="true"/>{label}</span>;
}

export function BrokerAgencyJourney({ locale, initialEmirate, stages, participation }: Props) {
  const c = COPY[locale];
  const [emirate, setEmirate] = useState<EmirateId>(initialEmirate);
  const [routeId, setRouteId] = useState<BrokerJourneyRouteId>("individual");
  const mapped = emirate === "dubai" || emirate === "abu-dhabi";
  const route = mapped ? brokerJourneyRoutes[emirate as BrokerJourneyEmirate][routeId] : null;
  const operationalStages = useMemo(() => mapped ? getBrokerOperationalStages(emirate as BrokerJourneyEmirate, routeId) : [], [emirate, mapped, routeId]);
  const [stageByRoute, setStageByRoute] = useState<Record<string, string>>({});
  const [taskByRoute, setTaskByRoute] = useState<Record<string, string>>({});
  const [detailTab, setDetailTab] = useState<DetailTab>("overview");
  const routeKey = `${emirate}-${routeId}`;
  const selectedStage = operationalStages.find((item) => item.id === stageByRoute[routeKey]) ?? operationalStages[0];
  const selectedStep = selectedStage?.tasks.find((task) => task.id === taskByRoute[routeKey]) ?? selectedStage?.tasks[0];
  const allTasks = operationalStages.flatMap((item) => item.tasks);
  const selectedTaskIndex = selectedStep ? allTasks.findIndex((task) => task.id === selectedStep.id) : -1;
  const selectedStageIndex = selectedStage ? operationalStages.findIndex((item) => item.id === selectedStage.id) : -1;
  const firstTask = allTasks[0];
  const T = (value: { en: string; ar: string }) => value[locale];
  const selectStage = (id: string) => {
    const nextStage = operationalStages.find((item) => item.id === id);
    setStageByRoute((current) => ({ ...current, [routeKey]: id }));
    if (nextStage?.tasks[0]) setTaskByRoute((current) => ({ ...current, [routeKey]: nextStage.tasks[0].id }));
    setDetailTab("overview");
  };
  const selectStep = (id: string) => {
    setTaskByRoute((current) => ({ ...current, [routeKey]: id }));
    setDetailTab("overview");
  };
  const chooseRoute = (id: BrokerJourneyRouteId) => {
    setRouteId(id);
    setDetailTab("overview");
  };
  const chooseEmirate = (id: EmirateId) => {
    setEmirate(id);
    setDetailTab("overview");
  };
  const openMapStage = (stageId: string, taskId?: string) => {
    setStageByRoute((current) => ({ ...current, [routeKey]: stageId }));
    if (taskId) setTaskByRoute((current) => ({ ...current, [routeKey]: taskId }));
    setDetailTab("overview");
    requestAnimationFrame(() => document.getElementById("broker-process")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const tiltMap = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
    const vertical = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
    event.currentTarget.style.setProperty("--map-tilt-x", `${(-vertical * 2.2).toFixed(2)}deg`);
    event.currentTarget.style.setProperty("--map-tilt-y", `${(horizontal * 2.8).toFixed(2)}deg`);
  };
  const resetMapTilt = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.removeProperty("--map-tilt-x");
    event.currentTarget.style.removeProperty("--map-tilt-y");
  };
  const relationLabel = selectedStep?.relation === "parallel" ? c.parallel : selectedStep?.relation === "conditional" ? c.conditional : c.sequence;
  const moveTask = (offset: number) => {
    const target = allTasks[selectedTaskIndex + offset];
    if (!target) return;
    const targetStage = operationalStages.find((item) => item.tasks.some((task) => task.id === target.id));
    if (targetStage) setStageByRoute((current) => ({ ...current, [routeKey]: targetStage.id }));
    setTaskByRoute((current) => ({ ...current, [routeKey]: target.id }));
    setDetailTab("overview");
  };

  return <section className="broker-agency-journey broker-operating-map" aria-labelledby="broker-journey-title">
    <header className="broker-operating-heading">
      <div><span className="eyebrow">{c.eyebrow}</span><h2 id="broker-journey-title">{c.title}</h2></div>
      <div><p>{c.intro}</p><small>{c.disclaimer}</small></div>
    </header>

    <div className="broker-route-studio">
      <div className="broker-route-decision">
        <label className="broker-emirate-control"><span>{c.emirate}</span><select value={emirate} onChange={(event) => chooseEmirate(event.target.value as EmirateId)}>{EMIRATES.map((item) => <option key={item.id} value={item.id}>{locale === "ar" ? item.ar : item.label}</option>)}</select></label>
        <fieldset className="broker-route-control"><legend>{c.question}</legend>
          <button type="button" className={routeId === "individual" ? "active" : ""} aria-pressed={routeId === "individual"} onClick={() => chooseRoute("individual")}><span className="broker-route-icon"><RouteIcon route="individual"/></span><span><b>{c.individual}</b><small>{c.individualHint}</small></span><i>{c.individualAction} →</i></button>
          <button type="button" className={routeId === "agency" ? "active" : ""} aria-pressed={routeId === "agency"} onClick={() => chooseRoute("agency")}><span className="broker-route-icon"><RouteIcon route="agency"/></span><span><b>{c.agency}</b><small>{c.agencyHint}</small></span><i>{c.agencyAction} →</i></button>
        </fieldset>
        <p className="broker-shared-rail"><span aria-hidden="true"/> {c.shared}</p>
      </div>

      <div className={`broker-route-visual route-${routeId}`} role="group" aria-label={c.interactiveMap} onPointerMove={tiltMap} onPointerLeave={resetMapTilt}>
        <div className="broker-visual-halo"/>
        <div className="broker-route-map-layer">
          <Image src="/images/brokers-agencies-operating-map-v1.png" alt="" width={1536} height={1024} priority sizes="(max-width: 900px) 100vw, 58vw"/>
          <span className="broker-map-branch broker-map-branch-individual" aria-hidden="true"/><span className="broker-map-branch broker-map-branch-agency" aria-hidden="true"/>
          <button type="button" className={`broker-map-destination broker-map-destination-individual${routeId === "individual" ? " active" : ""}`} aria-pressed={routeId === "individual"} onClick={() => chooseRoute("individual")}><RouteIcon route="individual"/><span><b>{c.individual}</b><small>{c.selectDestination}</small></span></button>
          <button type="button" className={`broker-map-destination broker-map-destination-agency${routeId === "agency" ? " active" : ""}`} aria-pressed={routeId === "agency"} onClick={() => chooseRoute("agency")}><RouteIcon route="agency"/><span><b>{c.agency}</b><small>{c.selectDestination}</small></span></button>
          {mapped && operationalStages.map((item, index) => <button key={item.id} type="button" className={`broker-map-checkpoint broker-map-checkpoint-${index + 1}${selectedStage?.id === item.id ? " active" : ""}`} aria-label={`${c.openStage} ${item.number}: ${T(item.title)}`} aria-current={selectedStage?.id === item.id ? "step" : undefined} onClick={() => openMapStage(item.id, item.tasks[0]?.id)}><span>{String(item.number).padStart(2, "0")}</span><b>{T(item.title)}</b></button>)}
          <span className="broker-map-signal broker-map-signal-one"/><span className="broker-map-signal broker-map-signal-two"/><span className="broker-map-signal broker-map-signal-three"/>
        </div>
        <p className="broker-map-instruction"><span aria-hidden="true">↗</span>{c.mapInstruction}</p>
      </div>
    </div>

    <div className="broker-source-strip"><b>{c.mapped}</b><span>{c.checked}</span><span>{c.snapshot}</span></div>

    {!mapped || !route || !selectedStep ? <div className="broker-unmapped"><span className="broker-unmapped-mark" aria-hidden="true">?</span><div><h3>{c.unavailable}</h3><p>{c.unavailableBody}</p></div></div> : <>
      <section className="broker-path-section" id="broker-process">
        <header className="broker-path-heading"><div><span className="eyebrow">{c.mapEyebrow}</span><h3>{c.mapTitle}</h3></div><p>{c.mapIntro}</p></header>
        <div className="broker-route-summary"><span>{c.selected}</span><RouteIcon route={routeId}/><div><h4>{T(route.title)}</h4><p>{T(route.boundary)}</p></div><aside><small>{c.journeyBegins}</small><b>{firstTask.code} · {T(firstTask.title)}</b><button type="button" onClick={() => selectStage(operationalStages[0].id)}>{c.openFirstTask} →</button></aside></div>

        <div className="broker-guided-workspace">
          <nav className="broker-stage-path" aria-label={c.stagePath}>
            <header><b>{c.stagePath}</b><span>{c.stageInstruction}</span></header>
            <ol>{operationalStages.map((item, index) => <li key={item.id} className={index === selectedStageIndex ? "active" : ""}>
              <button type="button" aria-current={index === selectedStageIndex ? "step" : undefined} onClick={() => selectStage(item.id)}>
                <span>{String(item.number).padStart(2, "0")}</span><b>{T(item.title)}</b><small>{item.tasks.length} {c.tasks.toLowerCase()}</small>
              </button>
            </li>)}</ol>
          </nav>

          <section className="broker-task-route" aria-labelledby="broker-current-stage">
            <header><div><small>{c.stage} {String(selectedStage.number).padStart(2, "0")}</small><h4 id="broker-current-stage">{T(selectedStage.title)}</h4></div><p>{T(selectedStage.summary)}</p></header>
            <div>{selectedStage.tasks.map((task, index) => <button key={task.id} type="button" className={selectedStep.id === task.id ? "active" : ""} aria-current={selectedStep.id === task.id ? "step" : undefined} onClick={() => selectStep(task.id)}>
              <span>{task.code}</span><b>{T(task.title)}</b><small>{T(task.authority).split(" · ")[0]}</small>{index < selectedStage.tasks.length - 1 ? <i aria-hidden="true">→</i> : null}
            </button>)}</div>
          </section>

          <article className="broker-step-detail broker-step-workspace broker-compact-detail" id={selectedStep.id} aria-live="polite">
            <header><div className="broker-current-task-label"><span>{c.currentViewing}</span><b>{selectedStep.code}</b><small>{c.stage} {selectedStage.number} · {relationLabel}</small><EvidenceBadge status={selectedStep.evidence} copy={c}/></div><div><h4>{T(selectedStep.title)}</h4><p>{T(selectedStep.summary)}</p></div></header>

            <nav className="broker-detail-tabs" aria-label={`${selectedStep.code} ${c.step}`}>
              {([ ["overview", c.overviewTab], ["requirements", c.requirementsTab], ["timing", c.timingTab], ["official", c.officialTab] ] as [DetailTab, string][]).map(([id, label]) => <button key={id} type="button" aria-pressed={detailTab === id} aria-controls={`${selectedStep.id}-panel`} onClick={() => setDetailTab(id)}>{label}</button>)}
            </nav>

            <div className="broker-detail-panel" id={`${selectedStep.id}-panel`}>
              {detailTab === "overview" ? <div className="broker-detail-grid broker-detail-primary">
                <section><span className="broker-detail-icon" aria-hidden="true">A</span><small>{c.authority}</small><b>{T(selectedStep.authority)}</b></section>
                <section><span className="broker-detail-icon" aria-hidden="true">↗</span><small>{c.channel}</small><b>{T(selectedStep.channel)}</b></section>
                <section><span className="broker-detail-icon" aria-hidden="true">◇</span><small>{c.output}</small><b>{T(selectedStep.output)}</b></section>
                <section><span className="broker-detail-icon" aria-hidden="true">→</span><small>{c.unlocks}</small><b>{T(selectedStep.next)}</b></section>
              </div> : null}
              {detailTab === "requirements" ? <div className="broker-requirements-panel"><section><small>{c.need}</small><ul>{selectedStep.requirements.map((item) => <li key={item.en}>{T(item)}</li>)}</ul></section><aside><small>{c.boundary}</small><p>{T(selectedStep.boundary)}</p></aside></div> : null}
              {detailTab === "timing" ? <div className="broker-fact-ribbon broker-fact-ribbon-focused"><div><small>{c.fee}</small><b>{T(selectedStep.fee)}</b></div><div><small>{c.time}</small><b>{T(selectedStep.time)}</b></div><div><small>{c.validity}</small><b>{T(selectedStep.validity)}</b></div></div> : null}
              {detailTab === "official" ? <div className="broker-detail-actions broker-detail-actions-focused"><header><small>{c.officialNext}</small><b>{T(selectedStep.output)}</b></header><p>{c.sourceNote}</p><div>{selectedStep.sourceIds.map((sourceId) => { const source = brokerSourceById[sourceId]; return source ? <a key={sourceId} href={source.url} target="_blank" rel="noreferrer"><span>{source.authority}</span><b>{source.title}</b><small>{c.officialLinks} ↗</small></a> : null; })}</div>{emirate === "dubai" && routeId === "individual" && selectedStep.code === "A-02" ? <a className="broker-directory-link broker-directory-link-focused" href={brokerSourceById["dld-directory"].url} target="_blank" rel="noreferrer">{c.verifyBrokerage} ↗</a> : null}</div> : null}
            </div>

            <nav className="broker-step-pagination broker-step-navigation" aria-label={c.taskProgress}>
              <button type="button" disabled={selectedTaskIndex <= 0} onClick={() => moveTask(-1)}><span>←</span>{c.previous}</button>
              <span><small>{c.taskProgress}</small>{String(selectedTaskIndex + 1).padStart(2, "0")} / {String(allTasks.length).padStart(2, "0")}</span>
              {selectedTaskIndex + 1 < allTasks.length ? <button type="button" onClick={() => moveTask(1)}>{c.nextTask}<span>→</span></button> : <button type="button" onClick={() => setDetailTab("official")}>{c.reviewOfficial}<span>↗</span></button>}
            </nav>
          </article>
        </div>

        <details className="broker-lifecycle-crosswalk"><summary><span>{c.lifecycle}</span><small>{c.lifecycleNote}</small><i aria-hidden="true">+</i></summary><ol>{stages.map((stage, index) => { const state = participation[index]; const involved = route.steps.some((step) => step.stageIds.includes(stage.id)); const level = state?.relationshipLevel ?? "informed"; const levelLabel = level === "lead" ? c.lead : level === "active" ? c.active : level === "supporting" ? c.supporting : c.informed; return <li key={stage.id} className={involved ? `involved level-${level}` : ""}><span>{String(index + 1).padStart(2, "0")}</span><b>{stage.short}</b><small>{involved ? levelLabel : "—"}</small></li>; })}</ol></details>
      </section>
    </>}
  </section>;
}

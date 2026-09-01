"use client";

import Image from "next/image";
import { useMemo, useState, type PointerEvent as ReactPointerEvent } from "react";
import { brokerJourneyRoutes, brokerSourceById, type BrokerJourneyEmirate, type BrokerJourneyRouteId } from "../data/brokerAgencyJourney";
import { getBrokerOperationalStages } from "../data/brokerAgencyStages";
import { EMIRATES, type EmirateId, type ParticipationState } from "../data/stakeholderBlueprints";
import type { Stage } from "../data/journey";
import type { Locale } from "../i18n/config";

type Props = { locale: Locale; initialEmirate: EmirateId; stages: Stage[]; participation: ParticipationState[] };

const COPY = {
  en: {
    eyebrow: "02 · Choose your route", title: "Become an agent—or open an agency?", intro: "They are two different legal journeys. Pick the Emirate, then choose one path. REOS will show the order.",
    emirate: "First · Where will you operate?", question: "Then · What do you want to do?", individual: "Become an agent", individualHint: "Qualify · join a licensed firm · receive your card", individualAction: "Show my agent path", agency: "Open an agency", agencyHint: "Form · license · register people · operate", agencyAction: "Show my agency path", shared: "Both routes meet at compliant listings, permitted advertising and controlled transactions.", interactiveMap: "Interactive agent and agency route map", mapInstruction: "Select a destination or a numbered checkpoint", selectDestination: "Select this route", openStage: "Open stage",
    mapped: "Dubai + Abu Dhabi mapped", checked: "Official sources checked 1 September 2026", snapshot: "Guidance snapshot · not a live government feed", unavailable: "This Emirate is not mapped yet.", unavailableBody: "REOS will not copy Dubai or Abu Dhabi rules into an unmapped Emirate. Choose Dubai or Abu Dhabi to explore a sourced route.",
    mapEyebrow: "03 · Your guided operating path", mapTitle: "Follow the illuminated route.", mapIntro: "Select any platform to see who controls it, what you need and what unlocks the next move.", selected: "Your route", firstMove: "Start here", sequence: "Next", parallel: "Run in parallel", conditional: "Check this condition",
    stage: "Stage", tasks: "Tasks in this stage", step: "Task", authority: "Authority / responsible party", channel: "Where to apply or complete", need: "Prerequisites and evidence", output: "Approval / output", fee: "Fee", time: "Authority duration", validity: "Validity / renewal", boundary: "Boundary — what this does not authorise", next: "Next move", official: "Official", conditionalEvidence: "Route-dependent", confirmLive: "Confirm live", officialLinks: "Open exact official service", sourceNote: "REOS explains the dependency. The authority controls the live application and decision.",
    lifecycle: "How this route connects to the seven-stage property lifecycle", lifecycleNote: "Optional context—not a second journey.", lead: "Lead", active: "Active", supporting: "Support", informed: "Aware",
    finishEyebrow: "04 · Official action pack", finishTitle: "Verify. Then continue.", finishIntro: "Use this compact handoff only after reviewing the selected task above. The authority still controls eligibility, payment and the final decision.", selectedTask: "Selected task", readiness: "Ready when these signals are confirmed", verifyIdentity: "Route matches the person or company", verifyAuthority: "Authority and activity are current", verifyEvidence: "Prerequisites are complete and valid", verifyAction: "Expected output is understood", taskSources: "Official actions for this task", sources: "All route references", directory: "Verify a Dubai broker or office", noDirectory: "For Abu Dhabi, use the listed ADREC/DARI services to verify the route. REOS does not present an unconfirmed directory as a live registry.", disclaimer: "Educational roadmap. Confirm current eligibility, fees and authority decisions before acting.",
  },
  ar: {
    eyebrow: "02 · اختر مسارك", title: "أصبح وسيطاً—أو افتح شركة وساطة؟", intro: "هما مساران قانونيان مختلفان. اختر الإمارة ثم مساراً واحداً، وستوضح REOS الترتيب.",
    emirate: "أولاً · أين ستعمل؟", question: "ثم · ماذا تريد أن تفعل؟", individual: "أصبح وسيطاً", individualHint: "تأهل · انضم لشركة مرخصة · استلم بطاقتك", individualAction: "اعرض مسار الوسيط", agency: "افتح شركة وساطة", agencyHint: "أسس · رخص · سجل الأشخاص · شغّل", agencyAction: "اعرض مسار الشركة", shared: "يلتقي المساران عند القوائم المتوافقة والإعلانات المصرح بها والمعاملات المنضبطة.", interactiveMap: "خريطة تفاعلية لمساري الوسيط والشركة", mapInstruction: "اختر وجهة أو نقطة مرحلة مرقمة", selectDestination: "اختر هذا المسار", openStage: "افتح المرحلة",
    mapped: "دبي + أبوظبي مخططتان", checked: "تم التحقق من المصادر الرسمية في 1 سبتمبر 2026", snapshot: "لقطة إرشادية · ليست تغذية حكومية حية", unavailable: "هذه الإمارة غير مخططة بعد.", unavailableBody: "لن تنقل REOS قواعد دبي أو أبوظبي إلى إمارة غير مخططة. اختر دبي أو أبوظبي لاستكشاف مسار موثق.",
    mapEyebrow: "03 · مسارك التشغيلي الموجه", mapTitle: "اتبع المسار المضيء.", mapIntro: "اختر أي منصة لمعرفة الجهة المسؤولة وما تحتاجه وما الذي يفتح الخطوة التالية.", selected: "مسارك", firstMove: "ابدأ هنا", sequence: "التالي", parallel: "نفذ بالتوازي", conditional: "تحقق من الشرط",
    stage: "المرحلة", tasks: "مهام هذه المرحلة", step: "المهمة", authority: "الجهة / الطرف المسؤول", channel: "أين تقدم أو تكمل", need: "المتطلبات والأدلة", output: "الموافقة / المخرج", fee: "الرسوم", time: "مدة الجهة", validity: "الصلاحية / التجديد", boundary: "الحدود — ما الذي لا تخوله هذه المهمة", next: "الحركة التالية", official: "رسمي", conditionalEvidence: "حسب المسار", confirmLive: "تحقق مباشرة", officialLinks: "افتح الخدمة الرسمية المحددة", sourceNote: "تشرح REOS الاعتمادية. وتتحكم الجهة بالطلب والقرار الحاليين.",
    lifecycle: "كيف يرتبط هذا المسار بمراحل دورة العقار السبع", lifecycleNote: "سياق اختياري—وليس رحلة ثانية.", lead: "قيادة", active: "نشط", supporting: "دعم", informed: "اطلاع",
    finishEyebrow: "04 · حزمة الإجراء الرسمي", finishTitle: "تحقق. ثم تابع.", finishIntro: "استخدم هذا التسليم المختصر بعد مراجعة المهمة المختارة أعلاه. تظل الجهة صاحبة قرار الأهلية والدفع والقرار النهائي.", selectedTask: "المهمة المختارة", readiness: "تكون جاهزاً عند تأكيد هذه الإشارات", verifyIdentity: "المسار يطابق الشخص أو الشركة", verifyAuthority: "الجهة والنشاط حاليان", verifyEvidence: "المتطلبات مكتملة وسارية", verifyAction: "المخرج المتوقع مفهوم", taskSources: "الإجراءات الرسمية لهذه المهمة", sources: "كل مراجع المسار", directory: "تحقق من وسيط أو مكتب في دبي", noDirectory: "استخدم خدمات مركز أبوظبي العقاري/داري المدرجة للتحقق من المسار. لا تعرض REOS دليلاً غير مؤكد كسجل حي.", disclaimer: "خارطة تعليمية. أكد الأهلية والرسوم وقرارات الجهات الحالية قبل التصرف.",
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
  const routeKey = `${emirate}-${routeId}`;
  const selectedStage = operationalStages.find((item) => item.id === stageByRoute[routeKey]) ?? operationalStages[0];
  const selectedStep = selectedStage?.tasks.find((task) => task.id === taskByRoute[routeKey]) ?? selectedStage?.tasks[0];
  const allTasks = operationalStages.flatMap((item) => item.tasks);
  const selectedTaskIndex = selectedStep ? allTasks.findIndex((task) => task.id === selectedStep.id) : -1;
  const routeSources = useMemo(() => {
    if (!route || !operationalStages.length) return [];
    const ids = [...new Set(operationalStages.flatMap((item) => item.tasks.flatMap((task) => task.sourceIds)))];
    return ids.map((id) => brokerSourceById[id]).filter(Boolean);
  }, [operationalStages, route]);
  const T = (value: { en: string; ar: string }) => value[locale];
  const selectStage = (id: string) => setStageByRoute((current) => ({ ...current, [routeKey]: id }));
  const selectStep = (id: string) => setTaskByRoute((current) => ({ ...current, [routeKey]: id }));
  const chooseRoute = (id: BrokerJourneyRouteId, moveToProcess = true) => {
    setRouteId(id);
    if (moveToProcess) requestAnimationFrame(() => document.getElementById("broker-process")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const openMapStage = (stageId: string, taskId?: string) => {
    setStageByRoute((current) => ({ ...current, [routeKey]: stageId }));
    if (taskId) setTaskByRoute((current) => ({ ...current, [routeKey]: taskId }));
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

  return <section className="broker-agency-journey broker-operating-map" aria-labelledby="broker-journey-title">
    <header className="broker-operating-heading">
      <div><span className="eyebrow">{c.eyebrow}</span><h2 id="broker-journey-title">{c.title}</h2></div>
      <div><p>{c.intro}</p><small>{c.disclaimer}</small></div>
    </header>

    <div className="broker-route-studio">
      <div className="broker-route-decision">
        <label className="broker-emirate-control"><span>{c.emirate}</span><select value={emirate} onChange={(event) => setEmirate(event.target.value as EmirateId)}>{EMIRATES.map((item) => <option key={item.id} value={item.id}>{locale === "ar" ? item.ar : item.label}</option>)}</select></label>
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
          <button type="button" className={`broker-map-destination broker-map-destination-individual${routeId === "individual" ? " active" : ""}`} aria-pressed={routeId === "individual"} onClick={() => chooseRoute("individual", false)}><RouteIcon route="individual"/><span><b>{c.individual}</b><small>{c.selectDestination}</small></span></button>
          <button type="button" className={`broker-map-destination broker-map-destination-agency${routeId === "agency" ? " active" : ""}`} aria-pressed={routeId === "agency"} onClick={() => chooseRoute("agency", false)}><RouteIcon route="agency"/><span><b>{c.agency}</b><small>{c.selectDestination}</small></span></button>
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
        <div className="broker-route-summary"><span>{c.selected}</span><RouteIcon route={routeId}/><div><h4>{T(route.title)}</h4><p>{T(route.boundary)}</p></div><aside><small>{c.firstMove}</small><b>{selectedStep.code} · {T(selectedStep.title)}</b></aside></div>

        <div className="broker-stage-explorer">
          <div className="broker-stage-accordion" aria-label={T(route.title)}>
            <div className="broker-stage-spine" aria-hidden="true"/>
            {operationalStages.map((item) => {
              const active = item.id === selectedStage.id;
              return <section key={item.id} className={`broker-stage-card${active ? " active" : ""}`}>
                <button type="button" className="broker-stage-trigger" aria-expanded={active} onClick={() => selectStage(item.id)}>
                  <span>{item.number} / {operationalStages.length}</span><div><small>{c.stage} {String(item.number).padStart(2, "0")}</small><b>{T(item.title)}</b></div><i aria-hidden="true">{active ? "−" : "+"}</i>
                </button>
                {active && <div className="broker-stage-tasks"><p>{T(item.summary)}</p><small>{item.tasks.length} · {c.tasks}</small><div>{item.tasks.map((task) => <button key={task.id} type="button" className={selectedStep.id === task.id ? "active" : ""} aria-current={selectedStep.id === task.id ? "step" : undefined} onClick={() => selectStep(task.id)}><span>{task.code}</span><b>{T(task.title)}</b><small>{T(task.authority).split(" · ")[0]}</small><i aria-hidden="true">→</i></button>)}</div></div>}
              </section>;
            })}
          </div>

          <article className="broker-step-detail broker-step-workspace" id={selectedStep.id} aria-live="polite">
            <div className="broker-step-model" aria-hidden="true"><span>{selectedStep.code}</span><i/><i/><i/></div>
            <header><div><span>{c.stage} {selectedStage.number} · {c.step} {selectedStep.code} · {relationLabel}</span><EvidenceBadge status={selectedStep.evidence} copy={c}/></div><h4>{T(selectedStep.title)}</h4><p>{T(selectedStep.summary)}</p></header>
            <div className="broker-detail-grid broker-detail-primary">
              <section><span className="broker-detail-icon" aria-hidden="true">A</span><small>{c.authority}</small><b>{T(selectedStep.authority)}</b></section>
              <section><span className="broker-detail-icon" aria-hidden="true">↗</span><small>{c.channel}</small><b>{T(selectedStep.channel)}</b></section>
              <section><span className="broker-detail-icon" aria-hidden="true">✓</span><small>{c.need}</small><ul>{selectedStep.requirements.map((item) => <li key={item.en}>{T(item)}</li>)}</ul></section>
              <section><span className="broker-detail-icon" aria-hidden="true">◇</span><small>{c.output}</small><b>{T(selectedStep.output)}</b></section>
            </div>
            <div className="broker-fact-ribbon"><div><small>{c.fee}</small><b>{T(selectedStep.fee)}</b></div><div><small>{c.time}</small><b>{T(selectedStep.time)}</b></div><div><small>{c.validity}</small><b>{T(selectedStep.validity)}</b></div></div>
            <div className="broker-boundary-card"><small>{c.boundary}</small><p>{T(selectedStep.boundary)}</p></div>
            <div className="broker-detail-actions"><p>{c.sourceNote}</p><div>{selectedStep.sourceIds.map((sourceId) => { const source = brokerSourceById[sourceId]; return source ? <a key={sourceId} href={source.url} target="_blank" rel="noreferrer"><span>{source.authority}</span>{c.officialLinks} ↗</a> : null; })}</div></div>
            <nav className="broker-step-pagination" aria-label={c.next}><span>{String(selectedTaskIndex + 1).padStart(2, "0")} / {String(allTasks.length).padStart(2, "0")}</span>{selectedTaskIndex + 1 < allTasks.length ? <button type="button" onClick={() => { const nextTask = allTasks[selectedTaskIndex + 1]; const nextStage = operationalStages.find((item) => item.tasks.some((task) => task.id === nextTask.id)); if (nextStage) selectStage(nextStage.id); selectStep(nextTask.id); }}>{c.next}: {T(selectedStep.next)} <span>→</span></button> : <a href="#broker-verification">{c.next}: {c.finishEyebrow.replace("04 · ", "")} <span>↓</span></a>}</nav>
          </article>
        </div>

        <details className="broker-lifecycle-crosswalk"><summary><span>{c.lifecycle}</span><small>{c.lifecycleNote}</small><i aria-hidden="true">+</i></summary><ol>{stages.map((stage, index) => { const state = participation[index]; const involved = route.steps.some((step) => step.stageIds.includes(stage.id)); const level = state?.relationshipLevel ?? "informed"; const levelLabel = level === "lead" ? c.lead : level === "active" ? c.active : level === "supporting" ? c.supporting : c.informed; return <li key={stage.id} className={involved ? `involved level-${level}` : ""}><span>{String(index + 1).padStart(2, "0")}</span><b>{stage.short}</b><small>{involved ? levelLabel : "—"}</small></li>; })}</ol></details>
      </section>

      <section className="broker-verification" id="broker-verification">
        <header><span className="eyebrow">{c.finishEyebrow}</span><h3>{c.finishTitle}</h3><p>{c.finishIntro}</p></header>
        <div className="broker-official-pack">
          <article className="broker-pack-task">
            <div className="broker-pack-model" aria-hidden="true"><span>{selectedStep.code}</span><i/><i/></div>
            <div><small>{c.selectedTask} · {T(route.shortTitle)}</small><h4>{T(selectedStep.title)}</h4><p>{T(selectedStep.authority)}</p><EvidenceBadge status={selectedStep.evidence} copy={c}/></div>
          </article>
          <section className="broker-pack-readiness"><small>{c.readiness}</small><ol>{[c.verifyIdentity, c.verifyAuthority, c.verifyEvidence, c.verifyAction].map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b><i aria-hidden="true">✓</i></li>)}</ol></section>
          <aside className="broker-pack-actions"><small>{c.taskSources}</small><div>{selectedStep.sourceIds.map((sourceId) => { const source = brokerSourceById[sourceId]; return source ? <a key={source.id} href={source.url} target="_blank" rel="noreferrer"><span>{source.authority}</span><b>{source.title}</b><i aria-hidden="true">↗</i></a> : null; })}</div>{emirate === "dubai" ? <a className="broker-directory-link" href={brokerSourceById["dld-directory"].url} target="_blank" rel="noreferrer">{c.directory} ↗</a> : <p className="broker-directory-note">{c.noDirectory}</p>}<details className="broker-source-drawer"><summary>{c.sources}<span>+</span></summary><div>{routeSources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer"><span>{source.authority}</span><b>{source.title}</b><small>{locale === "ar" ? "تم التحقق" : "Checked"} {source.checkedOn} ↗</small></a>)}</div></details></aside>
        </div>
      </section>
    </>}
  </section>;
}

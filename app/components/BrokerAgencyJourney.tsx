"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { brokerJourneyRoutes, brokerSourceById, type BrokerJourneyEmirate, type BrokerJourneyRouteId } from "../data/brokerAgencyJourney";
import { EMIRATES, type EmirateId, type ParticipationState } from "../data/stakeholderBlueprints";
import type { Stage } from "../data/journey";
import type { Locale } from "../i18n/config";

type Props = { locale: Locale; initialEmirate: EmirateId; stages: Stage[]; participation: ParticipationState[] };

const COPY = {
  en: {
    eyebrow: "02 · Choose your route", title: "Become an agent—or open an agency?", intro: "They are two different legal journeys. Pick the Emirate, then choose one path. REOS will show the order.",
    emirate: "First · Where will you operate?", question: "Then · What do you want to do?", individual: "Become an agent", individualHint: "Qualify · join a licensed firm · receive your card", individualAction: "Show my agent path", agency: "Open an agency", agencyHint: "Form · license · register people · operate", agencyAction: "Show my agency path", shared: "Both routes meet at compliant listings, permitted advertising and controlled transactions.",
    mapped: "Dubai + Abu Dhabi mapped", checked: "Official sources checked 1 September 2026", snapshot: "Guidance snapshot · not a live government feed", unavailable: "This Emirate is not mapped yet.", unavailableBody: "REOS will not copy Dubai or Abu Dhabi rules into an unmapped Emirate. Choose Dubai or Abu Dhabi to explore a sourced route.",
    mapEyebrow: "03 · Your guided operating path", mapTitle: "Follow the illuminated route.", mapIntro: "Select any platform to see who controls it, what you need and what unlocks the next move.", selected: "Your route", firstMove: "Start here", sequence: "Next", parallel: "Run in parallel", conditional: "Check this condition",
    step: "Step", authority: "Who controls this step", need: "Bring these", output: "You leave with", fee: "Published fee signal", time: "Published service time", validity: "Validity / renewal", next: "Next move", official: "Official", conditionalEvidence: "Route-dependent", confirmLive: "Confirm live", officialLinks: "Open exact official service", sourceNote: "REOS explains the dependency. The authority controls the live application and decision.",
    lifecycle: "How this route connects to the seven-stage property lifecycle", lifecycleNote: "Optional context—not a second journey.", lead: "Lead", active: "Active", supporting: "Support", informed: "Aware",
    finishEyebrow: "04 · Ready-to-act check", finishTitle: "Four checks before you leave REOS.", finishIntro: "Confirm the route, authority, evidence and exact application—then continue to the official service.", verifyIdentity: "Correct person or company route", verifyAuthority: "Current authority and activity", verifyEvidence: "Complete, valid evidence", verifyAction: "Exact service and expected output", sources: "Source drawer", directory: "Verify a Dubai broker or office", noDirectory: "For Abu Dhabi, use the listed ADREC/DARI services to verify the route. REOS does not present an unconfirmed directory as a live registry.", disclaimer: "Educational roadmap. Confirm current eligibility, fees and authority decisions before acting.",
  },
  ar: {
    eyebrow: "02 · اختر مسارك", title: "أصبح وسيطاً—أو افتح شركة وساطة؟", intro: "هما مساران قانونيان مختلفان. اختر الإمارة ثم مساراً واحداً، وستوضح REOS الترتيب.",
    emirate: "أولاً · أين ستعمل؟", question: "ثم · ماذا تريد أن تفعل؟", individual: "أصبح وسيطاً", individualHint: "تأهل · انضم لشركة مرخصة · استلم بطاقتك", individualAction: "اعرض مسار الوسيط", agency: "افتح شركة وساطة", agencyHint: "أسس · رخص · سجل الأشخاص · شغّل", agencyAction: "اعرض مسار الشركة", shared: "يلتقي المساران عند القوائم المتوافقة والإعلانات المصرح بها والمعاملات المنضبطة.",
    mapped: "دبي + أبوظبي مخططتان", checked: "تم التحقق من المصادر الرسمية في 1 سبتمبر 2026", snapshot: "لقطة إرشادية · ليست تغذية حكومية حية", unavailable: "هذه الإمارة غير مخططة بعد.", unavailableBody: "لن تنقل REOS قواعد دبي أو أبوظبي إلى إمارة غير مخططة. اختر دبي أو أبوظبي لاستكشاف مسار موثق.",
    mapEyebrow: "03 · مسارك التشغيلي الموجه", mapTitle: "اتبع المسار المضيء.", mapIntro: "اختر أي منصة لمعرفة الجهة المسؤولة وما تحتاجه وما الذي يفتح الخطوة التالية.", selected: "مسارك", firstMove: "ابدأ هنا", sequence: "التالي", parallel: "نفذ بالتوازي", conditional: "تحقق من الشرط",
    step: "الخطوة", authority: "من يتحكم بهذه الخطوة", need: "أحضر هذه", output: "ستخرج بـ", fee: "مؤشر الرسوم المنشورة", time: "مدة الخدمة المنشورة", validity: "الصلاحية / التجديد", next: "الحركة التالية", official: "رسمي", conditionalEvidence: "حسب المسار", confirmLive: "تحقق مباشرة", officialLinks: "افتح الخدمة الرسمية المحددة", sourceNote: "تشرح REOS الاعتمادية. وتتحكم الجهة بالطلب والقرار الحاليين.",
    lifecycle: "كيف يرتبط هذا المسار بمراحل دورة العقار السبع", lifecycleNote: "سياق اختياري—وليس رحلة ثانية.", lead: "قيادة", active: "نشط", supporting: "دعم", informed: "اطلاع",
    finishEyebrow: "04 · فحص الجاهزية", finishTitle: "أربع مراجعات قبل مغادرة REOS.", finishIntro: "أكد المسار والجهة والأدلة والطلب المحدد، ثم انتقل إلى الخدمة الرسمية.", verifyIdentity: "مسار الشخص أو الشركة صحيح", verifyAuthority: "الجهة والنشاط حاليان", verifyEvidence: "الأدلة مكتملة وسارية", verifyAction: "الخدمة والمخرج المتوقع محددان", sources: "درج المصادر", directory: "تحقق من وسيط أو مكتب في دبي", noDirectory: "استخدم خدمات مركز أبوظبي العقاري/داري المدرجة للتحقق من المسار. لا تعرض REOS دليلاً غير مؤكد كسجل حي.", disclaimer: "خارطة تعليمية. أكد الأهلية والرسوم وقرارات الجهات الحالية قبل التصرف.",
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
  const [stepByRoute, setStepByRoute] = useState<Record<string, string>>({});
  const selectedStep = route?.steps.find((step) => step.id === stepByRoute[`${emirate}-${routeId}`]) ?? route?.steps[0];
  const routeSources = useMemo(() => {
    if (!route) return [];
    const ids = [...new Set(route.steps.flatMap((step) => step.sourceIds))];
    return ids.map((id) => brokerSourceById[id]).filter(Boolean);
  }, [route]);
  const T = (value: { en: string; ar: string }) => value[locale];
  const selectStep = (id: string) => setStepByRoute((current) => ({ ...current, [`${emirate}-${routeId}`]: id }));
  const chooseRoute = (id: BrokerJourneyRouteId) => {
    setRouteId(id);
    requestAnimationFrame(() => document.getElementById("broker-process")?.scrollIntoView({ behavior: "smooth", block: "start" }));
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

      <div className="broker-route-visual" aria-hidden="true">
        <div className="broker-visual-halo"/>
        <Image src="/images/brokers-agencies-operating-map-v1.png" alt="" width={1536} height={1024} priority sizes="(max-width: 900px) 100vw, 58vw"/>
        <span className="broker-map-signal broker-map-signal-one"/><span className="broker-map-signal broker-map-signal-two"/><span className="broker-map-signal broker-map-signal-three"/>
      </div>
    </div>

    <div className="broker-source-strip"><b>{c.mapped}</b><span>{c.checked}</span><span>{c.snapshot}</span></div>

    {!mapped || !route || !selectedStep ? <div className="broker-unmapped"><span className="broker-unmapped-mark" aria-hidden="true">?</span><div><h3>{c.unavailable}</h3><p>{c.unavailableBody}</p></div></div> : <>
      <section className="broker-path-section" id="broker-process">
        <header className="broker-path-heading"><div><span className="eyebrow">{c.mapEyebrow}</span><h3>{c.mapTitle}</h3></div><p>{c.mapIntro}</p></header>
        <div className="broker-route-summary"><span>{c.selected}</span><RouteIcon route={routeId}/><div><h4>{T(route.title)}</h4><p>{T(route.boundary)}</p></div><aside><small>{c.firstMove}</small><b>01 · {T(route.steps[0].title)}</b></aside></div>

        <div className="broker-step-rail broker-isometric-path" role="list" aria-label={T(route.title)}>
          <div className="broker-path-beam" aria-hidden="true"><i/></div>
          {route.steps.map((step) => <div key={step.id} className="broker-step-wrap" role="listitem"><button type="button" className={selectedStep.id === step.id ? "active" : ""} aria-current={selectedStep.id === step.id ? "step" : undefined} onClick={() => selectStep(step.id)}><span className="broker-step-number">{String(step.number).padStart(2, "0")}</span><span className="broker-step-status">{step.relation === "parallel" ? c.parallel : step.relation === "conditional" ? c.conditional : c.sequence}</span><b>{T(step.title)}</b><small>{T(step.authority).split(" · ")[0]}</small><i aria-hidden="true">↗</i></button></div>)}
        </div>

        <article className="broker-step-detail broker-step-workspace" id={selectedStep.id} aria-live="polite">
          <div className="broker-step-model" aria-hidden="true"><span>{String(selectedStep.number).padStart(2, "0")}</span><i/><i/><i/></div>
          <header><div><span>{c.step} {String(selectedStep.number).padStart(2, "0")} · {relationLabel}</span><EvidenceBadge status={selectedStep.evidence} copy={c}/></div><h4>{T(selectedStep.title)}</h4><p>{T(selectedStep.summary)}</p></header>
          <div className="broker-detail-grid broker-detail-primary">
            <section><span className="broker-detail-icon" aria-hidden="true">A</span><small>{c.authority}</small><b>{T(selectedStep.authority)}</b></section>
            <section><span className="broker-detail-icon" aria-hidden="true">✓</span><small>{c.need}</small><ul>{selectedStep.requirements.map((item) => <li key={item.en}>{T(item)}</li>)}</ul></section>
            <section><span className="broker-detail-icon" aria-hidden="true">↗</span><small>{c.output}</small><b>{T(selectedStep.output)}</b></section>
          </div>
          {(selectedStep.fee || selectedStep.time || selectedStep.validity) && <div className="broker-fact-ribbon">{selectedStep.fee && <div><small>{c.fee}</small><b>{T(selectedStep.fee)}</b></div>}{selectedStep.time && <div><small>{c.time}</small><b>{T(selectedStep.time)}</b></div>}{selectedStep.validity && <div><small>{c.validity}</small><b>{T(selectedStep.validity)}</b></div>}</div>}
          <div className="broker-detail-actions"><p>{c.sourceNote}</p><div>{selectedStep.sourceIds.map((sourceId) => { const source = brokerSourceById[sourceId]; return source ? <a key={sourceId} href={source.url} target="_blank" rel="noreferrer"><span>{source.authority}</span>{c.officialLinks} ↗</a> : null; })}</div></div>
          <nav className="broker-step-pagination" aria-label={c.next}><span>{String(selectedStep.number).padStart(2, "0")} / {String(route.steps.length).padStart(2, "0")}</span>{selectedStep.number < route.steps.length ? <button type="button" onClick={() => selectStep(route.steps[selectedStep.number].id)}>{c.next}: {T(route.steps[selectedStep.number].title)} <span>→</span></button> : <a href="#broker-verification">{c.next}: {c.finishEyebrow.replace("04 · ", "")} <span>↓</span></a>}</nav>
        </article>

        <details className="broker-lifecycle-crosswalk"><summary><span>{c.lifecycle}</span><small>{c.lifecycleNote}</small><i aria-hidden="true">+</i></summary><ol>{stages.map((stage, index) => { const state = participation[index]; const involved = route.steps.some((step) => step.stageIds.includes(stage.id)); const level = state?.relationshipLevel ?? "informed"; const levelLabel = level === "lead" ? c.lead : level === "active" ? c.active : level === "supporting" ? c.supporting : c.informed; return <li key={stage.id} className={involved ? `involved level-${level}` : ""}><span>{String(index + 1).padStart(2, "0")}</span><b>{stage.short}</b><small>{involved ? levelLabel : "—"}</small></li>; })}</ol></details>
      </section>

      <section className="broker-verification" id="broker-verification">
        <header><span className="eyebrow">{c.finishEyebrow}</span><h3>{c.finishTitle}</h3><p>{c.finishIntro}</p></header>
        <div className="broker-verify-grid"><ol>{[c.verifyIdentity, c.verifyAuthority, c.verifyEvidence, c.verifyAction].map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b><i aria-hidden="true">✓</i></li>)}</ol><details className="broker-source-drawer"><summary>{c.sources}<span>+</span></summary><div>{routeSources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer"><span>{source.authority}</span><b>{source.title}</b><small>{locale === "ar" ? "تم التحقق" : "Checked"} {source.checkedOn} ↗</small></a>)}</div>{emirate === "dubai" ? <a className="broker-directory-link" href={brokerSourceById["dld-directory"].url} target="_blank" rel="noreferrer">{c.directory} ↗</a> : <p className="broker-directory-note">{c.noDirectory}</p>}</details></div>
      </section>
    </>}
  </section>;
}

"use client";

import { useMemo, useState } from "react";
import { brokerJourneyRoutes, brokerSourceById, type BrokerJourneyEmirate, type BrokerJourneyRouteId } from "../data/brokerAgencyJourney";
import { EMIRATES, type EmirateId, type ParticipationState } from "../data/stakeholderBlueprints";
import type { Stage } from "../data/journey";
import type { Locale } from "../i18n/config";

type Props = {
  locale: Locale;
  initialEmirate: EmirateId;
  stages: Stage[];
  participation: ParticipationState[];
};

const COPY = {
  en: {
    eyebrow: "02 · Choose your brokerage route",
    title: "One decision first. Then one guided path.",
    intro: "Choose the Emirate and whether you want to qualify as a person or establish the company that employs and authorises practitioners.",
    emirate: "1 · Choose the Emirate",
    route: "2 · Choose what you want to become",
    individual: "Individual agent",
    agency: "Brokerage agency",
    mapped: "Official routes mapped for Dubai and Abu Dhabi",
    checked: "Sources checked 1 September 2026",
    snapshot: "Source-controlled guidance · not a live authority feed",
    unavailable: "This Emirate is not mapped yet.",
    unavailableBody: "REOS does not let an unmapped Emirate inherit Dubai or Abu Dhabi rules. Choose Dubai or Abu Dhabi to explore a validated route.",
    mapEyebrow: "03 · Connected operating map",
    mapTitle: "See the whole route. Open only the step you need.",
    mapIntro: "The arrows show default dependency order. Parallel or conditional work is labelled instead of being forced into a false sequence.",
    sequence: "Sequence",
    parallel: "Parallel control",
    conditional: "Conditional gate",
    selected: "Selected route",
    step: "Step",
    authority: "Authority / accountable party",
    need: "What you need",
    output: "Approval / output",
    fee: "Published fee signal",
    time: "Published service time",
    validity: "Validity / renewal",
    next: "Next",
    official: "Official service",
    conditionalEvidence: "Route-dependent",
    confirmLive: "Confirm live",
    sourceNote: "REOS explains the order and dependencies. The linked authority makes the decision and controls the current application.",
    lifecycle: "Seven-stage connection",
    lifecycleNote: "The protected REOS lifecycle remains visible as a compact crosswalk—not a second journey.",
    lead: "Lead",
    active: "Active",
    supporting: "Support",
    informed: "Aware",
    finishEyebrow: "04 · Verify before you act",
    finishTitle: "Leave REOS with the right evidence—not another search problem.",
    finishIntro: "Before applying or representing a client, confirm these four things for the selected route.",
    verifyIdentity: "Person or company route is correct",
    verifyAuthority: "Authority, activity and company association are current",
    verifyEvidence: "Required evidence is complete and still valid",
    verifyAction: "The exact official service and next output are known",
    sources: "Official sources for this route",
    directory: "Open the live Dubai broker registry",
    noDirectory: "Abu Dhabi’s current DARI directory page is not presented here as a guaranteed live public broker search. Use the listed ADREC/DARI services to verify the licence route.",
    disclaimer: "Educational route map. Confirm current eligibility, fees, documents and authority decisions before acting.",
  },
  ar: {
    eyebrow: "02 · اختر مسار الوساطة",
    title: "قرار واحد أولاً، ثم مسار واحد موجه.",
    intro: "اختر الإمارة وما إذا كنت تريد التأهل كشخص أو تأسيس الشركة التي توظف الممارسين وتخولهم.",
    emirate: "1 · اختر الإمارة",
    route: "2 · اختر ما تريد أن تصبحه",
    individual: "وسيط فردي",
    agency: "شركة وساطة",
    mapped: "مسارات رسمية مخططة لدبي وأبوظبي",
    checked: "تم التحقق من المصادر في 1 سبتمبر 2026",
    snapshot: "إرشاد مضبوط بالمصادر · ليس تغذية حية من الجهة",
    unavailable: "هذه الإمارة غير مخططة بعد.",
    unavailableBody: "لا تسمح REOS لإمارة غير مخططة بأن ترث قواعد دبي أو أبوظبي. اختر دبي أو أبوظبي لاستكشاف مسار تم التحقق منه.",
    mapEyebrow: "03 · خريطة تشغيل مترابطة",
    mapTitle: "شاهد المسار كاملاً، وافتح فقط الخطوة التي تحتاجها.",
    mapIntro: "توضح الأسهم ترتيب الاعتماد الافتراضي. ويُوسم العمل الموازي أو المشروط بدلاً من فرض تسلسل غير صحيح.",
    sequence: "تسلسل",
    parallel: "ضابط موازٍ",
    conditional: "بوابة مشروطة",
    selected: "المسار المختار",
    step: "الخطوة",
    authority: "الجهة / الطرف المسؤول",
    need: "ما تحتاجه",
    output: "الموافقة / المخرج",
    fee: "مؤشر الرسوم المنشورة",
    time: "مدة الخدمة المنشورة",
    validity: "الصلاحية / التجديد",
    next: "التالي",
    official: "خدمة رسمية",
    conditionalEvidence: "حسب المسار",
    confirmLive: "تحقق مباشرة",
    sourceNote: "تشرح REOS الترتيب والاعتماديات. وتتخذ الجهة المرتبطة القرار وتتحكم في الطلب الحالي.",
    lifecycle: "الارتباط بالمراحل السبع",
    lifecycleNote: "تظل دورة REOS المحمية ظاهرة كمرجع موجز، وليست رحلة ثانية.",
    lead: "قيادة",
    active: "نشط",
    supporting: "دعم",
    informed: "اطلاع",
    finishEyebrow: "04 · تحقق قبل أن تتصرف",
    finishTitle: "غادر REOS بالأدلة الصحيحة، لا بمشكلة بحث أخرى.",
    finishIntro: "قبل التقديم أو تمثيل عميل، أكد هذه الأمور الأربعة للمسار المختار.",
    verifyIdentity: "مسار الشخص أو الشركة صحيح",
    verifyAuthority: "الجهة والنشاط وارتباط الشركة سارية",
    verifyEvidence: "الأدلة المطلوبة مكتملة ولا تزال سارية",
    verifyAction: "الخدمة الرسمية المحددة والمخرج التالي معروفان",
    sources: "المصادر الرسمية لهذا المسار",
    directory: "افتح سجل وسطاء دبي الحي",
    noDirectory: "لا تُعرض صفحة دليل داري الحالية هنا كبحث عام حي مضمون للوسطاء. استخدم خدمات مركز أبوظبي العقاري/داري المدرجة للتحقق من مسار الرخصة.",
    disclaimer: "خريطة تعليمية للمسار. أكد الأهلية والرسوم والمستندات وقرارات الجهات الحالية قبل التصرف.",
  },
};

function RouteIcon({ route }: { route: BrokerJourneyRouteId }) {
  return route === "individual" ? <svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="21" r="10"/><path d="M15 54c1-13 7-20 17-20s16 7 17 20M44 18l7-5 5 5-7 5M48 14l2 2"/></svg> : <svg viewBox="0 0 64 64" aria-hidden="true"><path d="M10 56h44M15 56V20h34v36M12 20 32 8l20 12M23 30h7v8h-7zM36 30h7v8h-7zM27 56V44h10v12"/></svg>;
}

function EvidenceBadge({ status, copy }: { status: "official" | "conditional" | "confirm-live"; copy: { official: string; conditionalEvidence: string; confirmLive: string } }) {
  const label = status === "official" ? copy.official : status === "conditional" ? copy.conditionalEvidence : copy.confirmLive;
  return <span className={`broker-evidence broker-evidence-${status}`}><span aria-hidden="true" />{label}</span>;
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
  const otherRoute = mapped ? brokerJourneyRoutes[emirate as BrokerJourneyEmirate][routeId === "individual" ? "agency" : "individual"] : null;

  return <section className="broker-agency-journey" aria-labelledby="broker-journey-title">
    <header className="broker-journey-heading">
      <div><span className="eyebrow">{c.eyebrow}</span><h2 id="broker-journey-title">{c.title}</h2></div>
      <div><p>{c.intro}</p><small>{c.disclaimer}</small></div>
    </header>

    <div className="broker-route-builder">
      <label className="broker-emirate-control"><span>{c.emirate}</span><select value={emirate} onChange={(event) => setEmirate(event.target.value as EmirateId)}>{EMIRATES.map((item) => <option key={item.id} value={item.id}>{locale === "ar" ? item.ar : item.label}</option>)}</select></label>
      <fieldset className="broker-route-control"><legend>{c.route}</legend><div>
        {(["individual", "agency"] as const).map((id) => <button key={id} type="button" className={routeId === id ? "active" : ""} aria-pressed={routeId === id} onClick={() => setRouteId(id)}><span className="broker-route-icon"><RouteIcon route={id} /></span><b>{id === "individual" ? c.individual : c.agency}</b><small>{mapped ? brokerJourneyRoutes[emirate as BrokerJourneyEmirate][id].steps.length : "—"} {locale === "ar" ? "خطوات" : "steps"}</small></button>)}
      </div></fieldset>
      <div className="broker-route-object" aria-hidden="true"><span className="broker-orbit broker-orbit-a"/><span className="broker-orbit broker-orbit-b"/><span className="broker-object-core"><RouteIcon route={routeId}/></span><i/><i/><i/></div>
    </div>

    <div className="broker-source-strip"><b>{c.mapped}</b><span>{c.checked}</span><span>{c.snapshot}</span></div>

    {!mapped || !route || !selectedStep ? <div className="broker-unmapped"><span className="broker-unmapped-mark" aria-hidden="true">?</span><div><h3>{c.unavailable}</h3><p>{c.unavailableBody}</p></div></div> : <>
      <header className="broker-map-heading"><span className="eyebrow">{c.mapEyebrow}</span><h3>{c.mapTitle}</h3><p>{c.mapIntro}</p></header>

      <div className="broker-dual-lane" aria-label={locale === "ar" ? "مسارا الوسيط والشركة" : "Individual and agency routes"}>
        <button type="button" className={`broker-lane broker-lane-${routeId === "individual" ? "selected" : "context"}`} onClick={() => setRouteId("individual")} aria-pressed={routeId === "individual"}><span>01</span><RouteIcon route="individual"/><div><small>{c.individual}</small><b>{T(brokerJourneyRoutes[emirate as BrokerJourneyEmirate].individual.promise)}</b></div></button>
        <div className="broker-lane-bridge" aria-hidden="true"><span/><i/><span/></div>
        <button type="button" className={`broker-lane broker-lane-${routeId === "agency" ? "selected" : "context"}`} onClick={() => setRouteId("agency")} aria-pressed={routeId === "agency"}><span>02</span><RouteIcon route="agency"/><div><small>{c.agency}</small><b>{T(brokerJourneyRoutes[emirate as BrokerJourneyEmirate].agency.promise)}</b></div></button>
      </div>

      <div className="broker-selected-route"><div><span>{c.selected}</span><h4>{T(route.title)}</h4><p>{T(route.boundary)}</p></div><button type="button" onClick={() => setRouteId(otherRoute!.id)}>{locale === "ar" ? "قارن مع" : "Compare with"} {T(otherRoute!.shortTitle)} <span>↗</span></button></div>

      <div className="broker-process-map">
        <div className="broker-step-rail" role="list" aria-label={T(route.title)}>
          {route.steps.map((step, index) => <div key={step.id} className="broker-step-wrap" role="listitem">
            <button type="button" className={selectedStep.id === step.id ? "active" : ""} aria-current={selectedStep.id === step.id ? "step" : undefined} onClick={() => selectStep(step.id)}>
              <span>{String(step.number).padStart(2, "0")}</span><div><small>{step.relation === "parallel" ? c.parallel : step.relation === "conditional" ? c.conditional : c.sequence}</small><b>{T(step.title)}</b></div><i aria-hidden="true">→</i>
            </button>
            {index < route.steps.length - 1 && <span className={`broker-step-connector relation-${step.relation ?? "sequence"}`} aria-hidden="true"/>}
          </div>)}
        </div>

        <article className="broker-step-detail" id={selectedStep.id} aria-live="polite">
          <header><div><span>{c.step} {String(selectedStep.number).padStart(2, "0")}</span><EvidenceBadge status={selectedStep.evidence} copy={c}/></div><h4>{T(selectedStep.title)}</h4><p>{T(selectedStep.summary)}</p></header>
          <div className="broker-detail-grid">
            <section><span className="broker-detail-icon" aria-hidden="true">A</span><small>{c.authority}</small><b>{T(selectedStep.authority)}</b></section>
            <section><span className="broker-detail-icon" aria-hidden="true">✓</span><small>{c.need}</small><ul>{selectedStep.requirements.map((item) => <li key={item.en}>{T(item)}</li>)}</ul></section>
            <section><span className="broker-detail-icon" aria-hidden="true">↗</span><small>{c.output}</small><b>{T(selectedStep.output)}</b></section>
            {selectedStep.fee && <section><span className="broker-detail-icon" aria-hidden="true">AED</span><small>{c.fee}</small><b>{T(selectedStep.fee)}</b></section>}
            {selectedStep.time && <section><span className="broker-detail-icon" aria-hidden="true">◷</span><small>{c.time}</small><b>{T(selectedStep.time)}</b></section>}
            {selectedStep.validity && <section><span className="broker-detail-icon" aria-hidden="true">↻</span><small>{c.validity}</small><b>{T(selectedStep.validity)}</b></section>}
          </div>
          <div className="broker-detail-actions"><p>{c.sourceNote}</p><div>{selectedStep.sourceIds.map((sourceId) => { const source = brokerSourceById[sourceId]; return source ? <a key={sourceId} href={source.url} target="_blank" rel="noreferrer"><span>{source.authority}</span>{source.title} ↗</a> : null; })}</div></div>
          <nav className="broker-step-pagination" aria-label={c.next}><span>{String(selectedStep.number).padStart(2, "0")} / {String(route.steps.length).padStart(2, "0")}</span>{selectedStep.number < route.steps.length ? <button type="button" onClick={() => selectStep(route.steps[selectedStep.number].id)}>{c.next}: {T(route.steps[selectedStep.number].title)} <span>→</span></button> : <a href="#broker-verification">{c.next}: {c.finishEyebrow.replace("04 · ", "")} <span>↓</span></a>}</nav>
        </article>
      </div>

      <section className="broker-lifecycle-crosswalk" aria-label={c.lifecycle}><header><div><span>{c.lifecycle}</span><p>{c.lifecycleNote}</p></div></header><ol>{stages.map((stage, index) => { const state = participation[index]; const involved = route.steps.some((step) => step.stageIds.includes(stage.id)); const level = state?.relationshipLevel ?? "informed"; const levelLabel = level === "lead" ? c.lead : level === "active" ? c.active : level === "supporting" ? c.supporting : c.informed; return <li key={stage.id} className={involved ? `involved level-${level}` : ""}><span>{String(index + 1).padStart(2, "0")}</span><b>{stage.short}</b><small>{involved ? levelLabel : "—"}</small></li>; })}</ol></section>

      <section className="broker-verification" id="broker-verification">
        <header><span className="eyebrow">{c.finishEyebrow}</span><h3>{c.finishTitle}</h3><p>{c.finishIntro}</p></header>
        <div className="broker-verify-grid"><ol>{[c.verifyIdentity, c.verifyAuthority, c.verifyEvidence, c.verifyAction].map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><b>{item}</b><i aria-hidden="true">✓</i></li>)}</ol><div className="broker-source-drawer"><h4>{c.sources}</h4><div>{routeSources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer"><span>{source.authority}</span><b>{source.title}</b><small>{locale === "ar" ? "تم التحقق" : "Checked"} {source.checkedOn} ↗</small></a>)}</div>{emirate === "dubai" ? <a className="broker-directory-link" href={brokerSourceById["dld-directory"].url} target="_blank" rel="noreferrer">{c.directory} ↗</a> : <p className="broker-directory-note">{c.noDirectory}</p>}</div></div>
      </section>
    </>}
  </section>;
}

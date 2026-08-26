"use client";

import { useState } from "react";
import type { Locale } from "../i18n/config";

type FragmentMode = "visibility" | "sequence" | "dependency" | "knowledge";

const copy = {
  en: {
    actors: ["Developer", "Consultant", "Authority", "Contractor", "Bank", "Buyer / Owner"],
    stages: ["Land", "Design", "Approvals", "Build", "Sales", "Living", "Growth"],
    property: "One property journey",
    instruction: "Select a fracture to reveal its effect",
    issues: [
      { id: "visibility", number: "01", label: "No shared view", detail: "Each participant sees a different piece—not the whole journey." },
      { id: "sequence", number: "02", label: "Unclear next step", detail: "Handoffs move without a visible route or shared understanding." },
      { id: "dependency", number: "03", label: "Hidden dependencies", detail: "Work pauses when an unseen prerequisite is missed." },
      { id: "knowledge", number: "04", label: "Hard-to-find rules", detail: "People cannot easily locate the process or requirement governing their part." },
    ],
  },
  ar: {
    actors: ["المطوّر", "الاستشاري", "الجهة المختصة", "المقاول", "البنك", "المشتري / المالك"],
    stages: ["الأرض", "التصميم", "الموافقات", "البناء", "المبيعات", "السكن", "النمو"],
    property: "رحلة عقار واحدة",
    instruction: "اختر نقطة انقطاع لتكشف أثرها",
    issues: [
      { id: "visibility", number: "01", label: "لا توجد رؤية مشتركة", detail: "يرى كل طرف جزءاً مختلفاً، لا الرحلة كاملة." },
      { id: "sequence", number: "02", label: "الخطوة التالية غير واضحة", detail: "تنتقل المسؤولية من دون مسار ظاهر أو فهم مشترك." },
      { id: "dependency", number: "03", label: "ارتباطات خفية", detail: "يتوقف العمل عند إغفال متطلب سابق لم يكن ظاهراً." },
      { id: "knowledge", number: "04", label: "القواعد صعبة الوصول", detail: "يصعب على المشاركين معرفة الإجراء أو المتطلب الذي يحكم دورهم." },
    ],
  },
} as const;

function PersonIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="10" r="4.5" /><path d="M7.5 26c.8-6 3.6-9 8.5-9s7.7 3 8.5 9" /></svg>;
}

function IssueIcon({ mode }: { mode: FragmentMode }) {
  if (mode === "visibility") return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 16s5-8 13-8 13 8 13 8-5 8-13 8S3 16 3 16Z" /><circle cx="16" cy="16" r="3" /><path d="m5 27 22-22" /></svg>;
  if (mode === "sequence") return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="6" cy="16" r="3" /><circle cx="26" cy="16" r="3" /><path d="M9 16h5m4 0h5M14 12l4 4-4 4" /></svg>;
  if (mode === "dependency") return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="7" cy="23" r="3" /><circle cx="25" cy="23" r="3" /><circle cx="16" cy="7" r="3" /><path d="m9 20 5-10m4 0 5 10M10 23h12" /></svg>;
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 5h16a4 4 0 0 1 4 4v18H10a4 4 0 0 1-4-4V5Z" /><path d="M10 9h10M10 14h7M10 19h5" /><path d="M22 18c0-2 1-3 3-3s3 1 3 3c0 2-3 2-3 5m0 3v.5" /></svg>;
}

export function FragmentedJourney({ locale }: { locale: Locale }) {
  const [active, setActive] = useState<FragmentMode>("visibility");
  const content = copy[locale];
  const selected = content.issues.find((issue) => issue.id === active) ?? content.issues[0];

  return <div className={`fragmented-journey mode-${active}`}>
    <div
      className="fragmented-journey-canvas"
      id="fragmented-journey-visual"
      role="img"
      aria-label={`${content.property}. ${selected.detail}`}
    >
      <svg className="fragment-connection-field" viewBox="0 0 1200 560" preserveAspectRatio="none" aria-hidden="true">
        <path d="M90 100 C230 170 290 220 390 275" />
        <path d="M315 60 C360 155 420 205 495 275" />
        <path d="M885 60 C835 155 770 205 705 275" />
        <path d="M1110 100 C970 170 910 220 810 275" />
        <path d="M205 485 C315 420 390 355 510 300" />
        <path d="M995 485 C885 420 810 355 690 300" />
        <path className="fragment-dependency-arc" d="M300 320 C460 470 740 470 900 320" />
      </svg>

      <div className="fragment-property-core" aria-hidden="true">
        <i /><i /><i /><i />
        <span>{content.property}</span>
      </div>

      <div className="fragment-actors" aria-hidden="true">
        {content.actors.map((actor, index) => <div className={`fragment-actor actor-${index + 1}`} key={actor}>
          <PersonIcon />
          <span>{actor}</span>
          <i className="fragment-view"><b /><b /><b /></i>
        </div>)}
      </div>

      <ol className="fragment-route" aria-hidden="true">
        {content.stages.map((stage, index) => <li key={stage}>
          <i>{String(index + 1).padStart(2, "0")}</i>
          <span>{stage}</span>
          {index < content.stages.length - 1 ? <b /> : null}
        </li>)}
      </ol>

      <div className="fragment-knowledge-fog" aria-hidden="true"><span>?</span><span>?</span><span>?</span></div>
      <div className="fragment-delay-pulse" aria-hidden="true"><span>!</span></div>
    </div>

    <div className="fragment-mode-controls" role="group" aria-label={content.instruction}>
      {content.issues.map((issue) => <button
        type="button"
        key={issue.id}
        className={active === issue.id ? "is-active" : ""}
        aria-pressed={active === issue.id}
        aria-controls="fragmented-journey-visual"
        onClick={() => setActive(issue.id)}
        onPointerEnter={() => setActive(issue.id)}
        onFocus={() => setActive(issue.id)}
      >
        <span>{issue.number}</span>
        <IssueIcon mode={issue.id} />
        <b>{issue.label}</b>
      </button>)}
    </div>

    <div className="fragment-mode-readout" aria-live="polite">
      <span>{selected.number}</span>
      <p>{selected.detail}</p>
    </div>
  </div>;
}

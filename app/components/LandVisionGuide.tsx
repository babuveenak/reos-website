"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { landVisionGuideReviewedOn, landVisionGuideSteps } from "../data/landVisionGuide";
import type { Locale } from "../i18n/config";

type Props = {
  locale: Locale;
  salesTransferHref: string;
};

const ui = {
  en: {
    eyebrow: "HOW THIS STAGE WORKS",
    title: "From land opportunity to an evidence-backed decision.",
    intro: "Use this route to understand the normal work, evidence and decision gates. Start with jurisdiction: the applicable authority, eligibility and process depend on the exact location and parties.",
    stageQuestion: "Stage question",
    stageQuestionValue: "Is this the right opportunity to pursue?",
    stageOutput: "Stage output",
    stageOutputValue: "A controlled opportunity baseline ready for Planning & Design.",
    guidanceState: "Guidance state",
    guidanceStateValue: `Educational · sources reviewed ${landVisionGuideReviewedOn}`,
    entryTitle: "Choose the entry point by what is being acquired",
    stageOne: "STARTS AT STAGE 1",
    stageOneTitle: "Land or a development opportunity",
    stageOneCopy: "Developers, development investors, landowners and any person or company acquiring land begin here.",
    stageFive: "STARTS AT STAGE 5",
    stageFiveTitle: "Apartment, villa or townhouse",
    stageFiveCopy: "An end customer or unit investor buying off-plan or completed property enters through Sales & Transfer.",
    concurrency: "For off-plan sales, the buyer enters at Stage 5 while the property may still be in Planning, Approvals or Construction.",
    openStageFive: "Open Sales & Transfer",
    chooseStep: "Choose a Land & Vision step",
    stepLabel: "Step",
    of: "of",
    objective: "Objective",
    normallyActs: "Who normally acts",
    check: "What to check",
    inputs: "Typical inputs",
    output: "Expected output",
    redFlags: "Red flags",
    sources: "Official sources to verify",
    noSource: "This is an internal decision step. Validate any legal, financial or regulated aspect with the relevant qualified adviser.",
    nextSafeAction: "Next safe action",
    previous: "Previous step",
    next: "Next step",
    boundary: "REOS explains the route; official authorities and authorized decision-makers retain registration, approval and legal authority.",
  },
  ar: {
    eyebrow: "كيف تعمل هذه المرحلة",
    title: "من فرصة الأرض إلى قرار مدعوم بالأدلة.",
    intro: "استخدم هذا المسار لفهم العمل والأدلة وبوابات القرار المعتادة. ابدأ بالاختصاص، فالجهة المختصة والأهلية والإجراءات تعتمد على الموقع والأطراف.",
    stageQuestion: "سؤال المرحلة",
    stageQuestionValue: "هل هذه هي الفرصة المناسبة للمتابعة؟",
    stageOutput: "مخرج المرحلة",
    stageOutputValue: "خط أساس مضبوط للفرصة وجاهز للتخطيط والتصميم.",
    guidanceState: "حالة الإرشاد",
    guidanceStateValue: `تعليمي · روجعت المصادر في ${landVisionGuideReviewedOn}`,
    entryTitle: "اختر نقطة الدخول وفق ما يتم شراؤه",
    stageOne: "يبدأ في المرحلة 1",
    stageOneTitle: "أرض أو فرصة تطوير",
    stageOneCopy: "يبدأ هنا المطورون ومستثمرو التطوير وملاك الأراضي وأي شخص أو شركة تشتري أرضًا.",
    stageFive: "يبدأ في المرحلة 5",
    stageFiveTitle: "شقة أو فيلا أو تاون هاوس",
    stageFiveCopy: "يدخل العميل النهائي أو مستثمر الوحدة الذي يشتري عقارًا على المخطط أو مكتملًا عبر البيع والنقل.",
    concurrency: "في البيع على المخطط يدخل المشتري في المرحلة 5 بينما قد يكون العقار في التخطيط أو الموافقات أو الإنشاء.",
    openStageFive: "افتح البيع والنقل",
    chooseStep: "اختر خطوة الأرض والرؤية",
    stepLabel: "الخطوة",
    of: "من",
    objective: "الهدف",
    normallyActs: "من يعمل عادةً",
    check: "ما الذي يجب التحقق منه",
    inputs: "المدخلات المعتادة",
    output: "المخرج المتوقع",
    redFlags: "إشارات الخطر",
    sources: "مصادر رسمية للتحقق",
    noSource: "هذه خطوة قرار داخلي. تحقّق من أي جانب قانوني أو مالي أو منظّم مع المستشار المؤهل ذي الصلة.",
    nextSafeAction: "الإجراء الآمن التالي",
    previous: "الخطوة السابقة",
    next: "الخطوة التالية",
    boundary: "تشرح REOS المسار؛ وتبقى سلطة التسجيل والموافقة والقرار القانوني لدى الجهات الرسمية وأصحاب الصلاحية.",
  },
} as const;

function validStepId(value?: string) {
  return landVisionGuideSteps.some((step) => step.id === value) ? value! : landVisionGuideSteps[0].id;
}

export function LandVisionGuide({ locale, salesTransferHref }: Props) {
  const labels = ui[locale];
  const [activeId, setActiveId] = useState(() => landVisionGuideSteps[0].id);
  const stepButtons = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = Math.max(0, landVisionGuideSteps.findIndex((step) => step.id === activeId));
  const activeStep = landVisionGuideSteps[activeIndex];

  useEffect(() => {
    const syncFromUrl = () => {
      const requested = new URL(window.location.href).searchParams.get("step") ?? undefined;
      setActiveId(validStepId(requested));
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const selectStep = (id: string, updateUrl = true) => {
    setActiveId(id);
    if (!updateUrl) return;
    const url = new URL(window.location.href);
    url.searchParams.set("step", id);
    window.history.replaceState({}, "", url);
  };

  const focusStep = (index: number) => {
    const bounded = (index + landVisionGuideSteps.length) % landVisionGuideSteps.length;
    const id = landVisionGuideSteps[bounded].id;
    selectStep(id);
    stepButtons.current[bounded]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      focusStep(index + 1);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      focusStep(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusStep(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusStep(landVisionGuideSteps.length - 1);
    }
  };

  return (
    <section className="section-pad land-guide" aria-labelledby="land-guide-title">
      <header className="land-guide-intro">
        <span className="eyebrow">{labels.eyebrow}</span>
        <h2 id="land-guide-title">{labels.title}</h2>
        <p>{labels.intro}</p>
      </header>

      <dl className="land-guide-summary">
        <div><dt>{labels.stageQuestion}</dt><dd>{labels.stageQuestionValue}</dd></div>
        <div><dt>{labels.stageOutput}</dt><dd>{labels.stageOutputValue}</dd></div>
        <div><dt>{labels.guidanceState}</dt><dd>{labels.guidanceStateValue}</dd></div>
      </dl>

      <section className="land-entry-map" aria-labelledby="land-entry-title">
        <h3 id="land-entry-title">{labels.entryTitle}</h3>
        <div>
          <article className="is-current-stage">
            <span>{labels.stageOne}</span>
            <h4>{labels.stageOneTitle}</h4>
            <p>{labels.stageOneCopy}</p>
          </article>
          <i aria-hidden="true">≠</i>
          <article>
            <span>{labels.stageFive}</span>
            <h4>{labels.stageFiveTitle}</h4>
            <p>{labels.stageFiveCopy}</p>
            <Link href={salesTransferHref}>{labels.openStageFive} <b aria-hidden="true">→</b></Link>
          </article>
        </div>
        <p className="land-entry-concurrency"><b>{labels.concurrency}</b></p>
      </section>

      <label className="land-guide-select">
        <span>{labels.chooseStep}</span>
        <select value={activeId} onChange={(event) => selectStep(event.target.value)}>
          {landVisionGuideSteps.map((step, index) => (
            <option key={step.id} value={step.id}>{String(index + 1).padStart(2, "0")} · {step.shortTitle}</option>
          ))}
        </select>
      </label>

      <div className="land-guide-explorer">
        <div className="land-guide-rail" role="tablist" aria-label={labels.chooseStep} aria-orientation="vertical">
          {landVisionGuideSteps.map((step, index) => {
            const selected = step.id === activeId;
            return (
              <button
                key={step.id}
                ref={(element) => { stepButtons.current[index] = element; }}
                type="button"
                role="tab"
                id={`land-guide-tab-${step.id}`}
                aria-selected={selected}
                aria-controls="land-guide-panel"
                tabIndex={selected ? 0 : -1}
                className={selected ? "is-active" : ""}
                data-guide-step={step.id}
                onClick={() => selectStep(step.id)}
                onKeyDown={(event) => handleKeyDown(event, index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{step.shortTitle}</b>
                <i aria-hidden="true" />
              </button>
            );
          })}
        </div>

        <article
          className="land-guide-panel"
          id="land-guide-panel"
          role="tabpanel"
          aria-labelledby={`land-guide-tab-${activeStep.id}`}
          aria-live="polite"
          tabIndex={0}
          data-guide-current={activeStep.id}
        >
          <header>
            <div>
              <small>{labels.stepLabel} {String(activeIndex + 1).padStart(2, "0")} {labels.of} {landVisionGuideSteps.length}</small>
              <h3>{activeStep.title}</h3>
            </div>
            <span aria-label={`${activeIndex + 1} ${labels.of} ${landVisionGuideSteps.length}`}>{activeIndex + 1}/{landVisionGuideSteps.length}</span>
          </header>

          <div className="land-guide-objective">
            <small>{labels.objective}</small>
            <p>{activeStep.objective}</p>
          </div>

          <div className="land-guide-detail-grid">
            <section>
              <h4>{labels.normallyActs}</h4>
              <p>{activeStep.actors.join(" · ")}</p>
            </section>
            <section>
              <h4>{labels.inputs}</h4>
              <ul>{activeStep.inputs.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
            <section className="is-wide">
              <h4>{labels.check}</h4>
              <ol>{activeStep.checks.map((item) => <li key={item}>{item}</li>)}</ol>
            </section>
            <section className="is-output">
              <h4>{labels.output}</h4>
              <p>{activeStep.output}</p>
            </section>
            <section className="is-risk">
              <h4>{labels.redFlags}</h4>
              <ul>{activeStep.redFlags.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          </div>

          <section className="land-guide-sources">
            <h4>{labels.sources}</h4>
            {activeStep.sources.length > 0 ? (
              <ul>{activeStep.sources.map((source) => (
                <li key={source.href}>
                  <a href={source.href} target="_blank" rel="noreferrer">
                    <span>{source.jurisdiction}</span><b>{source.label}</b><i aria-hidden="true">↗</i>
                  </a>
                </li>
              ))}</ul>
            ) : <p>{labels.noSource}</p>}
          </section>

          <div className="land-guide-action">
            <div><small>{labels.nextSafeAction}</small><p>{activeStep.nextAction}</p></div>
            <nav aria-label="Land and Vision step navigation">
              <button type="button" onClick={() => activeIndex > 0 && selectStep(landVisionGuideSteps[activeIndex - 1].id)} disabled={activeIndex === 0}>{labels.previous}</button>
              <button type="button" onClick={() => activeIndex < landVisionGuideSteps.length - 1 && selectStep(landVisionGuideSteps[activeIndex + 1].id)} disabled={activeIndex === landVisionGuideSteps.length - 1}>{labels.next}</button>
            </nav>
          </div>
        </article>
      </div>

      <p className="land-guide-boundary">{labels.boundary}</p>
    </section>
  );
}

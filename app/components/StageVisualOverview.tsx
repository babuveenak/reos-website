import Link from "next/link";
import type { Stage } from "../data/journey";
import { localePath, type Locale } from "../i18n/config";
import { withTerms } from "./Term";

type Participant = {
  id: string;
  name: string;
  short: string;
};

type Props = {
  allStages: Stage[];
  locale: Locale;
  participants: Participant[];
  stage: Stage;
};

const ui = {
  en: {
    route: "YOUR POSITION IN THE PROPERTY JOURNEY",
    routeSummary: (number: number, total: number) => `Stage ${number} of ${total}`,
    current: "Current stage",
    entry: "WHO USUALLY ENTERS HERE",
    entryDefault: "People and organisations whose current decision, responsibility or evidence sits in this stage.",
    entryLand: "Developers, development investors, landowners and anyone acquiring land or a development opportunity usually begin here.",
    entrySales: "An end customer or unit investor buying an apartment, villa or townhouse—off-plan or completed—usually enters at this stage.",
    process: "HOW THIS STAGE MOVES",
    processTitle: "Four connected moves.",
    processIntro: "Open each move for the full explanation. The route is a guide to normal work—not a substitute for the applicable authority process.",
    openStep: "Open step",
    people: "PEOPLE + EVIDENCE",
    peopleTitle: "Who acts, and what travels with the work.",
    participants: "Participants",
    documents: "Typical documents",
    guardrails: "RISKS + BOUNDARIES",
    guardrailsTitle: "Know what can stop the stage.",
    commonFailure: "Common failure",
    jurisdiction: "Jurisdiction changes the answer",
    nextAction: "Practical next action",
    boundary: "REOS explains the educational route. Official authorities and authorized decision-makers retain registration, approval and legal authority.",
  },
  ar: {
    route: "موقعك في رحلة العقار",
    routeSummary: (number: number, total: number) => `المرحلة ${number} من ${total}`,
    current: "المرحلة الحالية",
    entry: "من يدخل هنا عادةً",
    entryDefault: "الأشخاص والجهات التي يقع قرارها أو مسؤوليتها أو أدلتها الحالية ضمن هذه المرحلة.",
    entryLand: "يبدأ هنا عادةً المطورون ومستثمرو التطوير وملاك الأراضي وكل من يشتري أرضًا أو فرصة تطوير.",
    entrySales: "يدخل العميل النهائي أو مستثمر الوحدة الذي يشتري شقة أو فيلا أو تاون هاوس — على المخطط أو مكتملًا — عادةً في هذه المرحلة.",
    process: "كيف تتحرك هذه المرحلة",
    processTitle: "أربع حركات مترابطة.",
    processIntro: "افتح كل حركة لقراءة الشرح الكامل. هذا المسار دليل للعمل المعتاد وليس بديلًا عن إجراءات الجهة المختصة.",
    openStep: "افتح الخطوة",
    people: "الأشخاص والأدلة",
    peopleTitle: "من يعمل، وما الذي ينتقل مع العمل.",
    participants: "المشاركون",
    documents: "المستندات المعتادة",
    guardrails: "المخاطر والحدود",
    guardrailsTitle: "اعرف ما الذي قد يوقف المرحلة.",
    commonFailure: "إخفاق شائع",
    jurisdiction: "الاختصاص يغيّر الإجابة",
    nextAction: "الخطوة العملية التالية",
    boundary: "تشرح REOS المسار التعليمي. وتبقى سلطة التسجيل والموافقة والقرار القانوني لدى الجهات الرسمية وأصحاب الصلاحية.",
  },
} as const;

function shortStep(value: string) {
  const firstClause = value.split(/—|:|;/, 1)[0].split(",", 1)[0].trim();
  if (firstClause.length <= 62) return firstClause;
  const words = firstClause.split(" ");
  return `${words.slice(0, 9).join(" ")}…`;
}

export function StageVisualOverview({ allStages, locale, participants, stage }: Props) {
  const labels = ui[locale];
  const entryCopy = stage.id === "land-vision"
    ? labels.entryLand
    : stage.id === "sales-transfer"
      ? labels.entrySales
      : labels.entryDefault;

  return <>
    <section className="stage-route-overview" aria-labelledby="stage-route-title">
      <header>
        <div>
          <span className="eyebrow" id="stage-route-title">{labels.route}</span>
          <p>{labels.routeSummary(stage.number, allStages.length)}</p>
        </div>
        <aside>
          <small>{labels.entry}</small>
          <p>{entryCopy}</p>
        </aside>
      </header>
      <ol>
        {allStages.map((item) => (
          <li key={item.id} className={item.id === stage.id ? "is-current" : undefined}>
            <Link
              href={localePath(locale, `/property-journey/${item.id}`)}
              aria-current={item.id === stage.id ? "step" : undefined}
            >
              <span>{String(item.number).padStart(2, "0")}</span>
              <b>{item.short}</b>
              {item.id === stage.id ? <small>{labels.current}</small> : null}
            </Link>
          </li>
        ))}
      </ol>
    </section>

    <section className="section-pad stage-visual-process" aria-labelledby="stage-process-title">
      <header>
        <span className="eyebrow">{labels.process}</span>
        <h2 id="stage-process-title">{labels.processTitle}</h2>
        <p>{labels.processIntro}</p>
      </header>
      <div className="stage-process-flow">
        {stage.whatHappens.map((item, index) => (
          <details key={item} open={index === 0}>
            <summary aria-label={`${labels.openStep} ${index + 1}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <b>{shortStep(item)}</b>
              <i aria-hidden="true">+</i>
            </summary>
            <p>{withTerms(item)}</p>
          </details>
        ))}
      </div>
    </section>

    <section className="section-pad stage-evidence-map" aria-labelledby="stage-evidence-title">
      <header>
        <span className="eyebrow">{labels.people}</span>
        <h2 id="stage-evidence-title">{labels.peopleTitle}</h2>
      </header>
      <div className="stage-evidence-grid">
        <article>
          <small>{labels.participants}</small>
          <div className="stage-participant-map">
            {participants.map((participant, index) => (
              <Link href={localePath(locale, `/stakeholders/${participant.id}`)} key={participant.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{participant.short}</b>
              </Link>
            ))}
          </div>
        </article>
        <article>
          <small>{labels.documents}</small>
          <ol className="stage-document-map">
            {stage.documents.map((document, index) => (
              <li key={document}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <b>{document}</b>
              </li>
            ))}
          </ol>
        </article>
      </div>
    </section>

    <section className="section-pad stage-guardrail-map" aria-labelledby="stage-guardrail-title">
      <header>
        <span className="eyebrow">{labels.guardrails}</span>
        <h2 id="stage-guardrail-title">{labels.guardrailsTitle}</h2>
      </header>
      <div className="stage-guardrail-grid">
        <ol>
          {stage.risks.map((risk, index) => (
            <li key={risk}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><small>{labels.commonFailure}</small><p>{risk}</p></div>
            </li>
          ))}
        </ol>
        <aside>
          <section>
            <small>{labels.jurisdiction}</small>
            <p>{withTerms(stage.jurisdiction)}</p>
          </section>
          <section>
            <small>{labels.nextAction}</small>
            <p>{stage.nextStep}</p>
          </section>
          <footer>{labels.boundary}</footer>
        </aside>
      </div>
    </section>
  </>;
}

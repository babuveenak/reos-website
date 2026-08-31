import { officialSourceById } from "../data/officialSources";
import { stakeholderGuidance } from "../data/stakeholderGuidance";
import type { StakeholderId } from "../data/stakeholderParticipation";
import type { Locale } from "../i18n/config";

const ICONS = {
  route: <><path d="M4 18 10 6l4 6 6-8" /><circle cx="4" cy="18" r="2" /><circle cx="10" cy="6" r="2" /><circle cx="14" cy="12" r="2" /><circle cx="20" cy="4" r="2" /></>,
  challenge: <><path d="M12 3 3 20h18L12 3Z" /><path d="M12 9v5m0 3v.1" /></>,
  directory: <><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5M7 8h6M7 11h4" /></>,
};

function GuidanceIcon({ kind }: { kind: keyof typeof ICONS }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true">{ICONS[kind]}</svg>;
}

function SourceChips({ sourceId, locale }: { sourceId?: string; locale: Locale }) {
  if (!sourceId) return <div className="guidance-fact-chips"><span>{locale === "ar" ? "قرار الدور" : "Role decision"}</span><span>{locale === "ar" ? "بحسب المشروع" : "Project-specific"}</span></div>;
  const source = officialSourceById[sourceId];
  if (!source) return null;
  return <div className="guidance-fact-chips">
    <span>{source.authority}</span>
    <span>{source.duration}</span>
    <span>{source.fee}</span>
    <a href={source.url} target="_blank" rel="noreferrer">{locale === "ar" ? "المصدر الرسمي ↗" : "Official source ↗"}</a>
  </div>;
}

export function StakeholderGuidanceSections({ stakeholderId, stakeholderName, locale }: { stakeholderId: StakeholderId; stakeholderName: string; locale: Locale }) {
  const guidance = stakeholderGuidance[stakeholderId];
  const ar = locale === "ar";

  return <>
    <section className="stakeholder-entry-guidance" aria-labelledby="stakeholder-entry-title">
      <header className="guidance-section-heading">
        <div>
          <span className="eyebrow">05 · {ar ? "دخول الدور" : "Entering this role"}</span>
          <h2 id="stakeholder-entry-title">{guidance.entryTitle}</h2>
        </div>
        <p>{guidance.entryNote}</p>
      </header>

      <div className={`stakeholder-entry-paths paths-${guidance.paths.length}`}>
        {guidance.paths.map((path) => <article key={path.title} className="stakeholder-entry-path">
          <header><GuidanceIcon kind="route" /><div><small>{path.label}</small><h3>{path.title}</h3><p>{path.note}</p></div></header>
          <ol>
            {path.steps.map((step, index) => <li key={step.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h4>{step.title}</h4><p>{step.description}</p><SourceChips sourceId={step.sourceId} locale={locale} /></div>
            </li>)}
          </ol>
        </article>)}
      </div>
      <p className="guidance-evidence-note">{ar
        ? "أزمنة الخدمة تبدأ بعد اكتمال الطلب وقبوله. وهي ليست وعداً بالمدة الكلية للتأهيل أو الترخيص أو المعاملة."
        : "Authority service times start after a complete accepted submission. They are not promises for the total qualification, licensing or transaction journey."}</p>
    </section>

    <section className="stakeholder-challenges" aria-labelledby="stakeholder-challenges-title">
      <header className="guidance-section-heading">
        <div>
          <span className="eyebrow">06 · {ar ? "نقاط التحكم العملية" : "Practical control points"}</span>
          <h2 id="stakeholder-challenges-title">{ar ? "تحديات شائعة وكيفية التعامل معها." : "Common challenges—and how to handle them."}</h2>
        </div>
        <p>{ar ? `إشارات عملية خاصة بدور ${stakeholderName}، وليست بديلاً عن نصيحة مهنية أو قرار رسمي.` : `Practical signals for the ${stakeholderName} role—not a substitute for professional advice or an official decision.`}</p>
      </header>
      <div className="stakeholder-challenge-grid">
        {guidance.challenges.map((item, index) => {
          const source = item.sourceId ? officialSourceById[item.sourceId] : undefined;
          return <article key={item.title} className="stakeholder-challenge-card">
            <div><span>{String(index + 1).padStart(2, "0")}</span><GuidanceIcon kind="challenge" /></div>
            <h3>{item.title}</h3>
            <p><b>{ar ? "لماذا يحدث" : "Why it happens"}</b>{item.why}</p>
            <p><b>{ar ? "كيفية التعامل" : "How to handle it"}</b>{item.response}</p>
            {source ? <a href={source.url} target="_blank" rel="noreferrer">{source.authority} · {source.title} ↗</a> : <small>{ar ? "تحكم المشروع أو المؤسسة" : "Project or organisational control"}</small>}
          </article>;
        })}
      </div>
    </section>

    {guidance.directory ? <section className="stakeholder-official-directory" aria-labelledby="stakeholder-directory-title">
      <div className="official-directory-object" aria-hidden="true"><GuidanceIcon kind="directory" /><i /><i /><i /></div>
      <div>
        <span className="eyebrow">07 · {ar ? "السجل الرسمي" : "Official registry"}</span>
        <h2 id="stakeholder-directory-title">{guidance.directory.title}</h2>
        <p>{guidance.directory.description}</p>
        <div className="official-directory-filters" aria-label={ar ? "خيارات البحث المتاحة في السجل الرسمي" : "Search options available in the official registry"}>
          {guidance.directory.filters.map((filter) => <span key={filter}>{filter}</span>)}
        </div>
        <a className="text-link" href={officialSourceById[guidance.directory.sourceId].url} target="_blank" rel="noreferrer">{ar ? "افتح سجل دائرة الأراضي والأملاك ↗" : "Open the DLD licensed-broker registry ↗"}</a>
      </div>
    </section> : null}
  </>;
}

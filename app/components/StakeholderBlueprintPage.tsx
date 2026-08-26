import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page } from "./SiteShell";
import { StakeholderJurisdictionSelector } from "./StakeholderJurisdictionSelector";
import { getGroups, getStages } from "../i18n/content";
import { localePath, type Locale } from "../i18n/config";
import { groupById } from "../data/ecosystem";
import { stageById } from "../data/journey";
import { DUBAI_TRACKS, EMIRATES, blueprintEvidenceStatus, evidenceLabel, ownershipEligibilityFact, stakeholderBlueprintById, type BlueprintStep, type DubaiTrack, type EmirateId, type EvidenceStatus, type Provenance, type SourcedFact } from "../data/stakeholderBlueprints";

const COPY = {
  en: {
    back: "Back to all stakeholders", stakeholder: "Stakeholder", scope: "Jurisdiction scope", where: "Where you start", participation: "Lifecycle participation", participationTitle: "Your role across all seven stages.", blueprint: "Sequenced blueprint", blueprintTitle: "Follow the official route, step by step.", blueprintCopy: "Open a step to see who acts, what triggers it, the authority channel, evidence, costs, service estimates, risks and what it unlocks.", mapped: "Dubai reference blueprint", overview: "Structured overview", unmapped: "Not yet mapped", checked: "Checked 26 August 2026", official: "Official source", reos: "REOS explanation", actor: "Actor", trigger: "Trigger", authority: "Authority", portal: "Portal / channel", happens: "What happens", documents: "Documents in", outputs: "Outputs", fees: "Fees", duration: "Authority service estimate", risks: "Failure modes", unlocks: "What this unlocks", applies: "Applies to", evidence: "Evidence", eligibility: "Eligibility", officialChannels: "Authorities and official channels", documentRegister: "Document register", feeRegister: "Fees and service estimates", derived: "Derived lifecycle summary", responsibilities: "Responsibilities", dependencies: "Dependencies", challenges: "Challenges", sources: "Primary references", handoff: "Next controlled handoff", noDubai: "Dubai facts are not shown in this jurisdiction view.", missing: "What is still missing", mappedNotice: "This page provides a source-led Dubai reference for Landowners & Investors. It does not replace DLD, another authority, a trustee, lender, legal adviser or official system.", overviewNotice: "The lifecycle structure is published, but transaction-level authority research for this stakeholder is not yet complete.", translation: "Regulatory evidence below remains in source-language English pending human-reviewed Arabic publication.", ecosystem: "Open this stakeholder in the ecosystem map", all: "View all stakeholder groups", stage: "Stage", notDirect: "Not directly mapped", conditional: "Participation mapping — verify for the project", lead: "Lead", participant: "Participant", notInvolved: "Not involved",
  },
  ar: {
    back: "العودة إلى جميع أصحاب المصلحة", stakeholder: "صاحب المصلحة", scope: "نطاق الاختصاص", where: "نقطة البداية", participation: "المشاركة عبر دورة الحياة", participationTitle: "دورك عبر المراحل السبع.", blueprint: "المخطط المتسلسل", blueprintTitle: "اتبع المسار الرسمي خطوة بخطوة.", blueprintCopy: "افتح كل خطوة لمعرفة الجهة الفاعلة ونقطة البدء والقناة الرسمية والأدلة والتكاليف والتقديرات والمخاطر وما الذي تتيحه.", mapped: "مخطط دبي المرجعي", overview: "نظرة عامة منظمة", unmapped: "لم يتم التخطيط بعد", checked: "تمت المراجعة في 26 أغسطس 2026", official: "مصدر رسمي", reos: "شرح REOS", actor: "الجهة الفاعلة", trigger: "نقطة البدء", authority: "الجهة الرسمية", portal: "البوابة / القناة", happens: "ما الذي يحدث", documents: "المستندات الداخلة", outputs: "المخرجات", fees: "الرسوم", duration: "تقدير مدة الخدمة الرسمية", risks: "مواطن التعطل", unlocks: "ما الذي تتيحه الخطوة", applies: "ينطبق على", evidence: "الأدلة", eligibility: "الأهلية", officialChannels: "الجهات والقنوات الرسمية", documentRegister: "سجل المستندات", feeRegister: "الرسوم وتقديرات الخدمة", derived: "ملخص دورة الحياة المستنتج", responsibilities: "المسؤوليات", dependencies: "الاعتماديات", challenges: "التحديات", sources: "المراجع الأساسية", handoff: "التسليم المنضبط التالي", noDubai: "لا يتم عرض حقائق دبي في هذا النطاق.", missing: "ما الذي لا يزال مفقوداً", mappedNotice: "تقدم هذه الصفحة مرجعاً لدبي قائماً على المصادر لملاك الأراضي والمستثمرين. وهي لا تحل محل دائرة الأراضي والأملاك أو أي جهة رسمية أو أمين تسجيل أو ممول أو مستشار قانوني أو نظام رسمي.", overviewNotice: "تم نشر هيكل دورة الحياة، لكن بحث الجهات الرسمية على مستوى المعاملة لهذا الطرف لم يكتمل بعد.", translation: "تظل الأدلة التنظيمية أدناه باللغة الإنجليزية، لغة المصدر، إلى حين نشر ترجمة عربية خضعت للمراجعة البشرية.", ecosystem: "افتح صاحب المصلحة في خريطة المنظومة", all: "عرض جميع أصحاب المصلحة", stage: "المرحلة", notDirect: "غير مرتبط مباشرة", conditional: "خريطة مشاركة — تحقق حسب المشروع", lead: "قيادة", participant: "مشارك", notInvolved: "غير مشارك",
  },
};

function EvidenceBadge({ status, locale }: { status: EvidenceStatus; locale: Locale }) {
  const labels = locale === "ar" ? { verified: "مصدر رسمي", conditional: "مشروط", unverified: "لم يتم التحقق بعد" } : evidenceLabel;
  return <span className={`evidence-badge evidence-${status}`}>{labels[status]}</span>;
}

function SourceLine({ provenance, locale }: { provenance: Provenance; locale: Locale }) {
  return <p className="source-line"><EvidenceBadge status={provenance.status} locale={locale} /> <span>{provenance.source}</span> <time dateTime={provenance.checkedOn}>{provenance.checkedOn}</time>{provenance.sourceUrl && <a href={provenance.sourceUrl} target="_blank" rel="noreferrer">{locale === "ar" ? "فتح المصدر ↗" : "Open source ↗"}</a>}{provenance.note && <small>{provenance.note}</small>}</p>;
}

function Fact({ fact, locale }: { fact: SourcedFact; locale: Locale }) {
  return <article className="sourced-fact"><h4>{fact.label}</h4><p>{fact.value}</p>{fact.appliesTo && <small>{COPY[locale].applies}: {fact.appliesTo}</small>}<SourceLine provenance={fact.provenance} locale={locale} /></article>;
}

function UniqueList({ title, items }: { title: string; items: string[] }) {
  return <article><h3>{title}</h3><ul>{[...new Set(items)].map((item) => <li key={item}>{item}</li>)}</ul></article>;
}

function Step({ step, locale }: { step: BlueprintStep; locale: Locale }) {
  const c = COPY[locale];
  return <details className="blueprint-step" id={step.id}>
    <summary><span>{String(step.number).padStart(2, "0")}</span><div><small>{step.appliesTo}</small><h3>{step.title}</h3></div><i aria-hidden="true">+</i></summary>
    <div className="blueprint-step-body">
      <dl className="step-facts"><div><dt>{c.actor}</dt><dd>{step.actor}</dd></div><div><dt>{c.trigger}</dt><dd>{step.trigger}</dd></div><div><dt>{c.authority}</dt><dd>{step.authority}</dd></div><div><dt>{c.portal}</dt><dd>{step.portal}</dd></div></dl>
      <div className="step-grid"><UniqueList title={c.happens} items={step.whatHappens} /><UniqueList title={c.documents} items={step.documentsIn} /><UniqueList title={c.outputs} items={step.outputs} /><UniqueList title={c.risks} items={step.failureModes} /></div>
      {(step.fees.length > 0 || step.duration.length > 0) && <div className="step-measures">{step.fees.map((fact) => <Fact key={`${step.id}-${fact.label}`} fact={fact} locale={locale} />)}{step.duration.map((fact) => <Fact key={`${step.id}-${fact.label}`} fact={fact} locale={locale} />)}</div>}
      <p className="step-unlocks"><b>{c.unlocks}</b>{step.unlocks}</p>
      <SourceLine provenance={step.provenance} locale={locale} />
    </div>
  </details>;
}

export function StakeholderBlueprintPage({ stakeholderId, emirate, track, locale }: { stakeholderId: string; emirate: EmirateId; track: DubaiTrack; locale: Locale }) {
  const profile = stakeholderBlueprintById[stakeholderId];
  const fallbackGroup = groupById[stakeholderId];
  if (!profile || !fallbackGroup) notFound();
  const c = COPY[locale];
  const localizedGroup = getGroups(locale).find((group) => group.id === stakeholderId) ?? fallbackGroup;
  const localizedStages = getStages(locale);
  const L = (path: string) => localePath(locale, path);
  const coverage = profile.coverage.find((item) => item.emirate === emirate);
  if (!coverage) notFound();
  const selectedTrack = DUBAI_TRACKS.find((item) => item.id === track) ?? DUBAI_TRACKS[0];
  const isReference = emirate === "dubai" && profile.steps.length > 0 && track !== "financial-free-zone";
  const steps = isReference ? profile.steps.filter((step) => step.tracks.includes(track) || track === "track-neutral") : [];
  const evidenceStatus = isReference ? blueprintEvidenceStatus(profile, emirate) : "unverified";
  const selectedCoverageState = isReference ? "reference" : emirate === "dubai" && profile.steps.length > 0 ? "not-yet-mapped" : coverage.state;
  const missingItems = coverage.missing.length > 0 ? coverage.missing : ["DIFC Registrar of Real Property transaction blueprint", "DIFC-specific eligibility and document register", "DIFC fee and filing-deadline register", "DIFC official forms and portal sequence"];
  const emirateLabel = EMIRATES.find((item) => item.id === emirate)?.[locale === "ar" ? "ar" : "label"] ?? emirate;
  const documents = steps.flatMap((step) => step.documentsIn);
  const authorities = steps.flatMap((step) => [step.authority, step.portal]);
  const fees = steps.flatMap((step) => step.fees);
  const durations = steps.flatMap((step) => step.duration);
  const sources = [...new Map(steps.flatMap((step) => [step.provenance, ...step.fees.map((item) => item.provenance), ...step.duration.map((item) => item.provenance)]).filter((item) => item.sourceUrl).map((item) => [item.sourceUrl, item])).values()];
  const participating = profile.participation.filter((item) => item.state !== "not-involved");
  const firstStage = stageById[participating[0]?.stageId];
  const finalStep = steps.at(-1);

  return <Page className="inner-page stakeholder-blueprint-page" locale={locale}>
    <nav className="crumbs" aria-label={locale === "ar" ? "مسار التنقل" : "Breadcrumb"}><Link className="crumb-back" href={L("/stakeholders")}><span aria-hidden="true">←</span> {c.back}</Link><span aria-hidden="true">/</span><b>{localizedGroup.name}</b></nav>

    <section className={`stakeholder-blueprint-hero${isReference ? " has-visual" : ""}`}>
      <div className="stakeholder-blueprint-copy">
        <span className="eyebrow">{c.stakeholder} {String(fallbackGroup.number).padStart(2, "0")} / 12</span>
        <h1>{localizedGroup.name}</h1>
        <p>{profile.overview}</p>
        <div className="blueprint-status-row"><EvidenceBadge status={evidenceStatus} locale={locale} /><span>{selectedCoverageState === "reference" ? c.mapped : selectedCoverageState === "structured-overview" ? c.overview : c.unmapped}</span><time dateTime="2026-08-26">{c.checked}</time></div>
        <div className="scope-context"><b>{c.scope}</b><span>{emirateLabel}</span>{emirate === "dubai" && <span>{selectedTrack.label}</span>}</div>
        <StakeholderJurisdictionSelector stakeholderId={stakeholderId} emirate={emirate} track={track} locale={locale} />
        {emirate === "dubai" && <p className="track-note">{selectedTrack.note}</p>}
      </div>
      {isReference ? <figure className="stakeholder-blueprint-visual"><Image src="/images/stakeholder-landowners-investors-hero-v1.png" alt="Illustrative capital-meets-land diorama with a surveyed plot, plan, mandate and investment records" fill sizes="(max-width: 900px) 100vw, 46vw" priority /><figcaption>{c.reos} · {locale === "ar" ? "تصور توضيحي وليس مخططاً رسمياً" : "Illustrative concept, not an official plan"}</figcaption></figure> : <div className="stakeholder-blueprint-index" aria-label={`${participating.length} participating stages`}><small>{c.participation}</small><b>{participating.length}</b><span>/ 7</span></div>}
    </section>

    <section className="stakeholder-start section-pad"><span className="eyebrow">01 · {c.where}</span><div><h2>{profile.firstDecision}</h2><p>{isReference ? c.mappedNotice : c.overviewNotice}</p>{locale === "ar" && isReference && <p className="translation-warning">{c.translation}</p>}</div><aside><small>{locale === "ar" ? "أول مرحلة مرتبطة" : "First mapped stage"}</small><b>{firstStage ? `${String(firstStage.number).padStart(2, "0")} ${firstStage.name}` : c.notDirect}</b></aside></section>

    <section className="stakeholder-participation section-pad"><span className="eyebrow">02 · {c.participation}</span><h2>{c.participationTitle}</h2><div className="participation-rail">{profile.participation.map((item) => { const stage = localizedStages.find((candidate) => candidate.id === item.stageId); const label = item.state === "lead" ? c.lead : item.state === "participant" ? c.participant : c.notInvolved; return <article key={item.stageId} className={`participation-${item.state}`}><header><b>{String(stage?.number ?? 0).padStart(2, "0")}</b><span>{stage?.name}</span></header><small>{label}</small><p>{item.summary}</p>{item.state !== "not-involved" && <Link href={L(`/property-journey/${item.stageId}/stakeholders/${stakeholderId}`)}>{locale === "ar" ? "فتح الصلة ↗" : "Open connection ↗"}</Link>}</article>; })}</div></section>

    {!isReference ? <section className="unmapped-jurisdiction section-pad"><span className="eyebrow">03 · {c.unmapped}</span><h2>{emirateLabel}: {c.unmapped}</h2><p>{emirate === "dubai" ? (locale === "ar" ? "تم فصل هذا المسار عن مسارات دائرة الأراضي والأملاك ولن يتم عرض حقائق مسار آخر هنا." : "This branch is isolated from the ordinary DLD route; facts from another route are not shown here.") : c.noDubai}</p><h3>{c.missing}</h3><ul>{missingItems.map((item) => <li key={item}>{item}</li>)}</ul><Link className="text-link" href={L("/stakeholders")}>{c.all} <span>→</span></Link></section> : <>
      <section className="stakeholder-blueprint section-pad"><span className="eyebrow">03 · {c.blueprint}</span><div className="blueprint-intro"><h2>{c.blueprintTitle}</h2><p>{c.blueprintCopy}</p></div><div className="blueprint-steps">{steps.map((step) => <Step key={step.id} step={step} locale={locale} />)}</div></section>

      <section className="stakeholder-evidence-grid section-pad">
        <article className="evidence-panel"><span className="eyebrow">04 · {c.eligibility}</span><Fact fact={ownershipEligibilityFact} locale={locale} /></article>
        <article className="evidence-panel"><span className="eyebrow">05 · {c.officialChannels}</span><ul>{[...new Set(authorities)].map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="evidence-panel"><span className="eyebrow">06 · {c.documentRegister}</span><ul>{[...new Set(documents)].map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="evidence-panel"><span className="eyebrow">07 · {c.feeRegister}</span>{fees.map((fact) => <Fact key={`fee-${fact.label}-${fact.appliesTo}`} fact={fact} locale={locale} />)}{durations.map((fact) => <Fact key={`time-${fact.label}-${fact.appliesTo}`} fact={fact} locale={locale} />)}<p className="measure-warning">{locale === "ar" ? "مدة الخدمة الرسمية ليست المدة الإجمالية للمعاملة." : "Authority service estimates are not total commercial transaction durations."}</p></article>
      </section>

      <section className="derived-summary section-pad"><span className="eyebrow">08 · {c.derived}</span><div className="derived-grid"><UniqueList title={c.responsibilities} items={steps.flatMap((step) => step.whatHappens)} /><UniqueList title={c.dependencies} items={steps.flatMap((step) => [step.trigger, ...step.documentsIn])} /><UniqueList title={c.challenges} items={steps.flatMap((step) => step.failureModes)} /></div></section>

      <section className="stakeholder-sources section-pad"><span className="eyebrow">09 · {c.sources}</span><div>{sources.map((source) => <SourceLine key={source.sourceUrl} provenance={source} locale={locale} />)}</div></section>

      <section className="stakeholder-handoff section-pad"><span className="eyebrow">10 · {c.handoff}</span><h2>{finalStep?.unlocks}</h2><p>{locale === "ar" ? "قبل المتابعة، تحقق من الأهلية الخاصة بالأصل والقناة والمستندات والرسوم مباشرة مع الجهة الرسمية المعنية." : "Before continuing, verify asset-specific eligibility, channel, documents, fees and current service conditions directly with the relevant official authority."}</p></section>
    </>}

    <nav className="stakeholder-continuation" aria-label={locale === "ar" ? "روابط المتابعة" : "Continue exploring"}><Link href={L(`/ecosystem?view=stakeholder&stakeholder=${stakeholderId}`)}>{c.ecosystem} <span>→</span></Link><Link href={L("/stakeholders")}>{c.all} <span>→</span></Link></nav>
  </Page>;
}

"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import type { Locale } from "../i18n/config";

export type IntelligenceGuideOption = {
  slug: string;
  name: string;
  card: string;
  stageCount: number;
  stepCount: number;
  href: string;
};

export type IntelligenceAuthorityOption = {
  id: string;
  name: string;
  jurisdiction: string;
  role: string;
  status: string;
  sourceUrl: string;
};

export type IntelligenceTermOption = {
  id: string;
  term: string;
  short: string;
  jurisdictional: boolean;
};

export type IntelligenceEvidenceRecord = {
  authority: string;
  title: string;
  sourceUrl: string;
  claim: string;
  scopeLimit: string;
  jurisdiction: string;
  route: string;
  stageId: string;
  stageName: string;
  stageHref: string;
  evidenceStatus: string;
  checkedOn: string;
  reviewBy: string;
  guidance: string;
};

export type IntelligenceLifecycleStage = {
  id: string;
  number: number;
  name: string;
  href: string;
};

type Props = {
  locale: Locale;
  guides: IntelligenceGuideOption[];
  authorities: IntelligenceAuthorityOption[];
  terms: IntelligenceTermOption[];
  glossaryHref: string;
  evidenceRecord: IntelligenceEvidenceRecord;
  lifecycleStages: IntelligenceLifecycleStage[];
};

const copy = {
  en: {
    trustLabel: "01 · EVIDENCE PATHWAY",
    trustTitle: "Trust the answer. See the evidence.",
    trustIntro: "Follow the five checks REOS uses to turn an official source into scoped guidance.",
    evidenceRecord: "Live evidence example",
    checkpoint: "Checkpoint",
    reviewed: "Reviewed",
    ready: "Ready to review",
    locked: "Complete the previous checkpoint first",
    reviewNext: "Review and continue",
    nextCheckpoint: "Next checkpoint",
    openSource: "Open official source",
    openStage: "Open lifecycle stage",
    lifecycleContext: "Lifecycle context",
    appliesHere: "Evidence applies here",
    completionTitle: "Evidence pathway reviewed",
    completionText: "All five checks are visible. The guidance remains educational and the authority remains the decision-maker.",
    resetPathway: "Review again",
    sourceAttached: "Official source attached",
    claimBoundary: "What it does not establish",
    routeLabel: "Applicable route",
    checkedLabel: "Source checked",
    reviewLabel: "Review due",
    guidanceLimit: "REOS explanation—not an authority decision or professional advice.",
    guideLabel: "02 · ROLE GUIDES",
    guideTitle: "Choose who you are.",
    guideIntro: "Your role reveals the relevant route—not another copy of the whole lifecycle.",
    stages: "lifecycle stages",
    steps: "guide steps",
    openGuide: "Open this guide",
    authorityLabel: "03 · AUTHORITY ROUTE",
    authorityTitle: "Resolve who governs it.",
    authorityIntro: "Select an authority to expose its jurisdiction, role and official channel.",
    officialSource: "Open official source",
    glossaryLabel: "04 · VISUAL GLOSSARY",
    glossaryTitle: "Decode a term.",
    glossaryIntro: "Search the vocabulary, then open only the definition you need.",
    search: "Search property terms",
    searchPlaceholder: "Try escrow, NOC or handover",
    scopeSensitive: "Jurisdiction-sensitive",
    generalTerm: "General property term",
    openGlossary: "Open the complete glossary",
    noTerms: "No matching term. Open the full glossary for the complete index.",
  },
  ar: {
    trustLabel: "01 · مسار الأدلة",
    trustTitle: "ثق بالإجابة. وشاهد دليلها.",
    trustIntro: "اتبع نقاط التحقق الخمس التي تستخدمها REOS لتحويل المصدر الرسمي إلى إرشاد محدد النطاق.",
    evidenceRecord: "مثال حي لمسار الأدلة",
    checkpoint: "نقطة التحقق",
    reviewed: "تمت المراجعة",
    ready: "جاهز للمراجعة",
    locked: "أكمل نقطة التحقق السابقة أولاً",
    reviewNext: "راجع وتابع",
    nextCheckpoint: "نقطة التحقق التالية",
    openSource: "افتح المصدر الرسمي",
    openStage: "افتح مرحلة دورة الحياة",
    lifecycleContext: "سياق دورة الحياة",
    appliesHere: "ينطبق الدليل هنا",
    completionTitle: "تمت مراجعة مسار الأدلة",
    completionText: "أصبحت نقاط التحقق الخمس ظاهرة. يظل الإرشاد تعليمياً وتبقى الجهة الرسمية صاحبة القرار.",
    resetPathway: "راجع مرة أخرى",
    sourceAttached: "المصدر الرسمي مرفق",
    claimBoundary: "ما لا يثبته المصدر",
    routeLabel: "المسار المنطبق",
    checkedLabel: "تاريخ فحص المصدر",
    reviewLabel: "موعد المراجعة",
    guidanceLimit: "شرح من REOS، وليس قراراً رسمياً أو بديلاً عن المشورة المهنية.",
    guideLabel: "02 · أدلة الأدوار",
    guideTitle: "اختر دورك.",
    guideIntro: "يكشف دورك المسار المناسب دون تكرار دورة الحياة كاملة.",
    stages: "مراحل دورة الحياة",
    steps: "خطوات الدليل",
    openGuide: "افتح هذا الدليل",
    authorityLabel: "03 · مسار الجهة",
    authorityTitle: "حدد الجهة المختصة.",
    authorityIntro: "اختر جهة لإظهار نطاقها ودورها وقناتها الرسمية.",
    officialSource: "افتح المصدر الرسمي",
    glossaryLabel: "04 · المسرد المرئي",
    glossaryTitle: "افهم المصطلح.",
    glossaryIntro: "ابحث في المصطلحات وافتح التعريف الذي تحتاجه فقط.",
    search: "ابحث في مصطلحات العقار",
    searchPlaceholder: "جرّب escrow أو NOC أو handover",
    scopeSensitive: "يتأثر بالاختصاص",
    generalTerm: "مصطلح عقاري عام",
    openGlossary: "افتح المسرد الكامل",
    noTerms: "لا يوجد مصطلح مطابق. افتح المسرد الكامل لرؤية الفهرس.",
  },
} as const;

const evidenceEn = [
  { number: "01", title: "Official source", text: "Identify the responsible authority publication and open it directly." },
  { number: "02", title: "Scoped claim", text: "Keep only the statement the source supports—and show its boundary." },
  { number: "03", title: "Jurisdiction", text: "Confirm the emirate, authority route and lifecycle stage where it applies." },
  { number: "04", title: "Review state", text: "Show the evidence status, checked date and next review date." },
  { number: "05", title: "Guidance", text: "Explain the evidence without presenting REOS as the decision-maker." },
] as const;

const evidenceAr = [
  { number: "01", title: "المصدر الرسمي", text: "منشور الجهة المسؤولة أو مقدم الخدمة المنظم." },
  { number: "02", title: "الادعاء المحدد", text: "العبارة التي يدعمها المصدر فعلياً دون توسيع معناها." },
  { number: "03", title: "الاختصاص", text: "الإمارة والمنطقة والمسار والشروط التي ينطبق عليها." },
  { number: "04", title: "حالة المراجعة", text: "حالة الدليل وتاريخ آخر تحقق معلن." },
  { number: "05", title: "الإرشاد", text: "شرح موثق، وليس قراراً رسمياً أو بديلاً عن المشورة المهنية." },
] as const;

const evidenceProgressFallback = new Map<string, number>();
const evidenceProgressEvent = "reos-evidence-pathway";

function readEvidenceProgress(storageKey: string, total: number) {
  try {
    const saved = window.localStorage.getItem(storageKey);
    const parsed = saved ? JSON.parse(saved) as { version?: number; completedThrough?: number } : null;
    if (parsed?.version === 1 && Number.isInteger(parsed.completedThrough)) {
      return Math.min(total, Math.max(0, parsed.completedThrough ?? 0));
    }
  } catch {
    // Fall back to memory when storage is unavailable or malformed.
  }
  return evidenceProgressFallback.get(storageKey) ?? 0;
}

function useEvidenceProgress(storageKey: string, total: number) {
  const subscribe = useCallback((notify: () => void) => {
    window.addEventListener("storage", notify);
    window.addEventListener(evidenceProgressEvent, notify);
    return () => {
      window.removeEventListener("storage", notify);
      window.removeEventListener(evidenceProgressEvent, notify);
    };
  }, []);
  const getSnapshot = useCallback(() => readEvidenceProgress(storageKey, total), [storageKey, total]);
  const completed = useSyncExternalStore(subscribe, getSnapshot, () => 0);
  const setCompleted = useCallback((value: number) => {
    const bounded = Math.min(total, Math.max(0, value));
    evidenceProgressFallback.set(storageKey, bounded);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ version: 1, completedThrough: bounded }));
    } catch {
      // The in-memory store preserves interaction for this page session.
    }
    window.dispatchEvent(new Event(evidenceProgressEvent));
  }, [storageKey, total]);
  return [completed, setCompleted] as const;
}

function EvidenceIcon({ index }: { index: number }) {
  const paths = [
    <><path d="M7 5.5h10v13H7z"/><path d="M9.5 9h5M9.5 12h5M9.5 15h3"/></>,
    <><path d="M5 7.5h14v9H5z"/><path d="m8 12 2 2 5-5"/></>,
    <><path d="M12 20s6-5.1 6-11a6 6 0 1 0-12 0c0 5.9 6 11 6 11Z"/><circle cx="12" cy="9" r="2"/></>,
    <><path d="M6 4.5h12v15H6z"/><path d="m9 12 2 2 4-5M9 7.5h6"/></>,
    <><path d="M5 6h14v10H9l-4 3V6Z"/><path d="M8 10h8M8 13h5"/></>,
  ];
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{paths[index]}</svg>;
}

export function IntelligenceWorkspaces({ locale, guides, authorities, terms, glossaryHref, evidenceRecord, lifecycleStages }: Props) {
  const t = copy[locale];
  const evidence = locale === "ar" ? evidenceAr : evidenceEn;
  const [evidenceIndex, setEvidenceIndex] = useState(0);
  const evidenceStorageKey = `reos:evidence-pathway:v1:${locale}`;
  const [completedEvidence, setCompletedEvidence] = useEvidenceProgress(evidenceStorageKey, evidence.length);
  const [guideSlug, setGuideSlug] = useState(guides[0]?.slug ?? "");
  const [authorityId, setAuthorityId] = useState(authorities[0]?.id ?? "");
  const [termId, setTermId] = useState(terms[0]?.id ?? "");
  const [query, setQuery] = useState("");

  const selectedGuide = guides.find((guide) => guide.slug === guideSlug) ?? guides[0];
  const selectedAuthority = authorities.find((authority) => authority.id === authorityId) ?? authorities[0];
  const filteredTerms = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase(locale === "ar" ? "ar" : "en");
    if (!needle) return terms;
    return terms.filter((term) => `${term.term} ${term.short}`.toLocaleLowerCase(locale === "ar" ? "ar" : "en").includes(needle));
  }, [locale, query, terms]);
  const visibleTerms = query.trim() ? filteredTerms : filteredTerms.slice(0, 8);
  const selectedTerm = visibleTerms.find((term) => term.id === termId) ?? visibleTerms[0];
  const evidenceProgress = Math.round((completedEvidence / evidence.length) * 100);
  const selectedEvidence = evidence[evidenceIndex];

  const reviewEvidenceCheckpoint = () => {
    const nextCompleted = Math.max(completedEvidence, evidenceIndex + 1);
    setCompletedEvidence(nextCompleted);
    if (evidenceIndex < evidence.length - 1) setEvidenceIndex(evidenceIndex + 1);
  };

  const resetEvidencePathway = () => {
    setCompletedEvidence(0);
    setEvidenceIndex(0);
  };

  const evidenceDetail = [
    {
      value: evidenceRecord.title,
      facts: [[t.sourceAttached, evidenceRecord.authority]],
      action: "source" as const,
    },
    {
      value: evidenceRecord.claim,
      facts: [[t.claimBoundary, evidenceRecord.scopeLimit]],
      action: null,
    },
    {
      value: evidenceRecord.jurisdiction,
      facts: [[t.routeLabel, evidenceRecord.route], [t.lifecycleContext, `01 · ${evidenceRecord.stageName}`]],
      action: "stage" as const,
    },
    {
      value: evidenceRecord.evidenceStatus,
      facts: [[t.checkedLabel, evidenceRecord.checkedOn], [t.reviewLabel, evidenceRecord.reviewBy]],
      action: null,
    },
    {
      value: evidenceRecord.guidance,
      facts: [[t.guidanceLimit, evidenceRecord.authority]],
      action: "stage" as const,
    },
  ][evidenceIndex];

  return (
    <div className="intelligence-workspaces" data-intelligence-revamp="true">
      <section className="intelligence-workspace evidence-workspace" id="evidence-pathway" aria-labelledby="evidence-workspace-title">
        <header className="intelligence-workspace-heading">
          <span className="eyebrow">{t.trustLabel}</span>
          <h2 id="evidence-workspace-title">{t.trustTitle}</h2>
          <p>{t.trustIntro}</p>
        </header>
        <div className="evidence-stage">
          <div className="evidence-record-label"><span>{t.evidenceRecord}</span><b>{evidenceRecord.title}</b></div>
          <div className="evidence-progress" aria-label={`${completedEvidence} / ${evidence.length} ${t.reviewed}`}>
            <span>{String(completedEvidence).padStart(2, "0")} / {String(evidence.length).padStart(2, "0")}</span>
            <progress max={evidence.length} value={completedEvidence}>{evidenceProgress}%</progress>
          </div>
          <div className="evidence-rail" role="group" aria-label={t.trustTitle}>
            <div className="evidence-progress-line" aria-hidden="true"><span style={{ width: `${evidenceProgress}%` }} /></div>
            {evidence.map((item, index) => (
              <button
                key={item.number}
                type="button"
                className={`${index === evidenceIndex ? "is-active" : ""} ${index < completedEvidence ? "is-complete" : ""}`}
                aria-pressed={index === evidenceIndex}
                aria-label={`${item.number} ${item.title}. ${index < completedEvidence ? t.reviewed : index > completedEvidence ? t.locked : t.ready}.`}
                disabled={index > completedEvidence}
                onClick={() => setEvidenceIndex(index)}
              >
                <span className="evidence-node-icon"><EvidenceIcon index={index} /></span>
                <i>{item.number}</i><span>{item.title}</span>
                <small>{index < completedEvidence ? t.reviewed : index > completedEvidence ? t.locked : t.ready}</small>
              </button>
            ))}
          </div>
          <article className="evidence-focus" aria-live="polite">
            <div className="evidence-document" aria-hidden="true">
              <span><EvidenceIcon index={evidenceIndex} /></span>
              <i>{selectedEvidence.number}</i>
              <small>REOS<br />EVIDENCE</small>
            </div>
            <div className="evidence-focus-copy">
              <small>{t.checkpoint} {selectedEvidence.number} / 05</small>
              <h3>{selectedEvidence.title}</h3>
              <p className="evidence-instruction">{selectedEvidence.text}</p>
              <strong>{evidenceDetail.value}</strong>
              <dl>
                {evidenceDetail.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              </dl>
              <div className="evidence-focus-actions">
                {evidenceDetail.action === "source" ? <a href={evidenceRecord.sourceUrl} target="_blank" rel="noreferrer">{t.openSource} ↗</a> : null}
                {evidenceDetail.action === "stage" ? <Link href={evidenceRecord.stageHref}>{t.openStage} ↗</Link> : null}
                {evidenceIndex < completedEvidence && evidenceIndex < evidence.length - 1
                  ? <button type="button" onClick={() => setEvidenceIndex(evidenceIndex + 1)}>{t.nextCheckpoint} →</button>
                  : evidenceIndex >= completedEvidence && completedEvidence < evidence.length
                    ? <button type="button" onClick={reviewEvidenceCheckpoint}>{t.reviewNext} →</button>
                    : null}
              </div>
            </div>
          </article>
          <div className="evidence-lifecycle" aria-label={t.lifecycleContext}>
            <b>{t.lifecycleContext}</b>
            <div>
              {lifecycleStages.map((stage) => (
                <Link key={stage.id} href={stage.href} className={stage.id === evidenceRecord.stageId ? "is-applicable" : ""} aria-current={stage.id === evidenceRecord.stageId ? "step" : undefined}>
                  <i>{String(stage.number).padStart(2, "0")}</i><span>{stage.name}</span>{stage.id === evidenceRecord.stageId ? <small>{t.appliesHere}</small> : null}
                </Link>
              ))}
            </div>
          </div>
          {completedEvidence === evidence.length ? (
            <div className="evidence-completion" role="status">
              <span><EvidenceIcon index={4} /></span>
              <div><b>{t.completionTitle}</b><p>{t.completionText}</p></div>
              <button type="button" onClick={resetEvidencePathway}>{t.resetPathway}</button>
            </div>
          ) : null}
        </div>
      </section>

      <section className="intelligence-workspace guide-workspace" id="guide-selector" aria-labelledby="guide-workspace-title">
        <header className="intelligence-workspace-heading">
          <span className="eyebrow">{t.guideLabel}</span>
          <h2 id="guide-workspace-title">{t.guideTitle}</h2>
          <p>{t.guideIntro}</p>
        </header>
        <div className="guide-orbit-shell">
          <div className="guide-role-deck" role="group" aria-label={t.guideTitle}>
            {guides.map((guide, index) => (
              <button
                key={guide.slug}
                type="button"
                className={guide.slug === selectedGuide?.slug ? "is-active" : ""}
                aria-pressed={guide.slug === selectedGuide?.slug}
                onClick={() => setGuideSlug(guide.slug)}
              >
                <i>{String(index + 1).padStart(2, "0")}</i><span>{guide.name}</span>
              </button>
            ))}
          </div>
          {selectedGuide && (
            <article className="guide-focus" aria-live="polite">
              <small>{selectedGuide.card}</small>
              <h3>{selectedGuide.name}</h3>
              <div><span><b>{selectedGuide.stageCount}</b>{t.stages}</span><span><b>{selectedGuide.stepCount}</b>{t.steps}</span></div>
              <Link href={selectedGuide.href}>{t.openGuide} ↗</Link>
            </article>
          )}
        </div>
      </section>

      <section className="intelligence-workspace authority-workspace" id="authority-explorer" aria-labelledby="authority-workspace-title">
        <header className="intelligence-workspace-heading">
          <span className="eyebrow">{t.authorityLabel}</span>
          <h2 id="authority-workspace-title">{t.authorityTitle}</h2>
          <p>{t.authorityIntro}</p>
        </header>
        <div className="authority-constellation">
          <div className="authority-node-field" role="group" aria-label={t.authorityTitle}>
            {authorities.map((authority, index) => (
              <button
                key={authority.id}
                type="button"
                className={authority.id === selectedAuthority?.id ? "is-active" : ""}
                aria-pressed={authority.id === selectedAuthority?.id}
                onClick={() => setAuthorityId(authority.id)}
              >
                <i>{String(index + 1).padStart(2, "0")}</i><span>{authority.name}</span>
              </button>
            ))}
          </div>
          {selectedAuthority && (
            <article className="authority-focus" aria-live="polite">
              <small>{selectedAuthority.jurisdiction} · {selectedAuthority.status}</small>
              <h3>{selectedAuthority.name}</h3>
              <p>{selectedAuthority.role}</p>
              <a href={selectedAuthority.sourceUrl} target="_blank" rel="noreferrer">{t.officialSource} ↗</a>
            </article>
          )}
        </div>
      </section>

      <section className="intelligence-workspace glossary-workspace" id="glossary-explorer" aria-labelledby="glossary-workspace-title">
        <header className="intelligence-workspace-heading">
          <span className="eyebrow">{t.glossaryLabel}</span>
          <h2 id="glossary-workspace-title">{t.glossaryTitle}</h2>
          <p>{t.glossaryIntro}</p>
        </header>
        <div className="glossary-console">
          <label><span>{t.search}</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.searchPlaceholder} type="search" /></label>
          <div className="glossary-term-cloud" role="group" aria-label={t.search}>
            {visibleTerms.map((term) => (
              <button key={term.id} type="button" className={term.id === selectedTerm?.id ? "is-active" : ""} aria-pressed={term.id === selectedTerm?.id} onClick={() => setTermId(term.id)}>{term.term}</button>
            ))}
          </div>
          {selectedTerm ? (
            <article className="glossary-focus" aria-live="polite">
              <small>{selectedTerm.jurisdictional ? t.scopeSensitive : t.generalTerm}</small>
              <h3>{selectedTerm.term}</h3>
              <p>{selectedTerm.short}</p>
              <Link href={glossaryHref}>{t.openGlossary} ↗</Link>
            </article>
          ) : <p className="glossary-empty" role="status">{t.noTerms}</p>}
        </div>
      </section>
    </div>
  );
}

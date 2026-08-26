"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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

type Props = {
  locale: Locale;
  guides: IntelligenceGuideOption[];
  authorities: IntelligenceAuthorityOption[];
  terms: IntelligenceTermOption[];
  glossaryHref: string;
};

const copy = {
  en: {
    trustLabel: "01 · EVIDENCE PATHWAY",
    trustTitle: "Trust the answer. See the evidence.",
    trustIntro: "Select each checkpoint before relying on guidance.",
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
    trustIntro: "اختر كل نقطة تحقق قبل الاعتماد على الإرشاد.",
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
  { number: "01", title: "Official source", text: "The responsible authority or regulated provider publication." },
  { number: "02", title: "Scoped claim", text: "Only the statement that the source actually supports." },
  { number: "03", title: "Jurisdiction", text: "The emirate, zone, route and conditions where it applies." },
  { number: "04", title: "Review state", text: "Evidence status and the most recent checked date." },
  { number: "05", title: "Guidance", text: "A cited explanation—not an authority decision or professional advice." },
] as const;

const evidenceAr = [
  { number: "01", title: "المصدر الرسمي", text: "منشور الجهة المسؤولة أو مقدم الخدمة المنظم." },
  { number: "02", title: "الادعاء المحدد", text: "العبارة التي يدعمها المصدر فعلياً دون توسيع معناها." },
  { number: "03", title: "الاختصاص", text: "الإمارة والمنطقة والمسار والشروط التي ينطبق عليها." },
  { number: "04", title: "حالة المراجعة", text: "حالة الدليل وتاريخ آخر تحقق معلن." },
  { number: "05", title: "الإرشاد", text: "شرح موثق، وليس قراراً رسمياً أو بديلاً عن المشورة المهنية." },
] as const;

export function IntelligenceWorkspaces({ locale, guides, authorities, terms, glossaryHref }: Props) {
  const t = copy[locale];
  const evidence = locale === "ar" ? evidenceAr : evidenceEn;
  const [evidenceIndex, setEvidenceIndex] = useState(0);
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

  return (
    <div className="intelligence-workspaces" data-intelligence-revamp="true">
      <section className="intelligence-workspace evidence-workspace" id="evidence-pathway" aria-labelledby="evidence-workspace-title">
        <header className="intelligence-workspace-heading">
          <span className="eyebrow">{t.trustLabel}</span>
          <h2 id="evidence-workspace-title">{t.trustTitle}</h2>
          <p>{t.trustIntro}</p>
        </header>
        <div className="evidence-stage">
          <div className="evidence-rail" role="group" aria-label={t.trustTitle}>
            {evidence.map((item, index) => (
              <button
                key={item.number}
                type="button"
                className={index === evidenceIndex ? "is-active" : ""}
                aria-pressed={index === evidenceIndex}
                onClick={() => setEvidenceIndex(index)}
              >
                <i>{item.number}</i><span>{item.title}</span>
              </button>
            ))}
          </div>
          <article className="evidence-focus" aria-live="polite">
            <small>{evidence[evidenceIndex].number} / 05</small>
            <h3>{evidence[evidenceIndex].title}</h3>
            <p>{evidence[evidenceIndex].text}</p>
          </article>
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

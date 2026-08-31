"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import type { Locale } from "../i18n/config";

export type IntelligenceDomain = {
  id: string;
  number: number;
  name: string;
  short: string;
  description: string;
  status: string;
  href?: string;
};

type DomainPoint = { x: number; y: number; label: "above" | "below" | "left" | "right" };

const domainPoints: Record<string, DomainPoint> = {
  guides: { x: 21, y: 32, label: "below" },
  regulations: { x: 79, y: 32, label: "below" },
  processes: { x: 12, y: 57, label: "right" },
  "authority-information": { x: 88, y: 57, label: "left" },
  "definitions-and-glossary": { x: 25, y: 81, label: "above" },
  "knowledge-graph": { x: 75, y: 81, label: "above" },
};

const pointStyle = (point: DomainPoint) => ({
  "--intelligence-x": `${point.x}%`,
  "--intelligence-y": `${point.y}%`,
} as CSSProperties);

const copy = {
  en: {
    mapTitle: "REOS Intelligence knowledge map",
    mapDescription: "Six knowledge domains connect to a central REOS Intelligence layer. Select a domain to preview its purpose and open the relevant information.",
    selectPreview: "Select to preview intelligence domain.",
    coreAria: "REOS Intelligence. Show all six knowledge domains.",
    coreLabel: "INTELLIGENCE",
    coreSub: "CONNECTED KNOWLEDGE LAYER",
    mobileAria: "Six REOS Intelligence domains",
    domainPrefix: "INTELLIGENCE DOMAIN",
    explore: "Explore",
    unpublished: "No public explorer is published yet.",
    defaultTitle: "Knowledge, connected to context.",
    defaultDescription: "Guides, regulations, processes, authority information, definitions and the knowledge graph form one evidence-led knowledge layer for the UAE property ecosystem.",
    prompt: "Select a knowledge domain to explore it.",
    opened: "preview opened.",
    allShown: "All six intelligence domains shown.",
  },
  ar: {
    mapTitle: "خريطة معرفة REOS",
    mapDescription: "ترتبط ستة مجالات معرفية بطبقة معرفة مركزية في REOS. اختر مجالًا لمعاينة غرضه وفتح المعلومات المرتبطة به.",
    selectPreview: "اختر لمعاينة مجال المعرفة.",
    coreAria: "معرفة REOS. عرض مجالات المعرفة الستة.",
    coreLabel: "المعرفة",
    coreSub: "طبقة معرفة مترابطة",
    mobileAria: "مجالات معرفة REOS الستة",
    domainPrefix: "مجال المعرفة",
    explore: "استكشف",
    unpublished: "لم يُنشر مستكشف عام لهذا المجال بعد.",
    defaultTitle: "معرفة مرتبطة بالسياق.",
    defaultDescription: "تكوّن الأدلة والشروح التنظيمية والإجراءات ومعلومات الجهات المختصة والتعريفات والرسم المعرفي طبقة معرفة واحدة قائمة على الأدلة للمنظومة العقارية في دولة الإمارات.",
    prompt: "اختر مجالًا معرفيًا لاستكشافه.",
    opened: "تم فتح المعاينة.",
    allShown: "تظهر مجالات المعرفة الستة جميعها.",
  },
} as const;

export function IntelligenceHeroMap({ domains, locale }: { domains: IntelligenceDomain[]; locale: Locale }) {
  const t = copy[locale];
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const activeId = previewId ?? selectedId;
  const activeDomain = domains.find((domain) => domain.id === activeId);

  useEffect(() => {
    const clearOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedId(null);
        setPreviewId(null);
      }
    };
    window.addEventListener("keydown", clearOnEscape);
    return () => window.removeEventListener("keydown", clearOnEscape);
  }, []);

  const chooseDomain = (id: string) => setSelectedId((current) => current === id ? null : id);

  return (
    <div className="intelligence-hero-explorer">
      <figure className="intelligence-hero-map" aria-labelledby="intelligence-map-title intelligence-map-description">
        <figcaption className="sr-only">
          <span id="intelligence-map-title">{t.mapTitle}</span>
          <span id="intelligence-map-description">{t.mapDescription}</span>
        </figcaption>
        <div className="intelligence-foundation" aria-hidden="true">
          <Image
            className="intelligence-foundation-image"
            src="/images/intelligence-knowledge-foundation-v1.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 1100px) 100vw, 54vw"
          />
        </div>

        <svg className="intelligence-flow-layer" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
          {domains.map((domain, index) => {
            const point = domainPoints[domain.id];
            return (
              <g key={domain.id}>
                <path
                  className={`intelligence-flow ${activeId === domain.id ? "is-active" : ""} ${index % 3 === 2 ? "is-secondary" : ""}`}
                  d={`M ${point.x} ${point.y} Q ${(point.x + 50) / 2} ${(point.y + 56) / 2} 50 56`}
                />
                <circle className={`intelligence-packet ${activeId === domain.id ? "is-active" : ""}`} cx={point.x} cy={point.y} r=".65" />
              </g>
            );
          })}
        </svg>

        <div className="intelligence-domain-nodes">
          {domains.map((domain) => {
            const point = domainPoints[domain.id];
            const active = activeId === domain.id;
            return (
              <button
                key={domain.id}
                type="button"
                className={`intelligence-domain-node label-${point.label} ${active ? "is-active" : ""} ${activeId && !active ? "is-dimmed" : ""}`}
                style={pointStyle(point)}
                aria-pressed={selectedId === domain.id}
                aria-label={`${String(domain.number).padStart(2, "0")} ${domain.name}. ${t.selectPreview}`}
                title={`${domain.name} — ${domain.status}`}
                onClick={() => chooseDomain(domain.id)}
                onPointerEnter={() => setPreviewId(domain.id)}
                onPointerLeave={() => setPreviewId(null)}
                onFocus={() => setPreviewId(domain.id)}
                onBlur={() => setPreviewId(null)}
              >
                <i>{String(domain.number).padStart(2, "0")}</i><span>{domain.name}</span>
              </button>
            );
          })}

          <button
            type="button"
            className={`intelligence-core-node ${activeId ? "has-domain" : "is-active"}`}
            aria-label={t.coreAria}
            onClick={() => setSelectedId(null)}
          >
            <b>REOS</b><span>{t.coreLabel}</span><small>{t.coreSub}</small>
          </button>
        </div>
      </figure>

      <div className="intelligence-mobile-domains" aria-label={t.mobileAria}>
        <button type="button" className="intelligence-mobile-core" onClick={() => setSelectedId(null)}>
          <b>REOS {t.coreLabel}</b><span>{t.coreSub}</span>
        </button>
        <div>
          {domains.map((domain) => (
            <button key={domain.id} type="button" aria-pressed={selectedId === domain.id} onClick={() => chooseDomain(domain.id)}>
              <i>{String(domain.number).padStart(2, "0")}</i><span>{domain.name}</span>
            </button>
          ))}
        </div>
      </div>

      <aside className={`intelligence-hero-preview ${activeDomain ? "has-selection" : ""}`} aria-live="polite">
        {activeDomain ? (
          <>
            <small>{t.domainPrefix} {String(activeDomain.number).padStart(2, "0")} · {activeDomain.status}</small>
            <h2>{activeDomain.name}</h2>
            <p>{activeDomain.description}</p>
            {activeDomain.href
              ? <Link className="text-link" href={activeDomain.href}>{t.explore} {activeDomain.short} ↗</Link>
              : <span className="intelligence-preview-prompt">{t.unpublished}</span>}
          </>
        ) : (
          <>
            <small>REOS {t.coreLabel}</small>
            <h2>{t.defaultTitle}</h2>
            <p>{t.defaultDescription}</p>
            <span className="intelligence-preview-prompt">{t.prompt}</span>
          </>
        )}
      </aside>
      <p className="sr-only" aria-live="polite">{activeDomain ? `${activeDomain.name} ${t.opened}` : t.allShown}</p>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";

export type IntelligenceDomain = {
  id: string;
  number: number;
  name: string;
  short: string;
  description: string;
  status: string;
  href: string;
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

export function IntelligenceHeroMap({ domains }: { domains: IntelligenceDomain[] }) {
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
          <span id="intelligence-map-title">REOS Intelligence knowledge map</span>
          <span id="intelligence-map-description">Six knowledge domains connect to a central REOS Intelligence layer. Select a domain to preview its purpose and open the relevant information.</span>
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
                aria-label={`${String(domain.number).padStart(2, "0")} ${domain.name}. Select to preview intelligence domain.`}
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
            aria-label="REOS Intelligence. Show all six knowledge domains."
            onClick={() => setSelectedId(null)}
          >
            <b>REOS</b><span>INTELLIGENCE</span><small>CONNECTED KNOWLEDGE LAYER</small>
          </button>
        </div>
      </figure>

      <div className="intelligence-mobile-domains" aria-label="Six REOS Intelligence domains">
        <button type="button" className="intelligence-mobile-core" onClick={() => setSelectedId(null)}>
          <b>REOS INTELLIGENCE</b><span>Connected knowledge layer</span>
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
            <small>INTELLIGENCE DOMAIN {String(activeDomain.number).padStart(2, "0")} · {activeDomain.status}</small>
            <h2>{activeDomain.name}</h2>
            <p>{activeDomain.description}</p>
            <Link className="text-link" href={activeDomain.href}>Explore {activeDomain.short} ↗</Link>
          </>
        ) : (
          <>
            <small>REOS INTELLIGENCE</small>
            <h2>Knowledge, connected to context.</h2>
            <p>Guides, regulations, processes, authority information, definitions and the knowledge graph form one evidence-led knowledge layer for the UAE property ecosystem.</p>
            <span className="intelligence-preview-prompt">Select a knowledge domain to explore it.</span>
          </>
        )}
      </aside>
      <p className="sr-only" aria-live="polite">{activeDomain ? `${activeDomain.name} preview opened.` : "All six intelligence domains shown."}</p>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";

export type JourneyHeroStage = {
  id: string;
  number: string;
  name: string;
  track: string;
  summary: string;
  stakeholders: string[];
  documents: string[];
  runsWith: string[];
  href: string;
};

type VisualPosition = {
  x: number;
  y: number;
  label: "above" | "below" | "left" | "right";
};

const VISUAL_POSITIONS: VisualPosition[] = [
  { x: 9, y: 52, label: "above" },
  { x: 27, y: 52, label: "below" },
  { x: 42, y: 49, label: "above" },
  { x: 59, y: 29, label: "above" },
  { x: 58, y: 67, label: "below" },
  { x: 78, y: 53, label: "below" },
  { x: 92, y: 50, label: "above" },
];

const ROUTE_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [2, 4],
  [3, 5],
  [4, 5],
  [5, 6],
];

function positionStyle(position: VisualPosition) {
  return { "--journey-x": `${position.x}%`, "--journey-y": `${position.y}%` } as CSSProperties;
}

function point(index: number) {
  const position = VISUAL_POSITIONS[index];
  return { x: position.x, y: position.y * 0.5625 };
}

export function PropertyJourneyHero({ stages }: { stages: JourneyHeroStage[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const activeId = selectedId ?? previewId;
  const activeStage = stages.find((stage) => stage.id === activeId) ?? null;

  const preview = (id: string) => {
    if (!selectedId) setPreviewId(id);
  };

  const clearPreview = () => {
    if (!selectedId) setPreviewId(null);
  };

  const select = (id: string) => {
    setSelectedId(id);
    setPreviewId(id);
  };

  return (
    <div className="journey-hero-explorer">
      <div className="journey-hero-map">
        <Image
          className="journey-foundation-image"
          src="/images/property-journey-interactive-foundation-v1.png"
          alt=""
          width={1672}
          height={941}
          sizes="(max-width: 900px) 100vw, 58vw"
          preload
        />

        <svg
          className="journey-route-layer"
          viewBox="0 0 100 56.25"
          role="img"
          aria-labelledby="journey-map-title journey-map-description"
        >
          <title id="journey-map-title">The seven stages of the UAE property journey</title>
          <desc id="journey-map-description">An interactive architectural map of seven connected property stages. Construction and sales run in parallel before the route continues into living and long-term asset growth.</desc>
          {ROUTE_EDGES.map(([from, to]) => {
            const start = point(from);
            const end = point(to);
            const isActive = Boolean(activeId && (stages[from]?.id === activeId || stages[to]?.id === activeId));
            return (
              <line
                key={`${from}-${to}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                className={isActive ? "is-active" : ""}
              />
            );
          })}
        </svg>

        <div className="journey-hero-hotspots" aria-label="Choose a property journey stage">
          {stages.map((stage, index) => {
            const position = VISUAL_POSITIONS[index];
            const isActive = activeId === stage.id;
            const isConcurrent = Boolean(activeStage?.runsWith.includes(stage.name));
            const isDimmed = Boolean(activeId && !isActive && !isConcurrent);
            return (
              <button
                key={stage.id}
                type="button"
                className={`journey-hero-hotspot label-${position.label}${isActive ? " is-active" : ""}${isConcurrent ? " is-concurrent" : ""}${isDimmed ? " is-dimmed" : ""}`}
                data-stage={stage.id}
                data-label-placement={position.label}
                style={positionStyle(position)}
                aria-label={`${stage.number} ${stage.name}. Select to view stage details.`}
                aria-pressed={selectedId === stage.id}
                aria-controls="journey-hero-preview"
                onMouseEnter={() => preview(stage.id)}
                onMouseLeave={clearPreview}
                onFocus={() => preview(stage.id)}
                onBlur={clearPreview}
                onClick={() => select(stage.id)}
              >
                <span className="journey-hero-label">
                  <b>{stage.number}</b>
                  <span>{stage.name}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="journey-mobile-list" aria-label="All seven property journey stages">
        {stages.map((stage) => (
          <button
            key={stage.id}
            type="button"
            className={activeId === stage.id ? "is-active" : ""}
            aria-pressed={selectedId === stage.id}
            aria-controls="journey-hero-preview"
            onClick={() => select(stage.id)}
          >
            <b>{stage.number}</b>
            <span>{stage.name}</span>
          </button>
        ))}
      </div>

      <section id="journey-hero-preview" className={`journey-hero-preview${activeStage ? " has-selection" : ""}`} aria-live="polite">
        {activeStage ? (
          <>
            <header>
              <span>{activeStage.number}</span>
              <div>
                <small>{activeStage.track}</small>
                <h2>{activeStage.name}</h2>
              </div>
              {selectedId ? (
                <button type="button" className="journey-panel-close" onClick={() => { setSelectedId(null); setPreviewId(null); }} aria-label="Close stage details">×</button>
              ) : null}
            </header>
            <p>{activeStage.summary}</p>
            <div className="journey-preview-meta">
              <div>
                <small>WHO IS INVOLVED</small>
                <p>{activeStage.stakeholders.slice(0, 4).join(" · ")}</p>
              </div>
              <div>
                <small>{activeStage.runsWith.length ? "RUNS IN PARALLEL WITH" : "KEY EVIDENCE"}</small>
                <p>{activeStage.runsWith.length ? activeStage.runsWith.join(" · ") : activeStage.documents.slice(0, 2).join(" · ")}</p>
              </div>
            </div>
            <Link href={activeStage.href} className="text-link">Explore stage <span>→</span></Link>
          </>
        ) : (
          <p className="journey-preview-prompt">Hover, focus or select a stage to see what happens, who is involved and which stages genuinely run in parallel.</p>
        )}
      </section>

      <p className="sr-only" aria-live="polite">
        {selectedId && activeStage ? `${activeStage.name} selected. Details are available below the map.` : ""}
      </p>
    </div>
  );
}

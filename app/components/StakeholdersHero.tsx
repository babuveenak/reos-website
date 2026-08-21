"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type CSSProperties } from "react";

export type StakeholderHeroGroup = {
  id: string;
  number: string;
  name: string;
  overview: string;
  participants: string[];
  stages: { number: string; name: string }[];
  href: string;
};

type VisualPosition = {
  x: number;
  y: number;
  label: "above" | "above-left" | "below" | "left" | "right";
};

// Positions describe only the generated, text-free architectural foundation.
// Stakeholder names and route data always come from the canonical groups source.
const VISUAL_POSITIONS: VisualPosition[] = [
  { x: 23, y: 18, label: "above" },
  { x: 40, y: 15, label: "above" },
  { x: 57, y: 14, label: "above" },
  { x: 74, y: 18, label: "above" },
  { x: 86, y: 40, label: "above" },
  { x: 82, y: 58, label: "below" },
  { x: 78, y: 83, label: "below" },
  { x: 63, y: 83, label: "below" },
  { x: 47, y: 83, label: "below" },
  { x: 29, y: 82, label: "below" },
  { x: 18, y: 62, label: "above-left" },
  { x: 14, y: 41, label: "above" },
];

function positionStyle(position: VisualPosition) {
  return { "--hotspot-x": `${position.x}%`, "--hotspot-y": `${position.y}%` } as CSSProperties;
}

export function StakeholdersHero({ groups }: { groups: StakeholderHeroGroup[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const activeId = selectedId ?? previewId;
  const activeGroup = groups.find((group) => group.id === activeId) ?? null;

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
    <div className="stakeholders-explorer">
      <div className="stakeholder-map-frame">
        <Image
          className="stakeholder-district-image"
          src="/images/stakeholders-connected-district-v2.png"
          alt=""
          width={1658}
          height={949}
          sizes="(max-width: 900px) 100vw, 58vw"
          preload
        />

        <svg
          className="stakeholder-connection-layer"
          viewBox="0 0 100 56.25"
          role="img"
          aria-labelledby="stakeholder-map-title stakeholder-map-description"
        >
          <title id="stakeholder-map-title">The 12 UAE property stakeholder groups</title>
          <desc id="stakeholder-map-description">An interactive overview of the 12 Stakeholder Groups participating across the UAE Property Journey, presented as connected architectural environments.</desc>
          {groups.map((group, index) => {
            const position = VISUAL_POSITIONS[index];
            return (
              <line
                key={group.id}
                x1={position.x}
                y1={position.y * 0.5625}
                x2="50"
                y2="28.125"
                className={activeId === group.id ? "is-active" : ""}
              />
            );
          })}
        </svg>

        <div className="stakeholder-center-label" role="note" aria-label="REOS connects all 12 stakeholder groups">
          <b>REOS</b>
          <span>OPERATING SYSTEM</span>
        </div>

        <div className="stakeholder-hotspots" aria-label="Choose a stakeholder group">
          {groups.map((group, index) => {
            const position = VISUAL_POSITIONS[index];
            const isActive = activeId === group.id;
            const isDimmed = Boolean(activeId && !isActive);
            return (
              <button
                key={group.id}
                type="button"
                className={`stakeholder-hotspot label-${position.label}${isActive ? " is-active" : ""}${isDimmed ? " is-dimmed" : ""}`}
                data-group={group.id}
                data-ring-position={index + 1}
                data-label-placement={position.label}
                style={positionStyle(position)}
                aria-label={`${group.number} ${group.name}. Select to view details.`}
                aria-pressed={selectedId === group.id}
                aria-controls="stakeholder-preview-panel"
                onMouseEnter={() => preview(group.id)}
                onMouseLeave={clearPreview}
                onFocus={() => preview(group.id)}
                onBlur={clearPreview}
                onClick={() => select(group.id)}
              >
                <span className="stakeholder-label">
                  <b>{group.number}</b>
                  <span>{group.name}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="stakeholders-mobile-list" aria-label="All 12 stakeholder groups">
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            className={activeId === group.id ? "is-active" : ""}
            aria-pressed={selectedId === group.id}
            aria-controls="stakeholder-preview-panel"
            onClick={() => select(group.id)}
          >
            <b>{group.number}</b>
            <span>{group.name}</span>
          </button>
        ))}
      </div>

      <section id="stakeholder-preview-panel" className={`stakeholder-preview-panel${activeGroup ? " has-selection" : ""}`} aria-live="polite">
        {activeGroup ? (
          <>
            <header>
              <span>{activeGroup.number}</span>
              <div>
                <small>STAKEHOLDER GROUP</small>
                <h2>{activeGroup.name}</h2>
              </div>
              {selectedId ? (
                <button type="button" className="stakeholder-panel-close" onClick={() => { setSelectedId(null); setPreviewId(null); }} aria-label="Close stakeholder details">×</button>
              ) : null}
            </header>
            <p>{activeGroup.overview}</p>
            <div className="stakeholder-preview-meta">
              <div>
                <small>KEY PARTICIPANTS</small>
                <p>{activeGroup.participants.slice(0, 3).join(" · ")}</p>
              </div>
              <div>
                <small>PROPERTY JOURNEY</small>
                <p>{activeGroup.stages.map((stage) => `${stage.number} ${stage.name}`).join(" · ")}</p>
              </div>
            </div>
            <Link href={activeGroup.href} className="text-link">Explore stakeholder <span>→</span></Link>
          </>
        ) : (
          <p className="stakeholder-preview-prompt">Hover, focus or select any group to see who they are, what they control and where they enter the property journey.</p>
        )}
      </section>

      <p className="sr-only" aria-live="polite">
        {selectedId && activeGroup ? `${activeGroup.name} selected. Details are available below the map.` : ""}
      </p>
    </div>
  );
}

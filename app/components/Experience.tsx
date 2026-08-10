"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ecosystemById, ecosystems, lifecycleStages, stakeholderById, stakeholders } from "../data/reos";
import { StatusTag } from "./SiteShell";

export function EcosystemOrbit({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState("developers");
  const ecosystem = ecosystemById[active];
  const stakeholder = stakeholderById[ecosystem.stakeholderIds[0]];

  return (
    <div className={`orbit-experience ${compact ? "compact" : ""}`}>
      <div className="orbit-map" role="group" aria-label="Eight stakeholder ecosystems surrounding REOS">
        <div className="orbit-rings" aria-hidden="true"><i /><i /></div>
        <div className="orbit-core"><span>REOS</span><small>CONNECTING FABRIC</small></div>
        {ecosystems.map((item, index) => (
          <button key={item.id} className={`orbit-node node-${index + 1} ${active === item.id ? "active" : ""}`} onClick={() => setActive(item.id)} aria-pressed={active === item.id}>
            <b>{String(index + 1).padStart(2, "0")}</b><span>{item.short}</span>
          </button>
        ))}
      </div>
      <aside className="orbit-detail" aria-live="polite">
        <span className="index-label">ECOSYSTEM {String(ecosystems.findIndex((item) => item.id === active) + 1).padStart(2, "0")}</span>
        <h3>{ecosystem.name}</h3>
        <p>{ecosystem.description}</p>
        <div className="detail-rule" />
        <small>Representative journey</small>
        <strong>{stakeholder.name}</strong>
        <p>{stakeholder.identity}</p>
        <Link className="text-link" href={`/stakeholders/${stakeholder.id}`}>Open stakeholder journey <span>→</span></Link>
      </aside>
    </div>
  );
}

export function LifecycleExplorer({ initialStage }: { initialStage?: string }) {
  const [phase, setPhase] = useState<string>("All");
  const [active, setActive] = useState(initialStage ?? "authority-approvals");
  const [view, setView] = useState<"stage" | "ecosystem">("stage");
  const filtered = useMemo(() => lifecycleStages.filter((stage) => phase === "All" || stage.phase === phase), [phase]);
  const stage = lifecycleStages.find((item) => item.id === active) ?? lifecycleStages[0];

  return (
    <div className="lifecycle-explorer">
      <div className="explorer-toolbar">
        <div className="segmented" aria-label="Lifecycle view">
          <button className={view === "stage" ? "active" : ""} onClick={() => setView("stage")}>Stage view</button>
          <button className={view === "ecosystem" ? "active" : ""} onClick={() => setView("ecosystem")}>Ecosystem view</button>
        </div>
        <div className="phase-filter" aria-label="Filter lifecycle by phase">
          {["All", "Originate", "Deliver", "Own", "Evolve"].map((item) => <button key={item} className={phase === item ? "active" : ""} onClick={() => setPhase(item)}>{item}</button>)}
        </div>
      </div>
      <div className="stage-rail" role="list" aria-label="24-stage property lifecycle">
        {filtered.map((item) => (
          <button key={item.id} className={item.id === stage.id ? "active" : ""} onClick={() => setActive(item.id)}>
            <b>{String(item.number).padStart(2, "0")}</b><span>{item.name}</span><i aria-hidden="true" />
          </button>
        ))}
      </div>
      <div className="stage-focus">
        <div className="stage-number">{String(stage.number).padStart(2, "0")}</div>
        <div>
          <span className="eyebrow">{stage.phase} · PROPERTY LIFECYCLE</span>
          <h3>{stage.name}</h3>
          <p>{stage.summary}</p>
          <StatusTag status={stage.status} />
        </div>
        <div className="focus-list">
          <span>{view === "stage" ? "Who participates" : "Ecosystems in this stage"}</span>
          {(view === "stage" ? stage.stakeholderIds.map((id) => stakeholderById[id]?.name) : stage.ecosystemIds.map((id) => ecosystemById[id]?.name)).filter(Boolean).map((name) => <b key={name}>{name}</b>)}
          <Link className="text-link" href={`/lifecycle/${stage.id}`}>Explore this stage <span>→</span></Link>
        </div>
      </div>
    </div>
  );
}

export function DualEntry() {
  const [mode, setMode] = useState<"role" | "stage">("role");
  return (
    <div className="dual-entry">
      <div className="dual-tabs" role="tablist" aria-label="Choose how to enter the REOS knowledge model">
        <button role="tab" aria-selected={mode === "role"} className={mode === "role" ? "active" : ""} onClick={() => setMode("role")}>I am a…</button>
        <button role="tab" aria-selected={mode === "stage"} className={mode === "stage" ? "active" : ""} onClick={() => setMode("stage")}>I am at…</button>
      </div>
      <div className="dual-options">
        {mode === "role" ? stakeholders.map((item) => <Link key={item.id} href={`/stakeholders/${item.id}`}><span>{item.name}</span><i>View journey →</i></Link>) : lifecycleStages.map((item) => <Link key={item.id} href={`/lifecycle/${item.id}`}><b>{String(item.number).padStart(2, "0")}</b><span>{item.name}</span></Link>)}
      </div>
    </div>
  );
}

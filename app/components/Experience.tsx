"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ecosystemById, lifecycleStages, stakeholderById } from "../data/reos";
import { StatusTag } from "./SiteShell";

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

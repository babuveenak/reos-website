"use client";

import Link from "next/link";
import { useState } from "react";
import { lifecycleStages } from "../data/reos";

type Phase = "Originate" | "Deliver" | "Own" | "Evolve";

const phases: { id: Phase; verb: string; copy: string }[] = [
  { id: "Originate", verb: "Originate", copy: "Land, feasibility, the development entity, approvals, project registration and the capital structure that carries them." },
  { id: "Deliver", verb: "Deliver", copy: "Procurement, construction and inspection — running alongside sales, escrow and customer onboarding, not after them." },
  { id: "Own", verb: "Own", copy: "Handover, defects liability, title, utilities and the move from project delivery into occupied property." },
  { id: "Evolve", verb: "Evolve", copy: "Leasing, ownership operations, resale and eventual succession or exit across the life of the asset." },
];

/**
 * Section 04. The homepage flow and the 24 stage pages are driven by the same
 * data, so the narrative and the deep content cannot drift apart.
 */
export function PhaseFlow() {
  const [active, setActive] = useState<Phase>("Originate");
  const stages = lifecycleStages.filter((stage) => stage.phase === active);
  const current = phases.find((p) => p.id === active)!;

  return (
    <div className="phase-flow">
      <div className="flow-track" role="tablist" aria-label="Property development phases">
        {phases.map((phase, index) => {
          const count = lifecycleStages.filter((s) => s.phase === phase.id).length;
          return (
            <button
              key={phase.id}
              role="tab"
              aria-selected={active === phase.id}
              className={active === phase.id ? "is-active" : ""}
              onClick={() => setActive(phase.id)}
            >
              <i>{String(index + 1).padStart(2, "0")}</i>
              <b>{phase.verb}</b>
              <small>{count} stages</small>
            </button>
          );
        })}
      </div>

      <div className="flow-detail">
        <p className="flow-copy">{current.copy}</p>
        <div className="flow-stages">
          {stages.map((stage) => (
            <Link key={stage.id} href={`/lifecycle/${stage.id}`}>
              <i>{String(stage.number).padStart(2, "0")}</i>
              <span>{stage.name}</span>
            </Link>
          ))}
        </div>
        <Link className="text-link" href="/lifecycle">Open the full 24-stage lifecycle <span>→</span></Link>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { currentStateItems } from "../data/transformation";

function resultFor(count: number) {
  if (count === 0) return "Select the conditions that reflect the current operating environment.";
  if (count <= 3) return "Some operating friction is visible. A focused workflow review may help clarify ownership, evidence and handoffs.";
  if (count <= 7) return "The selected conditions affect multiple operating controls. A cross-functional workflow evaluation may be appropriate.";
  return "The selected conditions indicate a broad coordination challenge across the operating model. A scoped REOS evaluation can examine the relevant workflow, stakeholders and evidence boundaries.";
}

export function ExecutiveSelfAssessment({ evaluationHref }: { evaluationHref: string }) {
  const [selected, setSelected] = useState<string[]>([]);
  const result = resultFor(selected.length);

  function toggle(title: string) {
    setSelected((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);
  }

  return (
    <section className="executive-self-assessment" aria-labelledby="self-assessment-title">
      <div className="self-assessment-intro">
        <span className="eyebrow">OPTIONAL EXECUTIVE SELF-REFLECTION</span>
        <h3 id="self-assessment-title">How much of this operating model sounds familiar?</h3>
        <p>Select any conditions that apply. This private page-session reflection is not an audit, diagnostic, benchmark or professional assessment. Selections are not stored or transmitted.</p>
      </div>
      <fieldset>
        <legend className="visually-hidden">Select familiar current operating conditions</legend>
        {currentStateItems.map(([title], index) => {
          const checked = selected.includes(title);
          return <label key={title} className={checked ? "is-selected" : ""}><input type="checkbox" checked={checked} onChange={() => toggle(title)} /><span><i>{String(index + 1).padStart(2, "0")}</i><b>{title}</b></span><strong aria-hidden="true">{checked ? "✓" : "+"}</strong></label>;
        })}
      </fieldset>
      <div className="self-assessment-result">
        <div><small>YOUR PRIVATE SELECTION</small><b>{selected.length} of {currentStateItems.length} conditions selected</b></div>
        <p aria-live="polite" aria-atomic="true">{result}</p>
        {selected.length > 0 ? <button type="button" onClick={() => setSelected([])}>Reset selections</button> : null}
      </div>
      <div className="self-assessment-actions">
        <Link className="button gold" href={evaluationHref}>Request a scoped evaluation <span>↗</span></Link>
        <Link className="button ghost" href="#reos-operating-model">See how REOS connects the work <span>↑</span></Link>
      </div>
    </section>
  );
}

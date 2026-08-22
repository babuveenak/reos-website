"use client";

import { useState } from "react";
import type { TransformationStakeholder } from "../data/transformation";

export function StakeholderValueAccordion({ stakeholders }: { stakeholders: TransformationStakeholder[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return <div className="transformation-stakeholder-grid">
    {stakeholders.map((stakeholder, index) => {
      const open = openIndex === index;
      const panelId = `stakeholder-value-${index}`;
      return <article key={stakeholder.name} className={open ? "is-open" : ""}>
        <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setOpenIndex(open ? null : index)}>
          <span>{String(index + 1).padStart(2, "0")}</span><b>{stakeholder.name}</b><i aria-hidden="true">+</i>
        </button>
        <dl id={panelId} hidden={!open}>
          <div><dt>Current pain</dt><dd>{stakeholder.currentPain}</dd></div>
          <div><dt>Desired outcome</dt><dd>{stakeholder.desiredOutcome}</dd></div>
          <div><dt>How REOS helps</dt><dd>{stakeholder.reosHelp}</dd></div>
          <div><dt>Why this matters</dt><dd>{stakeholder.whyThisMatters}</dd></div>
        </dl>
      </article>;
    })}
  </div>;
}

"use client";

import { useState } from "react";

const layers = [
  { number: "01", name: "Property Journey", copy: "Defines when activity occurs across the seven approved lifecycle stages." },
  { number: "02", name: "Stakeholders", copy: "Identifies who participates, what each group contributes and where responsibility changes hands." },
  { number: "03", name: "Intelligence & evidence", copy: "Connects validated context, requirements and case evidence so the work can be understood." },
  { number: "04", name: "Governed workflow & orchestration", copy: "Coordinates case state, ownership, dependencies, decisions and the next accountable action." },
  { number: "05", name: "Licensed REOS products", copy: "Apply the governed operating model to defined workflows such as Title Deed Automation and NOC Automation." },
  { number: "06", name: "Operational outcomes", copy: "Make accountability, readiness, transparency and decision history easier to oversee." },
  { number: "07", name: "Official systems & authorized decisions", copy: "Receive authoritative submissions and decisions without being replaced by REOS." },
] as const;

export function OperatingModelExplorer() {
  const [selected, setSelected] = useState(0);
  const layer = layers[selected];

  return (
    <div className="operating-model-explorer" id="reos-operating-model">
      <header>
        <span className="eyebrow">ONE CONNECTED EXECUTIVE VIEW</span>
        <h3>How the approved REOS model works together.</h3>
        <p>Select a layer to see its place in the operating architecture. The sequence remains understandable without motion.</p>
      </header>
      <div className="operating-model-layout">
        <div className="operating-model-layers" aria-label="REOS operating-model layers">
          {layers.map((item, index) => (
            <button key={item.name} type="button" aria-pressed={selected === index} className={selected === index ? "is-selected" : ""} onClick={() => setSelected(index)}>
              <span>{item.number}</span><b>{item.name}</b><i aria-hidden="true">→</i>
            </button>
          ))}
        </div>
        <section className="operating-model-detail" aria-live="polite" aria-atomic="true">
          <small>LAYER {layer.number}</small><h4>{layer.name}</h4><p>{layer.copy}</p>
          <div><b>Connected through REOS</b><span>Understand → Map → Prepare → Execute → Govern</span></div>
        </section>
      </div>
      <p className="operating-model-boundary"><b>Authority boundary:</b> REOS coordinates the operational work. Authorized people and official systems retain their required authority.</p>
    </div>
  );
}

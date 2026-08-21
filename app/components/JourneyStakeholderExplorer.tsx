"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { groups } from "../data/ecosystem";
import { stages } from "../data/journey";
import {
  approvedRelationships,
  relationshipApprovals,
  relationshipDocuments,
  relationshipFor,
  relationshipIntelligence,
  relationshipLevelDescriptions,
  relationshipLevelLabels,
  relationshipProcesses,
  relationshipReferences,
  relationshipSystems,
  type JourneyStakeholderRelationship,
  type RelationshipLevel,
} from "../data/relationships";
import { type ExplorerMode, useEcosystemInteraction } from "./EcosystemInteractionContext";

const modes: { id: ExplorerMode; label: string; description: string }[] = [
  { id: "journey", label: "Journey View", description: "Choose a stage, then see every stakeholder connected to it." },
  { id: "stakeholder", label: "Stakeholder View", description: "Choose a stakeholder, then see every stage where that group participates." },
  { id: "map", label: "Full Map", description: "Scan all 84 possible intersections and open any active relationship." },
];

const levels = Object.keys(relationshipLevelLabels) as RelationshipLevel[];

function StakeholderGlyph({ index }: { index: number }) {
  const variant = index % 4;
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      {variant === 0 && <><circle cx="16" cy="9" r="4" /><path d="M7 26c1-7 4-10 9-10s8 3 9 10" /></>}
      {variant === 1 && <><path d="M6 26h20M9 26V12h14v14M13 12V7h6v5M13 17h2m3 0h2m-7 4h2m3 0h2" /></>}
      {variant === 2 && <><path d="M5 25h22M8 25V14l8-7 8 7v11M13 25v-6h6v6" /><circle cx="16" cy="13" r="2" /></>}
      {variant === 3 && <><circle cx="10" cy="12" r="4" /><circle cx="22" cy="12" r="4" /><path d="M3 26c.5-6 3-9 7-9 3 0 5 2 6 5 1-3 3-5 6-5 4 0 6.5 3 7 9" /></>}
    </svg>
  );
}

function LevelMark({ level }: { level: RelationshipLevel }) {
  return <span className={`relationship-level level-${level}`}>{relationshipLevelLabels[level]}</span>;
}

function RelationshipPanel({
  relationship,
  pathPrefix,
  onClose,
}: {
  relationship: JourneyStakeholderRelationship;
  pathPrefix: string;
  onClose: () => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const stage = stages.find((item) => item.id === relationship.stageId)!;
  const stakeholder = groups.find((item) => item.id === relationship.stakeholderId)!;
  const processes = relationshipReferences(relationship.processIds, relationshipProcesses);
  const documents = relationshipReferences(relationship.documentIds, relationshipDocuments);
  const approvals = relationshipReferences(relationship.approvalIds, relationshipApprovals);
  const systems = relationshipReferences(relationship.systemIds, relationshipSystems);
  const intelligence = relationshipReferences(relationship.intelligenceContentIds, relationshipIntelligence);
  const dependencies = relationship.dependencyStakeholderIds
    .map((id) => groups.find((group) => group.id === id))
    .filter(Boolean) as typeof groups;

  useEffect(() => {
    headingRef.current?.focus();
  }, [relationship.id]);

  const L = (path: string) => `${pathPrefix}${path}`;

  return (
    <aside className="relationship-panel" aria-labelledby="relationship-panel-title">
      <button className="relationship-panel-close" type="button" onClick={onClose} aria-label="Close relationship preview">×</button>
      <span className="eyebrow">RELATIONSHIP PREVIEW</span>
      <h3 id="relationship-panel-title" ref={headingRef} tabIndex={-1}>
        {stakeholder.name} <span>in</span> {stage.name}
      </h3>
      <LevelMark level={relationship.relationshipLevel} />
      <p className="relationship-summary">{relationship.summary}</p>

      <div className="relationship-panel-grid">
        <section>
          <h4>Role in this stage</h4>
          <p>{relationship.role}</p>
        </section>
        <section>
          <h4>Key responsibilities</h4>
          <ul>{relationship.responsibilities.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section>
          <h4>Processes involved</h4>
          <ul>{processes.slice(0, 4).map((item) => <li key={item.id}>{item.label}</li>)}</ul>
        </section>
      </div>

      {(documents.length > 0 || approvals.length > 0 || systems.length > 0 || dependencies.length > 0 || intelligence.length > 0) && (
        <details className="relationship-more">
          <summary>Documents, approvals and dependencies</summary>
          <div className="relationship-more-grid">
            {documents.length > 0 && <section><h4>Documents</h4><ul>{documents.map((item) => <li key={item.id}>{item.label}</li>)}</ul></section>}
            {approvals.length > 0 && <section><h4>Approvals</h4><ul>{approvals.map((item) => <li key={item.id}>{item.label}</li>)}</ul></section>}
            {systems.length > 0 && <section><h4>Systems and portals</h4><ul>{systems.map((item) => <li key={item.id}>{item.label}</li>)}</ul></section>}
            {dependencies.length > 0 && <section><h4>Related stakeholders</h4><ul>{dependencies.map((item) => <li key={item.id}><Link href={L(`/stakeholders/${item.id}`)}>{item.name}</Link></li>)}</ul></section>}
            {intelligence.length > 0 && <section><h4>Relevant intelligence</h4><ul>{intelligence.map((item) => <li key={item.id}><Link href={L(item.href!)}>{item.label}</Link></li>)}</ul></section>}
          </div>
        </details>
      )}

      <div className="relationship-actions">
        <Link className="button gold" href={L(relationship.detailRoute)}>Explore this connection <span>↗</span></Link>
        <Link className="text-link" href={L(`/property-journey/${stage.id}`)}>Open stage</Link>
        <Link className="text-link" href={L(`/stakeholders/${stakeholder.id}`)}>Open stakeholder</Link>
      </div>
    </aside>
  );
}

export function JourneyStakeholderExplorer({ pathPrefix = "" }: { pathPrefix?: string }) {
  const {
    mode,
    ready,
    selectedStageId,
    selectedStakeholderId,
    setMode,
    setSelectedStageId,
    setSelectedStakeholderId,
    selectRelationship,
    clearSelection,
  } = useEcosystemInteraction();
  const [search, setSearch] = useState("");
  const [enabledLevels, setEnabledLevels] = useState<RelationshipLevel[]>(levels);
  const [shareMessage, setShareMessage] = useState("");

  const activeRelationship = selectedStageId && selectedStakeholderId
    ? relationshipFor(selectedStageId, selectedStakeholderId)
    : undefined;
  const normalizedSearch = search.trim().toLowerCase();
  const matchesSearch = (value: string) => !normalizedSearch || value.toLowerCase().includes(normalizedSearch);
  const visibleRelationships = useMemo(
    () => approvedRelationships.filter((relationship) => enabledLevels.includes(relationship.relationshipLevel)),
    [enabledLevels],
  );
  const visibleRelationshipFor = (stageId: string, stakeholderId: string) =>
    visibleRelationships.find((relationship) => relationship.stageId === stageId && relationship.stakeholderId === stakeholderId);
  const selectedStage = stages.find((stage) => stage.id === selectedStageId);
  const selectedStakeholder = groups.find((group) => group.id === selectedStakeholderId);
  const matchingStages = normalizedSearch ? stages.filter((stage) => matchesSearch(stage.name)) : stages;
  const matchingStakeholders = normalizedSearch ? groups.filter((group) => matchesSearch(group.name)) : groups;
  const shownStages = matchingStages.length > 0 ? matchingStages : stages;
  const shownStakeholders = matchingStakeholders.length > 0 ? matchingStakeholders : groups;

  const chooseStage = (stageId: string) => {
    setSelectedStageId((current) => current === stageId ? null : stageId);
    if (selectedStakeholderId && !visibleRelationshipFor(stageId, selectedStakeholderId)) setSelectedStakeholderId(null);
  };
  const chooseStakeholder = (stakeholderId: string) => {
    setSelectedStakeholderId((current) => current === stakeholderId ? null : stakeholderId);
    if (selectedStageId && !visibleRelationshipFor(selectedStageId, stakeholderId)) setSelectedStageId(null);
  };
  const chooseRelationship = (relationship: JourneyStakeholderRelationship) => {
    selectRelationship(relationship.stageId, relationship.stakeholderId);
  };
  const reset = () => {
    clearSelection();
    setSearch("");
    setEnabledLevels(levels);
    setShareMessage("");
  };
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage("View link copied.");
    } catch {
      setShareMessage("Copy the current URL to share this view.");
    }
  };

  const announcement = activeRelationship
    ? `${selectedStakeholder?.name} selected in ${selectedStage?.name}. Relationship preview opened.`
    : selectedStage
      ? `${selectedStage.name} selected. ${visibleRelationships.filter((item) => item.stageId === selectedStage.id).length} connected stakeholders shown.`
      : selectedStakeholder
        ? `${selectedStakeholder.name} selected. ${visibleRelationships.filter((item) => item.stakeholderId === selectedStakeholder.id).length} connected stages shown.`
        : "No stage or stakeholder selected.";

  return (
    <div className="js-explorer" data-ready={ready ? "true" : "false"}>
      <p className="sr-only" data-mapped-relationships={approvedRelationships.length}>
        Twelve stakeholder groups mapped against seven property journey stages, with {approvedRelationships.length} active relationships.
      </p>
      <div className="explorer-mode-tabs" role="tablist" aria-label="Explorer view">
        {modes.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={mode === item.id}
            aria-controls={`explorer-${item.id}`}
            className={mode === item.id ? "is-active" : ""}
            onClick={() => setMode(item.id)}
          >
            <b>{item.label}</b><span>{item.description}</span>
          </button>
        ))}
      </div>

      <div className="explorer-toolbar">
        <label className="explorer-search">
          <span>Search the map</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Stage or stakeholder" type="search" />
        </label>
        <details className="explorer-filters">
          <summary>Filter relationship level</summary>
          <div>
            {levels.map((level) => (
              <label key={level}>
                <input
                  type="checkbox"
                  checked={enabledLevels.includes(level)}
                  onChange={() => setEnabledLevels((current) => current.includes(level) ? current.filter((item) => item !== level) : [...current, level])}
                />
                <LevelMark level={level} />
              </label>
            ))}
          </div>
        </details>
        <button type="button" className="button ghost" onClick={share}>Share view</button>
        <button type="button" className="button ghost" onClick={reset}>Reset view</button>
        <span className="share-message" aria-live="polite">{shareMessage}</span>
      </div>

      {enabledLevels.length < levels.length && (
        <div className="active-filter-chips" aria-label="Active filters">
          <span>Showing:</span>
          {enabledLevels.map((level) => <button type="button" key={level} onClick={() => setEnabledLevels((current) => current.filter((item) => item !== level))}>{relationshipLevelLabels[level]} ×</button>)}
          <button type="button" onClick={() => setEnabledLevels(levels)}>Clear filters</button>
        </div>
      )}

      <p className="sr-only" aria-live="polite">{announcement}</p>

      {mode === "journey" && (
        <section id="explorer-journey" role="tabpanel" className="explorer-view">
          <header className="explorer-instruction"><span>1</span><div><b>Select a journey stage</b><p>Connected stakeholders will remain in focus.</p></div></header>
          <div className="explorer-stage-rail" aria-label="Seven property journey stages">
            {shownStages.map((stage) => {
              const count = visibleRelationships.filter((item) => item.stageId === stage.id).length;
              return <button key={stage.id} type="button" aria-pressed={stage.id === selectedStageId} className={stage.id === selectedStageId ? "is-selected" : ""} onClick={() => chooseStage(stage.id)}><i>{String(stage.number).padStart(2, "0")}</i><b>{stage.name}</b><small>{count} stakeholder{count === 1 ? "" : "s"}</small></button>;
            })}
          </div>
          <header className="explorer-instruction"><span>2</span><div><b>Select a connected stakeholder</b><p>The relationship panel explains how they participate.</p></div></header>
          <div className="explorer-stakeholder-grid" aria-label="Twelve stakeholder groups">
            {shownStakeholders.map((group) => {
              const relationship = selectedStageId ? visibleRelationshipFor(selectedStageId, group.id) : undefined;
              const connected = !selectedStageId || Boolean(relationship);
              return <button key={group.id} type="button" disabled={!connected} aria-pressed={group.id === selectedStakeholderId} className={`${connected ? "is-connected" : "is-dimmed"} ${group.id === selectedStakeholderId ? "is-selected" : ""}`} onClick={() => relationship ? chooseRelationship(relationship) : chooseStakeholder(group.id)}><StakeholderGlyph index={group.number} /><i>{String(group.number).padStart(2, "0")}</i><b>{group.name}</b>{relationship && <LevelMark level={relationship.relationshipLevel} />}</button>;
            })}
          </div>
        </section>
      )}

      {mode === "stakeholder" && (
        <section id="explorer-stakeholder" role="tabpanel" className="explorer-view">
          <header className="explorer-instruction"><span>1</span><div><b>Select a stakeholder group</b><p>Connected journey stages will remain in focus.</p></div></header>
          <div className="explorer-stakeholder-grid" aria-label="Twelve stakeholder groups">
            {shownStakeholders.map((group) => <button key={group.id} type="button" aria-pressed={group.id === selectedStakeholderId} className={group.id === selectedStakeholderId ? "is-selected" : ""} onClick={() => chooseStakeholder(group.id)}><StakeholderGlyph index={group.number} /><i>{String(group.number).padStart(2, "0")}</i><b>{group.name}</b><small>{visibleRelationships.filter((item) => item.stakeholderId === group.id).length} stages</small></button>)}
          </div>
          <header className="explorer-instruction"><span>2</span><div><b>Select a connected stage</b><p>The relationship panel explains the work at that intersection.</p></div></header>
          <div className="explorer-stage-rail" aria-label="Seven property journey stages">
            {shownStages.map((stage) => {
              const relationship = selectedStakeholderId ? visibleRelationshipFor(stage.id, selectedStakeholderId) : undefined;
              const connected = !selectedStakeholderId || Boolean(relationship);
              return <button key={stage.id} type="button" disabled={!connected} aria-pressed={stage.id === selectedStageId} className={`${connected ? "is-connected" : "is-dimmed"} ${stage.id === selectedStageId ? "is-selected" : ""}`} onClick={() => relationship ? chooseRelationship(relationship) : chooseStage(stage.id)}><i>{String(stage.number).padStart(2, "0")}</i><b>{stage.name}</b>{relationship ? <LevelMark level={relationship.relationshipLevel} /> : <small>{visibleRelationships.filter((item) => item.stageId === stage.id).length} stakeholders</small>}</button>;
            })}
          </div>
        </section>
      )}

      {mode === "map" && (
        <section id="explorer-map" role="tabpanel" className="explorer-view full-map-view">
          <header className="explorer-instruction"><span>↗</span><div><b>Select any active intersection</b><p>The matrix shows participation; the panel explains it.</p></div></header>
          <p className="map-mobile-guide">The full matrix is available on larger screens. On this device, use Journey View or Stakeholder View for the same relationships.</p>
          <div className="relationship-matrix-wrap">
            <table className="relationship-matrix">
              <caption className="sr-only">Twelve stakeholder groups mapped against seven property journey stages</caption>
              <thead><tr><th scope="col">Stakeholder</th>{stages.map((stage) => <th key={stage.id} scope="col"><i>{String(stage.number).padStart(2, "0")}</i><span>{stage.name}</span></th>)}</tr></thead>
              <tbody>{groups.map((group) => <tr key={group.id}><th scope="row"><i>{String(group.number).padStart(2, "0")}</i><span>{group.name}</span></th>{stages.map((stage) => {
                const relationship = visibleRelationshipFor(stage.id, group.id);
                const searchable = matchesSearch(stage.name) || matchesSearch(group.name);
                return <td key={stage.id} className={!searchable ? "is-search-dimmed" : ""}>{relationship ? <button type="button" className={`matrix-connection level-${relationship.relationshipLevel}`} aria-label={`${group.name} in ${stage.name}: ${relationshipLevelLabels[relationship.relationshipLevel]}`} aria-pressed={activeRelationship?.id === relationship.id} onClick={() => chooseRelationship(relationship)}><span className="sr-only">{relationshipLevelLabels[relationship.relationshipLevel]}</span></button> : <span className="matrix-empty" aria-label="No mapped relationship">—</span>}</td>;
              })}</tr>)}</tbody>
            </table>
          </div>
          <div className="relationship-legend" aria-label="Relationship level legend">{levels.map((level) => <div key={level}><span className={`legend-mark level-${level}`} /><b>{relationshipLevelLabels[level]}</b><small>{relationshipLevelDescriptions[level]}</small></div>)}</div>
        </section>
      )}

      {activeRelationship && <RelationshipPanel relationship={activeRelationship} pathPrefix={pathPrefix} onClose={() => setSelectedStakeholderId(null)} />}
    </div>
  );
}

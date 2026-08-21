"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import { groups } from "../data/ecosystem";
import { stages } from "../data/journey";
import {
  approvedRelationships,
  relationshipFor,
  type RelationshipFlowType,
} from "../data/relationships";
import { useEcosystemInteraction } from "./EcosystemInteractionContext";

type FocusedEntity =
  | { kind: "stakeholder"; id: string }
  | { kind: "stage"; id: string }
  | { kind: "core" }
  | null;

type MapPoint = { x: number; y: number; label: "above" | "below" | "left" | "right" };

const stakeholderPoints: Record<string, MapPoint> = {
  "landowners-investors": { x: 50, y: 9, label: "below" },
  developers: { x: 70, y: 14, label: "below" },
  "consultants-designers": { x: 86, y: 27, label: "left" },
  "authorities-regulators": { x: 93, y: 47, label: "left" },
  "utility-providers": { x: 94, y: 70, label: "left" },
  contractors: { x: 88, y: 94, label: "left" },
  "suppliers-vendors": { x: 73, y: 113, label: "above" },
  "brokers-agencies": { x: 50, y: 122, label: "above" },
  "banks-financial": { x: 27, y: 113, label: "above" },
  "property-owners": { x: 12, y: 94, label: "right" },
  "residents-tenants": { x: 6, y: 70, label: "right" },
  "facility-community-operators": { x: 7, y: 47, label: "right" },
};

const stagePoints: Record<string, MapPoint> = {
  "land-vision": { x: 50, y: 38, label: "below" },
  "planning-design": { x: 68, y: 48, label: "left" },
  "authorities-approvals": { x: 73, y: 68, label: "left" },
  "construction-delivery": { x: 62, y: 89, label: "above" },
  "sales-transfer": { x: 38, y: 89, label: "above" },
  "living-operations": { x: 27, y: 68, label: "right" },
  "asset-growth-intelligence": { x: 32, y: 48, label: "right" },
};

const flowLabels: Record<RelationshipFlowType, string> = {
  information: "Information",
  decision: "Decisions",
  document: "Documents",
  approval: "Approvals",
  service: "Services",
  capital: "Capital",
};

const primaryFlow = (flowTypes: RelationshipFlowType[]) =>
  (["approval", "capital", "service", "document", "decision", "information"] as RelationshipFlowType[])
    .find((flow) => flowTypes.includes(flow)) ?? "information";

const stylePoint = (point: MapPoint) => ({
  "--map-x": `${point.x}%`,
  "--map-y": `${(point.y / 132) * 100}%`,
} as CSSProperties);

export function EcosystemHeroMap({ pathPrefix = "" }: { pathPrefix?: string }) {
  const {
    selectedStageId,
    selectedStakeholderId,
    setMode,
    setSelectedStageId,
    setSelectedStakeholderId,
    selectRelationship,
    clearSelection,
    openDetailedMap,
  } = useEcosystemInteraction();
  const [focused, setFocused] = useState<FocusedEntity>(null);
  const [coreSelected, setCoreSelected] = useState(false);

  const selectedRelationship = selectedStageId && selectedStakeholderId
    ? relationshipFor(selectedStageId, selectedStakeholderId)
    : undefined;
  const activeEntity: FocusedEntity = focused ?? (coreSelected
    ? { kind: "core" }
    : selectedRelationship
      ? null
      : selectedStakeholderId
        ? { kind: "stakeholder", id: selectedStakeholderId }
        : selectedStageId
          ? { kind: "stage", id: selectedStageId }
          : { kind: "core" });

  const activeStakeholderId = focused?.kind === "stakeholder" ? focused.id : selectedStakeholderId;
  const activeStageId = focused?.kind === "stage" ? focused.id : selectedStageId;
  const coreActive = activeEntity?.kind === "core";

  const connectedStakeholderIds = useMemo(() => new Set(
    activeStageId ? approvedRelationships.filter((item) => item.stageId === activeStageId).map((item) => item.stakeholderId) : [],
  ), [activeStageId]);
  const connectedStageIds = useMemo(() => new Set(
    activeStakeholderId ? approvedRelationships.filter((item) => item.stakeholderId === activeStakeholderId).map((item) => item.stageId) : [],
  ), [activeStakeholderId]);

  const chooseStakeholder = (stakeholderId: string) => {
    setCoreSelected(false);
    setMode("stakeholder");
    if (selectedStakeholderId === stakeholderId && !selectedStageId) {
      setSelectedStakeholderId(null);
      return;
    }
    if (selectedStageId && relationshipFor(selectedStageId, stakeholderId)) {
      selectRelationship(selectedStageId, stakeholderId);
      return;
    }
    setSelectedStageId(null);
    setSelectedStakeholderId(stakeholderId);
  };

  const chooseStage = (stageId: string) => {
    setCoreSelected(false);
    setMode("journey");
    if (selectedStageId === stageId && !selectedStakeholderId) {
      setSelectedStageId(null);
      return;
    }
    if (selectedStakeholderId && relationshipFor(stageId, selectedStakeholderId)) {
      selectRelationship(stageId, selectedStakeholderId);
      return;
    }
    setSelectedStakeholderId(null);
    setSelectedStageId(stageId);
  };

  const chooseCore = () => {
    clearSelection();
    setCoreSelected(true);
  };

  const focusedStakeholder = activeEntity?.kind === "stakeholder" ? groups.find((item) => item.id === activeEntity.id) : undefined;
  const focusedStage = activeEntity?.kind === "stage" ? stages.find((item) => item.id === activeEntity.id) : undefined;
  const relationship = selectedRelationship && !focused ? selectedRelationship : undefined;
  const relationshipCount = focusedStakeholder
    ? approvedRelationships.filter((item) => item.stakeholderId === focusedStakeholder.id).length
    : focusedStage
      ? approvedRelationships.filter((item) => item.stageId === focusedStage.id).length
      : approvedRelationships.length;

  const announcement = relationship
    ? `${groups.find((item) => item.id === relationship.stakeholderId)?.name} selected in ${stages.find((item) => item.id === relationship.stageId)?.name}.`
    : focusedStakeholder
      ? `${focusedStakeholder.name}: ${relationshipCount} connected journey stages.`
      : focusedStage
        ? `${focusedStage.name}: ${relationshipCount} connected stakeholder groups.`
        : `REOS Core connects ${approvedRelationships.length} mapped relationships.`;

  return (
    <div className="ecosystem-hero-explorer">
      <figure className="ecosystem-orbital-map" aria-labelledby="ecosystem-map-title ecosystem-map-description">
        <figcaption className="sr-only">
          <span id="ecosystem-map-title">REOS Ecosystem Orbital Map</span>
          <span id="ecosystem-map-description">Twelve stakeholder groups orbit seven property journey stages, connected through the REOS Core. Select any node to reveal its mapped relationships.</span>
        </figcaption>
        <div className="ecosystem-arch-foundation" aria-hidden="true">
          <Image
            className="ecosystem-foundation-image"
            src="/images/ecosystem-orbital-foundation-v1.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 1100px) 100vw, 58vw"
          />
        </div>

        <svg className="ecosystem-relationship-layer" viewBox="0 0 100 132" aria-hidden="true" focusable="false">
          {approvedRelationships.map((item) => {
            const stakeholder = stakeholderPoints[item.stakeholderId];
            const stage = stagePoints[item.stageId];
            const exact = selectedRelationship?.id === item.id && !focused;
            const active = coreActive
              || (activeStakeholderId === item.stakeholderId && (!activeStageId || activeStageId === item.stageId))
              || (activeStageId === item.stageId && (!activeStakeholderId || activeStakeholderId === item.stakeholderId));
            const controlX = (stakeholder.x + stage.x + 50) / 3;
            const controlY = (stakeholder.y + stage.y + 66) / 3;
            return (
              <path
                key={item.id}
                className={`ecosystem-flow flow-${primaryFlow(item.flowTypes)} ${active ? "is-active" : ""} ${exact ? "is-exact" : ""}`}
                d={`M ${stakeholder.x} ${stakeholder.y} Q ${controlX} ${controlY} ${stage.x} ${stage.y}`}
              />
            );
          })}
          {stages.map((stage) => {
            const point = stagePoints[stage.id];
            const active = coreActive || activeStageId === stage.id || connectedStageIds.has(stage.id);
            return <path key={`core-${stage.id}`} className={`ecosystem-core-flow ${active ? "is-active" : ""}`} d={`M ${point.x} ${point.y} L 50 66`} />;
          })}
        </svg>

        <div className="ecosystem-orbital-nodes">
          {groups.map((group) => {
            const point = stakeholderPoints[group.id];
            const selected = group.id === selectedStakeholderId;
            const connected = coreActive || !activeStageId || connectedStakeholderIds.has(group.id);
            return (
              <button
                key={group.id}
                type="button"
                className={`ecosystem-stakeholder-node label-${point.label} ${selected ? "is-selected" : ""} ${connected ? "is-connected" : "is-dimmed"}`}
                style={stylePoint(point)}
                aria-pressed={selected}
                aria-label={`${String(group.number).padStart(2, "0")} ${group.name}. Select to explore stakeholder.`}
                title={`${group.name} — ${approvedRelationships.filter((item) => item.stakeholderId === group.id).length} connected stages`}
                onClick={() => chooseStakeholder(group.id)}
                onPointerEnter={() => setFocused({ kind: "stakeholder", id: group.id })}
                onPointerLeave={() => setFocused(null)}
                onFocus={() => setFocused({ kind: "stakeholder", id: group.id })}
                onBlur={() => setFocused(null)}
              >
                <i>{String(group.number).padStart(2, "0")}</i><span>{group.name}</span>
              </button>
            );
          })}

          {stages.map((stage) => {
            const point = stagePoints[stage.id];
            const selected = stage.id === selectedStageId;
            const connected = coreActive || !activeStakeholderId || connectedStageIds.has(stage.id);
            return (
              <button
                key={stage.id}
                type="button"
                className={`ecosystem-stage-node label-${point.label} ${selected ? "is-selected" : ""} ${connected ? "is-connected" : "is-dimmed"}`}
                style={stylePoint(point)}
                aria-pressed={selected}
                aria-label={`${String(stage.number).padStart(2, "0")} ${stage.name}. Select to explore stage.`}
                title={`${stage.name} — ${approvedRelationships.filter((item) => item.stageId === stage.id).length} connected stakeholders`}
                onClick={() => chooseStage(stage.id)}
                onPointerEnter={() => setFocused({ kind: "stage", id: stage.id })}
                onPointerLeave={() => setFocused(null)}
                onFocus={() => setFocused({ kind: "stage", id: stage.id })}
                onBlur={() => setFocused(null)}
              >
                <i>{String(stage.number).padStart(2, "0")}</i><span>{stage.name}</span>
              </button>
            );
          })}

          <button
            type="button"
            className={`ecosystem-core-node ${coreSelected || coreActive ? "is-selected" : ""}`}
            aria-pressed={coreSelected}
            aria-label="REOS Core. Select to show the complete ecosystem."
            onClick={chooseCore}
            onPointerEnter={() => setFocused({ kind: "core" })}
            onPointerLeave={() => setFocused(null)}
            onFocus={() => setFocused({ kind: "core" })}
            onBlur={() => setFocused(null)}
          >
            <b>REOS</b><span>CORE</span><small>ORCHESTRATION + INTELLIGENCE</small>
          </button>
        </div>
      </figure>

      <div className="ecosystem-mobile-selector">
        <button type="button" className="ecosystem-mobile-core" onClick={chooseCore}><b>REOS CORE</b><span>Connects the full property ecosystem</span></button>
        <section aria-labelledby="mobile-stage-heading">
          <h2 id="mobile-stage-heading">7 Property Journey Stages</h2>
          <div>{stages.map((stage) => <button key={stage.id} type="button" aria-pressed={stage.id === selectedStageId} onClick={() => chooseStage(stage.id)}><i>{String(stage.number).padStart(2, "0")}</i><span>{stage.name}</span></button>)}</div>
        </section>
        <section aria-labelledby="mobile-stakeholder-heading">
          <h2 id="mobile-stakeholder-heading">12 Stakeholder Groups</h2>
          <div>{groups.map((group) => <button key={group.id} type="button" aria-pressed={group.id === selectedStakeholderId} onClick={() => chooseStakeholder(group.id)}><i>{String(group.number).padStart(2, "0")}</i><span>{group.name}</span></button>)}</div>
        </section>
      </div>

      <div className="ecosystem-flow-legend" aria-label="Relationship flow legend">
        {(Object.keys(flowLabels) as RelationshipFlowType[]).map((flow) => <span key={flow}><i className={`flow-${flow}`} />{flowLabels[flow]}</span>)}
      </div>

      <aside className="ecosystem-hero-preview" aria-live="polite">
        {relationship ? (
          <>
            <small>CONNECTED RELATIONSHIP</small>
            <h2>{groups.find((item) => item.id === relationship.stakeholderId)?.name} <em>×</em> {stages.find((item) => item.id === relationship.stageId)?.name}</h2>
            <p>{relationship.summary}</p>
            <div className="ecosystem-preview-actions"><Link className="text-link" href={`${pathPrefix}${relationship.detailRoute}`}>Explore this connection ↗</Link><button type="button" className="text-link" onClick={openDetailedMap}>Open detailed map ↓</button></div>
          </>
        ) : focusedStakeholder ? (
          <>
            <small>STAKEHOLDER GROUP {String(focusedStakeholder.number).padStart(2, "0")}</small>
            <h2>{focusedStakeholder.name}</h2>
            <p>{focusedStakeholder.controls}</p>
            <div className="ecosystem-preview-actions"><Link className="text-link" href={`${pathPrefix}/stakeholders/${focusedStakeholder.id}`}>Open stakeholder ↗</Link><button type="button" className="text-link" onClick={openDetailedMap}>Explore {relationshipCount} connections ↓</button></div>
          </>
        ) : focusedStage ? (
          <>
            <small>PROPERTY JOURNEY STAGE {String(focusedStage.number).padStart(2, "0")}</small>
            <h2>{focusedStage.name}</h2>
            <p>{focusedStage.summary}</p>
            <div className="ecosystem-preview-actions"><Link className="text-link" href={`${pathPrefix}/property-journey/${focusedStage.id}`}>Open journey stage ↗</Link><button type="button" className="text-link" onClick={openDetailedMap}>Explore {relationshipCount} connections ↓</button></div>
          </>
        ) : (
          <>
            <small>REOS CORE</small>
            <h2>One operating layer across the lifecycle.</h2>
            <p>REOS coordinates information, decisions, documents, approvals, services and capital across all 12 stakeholder groups and seven journey stages.</p>
            <button type="button" className="text-link" onClick={openDetailedMap}>Explore the detailed map ↓</button>
          </>
        )}
      </aside>
      <p className="sr-only" aria-live="polite">{announcement}</p>
    </div>
  );
}

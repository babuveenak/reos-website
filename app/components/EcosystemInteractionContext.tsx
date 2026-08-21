"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { groups } from "../data/ecosystem";
import { stages } from "../data/journey";

export type ExplorerMode = "journey" | "stakeholder" | "map";

type EcosystemInteractionValue = {
  mode: ExplorerMode;
  ready: boolean;
  selectedStageId: string | null;
  selectedStakeholderId: string | null;
  setMode: Dispatch<SetStateAction<ExplorerMode>>;
  setSelectedStageId: Dispatch<SetStateAction<string | null>>;
  setSelectedStakeholderId: Dispatch<SetStateAction<string | null>>;
  selectRelationship: (stageId: string, stakeholderId: string) => void;
  clearSelection: () => void;
  openDetailedMap: () => void;
};

const EcosystemInteractionContext = createContext<EcosystemInteractionValue | null>(null);
const validModes: ExplorerMode[] = ["journey", "stakeholder", "map"];

export function EcosystemInteractionProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ExplorerMode>("journey");
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [selectedStakeholderId, setSelectedStakeholderId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search);
      const storedMode = window.sessionStorage.getItem("reos-explorer-mode") as ExplorerMode | null;
      const requestedMode = params.get("view") as ExplorerMode | null;
      if (requestedMode && validModes.includes(requestedMode)) setMode(requestedMode);
      else if (storedMode && validModes.includes(storedMode)) setMode(storedMode);

      const stage = params.get("stage");
      const stakeholder = params.get("stakeholder");
      if (stage && stages.some((item) => item.id === stage)) setSelectedStageId(stage);
      if (stakeholder && groups.some((item) => item.id === stakeholder)) setSelectedStakeholderId(stakeholder);
      setReady(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.sessionStorage.setItem("reos-explorer-mode", mode);
    const params = new URLSearchParams();
    params.set("view", mode);
    if (selectedStageId) params.set("stage", selectedStageId);
    if (selectedStakeholderId) params.set("stakeholder", selectedStakeholderId);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }, [mode, ready, selectedStageId, selectedStakeholderId]);

  const clearSelection = useCallback(() => {
    setSelectedStageId(null);
    setSelectedStakeholderId(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") clearSelection();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [clearSelection]);

  const selectRelationship = useCallback((stageId: string, stakeholderId: string) => {
    setSelectedStageId(stageId);
    setSelectedStakeholderId(stakeholderId);
  }, []);

  const openDetailedMap = useCallback(() => {
    document.getElementById("ecosystem-detailed-map")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const value = useMemo(() => ({
    mode,
    ready,
    selectedStageId,
    selectedStakeholderId,
    setMode,
    setSelectedStageId,
    setSelectedStakeholderId,
    selectRelationship,
    clearSelection,
    openDetailedMap,
  }), [clearSelection, mode, openDetailedMap, ready, selectRelationship, selectedStageId, selectedStakeholderId]);

  return <EcosystemInteractionContext.Provider value={value}>{children}</EcosystemInteractionContext.Provider>;
}

export function useEcosystemInteraction() {
  const value = useContext(EcosystemInteractionContext);
  if (!value) throw new Error("useEcosystemInteraction must be used inside EcosystemInteractionProvider");
  return value;
}

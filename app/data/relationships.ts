import { groupById, groups } from "./ecosystem";
import { stageById, stages } from "./journey";
import { stakeholderDetailById } from "./stakeholderDetails";
import { participationFor, type RelationshipLevel } from "./stakeholderParticipation";

/**
 * Canonical Journey × Stakeholder relationship model.
 *
 * The seven stages remain owned by journey.ts and the twelve actor groups by
 * ecosystem.ts. This file only describes the intersections between them. All
 * explorer views, previews and contextual routes consume these records so a
 * relationship can never exist in one view but disappear from another.
 */
export type { RelationshipLevel } from "./stakeholderParticipation";
export type RelationshipEditorialStatus = "approved" | "draft";
export type RelationshipFlowType = "information" | "decision" | "document" | "approval" | "service" | "capital";

export type RelationshipReference = {
  id: string;
  label: string;
  stageId?: string;
  stakeholderId?: string;
  href?: string;
};

export type JourneyStakeholderRelationship = {
  id: string;
  stageId: string;
  stakeholderId: string;
  relationshipLevel: RelationshipLevel;
  summary: string;
  role: string;
  responsibilities: string[];
  activities: string[];
  decisions: string[];
  processIds: string[];
  documentIds: string[];
  approvalIds: string[];
  systemIds: string[];
  dependencyStakeholderIds: string[];
  intelligenceContentIds: string[];
  flowTypes: RelationshipFlowType[];
  direction: "bidirectional";
  detailRoute: string;
  editorialStatus: RelationshipEditorialStatus;
};

export const relationshipLevelLabels: Record<RelationshipLevel, string> = {
  lead: "Lead",
  active: "Active",
  supporting: "Supporting",
  informed: "Informed",
};

export const relationshipLevelDescriptions: Record<RelationshipLevel, string> = {
  lead: "Owns or gates a central outcome in this stage.",
  active: "Performs material work or makes decisions in this stage.",
  supporting: "Provides an input, service or control the stage depends on.",
  informed: "Receives the stage output or must remain aware of its state.",
};

const referenceId = (kind: string, owner: string, index: number) =>
  `${kind}-${owner}-${String(index + 1).padStart(2, "0")}`;

export const relationshipProcesses: RelationshipReference[] = stages.flatMap((stage) =>
  stage.whatHappens.map((label, index) => ({
    id: referenceId("process", stage.id, index),
    label,
    stageId: stage.id,
  })),
);

export const relationshipDocuments: RelationshipReference[] = stages.flatMap((stage) =>
  stage.documents.map((label, index) => ({
    id: referenceId("document", stage.id, index),
    label,
    stageId: stage.id,
  })),
);

const approvalPattern = /approval|permit|certificate|registration|no-objection|NOC/i;
export const relationshipApprovals: RelationshipReference[] = relationshipDocuments
  .filter((document) => approvalPattern.test(document.label))
  .map((document) => ({ ...document, id: document.id.replace("document-", "approval-") }));

export const relationshipSystems: RelationshipReference[] = groups.flatMap((group) => {
  const detail = stakeholderDetailById[group.id];
  if (!detail || detail.status !== "Validated") return [];
  return detail.systemsAndPortals.map((label, index) => ({
    id: referenceId("system", group.id, index),
    label,
    stakeholderId: group.id,
  }));
});

export const relationshipIntelligence: RelationshipReference[] = groups.flatMap((group) => {
  const detail = stakeholderDetailById[group.id];
  if (!detail || detail.status !== "Validated") return [];
  return detail.relevantIntelligence.map((item, index) => ({
    id: referenceId("intelligence", group.id, index),
    label: item.label,
    href: item.href,
    stakeholderId: group.id,
  }));
});

const relationshipNoun: Record<RelationshipLevel, string> = {
  lead: "a lead stakeholder",
  active: "an active stakeholder",
  supporting: "a supporting stakeholder",
  informed: "an informed stakeholder",
};

const capitalStakeholders = new Set(["landowners-investors", "banks-financial"]);
const serviceStakeholders = new Set([
  "consultants-designers",
  "utility-providers",
  "contractors",
  "suppliers-vendors",
  "brokers-agencies",
  "facility-community-operators",
]);

export const journeyStakeholderRelationships: JourneyStakeholderRelationship[] = stages.flatMap((stage) =>
  stage.groupIds.map((stakeholderId) => {
    const stakeholder = groupById[stakeholderId];
    const detail = stakeholderDetailById[stakeholderId];
    const canPublishDetail = detail?.status === "Validated";
    const participation = participationFor(stage.id, stakeholderId);
    const relationshipLevel = participation?.relationshipLevel ?? "active";
    const stageProcessIds = relationshipProcesses
      .filter((item) => item.stageId === stage.id)
      .map((item) => item.id);
    const stageDocumentIds = relationshipDocuments
      .filter((item) => item.stageId === stage.id)
      .map((item) => item.id);
    const stageApprovalIds = relationshipApprovals
      .filter((item) => item.stageId === stage.id)
      .map((item) => item.id);
    const systemIds = canPublishDetail
      ? relationshipSystems.filter((item) => item.stakeholderId === stakeholderId).map((item) => item.id)
      : [];
    const intelligenceContentIds = canPublishDetail
      ? relationshipIntelligence.filter((item) => item.stakeholderId === stakeholderId).map((item) => item.id)
      : [];
    const dependencyStakeholderIds = canPublishDetail
      ? detail.interactions
          .map((interaction) => interaction.groupId)
          .filter((id) => stage.groupIds.includes(id))
      : [];
    const flowTypes: RelationshipFlowType[] = ["information"];
    if (canPublishDetail && detail.keyDecisions.length > 0) flowTypes.push("decision");
    if (stageDocumentIds.length > 0) flowTypes.push("document");
    if (stageApprovalIds.length > 0 || stakeholderId === "authorities-regulators") flowTypes.push("approval");
    if (serviceStakeholders.has(stakeholderId)) flowTypes.push("service");
    if (capitalStakeholders.has(stakeholderId)) flowTypes.push("capital");

    return {
      id: `${stage.id}--${stakeholderId}`,
      stageId: stage.id,
      stakeholderId,
      relationshipLevel,
      summary: participation?.role ?? `${stakeholder.name} is ${relationshipNoun[relationshipLevel]} in ${stage.name}.`,
      role: participation?.role ?? stakeholder.controls,
      responsibilities: canPublishDetail
        ? detail.keyResponsibilities.slice(0, 5)
        : [stakeholder.controls],
      activities: participation?.processSteps ?? stage.whatHappens.slice(0, 4),
      decisions: canPublishDetail ? detail.keyDecisions.slice(0, 4) : [],
      processIds: stageProcessIds,
      documentIds: stageDocumentIds,
      approvalIds: stageApprovalIds,
      systemIds,
      dependencyStakeholderIds,
      intelligenceContentIds,
      flowTypes,
      direction: "bidirectional" as const,
      detailRoute: `/property-journey/${stage.id}/stakeholders/${stakeholderId}`,
      editorialStatus: participation?.publicationState === "withheld" ? "draft" as const : "approved" as const,
    };
  }),
);

export const approvedRelationships = journeyStakeholderRelationships.filter(
  (relationship) => relationship.editorialStatus === "approved",
);

export const relationshipById = Object.fromEntries(
  journeyStakeholderRelationships.map((relationship) => [relationship.id, relationship]),
);

export const relationshipsByStage = (stageId: string) =>
  journeyStakeholderRelationships.filter((relationship) => relationship.stageId === stageId);

export const relationshipsByStakeholder = (stakeholderId: string) =>
  journeyStakeholderRelationships.filter((relationship) => relationship.stakeholderId === stakeholderId);

export const relationshipFor = (stageId: string, stakeholderId: string) =>
  relationshipById[`${stageId}--${stakeholderId}`];

export const relationshipReferences = (
  ids: string[],
  references: RelationshipReference[],
) => ids.map((id) => references.find((reference) => reference.id === id)).filter(Boolean) as RelationshipReference[];

// Fail at import time during development if the mapping drifts away from the
// stage-owned participation lists.
for (const stage of stages) {
  for (const stakeholderId of stage.groupIds) {
    if (!stageById[stage.id] || !groupById[stakeholderId] || !relationshipFor(stage.id, stakeholderId)) {
      throw new Error(`Invalid Journey × Stakeholder relationship: ${stage.id} / ${stakeholderId}`);
    }
  }
}

export type PublicParticipation = "lead" | "participant" | "not-involved";
export type RelationshipLevel = "lead" | "active" | "supporting" | "informed";

export type StakeholderParticipation = {
  stakeholderId: string;
  stageId: string;
  involvement: PublicParticipation;
  relationshipLevel?: RelationshipLevel;
  role?: string;
  reasonNotInvolved?: string;
  evidence: "verified" | "conditional" | "unverified";
};

export const STAGE_IDS = ["land-vision", "planning-design", "authorities-approvals", "construction-delivery", "sales-transfer", "living-operations", "asset-growth-intelligence"] as const;
export const STAKEHOLDER_IDS = ["landowners-investors", "developers", "consultants-designers", "authorities-regulators", "utility-providers", "contractors", "suppliers-vendors", "brokers-agencies", "banks-financial", "property-owners", "residents-tenants", "facility-community-operators"] as const;

const levels: Record<string, Record<string, RelationshipLevel>> = {
  "land-vision": { "landowners-investors": "lead", developers: "lead", "consultants-designers": "supporting", "banks-financial": "supporting" },
  "planning-design": { developers: "lead", "consultants-designers": "lead" },
  "authorities-approvals": { "authorities-regulators": "lead", "utility-providers": "active", developers: "active", "consultants-designers": "active" },
  "construction-delivery": { contractors: "lead", "suppliers-vendors": "active", "consultants-designers": "active", developers: "lead", "banks-financial": "active" },
  "sales-transfer": { "landowners-investors": "active", "brokers-agencies": "active", "property-owners": "active", "authorities-regulators": "lead", "banks-financial": "active", developers: "lead" },
  "living-operations": { "landowners-investors": "active", "property-owners": "active", "residents-tenants": "active", "facility-community-operators": "lead", "utility-providers": "active", developers: "active" },
  "asset-growth-intelligence": { "landowners-investors": "lead", "property-owners": "lead", "banks-financial": "active", "brokers-agencies": "active", "facility-community-operators": "active", "residents-tenants": "informed" },
};

const roleOverrides: Record<string, string> = {
  "land-vision--landowners-investors": "Frames the opportunity, qualifies the ownership route and decides whether capital should be committed.",
  "sales-transfer--landowners-investors": "Participates when buying a ready or off-plan asset, or when registering an exit or other qualifying transfer.",
  "living-operations--landowners-investors": "As owner, receives operating, service-charge and tenancy evidence; execution may sit with an appointed operator.",
  "asset-growth-intelligence--landowners-investors": "Monitors performance and decides whether to hold, refinance, lease, sell, gift or prepare succession.",
};

export const stakeholderParticipation: StakeholderParticipation[] = STAKEHOLDER_IDS.flatMap((stakeholderId) =>
  STAGE_IDS.map((stageId) => {
    const relationshipLevel = levels[stageId]?.[stakeholderId];
    if (!relationshipLevel) {
      return {
        stakeholderId,
        stageId,
        involvement: "not-involved" as const,
        reasonNotInvolved: "No direct participation is currently published for this stakeholder at this stage. Project-specific involvement may still exist.",
        evidence: "unverified" as const,
      };
    }
    return {
      stakeholderId,
      stageId,
      involvement: relationshipLevel === "lead" ? "lead" as const : "participant" as const,
      relationshipLevel,
      role: roleOverrides[`${stageId}--${stakeholderId}`] ?? "A participation relationship is mapped in the current REOS lifecycle model; step-level jurisdiction evidence is being expanded.",
      evidence: "conditional" as const,
    };
  }),
);

export const participationForStakeholder = (stakeholderId: string) => stakeholderParticipation.filter((item) => item.stakeholderId === stakeholderId);
export const participationForStage = (stageId: string) => stakeholderParticipation.filter((item) => item.stageId === stageId);
export const participationFor = (stageId: string, stakeholderId: string) => stakeholderParticipation.find((item) => item.stageId === stageId && item.stakeholderId === stakeholderId);
export const participatingStakeholderIds = (stageId: string) => participationForStage(stageId).filter((item) => item.involvement !== "not-involved").map((item) => item.stakeholderId);

if (stakeholderParticipation.length !== 84) throw new Error(`Expected 84 Journey × Stakeholder participation records; found ${stakeholderParticipation.length}.`);
for (const item of stakeholderParticipation) {
  if (item.involvement === "not-involved" && !item.reasonNotInvolved) throw new Error(`Missing non-participation reason: ${item.stageId} / ${item.stakeholderId}`);
  if (item.involvement !== "not-involved" && (!item.role || !item.relationshipLevel)) throw new Error(`Missing participation role: ${item.stageId} / ${item.stakeholderId}`);
}

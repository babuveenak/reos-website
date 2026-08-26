export type PublicParticipation = "lead" | "participant" | "informed";
export type RelationshipLevel = "lead" | "active" | "supporting" | "informed";

export type StakeholderParticipation = {
  stakeholderId: StakeholderId;
  stageId: StageId;
  involvement: PublicParticipation;
  relationshipLevel: RelationshipLevel;
  role: string;
  evidence: "verified" | "conditional" | "unverified";
};

export const STAGE_IDS = [
  "land-vision",
  "planning-design",
  "authorities-approvals",
  "construction-delivery",
  "sales-transfer",
  "living-operations",
  "asset-growth-intelligence",
] as const;

export const STAKEHOLDER_IDS = [
  "landowners-investors",
  "developers",
  "consultants-designers",
  "authorities-regulators",
  "utility-providers",
  "contractors",
  "suppliers-vendors",
  "brokers-agencies",
  "banks-financial",
  "property-owners",
  "residents-tenants",
  "facility-community-operators",
] as const;

export type StageId = (typeof STAGE_IDS)[number];
export type StakeholderId = (typeof STAKEHOLDER_IDS)[number];

type StakeholderStageRow = {
  levels: readonly RelationshipLevel[];
  roles: readonly string[];
};

/**
 * One explicit relationship for every Journey × Stakeholder intersection.
 *
 * These descriptions explain the stakeholder perspective. They do not assign
 * statutory authority, replace an official process or claim that every member
 * of a group performs the same task on every project.
 */
const rows: Record<StakeholderId, StakeholderStageRow> = {
  "landowners-investors": {
    levels: ["lead", "active", "supporting", "supporting", "active", "active", "lead"],
    roles: [
      "Frames the opportunity, confirms the ownership route and decides whether capital should be committed.",
      "Sets the brief, return limits and budget, then approves material design changes without acting as the designer.",
      "Authorises submissions, funding and responses to material authority conditions while the appointed team executes them.",
      "Monitors drawdown, progress, quality and change, and approves reserved capital decisions without directing site work.",
      "Buys, sells or registers an exit through the applicable ready, off-plan, mortgaged or registry-specific route.",
      "Receives operating, service-charge, tenancy and condition evidence; execution may sit with an appointed operator.",
      "Monitors performance and decides whether to hold, refinance, lease, sell, gift or prepare succession.",
    ],
  },
  developers: {
    levels: ["lead", "lead", "active", "lead", "lead", "active", "supporting"],
    roles: [
      "Assembles the land, development case, delivery model and project governance needed to proceed.",
      "Appoints and coordinates the design team, approves the brief and controls the coordinated design programme.",
      "Sponsors authority submissions, resolves conditions and keeps permits, NOCs and project registration aligned.",
      "Procures and governs delivery, certifies progress through appointed professionals and controls project change.",
      "Registers the project and eligible sales, manages buyer obligations and coordinates title or provisional transfer evidence.",
      "Coordinates completion, handover, defect obligations and the transition to owners, operators and community governance.",
      "Provides development, warranty and project evidence that supports long-term operation, resale and portfolio learning.",
    ],
  },
  "consultants-designers": {
    levels: ["supporting", "lead", "active", "active", "supporting", "supporting", "informed"],
    roles: [
      "Tests site, planning and technical assumptions so the opportunity case is based on buildable evidence.",
      "Produces and coordinates the architecture, engineering, surveys and design evidence required for approval and delivery.",
      "Prepares submissions, answers technical comments and maintains the approved design and authority-response record.",
      "Administers technical compliance, inspections, design changes, quality evidence and completion submissions as appointed.",
      "Supplies approved plans, areas, specifications and completion evidence needed for disclosure, sale and handover.",
      "Supports defects, as-built records, maintainability reviews and later alteration or fit-out approvals.",
      "Receives performance feedback and contributes technical advice when an asset is altered, upgraded or repositioned.",
    ],
  },
  "authorities-regulators": {
    levels: ["informed", "supporting", "lead", "active", "lead", "supporting", "supporting"],
    roles: [
      "Publishes the registry, planning and eligibility rules used to identify the lawful route; it does not select the investment.",
      "Sets planning controls, submission standards and consultation requirements relevant to the plot and proposed use.",
      "Reviews statutory submissions, records conditions and issues or refuses the official approvals within its mandate.",
      "Inspects regulated work and records stage or completion outcomes without replacing the developer's delivery duties.",
      "Registers qualifying property dispositions, mortgages or provisional interests and issues the official registry outputs.",
      "Maintains tenancy, jointly owned property, safety, utility or community controls within the relevant legal mandate.",
      "Records qualifying refinancing, resale, gift, inheritance, alteration or other regulated asset actions.",
    ],
  },
  "utility-providers": {
    levels: ["supporting", "supporting", "active", "active", "supporting", "lead", "supporting"],
    roles: [
      "Provides early capacity, corridor and connection constraints that can affect site feasibility.",
      "Reviews load, network, metering and connection design inputs before final authority submission.",
      "Reviews utility NOCs or integrated building-permit referrals and states connection conditions.",
      "Inspects, energises or connects approved infrastructure when construction evidence and prerequisites are complete.",
      "Provides meter, connection and account evidence needed for completion, handover or customer activation.",
      "Operates regulated utility services, metering, faults, consumption records and approved service changes.",
      "Supplies consumption and capacity evidence for efficiency upgrades, refurbishment or asset repositioning.",
    ],
  },
  contractors: {
    levels: ["informed", "supporting", "supporting", "lead", "supporting", "active", "supporting"],
    roles: [
      "Receives early project constraints that may affect buildability, logistics, programme and procurement strategy.",
      "Contributes construction methodology, sequencing, cost and buildability input without owning the design approval.",
      "Provides appointment, licence, method and technical evidence required for contractor-facing permits and NOCs.",
      "Executes the approved work, coordinates subcontractors and maintains safety, quality, inspection and progress evidence.",
      "Supports completion, snagging, buyer-readiness and handover evidence without acting as the registry or seller.",
      "Closes defects and may deliver maintenance or fit-out work under the applicable owner, operator and authority controls.",
      "Provides condition, warranty and upgrade evidence for refurbishment, replacement and long-term asset planning.",
    ],
  },
  "suppliers-vendors": {
    levels: ["informed", "supporting", "informed", "active", "informed", "supporting", "supporting"],
    roles: [
      "Receives the opportunity and procurement outlook without controlling the land or investment decision.",
      "Provides product data, samples, warranties and technical compliance evidence for specified systems and materials.",
      "Responds to product-specific approval or conformity requirements through the appointed design and delivery team.",
      "Manufactures, delivers, installs or commissions contracted items and preserves traceability, test and warranty records.",
      "Provides final schedules, manuals and warranty evidence used in disclosure and handover packs.",
      "Supports spares, warranty, maintenance and replacement obligations during operation.",
      "Provides lifecycle, obsolescence and replacement information for capital planning and upgrades.",
    ],
  },
  "brokers-agencies": {
    levels: ["supporting", "informed", "informed", "informed", "lead", "active", "lead"],
    roles: [
      "Provides evidenced market, demand and comparable inputs without verifying title or permitted use on the investor's behalf.",
      "Receives approved positioning, unit mix and programme information needed for responsible market preparation.",
      "Uses only approved and current project, permit and disclosure information in regulated marketing activity.",
      "Tracks deliverable inventory and approved milestones without directing construction or certifying progress.",
      "Sources and qualifies parties, supports disclosure and documentation, and coordinates the authorised sale or lease channel.",
      "Supports leasing, renewals and occupier communication through authorised property-management and Ejari routes.",
      "Advises on market positioning and executes authorised leasing or resale instructions using current asset evidence.",
    ],
  },
  "banks-financial": {
    levels: ["active", "informed", "supporting", "active", "active", "supporting", "active"],
    roles: [
      "Assesses the borrower, security, valuation and funding case subject to lender-specific underwriting.",
      "Receives material design, cost and programme information that affects facility conditions and valuation.",
      "Checks finance conditions linked to permits, project registration, escrow or other required approvals.",
      "Controls eligible drawdowns against facility conditions and independent progress evidence without certifying the works itself.",
      "Issues liability, registration or release evidence and coordinates the applicable mortgage or financed-sale route.",
      "Maintains mortgage, payment and account controls and receives material operating evidence where the facility requires it.",
      "Assesses refinance, restructuring or release using current title, valuation, income and condition evidence.",
    ],
  },
  "property-owners": {
    levels: ["supporting", "informed", "informed", "informed", "lead", "lead", "lead"],
    roles: [
      "May enter as a land or completed-asset buyer and defines the intended ownership, use and investment outcome.",
      "Receives the design and disclosure implications that will shape ownership, operation and future alterations.",
      "Receives verified approval status and conditions without assuming the authority or developer's statutory role.",
      "Receives progress, quality and completion evidence relevant to acquisition, handover or retained ownership.",
      "Completes the applicable purchase, sale, mortgage or transfer registration and retains the official ownership record.",
      "Controls the unit or asset, pays applicable charges, manages occupancy and authorises maintenance or alterations.",
      "Decides whether to hold, lease, improve, refinance, sell, gift or plan succession using current evidence.",
    ],
  },
  "residents-tenants": {
    levels: ["informed", "informed", "informed", "informed", "active", "lead", "supporting"],
    roles: [
      "Represents end-user needs and demand signals without controlling the development or land decision.",
      "May contribute accessibility, usability and service expectations through an authorised consultation channel.",
      "Relies on official approvals and disclosures rather than acting in the statutory approval process.",
      "Receives verified progress and readiness information without directing or certifying the work.",
      "Completes buyer or tenant onboarding, required disclosures, payment and contract steps through the authorised route.",
      "Occupies and uses the property, reports service issues and fulfils tenancy or community obligations.",
      "Provides experience, demand and service feedback that can inform renewal, improvement and community decisions.",
    ],
  },
  "facility-community-operators": {
    levels: ["supporting", "supporting", "supporting", "active", "supporting", "lead", "active"],
    roles: [
      "Provides early operating-cost, service, access and maintainability assumptions for feasibility.",
      "Reviews maintainability, access, life safety, metering, waste and operating requirements before design is fixed.",
      "Supplies operator evidence and receives conditions relevant to operation, community rules or later fit-out work.",
      "Participates in commissioning, asset-data capture, handover, mobilisation and operational-readiness reviews.",
      "Supports owner or occupier onboarding, service-charge communication and the transfer of operating records.",
      "Operates and maintains the property or community, manages service evidence and coordinates approved interventions.",
      "Uses condition, cost, energy and service data to plan maintenance, replacement, resilience and improvement.",
    ],
  },
};

export const stakeholderParticipation: StakeholderParticipation[] = STAKEHOLDER_IDS.flatMap((stakeholderId) => {
  const row = rows[stakeholderId];
  return STAGE_IDS.map((stageId, index) => {
    const relationshipLevel = row.levels[index];
    const role = row.roles[index];
    const involvement: PublicParticipation = relationshipLevel === "lead"
      ? "lead"
      : relationshipLevel === "informed"
        ? "informed"
        : "participant";
    return {
      stakeholderId,
      stageId,
      involvement,
      relationshipLevel,
      role,
      evidence: "conditional",
    };
  });
});

export const participationForStakeholder = (stakeholderId: string) =>
  stakeholderParticipation.filter((item) => item.stakeholderId === stakeholderId);

export const participationForStage = (stageId: string) =>
  stakeholderParticipation.filter((item) => item.stageId === stageId);

export const participationFor = (stageId: string, stakeholderId: string) =>
  stakeholderParticipation.find((item) => item.stageId === stageId && item.stakeholderId === stakeholderId);

export const participatingStakeholderIds = (stageId: string) =>
  participationForStage(stageId).map((item) => item.stakeholderId);

if (stakeholderParticipation.length !== 84) {
  throw new Error(`Expected 84 Journey × Stakeholder participation records; found ${stakeholderParticipation.length}.`);
}

for (const stakeholderId of STAKEHOLDER_IDS) {
  const row = participationForStakeholder(stakeholderId);
  if (row.length !== 7 || new Set(row.map((item) => item.stageId)).size !== 7) {
    throw new Error(`Incomplete seven-stage mapping for ${stakeholderId}.`);
  }
}

for (const item of stakeholderParticipation) {
  if (!item.role || !item.relationshipLevel) {
    throw new Error(`Missing participation role: ${item.stageId} / ${item.stakeholderId}`);
  }
}

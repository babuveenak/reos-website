import type { ContentStatus } from "./reos";
import { participatingStakeholderIds } from "./stakeholderParticipation";

/**
 * THE CANONICAL PROPERTY JOURNEY.
 *
 * One spine. SEVEN stages. Every other view on the site — the homepage hero,
 * the persona flows, the 24 detailed lifecycle stages in reos.ts and the
 * assistant — is a projection of this list, never a competing version of it.
 *
 * Re-founded from twelve stages to seven on 2026-08-19, at the owner's
 * explicit direction, because the twelve-stage spine and the twelve-GROUP
 * ecosystem in ecosystem.ts were easy to mistake for the same number
 * describing two different things. Seven stages, twelve groups: the stages
 * are the timeline, the groups are who is linked to it.
 *
 * Every old stage's validated content survives somewhere in the new seven —
 * nothing here was invented from nothing. Two old stages folded together
 * without changing meaning (Handover & Snagging + Occupancy & Community →
 * Living & Operations; Property Management + Investment, Leasing & Resale →
 * Asset Growth & Intelligence). One old stage split across two new ones
 * where its own content already separated cleanly (Design & Approvals →
 * Planning & Design for the design half, Authorities & Approvals for the
 * permitting half). Finance & Escrow lost its standalone slot — it was never
 * a stage so much as a control that runs through others — so its content now
 * sits where each part of it actually happens: construction drawdowns under
 * Construction & Delivery, buyer escrow and registration under Sales &
 * Transfer. Nothing about escrow or drawdowns was deleted, only relocated to
 * sit next to the activity it controls.
 *
 * Stages are ordered, but order is not the same as sequence: `runsWith`
 * records genuine concurrency. In UAE off-plan development, marketing and
 * sales begin during construction, not after it — escrow exists precisely
 * because buyers pay while the building goes up. A site that shows sales
 * after construction teaches a sequence that does not exist.
 *
 * Written for a global reader: UAE-specific terms are defined at the point
 * of use rather than assumed.
 */

export type Track = "Origination" | "Regulatory" | "Delivery" | "Commercial" | "Operations";

export type Stage = {
  id: string;
  number: number;
  name: string;
  short: string;
  phase: "Originate" | "Deliver" | "Own" | "Evolve";
  track: Track;
  /** Stages that genuinely run at the same time as this one. */
  runsWith: string[];
  summary: string;
  whatHappens: string[];
  /** Stakeholder group ids from ecosystem.ts */
  groupIds: string[];
  documents: string[];
  risks: string[];
  nextStep: string;
  /** Why the answer changes between emirates and zones. */
  jurisdiction: string;
  /** Detailed stage ids from reos.ts that sit beneath this stage. */
  detailStageIds: string[];
  status: ContentStatus;
};

export const tracks: { id: Track; label: string; note: string }[] = [
  { id: "Origination", label: "Origination", note: "Securing the land, the entity and the case for building" },
  { id: "Regulatory", label: "Regulatory", note: "Permissions that gate everything downstream" },
  { id: "Delivery", label: "Delivery", note: "Designing and physically building the asset" },
  { id: "Commercial", label: "Commercial", note: "Selling, leasing, transferring and growing the asset's value" },
  { id: "Operations", label: "Operations", note: "Running the property once people live in it" },
];

const raw: Omit<Stage, "number">[] = [
  {
    id: "land-vision", name: "Land & Vision", short: "Land", phase: "Originate", track: "Origination", runsWith: [],
    summary: "Securing the right opportunity and proving, before large sums are committed, that it actually works.",
    whatHappens: [
      "Identify the land or project opportunity and confirm registered ownership, permitted use and any rights, mortgages or restrictions attached to the plot",
      "Test the market — what sells or leases here, at what price, to whom — and build an investment case around it",
      "Run feasibility: development controls, a cost plan and a development programme, modelled against the capital that would be required",
      "Choose an ownership structure, often a special purpose vehicle, and obtain the licences and developer registration the activity requires",
    ],
    groupIds: participatingStakeholderIds("land-vision"),
    documents: ["Title deed or plot ownership evidence", "Site plan and survey", "Market and pricing study", "Cost plan and financial model", "Company formation and developer registration documents"],
    risks: [
      "Buying land whose permitted use will not support the intended project",
      "Optimistic pricing or absorption assumptions that only surface during sales",
      "Ownership eligibility assumed rather than verified for the specific plot and buyer",
      "Structure chosen before financing or the sale of units was considered",
    ],
    nextStep: "Confirm the plot's approving authority and permitted use in writing before negotiating price.",
    jurisdiction: "Ownership eligibility, registration route and permitted use differ by emirate and by zone within an emirate. A plot inside a free zone or a designated development zone is governed differently from one on municipal land next door.",
    detailStageIds: ["land-opportunity", "land-acquisition", "developer-establishment", "feasibility"], status: "Validated",
  },
  {
    id: "planning-design", name: "Planning & Design", short: "Design", phase: "Originate", track: "Delivery", runsWith: [],
    summary: "Turning the concept into a coordinated, buildable design package.",
    whatHappens: [
      "Appoint licensed architects and engineers, including the consultant of record who will sign submissions and carry design liability",
      "Develop the master plan — height, density, setbacks, parking and use mix — against what the plot actually allows",
      "Coordinate architectural, structural and building-services design into one buildable package",
      "Resolve master-community requirements and fire and life-safety design intent before submission",
    ],
    groupIds: participatingStakeholderIds("planning-design"),
    documents: ["Consultant appointment and scope", "Concept massing studies", "Coordinated architectural and engineering drawings", "Development control compliance record"],
    risks: [
      "Design frozen before the master community has commented",
      "Disciplines coordinated on paper too late to avoid a clash discovered on site",
      "Programme that ignores how long the approvals that follow actually take",
    ],
    nextStep: "Resolve which single authority governs this plot before the design package is frozen.",
    jurisdiction: "Development controls are issued by the planning authority for that plot, and a master community may impose further private requirements on top.",
    detailStageIds: ["planning-design"], status: "Validated",
  },
  {
    id: "authorities-approvals", name: "Authorities & Approvals", short: "Approvals", phase: "Originate", track: "Regulatory", runsWith: [],
    summary: "Submitting the design package to every body that must clear it, and obtaining permission to build.",
    whatHappens: [
      "Resolve which authority governs the plot — municipality, development-zone authority or free-zone regulator — before any submission is prepared",
      "Submit to the planning and building authority, and to RERA or the equivalent real-estate regulator where the activity requires it",
      "Obtain the no-objection certificates utility, transport and civil defence bodies require",
      "Resolve fire and life-safety and infrastructure requirements, then obtain the building permit",
    ],
    groupIds: participatingStakeholderIds("authorities-approvals"),
    documents: ["Authority submission package", "No-objection certificates from utility and transport bodies", "Civil defence fire and life-safety approval", "Building permit"],
    risks: [
      "Submitting to the wrong authority because the plot's jurisdiction was never resolved",
      "Redesign after a late-arriving requirement from a body nobody consulted early",
      "Utility approvals treated as a formality rather than a real lead-time item",
    ],
    nextStep: "Confirm every no-objection certificate this specific plot needs before the first submission, not after a rejection.",
    jurisdiction: "This is where jurisdiction matters most. A Dubai plot may fall to the municipality, a development-zone authority, or a free-zone built-environment regulator — each with different submissions, sequences and fees.",
    detailStageIds: ["authority-approvals"], status: "Validated",
  },
  {
    id: "construction-delivery", name: "Construction & Delivery", short: "Build", phase: "Deliver", track: "Delivery", runsWith: ["sales-transfer"],
    summary: "Procuring the contractor and physically building the asset, with quality, safety and progress evidenced throughout — while construction finance is drawn down against that same evidence.",
    whatHappens: [
      "Tender and award the main contract, and put contractor's all-risks and third-party insurance in place before anyone goes on site",
      "Mobilise the site, then build against the approved drawings",
      "Inspect and test as work proceeds, and record what was inspected and by whom",
      "Certify genuine progress for payment, and draw construction finance down against that verified progress, not against claims",
    ],
    groupIds: participatingStakeholderIds("construction-delivery"),
    documents: ["Main contract and subcontracts", "Contractor's all-risks and third-party insurance", "Inspection and test records", "Progress certificates and valuations", "Facility agreement and drawdown records"],
    risks: [
      "Progress claimed ahead of work actually completed",
      "Design changes made on site without the consultant's approval or a permit amendment",
      "Drawdowns delayed because progress evidence does not satisfy the bank",
    ],
    nextStep: "Fix the inspection and certification chain before mobilisation, not during it.",
    jurisdiction: "Inspection regimes, contractor grading and site-safety enforcement are administered by the building authority for that plot.",
    detailStageIds: ["procurement", "construction", "inspection", "finance-escrow"], status: "Validated",
  },
  {
    id: "sales-transfer", name: "Sales & Transfer", short: "Sales", phase: "Deliver", track: "Commercial", runsWith: ["construction-delivery"],
    summary: "Selling units — which in off-plan development happens while the building is still going up — and transferring ownership through the official register.",
    whatHappens: [
      "Register the project with the real-estate regulator and open a regulated escrow account before any unit is offered for sale",
      "Obtain advertising permits, appoint licensed brokers, and market the project",
      "Onboard buyers: take reservations, then issue the sale and purchase agreement, collecting every payment into escrow, never into the developer's own account",
      "Register each sale on the official register, which records the buyer against the specific unit and is what legally protects their interest",
    ],
    groupIds: participatingStakeholderIds("sales-transfer"),
    documents: ["Project registration certificate and escrow account agreement", "Advertising and listing permits", "Sale and purchase agreement", "Payment receipts showing escrow deposit", "Official sale registration record"],
    risks: [
      "Marketing or taking deposits before the project is registered and escrow is open",
      "Buyer expectations set by marketing material that the contract does not support",
      "Sales concluded but never registered, leaving buyers unprotected",
    ],
    nextStep: "Confirm the project is registered and escrow is open before any unit is offered for sale.",
    jurisdiction: "Escrow, advertising permits, broker licensing and off-plan sale registration are all regulated separately by each emirate's real-estate regulator; a permit or registration in one is not valid in another.",
    detailStageIds: ["project-registration", "sales", "offplan-escrow", "customer-onboarding", "payments", "title"], status: "Validated",
  },
  {
    id: "living-operations", name: "Living & Operations", short: "Living", phase: "Own", track: "Operations", runsWith: [],
    summary: "Completing the building, transferring it to the people who bought it, and turning it into a working, serviced place where people can actually live.",
    whatHappens: [
      "Obtain completion approval, notify buyers and complete transfer of ownership unit by unit",
      "Inspect each unit with the buyer, record defects — commonly called snagging — and rectify them through the liability period",
      "Connect utilities, register occupants with the community, and establish the owners' association and the service charges that fund shared upkeep",
      "Set up how residents and tenants report faults and request services",
    ],
    groupIds: participatingStakeholderIds("living-operations"),
    documents: ["Completion certificate and handover notice", "Unit inspection and snag list", "Utility connection applications", "Owners' association constitution and service charge schedule"],
    risks: [
      "Handover notices issued before completion approval is actually in hand",
      "Defects recorded informally and disputed later",
      "Occupation delayed by utility connection lead times nobody planned for",
      "Service charges set below the real cost of running the building",
    ],
    nextStep: "Give every buyer one dated evidence pack — inspection record, warranties, meter readings, keys.",
    jurisdiction: "Completion approval, occupancy certification, community rules and owners' association regulation are all emirate-specific, and district cooling is often a single contracted provider per community.",
    detailStageIds: ["handover", "snagging-dlp", "utilities", "community"], status: "Validated",
  },
  {
    id: "asset-growth-intelligence", name: "Asset Growth & Intelligence", short: "Growth", phase: "Evolve", track: "Commercial", runsWith: [],
    summary: "Keeping the asset in good condition and correctly funded, and earning from it — by leasing, selling, refinancing or holding for the long term.",
    whatHappens: [
      "Run planned and reactive maintenance, and fund the reserve for major future works from service charges",
      "Lease the property and register the tenancy through the official system, or track owner-occupied performance",
      "Track income, cost and yield against the original investment case, using portfolio-level reporting and analytics",
      "Refinance, restructure or sell — clearing mortgages and community dues, then transferring title — or plan succession",
    ],
    groupIds: participatingStakeholderIds("asset-growth-intelligence"),
    documents: ["Maintenance plan and asset register", "Tenancy contract and registration", "Rent, cost and yield records", "Valuation and refinancing documents", "Mortgage settlement and transfer documents"],
    risks: [
      "Deferred maintenance that turns into capital expenditure",
      "Yield calculated before service charges, agency fees and vacancy",
      "Sale delayed because service charge or mortgage clearances were left to the end",
      "Succession unplanned, leaving ownership contested",
    ],
    nextStep: "Check the reserve fund against a condition-based replacement schedule, and assemble the clearance pack before listing, not after an offer.",
    jurisdiction: "Tenancy registration, rent regulation, transfer fees, service charge approval and inheritance treatment all differ by emirate and by the owner's personal status.",
    detailStageIds: ["ownership-operations", "leasing", "resale", "succession-exit"], status: "Validated",
  },
];

export const stages: Stage[] = raw.map((s, i) => ({ ...s, number: i + 1 }));
export const stageById = Object.fromEntries(stages.map((s) => [s.id, s]));

/** Compact labels for the homepage journey ribbon. */
export const ribbon = stages.map((s) => ({ id: s.id, short: s.short, number: s.number }));

/** The three layers of the product, in the order a visitor should meet them. */
export const layers = [
  { id: "knowledge", name: "Knowledge Layer", claim: "Understand the journey", copy: "What happens at each stage, who is involved, which permissions apply and what the terms actually mean — written for people who do not already work in UAE property." },
  { id: "discovery", name: "Discovery Layer", claim: "Find what applies to you", copy: "Narrow the journey to your emirate, asset type and role, so you see the requirements, documents and participants relevant to your case rather than all of them." },
  { id: "execution", name: "Execution Layer", claim: "Run the work", copy: "Coordinate the workflows, documents, approvals and reporting that move a real project forward, while official systems remain the system of record." },
];

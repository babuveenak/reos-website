import type { ContentStatus } from "./reos";

/**
 * THE CANONICAL PROPERTY JOURNEY.
 *
 * One spine. Twelve stages. Every other view on the site — the homepage
 * ribbon, the persona flows, the 24 detailed lifecycle stages in reos.ts —
 * is a projection of this list, never a competing version of it.
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

export type Track = "Origination" | "Regulatory" | "Financial" | "Delivery" | "Commercial" | "Operations";

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
  { id: "Financial", label: "Financial", note: "Capital in, controlled money out — recurring, not one-off" },
  { id: "Delivery", label: "Delivery", note: "Designing and physically building the asset" },
  { id: "Commercial", label: "Commercial", note: "Selling, leasing and transferring the product" },
  { id: "Operations", label: "Operations", note: "Running the property once people live in it" },
];

const raw: Omit<Stage, "number">[] = [
  {
    id: "land-ownership", name: "Land & Ownership", short: "Land", phase: "Originate", track: "Origination", runsWith: [],
    summary: "Establishing who owns the land, what may legally be built on it, and on what terms it can change hands.",
    whatHappens: [
      "Confirm registered ownership and any rights, mortgages or restrictions attached to the plot",
      "Check the permitted use and development limits that apply to this exact location",
      "Confirm whether the buyer is eligible to own in this area — eligibility varies by nationality and zone",
      "Agree commercial terms, then complete transfer through the official registration channel",
    ],
    groupIds: ["land-developer", "investors", "authorities", "legal-assurance", "enablers"],
    documents: ["Title deed or plot ownership evidence", "Site plan and survey", "Planning and zoning information", "Sale agreement", "Clearances required before transfer"],
    risks: [
      "Buying land whose permitted use will not support the intended project",
      "Ownership eligibility assumed rather than verified for the specific plot and buyer",
      "Access, utility capacity or master-community obligations discovered after purchase",
    ],
    nextStep: "Confirm the plot's approving authority and permitted use in writing before negotiating price.",
    jurisdiction: "Ownership eligibility, registration route and permitted use differ by emirate and by zone within an emirate. A plot inside a free zone or a designated development zone is governed differently from one on municipal land next door.",
    detailStageIds: ["land-opportunity", "land-acquisition"], status: "Validated",
  },
  {
    id: "project-formation", name: "Project Formation", short: "Formation", phase: "Originate", track: "Origination", runsWith: ["planning-feasibility"],
    summary: "Creating the legal entity that will own, build and sell the project, and obtaining the licences it needs to act as a developer.",
    whatHappens: [
      "Choose an ownership structure — often a special purpose vehicle, a company created for one project so its risks stay separate",
      "Obtain the commercial licence and any developer registration the activity requires",
      "Document arrangements between partners, investors and the entity",
      "Appoint the people authorised to sign and submit on the project's behalf",
    ],
    groupIds: ["land-developer", "investors", "authorities", "legal-assurance"],
    documents: ["Company formation documents", "Trade or commercial licence", "Developer registration where required", "Shareholder or joint venture agreement", "Authorised signatory records"],
    risks: [
      "Starting design or marketing before the entity is licensed to do so",
      "Structure that blocks later financing or the sale of units",
      "Partner obligations agreed verbally and documented late",
    ],
    nextStep: "Confirm which licences and registrations this specific activity requires before incurring project cost.",
    jurisdiction: "Licensing authority, permitted activity wording and developer registration requirements are set by each emirate's economic and real-estate regulators, and separately by each free zone.",
    detailStageIds: ["developer-establishment"], status: "To Be Validated",
  },
  {
    id: "planning-feasibility", name: "Planning & Feasibility", short: "Feasibility", phase: "Originate", track: "Origination", runsWith: ["project-formation"],
    summary: "Testing whether the project works — physically, commercially and financially — before large sums are committed.",
    whatHappens: [
      "Establish what the plot allows: height, density, setbacks, parking and use mix",
      "Test the market — what sells or leases here, at what price, to whom",
      "Build a cost plan and a development programme",
      "Model returns against the capital that would be required, and decide whether to proceed",
    ],
    groupIds: ["land-developer", "investors", "consultants", "enablers"],
    documents: ["Development control information", "Concept massing studies", "Market and pricing study", "Cost plan", "Financial model and programme"],
    risks: [
      "Optimistic pricing or absorption assumptions that only surface during sales",
      "Costs estimated before the ground conditions are known",
      "Programme that ignores how long approvals actually take",
    ],
    nextStep: "Test the model against a pessimistic case before committing capital, not only the expected one.",
    jurisdiction: "Development controls are issued by the planning authority for that plot, and a master community may impose further private requirements on top.",
    detailStageIds: ["feasibility"], status: "Validated",
  },
  {
    id: "design-approvals", name: "Design & Approvals", short: "Design", phase: "Originate", track: "Regulatory", runsWith: [],
    summary: "Turning the concept into approved, buildable drawings — and obtaining the permits that make construction lawful.",
    whatHappens: [
      "Appoint licensed architects and engineers, including the consultant who will sign and carry design liability",
      "Develop and coordinate architectural, structural and building-services design",
      "Submit for planning and building approval, and obtain the no-objection certificates other bodies require",
      "Resolve fire and life-safety, infrastructure and utility requirements, then obtain the building permit",
    ],
    groupIds: ["consultants", "authorities", "land-developer", "utilities", "legal-assurance"],
    documents: ["Consultant appointment and scope", "Approved architectural and engineering drawings", "No-objection certificates from utility and transport bodies", "Fire and life-safety approval", "Building permit"],
    risks: [
      "Submitting to the wrong authority because the plot's jurisdiction was never resolved",
      "Redesign after a late-arriving requirement from a body nobody consulted early",
      "Design frozen before the master community has commented",
    ],
    nextStep: "Resolve which single authority governs this plot before any submission is prepared.",
    jurisdiction: "This is where jurisdiction matters most. A Dubai plot may fall to the municipality, a development-zone authority, or a free-zone built-environment regulator — each with different submissions, sequences and fees.",
    detailStageIds: ["planning-design", "authority-approvals"], status: "Validated",
  },
  {
    id: "finance-escrow", name: "Finance & Escrow", short: "Finance", phase: "Originate", track: "Financial", runsWith: ["construction-delivery", "marketing-sales"],
    summary: "Arranging the capital that funds construction, and the controlled account through which buyer money must flow.",
    whatHappens: [
      "Register the project with the real-estate regulator so units may lawfully be sold",
      "Open an escrow account — a regulated account, held by an approved bank, that ring-fences buyer payments for this project alone",
      "Arrange construction finance and agree how funds are drawn against verified progress",
      "Set the payment plan that links what buyers pay to what has actually been built",
    ],
    groupIds: ["investors", "escrow-financial", "authorities", "land-developer", "legal-assurance"],
    documents: ["Project registration certificate", "Escrow account agreement", "Facility agreement and security documents", "Approved payment plan", "Progress certificates supporting each release"],
    risks: [
      "Marketing or taking deposits before the project is registered and escrow is open",
      "Payment plan that collects faster than construction progresses",
      "Drawdowns delayed because progress evidence does not satisfy the bank",
    ],
    nextStep: "Confirm the project is registered and escrow is open before any unit is offered for sale.",
    jurisdiction: "Escrow is mandatory for off-plan sales and is governed by each emirate's real-estate regulator, which approves the trustee banks and the release conditions.",
    detailStageIds: ["project-registration", "finance-escrow", "payments"], status: "Validated",
  },
  {
    id: "construction-delivery", name: "Construction & Delivery", short: "Build", phase: "Deliver", track: "Delivery", runsWith: ["marketing-sales", "finance-escrow"],
    summary: "Procuring the contractor and building the asset, while quality, safety and progress are evidenced throughout.",
    whatHappens: [
      "Tender and award the main contract, and put insurances in place before anyone goes on site",
      "Mobilise the site, then build against the approved drawings",
      "Inspect and test as work proceeds, and record what was inspected and by whom",
      "Manage changes, claims and delays against the contract, and certify genuine progress for payment",
    ],
    groupIds: ["contractors", "consultants", "land-developer", "escrow-financial", "legal-assurance"],
    documents: ["Main contract and subcontracts", "Contractor's all-risks and third-party insurance", "Inspection and test records", "Progress certificates and valuations", "Variation and claim records"],
    risks: [
      "Progress claimed ahead of work actually completed",
      "Design changes made on site without the consultant's approval or a permit amendment",
      "Contractor not graded for work of this scale, discovered after award",
    ],
    nextStep: "Fix the inspection and certification chain before mobilisation, not during it.",
    jurisdiction: "Inspection regimes, contractor grading and site-safety enforcement are administered by the building authority for that plot.",
    detailStageIds: ["procurement", "construction", "inspection"], status: "Validated",
  },
  {
    id: "marketing-sales", name: "Marketing & Sales", short: "Sales", phase: "Deliver", track: "Commercial", runsWith: ["construction-delivery", "finance-escrow"],
    summary: "Selling units — which in off-plan development happens while the building is still going up, not after it is finished.",
    whatHappens: [
      "Obtain the permits that allow the project and its units to be advertised",
      "Appoint licensed brokers and agree how they may represent the project",
      "Take reservations, then issue the sale and purchase agreement setting out unit, price, payment plan and delivery obligations",
      "Collect buyer payments into escrow, never into the developer's own account",
    ],
    groupIds: ["sales-brokerage", "customers", "land-developer", "authorities", "escrow-financial"],
    documents: ["Advertising and listing permits", "Broker agreements", "Reservation form", "Sale and purchase agreement", "Payment receipts showing escrow deposit"],
    risks: [
      "Advertising without a permit, or on terms the permit does not cover",
      "Buyer expectations set by marketing material that the contract does not support",
      "Cancellations concentrated in one payment milestone",
    ],
    nextStep: "Check the advertising permit covers every channel and claim being used, including third-party portals.",
    jurisdiction: "Advertising permits, broker licensing and off-plan sale registration are regulated separately in each emirate; a permit in one is not valid in another.",
    detailStageIds: ["sales", "offplan-escrow", "customer-onboarding"], status: "Validated",
  },
  {
    id: "registration-compliance", name: "Registration & Compliance", short: "Register", phase: "Deliver", track: "Regulatory", runsWith: ["marketing-sales"],
    summary: "Recording each sale on the official register so the buyer's interest in the property is legally protected.",
    whatHappens: [
      "Register the off-plan sale on the official register, which records the buyer against the specific unit",
      "Keep the register current as payments, transfers and assignments occur",
      "Meet ongoing regulatory reporting on project progress and escrow position",
      "Maintain audit trails that survive a change of staff, agent or owner",
    ],
    groupIds: ["authorities", "land-developer", "customers", "escrow-financial", "legal-assurance"],
    documents: ["Off-plan sale registration record", "Buyer identity and eligibility evidence", "Regulatory progress reports", "Escrow audit records"],
    risks: [
      "Sales concluded but never registered, leaving buyers unprotected",
      "Register out of step with the developer's own records",
      "Reporting missed because no single party owns it",
    ],
    nextStep: "Reconcile the official register against internal sales records on a fixed cycle, not on request.",
    jurisdiction: "Each emirate maintains its own register and its own off-plan registration process. Registration in one emirate confers nothing in another.",
    detailStageIds: ["offplan-escrow", "title"], status: "Validated",
  },
  {
    id: "handover-snagging", name: "Handover & Snagging", short: "Handover", phase: "Own", track: "Delivery", runsWith: [],
    summary: "Completing the building, proving it is fit to occupy, and transferring it unit by unit to the people who bought it.",
    whatHappens: [
      "Obtain completion approval and the certificate confirming the building may be occupied",
      "Notify buyers, collect final payments and complete transfer of ownership",
      "Inspect each unit with the buyer and record defects — commonly called snagging",
      "Rectify defects through the liability period, during which the developer remains responsible for putting them right",
    ],
    groupIds: ["land-developer", "customers", "consultants", "contractors", "authorities", "operations"],
    documents: ["Completion certificate", "Handover notice", "Unit inspection and snag list", "Final payment and transfer evidence", "Warranties, manuals and keys inventory"],
    risks: [
      "Handover notices issued before completion approval is actually in hand",
      "Defects recorded informally and disputed later",
      "Buyer unable to complete because mortgage timing was not coordinated",
    ],
    nextStep: "Give every buyer one dated evidence pack — inspection record, warranties, meter readings, keys.",
    jurisdiction: "Completion approval, occupancy certification and transfer are issued by different bodies depending on the plot's jurisdiction.",
    detailStageIds: ["handover", "snagging-dlp"], status: "Validated",
  },
  {
    id: "occupancy-community", name: "Occupancy & Community Living", short: "Occupancy", phase: "Own", track: "Operations", runsWith: [],
    summary: "Turning a completed building into a working, serviced place where people can actually live.",
    whatHappens: [
      "Connect and activate electricity, water and cooling in the occupant's name",
      "Register occupants and vehicles with the community, and set access permissions",
      "Establish the owners' association and the service charges that fund shared upkeep",
      "Set up how residents report faults and request services",
    ],
    groupIds: ["utilities", "operations", "customers", "land-developer"],
    documents: ["Utility connection applications and deposits", "Community registration and access approvals", "Service charge schedule", "Owners' association constitution", "Move-in approvals"],
    risks: [
      "Occupation delayed by utility connection lead times nobody planned for",
      "Service charges set below the real cost of running the building",
      "Cooling supplied under a long exclusive concession with costs residents did not expect",
    ],
    nextStep: "Confirm utility and community move-in requirements through official channels before committing to a move date.",
    jurisdiction: "Utility providers, community rules and owners' association regulation are emirate-specific, and district cooling is often a single contracted provider per community.",
    detailStageIds: ["utilities", "community"], status: "Validated",
  },
  {
    id: "property-management", name: "Property Management", short: "Management", phase: "Evolve", track: "Operations", runsWith: ["investment-resale"],
    summary: "Keeping the asset in good condition, correctly insured, properly funded and worth what it should be.",
    whatHappens: [
      "Run planned and reactive maintenance across the building and its equipment",
      "Collect service charges and manage the reserve fund for major future works",
      "Keep insurance, safety certification and statutory inspections current",
      "Report condition, cost and performance to owners",
    ],
    groupIds: ["operations", "customers", "legal-assurance", "enablers", "utilities"],
    documents: ["Maintenance plan and asset register", "Service charge budget and reserve fund study", "Insurance policies", "Safety and equipment certificates", "Owner reporting pack"],
    risks: [
      "Deferred maintenance that turns into capital expenditure",
      "Reserve fund too small for the first major replacement cycle",
      "Records lost when the managing agent changes",
    ],
    nextStep: "Check the reserve fund against a condition-based replacement schedule, not a flat percentage.",
    jurisdiction: "Owners' association management and service charge approval are regulated per emirate, with an approved-manager regime in some.",
    detailStageIds: ["ownership-operations", "community"], status: "Validated",
  },
  {
    id: "investment-resale", name: "Investment, Leasing & Resale", short: "Invest", phase: "Evolve", track: "Commercial", runsWith: ["property-management"],
    summary: "Earning from the property and eventually exiting it — by leasing, selling, refinancing or passing it on.",
    whatHappens: [
      "Lease the property and register the tenancy through the official system",
      "Track income, cost and yield against the original investment case",
      "Refinance or restructure where it improves the return",
      "Sell — clearing mortgages and community dues, then transferring title — or plan succession",
    ],
    groupIds: ["customers", "sales-brokerage", "investors", "escrow-financial", "authorities", "enablers"],
    documents: ["Tenancy contract and registration", "Rent and expense records", "Valuation", "Mortgage settlement and clearance certificates", "Transfer documents"],
    risks: [
      "Sale delayed because service charge or mortgage clearances were left to the end",
      "Yield calculated before service charges, agency fees and vacancy",
      "Succession unplanned, leaving ownership contested",
    ],
    nextStep: "Assemble the clearance pack — mortgage, service charge, community — before listing, not after an offer.",
    jurisdiction: "Tenancy registration, rent regulation, transfer fees and inheritance treatment all differ by emirate and by the owner's personal status.",
    detailStageIds: ["leasing", "resale", "succession-exit"], status: "Validated",
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

import type { ContentStatus } from "./reos";

/**
 * THE STAKEHOLDER DETAIL TEMPLATE.
 *
 * One record per canonical group in ecosystem.ts (12, no more, no fewer),
 * covering the fixed template every Stakeholder page must use: overview,
 * role in the journey, key responsibilities, key decisions, processes,
 * documents, approvals, systems and portals, dependencies, interactions with
 * other stakeholders, common challenges, relevant intelligence.
 *
 * Re-founded 2026-08-19 by merging the legacy eight-stakeholder "lens" model
 * from reos.ts into the canonical twelve groups here, at the owner's explicit
 * direction ("full merge into 12-group model"). Seven groups carry forward
 * validated content: government-authority → authorities-regulators,
 * master-developer + developer → developers, consultant →
 * consultants-designers, bank → banks-financial, broker → brokers-agencies,
 * investor → landowners-investors, property-owner → property-owners. Five
 * groups had no equivalent in the old eight and are authored fresh here —
 * utility-providers, contractors, suppliers-vendors, residents-tenants,
 * facility-community-operators — honestly marked "To Be Validated" rather
 * than dressed up as verified fact.
 *
 * `dependencies` and `interactions` are kept distinct on purpose: dependencies
 * are prerequisites that must exist before this group can act; interactions
 * are the other groups this one actually works with, cross-linked by id so a
 * reader can jump group to group instead of reading a name that goes nowhere.
 *
 * Journey-stage participation is NOT duplicated here — it's derived at render
 * time from journey.ts's own `groupIds` on each stage, so there is exactly
 * one place that says which stages a group touches.
 */

export type Interaction = { groupId: string; note: string };
export type IntelligenceLink = { label: string; href: string };

export type StakeholderDetail = {
  groupId: string;
  overview: string;
  roleInJourney: string;
  keyResponsibilities: string[];
  keyDecisions: string[];
  processes: string[];
  documents: string[];
  approvals: string[];
  systemsAndPortals: string[];
  dependencies: string[];
  interactions: Interaction[];
  commonChallenges: string[];
  relevantIntelligence: IntelligenceLink[];
  status: ContentStatus;
};

const GLOSSARY = (id: string) => `/intelligence/definitions-and-glossary#${id}`;
const GUIDE = (slug: string) => `/intelligence/guides/${slug}`;

export const stakeholderDetails: StakeholderDetail[] = [
  {
    groupId: "landowners-investors",
    overview: "The individual, family-office, institutional and fund capital that allocates money to land, development or income-producing property — the money that owns, rather than the money that lends.",
    roleInJourney: "Present from the first land decision through to resale or succession, and again whenever the asset is refinanced or repositioned.",
    keyResponsibilities: [
      "Frame the opportunity and the case for building or buying",
      "Fund equity, land or acquisition cost",
      "Set the investment mandate — yield, hold period, risk appetite",
      "Monitor performance and decide when to exit or hold",
    ],
    keyDecisions: [
      "Whether the opportunity and jurisdiction facts justify commitment",
      "How much capital to deploy and in what structure",
      "When to exit, refinance, restructure or pass the asset on",
    ],
    processes: [
      "Due diligence on title, planning and market assumptions",
      "Structuring the investment — direct, SPV or fund vehicle",
      "Ongoing performance monitoring against the original thesis",
      "Exit, succession or reinvestment planning",
    ],
    documents: ["Title or plot ownership evidence", "Investment memorandum and financial model", "Shareholder or SPV agreements", "Disclosures and contracts", "Portfolio and performance reports"],
    approvals: ["No direct regulatory approval to invest — eligibility to hold title is checked by the land registry at acquisition, not issued to this group directly"],
    systemsAndPortals: ["Developer and registry disclosure channels", "Bank and investment platforms", "Portfolio and fund administration tools"],
    dependencies: ["Verified title and permitted use", "A credible feasibility case", "Resolved jurisdiction and eligibility"],
    interactions: [
      { groupId: "developers", note: "Fund or co-invest in the development entity" },
      { groupId: "banks-financial", note: "Arrange debt alongside equity, or hold funds through escrow" },
      { groupId: "authorities-regulators", note: "Registry confirms title and eligibility at acquisition and exit" },
      { groupId: "brokers-agencies", note: "Source and execute acquisition or disposal transactions" },
    ],
    commonChallenges: [
      "Cross-emirate portfolios have no shared state to monitor against",
      "Eligibility and process differ by jurisdiction",
      "Performance data is scattered across developer, bank and registry systems",
    ],
    relevantIntelligence: [
      { label: "Special purpose vehicle (SPV)", href: GLOSSARY("spv") },
      { label: "Absorption", href: GLOSSARY("absorption") },
      { label: "Guide: investing in UAE property", href: GUIDE("investing") },
    ],
    status: "Validated",
  },
  {
    groupId: "developers",
    overview: "The organisations — including master developers and master-community developers — that transform land, approvals, capital and delivery capability into a completed, registered property product.",
    roleInJourney: "Hands-on across nearly the entire journey: they originate the opportunity, carry it through design and approvals, deliver construction, sell during that delivery, and remain responsible through handover and the defects liability period.",
    keyResponsibilities: [
      "Secure development rights, entity and applicable licences",
      "Appoint and coordinate consultants, contractors and finance",
      "Register the project and open escrow before selling",
      "Deliver, sell, hand over and support customers through the liability period",
    ],
    keyDecisions: [
      "Which ownership and delivery structure to use",
      "When design is frozen and submitted",
      "When to open sales relative to construction progress",
      "How to resolve defects and rectification obligations at handover",
    ],
    processes: [
      "Land acquisition and feasibility",
      "Design coordination and authority submission",
      "Project registration, escrow and construction finance",
      "Procurement, construction, sales and handover",
    ],
    documents: ["Title and planning information", "Design and consultant outputs", "Project registration and escrow agreement", "Sale and purchase agreements", "Completion certificate and handover records"],
    approvals: ["Development/building permit", "Project registration (land department / regulator)", "Escrow account opening", "Advertising and marketing permits", "Completion approval"],
    systemsAndPortals: ["Developer ERP/CRM", "Project delivery platforms", "Authority portals", "Bank and escrow channels"],
    dependencies: ["Land or development rights", "Applicable entity and developer credentials", "A resolved governing authority for the plot"],
    interactions: [
      { groupId: "landowners-investors", note: "Source equity and land, and report performance back" },
      { groupId: "consultants-designers", note: "Commission design, engineering and project management" },
      { groupId: "authorities-regulators", note: "Submit for planning, building and project-registration approval" },
      { groupId: "contractors", note: "Award and manage the main construction contract" },
      { groupId: "banks-financial", note: "Arrange construction finance and escrow" },
      { groupId: "brokers-agencies", note: "Appoint to market and sell inventory" },
      { groupId: "property-owners", note: "Sell to, and remain liable to, through handover and the DLP" },
    ],
    commonChallenges: [
      "Multiple possible permitting regimes depending on the plot's jurisdiction",
      "Status is fragmented across professional and official systems",
      "Customer state often breaks down at handover",
    ],
    relevantIntelligence: [
      { label: "Master developer", href: GLOSSARY("master-developer") },
      { label: "Development controls", href: GLOSSARY("development-controls") },
      { label: "Guide: developing a project", href: GUIDE("developing") },
    ],
    status: "Validated",
  },
  {
    groupId: "consultants-designers",
    overview: "The professional and delivery-advisory organisations — architects, engineers, urban planners, project management and specialist consultants — that translate requirements into compliant, buildable, certifiable information.",
    roleInJourney: "Central to Planning & Design and Authorities & Approvals, then present again through Construction & Delivery inspections and the handover snagging process.",
    keyResponsibilities: [
      "Design to brief, code and authority requirement",
      "Coordinate architectural, structural and services disciplines",
      "Evidence progress, quality and completion",
      "Support inspection, certification and defect rectification",
    ],
    keyDecisions: [
      "How the design resolves competing site, code and community constraints",
      "Which submission strategy and authority sequence to follow",
      "What evidence is sufficient to certify progress or completion",
    ],
    processes: [
      "Concept, coordination and authority submission",
      "Site supervision and quality evidence during construction",
      "Inspection, certification and snagging support",
    ],
    documents: ["Consultant appointment and scope", "Coordinated architectural and engineering drawings", "Development-control compliance record", "Progress and completion certificates", "Inspection and rectification records"],
    approvals: ["Consultant-of-record registration", "Design submission sign-off", "Completion certification"],
    systemsAndPortals: ["Project information systems", "Authority portals", "Document and field-inspection tools"],
    dependencies: ["A defined scope and appointment", "Approved upstream information", "Applicable standards and authority requirements"],
    interactions: [
      { groupId: "developers", note: "Appointed and paid to design and certify the project" },
      { groupId: "authorities-regulators", note: "Submit designs and progress evidence for approval" },
      { groupId: "contractors", note: "Supervise and certify construction against the design" },
      { groupId: "utility-providers", note: "Coordinate infrastructure interfaces and connection design" },
    ],
    commonChallenges: [
      "Submission channels and requirements vary by authority",
      "Document versions and responsibility can diverge across disciplines",
      "Handoffs between design and site rely on manual coordination",
    ],
    relevantIntelligence: [
      { label: "Consultant of record", href: GLOSSARY("consultant-of-record") },
      { label: "Development controls", href: GLOSSARY("development-controls") },
    ],
    status: "Validated",
  },
  {
    groupId: "authorities-regulators",
    overview: "The public bodies and regulated channels — land departments, municipalities, development-zone authorities, RERA-equivalent regulators and civil defence — that define, approve, register or service parts of the property journey.",
    roleInJourney: "Shown on their own rail across the journey rather than as a peer group, because they issue the approvals that gate every other group's next step — from developer registration through to resale transfer.",
    keyResponsibilities: [
      "Apply the correct jurisdiction and mandate to each submission",
      "Receive complete, compliant applications",
      "Issue decisions, registrations and official records",
      "Maintain public trust and an auditable record",
    ],
    keyDecisions: [
      "Which authority has jurisdiction over a given plot or transaction",
      "Whether a submission meets the applicable requirement",
      "What official record results, and what it unlocks next",
    ],
    processes: [
      "Application intake and jurisdiction resolution",
      "Review against planning, building or regulatory requirement",
      "Decision, registration and record-keeping",
    ],
    documents: ["Applications and declarations", "Identity and authority evidence", "Project and property records", "Approvals, registrations and certificates"],
    approvals: ["Developer and project registration", "Planning and building permits", "Fire and life-safety approval", "Utility and infrastructure NOCs", "Title registration and transfer"],
    systemsAndPortals: ["Official authority portals", "UAE PASS-authenticated services", "Assisted-service channels"],
    dependencies: ["A resolved jurisdiction and correct authority", "Complete prerequisite evidence", "An authorised applicant or licensed representative"],
    interactions: [
      { groupId: "developers", note: "Approve registration, design and completion at each gate" },
      { groupId: "consultants-designers", note: "Review and approve design and inspection submissions" },
      { groupId: "banks-financial", note: "Confirm registry status supporting finance and escrow" },
      { groupId: "property-owners", note: "Register and confirm ownership on the public record" },
    ],
    commonChallenges: [
      "Jurisdiction must be resolved before guidance is reliable",
      "Dependencies can span several authorities on one submission",
      "Exact exception paths often require direct validation",
    ],
    relevantIntelligence: [
      { label: "No-objection certificate (NOC)", href: GLOSSARY("noc") },
      { label: "Registration trustee", href: GLOSSARY("registration-trustee") },
      { label: "Authority reference", href: "/authorities" },
    ],
    status: "Validated",
  },
  {
    groupId: "utility-providers",
    overview: "The electricity, water, district cooling, telecommunications and gas providers whose connections and capacity a development depends on before it can be occupied.",
    roleInJourney: "Engaged during design for infrastructure interfaces, again during construction for connection approvals, and at handover for move-in and metering.",
    keyResponsibilities: [
      "Confirm available capacity for the development",
      "Approve infrastructure and connection design",
      "Deliver physical connections ahead of occupancy",
      "Meter and bill ongoing consumption",
    ],
    keyDecisions: [
      "Whether existing network capacity supports the proposed development",
      "What connection or reinforcement works are required, and who funds them",
      "When a unit or building is cleared to connect and occupy",
    ],
    processes: [
      "Capacity and design review during planning",
      "Connection approval and NOC issuance during construction",
      "Physical connection and metering at move-in",
    ],
    documents: ["Infrastructure and connection design submissions", "Connection NOCs", "Metering and billing records"],
    approvals: ["Connection/utility NOC", "Capacity confirmation for the development"],
    systemsAndPortals: ["Utility provider service portals", "Metering and billing systems"],
    dependencies: ["Approved infrastructure design", "Confirmed development scope and phasing"],
    interactions: [
      { groupId: "consultants-designers", note: "Coordinate infrastructure and connection design" },
      { groupId: "developers", note: "Issue development-stage connection approvals" },
      { groupId: "residents-tenants", note: "Provide the ongoing metered service occupants pay for" },
    ],
    commonChallenges: [
      "Connection timing can lag construction completion",
      "Capacity constraints in dense areas may require reinforcement works",
    ],
    relevantIntelligence: [{ label: "No-objection certificate (NOC)", href: GLOSSARY("noc") }],
    status: "To Be Validated",
  },
  {
    groupId: "contractors",
    overview: "The main and specialist contractors who physically construct the asset against the approved design, and the subcontractors they in turn manage.",
    roleInJourney: "The primary actor during Construction & Delivery, remaining engaged through defects rectification in the liability period that follows handover.",
    keyResponsibilities: [
      "Execute construction to the approved design and programme",
      "Coordinate subcontractors and site safety",
      "Evidence quality through inspection and testing",
      "Rectify defects identified during snagging and the liability period",
    ],
    keyDecisions: [
      "How to sequence and resource the works against the programme",
      "How to resolve site conditions that differ from the design",
      "What is fit for inspection or handover at each milestone",
    ],
    processes: [
      "Mobilisation and subcontractor award",
      "Site execution, testing and quality inspection",
      "Completion, handover and defects rectification",
    ],
    documents: ["Main contract and subcontracts", "Method statements and quality records", "Testing and inspection certificates", "Snagging and rectification records"],
    approvals: ["Site mobilisation and safety permits", "Inspection sign-off at each milestone", "Completion certification support"],
    systemsAndPortals: ["Project delivery and quality-management platforms", "Site inspection and field tools"],
    dependencies: ["An awarded contract and approved design", "Site access and consultant supervision", "Material and equipment supply on programme"],
    interactions: [
      { groupId: "developers", note: "Contracted and paid to deliver the project" },
      { groupId: "consultants-designers", note: "Build to the design under professional supervision" },
      { groupId: "suppliers-vendors", note: "Procure materials and equipment for the works" },
    ],
    commonChallenges: [
      "Site conditions can diverge from design assumptions",
      "Subcontractor coordination is a common source of delay",
      "Defect responsibility can be disputed after handover",
    ],
    relevantIntelligence: [{ label: "Snagging", href: GLOSSARY("snagging") }, { label: "Defects liability period (DLP)", href: GLOSSARY("dlp") }],
    status: "To Be Validated",
  },
  {
    groupId: "suppliers-vendors",
    overview: "The manufacturers, material suppliers, equipment vendors and technology providers whose products the delivery chain depends on.",
    roleInJourney: "Support Construction & Delivery directly, and increasingly Living & Operations through building systems, technology and maintenance products.",
    keyResponsibilities: [
      "Supply materials and equipment to specification and programme",
      "Provide product warranties and technical support",
      "Meet quality and compliance standards for the intended use",
    ],
    keyDecisions: [
      "Whether a product meets the specified standard or an approved equivalent",
      "How to prioritise supply against competing project demand",
    ],
    processes: [
      "Tendering and order placement against contractor demand",
      "Delivery to programme",
      "Warranty and post-delivery support",
    ],
    documents: ["Purchase orders and specifications", "Product certification and compliance evidence", "Warranties and delivery records"],
    approvals: ["Product compliance certification where regulated (fire rating, electrical standards, etc.)"],
    systemsAndPortals: ["Vendor order and logistics platforms"],
    dependencies: ["A confirmed order against an approved specification", "Site readiness to receive delivery"],
    interactions: [
      { groupId: "contractors", note: "Supply materials and equipment directly to site" },
      { groupId: "consultants-designers", note: "Products are specified against the approved design" },
    ],
    commonChallenges: [
      "Lead times can lag fast-moving construction programmes",
      "Substitutions require re-approval, which can stall works",
    ],
    relevantIntelligence: [],
    status: "To Be Validated",
  },
  {
    groupId: "brokers-agencies",
    overview: "The licensed brokers, agencies and channel partners who connect property supply, demand and transaction execution.",
    roleInJourney: "Central to Sales & Transfer, and active again whenever a property is leased or resold during Living & Operations and Asset Growth & Intelligence.",
    keyResponsibilities: [
      "Source and qualify demand",
      "Represent inventory accurately",
      "Coordinate documents and counterparties",
      "Progress the transaction to completion",
    ],
    keyDecisions: [
      "Which inventory or client to prioritise",
      "How to represent project and unit information to a prospective buyer or tenant",
      "When a transaction is ready to proceed to contract",
    ],
    processes: [
      "Listing and permit registration",
      "Client qualification and property matching",
      "Offer, contract and handoff to registration",
    ],
    documents: ["Broker licence and permits", "Listing agreements", "Offers and reservation forms", "Transaction coordination records"],
    approvals: ["Broker/agency licence", "Advertising permit for the specific listing"],
    systemsAndPortals: ["CRM and listing-portal channels", "Messaging and document tools"],
    dependencies: ["A licensed permission to act", "Verified property or inventory information", "Qualified client intent"],
    interactions: [
      { groupId: "developers", note: "Appointed to market and sell project inventory" },
      { groupId: "property-owners", note: "Represent resale and leasing transactions" },
      { groupId: "banks-financial", note: "Coordinate buyer finance readiness with the transaction" },
      { groupId: "authorities-regulators", note: "Register transactions through the official channel" },
    ],
    commonChallenges: [
      "Licensing and permit regimes differ by emirate",
      "Lead and transaction data are fragmented across systems",
      "Visibility drops once a transaction closes",
    ],
    relevantIntelligence: [{ label: "Guide: buying property", href: GUIDE("buying") }],
    status: "Validated",
  },
  {
    groupId: "banks-financial",
    overview: "The banks, mortgage providers, escrow trustees, payment service providers and related financial institutions supporting project finance, escrow, mortgage, valuation and transaction settlement.",
    roleInJourney: "Engaged from Land & Vision (project and acquisition finance) through Sales & Transfer (escrow, mortgage) and into Living & Operations and Asset Growth & Intelligence (ongoing finance, refinance, resale).",
    keyResponsibilities: [
      "Assess risk and eligibility",
      "Control funds and security through escrow and mortgage instruments",
      "Comply with regulatory obligations",
      "Support reliable transaction completion",
    ],
    keyDecisions: [
      "Whether to extend finance, and on what terms",
      "How funds are released against verified progress or milestones",
      "When to discharge security on completion or resale",
    ],
    processes: [
      "Credit and KYC assessment",
      "Escrow or mortgage facility setup",
      "Milestone-based disbursement and payment processing",
      "Completion, discharge or resale settlement",
    ],
    documents: ["Identity and KYC evidence", "Finance and escrow agreements", "Valuations", "Payment and disbursement records"],
    approvals: ["Escrow account registration", "Mortgage/finance approval", "Discharge of security on completion"],
    systemsAndPortals: ["Bank channels", "Mortgage and escrow platforms", "Registry services where integrated"],
    dependencies: ["A qualified applicant or entity", "Required financial and property evidence", "Applicable regulatory clearance"],
    interactions: [
      { groupId: "developers", note: "Provide construction finance and hold project escrow" },
      { groupId: "property-owners", note: "Provide mortgage finance to buyers" },
      { groupId: "landowners-investors", note: "Arrange debt alongside equity capital" },
      { groupId: "brokers-agencies", note: "Confirm buyer finance readiness for a transaction" },
    ],
    commonChallenges: [
      "KYC and property data are often repeated across parties",
      "Product systems are not built as lifecycle systems",
      "Exact data-sharing permissions between banks and registries require validation",
    ],
    relevantIntelligence: [{ label: "Escrow", href: GLOSSARY("escrow") }, { label: "Guide: financing property", href: GUIDE("financing") }],
    status: "Validated",
  },
  {
    groupId: "property-owners",
    overview: "The buyers and owners — individual or institutional — whose relationship with the property continues well beyond the sale transaction, including the owners' association as their collective voice.",
    roleInJourney: "The counterparty throughout Sales & Transfer, and the party with continuing interest through Living & Operations and Asset Growth & Intelligence.",
    keyResponsibilities: [
      "Buy or hold with informed consent",
      "Complete handover and accept the unit formally",
      "Meet ownership obligations — service charges, compliance, upkeep",
      "Decide on leasing, resale or long-term hold",
    ],
    keyDecisions: [
      "Whether to proceed with purchase, financing and contract terms",
      "Whether to accept the unit at handover or record defects first",
      "Whether to occupy, lease, or sell the asset",
    ],
    processes: [
      "Reservation, contract and payment through escrow",
      "Registration of the purchase on the official record",
      "Handover inspection and snagging",
      "Ongoing ownership — service charges, leasing, resale",
    ],
    documents: ["Sale and purchase agreement", "Escrow payment receipts", "Registration record", "Handover and inspection pack", "Service charge statements"],
    approvals: ["Title registration", "Mortgage approval where financed"],
    systemsAndPortals: ["Developer customer portal", "Bank channels", "Registry services", "Community/FM tools"],
    dependencies: ["Verified project and developer registration", "Financing or funds in place", "A registered purchase contract"],
    interactions: [
      { groupId: "developers", note: "Buy from, and hold the developer accountable through, the liability period" },
      { groupId: "banks-financial", note: "Arrange mortgage finance for the purchase" },
      { groupId: "brokers-agencies", note: "Transact through licensed representation" },
      { groupId: "facility-community-operators", note: "Pay service charges for community and building operations" },
    ],
    commonChallenges: [
      "Several parties participate between handover and living in the property",
      "No shared state follows the owner across developer, bank and registry systems",
      "Snagging and the liability period remain document-heavy",
    ],
    relevantIntelligence: [{ label: "Handover", href: GLOSSARY("handover") }, { label: "Guide: buying property", href: GUIDE("buying") }],
    status: "Validated",
  },
  {
    groupId: "residents-tenants",
    overview: "The occupants — residential and commercial tenants — who live in or use the property without holding title to it.",
    roleInJourney: "Enter at Living & Operations, through tenancy contracts registered against the property, and remain the day-to-day users of the asset.",
    keyResponsibilities: [
      "Meet tenancy contract obligations, including rent",
      "Use the property and shared facilities responsibly",
      "Report faults and request services through the proper channel",
    ],
    keyDecisions: [
      "Whether to accept the tenancy terms offered",
      "Whether to renew, request changes to, or exit a tenancy",
    ],
    processes: [
      "Tenancy contract agreement and registration",
      "Move-in, utility connection and community onboarding",
      "Ongoing occupancy, maintenance requests and lease renewal or exit",
    ],
    documents: ["Tenancy contract", "Tenancy registration record", "Utility connection records", "Move-in/move-out inspection reports"],
    approvals: ["Tenancy contract registration"],
    systemsAndPortals: ["Tenancy registration portal", "Community/FM request systems"],
    dependencies: ["A registered tenancy contract", "Utility connection", "Landlord or owner consent where required"],
    interactions: [
      { groupId: "property-owners", note: "Rent from, and pay rent to, the property owner or landlord" },
      { groupId: "facility-community-operators", note: "Raise maintenance and service requests" },
      { groupId: "utility-providers", note: "Receive and pay for metered utility service" },
    ],
    commonChallenges: [
      "Tenancy dispute processes vary by emirate",
      "Service-request response time depends on the operator, not the tenant",
    ],
    relevantIntelligence: [],
    status: "To Be Validated",
  },
  {
    groupId: "facility-community-operators",
    overview: "The facility management and community management providers — including owners' association managers — who run the building and community once it is occupied.",
    roleInJourney: "The primary operator through Living & Operations and into Asset Growth & Intelligence, sustaining the asset's condition and shared services over time.",
    keyResponsibilities: [
      "Operate and maintain shared facilities and infrastructure",
      "Administer the owners' association budget and service charges",
      "Respond to resident and tenant service requests",
      "Plan and execute preventive and reserve-fund maintenance",
    ],
    keyDecisions: [
      "How to set and allocate the annual service-charge budget",
      "What maintenance is preventive versus deferred to the reserve fund",
      "How to prioritise and resolve competing service requests",
    ],
    processes: [
      "Handover from developer into ongoing operations",
      "Budget setting, service-charge collection and reserve-fund contribution",
      "Day-to-day maintenance and service-request management",
    ],
    documents: ["Owners' association constitution", "Annual budget and service-charge schedule", "Reserve fund studies", "Maintenance and incident records"],
    approvals: ["Registration as an owners' association manager (Mollak-equivalent registration where applicable)", "Annual budget approval by the owners' association"],
    systemsAndPortals: ["Community/FM management platforms", "Service-charge billing systems"],
    dependencies: ["A completed handover from the developer", "An established owners' association", "An approved budget"],
    interactions: [
      { groupId: "property-owners", note: "Bill service charges to, and are governed by, the owners' association" },
      { groupId: "residents-tenants", note: "Receive and resolve day-to-day service requests" },
      { groupId: "utility-providers", note: "Coordinate shared-facility utility supply" },
    ],
    commonChallenges: [
      "Reserve funds are frequently underfunded relative to future major works",
      "Service-charge disputes are a recurring source of friction",
      "Handover from developer to operator can leave gaps in asset records",
    ],
    relevantIntelligence: [
      { label: "Owners' association", href: GLOSSARY("owners-association") },
      { label: "Service charge", href: GLOSSARY("service-charge") },
      { label: "Reserve fund", href: GLOSSARY("reserve-fund") },
    ],
    status: "To Be Validated",
  },
];

export const stakeholderDetailById = Object.fromEntries(
  stakeholderDetails.map((item) => [item.groupId, item]),
);

/** Maps the legacy 8-item reos.ts stakeholder ids (government-authority,
 *  master-developer, developer, consultant, bank, broker, investor,
 *  property-owner) onto the canonical 12-group id that absorbed them. Used to
 *  fix internal links (e.g. /lifecycle's stakeholder cross-references) and to
 *  redirect the retired /stakeholders/<old-id> URLs. Master developer and
 *  developer both fold into the same "developers" group. */
export const legacyStakeholderToGroup: Record<string, string> = {
  "government-authority": "authorities-regulators",
  "master-developer": "developers",
  "developer": "developers",
  "consultant": "consultants-designers",
  "bank": "banks-financial",
  "broker": "brokers-agencies",
  "investor": "landowners-investors",
  "property-owner": "property-owners",
};

import type { ContentStatus } from "./reos";

/**
 * The stakeholder ecosystem.
 *
 * Twelve groups classify ACTOR TYPES, linked to the seven stages in
 * journey.ts. Five clusters group them for navigation.
 *
 * Re-founded on 2026-08-19 alongside journey.ts, at the owner's explicit
 * direction, from a different twelve-group partition. The count did not
 * change — it was already twelve — but several boundaries moved:
 *
 *  - Investors and escrow/banking merge into one group, Banks & Financial
 *    Institutions. The earlier model split them deliberately (who PROVIDES
 *    capital versus who OPERATES it); the new model treats both as one
 *    financial-institutions category. That earlier distinction is not
 *    preserved elsewhere — a project-finance lender and an escrow trustee
 *    are now the same group.
 *  - Contractors and their supply chain split into two: Contractors, and a
 *    new Suppliers & Vendors group for manufacturers, material and equipment
 *    providers.
 *  - Customers splits into Property Owners (the people who hold title) and
 *    a new Residents & Tenants group (the people who occupy without owning).
 *  - Two groups from the earlier model — Legal, Compliance, Insurance &
 *    Professional Assurance, and the cross-cutting Enablers group (valuers,
 *    market intelligence, PropTech, ESG, dispute resolution, training,
 *    residency services) — have no equivalent in the frozen twelve. Nothing
 *    in either list was deleted from the site; each member now sits inside
 *    the new group closest to what it actually does: insurance and
 *    valuation under Banks & Financial Institutions, and everything else
 *    — legal, compliance, notarial, research, technology and specialist
 *    services — under Consultants & Designers. This is a judgement call,
 *    not something the new naming specified, and is worth revisiting with
 *    the group's owner if a dedicated legal/professional-services group
 *    turns out to be needed after all.
 */

export type ClusterId = "capital" | "delivery" | "rail" | "market" | "operations";

export type Cluster = {
  id: ClusterId;
  name: string;
  short: string;
  controls: string;
  layer: "cluster" | "rail";
};

export type Group = {
  id: string;
  number: number;
  name: string;
  short: string;
  cluster: ClusterId;
  controls: string;
  /** Where the line sits when two groups look like they overlap. Only present
   *  where misclassification is a real risk. */
  boundary?: string;
  members: string[];
  phases: ("Originate" | "Deliver" | "Own" | "Evolve")[];
  status: ContentStatus;
};

export const clusters: Cluster[] = [
  { id: "capital", name: "Capital & Ownership", short: "Capital", controls: "Who owns the project, who funds it and who lends against it", layer: "cluster" },
  { id: "delivery", name: "Delivery & Technical", short: "Delivery", controls: "Who designs it and who builds it", layer: "cluster" },
  { id: "rail", name: "Regulatory Rail", short: "Regulatory", controls: "Who issues the approvals that gate everything above", layer: "rail" },
  { id: "market", name: "Market & Ownership", short: "Market", controls: "Who sells it and who owns it once sold", layer: "cluster" },
  { id: "operations", name: "Operations & Community", short: "Operations", controls: "Who services, occupies and runs it day to day", layer: "cluster" },
];

export const groups: Group[] = [
  {
    id: "landowners-investors", number: 1, name: "Landowners & Investors", short: "Landowners & Investors", cluster: "capital",
    controls: "The land itself, and the equity capital that funds a project before debt or buyer money enters.",
    boundary: "This group provides land or equity capital. A lender or an escrow trustee is a different group — Banks & Financial Institutions — even when the same institution also holds equity elsewhere.",
    members: ["Landowners", "Equity Investors", "Institutional Investors", "Private Investors", "Family Offices", "Investment Funds", "Joint Venture Partners"],
    phases: ["Originate", "Evolve"], status: "Validated",
  },
  {
    id: "developers", number: 2, name: "Developers", short: "Developers", cluster: "capital",
    controls: "Development rights, project control, and the ownership structure that carries them through to handover.",
    members: ["Real Estate Developers", "Master Developers / Master Community Developers", "Development Companies", "Project Sponsors", "Special Purpose Vehicles (SPVs)", "Owner-side Development Managers"],
    phases: ["Originate", "Deliver", "Own"], status: "Validated",
  },
  {
    id: "consultants-designers", number: 3, name: "Consultants & Designers", short: "Consultants", cluster: "delivery",
    controls: "The design intent, the technical submissions, and the professional, legal and analytical expertise the project depends on but does not employ directly.",
    boundary: "Broadened to hold every external professional and technical service that is neither an authority nor a contractor: architecture and engineering, but also legal, compliance, valuation, research, technology and dispute-resolution expertise that the earlier model split into separate groups.",
    members: ["Architects", "Master Planners", "Urban Designers", "Structural Engineers", "MEP Consultants", "Civil Engineers", "Surveyors", "Quantity Surveyors", "Third-party Inspection & Certification Bodies", "Law Firms & Legal Advisors", "Compliance Professionals", "Notaries / Attestation Services", "Property Valuers", "Market Intelligence & PropTech Providers", "Dispute Resolution Professionals"],
    phases: ["Originate", "Deliver"], status: "Validated",
  },
  {
    id: "authorities-regulators", number: 4, name: "Authorities & Regulators", short: "Authorities", cluster: "rail",
    controls: "Permission. Every approval, registration and licence that gates a project — DLD, RERA, municipalities, planning and civil defence among them.",
    boundary: "Includes jurisdiction-specific authorities, not only emirate-level ones: DIFC, DDA, Trakhees / PCFC and DMCC each operate their own approval regime.",
    members: ["Dubai Land Department (DLD) & equivalent land departments", "Real Estate Regulatory Agency (RERA) & equivalent regulators", "Municipalities", "Civil Defence", "Planning Authorities", "Free-zone Regulators (DIFC, DDA, Trakhees / PCFC, DMCC)", "Federal & Emirate-level Authorities"],
    phases: ["Originate", "Deliver", "Own", "Evolve"], status: "Validated",
  },
  {
    id: "utility-providers", number: 5, name: "Utility Providers", short: "Utilities", cluster: "operations",
    controls: "Connection, capacity and the servicing without which nothing can be approved for occupation or occupied.",
    members: ["DEWA & equivalent electricity and water authorities", "District Cooling Providers", "Telecommunications Providers", "Gas Providers", "Waste Management", "Roads & Transport Authorities"],
    phases: ["Originate", "Deliver", "Own"], status: "Validated",
  },
  {
    id: "contractors", number: 6, name: "Contractors", short: "Contractors", cluster: "delivery",
    controls: "Physical delivery and programme — the parties contracted to build.",
    boundary: "The parties under contract to build. Their supply chain — manufacturers, material and equipment providers — is Suppliers & Vendors, a separate group.",
    members: ["Main Contractors", "Subcontractors", "Specialist Contractors"],
    phases: ["Deliver"], status: "Validated",
  },
  {
    id: "suppliers-vendors", number: 7, name: "Suppliers & Vendors", short: "Suppliers", cluster: "delivery",
    controls: "The materials, equipment and construction services the contractor's programme depends on.",
    members: ["Material Suppliers", "Manufacturers", "Equipment Vendors", "Construction Service Providers"],
    phases: ["Deliver"], status: "Validated",
  },
  {
    id: "brokers-agencies", number: 8, name: "Brokers & Agencies", short: "Brokers", cluster: "market",
    controls: "Demand, representation and the permitted marketing of inventory.",
    members: ["Real Estate Brokers", "Brokerage Companies / Agencies", "Sales Agents", "Channel Partners", "Marketing Agencies", "Property Portals"],
    phases: ["Deliver", "Evolve"], status: "Validated",
  },
  {
    id: "banks-financial", number: 9, name: "Banks & Financial Institutions", short: "Banks", cluster: "capital",
    controls: "Debt, mortgages and the custody of project and buyer money — lending and escrow together.",
    boundary: "Merges what an earlier model split: project-finance and mortgage lending sit here alongside escrow trusteeship, payments, insurance and valuation-adjacent financial services. Equity capital — the money that owns rather than lends — is Landowners & Investors, a separate group.",
    members: ["Banks / Project Finance Lenders", "Mortgage Providers", "Islamic Finance Providers", "Escrow Trustee Banks / Escrow Agents", "Payment Service Providers", "Accountants & Auditors", "Fund Administrators", "Insurance Providers & Brokers"],
    phases: ["Originate", "Deliver", "Own", "Evolve"], status: "Validated",
  },
  {
    id: "property-owners", number: 10, name: "Property Owners", short: "Owners", cluster: "market",
    controls: "Purchase commitment and the title that outlives the project — the people who hold ownership, individually or collectively.",
    boundary: "The people who own, including the Owners' Association as their collective. The company a Mollak-registered manager runs on the Association's behalf is Facility & Community Operators, a separate group.",
    members: ["Individual Buyers", "Investor Buyers", "Institutional Buyers", "End Users", "Owners' Associations"],
    phases: ["Deliver", "Own", "Evolve"], status: "Validated",
  },
  {
    id: "residents-tenants", number: 11, name: "Residents & Tenants", short: "Residents", cluster: "operations",
    controls: "Occupation without ownership — the people living in or renting the asset day to day.",
    members: ["Tenants", "Occupants / End Users"],
    phases: ["Own", "Evolve"], status: "Validated",
  },
  {
    id: "facility-community-operators", number: 12, name: "Facility & Community Operators", short: "Operators", cluster: "operations",
    controls: "The asset after handover — condition, cost, community and long-term performance.",
    boundary: "The regulated management function, not the ownership collective: a Mollak-registered Owners' Association management company sits here, while the Association itself sits in Property Owners.",
    members: ["Property Managers", "Facility Managers", "Community Managers", "Maintenance Companies", "Security & Cleaning Providers", "Handover Specialists", "Asset Managers", "Mollak-registered Owners' Association Management Companies"],
    phases: ["Own", "Evolve"], status: "Validated",
  },
];

export const groupById = Object.fromEntries(groups.map((g) => [g.id, g]));
export const clusterById = Object.fromEntries(clusters.map((c) => [c.id, c]));
export const groupsByCluster = (id: ClusterId) => groups.filter((g) => g.cluster === id);

/** The fragmentation the platform exists to resolve. Section 02 of the homepage. */
export const fragments = [
  { title: "Siloed systems", detail: "Each participant runs its own platform, and none of them share a project state.", example: "A buyer, a bank and a developer can each hold a different view of the same project's progress." },
  { title: "Manual handoffs", detail: "Responsibility moves between parties through email and attachments.", example: "A permit, a payment or an approval changes hands with no reliable shared record of what was agreed." },
  { title: "Sequencing delays", detail: "Work stops because a prerequisite nobody tracked was never started.", example: "The dependency existed the whole time; nobody owned it, so nobody saw it coming." },
  { title: "Compliance exposure", detail: "Requirements are jurisdiction-specific and they change.", example: "A team follows last year's process after the emirate's requirement has already moved." },
];

/** Platform architecture. Status stays honest: what is researched and live
 *  versus what is designed but not yet built. A serious buyer will ask to
 *  see it, and an unlabelled roadmap read as product costs more than it wins. */
export const modules = [
  { id: "identity", name: "Identity & Access", copy: "One record per participant, and the roles it plays on each activity — so a bank is a lender in one place and an escrow trustee in another.", status: "To Be Validated" as ContentStatus },
  { id: "lifecycle", name: "Lifecycle State Engine", copy: "Where a project or property currently stands across the seven stages, and what that state makes possible next.", status: "Validated" as ContentStatus },
  { id: "workflow", name: "Workflow Orchestration", copy: "Activities, owners and typed dependencies — what blocks this, what this unblocks, and what runs alongside it.", status: "Validated" as ContentStatus },
  { id: "documents", name: "Document & Evidence Vault", copy: "Every document mapped to where it is produced, where it is consumed, and which approval it supports.", status: "To Be Validated" as ContentStatus },
  { id: "integration", name: "Authority Integrations", copy: "Connections to the official portals and counterparty systems that remain the system of record. REOS coordinates; it does not replace them.", status: "Future REOS Capability" as ContentStatus },
  { id: "sla", name: "Notifications & SLA Management", copy: "Who owes what, to whom, by when — and escalation when a prerequisite is quietly slipping.", status: "Future REOS Capability" as ContentStatus },
  { id: "analytics", name: "Analytics & Intelligence", copy: "Progress, cost, approval and escrow position read against one another instead of in separate reconciliations.", status: "To Be Validated" as ContentStatus },
  { id: "ai", name: "AI Intelligence Layer", copy: "Guidance assembled from the connected model, where every claim carries its source. The system may not assert what the model does not hold.", status: "Future REOS Capability" as ContentStatus },
];

/** Outcomes, stated per audience rather than as generic benefits. */
export const outcomes = [
  { audience: "For buyers", claim: "Understand the process before committing", copy: "See what to verify, which official channel confirms it, and what should already be in place before money moves." },
  { audience: "For investors", claim: "See risk and dependency, not just price", copy: "Where capital enters, what controls protect it, and which approvals sit between today and completion." },
  { audience: "For developers", claim: "Coordinate stakeholders and stages", copy: "Prerequisites surface before they block, and handoffs between parties stay traceable." },
  { audience: "For banks", claim: "Tie finance to delivery state", copy: "Escrow position, verified progress and the official register read against one another." },
  { audience: "For authorities", claim: "Better-prepared submissions", copy: "Applicants who arrive understanding the sequence, the prerequisites and the evidence required." },
  { audience: "For service providers", claim: "See where your work fits", copy: "Which approval your output serves, who is waiting on it, and what becomes possible once it is issued." },
];

/** Knowledge Hub categories. Each becomes a section of the Insights index. */
export const insightCategories = [
  { id: "buyer-guides", name: "Buyer guides", copy: "Step-by-step explanations for people buying a home or first property in the UAE." },
  { id: "investor-guides", name: "Investor guides", copy: "Decision points, risk checklists and exit planning across the asset lifecycle." },
  { id: "developer-guides", name: "Developer guides", copy: "Entity setup, approvals, escrow, procurement and handover readiness." },
  { id: "regulation", name: "Regulation explainers", copy: "What the rules require, written in plain language and linked to the official source." },
  { id: "authority-processes", name: "Authority processes", copy: "Who governs what, which portal handles it, and what each submission needs." },
  { id: "handover", name: "Handover & snagging", copy: "Completion, inspection, defects and the liability period after you receive keys." },
  { id: "escrow-finance", name: "Escrow & finance", copy: "How project money is controlled, released and audited across a development." },
  { id: "community", name: "Community living", copy: "Service charges, owners' associations, cooling and how communities are run." },
  { id: "management", name: "Property management", copy: "Maintenance, reserve funds, compliance and long-term asset performance." },
];

import type { ContentStatus } from "./reos";

/**
 * The stakeholder ecosystem.
 *
 * Twelve groups classify ACTOR TYPES. Four clusters group them for navigation.
 * Group 03 is deliberately typed as a regulatory RAIL rather than a cluster
 * member: authorities issue the approvals that gate every other group, so they
 * are compulsory and external where every other participant is appointed and
 * commercial. Group 12 is cross-cutting for the same structural reason.
 */

export type ClusterId = "capital" | "delivery" | "assurance" | "market" | "rail" | "enablers";

export type Cluster = {
  id: ClusterId;
  name: string;
  short: string;
  controls: string;
  layer: "cluster" | "rail" | "cross-cutting";
};

export type Group = {
  id: string;
  number: number;
  name: string;
  short: string;
  cluster: ClusterId;
  controls: string;
  members: string[];
  phases: ("Originate" | "Deliver" | "Own" | "Evolve")[];
  status: ContentStatus;
};

export const clusters: Cluster[] = [
  { id: "capital", name: "Capital & Ownership", short: "Capital", controls: "Who owns the project and who funds it", layer: "cluster" },
  { id: "delivery", name: "Delivery & Technical", short: "Delivery", controls: "Who designs it and who builds it", layer: "cluster" },
  { id: "assurance", name: "Money & Assurance", short: "Assurance", controls: "Who holds, verifies, insures and defends", layer: "cluster" },
  { id: "market", name: "Market & Operations", short: "Market", controls: "Who sells, occupies, services and operates", layer: "cluster" },
  { id: "rail", name: "Regulatory Rail", short: "Regulatory", controls: "Who issues the approvals that gate everything above", layer: "rail" },
  { id: "enablers", name: "Cross-Cutting Enablers", short: "Enablers", controls: "Who supports across every stage and group", layer: "cross-cutting" },
];

export const groups: Group[] = [
  {
    id: "land-developer", number: 1, name: "Land, Developer & Project Ownership", short: "Developers", cluster: "capital",
    controls: "Development rights, project control and the ownership structure that carries them.",
    members: ["Landowners", "Property Developers", "Master Developers", "Development Companies", "Joint Venture Partners", "Special Purpose Vehicles", "Owner-side Development Managers"],
    phases: ["Originate", "Deliver", "Own"], status: "Validated",
  },
  {
    id: "investors", number: 2, name: "Investors & Capital Providers", short: "Capital", cluster: "capital",
    controls: "The capital that enters the project and the conditions attached to it.",
    members: ["Equity Investors", "Institutional Investors", "Family Offices", "Investment Funds", "Project Finance Lenders", "Mortgage Lenders", "Islamic Finance Providers"],
    phases: ["Originate", "Deliver", "Evolve"], status: "Validated",
  },
  {
    id: "authorities", number: 3, name: "Government, Regulatory & Registration Authorities", short: "Authorities", cluster: "rail",
    controls: "Permission. Every approval, registration and licence that gates a project.",
    members: ["Federal Authorities", "Emirate Authorities", "Municipalities", "Real Estate Regulators", "Planning Authorities", "Building & Construction Authorities", "Land Registration Authorities", "Economic Licensing Authorities", "Free-zone Regulators", "Registration Trustee Offices"],
    phases: ["Originate", "Deliver", "Own", "Evolve"], status: "Validated",
  },
  {
    id: "consultants", number: 4, name: "Design, Engineering & Technical Consultants", short: "Consultants", cluster: "delivery",
    controls: "The design intent, the technical submissions and the professional liability behind them.",
    members: ["Architects", "Master Planners", "Urban Designers", "Structural Engineers", "MEP Consultants", "Civil Engineers", "Geotechnical Consultants", "Surveyors", "Quantity Surveyors", "Environmental Consultants", "Project Management Consultants"],
    phases: ["Originate", "Deliver"], status: "Validated",
  },
  {
    id: "contractors", number: 5, name: "Contractors & Construction Supply Chain", short: "Contractors", cluster: "delivery",
    controls: "Physical delivery, programme and the supply chain that determines both.",
    members: ["Main Contractors", "Subcontractors", "Specialist Contractors", "Suppliers", "Manufacturers", "Material Vendors", "Equipment Providers"],
    phases: ["Deliver"], status: "Validated",
  },
  {
    id: "escrow-financial", number: 6, name: "Banking, Escrow & Financial Operations", short: "Escrow", cluster: "assurance",
    controls: "Custody and control of project money — distinct from those who provide it.",
    members: ["Escrow Trustee Banks", "Escrow Agents", "Payment Service Providers", "Accountants", "Project Auditors", "Fund Administrators"],
    phases: ["Deliver", "Own"], status: "Validated",
  },
  {
    id: "legal-assurance", number: 7, name: "Legal, Compliance, Insurance & Assurance", short: "Assurance", cluster: "assurance",
    controls: "Enforceable obligations, transferred risk and independent verification.",
    members: ["Law Firms", "Legal Advisors", "Corporate Service Providers", "Compliance Professionals", "Insurance Providers", "Risk Advisors", "Due-Diligence Providers", "Notaries", "Third-party Inspection Bodies", "Testing Laboratories", "Certification Bodies"],
    phases: ["Originate", "Deliver", "Own", "Evolve"], status: "Validated",
  },
  {
    id: "sales-brokerage", number: 8, name: "Real Estate Sales, Marketing & Brokerage", short: "Brokerage", cluster: "market",
    controls: "Demand, representation and the permitted marketing of inventory.",
    members: ["Real Estate Brokers", "Brokerage Companies", "Sales Agents", "Mortgage Brokers", "Marketing Agencies", "Property Portals", "Lead Generation Providers"],
    phases: ["Deliver", "Evolve"], status: "Validated",
  },
  {
    id: "customers", number: 9, name: "Customers, Buyers & End Users", short: "Customers", cluster: "market",
    controls: "Purchase commitment, occupation and the ownership that outlives the project.",
    members: ["Individual Buyers", "Investor Buyers", "Institutional Buyers", "End Users", "Property Owners", "Tenants", "Owners' Associations"],
    phases: ["Deliver", "Own", "Evolve"], status: "Validated",
  },
  {
    id: "utilities", number: 10, name: "Utilities & Infrastructure Providers", short: "Utilities", cluster: "market",
    controls: "Connection, capacity and the servicing without which nothing can be occupied.",
    members: ["Electricity Providers", "Water Providers", "District Cooling Providers", "Telecommunications Providers", "Gas Providers", "Waste Management", "Roads & Transport Authorities"],
    phases: ["Deliver", "Own"], status: "Validated",
  },
  {
    id: "operations", number: 11, name: "Property & Community Operators", short: "Operations", cluster: "market",
    controls: "The asset after handover — condition, cost, community and long-term performance.",
    members: ["Property Managers", "Facility Managers", "Community Managers", "Maintenance Companies", "Security Providers", "FM Contractors", "Handover Specialists", "Asset Managers", "OA Management Companies"],
    phases: ["Own", "Evolve"], status: "Validated",
  },
  {
    id: "enablers", number: 12, name: "Supporting & Specialised Ecosystem", short: "Enablers", cluster: "enablers",
    controls: "Valuation, evidence, technology and expertise that other groups depend on at specific gates.",
    members: ["Property Valuers", "Real Estate Researchers", "Market Intelligence Providers", "Technology Providers", "PropTech Companies", "Data Providers", "ESG Consultants", "Dispute Resolution Professionals", "Training & Certification Bodies", "Residency Service Providers"],
    phases: ["Originate", "Deliver", "Own", "Evolve"], status: "Validated",
  },
];

export const groupById = Object.fromEntries(groups.map((g) => [g.id, g]));
export const clusterById = Object.fromEntries(clusters.map((c) => [c.id, c]));
export const groupsByCluster = (id: ClusterId) => groups.filter((g) => g.cluster === id);

/** The fragmentation the platform exists to resolve. Section 02 of the homepage. */
export const fragments = [
  { title: "Siloed systems", detail: "Each participant runs its own platform. None of them share a project state, so the same facts are re-entered at every handoff." },
  { title: "Manual handoffs", detail: "Responsibility moves between parties through email and attachments. What was agreed, and by whom, becomes unreconstructable." },
  { title: "Sequencing delays", detail: "Work stops because a prerequisite nobody tracked was never started. The dependency existed; the visibility did not." },
  { title: "Compliance exposure", detail: "Requirements are jurisdiction-specific and change. Teams act on last year's process without knowing it moved." },
];

/** Platform architecture. Status stays honest: what is researched and live
 *  versus what is designed but not yet built. A serious buyer will ask to
 *  see it, and an unlabelled roadmap read as product costs more than it wins. */
export const modules = [
  { id: "identity", name: "Identity & Access", copy: "One record per participant, and the roles it plays on each activity \u2014 so a bank is a lender in one place and an escrow trustee in another.", status: "To Be Validated" as ContentStatus },
  { id: "lifecycle", name: "Lifecycle State Engine", copy: "Where a project or property currently stands across the twelve stages, and what that state makes possible next.", status: "Validated" as ContentStatus },
  { id: "workflow", name: "Workflow Orchestration", copy: "Activities, owners and typed dependencies \u2014 what blocks this, what this unblocks, and what runs alongside it.", status: "Validated" as ContentStatus },
  { id: "documents", name: "Document & Evidence Vault", copy: "Every document mapped to where it is produced, where it is consumed, and which approval it supports.", status: "To Be Validated" as ContentStatus },
  { id: "integration", name: "Integration Fabric", copy: "Connections to the official portals and counterparty systems that remain the system of record. REOS coordinates; it does not replace them.", status: "Future REOS Capability" as ContentStatus },
  { id: "sla", name: "Notifications & SLA Management", copy: "Who owes what, to whom, by when \u2014 and escalation when a prerequisite is quietly slipping.", status: "Future REOS Capability" as ContentStatus },
  { id: "analytics", name: "Analytics & Intelligence", copy: "Progress, cost, approval and escrow position read against one another instead of in separate reconciliations.", status: "To Be Validated" as ContentStatus },
  { id: "ai", name: "AI Guidance & Insights", copy: "Guidance assembled from the connected model, where every claim carries its source. The system may not assert what the model does not hold.", status: "Future REOS Capability" as ContentStatus },
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

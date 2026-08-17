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

/** Platform architecture. Status is honest: what is live, and what is designed. */
export const modules = [
  { id: "identity", name: "Identity & Roles", copy: "One record for each participant, and the roles it plays on each activity — so a bank is a lender here and a trustee there.", status: "To Be Validated" as ContentStatus },
  { id: "workflow", name: "Lifecycle Workflow", copy: "Activities, phases and typed dependencies. What blocks this, what this unblocks, and what runs alongside it.", status: "Validated" as ContentStatus },
  { id: "documents", name: "Documents & Approvals", copy: "Every approval modelled with its issuer, prerequisites, inputs and validity — and every document mapped to where it is produced and consumed.", status: "To Be Validated" as ContentStatus },
  { id: "integrations", name: "Authority & System Map", copy: "Which authority governs which decision, through which portal, under which jurisdiction. Official systems remain the system of record.", status: "Validated" as ContentStatus },
  { id: "ai", name: "Journey Intelligence", copy: "Constrained assembly across the graph: the model sequences and explains, but may assert nothing the graph does not carry with a source.", status: "Future REOS Capability" as ContentStatus },
  { id: "analytics", name: "Evidence & Provenance", copy: "Source, issuing authority, jurisdiction, effective date and last-verified date recorded against each operative claim.", status: "Validated" as ContentStatus },
];

/** Section 06 — what changes for an organisation that runs on a connected model. */
export const outcomes = [
  { metric: "Sequencing", claim: "Approvals in dependency order", copy: "Prerequisites surface before they block. The chain that leads to each approval is explicit rather than institutional memory." },
  { metric: "Handoffs", claim: "Responsibility stays traceable", copy: "Every transfer between stakeholders names what moved, who holds it now, and what the receiving party needs to proceed." },
  { metric: "Escrow", claim: "Money tied to delivery state", copy: "Payment events, construction progress and registration read against one another instead of three reconciliations." },
  { metric: "Lifecycle", claim: "One state from land to resale", copy: "The project, and then the property, keeps a continuous record across parties that would otherwise each hold a fragment." },
];

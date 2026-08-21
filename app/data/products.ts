export type ProductMarket = "B2B" | "B2G" | "B2C";

export type ReosProduct = {
  slug: string;
  number: number;
  name: string;
  category: string;
  status: "First product" | "Next product";
  availability: "Licensing preview" | "In development";
  summary: string;
  outcome: string;
  markets: ProductMarket[];
  stakeholders: string[];
  capabilities: string[];
};

/**
 * The commercial REOS product catalogue. New products are added here once,
 * then appear in the Platform hero, catalogue and footer. Each published
 * product also gets an explicit route using the shared ProductLoginView.
 */
export const products: ReosProduct[] = [
  {
    slug: "title-deed-automation",
    number: 1,
    name: "Title Deed Automation",
    category: "Ownership & registration",
    status: "First product",
    availability: "Licensing preview",
    summary: "Coordinate the evidence, reviews, parties and handoffs required to move an eligible property case toward title registration.",
    outcome: "A controlled, traceable title-deed workflow with the official registry remaining the system of record.",
    markets: ["B2B", "B2G", "B2C"],
    stakeholders: ["Developers", "Authorities & Regulators", "Brokers & Agencies", "Banks & Financial Institutions", "Property Owners", "Landowners & Investors"],
    capabilities: ["Case intake", "Document readiness", "Approval routing", "Status visibility", "Audit trail"],
  },
  {
    slug: "noc-automation",
    number: 2,
    name: "NOC Automation",
    category: "Approvals & clearances",
    status: "Next product",
    availability: "In development",
    summary: "Coordinate no-objection certificate requests across the organization, applicant and issuing party without treating every NOC as the same process.",
    outcome: "A jurisdiction-aware NOC workflow that makes prerequisites, ownership, evidence and downstream dependencies visible.",
    markets: ["B2B", "B2G", "B2C"],
    stakeholders: ["Developers", "Authorities & Regulators", "Utility Providers", "Consultants & Designers", "Contractors", "Property Owners"],
    capabilities: ["NOC type selection", "Prerequisite checks", "Submission workflow", "Clarification handling", "Expiry tracking"],
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

import { products, type ReosProduct } from "./products";

export const REOS_VALUE_PROPOSITION = "REOS connects the people, evidence, approvals and workflows behind every stage of the UAE property journey—then turns that operating model into governed digital products.";

export const HOW_REOS_WORKS = [
  { number: "01", name: "Understand", copy: "Learn the applicable journey, terminology, rules and authority context." },
  { number: "02", name: "Map", copy: "Connect the stage, stakeholders, evidence, approvals and dependencies." },
  { number: "03", name: "Prepare", copy: "Establish readiness, resolve missing evidence and identify who acts next." },
  { number: "04", name: "Execute", copy: "Run a licensed REOS workflow while official systems retain legal authority." },
  { number: "05", name: "Govern", copy: "Preserve sources, decisions, versions, ownership and audit history." },
] as const;

const productStageIds: Record<string, string[]> = {
  "title-deed-automation": ["sales-transfer", "asset-growth-intelligence"],
  "noc-automation": ["planning-design", "authorities-approvals", "construction-delivery", "sales-transfer", "living-operations"],
};

const productStakeholderIds: Record<string, string[]> = {
  "title-deed-automation": ["landowners-investors", "developers", "authorities-regulators", "brokers-agencies", "banks-financial", "property-owners"],
  "noc-automation": ["developers", "authorities-regulators", "utility-providers", "consultants-designers", "contractors", "property-owners"],
};

export function productsForContext({ stageIds = [], stakeholderIds = [] }: { stageIds?: string[]; stakeholderIds?: string[] }): ReosProduct[] {
  const exact = products.filter((product) => {
    const stageMatch = stageIds.some((id) => productStageIds[product.slug]?.includes(id));
    const stakeholderMatch = stakeholderIds.some((id) => productStakeholderIds[product.slug]?.includes(id));
    if (stageIds.length > 0 && stakeholderIds.length > 0) return stageMatch && stakeholderMatch;
    return stageMatch || stakeholderMatch;
  });
  return exact.length > 0 ? exact : products;
}

export const productMaturityDefinitions = [
  ["Live", "Generally available to licensed customers."],
  ["Pilot", "Operating with a controlled customer cohort and defined scope."],
  ["Early Access", "Available to qualified design partners before general release."],
  ["Coming Soon", "Planned or in development; no operational access is implied."],
] as const;

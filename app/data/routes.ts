/**
 * THE ROUTE LIST — the self-selection entry point.
 *
 * Ordered by real-world frequency, not by taxonomy number. The internal
 * `taxonomyGroup` maps each route back to the twelve-group stakeholder model
 * in ecosystem.ts; it is never rendered.
 *
 * Route content (steps, documents, risks) lives in personas.ts and is keyed by
 * the same slug. A route without a persona entry renders a "being published"
 * state rather than a dead link — the route stays visible because hiding it
 * would misrepresent the ecosystem.
 */
export type Route = {
  order: number;
  slug: string;
  tier: 1 | 2 | 3;
  title: string;
  ctaLabel: string;
  sub: string;
  journey: string[];
  /** INTERNAL ONLY — never rendered. Maps to the twelve stakeholder groups.
   *  Route 05 spans two groups: capital providers and the parties that
   *  operate project money, so it carries both. */
  taxonomyGroup: number | number[];
  /** Old URLs that must keep resolving to this route. */
  aliases?: string[];
  /** Where this route's written content lives in personas.ts, when the route
   *  was renamed but the content was not. Defaults to `slug`. */
  personaSlug?: string;
};

export const routes: Route[] = [
  {
    order: 1, slug: "buying", tier: 1, taxonomyGroup: 9,
    title: "I am buying or I own property",
    ctaLabel: "Buyer & owner journey",
    sub: "From first search to keys in hand — what to verify, what to sign, and what protects your money along the way.",
    journey: ["Discover", "Verify", "Reserve", "Contract", "Finance", "Register", "Handover", "Own"],
  },
  {
    order: 2, slug: "developing", tier: 1, taxonomyGroup: 1,
    title: "I am developing a project",
    ctaLabel: "Developer journey",
    sub: "Every approval, appointment, dependency and handoff between buying a plot and handing over the last unit.",
    journey: ["Land", "Project registration", "Design approvals", "Escrow", "Construction", "Completion", "Title deed", "Handover"],
  },
  {
    order: 3, slug: "investing", tier: 2, taxonomyGroup: 2,
    title: "I am investing in property",
    ctaLabel: "Investor journey",
    sub: "See where capital enters, what controls protect it, which risks concentrate where, and how an exit actually works.",
    journey: ["Screen", "Structure", "Commit", "Monitor", "Exit"],
  },
  {
    order: 4, slug: "selling", tier: 2, taxonomyGroup: 8,
    title: "I am selling or brokering property",
    ctaLabel: "Broker & sales journey",
    sub: "Listing to closing — what you must be licensed to do, what you must disclose, and where deals actually stall.",
    journey: ["List", "Match", "Offer", "Contract", "Transfer", "Commission"],
  },
  {
    order: 5, slug: "financing", tier: 2, taxonomyGroup: [2, 6],
    title: "I am financing property",
    ctaLabel: "Bank & financier journey",
    sub: "Where money enters, what controls it, how progress is verified, and what evidence supports each release.",
    journey: ["Assess", "Approve", "Secure", "Disburse", "Monitor", "Discharge"],
  },
  {
    order: 6, slug: "design-engineering", tier: 2, taxonomyGroup: 4,
    aliases: ["professional-services"], personaSlug: "professional-services",
    title: "I am designing or engineering a project",
    ctaLabel: "Consultant & engineer journey",
    sub: "Appointment to completion certificate — what you must produce, who signs it off, and what your liability covers.",
    journey: ["Appointment", "Concept", "Authority submission", "Supervision", "Certification"],
  },
  {
    order: 7, slug: "building", tier: 2, taxonomyGroup: 5,
    title: "I am building or supplying",
    ctaLabel: "Contractor & supplier journey",
    sub: "What must exist before you mobilise, what you must evidence during construction, and what completion actually requires.",
    journey: ["Tender", "Award", "Mobilise", "Build", "Test", "Handover"],
  },
  {
    order: 8, slug: "legal-compliance", tier: 3, taxonomyGroup: 7,
    title: "I provide legal, compliance or insurance services",
    ctaLabel: "Legal & compliance journey",
    sub: "Your appointment, your submissions, your liability, and the parties whose work depends on yours.",
    journey: ["Appointment", "Advice", "Documentation", "Compliance", "Dispute"],
  },
  {
    order: 9, slug: "managing", tier: 3, taxonomyGroup: 11,
    title: "I manage property or facilities",
    ctaLabel: "Property & facility manager journey",
    sub: "Taking the building on, running it well, funding it correctly and keeping the record intact for whoever comes next.",
    journey: ["Handover", "Onboard", "Operate", "Fund", "Report"],
  },
  {
    order: 10, slug: "utilities", tier: 3, taxonomyGroup: 10,
    title: "I provide utilities or infrastructure",
    ctaLabel: "Utilities & infrastructure journey",
    sub: "Connection, capacity and commissioning — what a project needs from you, and when it needs it.",
    journey: ["Capacity", "Design review", "Connection", "Commissioning", "Activation"],
  },
  {
    order: 11, slug: "regulators", tier: 3, taxonomyGroup: 3,
    title: "I am an authority or regulator",
    ctaLabel: "Authority & regulator view",
    sub: "Where approvals gate the journey, what evidence supports each decision, and how status flows back to participants.",
    journey: ["Submission", "Review", "Decision", "Registration", "Oversight"],
  },
  {
    order: 12, slug: "specialist-services", tier: 3, taxonomyGroup: 12,
    title: "I provide specialist or advisory services",
    ctaLabel: "Specialist services journey",
    sub: "Valuation, data, technology, ESG and residency services — where your work enters the journey and who depends on it.",
    journey: ["Instruction", "Analysis", "Report", "Reliance", "Review"],
  },
];

/** The orientation helper is not a stakeholder group and is never numbered. */
export const orientation = {
  slug: "new-to-uae",
  title: "Not sure which applies to you?",
  sub: "Start with the orientation route — it explains how the UAE market is structured, what the common terms mean, and which route fits you, before asking you to pick a role.",
  ctaLabel: "Start with orientation",
};

/** The persona key that holds this route's content. */
export const contentSlug = (r: Route) => r.personaSlug ?? r.slug;

export const routeBySlug = Object.fromEntries(routes.map((r) => [r.slug, r]));

/** Resolve a slug or one of its historical aliases. */
export function resolveRoute(slug: string): Route | undefined {
  return routes.find((r) => r.slug === slug || r.aliases?.includes(slug));
}

/** Every slug that must return a page, including retired ones. */
export const allRouteSlugs = routes.flatMap((r) => [r.slug, ...(r.aliases ?? [])]);

export const tier = (n: 1 | 2 | 3) => routes.filter((r) => r.tier === n);

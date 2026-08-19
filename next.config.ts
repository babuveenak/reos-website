import type { NextConfig } from "next";
import { legacyStakeholderToGroup } from "./app/data/stakeholderDetails";

/**
 * REOS IA Freeze v1.0, 2026-08-19: /journey, /roles, /insights, /glossary
 * and several old ids were retired in favour of /property-journey,
 * /stakeholders, /intelligence, /intelligence/guides and
 * /intelligence/definitions-and-glossary. These redirects preserve every
 * historical URL (and its SEO equity) rather than leaving them to 404.
 *
 * The stage ids below are NOT this pass's own rename (that was
 * handover-operations→living-operations, an id that was never actually
 * committed). They're the real, currently-live 12-stage ids this repo
 * shipped with before ANY of this session's work — confirmed against
 * `git show HEAD:app/data/journey.ts` — collapsed onto the current 7. A
 * redirect keyed to an id that was never live protects nothing; these are
 * keyed to what a real bookmark or indexed URL actually points at.
 * construction-delivery is the one id that didn't change and needs no rule.
 *
 * Each rule is duplicated under /ar because this site prefixes Arabic routes
 * manually rather than through Next.js's built-in locale routing.
 */
const legacyRedirects = [
  // Whole-route renames.
  ["/journey", "/property-journey"],
  ["/roles", "/intelligence/guides"],
  ["/insights", "/intelligence"],
  ["/glossary", "/intelligence/definitions-and-glossary"],

  // The real old 12-stage ids, ahead of the general /journey wildcard below
  // so each lands on its correct new stage rather than a 404. Where an old
  // stage's content split or merged, this points at the new stage that
  // carries the larger or more literal share of its meaning.
  ["/journey/land-ownership", "/property-journey/land-vision"],
  ["/journey/project-formation", "/property-journey/land-vision"],
  ["/journey/planning-feasibility", "/property-journey/land-vision"],
  ["/journey/design-approvals", "/property-journey/planning-design"],
  ["/journey/finance-escrow", "/property-journey/sales-transfer"],
  ["/journey/marketing-sales", "/property-journey/sales-transfer"],
  ["/journey/registration-compliance", "/property-journey/sales-transfer"],
  ["/journey/handover-snagging", "/property-journey/living-operations"],
  ["/journey/occupancy-community", "/property-journey/living-operations"],
  ["/journey/property-management", "/property-journey/asset-growth-intelligence"],
  ["/journey/investment-resale", "/property-journey/asset-growth-intelligence"],

  // General wildcard: a safety net for any /journey/:stage or /roles/:slug
  // id not covered above (e.g. every /roles slug is unchanged, only the
  // parent segment moved).
  ["/journey/:stage", "/property-journey/:stage"],
  ["/roles/:slug", "/intelligence/guides/:slug"],

  // The eight legacy stakeholder ids (app/data/reos.ts, unchanged this
  // session), folded into the twelve canonical groups. Master developer and
  // developer both fold into "developers". Derived from the same
  // legacyStakeholderToGroup map app/stakeholders/[slug] and
  // app/lifecycle/[slug] use, so the mapping can't drift between the two.
  ...Object.entries(legacyStakeholderToGroup).map(
    ([oldId, groupId]) => [`/stakeholders/${oldId}`, `/stakeholders/${groupId}`],
  ),
];

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  async redirects() {
    return legacyRedirects.flatMap(([source, destination]) => [
      { source, destination, permanent: true },
      { source: `/ar${source}`, destination: `/ar${destination}`, permanent: true },
    ]);
  },
};

export default nextConfig;

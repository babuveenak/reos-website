import type { MetadataRoute } from "next";
import { journeys } from "./data/phase1";
import { stages } from "./data/journey";
import { groups } from "./data/ecosystem";
import { orientation, routes } from "./data/routes";
import { lifecycleStages } from "./data/reos";
import { SITE_URL } from "./data/site";
import { LOCALES, localePath } from "./i18n/config";
import { approvedRelationships } from "./data/relationships";
import { allSteps, gateways, stakeholderGroups } from "./data/gateways";

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] =>
    ({ url: `${SITE_URL}${path}`, changeFrequency: "monthly", priority });

  // Every route is emitted for both locales so each language is crawlable.
  const base = [
    entry("", 1),
    entry("/assistant", 0.95),
    entry("/property-journey", 0.9),
    entry("/stakeholders", 0.9),
    entry("/ecosystem", 0.9),
    entry("/platform", 0.8),
    entry("/platform/evaluation", 0.76),
    entry("/trust-centre", 0.76),
    entry("/intelligence", 0.8),
    entry("/intelligence/definitions-and-glossary", 0.75),
    entry("/authorities", 0.8),
    entry("/lifecycle", 0.7),
    entry("/about", 0.6),
    entry("/demo", 0.6),
    ...stages.map((s) => entry(`/property-journey/${s.id}`, 0.85)),
    ...groups.map((g) => entry(`/stakeholders/${g.id}`, 0.85)),
    ...routes.map((route) => entry(`/intelligence/guides/${route.slug}`, 0.8)),
    entry(`/intelligence/guides/${orientation.slug}`, 0.8),
    ...lifecycleStages.map((s) => entry(`/lifecycle/${s.id}`, 0.7)),
    ...journeys.map((j) => entry(`/journeys/${j.slug}`, 0.5)),
  ];
  const localizedEntries = LOCALES.flatMap((l) =>
    base.map((e) => ({ ...e, url: `${SITE_URL}${localePath(l, new URL(e.url).pathname)}` })),
  );
  const relationshipEntries = approvedRelationships.map((relationship) =>
    entry(relationship.detailRoute, 0.72),
  );
  const processEntries = [
    entry("/journey", 0.95), entry("/matrix", 0.9), entry("/roles", 0.8),
    entry("/documents", 0.76), entry("/evidence", 0.76), entry("/decisions", 0.76),
    entry("/user-happiness", 0.88), entry("/glossary", 0.7), entry("/search", 0.72),
    ...gateways.map((gateway) => entry(`/gateway/${gateway.slug}`, 0.9)),
    ...stakeholderGroups.map((group) => entry(`/groups/${group.displayId}`, 0.78)),
    ...allSteps.map((step) => entry(`/steps/${step.id}`, 0.74)),
  ];
  return [...localizedEntries, ...relationshipEntries, ...processEntries];
}

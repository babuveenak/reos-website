import type { MetadataRoute } from "next";
import { journeys } from "./data/phase1";
import { stages } from "./data/journey";
import { personas } from "./data/personas";
import { lifecycleStages, stakeholders } from "./data/reos";
import { SITE_URL } from "./data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] =>
    ({ url: `${SITE_URL}${path}`, changeFrequency: "monthly", priority });

  return [
    entry("", 1),
    entry("/journey", 0.9),
    entry("/roles", 0.9),
    entry("/ecosystem", 0.9),
    entry("/platform", 0.8),
    entry("/insights", 0.8),
    entry("/authorities", 0.8),
    entry("/lifecycle", 0.7),
    entry("/stakeholders", 0.7),
    entry("/about", 0.6),
    entry("/demo", 0.6),
    ...stages.map((s) => entry(`/journey/${s.id}`, 0.85)),
    ...personas.map((p) => entry(`/roles/${p.slug}`, 0.85)),
    ...lifecycleStages.map((s) => entry(`/lifecycle/${s.id}`, 0.7)),
    ...stakeholders.map((s) => entry(`/stakeholders/${s.id}`, 0.7)),
    ...journeys.map((j) => entry(`/journeys/${j.slug}`, 0.5)),
  ];
}

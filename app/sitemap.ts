import type { MetadataRoute } from "next";
import { journeys } from "./data/phase1";
import { lifecycleStages, stakeholders } from "./data/reos";

const base = "https://reos-website.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] =>
    ({ url: `${base}${path}`, changeFrequency: "monthly", priority });

  return [
    entry("", 1),
    entry("/lifecycle", 0.9),
    entry("/stakeholders", 0.9),
    entry("/authorities", 0.8),
    entry("/reos", 0.7),
    ...lifecycleStages.map((stage) => entry(`/lifecycle/${stage.id}`, 0.8)),
    ...stakeholders.map((person) => entry(`/stakeholders/${person.id}`, 0.8)),
    ...journeys.map((journey) => entry(`/journeys/${journey.slug}`, 0.6)),
  ];
}

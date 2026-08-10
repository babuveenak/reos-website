import type { MetadataRoute } from "next";
import { lifecycleStages, stakeholders } from "./data/reos";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://reos-property.sites.openai.com";
  return ["", "/lifecycle", "/stakeholders", "/authorities", "/reos"].map((path) => ({ url: `${base}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.8 })).concat(stakeholders.map((item) => ({ url: `${base}/stakeholders/${item.id}`, changeFrequency: "monthly" as const, priority: 0.7 })), lifecycleStages.map((item) => ({ url: `${base}/lifecycle/${item.id}`, changeFrequency: "monthly" as const, priority: 0.6 })));
}


import type { MetadataRoute } from "next";
import { journeys } from "./data/phase1";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://reos-website.vercel.app";
  return ["", "/stakeholders", "/authorities", "/reos"].map((path) => ({ url: `${base}${path}`, changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.8 })).concat(journeys.map((item) => ({ url: `${base}/journeys/${item.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })));
}

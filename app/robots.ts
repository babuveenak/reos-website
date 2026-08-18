import type { MetadataRoute } from "next";
import { SITE_URL } from "./data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // /admin is an internal skeleton: no index, and it is absent from the sitemap.
    rules: { userAgent: "*", allow: "/", disallow: ["/admin"] },
    // Derived from SITE_URL rather than hardcoded, so the sitemap this points at
    // and the URLs inside it always agree on the origin.
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}


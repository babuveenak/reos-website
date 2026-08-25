import type { Metadata } from "next";
import { PublicSitemapPage } from "../components/PublicSitemapPage";

export const metadata: Metadata = {
  title: "Sitemap | REOS",
  description: "Browse the main public pages, journey stages and stakeholder groups on REOS.",
  alternates: { canonical: "/sitemap", languages: { en: "/sitemap", ar: "/ar/sitemap" } },
};

export default function SitemapPage() {
  return <PublicSitemapPage />;
}

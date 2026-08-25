import type { Metadata } from "next";
import { PublicSitemapPage } from "../../components/PublicSitemapPage";

export const metadata: Metadata = { title: "خريطة الموقع | REOS", description: "تصفّح الصفحات العامة ومراحل الرحلة ومجموعات أصحاب المصلحة في REOS.", alternates: { canonical: "/ar/sitemap", languages: { en: "/sitemap", ar: "/ar/sitemap" } } };

export default function SitemapPage() {
  return <PublicSitemapPage locale="ar" />;
}

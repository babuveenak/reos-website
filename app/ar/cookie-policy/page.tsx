import type { Metadata } from "next";
import { PublicDocumentPage } from "../../components/PublicDocumentPage";

export const metadata: Metadata = { title: "سياسة ملفات الارتباط | REOS", description: "استخدام ملفات الارتباط وتقنيات تخزين المتصفح في موقع REOS العام.", alternates: { canonical: "/ar/cookie-policy", languages: { en: "/cookie-policy", ar: "/ar/cookie-policy" } } };

export default function CookiePolicyPage() {
  return <PublicDocumentPage document="cookies" locale="ar" />;
}

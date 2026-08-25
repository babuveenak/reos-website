import type { Metadata } from "next";
import { PublicDocumentPage } from "../../components/PublicDocumentPage";

export const metadata: Metadata = { title: "شروط الاستخدام | REOS", description: "الشروط المطبقة على موقع REOS العام ومحتواه المعلوماتي.", alternates: { canonical: "/ar/terms", languages: { en: "/terms", ar: "/ar/terms" } } };

export default function TermsPage() {
  return <PublicDocumentPage document="terms" locale="ar" />;
}

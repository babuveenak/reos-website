import type { Metadata } from "next";
import { PublicDocumentPage } from "../../components/PublicDocumentPage";

export const metadata: Metadata = { title: "سياسة الخصوصية | REOS", description: "كيف تتعامل RESO مع المعلومات الشخصية عبر موقع REOS العام.", alternates: { canonical: "/ar/privacy-policy", languages: { en: "/privacy-policy", ar: "/ar/privacy-policy" } } };

export default function PrivacyPolicyPage() {
  return <PublicDocumentPage document="privacy" locale="ar" />;
}

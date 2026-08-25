import type { Metadata } from "next";
import { PublicDocumentPage } from "../components/PublicDocumentPage";

export const metadata: Metadata = {
  title: "Privacy Policy | REOS",
  description: "How RESO handles personal information through the public REOS website.",
  alternates: { canonical: "/privacy-policy", languages: { en: "/privacy-policy", ar: "/ar/privacy-policy" } },
};

export default function PrivacyPolicyPage() {
  return <PublicDocumentPage document="privacy" />;
}

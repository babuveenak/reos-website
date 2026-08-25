import type { Metadata } from "next";
import { PublicDocumentPage } from "../components/PublicDocumentPage";

export const metadata: Metadata = {
  title: "Terms of Use | REOS",
  description: "Terms that apply to the public REOS website and its informational content.",
  alternates: { canonical: "/terms", languages: { en: "/terms", ar: "/ar/terms" } },
};

export default function TermsPage() {
  return <PublicDocumentPage document="terms" />;
}

import type { Metadata } from "next";
import { PublicDocumentPage } from "../components/PublicDocumentPage";

export const metadata: Metadata = {
  title: "Cookie Policy | REOS",
  description: "How the public REOS website uses cookies and similar browser-storage technologies.",
  alternates: { canonical: "/cookie-policy", languages: { en: "/cookie-policy", ar: "/ar/cookie-policy" } },
};

export default function CookiePolicyPage() {
  return <PublicDocumentPage document="cookies" />;
}

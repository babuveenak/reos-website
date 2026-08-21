import type { Metadata } from "next";
import { ProductLoginView } from "../../../../components/ProductLoginView";

export const metadata: Metadata = {
  title: "NOC Automation Sign In | REOS Platform",
  description: "Licensed access gateway for REOS NOC Automation.",
  robots: { index: false, follow: false },
};

export default function NocAutomationLoginPage() {
  return <ProductLoginView slug="noc-automation" />;
}

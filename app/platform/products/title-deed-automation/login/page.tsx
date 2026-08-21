import type { Metadata } from "next";
import { ProductLoginView } from "../../../../components/ProductLoginView";

export const metadata: Metadata = {
  title: "Title Deed Automation Sign In | REOS Platform",
  description: "Licensed access gateway for REOS Title Deed Automation.",
  robots: { index: false, follow: false },
};

export default function TitleDeedAutomationLoginPage() {
  return <ProductLoginView slug="title-deed-automation" />;
}

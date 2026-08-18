import { View } from "../../insights/page";
import type { Metadata } from "next";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export const metadata: Metadata = {
  title: "Learn Before You Buy, Build, Invest or Manage | REOS Insights",
  description: "Guides and explainers on UAE property: buying, investing, developing, regulation, authority processes, escrow, handover, community living and property management.",
};

export default function Page() {
  return <View locale="ar" />;
}

import { View } from "../../stakeholders/page";
import type { Metadata } from "next";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export const metadata: Metadata = {
  title: "Stakeholder Journeys | REOS",
  description: "The same development ecosystem, read through each stakeholder lens — what they receive, what they produce, who they depend on and where they are blocked.",
};

export default function Page() {
  return <View locale="ar" />;
}

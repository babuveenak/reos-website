import { View } from "../../stakeholders/page";
import type { Metadata } from "next";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export const metadata: Metadata = {
  title: "UAE Property Stakeholders | REOS",
  description: "The 12 stakeholder groups participating across the UAE property journey — what each controls, when they enter, and what they exchange with everyone else.",
};

export default function Page() {
  return <View locale="ar" />;
}

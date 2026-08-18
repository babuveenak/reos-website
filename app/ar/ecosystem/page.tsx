import { View } from "../../ecosystem/page";
import type { Metadata } from "next";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export const metadata: Metadata = {
  title: "The 12 Stakeholder Groups Behind the UAE Property Journey | REOS",
  description: "Who participates in UAE property development, what each group controls, when they enter the journey and what they exchange with everyone else.",
};

export default function Page() {
  return <View locale="ar" />;
}

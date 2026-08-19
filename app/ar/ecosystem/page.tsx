import { View } from "../../ecosystem/page";
import type { Metadata } from "next";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export const metadata: Metadata = {
  title: "The Connected Property Ecosystem | REOS",
  description: "How the 12 stakeholder groups connect across the seven-stage UAE property journey — relationships, dependencies and information flows, with REOS at the centre.",
};

export default function Page() {
  return <View locale="ar" />;
}

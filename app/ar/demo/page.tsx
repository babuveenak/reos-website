import { View } from "../../demo/page";
import type { Metadata } from "next";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export const metadata: Metadata = {
  title: "Map Your Property Journey with REOS | Book a Demo",
  description: "Walk through your emirate, asset type and delivery route against the connected model and see where dependencies, approvals and handoffs actually sit.",
};

export default function Page() {
  return <View locale="ar" />;
}

import { View } from "../../property-journey/page";
import type { Metadata } from "next";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export const metadata: Metadata = {
  title: "The UAE Property Journey, Mapped End to End | REOS",
  description: "Seven connected stages from land to living: what happens, who is involved, which documents matter, what can go wrong and what comes next.",
};

export default function Page() {
  return <View locale="ar" />;
}

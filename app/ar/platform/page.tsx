import { View } from "../../platform/page";
import type { Metadata } from "next";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export const metadata: Metadata = {
  title: "The Execution Layer for the Property Journey | REOS Platform",
  description: "How REOS moves from explaining the UAE property journey to running it: knowledge, discovery and execution layers, and the eight modules beneath them.",
};

export default function Page() {
  return <View locale="ar" />;
}

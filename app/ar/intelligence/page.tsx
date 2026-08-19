import { View } from "../../intelligence/page";
import type { Metadata } from "next";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export const metadata: Metadata = {
  title: "REOS Intelligence | Guides, Regulations, Processes & Glossary",
  description: "The knowledge layer behind the UAE property ecosystem: guides, regulation explainers, process references, authority information, definitions and the knowledge graph.",
};

export default function Page() {
  return <View locale="ar" />;
}

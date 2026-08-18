import { View } from "../../glossary/page";
import type { Metadata } from "next";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export const metadata: Metadata = {
  title: "UAE Property Terms Explained | REOS Glossary",
  description: "Plain-language definitions of the UAE property terms that appear across the journey — escrow, off-plan, snagging, service charge, NOC, SPV and more.",
};

export default function Page() {
  return <View locale="ar" />;
}

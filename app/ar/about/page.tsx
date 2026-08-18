import { View } from "../../about/page";
import type { Metadata } from "next";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export const metadata: Metadata = {
  title: "Building the Digital Map of the Property Ecosystem | About REOS",
  description: "Why REOS exists: to make the UAE property journey understandable, navigable and connected for everyone who takes part in it.",
};

export default function Page() {
  return <View locale="ar" />;
}

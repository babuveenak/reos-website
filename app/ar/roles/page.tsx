import { View } from "../../roles/page";
import type { Metadata } from "next";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export const metadata: Metadata = {
  title: "Find Your Place in the Property Journey | REOS",
  description: "Eight routes into the UAE property journey — for buyers, investors, developers, financiers, contractors, consultants, property managers and anyone new to the market.",
};

export default function Page() {
  return <View locale="ar" />;
}

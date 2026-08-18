import { View } from "../../authorities/page";
import type { Metadata } from "next";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export const metadata: Metadata = { title: "REOS"
};

export default function Page() {
  return <View locale="ar" />;
}

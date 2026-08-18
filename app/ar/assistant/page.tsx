import { View } from "../../assistant/page";
import type { Metadata } from "next";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export const metadata: Metadata = {
  title: "اسأل عن رحلة العقار في الإمارات | مساعد REOS",
  description: "اسأل كيف يُشترى العقار ويُطوَّر ويُموَّل ويُبنى ويُسجَّل ويُسلَّم ويُدار في الإمارات. يبيّن المساعد موضعك في الرحلة ومن يشارك فيها ومصدر الإجابة.",
};

export default function Page() {
  return <View locale="ar" />;
}

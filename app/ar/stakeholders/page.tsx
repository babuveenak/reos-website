import { View } from "../../stakeholders/page";
import type { Metadata } from "next";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export const metadata: Metadata = {
  title: "أصحاب المصلحة في العقارات الإماراتية | REOS",
  description: "اثنتا عشرة مجموعة من أصحاب المصلحة عبر دورة حياة العقار في دولة الإمارات، مع نطاق الاختصاص وحالة الأدلة بشكل واضح.",
  alternates: { canonical: "/ar/stakeholders", languages: { en: "/stakeholders", ar: "/ar/stakeholders" } },
};

export default function Page() {
  return <View locale="ar" />;
}

import { View } from "../../intelligence/page";
import type { Metadata } from "next";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export const metadata: Metadata = {
  title: "معرفة REOS | الأدلة والأنظمة والإجراءات والمصطلحات",
  description: "طبقة المعرفة وراء المنظومة العقارية في دولة الإمارات: الأدلة والشروح التنظيمية والإجراءات ومعلومات الجهات المختصة والتعريفات والرسم المعرفي.",
};

export default function Page() {
  return <View locale="ar" />;
}

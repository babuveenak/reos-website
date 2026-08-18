import { View, generateStaticParams, generateMetadata } from "../../../journey/[stage]/page";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export { generateStaticParams };
export { generateMetadata };

type Props = { params: Promise<Record<string, string>> };
export default function Page(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return View({ ...(props as any), locale: "ar" });
}

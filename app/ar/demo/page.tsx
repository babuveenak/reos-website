import { View } from "../../demo/page";
import type { Metadata } from "next";
import { getProduct } from "../../data/products";

/** Arabic route. Renders the shared view with locale="ar"; content falls
 *  back to English per-field where a translation is not yet in place. */
export const metadata: Metadata = {
  title: "Map Your Property Journey with REOS | Book a Demo",
  description: "Walk through your emirate, asset type and delivery route against the connected model and see where dependencies, approvals and handoffs actually sit.",
};

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const product = typeof params.product === "string" ? getProduct(params.product)?.name : undefined;
  const intent = typeof params.intent === "string" ? params.intent : undefined;
  return <View locale="ar" initialProduct={product} initialIntent={intent} />;
}

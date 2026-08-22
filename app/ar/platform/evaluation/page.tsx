import { View } from "../../../platform/evaluation/page";
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) { const params = await searchParams; return <View locale="ar" selectedProductSlug={typeof params.product === "string" ? params.product : undefined} />; }

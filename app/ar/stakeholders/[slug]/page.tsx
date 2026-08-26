import { notFound } from "next/navigation";
import { StakeholderBlueprintPage } from "../../../components/StakeholderBlueprintPage";
import { groups } from "../../../data/ecosystem";

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() { return groups.map((group) => ({ slug: group.id })); }
export default async function ArabicStakeholderLegacyRoute({ params }: Props) { const { slug } = await params; if (!groups.some((group) => group.id === slug)) notFound(); return <StakeholderBlueprintPage stakeholderId={slug} emirate="dubai" track="track-neutral" locale="ar" />; }

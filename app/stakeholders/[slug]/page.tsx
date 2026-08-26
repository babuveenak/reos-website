import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StakeholderBlueprintPage } from "../../components/StakeholderBlueprintPage";
import { groups } from "../../data/ecosystem";

type Props = { params: Promise<{ slug: string }> };
export async function generateStaticParams() { return groups.map((group) => ({ slug: group.id })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const group = groups.find((item) => item.id === slug);
  return group ? { title: `${group.name} | UAE Property Stakeholders | REOS`, description: `Explore the source-led lifecycle structure for ${group.name}, with explicit participation, jurisdiction scope and official references.`, alternates: { canonical: `/stakeholders/${slug}/dubai/track-neutral`, languages: { en: `/stakeholders/${slug}/dubai/track-neutral`, ar: `/ar/stakeholders/${slug}/dubai/track-neutral` } } } : {};
}

export default async function StakeholderLegacyRoute({ params }: Props) {
  const { slug } = await params;
  if (!groups.some((group) => group.id === slug)) notFound();
  return <StakeholderBlueprintPage stakeholderId={slug} emirate="dubai" track="track-neutral" locale="en" />;
}

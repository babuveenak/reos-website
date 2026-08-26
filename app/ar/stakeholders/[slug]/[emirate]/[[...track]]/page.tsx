import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StakeholderBlueprintPage } from "../../../../../components/StakeholderBlueprintPage";
import { groups } from "../../../../../data/ecosystem";
import { DUBAI_TRACKS, EMIRATES, type DubaiTrack, type EmirateId } from "../../../../../data/stakeholderBlueprints";
import { getGroups } from "../../../../../i18n/content";

type Props = { params: Promise<{ slug: string; emirate: string; track?: string[] }> };
export async function generateStaticParams() { return groups.flatMap((group) => EMIRATES.flatMap((emirate) => emirate.id === "dubai" ? DUBAI_TRACKS.map((track) => ({ slug: group.id, emirate: emirate.id, track: [track.id] })) : [{ slug: group.id, emirate: emirate.id, track: [] }])); }

function parse(params: { slug: string; emirate: string; track?: string[] }) {
  const emirate = EMIRATES.find((item) => item.id === params.emirate)?.id as EmirateId | undefined;
  const track = (params.track?.[0] ?? "track-neutral") as DubaiTrack;
  if (!groups.some((group) => group.id === params.slug) || !emirate || (params.track?.length && params.track.length > 1) || (emirate !== "dubai" && params.track?.length) || (emirate === "dubai" && !DUBAI_TRACKS.some((item) => item.id === track))) return null;
  return { stakeholderId: params.slug, emirate, track };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const parsed = parse(await params);
  if (!parsed) return {};
  const group = getGroups("ar").find((item) => item.id === parsed.stakeholderId)!;
  const emirate = EMIRATES.find((item) => item.id === parsed.emirate)!;
  const suffix = parsed.emirate === "dubai" ? `/${parsed.emirate}/${parsed.track}` : `/${parsed.emirate}`;
  const canonical = `/ar/stakeholders/${parsed.stakeholderId}${suffix}`;
  return { title: `${group.name} في ${emirate.ar} | REOS`, description: `هيكل دورة حياة قائم على المصادر لـ ${group.name} في ${emirate.ar}.`, robots: parsed.emirate === "dubai" && parsed.stakeholderId === "landowners-investors" && parsed.track !== "financial-free-zone" ? undefined : { index: false, follow: true }, alternates: { canonical, languages: { en: canonical.replace("/ar", ""), ar: canonical } } };
}

export default async function ArabicStakeholderJurisdictionPage({ params }: Props) { const parsed = parse(await params); if (!parsed) notFound(); return <StakeholderBlueprintPage {...parsed} locale="ar" />; }

import { notFound, permanentRedirect } from "next/navigation";
import { approvedRelationships, relationshipFor } from "../../../../data/relationships";

type Props = { params: Promise<{ slug: string; stage: string }> };

export function generateStaticParams() {
  return approvedRelationships.map((relationship) => ({
    slug: relationship.stakeholderId,
    stage: relationship.stageId,
  }));
}

export default async function StakeholderFirstRelationshipPage({ params }: Props) {
  const { slug, stage } = await params;
  const relationship = relationshipFor(stage, slug);
  if (!relationship) notFound();
  permanentRedirect(relationship.detailRoute);
}

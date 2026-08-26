import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page } from "../../../../components/SiteShell";
import { groupById } from "../../../../data/ecosystem";
import { stageById, stages } from "../../../../data/journey";
import { approvedRelationships, relationshipFor, relationshipLevelDescriptions, relationshipLevelLabels, relationshipsByStage, relationshipsByStakeholder } from "../../../../data/relationships";
import { StakeholderProcessMap } from "../../../../components/StakeholderProcessMap";
import { authorityProcessMaps } from "../../../../data/authorityProcessMaps";
import { participationFor, participationForStakeholder } from "../../../../data/stakeholderParticipation";

type Props = { params: Promise<{ stage: string; stakeholder: string }> };

export function generateStaticParams() {
  return approvedRelationships.map((relationship) => ({
    stage: relationship.stageId,
    stakeholder: relationship.stakeholderId,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stage: stageId, stakeholder: stakeholderId } = await params;
  const stage = stageById[stageId];
  const stakeholder = groupById[stakeholderId];
  const relationship = relationshipFor(stageId, stakeholderId);
  if (!stage || !stakeholder || !relationship) return {};
  return {
    title: `${stakeholder.name} in ${stage.name} | REOS`,
    description: relationship.summary,
    alternates: { canonical: relationship.detailRoute },
  };
}

export default async function RelationshipDetailPage({ params }: Props) {
  const { stage: stageId, stakeholder: stakeholderId } = await params;
  const stage = stageById[stageId];
  const stakeholder = groupById[stakeholderId];
  const relationship = relationshipFor(stageId, stakeholderId);
  const intersection = participationFor(stageId, stakeholderId);
  if (!stage || !stakeholder || !relationship || !intersection || relationship.editorialStatus !== "approved") notFound();

  const participation = participationForStakeholder(stakeholder.id).map((item) => ({
    stageId: item.stageId,
    state: item.involvement,
    relationshipLevel: item.relationshipLevel,
    summary: item.role,
    evidence: item.evidence,
  }));
  const stakeholderRelationships = relationshipsByStakeholder(stakeholder.id)
    .sort((a, b) => stages.findIndex((item) => item.id === a.stageId) - stages.findIndex((item) => item.id === b.stageId));
  const position = stakeholderRelationships.findIndex((item) => item.id === relationship.id);
  const previous = stakeholderRelationships[position - 1];
  const next = stakeholderRelationships[position + 1];

  return <Page className="inner-page relationship-detail-page">
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link><span aria-hidden="true">/</span>
      <Link href="/property-journey">Property journey</Link><span aria-hidden="true">/</span>
      <Link href={`/property-journey/${stage.id}`}>{stage.name}</Link><span aria-hidden="true">/</span>
      <b>{stakeholder.name}</b>
    </nav>

    <section className="relationship-detail-hero">
      <span className="eyebrow">JOURNEY × STAKEHOLDER CONNECTION</span>
      <p className="relationship-detail-kicker">Stage {String(stage.number).padStart(2, "0")} · Stakeholder {String(stakeholder.number).padStart(2, "0")}</p>
      <h1>{stakeholder.name}<br /><em>in {stage.name}.</em></h1>
      <div className="relationship-detail-level">
        <b>{relationshipLevelLabels[relationship.relationshipLevel]}</b>
        <span>{relationshipLevelDescriptions[relationship.relationshipLevel]}</span>
      </div>
      <div className="blueprint-status-row">
        <span className={`evidence-badge ${intersection.evidence === "unverified" ? "evidence-unverified" : "evidence-conditional"}`}>{intersection.publicationState} · {intersection.evidence === "unverified" ? "role context only" : "official sources + REOS role mapping"}</span>
        <time dateTime="2026-08-26">Sources checked 26 August 2026</time>
      </div>
      <p>{relationship.summary}</p>
    </section>

    <StakeholderProcessMap
      stakeholderId={stakeholder.id}
      stakeholderName={stakeholder.name}
      stages={stages}
      participation={participation}
      processes={authorityProcessMaps["track-neutral"]}
      locale="en"
      initialStageId={stage.id}
    />

    <section className="relationship-context-links">
      <span className="eyebrow">KEEP EXPLORING</span>
      <h2>See this relationship<br /><em>from every direction.</em></h2>
      <div>
        <Link className="button gold" href={`/ecosystem?view=journey&stage=${stage.id}&stakeholder=${stakeholder.id}`}>Open in interactive map <span>↗</span></Link>
        <Link className="button ghost" href={`/ecosystem?view=journey&stage=${stage.id}`}>All {relationshipsByStage(stage.id).length} stakeholders in this stage</Link>
        <Link className="button ghost" href={`/ecosystem?view=stakeholder&stakeholder=${stakeholder.id}`}>All {stakeholderRelationships.length} stages for this stakeholder</Link>
      </div>
    </section>

    <nav className="stage-nav" aria-label="Adjacent stage relationships">
      {previous ? <Link href={previous.detailRoute}><small>PREVIOUS CONNECTION</small><b>← {stageById[previous.stageId].name}</b></Link> : <span />}
      {next ? <Link href={next.detailRoute}><small>NEXT CONNECTION</small><b>{stageById[next.stageId].name} →</b></Link> : <Link href={`/stakeholders/${stakeholder.id}`}><small>STAKEHOLDER PROFILE</small><b>{stakeholder.name} →</b></Link>}
    </nav>
  </Page>;
}

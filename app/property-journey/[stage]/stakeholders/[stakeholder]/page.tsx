import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page } from "../../../../components/SiteShell";
import { groupById } from "../../../../data/ecosystem";
import { stageById, stages } from "../../../../data/journey";
import {
  approvedRelationships,
  relationshipApprovals,
  relationshipDocuments,
  relationshipFor,
  relationshipIntelligence,
  relationshipLevelDescriptions,
  relationshipLevelLabels,
  relationshipProcesses,
  relationshipReferences,
  relationshipsByStage,
  relationshipsByStakeholder,
  relationshipSystems,
} from "../../../../data/relationships";

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

function DetailList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return <article><span className="eyebrow">{title}</span><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}

export default async function RelationshipDetailPage({ params }: Props) {
  const { stage: stageId, stakeholder: stakeholderId } = await params;
  const stage = stageById[stageId];
  const stakeholder = groupById[stakeholderId];
  const relationship = relationshipFor(stageId, stakeholderId);
  if (!stage || !stakeholder || !relationship || relationship.editorialStatus !== "approved") notFound();

  const processes = relationshipReferences(relationship.processIds, relationshipProcesses);
  const documents = relationshipReferences(relationship.documentIds, relationshipDocuments);
  const approvals = relationshipReferences(relationship.approvalIds, relationshipApprovals);
  const systems = relationshipReferences(relationship.systemIds, relationshipSystems);
  const intelligence = relationshipReferences(relationship.intelligenceContentIds, relationshipIntelligence);
  const dependencies = relationship.dependencyStakeholderIds.map((id) => groupById[id]).filter(Boolean);
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
      <p>{relationship.summary}</p>
    </section>

    <section className="relationship-detail-overview section-pad">
      <article><span className="eyebrow">ROLE IN THIS STAGE</span><p>{relationship.role}</p></article>
      <article><span className="eyebrow">WHAT HAPPENS HERE</span><ol>{relationship.activities.map((item) => <li key={item}>{item}</li>)}</ol></article>
    </section>

    <section className="relationship-detail-grid section-pad">
      <DetailList title="RESPONSIBILITIES" items={relationship.responsibilities} />
      <DetailList title="KEY DECISIONS" items={relationship.decisions} />
      <DetailList title="PROCESSES" items={processes.map((item) => item.label)} />
      <DetailList title="DOCUMENTS" items={documents.map((item) => item.label)} />
      <DetailList title="APPROVALS" items={approvals.map((item) => item.label)} />
      <DetailList title="SYSTEMS AND PORTALS" items={systems.map((item) => item.label)} />
      {dependencies.length > 0 && <article><span className="eyebrow">DEPENDENT STAKEHOLDERS</span><ul>{dependencies.map((group) => <li key={group.id}><Link href={`/stakeholders/${group.id}`}>{group.name}</Link></li>)}</ul></article>}
      {intelligence.length > 0 && <article><span className="eyebrow">RELEVANT INTELLIGENCE</span><ul>{intelligence.map((item) => <li key={item.id}><Link href={item.href!}>{item.label}</Link></li>)}</ul></article>}
    </section>

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

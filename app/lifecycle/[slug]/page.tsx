import { DEFAULT_LOCALE, type Locale } from "../../i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, StatusTag } from "../../components/SiteShell";
import { authorityById, ecosystemById, lifecycleStages, stakeholderById, stageById } from "../../data/reos";
import { legacyStakeholderToGroup } from "../../data/stakeholderDetails";
import { RouteGovernance } from "../../components/Governance";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() { return lifecycleStages.map((item) => ({ slug: item.id })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const stage = stageById[slug];
  return stage ? { title: `${stage.name} | REOS Property Lifecycle`, description: stage.summary } : {};
}

export async function View({ params, locale = DEFAULT_LOCALE }: Props & { locale?: Locale }) {
  const { slug } = await params;
  const stage = stageById[slug];
  if (!stage) notFound();
  const previous = lifecycleStages[stage.number - 2];
  const next = stage.next ? stageById[stage.next] : undefined;
  const seenGroups = new Set<string>();
  const participants = stage.stakeholderIds.filter((id) => {
    const groupId = legacyStakeholderToGroup[id] ?? id;
    if (seenGroups.has(groupId)) return false;
    seenGroups.add(groupId);
    return true;
  });
  return <Page className="inner-page stage-page" locale={locale}><section className="stage-hero"><div className="stage-hero-number">{String(stage.number).padStart(2, "0")}</div><div><span className="eyebrow">{stage.phase} · PROPERTY LIFECYCLE</span><h1>{stage.name}</h1><p>{stage.summary}</p><StatusTag status={stage.status} /></div></section><section className="stage-participants section-pad"><div><span className="eyebrow">WHO PARTICIPATES</span><h2>Connected<br /><em>stakeholders.</em></h2></div><div className="participant-list">{participants.map((id) => <Link href={`/stakeholders/${legacyStakeholderToGroup[id] ?? id}`} key={id}><span>{ecosystemById[stakeholderById[id].ecosystemId].short}</span><b>{stakeholderById[id].name}</b><i>Open profile →</i></Link>)}</div></section><section className="stage-detail-grid section-pad"><article><span className="eyebrow">ENTRY CONDITIONS</span><p>TBD / Requires validation for the selected jurisdiction, asset, ownership and transaction fact pattern.</p></article><article><span className="eyebrow">AUTHORITIES</span>{stage.authorityIds.length ? stage.authorityIds.map((id) => <div key={id}><b>{authorityById[id]?.name}</b><small>{authorityById[id]?.jurisdiction}</small></div>) : <p>No authority mapped at this abstraction level. Validate the specific fact pattern.</p>}</article><article><span className="eyebrow">DOCUMENTS & DATA</span><p>Exact inputs, forms, evidence, fees and outputs are intentionally not generalized. They must be sourced from the applicable official process.</p></article><article><span className="eyebrow">REOS CAPABILITY</span><p>Connect stage state, responsible parties, prerequisites, evidence and downstream handoffs while authoritative actions remain in existing systems.</p><StatusTag status="Future REOS Capability" /></article></section><RouteGovernance locale={locale} businessOutcome={stage.summary} audience={participants.map((id) => stakeholderById[id]?.name).filter(Boolean).join(" · ")} nextAction="Verify the jurisdiction-specific requirement, then continue through the canonical seven-stage journey." primaryLabel="Open the canonical Property Journey" primaryHref="/property-journey" secondaryLabel="Explore REOS products" secondaryHref="/platform" /><nav className="stage-nav" aria-label="Adjacent lifecycle stages">{previous ? <Link href={`/lifecycle/${previous.id}`}><small>PREVIOUS</small><b>← {previous.name}</b></Link> : <span />}{next ? <Link href={`/lifecycle/${next.id}`}><small>NEXT</small><b>{next.name} →</b></Link> : <Link href="/lifecycle"><small>COMPLETE VIEW</small><b>All 24 stages →</b></Link>}</nav></Page>;
}

export default async function StagePage(props: Props) {
  return View({ ...props, locale: DEFAULT_LOCALE });
}

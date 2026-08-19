import { DEFAULT_LOCALE, localePath, type Locale } from "../../i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Page, StatusTag } from "../../components/SiteShell";
import { groupById, groups } from "../../data/ecosystem";
import { stages } from "../../data/journey";
import { stakeholderDetailById } from "../../data/stakeholderDetails";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() { return groups.map((g) => ({ slug: g.id })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const group = groupById[slug];
  return group ? { title: `${group.name} | UAE Property Stakeholders | REOS`, description: `${group.controls} Role, responsibilities, decisions, documents, approvals and dependencies in the UAE property journey.` } : {};
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return <article className="journey-block"><span className="eyebrow">{title}</span><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>;
}

export async function View({ params, locale = DEFAULT_LOCALE }: Props & { locale?: Locale }) {
  const { slug } = await params;
  const group = groupById[slug];
  const detail = stakeholderDetailById[slug];
  if (!group || !detail) notFound();
  const L = (path: string) => localePath(locale, path);
  const entryStages = stages.filter((stage) => stage.groupIds.includes(group.id));

  return <Page className="inner-page journey-page" locale={locale}>
    <section className="journey-hero">
      <div>
        <span className="eyebrow">STAKEHOLDER {String(group.number).padStart(2, "0")} OF 12</span>
        <h1>{group.name}</h1>
        <p>{detail.overview}</p>
        <StatusTag status={detail.status} locale={locale} />
      </div>
      <div className="journey-index">
        <small>ENTERS THE JOURNEY AT</small>
        <b>{String(entryStages.length).padStart(2, "0")}</b>
        <span>of seven stages</span>
      </div>
    </section>

    <section className="journey-timeline section-pad">
      <div className="timeline-header">
        <span>01</span>
        <h2>Role in the<br /><em>property journey.</em></h2>
      </div>
      <p className="rail-callout">{detail.roleInJourney}</p>
      <div className="mini-stage-rail">
        {entryStages.map((stage) => (
          <Link href={L(`/property-journey/${stage.id}`)} key={stage.id}>
            <b>{String(stage.number).padStart(2, "0")}</b><span>{stage.name}</span><small>{stage.phase}</small>
          </Link>
        ))}
      </div>
    </section>

    <section className="journey-grid section-pad">
      <ListBlock title="KEY RESPONSIBILITIES" items={detail.keyResponsibilities} />
      <ListBlock title="KEY DECISIONS" items={detail.keyDecisions} />
      <ListBlock title="PROCESSES" items={detail.processes} />
      <ListBlock title="DOCUMENTS" items={detail.documents} />
      <ListBlock title="APPROVALS" items={detail.approvals} />
      <ListBlock title="SYSTEMS AND PORTALS" items={detail.systemsAndPortals} />
      <ListBlock title="DEPENDENCIES" items={detail.dependencies} />
      <ListBlock title="COMMON CHALLENGES" items={detail.commonChallenges} />

      <article className="journey-block">
        <span className="eyebrow">INTERACTIONS WITH OTHER STAKEHOLDERS</span>
        <ul>
          {detail.interactions.map((i) => {
            const other = groupById[i.groupId];
            return (
              <li key={i.groupId}>
                {other ? <Link href={L(`/stakeholders/${i.groupId}`)}>{other.name}</Link> : i.groupId} — {i.note}
              </li>
            );
          })}
        </ul>
      </article>

      {detail.relevantIntelligence.length > 0 && (
        <article className="journey-block">
          <span className="eyebrow">RELEVANT INTELLIGENCE</span>
          <ul>
            {detail.relevantIntelligence.map((link) => (
              <li key={link.href}><Link href={L(link.href)}>{link.label}</Link></li>
            ))}
          </ul>
        </article>
      )}
    </section>
  </Page>;
}

export default async function StakeholderPage(props: Props) {
  return View({ ...props, locale: DEFAULT_LOCALE });
}

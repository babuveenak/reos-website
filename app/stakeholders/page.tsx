import { getGroups, getClusters, getStages } from "../i18n/content";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import type { Metadata } from "next";
import Link from "next/link";
import { Page, SectionIntro } from "../components/SiteShell";
import { StakeholdersHero, type StakeholderHeroGroup } from "../components/StakeholdersHero";
import { StakeholderDirectory } from "../components/StakeholderDirectory";
import { stakeholderBlueprintProfiles } from "../data/stakeholderBlueprints";

export const metadata: Metadata = {
  title: "UAE Property Stakeholders | REOS",
  description: "The 12 stakeholder groups participating across the UAE property journey — what each controls, when they enter, and what they exchange with everyone else.",
  alternates: { canonical: "/stakeholders", languages: { en: "/stakeholders", ar: "/ar/stakeholders" } },
};

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const L = (path: string) => localePath(locale, path);
  const stages = getStages(locale);
  const groups = getGroups(locale);
  const clusters = getClusters(locale);
  const directoryProfiles = stakeholderBlueprintProfiles.map(({ stakeholderId, firstDecision, participation }) => ({ stakeholderId, firstDecision, participation }));
  const heroGroups: StakeholderHeroGroup[] = groups.map((group) => ({
    id: group.id,
    number: String(group.number).padStart(2, "0"),
    name: group.name,
    overview: group.controls,
    participants: group.members,
    stages: stages
      .filter((stage) => stage.groupIds.includes(group.id))
      .map((stage) => ({ number: String(stage.number).padStart(2, "0"), name: stage.short })),
    href: L(`/stakeholders/${group.id}`),
  }));
  return <Page className="inner-page" locale={locale}>
    <section className="inner-hero inner-hero-no-photo stakeholders-hero">
      <div className="stakeholders-hero-copy">
        <span className="eyebrow">STAKEHOLDERS</span>
        <h1>UAE property<br /><em>stakeholders.</em></h1>
        <p>Who is involved in the UAE property journey? Explore the 12 stakeholder groups participating across it — their responsibilities, decisions, documents, approvals and dependencies.</p>
      </div>
      <StakeholdersHero groups={heroGroups} />
    </section>

    <section className="section-pad group-detail-band" id="stakeholder-directory">
      <SectionIntro
        label="12 STAKEHOLDER GROUPS"
        title={locale === "ar" ? <>اختر دورك.<br /><em>وشاهد دورة الحياة كاملة.</em></> : <>Choose your role.<br /><em>See the whole lifecycle.</em></>}
        copy={locale === "ar" ? "ابحث عن مجموعتك، وشاهد نقطة البداية والمراحل التي تقودها أو تشارك فيها، ثم افتح مخططاً يميز بوضوح بين المصادر الرسمية وشرح REOS وما لم يتم التحقق منه بعد." : "Find your group, see where its journey starts and which stages it leads or participates in, then open a lifecycle blueprint that clearly separates official sources, REOS explanation and what is not yet verified."}
      />
      <StakeholderDirectory groups={groups} clusters={clusters} stages={stages} profiles={directoryProfiles} locale={locale} />
      <aside className="stakeholder-guide-bridge" aria-label={locale === "ar" ? "أدلة الرحلات الشخصية" : "Personal journey guides"}>
        <p>
          <strong>{locale === "ar" ? "هل تبحث عن رحلة شخصية؟" : "Looking for a personal journey?"}</strong>{" "}
          {locale === "ar"
            ? "تصفّح الأدلة خطوة بخطوة للشراء أو التطوير أو الاستثمار."
            : "Browse step-by-step guides for buying, developing or investing."}
        </p>
        <Link className="text-link" href={L("/intelligence/guides")}>
          {locale === "ar" ? "تصفّح الأدلة" : "Browse guides"} <span aria-hidden="true">↗</span>
        </Link>
      </aside>
    </section>

    <section className="integrity-strip">
      <b>Before you act on this</b>
      <p>These pages describe a research-backed operating model. Exact processes, authorities, requirements, documents, fees and timelines vary by jurisdiction, asset and transaction — verify with the relevant authority or a qualified adviser before acting.</p>
    </section>
  </Page>;
}

export default function StakeholdersPage() {
  return <View locale={DEFAULT_LOCALE} />;
}

import { DEFAULT_LOCALE, type Locale } from "./i18n/config";
import { getDict } from "./i18n/dictionary";
import { getStages, getGroups } from "./i18n/content";
import Link from "next/link";
import { JourneyFlow } from "./components/JourneyHero";
import { Page, SectionIntro } from "./components/SiteShell";
import { Assistant } from "./components/Assistant";
import { FragmentedJourney, type FragmentStakeholderId, type FragmentStakeholderStages } from "./components/FragmentedJourney";
import { buildSnapshot } from "./assistant/snapshot";
import { participationForStakeholder, type RelationshipLevel, type StageId } from "./data/stakeholderParticipation";

// The homepage keeps six representative cards for visual restraint, but their
// stage relationships are always projected from the canonical 84-cell model.
const fragmentStakeholderIds: FragmentStakeholderId[] = [
  "developers",
  "consultants-designers",
  "authorities-regulators",
  "contractors",
  "banks-financial",
  "property-owners",
];

const fragmentStakeholderStages = fragmentStakeholderIds.reduce((projection, stakeholderId) => {
  projection[stakeholderId] = Object.fromEntries(
    participationForStakeholder(stakeholderId).map(({ stageId, relationshipLevel }) => [stageId, relationshipLevel]),
  ) as Record<StageId, RelationshipLevel>;
  return projection;
}, {} as FragmentStakeholderStages);

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const d = getDict(locale);
  const L = (p: string) => (locale === DEFAULT_LOCALE ? p : `/ar${p === "/" ? "" : p}`);
  const pathways = locale === "ar" ? [
    ["01", d.nav.journey, "اتبع المراحل السبع المترابطة من الأرض إلى التشغيل والاستثمار.", "/property-journey"],
    ["02", d.nav.stakeholders, "استكشف من يشارك وما الذي يملكه أو يقرره أو يسلّمه.", "/stakeholders"],
    ["03", d.nav.ecosystem, "شاهد أين تتقاطع المراحل والأطراف والمسؤوليات.", "/ecosystem"],
    ["04", d.nav.intelligence, "تحقق من الأدلة والجهات والاختصاصات ومصادر المعرفة.", "/intelligence"],
    ["05", d.nav.platform, "شاهد كيف يطبّق REOS خريطة العملية من خلال نموذج تشغيل واحد.", "/platform"],
  ] : [
    ["01", d.nav.journey, "Follow seven connected stages from land through operations and investment.", "/property-journey"],
    ["02", d.nav.stakeholders, "See who participates and what each group owns, decides or delivers.", "/stakeholders"],
    ["03", d.nav.ecosystem, "Explore where stages, participants and responsibilities intersect.", "/ecosystem"],
    ["04", d.nav.intelligence, "Inspect evidence, authorities, jurisdictions and knowledge sources.", "/intelligence"],
    ["05", d.nav.platform, "See how REOS applies the mapped process through one operating model.", "/platform"],
  ];
  // Narrow, serialisable view of the content model for the client assistant.
  const snapshot = buildSnapshot(locale);
  return <Page className="home" locale={locale}>

    {/* 01 — HERO. The journey, not the ecosystem. */}
    <section className="hero-primary">
      <div className="hero-ground" aria-hidden="true" />
      <div className="hero-copy">
        <span className="eyebrow">{d.home.eyebrow}</span>
        <h1>{d.home.h1}<br /><em>{d.home.h1em}</em></h1>
        <p>{locale === "ar" ? "يرسم REOS رحلة العقار في دولة الإمارات—المراحل والأطراف والأدلة والموافقات والقرارات التي تربط الأرض بالحياة والاستثمار." : "REOS maps the UAE property journey—the stages, participants, evidence, approvals and decisions that connect land to living and investment."}</p>
        <p className="hero-benefit">{locale === "ar" ? "افهم ما يحدث، ومن يشارك، وما الذي يأتي تالياً، وأين تتقاطع المسؤوليات والقرارات." : "Understand what happens, who participates, what comes next, and where responsibilities and decisions intersect."}</p>
        <div className="hero-actions">
          <Link className="button gold" href={L("/property-journey")}>{d.home.ctaStart} <span>↗</span></Link>
          <Link className="button ghost" href={L("/ecosystem")}>{locale === "ar" ? "استكشف المنظومة" : "Explore the ecosystem"}</Link>
        </div>
      </div>
      <div className="hero-visual"><JourneyFlow locale={locale} /></div>
      <dl className="home-canonical-scope" aria-label={locale === "ar" ? "نطاق REOS المعتمد" : "Canonical REOS scope"}>
        <div><dt>{getStages(locale).length}</dt><dd>{d.home.statStages}</dd></div>
        <div><dt>{getGroups(locale).length}</dt><dd>{d.home.statGroups}</dd></div>
        <div><dt>7</dt><dd>{d.home.statEmirates}</dd></div>
      </dl>
    </section>

    {/* 02 — PROBLEM. One connected journey experienced through disconnected views. */}
    <section className="section-pad problem-band" id="problem">
      <SectionIntro
        label={d.home.problemLabel}
        title={<>{d.home.problemTitle}<br /><em>{d.home.problemTitleEm}</em></>}
        copy={d.home.problemCopy}
      />
      <FragmentedJourney locale={locale} stakeholderStages={fragmentStakeholderStages} />
    </section>

    {/* 03 — ASK. Help visitors act on the problem they have just explored. */}
    <section className="section-pad assistant-band" id="ask">
      <SectionIntro
        label={d.assistant.eyebrow}
        title={<>{d.assistant.title}<br /><em>{d.assistant.titleEm}</em></>}
        copy={d.assistant.lede}
      />
      <Assistant snapshot={snapshot} locale={locale} variant="compact" />
      <div className="band-cta"><Link className="text-link" href={L("/assistant")}>{locale === "ar" ? "افتح المساعد الكامل" : "Open the full Assistant"} <span>↗</span></Link></div>
    </section>

    {/* 04 — FIVE GUIDED PATHS. Dedicated pages carry the depth. */}
    <section className="section-pad home-pathways" id="start">
      <SectionIntro
        label={locale === "ar" ? "استكشف REOS" : "EXPLORE REOS"}
        title={locale === "ar" ? <>اختر ما تحتاج إلى فهمه.<br /><em>ثم انتقل مباشرة إليه.</em></> : <>Choose what you need to understand.<br /><em>Then go directly to it.</em></>}
        copy={locale === "ar" ? "تقدّم الصفحة الرئيسية خريطة واضحة فقط. تحمل الصفحات المتخصصة التفاصيل والأدوات والسياق الكامل." : "Home provides the orientation. Each dedicated page carries the complete model, tools and context."}
      />
      <div className="home-pathway-grid">
        {pathways.map(([number, title, copy, path]) => <Link href={L(path)} key={path}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div><i aria-hidden="true">↗</i></Link>)}
      </div>
    </section>

  </Page>;
}

export default function Home() {
  return <View locale={DEFAULT_LOCALE} />;
}

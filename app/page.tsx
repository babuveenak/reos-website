import { DEFAULT_LOCALE, type Locale } from "./i18n/config";
import { getDict } from "./i18n/dictionary";
import { getFragments, getStages, getGroups } from "./i18n/content";
import Link from "next/link";
import { JourneyMap, TrackLegend } from "./components/Journey";
import { JourneyFlow } from "./components/JourneyHero";
import { Page, SectionIntro } from "./components/SiteShell";
import { Assistant } from "./components/Assistant";
import { buildSnapshot } from "./assistant/snapshot";
import { HowReosWorks, ProductMaturityBadge } from "./components/Governance";
import { REOS_VALUE_PROPOSITION } from "./data/governance";
import { products } from "./data/products";

export function View({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const d = getDict(locale);
  const L = (p: string) => (locale === DEFAULT_LOCALE ? p : `/ar${p === "/" ? "" : p}`);
  const pathways = locale === "ar" ? [
    ["01", d.nav.journey, "اتبع المراحل السبع المترابطة من الأرض إلى التشغيل والاستثمار.", "/property-journey"],
    ["02", d.nav.stakeholders, "استكشف من يشارك وما الذي يملكه أو يقرره أو يسلّمه.", "/stakeholders"],
    ["03", d.nav.ecosystem, "شاهد أين تتقاطع المراحل والأطراف والمسؤوليات.", "/ecosystem"],
    ["04", d.nav.intelligence, "تحقق من الأدلة والجهات والاختصاصات ومصادر المعرفة.", "/intelligence"],
    ["05", d.nav.platform, "استعرض منتجات REOS المرخّصة وحدود جاهزيتها.", "/platform"],
  ] : [
    ["01", d.nav.journey, "Follow seven connected stages from land through operations and investment.", "/property-journey"],
    ["02", d.nav.stakeholders, "See who participates and what each group owns, decides or delivers.", "/stakeholders"],
    ["03", d.nav.ecosystem, "Explore where stages, participants and responsibilities intersect.", "/ecosystem"],
    ["04", d.nav.intelligence, "Inspect evidence, authorities, jurisdictions and knowledge sources.", "/intelligence"],
    ["05", d.nav.platform, "Review licensed REOS products and their current maturity boundaries.", "/platform"],
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
        <p>{REOS_VALUE_PROPOSITION}</p>
        <p className="hero-benefit">{d.home.benefit}</p>
        <div className="hero-actions">
          <Link className="button gold" href={L("/platform")}>{locale === "ar" ? "استكشف منتجات REOS المرخّصة" : "Explore licensed REOS products"} <span>↗</span></Link>
          <Link className="button ghost" href={L("/property-journey")}>{d.home.ctaStart}</Link>
        </div>
      </div>
      <div className="hero-visual"><JourneyFlow locale={locale} /></div>
      <dl className="home-canonical-scope" aria-label={locale === "ar" ? "نطاق REOS المعتمد" : "Canonical REOS scope"}>
        <div><dt>{getStages(locale).length}</dt><dd>{d.home.statStages}</dd></div>
        <div><dt>{getGroups(locale).length}</dt><dd>{d.home.statGroups}</dd></div>
        <div><dt>{products.length}</dt><dd>{locale === "ar" ? "منتجان منشوران" : "Published products"}</dd></div>
      </dl>
    </section>

    <HowReosWorks locale={locale} compact />

    {/* 02 — ASK. The assistant is the front door: a question before the reading. */}
    <section className="section-pad assistant-band" id="ask">
      <SectionIntro
        label={d.assistant.eyebrow}
        title={<>{d.assistant.title}<br /><em>{d.assistant.titleEm}</em></>}
        copy={d.assistant.lede}
      />
      <Assistant snapshot={snapshot} locale={locale} variant="compact" />
      <div className="band-cta"><Link className="text-link" href={L("/assistant")}>{locale === "ar" ? "افتح المساعد الكامل" : "Open the full Assistant"} <span>↗</span></Link></div>
    </section>

    {/* 03 — PROBLEM. One concise case for change. */}
    <section className="section-pad problem-band" id="problem">
      <SectionIntro
        label={d.home.problemLabel}
        title={<>{d.home.problemTitle}<br /><em>{d.home.problemTitleEm}</em></>}
        copy={d.home.problemCopy}
      />
      <div className="fragment-cards">
        {getFragments(locale).map((item, index) => (
          <article key={item.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
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

    {/* 05 — THE JOURNEY MAP. Retained pending the Journey-depth decision. */}
    <section className="section-pad journey-band" id="journey">
      <SectionIntro
        label={d.home.journeyLabel}
        title={<>{d.home.journeyTitle}<br /><em>{d.home.journeyTitleEm}</em></>}
        copy={d.home.journeyCopy}
      />
      <JourneyMap compact locale={locale} />
      <TrackLegend locale={locale} />
    </section>

    {/* 06 — TWO PUBLISHED PRODUCTS. Lightweight, honest UI previews. */}
    <section className="section-pad home-products" id="platform">
      <SectionIntro
        label={locale === "ar" ? "منتجات REOS" : "LICENSED PRODUCT MODEL"}
        title={locale === "ar" ? <>منتجان واضحان.<br /><em>وحدود جاهزية صريحة.</em></> : <>Two product experiences.<br /><em>Clear maturity boundaries.</em></>}
        copy={locale === "ar" ? "هذه معاينات توضيحية خفيفة للمنتجات المنشورة. تعرض سير العمل المقصود دون الادعاء بأنها أنظمة تشغيلية حية." : "These lightweight previews show the intended workflow experience without presenting an illustrative interface as a live operational system."}
      />
      <div className="home-product-grid">
        {products.map((product) => <article key={product.slug} className="home-product-card">
          <header><span>{String(product.number).padStart(2, "0")}</span><ProductMaturityBadge maturity={product.maturity} /></header>
          <div className="home-product-heading"><small>{product.category}</small><h3>{product.name}</h3><p>{product.workflowResult}</p></div>
          <div className="home-product-ui" aria-label={`${product.name} illustrative interface preview`}>
            <div className="home-product-ui-bar"><i aria-hidden="true" /><b>ILLUSTRATIVE PRODUCT PREVIEW</b><span>{product.maturity}</span></div>
            <div className="home-product-case"><small>CASE WORKFLOW</small><b>{product.capabilities[0]}</b><span>{product.capabilities[1]}</span></div>
            <ol>{product.capabilities.slice(0, 4).map((capability, index) => <li key={capability} className={index === 0 ? "is-active" : undefined}><span>{String(index + 1).padStart(2, "0")}</span>{capability}</li>)}</ol>
          </div>
          <p className="home-product-boundary"><b>Boundary:</b> {product.deploymentBoundary}</p>
          <Link className="text-link" href={L(`/platform/products/${product.slug}/login`)}>Explore {product.name} <span>↗</span></Link>
        </article>)}
      </div>
      <div className="home-product-actions"><Link className="button gold" href={L("/demo")}>{locale === "ar" ? "اطلب عرضاً توضيحياً" : "Request a Demo"} <span>↗</span></Link><Link className="button ghost" href={L("/platform/evaluation")}>{locale === "ar" ? "راجع مسار التقييم" : "Review the evaluation path"}</Link></div>
      <nav className="home-governance-links" aria-label={locale === "ar" ? "مسؤوليات الحوكمة" : "Governance responsibilities"}>
        <Link href={L("/ecosystem")}><b>Ecosystem</b><span>Relationships and accountability</span></Link>
        <Link href={L("/intelligence")}><b>Intelligence</b><span>Evidence, authority and sources</span></Link>
        <Link href={L("/trust-centre")}><b>Trust Centre</b><span>Security, data and assurance</span></Link>
        <Link href={L("/platform/evaluation")}><b>Evaluation</b><span>Pilot, acceptance and rollout</span></Link>
      </nav>
    </section>

    {/* 07 — ALL TWELVE STAKEHOLDERS, without twelve long sales narratives. */}
    <section className="section-pad home-stakeholders">
      <SectionIntro
        label={locale === "ar" ? "اثنتا عشرة مجموعة" : "TWELVE STAKEHOLDER GROUPS"}
        title={locale === "ar" ? <>نموذج واحد مشترك.<br /><em>اثنتا عشرة وجهة نظر.</em></> : <>One shared operating model.<br /><em>Twelve points of view.</em></>}
        copy={locale === "ar" ? "يصل كل طرف إلى سياقه الكامل دون تحويل الصفحة الرئيسية إلى اثنتي عشرة رحلة منفصلة." : "Every group has a clear route into its own responsibilities and relationships—without turning Home into twelve separate journeys."}
      />
      <div className="home-stakeholder-grid">
        {getGroups(locale).map((group) => <Link key={group.id} href={L(`/stakeholders/${group.id}`)} aria-label={`${group.name}: ${locale === "ar" ? "استكشف المسؤوليات والعلاقات" : "explore responsibilities and relationships"}`}><span>{String(group.number).padStart(2, "0")}</span><h3>{group.name}</h3><i aria-hidden="true">↗</i></Link>)}
      </div>
    </section>

    {/* 08 — ONE CLEAR CLOSE. */}
    <section className="demo-band atmos atmos-city" id="start-reading">
      <span className="eyebrow">{d.home.closeLabel}</span>
      <h2>{d.footer.headline}<br /><em>{d.footer.headlineEm}</em></h2>
      <p>{locale === "ar" ? "ابدأ برحلة العقار أو انتقل إلى المنتج الذي يدعم التنفيذ." : "Start with the Property Journey, or inspect the licensed product that supports execution."}</p>
      <div className="hero-actions">
        <Link className="button gold" href={L("/demo")}>{locale === "ar" ? "اطلب عرضاً توضيحياً" : "Request a Demo"} <span>↗</span></Link>
        <Link className="button ghost" href={L("/property-journey")}>{d.home.closeCta}</Link>
      </div>
      <p className="demo-note">REOS is an independent knowledge and navigation layer. It does not issue approvals, execute transactions or replace legal, financial or regulated advice. Requirements differ by emirate and change over time — verify with the relevant authority before acting.</p>
    </section>

  </Page>;
}

export default function Home() {
  return <View locale={DEFAULT_LOCALE} />;
}

import Link from "next/link";
import { getGroups, getStages } from "../i18n/content";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import { Page } from "./SiteShell";

export function PublicSitemapPage({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const L = (path: string) => localePath(locale, path);
  const arabic = locale === "ar";
  const groups = [
    {
      title: arabic ? "استكشف REOS" : "Explore REOS",
      links: [
        [arabic ? "الرئيسية" : "Home", "/"],
        [arabic ? "رحلة العقار" : "Property Journey", "/property-journey"],
        [arabic ? "أصحاب المصلحة" : "Stakeholders", "/stakeholders"],
        [arabic ? "المنظومة" : "Ecosystem", "/ecosystem"],
        [arabic ? "المعرفة" : "Intelligence", "/intelligence"],
        [arabic ? "المنصة" : "Platform", "/platform"],
      ],
    },
    {
      title: arabic ? "المعرفة والثقة" : "Knowledge & trust",
      links: [
        [arabic ? "المساعد" : "Assistant", "/assistant"],
        [arabic ? "الأدلة الإرشادية" : "Guides", "/intelligence/guides"],
        [arabic ? "التعريفات والمصطلحات" : "Definitions & Glossary", "/intelligence/definitions-and-glossary"],
        [arabic ? "الجهات المختصة" : "Authorities", "/authorities"],
        [arabic ? "عن REOS" : "About REOS", "/about"],
        [arabic ? "مركز الثقة" : "Trust Centre", "/trust-centre"],
      ],
    },
    {
      title: arabic ? "المنصة والتواصل" : "Platform & contact",
      links: [
        [arabic ? "منتجات المنصة" : "Platform products", "/platform"],
        [arabic ? "تقييم المؤسسات" : "Enterprise evaluation", "/platform/evaluation"],
        [arabic ? "طلب عرض" : "Request a demonstration", "/demo"],
      ],
    },
    {
      title: arabic ? "السياسات" : "Policies",
      links: [
        [arabic ? "سياسة الخصوصية" : "Privacy Policy", "/privacy-policy"],
        [arabic ? "سياسة ملفات الارتباط" : "Cookie Policy", "/cookie-policy"],
        [arabic ? "شروط الاستخدام" : "Terms of Use", "/terms"],
        [arabic ? "خريطة الموقع بصيغة XML" : "XML sitemap", "/sitemap.xml"],
      ],
    },
  ];

  return (
    <Page className="inner-page public-document-page" locale={locale}>
      <header className="public-document-hero sitemap-hero">
        <div>
          <span className="eyebrow">{arabic ? "دليل الموقع" : "WEBSITE DIRECTORY"}</span>
          <h1>{arabic ? "خريطة الموقع" : "Sitemap"}</h1>
          <p>{arabic ? "روابط واضحة إلى الصفحات العامة الرئيسية في REOS، مع مسارات رحلة العقار ومجموعات أصحاب المصلحة." : "A clear route to the main public REOS pages, including every Property Journey stage and stakeholder group."}</p>
          <Link className="text-link" href={L("/")}>{arabic ? "العودة إلى الرئيسية" : "Back to home"} <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <div className="human-sitemap">
        <div className="sitemap-primary-grid">
          {groups.map((group) => (
            <section key={group.title}>
              <h2>{group.title}</h2>
              <ul>{group.links.map(([label, path]) => <li key={path}><Link href={path === "/sitemap.xml" ? path : L(path)}>{label}<span aria-hidden="true">↗</span></Link></li>)}</ul>
            </section>
          ))}
        </div>

        <section className="sitemap-directory">
          <h2>{arabic ? "مراحل رحلة العقار السبع" : "Seven Property Journey stages"}</h2>
          <ol>{getStages(locale).map((stage) => <li key={stage.id}><Link href={L(`/property-journey/${stage.id}`)}><span>{String(stage.number).padStart(2, "0")}</span>{stage.name}</Link></li>)}</ol>
        </section>

        <section className="sitemap-directory">
          <h2>{arabic ? "مجموعات أصحاب المصلحة الاثنتا عشرة" : "Twelve stakeholder groups"}</h2>
          <ol>{getGroups(locale).map((group) => <li key={group.id}><Link href={L(`/stakeholders/${group.id}`)}><span>{String(group.number).padStart(2, "0")}</span>{group.name}</Link></li>)}</ol>
        </section>
      </div>
    </Page>
  );
}

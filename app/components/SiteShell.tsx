import Link from "next/link";
import type { ReactNode } from "react";
import type { ContentStatus } from "../data/reos";
import { DEFAULT_LOCALE, LOCALE_META, localePath, type Locale } from "../i18n/config";
import { getDict } from "../i18n/dictionary";
import { products } from "../data/products";
import { Logo } from "./Logo";
import { PreferencesControls } from "./PreferencesControls";
import { AssistantDock } from "./AssistantDock";
import { buildSnapshot } from "../assistant/snapshot";

/* THE FIVE FROZEN PRIMARY NAV ITEMS, in this exact order — REOS IA Freeze
 * v1.0, 2026-08-19. Do not add, remove or reorder without an explicit new
 * instruction: Property Journey, Stakeholders, Ecosystem, Intelligence,
 * Platform. */
const NAV_ROUTES = ["/property-journey", "/stakeholders", "/ecosystem", "/intelligence", "/platform"] as const;
const NAV_KEYS = ["journey", "stakeholders", "ecosystem", "intelligence", "platform"] as const;

export function Header({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const d = getDict(locale);
  const L = (path: string) => localePath(locale, path);
  const nav = NAV_ROUTES.map((route, i) => [L(route), d.nav[NAV_KEYS[i]]] as const);
  return (
    <header className="site-header">
      <Link className="brand" href={L("/")} aria-label={d.brand.home}>
        <span className="brand-mark"><Logo /></span>
        <span><b>REOS</b><small>{d.brand.tagline}</small></span>
      </Link>
      <nav aria-label={d.nav.primary}>
        {nav.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
      <PreferencesControls locale={locale} />
      <details className="mobile-menu">
        <summary aria-label={d.nav.open}><span /><span /><span /></summary>
        <nav aria-label={d.nav.mobile}>
          {nav.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
          <PreferencesControls locale={locale} />
        </nav>
      </details>
    </header>
  );
}

/** Footer architecture aligned to the frozen primary IA — REOS IA Freeze
 *  v1.0, 2026-08-19: EXPLORE (the five nav destinations, plus About and
 *  Authorities), INTELLIGENCE (its six categories) and PLATFORM (its
 *  licensed product catalogue). Glossary is deliberately NOT a standalone footer column —
 *  it sits inside INTELLIGENCE as Definitions & Glossary. */
export function Footer({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const d = getDict(locale);
  const L = (path: string) => localePath(locale, path);
  return (
    <footer className="site-footer">
      <div><span className="eyebrow">{d.footer.eyebrow}</span><h2>{d.footer.headline}<br /><em>{d.footer.headlineEm}</em></h2></div>
      <div className="footer-links">
        <div className="footer-group">
          <span className="footer-group-heading">{d.footer.exploreHeading}</span>
          <div className="footer-subnav">
            <Link href={L("/property-journey")}>{d.nav.journey}</Link>
            <Link href={L("/stakeholders")}>{d.nav.stakeholders}</Link>
            <Link href={L("/ecosystem")}>{d.nav.ecosystem}</Link>
            <Link href={L("/intelligence")}>{d.nav.intelligence}</Link>
            <Link href={L("/platform")}>{d.nav.platform}</Link>
            <Link href={L("/authorities")}>{d.nav.authorities}</Link>
            <Link href={L("/about")}>{d.nav.about}</Link>
          </div>
        </div>
        <div className="footer-group">
          <span className="footer-group-heading">{d.footer.intelligenceHeading}</span>
          <div className="footer-subnav">
            <Link href={L("/intelligence/guides")}>{d.footer.guides}</Link>
            <Link href={L("/intelligence#regulations")}>{d.footer.regulations}</Link>
            <Link href={L("/intelligence#processes")}>{d.footer.processes}</Link>
            <Link href={L("/intelligence#authority-information")}>{d.footer.authorityInformation}</Link>
            <Link href={L("/intelligence/definitions-and-glossary")}>{d.footer.definitionsGlossary}</Link>
            <Link href={L("/intelligence#knowledge-graph")}>{d.footer.knowledgeGraph}</Link>
          </div>
        </div>
        <div className="footer-group">
          <span className="footer-group-heading">{d.footer.platformHeading}</span>
          <div className="footer-subnav">
            {products.map((product) => (
              <Link key={product.slug} href={L(`/platform#${product.slug}`)}>{product.name}</Link>
            ))}
            <Link href={L("/platform/evaluation")}>Enterprise evaluation</Link>
            <Link href={L("/trust-centre")}>Trust Centre</Link>
          </div>
        </div>
      </div>
      <p className="fineprint">{d.footer.fineprint}</p>
    </footer>
  );
}

export function Page({
  children,
  className = "",
  locale = DEFAULT_LOCALE,
  dock = true,
}: {
  children: ReactNode;
  className?: string;
  locale?: Locale;
  /** Set false where a floating assistant would be redundant or out of place:
   *  the assistant's own page, and the internal admin screens. */
  dock?: boolean;
}) {
  const d = getDict(locale);
  return <>
    <Header locale={locale} />
    {locale !== DEFAULT_LOCALE && (
      <p className="translation-notice"><b>{LOCALE_META[locale].nativeName}</b> — {d.common.translationNotice}</p>
    )}
    <main className={className}>{children}</main>
    <Footer locale={locale} />
    {dock && <AssistantDock snapshot={buildSnapshot(locale)} locale={locale} />}
  </>;
}

export function StatusTag({ status, locale = DEFAULT_LOCALE }: { status: ContentStatus; locale?: Locale }) {
  const key = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status status-${key}`}>{getDict(locale).status[status]}</span>;
}

export function SectionIntro({ label, title, copy }: { label: string; title: ReactNode; copy?: ReactNode }) {
  return <div className="section-intro"><span className="eyebrow">{label}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>;
}

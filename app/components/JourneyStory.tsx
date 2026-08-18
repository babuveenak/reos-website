import Link from "next/link";
import { DEFAULT_LOCALE, localePath, type Locale } from "../i18n/config";
import { getDict } from "../i18n/dictionary";
import { getGroups, getModules } from "../i18n/content";
import { SectionIntro, StatusTag } from "./SiteShell";

/* ------------------------------------------------------------------ *
 * JOURNEY LANDING — the story after the hero.
 *
 * Journey-first, product-last: the platform is not named until the
 * fifth section, because the lifecycle is the argument and the product
 * is only what makes it operable.
 *
 * Nothing here invents content. The stakeholder section renders the
 * twelve groups from data/ecosystem.ts, and the platform preview
 * renders the modules already declared there, each with the status it
 * already carries. No unlabelled product claim is added.
 * ------------------------------------------------------------------ */

export function JourneyProblemSection({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const t = getDict(locale).journey.landing.problem;
  const items = [
    t.items.stakeholders, t.items.systems, t.items.approvals, t.items.documents,
    t.items.finance, t.items.handover, t.items.experience, t.items.intelligence,
  ];
  return (
    <section className="section-pad jl-problem">
      <SectionIntro
        label={t.label}
        title={<>{t.title}<br /><em>{t.titleEm}</em></>}
        copy={t.copy}
      />
      <ul className="jl-problem-grid">
        {items.map((item, i) => (
          <li key={item.title} style={{ "--i": i } as React.CSSProperties}>
            <b>{item.title}</b>
            <p>{item.copy}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function JourneyStakeholders({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const t = getDict(locale).journey.landing.stakeholders;
  const all = getGroups(locale);
  /* Rule: the regulatory rail is compulsory and external. It is drawn
     across the journey, not as one cluster among peers. */
  const rail = all.filter((g) => g.cluster === "rail");
  const appointed = all.filter((g) => g.cluster !== "rail");
  return (
    <section className="section-pad jl-stakeholders">
      <SectionIntro
        label={t.label}
        title={<>{t.title}<br /><em>{t.titleEm}</em></>}
        copy={t.copy}
      />
      <ul className="jl-group-grid">
        {appointed.map((g, i) => (
          <li key={g.id} style={{ "--i": i } as React.CSSProperties}>
            <span>{String(g.number).padStart(2, "0")}</span>
            <b>{g.short}</b>
            <small>{g.controls}</small>
          </li>
        ))}
      </ul>
      {rail.map((g) => (
        <div key={g.id} className="jl-rail">
          <span>{String(g.number).padStart(2, "0")}</span>
          <div>
            <b>{g.name}</b>
            <small>{g.controls}</small>
            {g.boundary && <small className="jl-rail-boundary">{g.boundary}</small>}
          </div>
          <StatusTag status={g.status} locale={locale} />
        </div>
      ))}
      <Link className="text-link" href={localePath(locale, "/ecosystem")}>
        {t.cta} <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

export function JourneyIntelligence({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const t = getDict(locale).journey.landing.intelligence;
  const rows = [
    t.items.documents, t.items.approvals, t.items.interactions,
    t.items.activity, t.items.leadership,
  ];
  return (
    <section className="section-pad jl-intelligence">
      <SectionIntro
        label={t.label}
        title={<>{t.title}<br /><em>{t.titleEm}</em></>}
        copy={t.copy}
      />
      <ul className="jl-shift">
        {rows.map((r, i) => (
          <li key={r.from} style={{ "--i": i } as React.CSSProperties}>
            <span className="jl-shift-from">{r.from}</span>
            <i aria-hidden="true">→</i>
            <span className="jl-shift-to">{r.to}</span>
            <p>{r.copy}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function JourneyPlatformPreview({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const t = getDict(locale).journey.landing.platform;
  /* Through the i18n getter, not the raw data file: the Arabic overlay for
     modules exists and importing `modules` directly rendered English. */
  const modules = getModules(locale);
  return (
    <section className="section-pad jl-platform">
      <SectionIntro
        label={t.label}
        title={<>{t.title}<br /><em>{t.titleEm}</em></>}
        copy={t.copy}
      />
      <ul className="jl-module-grid">
        {modules.map((m, i) => (
          <li key={m.id} style={{ "--i": i } as React.CSSProperties}>
            <header>
              <b>{m.name}</b>
              <StatusTag status={m.status} locale={locale} />
            </header>
            <p>{m.copy}</p>
          </li>
        ))}
      </ul>
      <Link className="text-link" href={localePath(locale, "/platform")}>
        {t.cta} <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}

export function JourneyFinalCTA({ locale = DEFAULT_LOCALE }: { locale?: Locale }) {
  const t = getDict(locale).journey.landing.final;
  /* Both actions land on /platform. The demo CTA lives there and only
     there — a test asserts /journey never links to /demo. */
  return (
    <section className="jl-final">
      <h2>{t.title}<br /><em>{t.titleEm}</em></h2>
      <p>{t.copy}</p>
      <div className="jl-actions">
        <Link className="button gold" href={localePath(locale, "/platform")}>
          {t.ctaPrimary}<span aria-hidden="true">→</span>
        </Link>
        <Link className="button" href={localePath(locale, "/platform")}>
          {t.ctaSecondary}<span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}

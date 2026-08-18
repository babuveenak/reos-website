import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import { getDict } from "../i18n/dictionary";
import { SectionIntro } from "./SiteShell";

/* ------------------------------------------------------------------ *
 * From process visibility to lifecycle intelligence.
 *
 * The one section of the Option C story the homepage did not already
 * tell: it has a fragmentation band, a stakeholder reveal, a platform
 * band and a closing CTA of its own, so those were not duplicated here.
 * ------------------------------------------------------------------ */

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

"use client";

import { useMemo, useState } from "react";
import type { GuidanceDirectory } from "../data/stakeholderGuidance";
import { officialSourceById } from "../data/officialSources";
import type { Locale } from "../i18n/config";

const EMIRATES = ["All UAE", "Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"];

export function StakeholderOfficialDirectory({ directory, locale }: { directory: GuidanceDirectory; locale: Locale }) {
  const ar = locale === "ar";
  const [query, setQuery] = useState("");
  const [emirate, setEmirate] = useState("All UAE");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const items = useMemo(() => directory.items.filter((item) => {
    const matchesEmirate = emirate === "All UAE" || item.emirates.includes(emirate);
    const searchable = [item.name, item.description, ...item.keywords ?? []].join(" ").toLocaleLowerCase();
    return matchesEmirate && (!normalizedQuery || searchable.includes(normalizedQuery));
  }), [directory.items, emirate, normalizedQuery]);

  return <div className="stakeholder-directory-tool">
    <div className="stakeholder-directory-controls">
      <label>
        <span>{ar ? "ابحث في القنوات" : "Search official channels"}</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder={ar ? "العنوان، الترخيص، الجهة..." : "Title, licence, authority..."} />
      </label>
      <label>
        <span>{ar ? "الإمارة" : "Emirate"}</span>
        <select value={emirate} onChange={(event) => setEmirate(event.target.value)}>
          {EMIRATES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
    </div>

    <div className="official-directory-filters" aria-label={ar ? "مرشحات سريعة" : "Quick directory filters"}>
      {directory.filters.map((filter) => <button key={filter} type="button" aria-pressed={query === filter} onClick={() => setQuery(query === filter ? "" : filter)}>{filter}</button>)}
    </div>

    <p className="stakeholder-directory-count" aria-live="polite">{items.length} {ar ? "قنوات مطابقة" : items.length === 1 ? "matching channel" : "matching channels"}</p>
    {items.length > 0 ? <div className="stakeholder-directory-results">
      {items.map((item) => {
        const source = item.sourceId ? officialSourceById[item.sourceId] : undefined;
        return <article key={`${item.name}-${item.status}`} className={`directory-result directory-result-${item.status}`}>
          <div><span>{item.status === "official" ? (ar ? "مصدر رسمي" : "Official source") : "TODO: connect data source"}</span><small>{item.emirates.join(" · ")}</small></div>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          {source ? <a href={source.url} target="_blank" rel="noreferrer">{item.sourceId === "dld.broker-directory" ? (ar ? "افتح سجل الوسطاء المرخصين لدى دائرة الأراضي والأملاك ↗" : "Open the DLD licensed-broker registry ↗") : `${source.authority} · ${ar ? "افتح المصدر ↗" : "Open official source ↗"}`}</a> : <b>{ar ? "لا توجد قائمة كيانات معروضة حتى يتم ربط مصدر رسمي حي." : "No entity names are shown until a live official source is connected."}</b>}
        </article>;
      })}
    </div> : <div className="stakeholder-directory-empty" role="status">
      <b>{ar ? "لا يوجد مصدر مباشر متصل لهذا الفلتر." : "No live source is connected for this filter."}</b>
      <p>{ar ? "TODO: ربط مصدر رسمي. لا تستنتج REOS أو تنسخ أسماء الكيانات." : "TODO: connect data source. REOS does not infer or copy entity names."}</p>
    </div>}
  </div>;
}

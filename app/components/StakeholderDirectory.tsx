"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import type { Group } from "../data/ecosystem";
import type { Stage } from "../data/journey";
import type { ParticipationState } from "../data/stakeholderBlueprints";
import { localePath, type Locale } from "../i18n/config";

type DirectoryProfile = { stakeholderId: string; participation: ParticipationState[] };
type Props = { groups: Group[]; stages: Stage[]; profiles: DirectoryProfile[]; locale: Locale };

const LEVEL_COPY = {
  en: { lead: "Lead", active: "Active", supporting: "Supporting", informed: "Informed" },
  ar: { lead: "قيادة", active: "دور نشط", supporting: "دور داعم", informed: "على اطلاع" },
} as const;

function StakeholderGlyph({ id }: { id: string }) {
  const common = { viewBox: "0 0 48 48", "aria-hidden": true, "data-stakeholder-glyph": id } as const;
  if (id === "landowners-investors") return <svg {...common}><path d="m6 31 18-9 18 9-18 9-18-9Zm0 0V20l18-9 18 9v11M24 11v11" /><circle cx="35" cy="15" r="5" /><path d="M35 12v6m-2-4h4m-4 3h4" /></svg>;
  if (id === "developers") return <svg {...common}><path d="M6 41h36M10 41V20h12v21m0 0V8h16v33M14 25h4m-4 6h4m-4 6h4m13-22h-4m4 7h-4m4 7h-4m4 7h-4" /></svg>;
  if (id === "consultants-designers") return <svg {...common}><path d="M7 40 24 7l17 33H7Z" /><path d="m14 34 10-20 10 20H14Zm10-20v20M10 40l28-28" /></svg>;
  if (id === "authorities-regulators") return <svg {...common}><path d="m5 17 19-11 19 11H5Zm3 24h32M11 19v17m8-17v17m10-17v17m8-17v17" /><path d="m19 27 4 4 8-9" /></svg>;
  if (id === "utility-providers") return <svg {...common}><path d="m26 5-12 22h10l-3 16 13-23H24l2-15Z" /><path d="M7 37c0-4 4-8 4-8s4 4 4 8a4 4 0 0 1-8 0Z" /></svg>;
  if (id === "contractors") return <svg {...common}><path d="M6 33h36M10 33v-5a14 14 0 0 1 28 0v5M24 14V7m-7 9-4-5m18 5 4-5M9 40h30" /></svg>;
  if (id === "suppliers-vendors") return <svg {...common}><path d="m7 17 17-9 17 9-17 9-17-9Zm0 0v20l17 8 17-8V17M24 26v19" /><path d="m17 12 17 9v9" /></svg>;
  if (id === "brokers-agencies") return <svg {...common}><path d="M6 26 24 10l18 16M11 23v18h26V23M18 41V30h12v11" /><circle cx="35" cy="13" r="6" /><path d="m39 17 5 5m-9-9h.1" /></svg>;
  if (id === "banks-financial") return <svg {...common}><path d="m5 17 19-11 19 11H5Zm3 23h32M11 19v16m8-16v16m10-16v16m8-16v16" /><circle cx="24" cy="13" r="2" /></svg>;
  if (id === "property-owners") return <svg {...common}><path d="M5 23 24 7l19 16M10 20v21h28V20M18 41V29h12v12" /><path d="M34 8h9v14m-9-9h9" /></svg>;
  if (id === "residents-tenants") return <svg {...common}><path d="M6 24 22 10l16 14M10 21v20h24V21M18 41V29h9v12" /><circle cx="38" cy="14" r="5" /><path d="m41 18 5 5m-8-9h.1" /></svg>;
  return <svg {...common}><path d="M6 40h36M10 40V19h28v21M15 25h6m6 0h6m-18 7h6m6 0h6" /><circle cx="36" cy="13" r="6" /><path d="M36 4v3m0 12v3m-9-9h3m12 0h3m-15-6 2 2m8 8 2 2m0-12-2 2m-8 8-2 2" /></svg>;
}

const relationshipLabel = (level: ParticipationState["relationshipLevel"], locale: Locale) => LEVEL_COPY[locale][level];

export function StakeholderDirectory({ groups, stages, profiles, locale }: Props) {
  const [selectedId, setSelectedId] = useState(groups[0]?.id ?? "landowners-investors");
  const selectorId = useId();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const ar = locale === "ar";
  const L = (path: string) => localePath(locale, path);
  const profileById = Object.fromEntries(profiles.map((profile) => [profile.stakeholderId, profile]));
  const selectedIndex = Math.max(0, groups.findIndex((group) => group.id === selectedId));
  const selected = groups[selectedIndex] ?? groups[0];
  const profile = profileById[selected.id];
  const participation = profile?.participation ?? [];
  const practicalEntry = participation.find((item) => item.relationshipLevel === "lead" || item.relationshipLevel === "active")
    ?? participation.find((item) => item.relationshipLevel === "supporting")
    ?? participation[0];
  const entryStage = stages.find((stage) => stage.id === practicalEntry?.stageId) ?? stages[0];
  const workingTouchpoints = participation.filter((item) => item.relationshipLevel === "lead" || item.relationshipLevel === "active").length;

  const selectAt = (index: number) => {
    const next = (index + groups.length) % groups.length;
    setSelectedId(groups[next].id);
    buttons.current[next]?.focus();
  };

  return <section className="stakeholder-lifecycle-explorer" aria-labelledby={`${selectorId}-title`}>
    <header className="stakeholder-explorer-heading">
      <div>
        <span className="eyebrow">{ar ? "اختر صاحب المصلحة" : "CHOOSE A STAKEHOLDER"}</span>
        <h2 id={`${selectorId}-title`}>{ar ? <>دور واحد.<br /><em>مسار واضح.</em></> : <>One role.<br /><em>One clear route.</em></>}</h2>
      </div>
      <p>{ar ? "اختر مجموعتك لترى نقطة دخولها العملية وعلاقتها بالمراحل السبع." : "Select your group to reveal its practical entry point and relationship to all seven stages."}</p>
    </header>

    <div className="stakeholder-role-selector" role="group" aria-label={ar ? "مجموعات أصحاب المصلحة الاثنتا عشرة" : "Twelve stakeholder groups"}>
      {groups.map((group, index) => {
        const isSelected = group.id === selected.id;
        return <button
          key={group.id}
          ref={(node) => { buttons.current[index] = node; }}
          type="button"
          aria-pressed={isSelected}
          className={`stakeholder-role-platform cluster-${group.cluster}${isSelected ? " is-selected" : ""}`}
          onPointerEnter={() => setSelectedId(group.id)}
          onFocus={() => setSelectedId(group.id)}
          onClick={() => setSelectedId(group.id)}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") { event.preventDefault(); selectAt(index + (ar ? -1 : 1)); }
            if (event.key === "ArrowLeft") { event.preventDefault(); selectAt(index + (ar ? 1 : -1)); }
            if (event.key === "Home") { event.preventDefault(); selectAt(0); }
            if (event.key === "End") { event.preventDefault(); selectAt(groups.length - 1); }
          }}
        >
          <span className="role-platform-number">{String(group.number).padStart(2, "0")}</span>
          <span className="role-platform-object" aria-hidden="true"><i /><i /><b><StakeholderGlyph id={group.id} /></b></span>
          <strong>{group.name}</strong>
        </button>;
      })}
    </div>

    <div className="stakeholder-route-stage" aria-live="polite">
      <div className="selected-role-island" aria-hidden="true">
        <i className="selected-role-shadow" />
        <i className="selected-role-base" />
        <span><StakeholderGlyph id={selected.id} /></span>
        <b>{String(selected.number).padStart(2, "0")}</b>
      </div>
      <div className="selected-role-guidance">
        <small>{ar ? "دورك المختار" : "YOUR SELECTED ROLE"}</small>
        <h3>{selected.name}</h3>
        <p>{selected.controls}</p>
        <dl>
          <div><dt>{ar ? "نقطة الدخول العملية" : "Practical entry"}</dt><dd>{String(entryStage.number).padStart(2, "0")} · {entryStage.name}</dd></div>
          <div><dt>{ar ? "نقاط الاتصال النشطة" : "Working touchpoints"}</dt><dd>{workingTouchpoints} / 7</dd></div>
        </dl>
        <Link href={L(`/stakeholders/${selected.id}`)}>{ar ? `استكشف دورة حياة ${selected.name}` : `Explore ${selected.name} lifecycle`} <span aria-hidden="true">→</span></Link>
      </div>
    </div>

    <div className="stakeholder-journey-visual">
      <header><span>{ar ? "مسارك عبر دورة حياة العقار" : "YOUR ROUTE ACROSS THE PROPERTY LIFECYCLE"}</span><b>{ar ? "المعلومات → الدعم → النشاط → القيادة" : "Informed → Supporting → Active → Lead"}</b></header>
      <ol aria-label={ar ? `مشاركة ${selected.name} عبر المراحل السبع` : `${selected.name} participation across the seven stages`}>
        {stages.map((stage) => {
          const state = participation.find((item) => item.stageId === stage.id);
          const level = state?.relationshipLevel ?? "informed";
          const label = relationshipLabel(level, locale);
          const isEntry = stage.id === entryStage.id;
          return <li key={stage.id} className={`journey-visual-stage level-${level}${isEntry ? " is-entry" : ""}`}>
            <div className="stage-flow-segment" aria-hidden="true"><i /><i /></div>
            <span>{String(stage.number).padStart(2, "0")}</span>
            <b>{stage.name}</b>
            <small>{label}</small>
            {isEntry ? <em>{ar ? "ابدأ هنا" : "START HERE"}</em> : null}
          </li>;
        })}
      </ol>
    </div>
  </section>;
}

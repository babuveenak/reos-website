"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Group, Cluster } from "../data/ecosystem";
import type { Stage } from "../data/journey";
import type { ParticipationState } from "../data/stakeholderBlueprints";
import { localePath, type Locale } from "../i18n/config";

type DirectoryProfile = { stakeholderId: string; firstDecision: string; participation: ParticipationState[] };
type Props = { groups: Group[]; clusters: Cluster[]; stages: Stage[]; profiles: DirectoryProfile[]; locale: Locale };

export function StakeholderDirectory({ groups, clusters, stages, profiles, locale }: Props) {
  const [query, setQuery] = useState("");
  const [cluster, setCluster] = useState("all");
  const [stageId, setStageId] = useState("all");
  const [scope, setScope] = useState({ emirate: "dubai", track: "track-neutral" });
  const L = (path: string) => localePath(locale, path);
  const ar = locale === "ar";
  const profileById = Object.fromEntries(profiles.map((profile) => [profile.stakeholderId, profile]));
  const clusterById = Object.fromEntries(clusters.map((item) => [item.id, item]));
  useEffect(() => {
    const emirate = sessionStorage.getItem("reos-stakeholder-emirate") ?? "dubai";
    const track = sessionStorage.getItem("reos-stakeholder-track") ?? "track-neutral";
    // Restore the visitor's last jurisdiction only after hydration; canonical
    // links remain stable in server HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScope({ emirate, track });
  }, []);
  const filtered = groups.filter((group) => {
    const haystack = `${group.name} ${group.members.join(" ")} ${group.controls}`.toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const matchesCluster = cluster === "all" || group.cluster === cluster;
    const profile = profileById[group.id];
    const matchesStage = stageId === "all" || profile?.participation.some((item) => item.stageId === stageId);
    return matchesQuery && matchesCluster && matchesStage;
  });

  return <>
    <div className="stakeholder-directory-controls" aria-label={ar ? "تصفية أصحاب المصلحة" : "Filter stakeholder groups"}>
      <label><span>{ar ? "بحث" : "Search"}</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={ar ? "الاسم أو المشارك" : "Name or participant"} /></label>
      <label><span>{ar ? "المجموعة" : "Cluster"}</span><select value={cluster} onChange={(event) => setCluster(event.target.value)}><option value="all">{ar ? "جميع المجموعات" : "All clusters"}</option>{clusters.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
      <label><span>{ar ? "المرحلة" : "Lifecycle stage"}</span><select value={stageId} onChange={(event) => setStageId(event.target.value)}><option value="all">{ar ? "جميع المراحل" : "All stages"}</option>{stages.map((stage) => <option key={stage.id} value={stage.id}>{String(stage.number).padStart(2, "0")} {stage.name}</option>)}</select></label>
      <p aria-live="polite">{ar ? `${filtered.length} من 12 مجموعة` : `${filtered.length} of 12 groups`}</p>
    </div>

    <div className="stakeholder-profile-list">
      {filtered.map((group) => {
        const profile = profileById[group.id];
        const participation = profile?.participation ?? [];
        const involved = participation;
        const lead = participation.filter((item) => item.state === "lead");
        const first = stages.find((stage) => stage.id === involved[0]?.stageId);
        const last = stages.findLast((stage) => involved.some((item) => item.stageId === stage.id));
        return <article key={group.id} className={`group-card stakeholder-profile-card cluster-${group.cluster}`}>
          <header><span>{String(group.number).padStart(2, "0")}</span><div><small>{clusterById[group.cluster]?.name}</small><h3>{group.name}</h3></div><b className="coverage-pill is-reference">{ar ? "5 مسارات دبي" : "5 Dubai routes"}</b></header>
          <div className="stakeholder-profile-body">
            <section><small>{ar ? "من تشملهم المجموعة" : "Who this includes"}</small><p>{group.members.slice(0, 3).join(" · ")}{group.members.length > 3 ? ` +${group.members.length - 3}` : ""}</p></section>
            <section><small>{ar ? "نقطة البداية" : "Your starting point"}</small><p><b>{first ? `${String(first.number).padStart(2, "0")} ${first.name}` : (ar ? "حسب المشروع" : "Project-specific")}</b>{profile?.firstDecision}</p></section>
          </div>
          <div className="stakeholder-stage-rail" role="list" aria-label={ar ? `مشاركة ${group.name} عبر المراحل` : `${group.name} lifecycle participation`}>
            {stages.map((stage) => { const item = participation.find((candidate) => candidate.stageId === stage.id); const level = item?.relationshipLevel ?? "informed"; const stateLabel = level === "lead" ? (ar ? "قيادة" : "Lead") : level === "active" ? (ar ? "دور نشط" : "Active") : level === "supporting" ? (ar ? "دور داعم" : "Supporting") : (ar ? "على اطلاع" : "Informed"); return <span key={stage.id} role="listitem" className={`stage-state state-${level}`} title={`${stage.name}: ${stateLabel}`}><b>{String(stage.number).padStart(2, "0")}</b><i className="sr-only">{stage.name}: {stateLabel}</i></span>; })}
          </div>
          <footer><p><b>{involved.length}</b> {ar ? "مراحل مشاركة" : "participating stages"}<span>·</span><b>{lead.length}</b> {ar ? "مراحل قيادة" : "lead stages"}<span>·</span>{last ? `${ar ? "يمتد إلى" : "continues through"} ${String(last.number).padStart(2, "0")} ${last.name}` : (ar ? "حسب المشروع" : "Project-specific")}</p><Link href={L(scope.emirate === "dubai" && scope.track === "track-neutral" ? `/stakeholders/${group.id}` : `/stakeholders/${group.id}/${scope.emirate}${scope.emirate === "dubai" ? `/${scope.track}` : ""}`)}>{ar ? `افتح دورة حياة ${group.name}` : `Open ${group.name} lifecycle`} <span>→</span></Link></footer>
        </article>;
      })}
    </div>
  </>;
}

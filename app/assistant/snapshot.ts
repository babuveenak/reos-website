/**
 * KNOWLEDGE SNAPSHOT
 *
 * The only module here that imports the content data files. A server component
 * builds a snapshot and passes it to the client assistant as a prop.
 *
 * Two reasons this indirection is worth it:
 *
 *  1. BUNDLE SIZE. The content files total well over 100 KB of prose across
 *     journey.ts, personas.ts, ecosystem.ts, glossary.ts and their Arabic
 *     overlays. A client component that imports them ships all of it. The
 *     snapshot is a few kilobytes of ids and names.
 *  2. IT MODELS THE REAL ARCHITECTURE. In Phase 1B the client stops holding
 *     knowledge at all and asks a service for it. Passing a narrow, serialisable
 *     view now means the component contract does not change when that happens —
 *     only who produces the data.
 *
 * The snapshot is derived, never authored. Nothing here is a second content
 * model: change a stage name in journey.ts and this follows.
 */

import { getRoutes, getStages } from "../i18n/content";
import { personaBySlug } from "../data/personas";
import { contentSlug, routeBySlug } from "../data/routes";
import { authorities } from "../data/reos";
import type { Locale } from "../i18n/config";
import type { Phase, RouteSlug, StageId } from "./contracts";

export type StageSnapshot = {
  id: StageId;
  number: number;
  name: string;
  short: string;
  phase: Phase;
  /** The stage's own summary from journey.ts. Present so an answer about a
   *  stage quotes validated site copy instead of the mock inventing prose. */
  summary: string;
  /** Resolved names, not ids — the UI never has to look them up again. */
  runsWithNames: string[];
  nextStep: string | null;
};

export type RouteSnapshot = {
  slug: RouteSlug;
  title: string;
  ctaLabel: string;
  tier: 1 | 2 | 3;
  /** False for the five routes still awaiting a written journey. */
  hasContent: boolean;
};

/** Real authorities with their real published URLs. Never fabricated. */
export type AuthoritySnapshot = {
  id: string;
  name: string;
  jurisdiction: string;
  sourceUrl: string;
};

export type KnowledgeSnapshot = {
  locale: Locale;
  stages: StageSnapshot[];
  routes: RouteSnapshot[];
  authorities: AuthoritySnapshot[];
};

/** True when the route has a written journey in personas.ts. */
export function routeHasContent(slug: string): boolean {
  const route = routeBySlug[slug];
  return Boolean(route && personaBySlug[contentSlug(route)]);
}

export function buildSnapshot(locale: Locale): KnowledgeSnapshot {
  const stages = getStages(locale);
  const byId = new Map(stages.map((s) => [s.id, s.name]));
  return {
    locale,
    stages: stages.map((stage) => ({
      id: stage.id,
      number: stage.number,
      name: stage.name,
      short: stage.short,
      phase: stage.phase,
      summary: stage.summary,
      runsWithNames: stage.runsWith.map((id) => byId.get(id)).filter((n): n is string => Boolean(n)),
      nextStep: stage.nextStep ?? null,
    })),
    routes: getRoutes(locale).map((route) => ({
      slug: route.slug,
      title: route.title,
      ctaLabel: route.ctaLabel,
      tier: route.tier,
      hasContent: routeHasContent(route.slug),
    })),
    authorities: authorities.map((a) => ({
      id: a.id,
      name: a.name,
      jurisdiction: a.jurisdiction,
      sourceUrl: a.sourceUrl,
    })),
  };
}

/* ── snapshot lookups, shared by server and client ───────────────────────── */

export const stageIn = (snapshot: KnowledgeSnapshot, id: StageId | null): StageSnapshot | null =>
  (id ? snapshot.stages.find((s) => s.id === id) ?? null : null);

export const routeIn = (snapshot: KnowledgeSnapshot, slug: RouteSlug | null): RouteSnapshot | null =>
  (slug ? snapshot.routes.find((r) => r.slug === slug) ?? null : null);

export const authorityIn = (snapshot: KnowledgeSnapshot, id: string): AuthoritySnapshot | null =>
  snapshot.authorities.find((a) => a.id === id) ?? null;

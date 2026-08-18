import type { Locale } from "./config";
import { stages as stagesEn, tracks as tracksEn, layers as layersEn, type Stage } from "../data/journey";
import { personas as personasEn, type Persona } from "../data/personas";
import { clusters as clustersEn, groups as groupsEn, fragments as fragmentsEn, modules as modulesEn, outcomes as outcomesEn, insightCategories as insightsEn } from "../data/ecosystem";
import { terms as termsEn, type Term } from "../data/glossary";
import { stagesAr, trackAr, layersAr } from "./content/journey.ar";
import { personasAr } from "./content/personas.ar";
import { clustersAr, groupsAr, fragmentsAr, modulesAr, outcomesAr, insightCategoriesAr } from "./content/ecosystem.ar";
import { termsAr } from "./content/glossary.ar";
import { routesAr, orientationAr, routeUiAr, routeUiEn } from "./content/routes.ar";
import { routes as routesEnData, orientation as orientationEn, type Route } from "../data/routes";

/**
 * Locale-aware content.
 *
 * Arabic is applied as an overlay on top of English: ids, relationships,
 * stage links and ordering all stay in the English source of truth, and only
 * human-readable fields are swapped. A missing Arabic entry therefore falls
 * back to English rather than producing an empty page — which matters while
 * the translation is still under review.
 */
const isAr = (l: Locale) => l === "ar";

export function getStages(locale: Locale): Stage[] {
  if (!isAr(locale)) return stagesEn;
  return stagesEn.map((s) => ({ ...s, ...(stagesAr[s.id] ?? {}) }));
}

export function getStage(locale: Locale, id: string): Stage | undefined {
  return getStages(locale).find((s) => s.id === id);
}

export function getTracks(locale: Locale) {
  if (!isAr(locale)) return tracksEn;
  return tracksEn.map((t) => ({ ...t, ...(trackAr[t.id] ?? {}) }));
}

export function getLayers(locale: Locale) {
  if (!isAr(locale)) return layersEn;
  return layersEn.map((l) => ({ ...l, ...(layersAr[l.id] ?? {}) }));
}

export function getPersonas(locale: Locale): Persona[] {
  if (!isAr(locale)) return personasEn;
  return personasEn.map((p) => {
    const ar = personasAr[p.slug];
    if (!ar) return p;
    const { steps: arSteps, ...rest } = ar;
    return {
      ...p,
      ...rest,
      // Merge positionally so each step keeps its canonical stageId.
      steps: p.steps.map((step, i) => ({ ...step, ...(arSteps?.[i] ?? {}) })),
    };
  });
}

export function getPersona(locale: Locale, slug: string): Persona | undefined {
  return getPersonas(locale).find((p) => p.slug === slug);
}

export function getGroups(locale: Locale) {
  if (!isAr(locale)) return groupsEn;
  return groupsEn.map((g) => ({ ...g, ...(groupsAr[g.id] ?? {}) }));
}

export function getClusters(locale: Locale) {
  if (!isAr(locale)) return clustersEn;
  return clustersEn.map((c) => ({ ...c, ...(clustersAr[c.id] ?? {}) }));
}

export function getFragments(locale: Locale) {
  return isAr(locale) ? fragmentsAr : fragmentsEn;
}

export function getModules(locale: Locale) {
  if (!isAr(locale)) return modulesEn;
  return modulesEn.map((m) => ({ ...m, ...(modulesAr[m.id] ?? {}) }));
}

export function getOutcomes(locale: Locale) {
  return isAr(locale) ? outcomesAr : outcomesEn;
}

export function getInsightCategories(locale: Locale) {
  if (!isAr(locale)) return insightsEn;
  return insightsEn.map((c) => ({ ...c, ...(insightCategoriesAr[c.id] ?? {}) }));
}

export function getTerms(locale: Locale): Term[] {
  if (!isAr(locale)) return termsEn;
  return termsEn.map((t) => ({ ...t, ...(termsAr[t.id] ?? {}) }));
}

/** Which entities still lack an Arabic entry — used by the review notice. */
export function translationCoverage() {
  const pct = (have: number, all: number) => Math.round((have / all) * 100);
  return {
    stages: pct(Object.keys(stagesAr).length, stagesEn.length),
    personas: pct(Object.keys(personasAr).length, personasEn.length),
    groups: pct(Object.keys(groupsAr).length, groupsEn.length),
    terms: pct(Object.keys(termsAr).length, termsEn.length),
  };
}

export function getRoutes(locale: Locale): Route[] {
  if (!isAr(locale)) return routesEnData;
  return routesEnData.map((r) => ({ ...r, ...(routesAr[r.slug] ?? {}) }));
}

export function getOrientation(locale: Locale) {
  return isAr(locale) ? { ...orientationEn, ...orientationAr } : orientationEn;
}

export function getRouteUi(locale: Locale) {
  return isAr(locale) ? routeUiAr : routeUiEn;
}

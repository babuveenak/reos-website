/**
 * Locale configuration.
 *
 * English stays at the root (`/property-journey`) so existing URLs and their
 * search history survive; Arabic is served from a parallel `/ar` tree. Both are
 * statically generated, so each language is independently shareable,
 * crawlable and cacheable — which a client-side-only toggle could never be.
 */
export const LOCALES = ["en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_META: Record<Locale, { name: string; nativeName: string; dir: "ltr" | "rtl" }> = {
  en: { name: "English", nativeName: "English", dir: "ltr" },
  ar: { name: "Arabic", nativeName: "العربية", dir: "rtl" },
};

/** Prefix a path for a locale. English is unprefixed. */
export function localePath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return clean;
  return clean === "/" ? "/ar" : `/ar${clean}`;
}

/** Strip the locale prefix from a path, returning the shared route. */
export function stripLocale(path: string): { locale: Locale; path: string } {
  if (path === "/ar" || path.startsWith("/ar/")) {
    return { locale: "ar", path: path.slice(3) || "/" };
  }
  return { locale: DEFAULT_LOCALE, path };
}

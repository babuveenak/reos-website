import { LOCALE_META } from "../i18n/config";

/**
 * Arabic subtree. `dir` and `lang` are set on the server so the first paint is
 * already right-to-left — a client-side flip would show a frame of LTR layout
 * before correcting itself.
 */
export const metadata = {
  alternates: { canonical: "/ar", languages: { en: "/", ar: "/ar" } },
};

export default function ArabicLayout({ children }: { children: React.ReactNode }) {
  return <div lang="ar" dir={LOCALE_META.ar.dir} className="locale-ar">{children}</div>;
}

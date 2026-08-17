"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";
type Scale = "normal" | "large" | "xlarge";
type Language = "en" | "ar";

const LABELS = {
  en: { language: "Language", size: "Text size", toDark: "Switch to dark theme", toLight: "Switch to light theme" },
  ar: { language: "اللغة", size: "حجم النص", toDark: "التبديل إلى الوضع الداكن", toLight: "التبديل إلى الوضع الفاتح" },
};

export function PreferencesControls() {
  const [theme, setTheme] = useState<Theme>("light");
  const [scale, setScale] = useState<Scale>("normal");
  const [language, setLanguage] = useState<Language>("en");

  function apply(t: Theme, s: Scale, l: Language) {
    const root = document.documentElement;
    root.dataset.theme = t;
    root.dataset.fontScale = s;
    root.lang = l;
    root.dir = l === "ar" ? "rtl" : "ltr";
  }

  useEffect(() => {
    const root = document.documentElement;
    const t = (localStorage.getItem("reos-theme") as Theme) || (root.dataset.theme as Theme) || "light";
    const s = (localStorage.getItem("reos-scale") as Scale) || (root.dataset.fontScale as Scale) || "normal";
    const l = (localStorage.getItem("reos-language") as Language) || (root.lang as Language) || "en";
    // Restore client-only preferences after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(t); setScale(s); setLanguage(l); apply(t, s, l);
  }, []);

  /** One control, two states — no menu to open for a binary choice. */
  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("reos-theme", next);
    apply(next, scale, language);
  }
  function changeScale(v: Scale) { setScale(v); localStorage.setItem("reos-scale", v); apply(theme, v, language); }
  function changeLanguage(v: Language) { setLanguage(v); localStorage.setItem("reos-language", v); apply(theme, scale, v); }

  const t = LABELS[language];

  return (
    <div className="preference-controls">
      <label>
        <span>{t.language}</span>
        <select aria-label={t.language} value={language} onChange={(e) => changeLanguage(e.target.value as Language)}>
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </label>

      <label>
        <span>{t.size}</span>
        <select aria-label={t.size} value={scale} onChange={(e) => changeScale(e.target.value as Scale)}>
          <option value="normal">A</option>
          <option value="large">A+</option>
          <option value="xlarge">A++</option>
        </select>
      </label>

      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        aria-pressed={theme === "dark"}
        aria-label={theme === "dark" ? t.toLight : t.toDark}
        title={theme === "dark" ? t.toLight : t.toDark}
      >
        <span className="toggle-track" aria-hidden="true">
          <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.4v2.2M12 19.4v2.2M4.2 12H2M22 12h-2.2M6.1 6.1 4.6 4.6M19.4 19.4l-1.5-1.5M17.9 6.1l1.5-1.5M4.6 19.4l1.5-1.5" />
          </svg>
          <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.5 14.2A8.6 8.6 0 0 1 9.8 3.5a8.6 8.6 0 1 0 10.7 10.7Z" />
          </svg>
          <i className="toggle-knob" />
        </span>
      </button>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DUBAI_TRACKS, EMIRATES, type DubaiTrack, type EmirateId } from "../data/stakeholderBlueprints";
import { localePath, type Locale } from "../i18n/config";

export function StakeholderJurisdictionSelector({ stakeholderId, emirate, track, locale }: { stakeholderId: string; emirate: EmirateId; track: DubaiTrack; locale: Locale }) {
  const router = useRouter();
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    sessionStorage.setItem("reos-stakeholder-emirate", emirate);
    sessionStorage.setItem("reos-stakeholder-track", track);
  }, [emirate, track]);

  function route(nextEmirate: EmirateId, nextTrack: DubaiTrack = "track-neutral") {
    const suffix = nextEmirate === "dubai" ? `/${nextEmirate}/${nextTrack}` : `/${nextEmirate}`;
    const label = EMIRATES.find((item) => item.id === nextEmirate)?.label ?? nextEmirate;
    setAnnouncement(locale === "ar" ? `جارٍ فتح نطاق ${label}` : `Opening ${label} scope`);
    router.push(localePath(locale, `/stakeholders/${stakeholderId}${suffix}`));
  }

  const ar = locale === "ar";
  return <div className="stakeholder-scope-selector">
    <label>
      <span>{ar ? "الإمارة" : "Emirate"}</span>
      <select value={emirate} onChange={(event) => route(event.target.value as EmirateId)}>
        {EMIRATES.map((item) => <option key={item.id} value={item.id}>{ar ? item.ar : item.label}</option>)}
      </select>
    </label>
    {emirate === "dubai" && <label>
      <span>{ar ? "مسار دبي" : "Dubai route"}</span>
      <select value={track} onChange={(event) => route("dubai", event.target.value as DubaiTrack)}>
        {DUBAI_TRACKS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>
    </label>}
    <p className="sr-only" aria-live="polite">{announcement}</p>
  </div>;
}

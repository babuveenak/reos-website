"use client";

import Image from "next/image";
import type { PointerEvent } from "react";

const STAKEHOLDER_HERO_IMAGES: Record<string, string> = {
  "landowners-investors": "/images/stakeholder-landowners-investors-hero-v1.png",
  developers: "/images/stakeholder-developers-hero-v1.jpg",
  "consultants-designers": "/images/stakeholder-consultants-designers-hero-v1.jpg",
  "authorities-regulators": "/images/stakeholder-authorities-regulators-hero-v1.jpg",
  "utility-providers": "/images/stakeholder-utility-providers-hero-v1.jpg",
  contractors: "/images/stakeholder-contractors-hero-v1.jpg",
  "suppliers-vendors": "/images/stakeholder-suppliers-vendors-hero-v1.jpg",
  "brokers-agencies": "/images/stakeholder-brokers-agencies-hero-v1.jpg",
  "banks-financial": "/images/stakeholder-banks-financial-hero-v1.jpg",
  "property-owners": "/images/stakeholder-property-owners-hero-v1.jpg",
  "residents-tenants": "/images/stakeholder-residents-tenants-hero-v1.jpg",
  "facility-community-operators": "/images/stakeholder-facility-community-operators-hero-v1.jpg",
};

type Props = {
  stakeholderId: string;
  stakeholderName: string;
  caption: string;
  locale: "en" | "ar";
};

export function StakeholderHeroVisual({ stakeholderId, stakeholderName, caption, locale }: Props) {
  const src = STAKEHOLDER_HERO_IMAGES[stakeholderId];
  if (!src) return null;

  const resetTilt = (element: HTMLElement) => {
    element.style.setProperty("--visual-rx", "0deg");
    element.style.setProperty("--visual-ry", "0deg");
    element.style.setProperty("--visual-x", "50%");
    element.style.setProperty("--visual-y", "45%");
  };

  const trackPointer = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty("--visual-rx", `${(0.5 - y) * 3}deg`);
    event.currentTarget.style.setProperty("--visual-ry", `${(x - 0.5) * 4}deg`);
    event.currentTarget.style.setProperty("--visual-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--visual-y", `${y * 100}%`);
  };

  const alt = locale === "ar"
    ? `تصور ثلاثي الأبعاد توضيحي لدور ${stakeholderName} في دورة حياة العقار`
    : `Illustrative 3D diorama of the ${stakeholderName} role in the property lifecycle`;

  return <figure
    className="stakeholder-blueprint-visual"
    onPointerMove={trackPointer}
    onPointerLeave={(event) => resetTilt(event.currentTarget)}
  >
    <Image src={src} alt={alt} fill sizes="(max-width: 1050px) calc(100vw - 2.4rem), 56vw" priority />
    <span className="stakeholder-visual-light" aria-hidden="true" />
    <figcaption>REOS · {caption}</figcaption>
  </figure>;
}

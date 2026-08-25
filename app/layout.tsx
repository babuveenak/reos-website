import type { Metadata, Viewport } from "next";
import "./globals.css";

import { SITE_URL } from "./data/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "REOS Seven-Stage Property Lifecycle", template: "%s" },
  description: "Navigate seven property lifecycle stages, twelve UAE stakeholder groups and every evidence-backed project decision.",
  applicationName: "REOS",
  keywords: ["REOS", "UAE property development", "real estate operating system", "development lifecycle", "property approvals", "PropTech"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "REOS", title: "REOS Seven-Stage Property Lifecycle", description: "See where the property is. Know what moves it forward.", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Seven connected property lifecycle stages across the REOS development route" }] },
  twitter: { card: "summary_large_image", title: "REOS Seven-Stage Property Lifecycle", description: "See where the property is. Know what moves it forward.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#F8F5EE", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="light" data-scroll-behavior="smooth"><body>{children}</body></html>;
}

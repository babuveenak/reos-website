import type { Metadata, Viewport } from "next";
import "./globals.css";

import { SITE_URL } from "./data/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "REOS — Understand the UAE Property Journey", template: "%s" },
  description: "Explore how property is planned, financed, designed, developed, built, sold, registered, handed over, managed and invested in across the UAE.",
  applicationName: "REOS",
  keywords: ["REOS", "UAE property development", "real estate operating system", "development lifecycle", "property approvals", "PropTech"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "REOS", title: "REOS — Understand the Property Journey", description: "The digital map of the UAE real estate ecosystem. Seven connected stages, twelve stakeholder groups, seven emirates.", images: [{ url: "/og.png", width: 1200, height: 630, alt: "REOS — Understand the Property Journey, from land to living" }] },
  twitter: { card: "summary_large_image", title: "REOS — Understand the Property Journey", description: "The digital map of the UAE real estate ecosystem.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#F8F5EE", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="light"><body>{children}</body></html>;
}

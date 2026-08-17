import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reos-website.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "REOS — Understand the UAE Property Journey", template: "%s" },
  description: "Explore how property is planned, financed, designed, developed, built, sold, registered, handed over, managed and invested in across the UAE.",
  applicationName: "REOS",
  keywords: ["REOS", "UAE property development", "real estate operating system", "development lifecycle", "property approvals", "PropTech"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "REOS", title: "REOS — The Operating System for Real Estate Development", description: "Twelve stakeholder groups. Twenty-four lifecycle stages. One connected operating model for UAE property development.", images: [{ url: "/og.png", width: 1200, height: 630, alt: "REOS — The Operating System for Real Estate Development" }] },
  twitter: { card: "summary_large_image", title: "REOS — The Operating System for Real Estate Development", description: "Twelve stakeholder groups. Twenty-four lifecycle stages. One connected operating model.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#F8F5EE", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="light"><body>{children}</body></html>;
}

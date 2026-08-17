import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reos-website.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "REOS — The Operating System for Real Estate Development", template: "%s" },
  description: "REOS connects developers, investors, regulators, consultants, contractors, brokers and property operations across the UAE property-development lifecycle.",
  applicationName: "REOS",
  keywords: ["REOS", "UAE property development", "real estate operating system", "development lifecycle", "property approvals", "PropTech"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "REOS", title: "REOS — The Operating System for Real Estate Development", description: "Twelve stakeholder groups. Twenty-four lifecycle stages. One connected operating model for UAE property development.", images: [{ url: "/og.png", width: 1200, height: 630, alt: "REOS — The Operating System for Real Estate Development" }] },
  twitter: { card: "summary_large_image", title: "REOS — The Operating System for Real Estate Development", description: "Twelve stakeholder groups. Twenty-four lifecycle stages. One connected operating model.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0A0A0F", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

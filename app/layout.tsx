import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reos-website.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "REOS — The Operating System for the Property Journey", template: "%s" },
  description: "REOS connects the property lifecycle—from discovery and finance to ownership, management, leasing and resale.",
  applicationName: "REOS",
  keywords: ["REOS", "property lifecycle", "UAE real estate", "property operating system", "PropTech"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "REOS", title: "REOS — The Operating System for the Property Journey", description: "One connected journey. Every property decision.", images: [{ url: "/og.png", width: 1200, height: 630, alt: "REOS — The Operating System for the Property Journey" }] },
  twitter: { card: "summary_large_image", title: "REOS — The Operating System for the Property Journey", description: "Discover. Validate. Buy. Finance. Own. Manage. Lease. Sell.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0A0A0F", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

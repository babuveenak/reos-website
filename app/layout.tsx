import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reos-website.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "REOS — The Operating System for Property", template: "%s" },
  description: "Explore the connected property lifecycle across stakeholders, authorities, processes and systems through REOS.",
  applicationName: "REOS",
  keywords: ["REOS", "property lifecycle", "UAE real estate", "property operating system", "PropTech"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "REOS", title: "REOS — The Operating System for Property", description: "Eight ecosystems. Twenty-four stages. One connected property journey.", images: [{ url: "/og.png", width: 1200, height: 630, alt: "REOS — The Operating System for Property" }] },
  twitter: { card: "summary_large_image", title: "REOS — The Operating System for Property", description: "Eight ecosystems. Twenty-four stages. One connected property journey.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0A0A0F", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

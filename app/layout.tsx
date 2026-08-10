import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reos-website.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "REOS — Dubai Property Journey Copilot", template: "%s" },
  description: "Understand your Dubai property journey, the parties involved, evidence required, dependencies and next action.",
  applicationName: "REOS",
  keywords: ["REOS", "property lifecycle", "UAE real estate", "property operating system", "PropTech"],
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "REOS", title: "REOS — Dubai Property Journey Copilot", description: "Where? Who are you? What do you want to do?", images: [{ url: "/og.png", width: 1200, height: 630, alt: "REOS — Dubai Property Journey Copilot" }] },
  twitter: { card: "summary_large_image", title: "REOS — Dubai Property Journey Copilot", description: "Know where you are, what you need and what comes next.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0A0A0F", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

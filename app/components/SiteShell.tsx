import Link from "next/link";
import type { ReactNode } from "react";
import type { ContentStatus } from "../data/reos";
import { Logo } from "./Logo";
import { PreferencesControls } from "./PreferencesControls";

const nav = [
  ["/journey", "Property journey"],
  ["/roles", "Roles"],
  ["/ecosystem", "Ecosystem"],
  ["/insights", "Insights"],
  ["/glossary", "Glossary"],
  ["/platform", "Platform"],
];

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="REOS home">
        <span className="brand-mark"><Logo /></span>
        <span><b>REOS</b><small>REAL ESTATE OPERATING SYSTEM</small></span>
      </Link>
      <nav aria-label="Primary navigation">
        {nav.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
      <PreferencesControls />
      <details className="mobile-menu">
        <summary aria-label="Open navigation"><span /><span /><span /></summary>
        <nav aria-label="Mobile navigation">
          {nav.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
          <PreferencesControls />
        </nav>
      </details>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div><span className="eyebrow">REOS · UAE REAL ESTATE</span><h2>Know where you are.<br /><em>Know what comes next.</em></h2></div>
      <div className="footer-links">
        <Link href="/journey">Property journey</Link>
        <Link href="/roles">Find your role</Link>
        <Link href="/ecosystem">Ecosystem map</Link>
        <Link href="/authorities">Authorities</Link>
        <Link href="/platform">Platform</Link>
        <Link href="/insights">Insights</Link>
        <Link href="/glossary">Glossary</Link>
        <Link href="/about">About</Link>
      </div>
      <p className="fineprint">Independent knowledge and navigation layer for UAE property development. REOS does not issue approvals, execute transactions or replace legal, financial or regulated advice. Requirements, fees, timelines, laws and eligibility are jurisdiction-specific and change — verify with the relevant authority or regulated provider before acting.</p>
    </footer>
  );
}

export function Page({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <><Header /><main className={className}>{children}</main><Footer /></>;
}

export function StatusTag({ status }: { status: ContentStatus }) {
  const key = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status status-${key}`}>{status}</span>;
}

export function SectionIntro({ label, title, copy }: { label: string; title: ReactNode; copy?: ReactNode }) {
  return <div className="section-intro"><span className="eyebrow">{label}</span><h2>{title}</h2>{copy && <p>{copy}</p>}</div>;
}

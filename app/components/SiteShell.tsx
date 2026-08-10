import Link from "next/link";
import type { ReactNode } from "react";
import type { ContentStatus } from "../data/reos";
import { PreferencesControls } from "./PreferencesControls";

const nav = [
  ["/#start", "Find my journey"],
  ["/stakeholders", "Who it is for"],
  ["/authorities", "Authorities"],
  ["/reos", "How REOS works"],
];

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="REOS home">
        <span className="brand-mark">R</span>
        <span><b>REOS</b><small>DUBAI PROPERTY JOURNEY COPILOT</small></span>
      </Link>
      <nav aria-label="Primary navigation">
        {nav.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
      <PreferencesControls />
      <Link className="header-cta" href="/#start">Start my journey <span aria-hidden="true">↗</span></Link>
      <details className="mobile-menu">
        <summary aria-label="Open navigation"><span /><span /><span /></summary>
        <nav aria-label="Mobile navigation">
          <Link href="/#start">Start my journey</Link>
          {nav.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
      </details>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div><span className="eyebrow">REOS · DUBAI PHASE 1</span><h2>Know where you are.<br /><em>Know what comes next.</em></h2></div>
      <div className="footer-links">
        <Link href="/#start">Find my journey</Link>
        <Link href="/stakeholders">Stakeholder journeys</Link>
        <Link href="/authorities">Authorities & approvals</Link>
        <Link href="/reos">REOS architecture</Link>
      </div>
      <p className="fineprint">Independent educational guidance for Dubai property journeys. REOS does not issue approvals, execute transactions or replace legal, financial or regulated advice. Verify current requirements, fees, timelines, laws and eligibility with the relevant authority or regulated provider.</p>
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

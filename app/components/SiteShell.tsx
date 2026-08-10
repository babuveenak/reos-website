import Link from "next/link";
import type { ReactNode } from "react";
import type { ContentStatus } from "../data/reos";

const nav = [
  ["/lifecycle", "Lifecycle"],
  ["/stakeholders", "Ecosystem"],
  ["/authorities", "Authorities"],
  ["/reos", "How REOS works"],
];

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="REOS home">
        <span className="brand-mark">R</span>
        <span><b>REOS</b><small>THE OPERATING SYSTEM FOR PROPERTY</small></span>
      </Link>
      <nav aria-label="Primary navigation">
        {nav.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
      </nav>
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
      <div><span className="eyebrow">REOS × KETURAH</span><h2>One property.<br /><em>One continuous memory.</em></h2></div>
      <div className="footer-links">
        <Link href="/lifecycle">Property lifecycle</Link>
        <Link href="/stakeholders">Stakeholder journeys</Link>
        <Link href="/authorities">Authorities & approvals</Link>
        <Link href="/reos">REOS architecture</Link>
      </div>
      <p className="fineprint">Educational prototype based on REOS research. Exact requirements, fees, timelines, laws, eligibility and system access must be verified with the relevant authority or regulated provider.</p>
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

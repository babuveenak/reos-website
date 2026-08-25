import Link from "next/link";
import type { ReactNode } from "react";
import { GatewayPreferences } from "./GatewayPreferences";

export function GatewayTopbar() {
  return <header className="gateway-topbar">
    <Link className="gateway-brand" href="/" aria-label="REOS seven-stage home"><span aria-hidden="true">R</span><strong>REOS</strong><small>Development GPS</small></Link>
    <nav aria-label="Primary lifecycle navigation"><Link href="/journey">7 Stages</Link><Link href="/matrix">7 × 12 matrix</Link><Link href="/user-happiness">User happiness</Link><Link href="/roles">Stakeholders</Link></nav>
    <div className="gateway-tools"><GatewayPreferences /><Link className="gateway-search" href="/search">Find a step <span aria-hidden="true">⌘ K</span></Link></div>
  </header>;
}

export function GatewayShell({children,className=""}:{children:ReactNode;className?:string}) {
  return <div className={`gateway-product gateway-page ${className}`}>
    <a className="gateway-skip" href="#main-content">Skip to main content</a>
    <GatewayTopbar />
    <main id="main-content">{children}</main>
    <footer className="gateway-footer"><div><strong>REOS</strong><span>Seven-Stage Property Lifecycle · Blueprint v2.0</span></div><nav aria-label="Lifecycle supporting navigation"><Link href="/documents">Documents</Link><Link href="/evidence">Evidence</Link><Link href="/decisions">Decisions</Link><Link href="/glossary">Glossary</Link></nav><p>Internal stage decisions do not replace statutory approvals, contractual certificates or customer acceptance. Jurisdiction-specific requirements must be verified locally.</p></footer>
  </div>;
}

export function Breadcrumbs({items}:{items:{label:string;href?:string}[]}) {
  return <nav className="gateway-breadcrumbs" aria-label="Breadcrumb"><ol>{items.map((item,index)=><li key={`${item.label}-${index}`}>{item.href?<Link href={item.href}>{item.label}</Link>:<span aria-current="page">{item.label}</span>}</li>)}</ol></nav>;
}

export function StatusPill({children,tone="neutral"}:{children:ReactNode;tone?:"neutral"|"good"|"warning"|"blocked"}) { return <span className={`gateway-status gateway-status-${tone}`}><i aria-hidden="true" />{children}</span>; }

export function GatewayMetric({label,value,note}:{label:string;value:string;note?:string}) { return <div className="gateway-metric"><span>{label}</span><strong>{value}</strong>{note&&<small>{note}</small>}</div>; }

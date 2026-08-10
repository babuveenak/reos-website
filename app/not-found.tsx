import Link from "next/link";
import { Page } from "./components/SiteShell";

export default function NotFound() { return <Page className="inner-page"><section className="inner-hero"><span className="eyebrow">404 · JOURNEY NOT MAPPED</span><h1>This path is not<br /><em>in the lifecycle yet.</em></h1><p>Return to the complete property journey or choose a stakeholder role.</p><div className="hero-actions"><Link className="button gold" href="/lifecycle">Explore lifecycle</Link><Link className="button ghost" href="/stakeholders">Choose a role</Link></div></section></Page>; }


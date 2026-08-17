import Link from "next/link";
import { notFound } from "next/navigation";
import { Page } from "../../components/SiteShell";
import { journeyBySlug, journeys } from "../../data/phase1";
import type { Metadata } from "next";

export function generateStaticParams(){ return journeys.map(({slug})=>({slug})); }

export async function generateMetadata({params}:{params:Promise<{slug:string}>}): Promise<Metadata> {
  const {slug}=await params; const journey=journeyBySlug[slug];
  if(!journey) return {};
  return { title: `${journey.title} in Dubai | REOS`, description: journey.promise };
}
export default async function JourneyPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params; const journey=journeyBySlug[slug]; if(!journey) notFound();
  return <Page className="inner-page"><section className="journey-hero"><div><span className="eyebrow">DUBAI · PHASE 1 KNOWLEDGE JOURNEY</span><h1>{journey.title}</h1><p>{journey.promise} REOS explains the route; official authorities and regulated providers remain authoritative.</p></div><div className="journey-index"><small>STAGES</small><b>{journey.stages.length}</b><span>guided steps</span></div></section>
  <section className="section-pad phase-journey"><div className="scope-banner"><b>Educational guidance</b><span>Requirements, fees, timelines and eligibility can change. Verify before acting.</span></div><div className="journey-steps">{journey.stages.map((s,i)=><article key={s.title}><span>{String(i+1).padStart(2,"0")}</span><div><h2>{s.title}</h2><p>{s.detail}</p></div></article>)}</div></section>
  <section className="section-pad journey-grid"><article className="journey-block"><span className="eyebrow">WHO IS INVOLVED</span><ul>{journey.parties.map(x=><li key={x}>{x}</li>)}</ul></article><article className="journey-block"><span className="eyebrow">EVIDENCE TO EXPECT</span><ul>{journey.documents.map(x=><li key={x}>{x}</li>)}</ul></article></section>
  <section className="reos-opportunity"><span className="eyebrow">YOUR NEXT ACTION</span><h2>{journey.next}</h2><p>Start with evidence, confirm the exact property and jurisdiction, then use the linked official channel or qualified provider.</p><div className="hero-actions"><Link className="button gold" href="/#start">Choose another journey</Link><Link className="button ghost" href="/authorities">Official authorities</Link></div></section></Page>;
}

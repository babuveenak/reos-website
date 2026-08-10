"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./community-living.module.css";

const issues=["Service Charges","Maintenance","Security","Parking","Amenities","Noise","NOC / Renovation","Complaints"];
const stakeholders=[
 {name:"Residents",text:"Understand responsibilities, next actions and escalation routes without guessing who owns the problem."},
 {name:"Community Managers",text:"Reduce misrouted enquiries and explain responsibilities, services and updates more clearly."},
 {name:"Developers",text:"Protect the post-handover experience with a clearer handoff between brand, operations and residents."},
 {name:"Service Providers",text:"Show where your service sits in the community experience and what residents should expect."},
 {name:"Security",text:"Clarify access, visitor, contractor and incident responsibilities without becoming the default help desk."},
 {name:"Facility Management",text:"Make maintenance ownership, service scope and operational handoffs easier to understand."},
];
const flow=[
 ["01","Describe the issue","Tell us what is happening in plain language."],
 ["02","Identify responsibility","Map the issue to the most relevant stakeholder based on verified information."],
 ["03","See the next action","Understand what to do first and what evidence may be needed."],
 ["04","Escalate correctly","If unresolved, see the appropriate next route for the community and jurisdiction."],
];
const stats=[
 ["6","stakeholder groups modelled"],
 ["8","high-frequency issue categories"],
 ["4","guided resolution steps"],
 ["1","pilot community in verification"],
];

export default function CommunityLivingClient(){
 const [query,setQuery]=useState("");
 const [result,setResult]=useState("");
 useEffect(()=>{
  const nodes=[...document.querySelectorAll<HTMLElement>("[data-reveal]")];
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){nodes.forEach(n=>n.dataset.visible="true");return;}
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){(e.target as HTMLElement).dataset.visible="true";io.unobserve(e.target)}}),{threshold:.14});
  nodes.forEach(n=>io.observe(n));return()=>io.disconnect();
 },[]);
 const submit=()=>setResult(query.trim()?"Demo mode: we can classify this issue and show the responsibility path once verified community knowledge is available.":"Describe a community issue first.");
 return <main className={styles.page}>
  <a className={styles.skip} href="#main-content">Skip to content</a>
  <header className={styles.nav}>
   <Link href="/community-living" className={styles.brand}>COMMUNITY LIVING UAE</Link>
   <nav aria-label="Primary"><a href="#product">Product</a><a href="#how">How it works</a><a href="#stakeholders">Who it is for</a><a href="#trust">Trust</a></nav>
   <a className={styles.navCta} href="#ask">Ask My Community</a>
  </header>

  <div id="main-content">
   <section className={styles.hero}>
    <div className={styles.heroCopy} data-reveal>
     <span className={styles.eyebrow}>THE OPERATING SYSTEM FOR COMMUNITY LIVING.</span>
     <h1>Know who is responsible.<br/><em>Know what to do next.</em></h1>
     <p>Community Living UAE helps residents understand community responsibilities, navigate everyday issues and find the right next step—without bouncing between developers, managers, service providers and authorities.</p>
     <div className={styles.actions}><a className={styles.primary} href="#ask">Ask My Community <span>↗</span></a><a className={styles.secondary} href="#product">See the product</a></div>
     <div className={styles.heroTrust}><span>Neutral by design</span><span>Evidence-led</span><span>Jurisdiction-aware</span></div>
    </div>
    <div className={styles.heroStatement} data-reveal><span>One community.</span><strong>Many organisations.</strong><p>One clear navigation layer.</p></div>
   </section>

   <section id="product" className={styles.productSection}>
    <div className={styles.sectionIntro} data-reveal><span className={styles.eyebrow}>PRODUCT PREVIEW</span><h2>Community intelligence,<br/><em>made usable.</em></h2><p>The interface turns fragmented community information into a simple resident experience: ask, understand, act.</p></div>
    <div className={styles.screenGrid}>
     <div className={styles.screen} data-reveal><div className={styles.screenBar}><i/><i/><i/><span>Ask My Community</span></div><div className={styles.askMock}><small>WHAT IS HAPPENING IN YOUR COMMUNITY?</small><h3>“The pool has been closed for three weeks. Who should I contact?”</h3><div className={styles.answerStep}><b>01</b><span><strong>Issue category</strong> Amenities / common area</span></div><div className={styles.answerStep}><b>02</b><span><strong>Likely responsibility</strong> Community management / FM</span></div><div className={styles.answerStep}><b>03</b><span><strong>Next action</strong> Raise a tracked service request</span></div><small>DEMONSTRATION — FINAL ROUTING REQUIRES VERIFIED COMMUNITY DATA</small></div></div>
     <div className={styles.screen} data-reveal><div className={styles.screenBar}><i/><i/><i/><span>Community Passport</span></div><div className={styles.passportMock}><small>COMMUNITY PROFILE</small><h3>MAG City</h3>{["Master Developer","Community Manager","FM Provider","Regulatory Jurisdiction","Complaint Route"].map((x,i)=><div key={x}><span>{x}</span><b>{i<2?"Public information":"Information being verified"}</b></div>)}<p>Every field is designed to carry source, status and last-verified information.</p></div></div>
    </div>
   </section>

   <section id="ask" className={styles.askSection}>
    <div className={styles.sectionIntro} data-reveal><span className={styles.eyebrow}>ASK MY COMMUNITY™</span><h2>Start with the problem.<br/><em>Not the organisation chart.</em></h2><p>Residents should not need to know who owns an issue before they ask for help.</p></div>
    <div className={styles.askBox} data-reveal><label htmlFor="community-question">What is happening in your community?</label><div><input id="community-question" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Ask about maintenance, service charges, parking, NOCs…"/><button onClick={submit}>Find the right path</button></div><div className={styles.chips}>{issues.map(x=><button key={x} onClick={()=>setQuery(x)}>{x}</button>)}</div><p className={styles.result} role="status" aria-live="polite">{result}</p></div>
   </section>

   <section id="how" className={styles.howSection}>
    <div className={styles.sectionIntro} data-reveal><span className={styles.eyebrow}>HOW IT WORKS</span><h2>From confusion to<br/><em>a clear next step.</em></h2></div>
    <div className={styles.flow}>{flow.map(([n,t,d])=><div key={n} data-reveal><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div>
   </section>

   <section id="stakeholders" className={styles.personaSection}>
    <div className={styles.sectionIntro} data-reveal><span className={styles.eyebrow}>ONE COMMUNITY. SIX PERSPECTIVES.</span><h2>Built around the people<br/><em>who make communities work.</em></h2></div>
    <div className={styles.personaGrid}>{stakeholders.map((s,i)=><article key={s.name} data-reveal><span>{String(i+1).padStart(2,"0")}</span><h3>{s.name}</h3><p>{s.text}</p></article>)}</div>
   </section>

   <section className={styles.statsSection}>
    <div data-reveal><span className={styles.eyebrow}>PILOT READINESS</span><h2>Built to prove usefulness<br/><em>before making big claims.</em></h2><p>These are product-configuration metrics—not invented market traction.</p></div>
    <div className={styles.stats}>{stats.map(([n,l])=><div key={l} data-reveal><strong>{n}</strong><span>{l}</span></div>)}</div>
   </section>

   <section id="trust" className={styles.trustSection}>
    <div className={styles.sectionIntro} data-reveal><span className={styles.eyebrow}>TRUST BY DESIGN</span><h2>We do not decide who is wrong.<br/><em>We help clarify who is responsible.</em></h2><p>Community guidance should distinguish verified facts, community-specific information, public information and unresolved gaps.</p></div>
    <div className={styles.trustGrid}>{[["01","Source-aware","Community and regulatory guidance is designed to expose provenance."],["02","No fabricated answers","Unknown information stays unknown until it is verified."],["03","Neutral positioning","The product is not anti-resident, anti-manager or anti-developer."],["04","Jurisdiction-aware","Dubai-specific guidance is not presented as universal UAE guidance."]].map(([n,t,d])=><div key={n} data-reveal><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div>
   </section>

   <section className={styles.finalCta} data-reveal><span className={styles.eyebrow}>COMMUNITY LIVING UAE</span><h2>Your community should be<br/><em>easier to understand.</em></h2><p>Start with a question. See how the community around you connects.</p><div className={styles.actions}><a className={styles.primary} href="#ask">Ask My Community <span>↗</span></a><a className={styles.secondary} href="#stakeholders">Explore stakeholder value</a></div></section>
  </div>

  <footer className={styles.footer}><div><strong>COMMUNITY LIVING UAE</strong><p>The Operating System for Community Living.</p></div><div><a href="#product">Product</a><a href="#how">How it works</a><a href="#trust">How we build trust</a></div><div><Link href="/">REOS</Link><a href="#ask">Ask My Community</a></div><small>Prototype experience. Community-specific guidance remains subject to verification.</small></footer>
  <a className={styles.mobileSticky} href="#ask">Ask My Community <span>↗</span></a>
 </main>
}

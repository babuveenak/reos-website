import Link from "next/link";
import { Phase1Starter } from "./components/Phase1Starter";
import { Page, SectionIntro } from "./components/SiteShell";

const lifecycle=["Discover","Validate","Compare","Buy","Finance","Own","Manage","Maintain","Lease","Sell"];
const personas=[
 {name:"Buyer",outcome:"Move from search to verified purchase, handover and move-in with fewer unknowns.",href:"/journeys/buy-property"},
 {name:"Investor",outcome:"Evaluate evidence, financing, risk, ownership and exit as one connected decision.",href:"/journeys/buy-off-plan"},
 {name:"Developer",outcome:"Connect approvals, delivery, sales, handover and the customer journey.",href:"/stakeholders"},
 {name:"Broker",outcome:"Guide clients through readiness, finance, documentation and transaction dependencies.",href:"/stakeholders"},
 {name:"Property owner",outcome:"Understand renovation, maintenance, leasing and resale after receiving the keys.",href:"/journeys/rent-out"},
 {name:"Tenant",outcome:"Navigate tenancy, registration, services, responsibilities and move-out more clearly.",href:"/stakeholders"},
 {name:"Service provider",outcome:"See where your service enters the property lifecycle and what unlocks the next step.",href:"/stakeholders"},
];
const connections=["Customer goal","Property facts","Stakeholder responsibilities","Authority requirements","Documents & evidence","Dependencies","Next action"];

export default function Home(){return <Page className="home">
 <section className="hero os-hero">
  <div className="hero-image" aria-hidden="true"/><div className="hero-grid" aria-hidden="true"/>
  <div className="hero-content"><span className="eyebrow">THE OPERATING SYSTEM FOR THE PROPERTY JOURNEY</span><h1>One connected journey.<br/><em>Every property decision.</em></h1><p>REOS connects buyers, investors, owners, developers, brokers, banks, authorities and property services—from discovery and finance to ownership, management, leasing and resale.</p><div className="hero-actions"><Link className="button gold" href="/#start">Find my next step <span>↗</span></Link><Link className="button ghost" href="/#platform">See how REOS connects it</Link></div><small className="hero-trust">Not a listing portal. Not a brokerage. An independent, evidence-governed navigation layer for Dubai property.</small></div>
  <div className="hero-system" aria-label="REOS connects the property journey"><div className="system-core"><b>REOS</b><span>CONNECTED JOURNEY</span></div>{["PEOPLE","PROPERTY","AUTHORITIES","EVIDENCE"].map((x,i)=><div className={`system-node system-node-${i+1}`} key={x}><i>{String(i+1).padStart(2,"0")}</i><span>{x}</span></div>)}</div>
 </section>

 <section className="lifecycle-band" aria-label="Connected property lifecycle"><span>THE CONNECTED PROPERTY LIFECYCLE</span><div>{lifecycle.map((x,i)=><div key={x}><b>{String(i+1).padStart(2,"0")}</b><strong>{x}</strong>{i<lifecycle.length-1&&<i>→</i>}</div>)}</div></section>

 <section className="section-pad story-problem" id="problem"><SectionIntro label="THE PROBLEM" title={<>One property journey.<br/><em>Too many disconnected systems.</em></>} copy="A customer may begin with a listing, move to a broker, request finance, verify a project, register with an authority, complete handover and then manage the property through entirely different channels. The information does not move with them."/>
  <div className="before-after"><div><small>TODAY</small><h3>Fragmented</h3>{["Portals & listings","Brokers & developers","Banks & payments","Authorities & approvals","Ownership services"].map(x=><span key={x}>{x}</span>)}</div><i>→</i><div className="connected"><small>WITH REOS</small><h3>One guided journey</h3><p>See where you are, what is required, who is responsible, what is blocking progress and what happens next.</p></div></div>
 </section>

 <section className="section-pad platform-section" id="platform"><SectionIntro label="THE REOS DIFFERENCE" title={<>REOS understands the ecosystem.<br/><em>You see only what matters next.</em></>} copy="REOS turns a complex network of parties, rules and dependencies into a journey shaped around the customer’s goal."/>
  <div className="connection-grid">{connections.map((x,i)=><div key={x}><span>{String(i+1).padStart(2,"0")}</span><b>{x}</b></div>)}</div>
  <div className="platform-preview"><div className="preview-sidebar"><span>YOUR JOURNEY</span>{["Goal confirmed","Property identified","Evidence review","Finance readiness","Registration","Handover"].map((x,i)=><div className={i<2?"complete":i===2?"current":""} key={x}><i/>{x}</div>)}</div><div className="preview-main"><small>REOS JOURNEY INTELLIGENCE</small><h3>Your evidence review is next.</h3><p>Before committing, confirm the property, counterparty, registration route and material contract terms.</p><div className="preview-cards"><span><b>5</b> parties connected</span><span><b>4</b> evidence groups</span><span><b>1</b> next action</span></div><Link href="/journeys/buy-property" className="text-link">Explore a live journey <span>→</span></Link></div></div>
 </section>

 <section className="journey-start section-pad" id="start"><SectionIntro label="START WITH YOUR GOAL" title={<>Tell REOS who you are.<br/><em>See what comes next.</em></>} copy="Start with Dubai, choose your role and select the outcome you need. REOS turns the ecosystem into your journey."/><Phase1Starter/></section>

 <section className="section-pad persona-section" id="solutions"><SectionIntro label="WHO REOS CONNECTS" title={<>Different roles.<br/><em>One property lifecycle.</em></>} copy="Every participant sees a different part of the journey. REOS makes the handoffs and dependencies visible."/><div className="persona-grid">{personas.map((p,i)=><Link href={p.href} key={p.name}><span>{String(i+1).padStart(2,"0")}</span><h3>{p.name}</h3><p>{p.outcome}</p><i>Explore value →</i></Link>)}</div></section>

 <section className="section-pad authority-story"><div><span className="eyebrow">AUTHORITY INTELLIGENCE</span><h2>The right requirement.<br/><em>For the right jurisdiction.</em></h2><p>Authority responsibilities, registration routes and approvals vary by jurisdiction, property and activity. REOS explains what to verify, where to verify it and which decision depends on it.</p><Link className="button gold" href="/authorities">Explore authority coverage <span>↗</span></Link></div><div className="authority-map">{["Land & registration","Planning & development","Infrastructure & utilities","Safety & compliance","Transport & access","Tax & ownership"].map((x,i)=><div key={x}><b>{String(i+1).padStart(2,"0")}</b><span>{x}</span></div>)}</div></section>

 <section className="section-pad trust-section"><SectionIntro label="BUILT FOR TRUST" title={<>Guidance with provenance.<br/><em>Confidence without overclaiming.</em></>} copy="REOS is designed to distinguish verified facts, assumptions and recommendations—and to send binding decisions back to the official authority or regulated provider."/><div className="trust-grid"><div><b>01</b><h3>Official-source orientation</h3><p>Relevant authority and regulated-provider channels remain authoritative.</p></div><div><b>02</b><h3>Jurisdiction-aware guidance</h3><p>Dubai rules are not presented as universal UAE rules.</p></div><div><b>03</b><h3>Evidence status</h3><p>Content can carry source, effective date, confidence and verification status.</p></div><div><b>04</b><h3>Independent journey logic</h3><p>The recommended path is designed around the customer outcome—not sponsor preference.</p></div></div></section>

 <section className="final-cta"><span className="eyebrow">YOUR PROPERTY JOURNEY STARTS HERE</span><h2>Know where you are.<br/><em>Move forward with confidence.</em></h2><p>Explore a Dubai property journey today, or see how REOS can connect the wider ecosystem for your organisation.</p><div className="hero-actions"><Link className="button gold" href="/#start">Start my property journey <span>↗</span></Link><Link className="button ghost" href="/reos">Explore the REOS platform</Link></div></section>
 </Page>}

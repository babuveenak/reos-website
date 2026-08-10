"use client";
import Link from "next/link";
import { useState } from "react";
import { journeys, roles, type Phase1Role } from "../data/phase1";

export function Phase1Starter() {
  const [role, setRole] = useState<Phase1Role>("investor");
  const available = journeys.filter((j) => j.roles.includes(role));
  const [goal, setGoal] = useState("buy-property");
  const selected = available.find((j) => j.slug === goal) ?? available[0];
  function changeRole(value: Phase1Role) { setRole(value); setGoal(journeys.find((j) => j.roles.includes(value))!.slug); }
  return <div className="starter-card phase-starter">
    <div className="starter-step"><span>01</span><label htmlFor="where">Where is the property?</label><select id="where" defaultValue="dubai"><option value="dubai">Dubai — available now</option><option disabled>Other emirates — architecture only</option></select></div>
    <div className="starter-step"><span>02</span><label htmlFor="who">Who are you?</label><select id="who" value={role} onChange={(e)=>changeRole(e.target.value as Phase1Role)}>{roles.map((r)=><option key={r.id} value={r.id}>{r.name}</option>)}</select></div>
    <div className="starter-step"><span>03</span><label htmlFor="goal">What do you want to do?</label><select id="goal" value={selected.slug} onChange={(e)=>setGoal(e.target.value)}>{available.map((j)=><option key={j.slug} value={j.slug}>{j.title}</option>)}</select></div>
    <div className="starter-result"><small>YOUR DUBAI STARTING POINT</small><b>{selected.title}</b><p>{selected.promise}</p><Link className="button gold" href={`/journeys/${selected.slug}`}>Show my journey <span>→</span></Link></div>
  </div>;
}

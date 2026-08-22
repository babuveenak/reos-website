"use client";

import { useState } from "react";
import { personas } from "../data/personas";
import { products } from "../data/products";
import { BOOKING_URL, CONTACT_EMAIL, CONTACT_PHONE, ENQUIRY_SUBJECT } from "../data/site";

const interests = [...products.map((product) => product.name), "Full REOS product suite", ...personas.map((p) => `${p.name} journey`)];
type State = { kind: "idle" | "submitting" | "success" | "error"; message?: string; reference?: string; fallbackEmail?: string };

export function DemoForm({ initialProduct, initialIntent }: { initialProduct?: string; initialIntent?: string }) {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [interest, setInterest] = useState(interests.includes(initialProduct || "") ? initialProduct! : products[0]?.name ?? "Full REOS product suite");
  const [intent, setIntent] = useState(initialIntent || "Workflow assessment");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState({ kind: "submitting" });
    try {
      const response = await fetch("/api/demo", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw result;
      setState({ kind: "success", message: result.message, reference: result.reference });
      form.reset();
    } catch (error) {
      const result = error as { message?: string; fallbackEmail?: string };
      setState({ kind: "error", message: result.message || "Delivery could not be confirmed. Your request was not marked as submitted.", fallbackEmail: result.fallbackEmail || CONTACT_EMAIL });
    }
  }

  const fallbackSubject = encodeURIComponent(`${ENQUIRY_SUBJECT} — ${interest} — ${intent}`);
  if (state.kind === "success") return <div className="demo-confirmation" role="status"><small>REQUEST DELIVERED</small><h2>Thank you.<br /><em>Your evaluation request is confirmed.</em></h2><p>{state.message}</p><dl><div><dt>Reference</dt><dd>{state.reference}</dd></div><div><dt>Owner</dt><dd>REOS product and evaluation owner</dd></div><div><dt>Next step</dt><dd>Your request is reviewed for workflow fit, product maturity and evaluation scope. If qualified, the owner proposes the appropriate session and preparation inputs.</dd></div></dl><p>No product access or pilot is approved by this confirmation.</p></div>;

  return <form className="demo-form" onSubmit={submit} aria-describedby="demo-delivery-note">
    <div className="field-row"><label><span>Name <i aria-hidden="true">*</i></span><input name="name" required autoComplete="name" placeholder="Your full name" /></label><label><span>Work email <i aria-hidden="true">*</i></span><input name="email" type="email" required autoComplete="email" placeholder="name@organization.com" /></label></div>
    <div className="field-row"><label><span>Company <i aria-hidden="true">*</i></span><input name="company" required autoComplete="organization" placeholder="Your organisation" /></label><label><span>Job title</span><input name="title" autoComplete="organization-title" placeholder="e.g. Development Manager" /></label></div>
    <label className="form-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
    <div className="field-row"><label><span>Where is the property or project?</span><select name="location" defaultValue="Dubai">{["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain", "Not decided yet", "Outside the UAE"].map((x) => <option key={x}>{x}</option>)}</select></label><label><span>I am</span><select name="role" defaultValue="Not sure yet">{["Buyer", "Investor", "Developer", "Bank or financier", "Contractor or supplier", "Consultant or advisor", "Property or facility manager", "New to UAE property", "Not sure yet", "Other"].map((x) => <option key={x}>{x}</option>)}</select></label></div>
    <label><span>I am interested in</span><select name="interest" value={interest} onChange={(event) => setInterest(event.target.value)}>{interests.map((x) => <option key={x}>{x}</option>)}</select></label>
    <div className="field-row"><label><span>I need</span><select name="intent" value={intent} onChange={(event) => setIntent(event.target.value)}>{["Product walkthrough", "Workflow assessment", "Pilot planning", "Security and assurance review", "Commercial discussion"].map((x) => <option key={x}>{x}</option>)}</select></label><label><span>Decision timeline</span><select name="timeline" defaultValue="Exploring">{["Within 30 days", "1–3 months", "3–6 months", "6+ months", "Exploring"].map((x) => <option key={x}>{x}</option>)}</select></label></div>
    <label><span>Workflow outcome</span><input name="outcome" placeholder="e.g. reduce incomplete title registration cases" /></label>
    <label><span>Message</span><textarea name="message" rows={4} placeholder="Tell us about the project or the question you are trying to answer." /></label>
    <button className="button gold" type="submit" disabled={state.kind === "submitting"}>{state.kind === "submitting" ? "Confirming delivery…" : "Request the right session"} <span aria-hidden="true">↗</span></button>
    {state.kind === "error" && <div className="form-delivery-error" role="alert"><b>Request not submitted</b><p>{state.message}</p><a href={`mailto:${state.fallbackEmail}?subject=${fallbackSubject}`}>Send through the verified email channel ↗</a></div>}
    {BOOKING_URL && <a className="button ghost booking-link" href={BOOKING_URL} target="_blank" rel="noreferrer">Or pick a time directly <span aria-hidden="true">↗</span></a>}
    <p className="form-note" id="demo-delivery-note">A success message appears only after the configured REOS enquiry channel confirms delivery. You can also write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{CONTACT_PHONE && <> or call <a href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}>{CONTACT_PHONE}</a></>}.</p>
  </form>;
}

"use client";

import { useState } from "react";
import { personas } from "../data/personas";
import { CONTACT_EMAIL } from "../data/site";

const interests = [
  ...personas.map((p) => `${p.name} journey`),
  "Full REOS platform",
];

/**
 * The form composes a message and hands it to the visitor's own mail client.
 * There is no backend yet, and a form that silently posts nowhere is worse
 * than one that is honest about how it sends. Swap this for a real endpoint
 * when one exists; the field set is already the one a CRM would want.
 */
export function DemoForm() {
  const [sent, setSent] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();

    const body = [
      `Name: ${get("name")}`,
      `Company: ${get("company")}`,
      `Role: ${get("role")}`,
      `Emirate / location: ${get("location")}`,
      `Interested in: ${get("interest")}`,
      "",
      "Message:",
      get("message") || "(none)",
    ].join("\n");

    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`REOS demo request — ${get("name") || "enquiry"}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form className="demo-form" onSubmit={submit}>
      <div className="field-row">
        <label>
          <span>Name <i aria-hidden="true">*</i></span>
          <input name="name" required autoComplete="name" placeholder="Your full name" />
        </label>
        <label>
          <span>Company</span>
          <input name="company" autoComplete="organization" placeholder="Organisation, if any" />
        </label>
      </div>

      <div className="field-row">
        <label>
          <span>Your role</span>
          <input name="role" autoComplete="organization-title" placeholder="e.g. Development Manager" />
        </label>
        <label>
          <span>Where is the property or project?</span>
          <select name="location" defaultValue="Dubai">
            {["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain", "Not decided yet", "Outside the UAE"].map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>
      </div>

      <label>
        <span>I am interested in</span>
        <select name="interest" defaultValue="Full REOS platform">
          {interests.map((x) => <option key={x}>{x}</option>)}
        </select>
      </label>

      <label>
        <span>Message</span>
        <textarea name="message" rows={4} placeholder="Tell us about the project or the question you are trying to answer." />
      </label>

      <button className="button gold" type="submit">
        {sent ? "Opening your mail app…" : "Send request"} <span aria-hidden="true">↗</span>
      </button>

      <p className="form-note">
        This opens your email application with the details filled in, so nothing is submitted or stored by this website.
        You can also write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> directly.
      </p>
    </form>
  );
}

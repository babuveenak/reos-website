import { NextResponse } from "next/server";
import { CONTACT_EMAIL } from "../../data/site";

export const runtime = "nodejs";
type DemoRequest = Record<string, unknown>;

function value(body: DemoRequest, key: string, max = 2000) {
  return typeof body[key] === "string" ? body[key].trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: DemoRequest;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false, message: "The request could not be read." }, { status: 400 }); }
  if (value(body, "website")) return NextResponse.json({ ok: true, reference: "accepted" }, { status: 201 });

  const name = value(body, "name", 120);
  const email = value(body, "email", 254);
  const company = value(body, "company", 160);
  if (!name || !company || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ ok: false, message: "Name, company and a valid work email are required." }, { status: 422 });

  const reference = `REOS-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const enquiry = { reference, submittedAt: new Date().toISOString(), name, email, company, title: value(body, "title", 160), location: value(body, "location", 120), role: value(body, "role", 160), interest: value(body, "interest", 200), intent: value(body, "intent", 160), timeline: value(body, "timeline", 120), outcome: value(body, "outcome", 500), message: value(body, "message") };
  const webhook = process.env.REOS_ENQUIRY_WEBHOOK_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.REOS_ENQUIRY_FROM_EMAIL;
  let delivered = false;
  try {
    if (webhook) {
      const response = await fetch(webhook, { method: "POST", headers: { "content-type": "application/json", ...(process.env.REOS_ENQUIRY_WEBHOOK_TOKEN ? { authorization: `Bearer ${process.env.REOS_ENQUIRY_WEBHOOK_TOKEN}` } : {}) }, body: JSON.stringify(enquiry), signal: AbortSignal.timeout(10000) });
      delivered = response.ok;
    } else if (resendKey && from) {
      const escape = (item: unknown) => String(item || "—").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]!);
      const rows = Object.entries(enquiry).map(([key, item]) => `<tr><th align="left">${escape(key)}</th><td>${escape(item)}</td></tr>`).join("");
      const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${resendKey}`, "content-type": "application/json" }, body: JSON.stringify({ from, to: [process.env.REOS_CONTACT_EMAIL || CONTACT_EMAIL], reply_to: email, subject: `${reference} · ${enquiry.interest} · ${enquiry.intent}`, html: `<h2>REOS enterprise enquiry</h2><table>${rows}</table>` }), signal: AbortSignal.timeout(10000) });
      delivered = response.ok;
    } else return NextResponse.json({ ok: false, code: "delivery_not_configured", message: "Online delivery is not configured for this preview. Please use the verified email channel below.", fallbackEmail: process.env.REOS_CONTACT_EMAIL || CONTACT_EMAIL }, { status: 503 });
  } catch { delivered = false; }
  if (!delivered) return NextResponse.json({ ok: false, code: "delivery_failed", message: "We could not confirm delivery. Your request has not been marked as submitted.", fallbackEmail: process.env.REOS_CONTACT_EMAIL || CONTACT_EMAIL }, { status: 502 });
  return NextResponse.json({ ok: true, reference, message: "Your request was delivered to the REOS evaluation owner." }, { status: 201 });
}

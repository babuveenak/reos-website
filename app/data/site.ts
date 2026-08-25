/**
 * Site-wide settings, configurable without touching code.
 *
 * Every value here reads from an environment variable first and falls back to
 * a sensible default. To change one in production, set it in the host's
 * environment variables and redeploy — no code change required. Locally,
 * put it in `.env.local`. See `.env.example` for the full list.
 *
 * NOTE: this site is statically exported, so NEXT_PUBLIC_* values are inlined
 * at build time rather than read at runtime. A change therefore takes effect
 * on the next deploy, not immediately. Each variable must also be referenced
 * as a full literal (`process.env.NEXT_PUBLIC_FOO`) for Next.js to inline it —
 * destructuring or dynamic lookup silently yields undefined.
 */

/** Where demo requests and general enquiries are sent. */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "aiworkingforme@gmail.com";

/** Canonical origin, used for metadata and the sitemap. No trailing slash. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://reos-seven-gateway-private.aiworkingforme.chatgpt.site"
).replace(/\/$/, "");

/** Optional. Shown alongside the email on the demo page when set. */
export const CONTACT_PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || "";

/** Optional. When set, the demo page offers this instead of the mail form. */
export const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "";

/** Subject line prefix on enquiry emails. */
export const ENQUIRY_SUBJECT =
  process.env.NEXT_PUBLIC_ENQUIRY_SUBJECT || "REOS demo request";

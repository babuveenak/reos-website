"use client";

/**
 * ADMIN REPOSITORY BROWSER — UI skeleton
 *
 * The filter, search and status UX for the knowledge repository, with no storage
 * engine behind it. Records are passed in from the server, derived from the real
 * content model (stages and authorities), so nothing here is fabricated: what
 * you see is what the repository actually holds today.
 *
 * The ingestion side — upload, extraction, review, approve — is deliberately
 * absent. It needs the database, object storage and RBAC from phase 2, and a
 * skeleton that pretended to accept an upload would be worse than one that says
 * plainly that it cannot yet.
 */

import { useMemo, useState } from "react";
import type { ContentStatus } from "../data/reos";
import type { DocumentRecord } from "../assistant/contracts";
import { DEFAULT_LOCALE, type Locale } from "../i18n/config";
import { StatusTag } from "./SiteShell";

const STATUSES: (ContentStatus | "all")[] = [
  "all",
  "Validated",
  "To Be Validated",
  "Illustrative",
  "Future REOS Capability",
];

type Props = {
  records: DocumentRecord[];
  stages: { id: string; name: string }[];
  authorities: { id: string; name: string }[];
  locale?: Locale;
};

export function AdminBrowser({ records, stages, authorities, locale = DEFAULT_LOCALE }: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ContentStatus | "all">("all");
  const [language, setLanguage] = useState<Locale | "all">("all");
  const [stageId, setStageId] = useState("all");
  const [kind, setKind] = useState("all");

  const kinds = useMemo(
    () => ["all", ...Array.from(new Set(records.map((r) => r.kind)))],
    [records],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return records.filter((record) => {
      if (q && !record.title.toLowerCase().includes(q) && !(record.authority ?? "").toLowerCase().includes(q)) return false;
      if (status !== "all" && record.status !== status) return false;
      if (language !== "all" && record.language !== language) return false;
      if (stageId !== "all" && !record.stageIds.includes(stageId)) return false;
      if (kind !== "all" && record.kind !== kind) return false;
      return true;
    });
  }, [records, query, status, language, stageId, kind]);

  const stageName = (id: string) => stages.find((s) => s.id === id)?.name ?? id;

  return (
    <div className="admin">
      <form className="admin-filters" onSubmit={(event) => event.preventDefault()} role="search">
        <label>
          <span>Search</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title or authority…"
          />
        </label>
        <label>
          <span>Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as ContentStatus | "all")}>
            {STATUSES.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
        <label>
          <span>Language</span>
          <select value={language} onChange={(event) => setLanguage(event.target.value as Locale | "all")}>
            <option value="all">all</option>
            <option value="en">en</option>
            <option value="ar">ar</option>
          </select>
        </label>
        <label>
          <span>Lifecycle stage</span>
          <select value={stageId} onChange={(event) => setStageId(event.target.value)}>
            <option value="all">all</option>
            {stages.map((stage) => <option key={stage.id} value={stage.id}>{stage.name}</option>)}
          </select>
        </label>
        <label>
          <span>Kind</span>
          <select value={kind} onChange={(event) => setKind(event.target.value)}>
            {kinds.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
      </form>

      <p className="admin-count" role="status">
        {filtered.length} of {records.length} records
      </p>

      <div className="admin-tablewrap">
        <table className="admin-table">
          <caption className="visually-hidden">Knowledge repository records</caption>
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Kind</th>
              <th scope="col">Authority</th>
              <th scope="col">Jurisdiction</th>
              <th scope="col">Stages</th>
              <th scope="col">Lang</th>
              <th scope="col">Status</th>
              <th scope="col">Last verified</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((record) => (
              <tr key={record.id}>
                <td>{record.title}</td>
                <td><code>{record.kind}</code></td>
                <td>{record.authority ?? "—"}</td>
                <td>{record.jurisdiction ?? "—"}</td>
                <td>{record.stageIds.length ? record.stageIds.map(stageName).join(", ") : "—"}</td>
                <td>{record.language}</td>
                <td><StatusTag status={record.status} locale={locale} /></td>
                {/* Never a fabricated date. */}
                <td>{record.lastVerified ?? <em>not yet verified</em>}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8}>No records match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <section className="admin-pending">
        <h3>Ingested documents</h3>
        <p>
          None. Document ingestion — upload, extraction, OCR, chunking, claim
          extraction and review — needs the database and object storage from
          phase 2. {authorities.length} authorities are registered as sources
          above, with their published URLs.
        </p>
      </section>
    </div>
  );
}

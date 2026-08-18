"use client";

import Link from "next/link";
import { useState } from "react";
import { clusters, groups, groupsByCluster, type Group } from "../data/ecosystem";
import { StatusTag } from "./SiteShell";

/**
 * Hero visual. Twelve nodes, one core, nothing else — no labels beyond the
 * group short name, no statistics, no lifecycle bar. The detail lives in
 * EcosystemMap further down the page, once the visitor has the proposition.
 */
export function EcosystemRing() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="eco-ring" role="img" aria-label="REOS at the centre of twelve stakeholder groups">
      <div className="ring-orbit" aria-hidden="true">
        <span className="ring-track ring-track-1" />
        <span className="ring-track ring-track-2" />
      </div>

      <div className="ring-core">
        <b>REOS</b>
        <small>CONNECTED</small>
      </div>

      <div className="ring-nodes">
        {groups.map((group, index) => {
          const angle = (index / groups.length) * 360;
          return (
            <button
              key={group.id}
              type="button"
              className={`ring-node cluster-${group.cluster} ${hovered === group.id ? "is-active" : ""}`}
              style={{ "--angle": `${angle}deg` } as React.CSSProperties}
              onMouseEnter={() => setHovered(group.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(group.id)}
              onBlur={() => setHovered(null)}
              aria-label={`${group.number}. ${group.name}`}
            >
              <i>{String(group.number).padStart(2, "0")}</i>
              <span>{group.short}</span>
            </button>
          );
        })}
      </div>

      <p className="ring-readout" aria-live="polite">
        {hovered ? groups.find((g) => g.id === hovered)?.name : "Twelve stakeholder groups. One connected model."}
      </p>
    </div>
  );
}

/**
 * Section 03. The full ecosystem, once the visitor is ready to study it.
 * Groups sit under four clusters, with the regulatory rail rendered as a
 * separate layer beneath because authorities gate the other groups rather
 * than sitting alongside them.
 */
export function EcosystemMap() {
  const [active, setActive] = useState<Group>(groups[0]);
  const navigable = clusters.filter((c) => c.layer === "cluster");
  const rail = clusters.filter((c) => c.layer !== "cluster");

  return (
    <div className="eco-map">
      <div className="map-board">
        <div className="map-clusters">
          {navigable.map((cluster) => (
            <section key={cluster.id} className={`map-cluster cluster-${cluster.id}`} aria-label={cluster.name}>
              <header>
                <b>{cluster.name}</b>
                <small>{cluster.controls}</small>
              </header>
              <div className="map-groups">
                {groupsByCluster(cluster.id).map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    className={active.id === group.id ? "is-active" : ""}
                    onClick={() => setActive(group)}
                    aria-pressed={active.id === group.id}
                  >
                    <i>{String(group.number).padStart(2, "0")}</i>
                    <span>{group.short}</span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>

        {rail.map((cluster) => (
          <section key={cluster.id} className={`map-rail cluster-${cluster.id}`} aria-label={cluster.name}>
            <header>
              <b>{cluster.name}</b>
              <small>{cluster.controls}</small>
            </header>
            <div className="map-groups">
              {groupsByCluster(cluster.id).map((group) => (
                <button
                  key={group.id}
                  type="button"
                  className={active.id === group.id ? "is-active" : ""}
                  onClick={() => setActive(group)}
                  aria-pressed={active.id === group.id}
                >
                  <i>{String(group.number).padStart(2, "0")}</i>
                  <span>{group.short}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      <aside className="map-detail" aria-live="polite">
        <span className="index-label">GROUP {String(active.number).padStart(2, "0")}</span>
        <h3>{active.name}</h3>
        <p className="detail-controls">{active.controls}</p>
        {active.boundary && (
          <p className="detail-boundary"><b>Where the line sits</b>{active.boundary}</p>
        )}

        <div className="detail-rule" />

        <small className="detail-label">Active across</small>
        <div className="detail-phases">
          {(["Originate", "Deliver", "Own", "Evolve"] as const).map((phase) => (
            <span key={phase} className={active.phases.includes(phase) ? "on" : ""}>{phase}</span>
          ))}
        </div>

        <small className="detail-label">Participants</small>
        <ul className="detail-members">
          {active.members.map((member) => <li key={member}>{member}</li>)}
        </ul>

        <StatusTag status={active.status} />
        <Link className="text-link" href="/lifecycle">See where this group enters the lifecycle <span>→</span></Link>
      </aside>
    </div>
  );
}

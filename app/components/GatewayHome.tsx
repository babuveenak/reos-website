import Link from "next/link";
import { gateways } from "../data/gateways";
import { GatewayTopbar } from "./GatewayShell";

export function GatewayHome() {
  return (
    <div className="gateway-product">
      <a className="gateway-skip" href="#gateway-route">Skip to the gateway route</a>
      <GatewayTopbar />

      <main className="gateway-hero" aria-labelledby="gateway-title">
        <div className="gateway-orientation">
          <span className="gateway-kicker">ONE CONNECTED DELIVERY SYSTEM</span>
          <h1 id="gateway-title">See where the project is.<br /><em>Know what moves it forward.</em></h1>
          <p>Seven controlled gateways connect opportunity to a performing asset—each with an owner, evidence and a clear decision.</p>
          <div className="gateway-actions">
            <Link href="/journey">Start the journey <span aria-hidden="true">→</span></Link>
            <Link href="/roles">Find my role</Link>
          </div>
        </div>

        <div className="gateway-world" id="gateway-route" aria-label="Seven gateway lifecycle">
          <div className="gateway-route-line" aria-hidden="true" />
          <ol>
            {gateways.map((gateway, index) => (
              <li key={gateway.id} className={`gateway-stop gateway-stop-${index + 1}`} style={{"--gate-accent":gateway.accent} as React.CSSProperties}>
                <Link href={`/gateway/${gateway.slug}`} aria-label={`${gateway.id} ${gateway.name}: ${gateway.purpose}`}>
                  <span className="gateway-landmark" data-landmark={gateway.landmark} aria-hidden="true">
                    <i /><b /><u />
                  </span>
                  <span className="gateway-label"><b>{gateway.id}</b><strong>{gateway.name}</strong><small>{gateway.purpose}</small></span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="gateway-loop" aria-hidden="true">↺ <span>Lessons to next G1</span></div>
        </div>

        <dl className="gateway-proof" aria-label="Process coverage">
          <div><dt>7</dt><dd>controlled gateways</dd></div>
          <div><dt>12</dt><dd>integrated groups</dd></div>
          <div><dt>84</dt><dd>linked control cells</dd></div>
          <div><dt>∞</dt><dd>evidence traceability</dd></div>
        </dl>
      </main>
    </div>
  );
}

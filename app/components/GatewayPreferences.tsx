"use client";

import { useEffect, useState } from "react";

export function GatewayPreferences() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const initial = localStorage.getItem("reos-motion-v1") === "reduced" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.dataset.reosMotion = initial ? "reduced" : "full";
    const timer = window.setTimeout(() => setReduced(initial), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const toggleMotion = () => setReduced((current) => {
    const next = !current;
    document.documentElement.dataset.reosMotion = next ? "reduced" : "full";
    localStorage.setItem("reos-motion-v1", next ? "reduced" : "full");
    return next;
  });
  return <button className="gateway-motion" type="button" aria-pressed={reduced} onClick={toggleMotion}>{reduced ? "Motion reduced" : "Reduce motion"}</button>;
}

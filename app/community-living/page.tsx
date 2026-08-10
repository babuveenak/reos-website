import type { Metadata } from "next";
import CommunityLivingClient from "./CommunityLivingClient";

export const metadata: Metadata = {
  title: "Community Living UAE — The Operating System for Community Living",
  description: "A resident-first community intelligence layer that helps people understand who is responsible, what to do next, and how community stakeholders connect.",
  alternates: { canonical: "/community-living" },
  openGraph: {
    title: "Community Living UAE — The Operating System for Community Living",
    description: "Know who is responsible. Understand what to do next.",
    type: "website"
  }
};

export default function CommunityLivingPage() {
  return <CommunityLivingClient />;
}

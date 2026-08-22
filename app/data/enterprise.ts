export type AssuranceState = "Website evidence" | "Pilot requirement" | "Deployment-specific";

export const assuranceStates: { state: AssuranceState; meaning: string }[] = [
  { state: "Website evidence", meaning: "A buyer can inspect this principle or boundary in the current REOS experience." },
  { state: "Pilot requirement", meaning: "The control must be demonstrated and accepted within a scoped pilot before rollout." },
  { state: "Deployment-specific", meaning: "The final control depends on the customer, jurisdiction, hosting and integration design." },
];

export const trustDomains = [
  {
    id: "security",
    number: "01",
    title: "Security & access control",
    outcome: "Limit each user to the licensed product, organization, role and case scope they are authorized to use.",
    states: ["Website evidence", "Pilot requirement", "Deployment-specific"] as AssuranceState[],
    evidence: "The product model defines organization licensing, product entitlement and role-based access boundaries.",
    pilot: "Demonstrate identity flows, role matrix, privileged access, session controls and access-removal scenarios.",
    boundary: "Identity provider, MFA, residency and network controls are selected in the deployment design; they are not active in this website preview.",
  },
  {
    id: "auditability",
    number: "02",
    title: "Auditability",
    outcome: "Reconstruct who did what, when, against which case evidence and under which workflow state.",
    states: ["Website evidence", "Pilot requirement"] as AssuranceState[],
    evidence: "REOS product previews preserve case ownership, timestamps, evidence versions, decisions and handoffs as explicit concepts.",
    pilot: "Prove event coverage, actor attribution, exportability, exception history and reviewer access against agreed pilot cases.",
    boundary: "An audit record supports governance; it does not replace an authority's official transaction or decision record.",
  },
  {
    id: "data-ownership",
    number: "03",
    title: "Data ownership & stewardship",
    outcome: "Keep customer, authority and REOS responsibilities explicit across collection, use, retention, export and deletion.",
    states: ["Pilot requirement", "Deployment-specific"] as AssuranceState[],
    evidence: "REOS consistently distinguishes its operational case record from official systems of record.",
    pilot: "Agree a data inventory, controller/processor roles, lawful purpose, retention schedule, export format and deletion evidence.",
    boundary: "Contractual ownership, residency and retention are customer- and jurisdiction-specific and require formal agreement.",
  },
  {
    id: "evidence-governance",
    number: "04",
    title: "Evidence governance",
    outcome: "Ensure guidance and workflow decisions can be traced to a source, jurisdiction, review state and applicable date.",
    states: ["Website evidence", "Pilot requirement"] as AssuranceState[],
    evidence: "The approved Intelligence model requires official source, jurisdiction, effective date, review state and applicability context.",
    pilot: "Sample source lineage, stale-content handling, reviewer accountability and workflow references used by the selected product.",
    boundary: "REOS organizes and cites evidence; binding interpretations remain with authorities and qualified advisers.",
  },
  {
    id: "deployment",
    number: "05",
    title: "Deployment & integration boundaries",
    outcome: "Define where REOS coordinates work, where data crosses boundaries and which external system remains authoritative.",
    states: ["Website evidence", "Pilot requirement", "Deployment-specific"] as AssuranceState[],
    evidence: "The operating model positions REOS as the orchestration layer, not the issuer of approvals or owner of official records.",
    pilot: "Validate interface ownership, failure handling, reconciliation, environment separation and operational support.",
    boundary: "No production integrations, authentication or subscriptions are connected in the public website preview.",
  },
];

export const evaluationStages = [
  { number: "01", title: "Qualify", decision: "Is there a material workflow problem and an accountable sponsor?", outputs: ["Business outcome", "Named sponsor", "Candidate product", "Decision timeline"] },
  { number: "02", title: "Scope", decision: "Can the workflow, users, data and authority boundary be isolated safely?", outputs: ["Process boundary", "Pilot cohort", "Data classification", "Integration assumptions"] },
  { number: "03", title: "Pilot", decision: "Can REOS demonstrate the agreed workflow and controls with representative cases?", outputs: ["Configured workflow", "Test cases", "Control evidence", "Issue register"] },
  { number: "04", title: "Accept", decision: "Did the pilot meet functional, control and operational criteria?", outputs: ["Acceptance record", "Exceptions", "Remediation owners", "Go / no-go decision"] },
  { number: "05", title: "Roll out", decision: "Are commercial, support, security and change controls ready for bounded use?", outputs: ["Licence scope", "Support model", "Release gates", "Adoption measures"] },
];

export const acceptanceCriteria = [
  ["Workflow", "Representative cases reach agreed states with correct prerequisites, owners and exception paths."],
  ["Access", "Pilot roles can perform only their authorized actions; joiner, mover and leaver scenarios are evidenced."],
  ["Evidence", "Required documents, versions, sources and review states remain traceable to the case."],
  ["Audit", "Agreed events can be reconstructed and exported for an authorized reviewer."],
  ["Integration", "Interface failures, retries, reconciliation and authoritative-system boundaries behave as designed."],
  ["Operations", "Support ownership, incident path, recovery expectation, training and adoption measures are accepted."],
  ["Commercial", "Product maturity, licence scope, deployment boundary, dependencies and exit terms are explicit."],
];

export const trustEvidenceRegister = [
  {
    id: "access-model",
    artifact: "Access-control model",
    owner: "REOS product and deployment owners",
    state: "Website evidence",
    availability: "Inspectable now as a design boundary; identity-provider and role-matrix proof is required during evaluation.",
  },
  {
    id: "audit-model",
    artifact: "Audit-event and evidence model",
    owner: "REOS product owner",
    state: "Pilot requirement",
    availability: "Demonstrated against representative cases, actors, exports and exception history in the scoped pilot.",
  },
  {
    id: "data-register",
    artifact: "Data inventory and stewardship register",
    owner: "Customer and REOS deployment owners",
    state: "Deployment-specific",
    availability: "Agreed before pilot data is introduced, including purpose, residency, retention, export and deletion evidence.",
  },
  {
    id: "source-lineage",
    artifact: "Evidence provenance and review register",
    owner: "REOS Intelligence evidence owner",
    state: "Pilot requirement",
    availability: "Sampled during evaluation for source, jurisdiction, applicability, review state and stale-content handling.",
  },
  {
    id: "integration-boundary",
    artifact: "Deployment and integration boundary record",
    owner: "Customer architecture authority and REOS solution owner",
    state: "Deployment-specific",
    availability: "Completed for each interface, environment, failure path, reconciliation control and authoritative system.",
  },
] as const;

export const operationalAssuranceRequirements = [
  ["Incident management", "Define severity, ownership, notification, evidence preservation and closure requirements for the scoped deployment."],
  ["Service continuity", "Agree recovery expectations, dependency boundaries, continuity roles and the evidence required before bounded use."],
  ["Vulnerability handling", "Define assessment, remediation, exception and disclosure paths appropriate to the selected hosting and product scope."],
  ["Supplier and subprocessor control", "Identify material service providers, data movement, contractual responsibilities and change-notification requirements."],
  ["Operational support", "Name support ownership, service channels, escalation paths and the handoff between customer, REOS and external providers."],
] as const;

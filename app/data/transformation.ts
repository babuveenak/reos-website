export type TransformationStakeholder = {
  name: string;
  currentPain: string;
  desiredOutcome: string;
  reosHelp: string;
  whyThisMatters: string;
};

export const currentStateItems = [
  ["Different spreadsheets", "Each team maintains a partial version of the case."],
  ["Email chains", "Context is buried in conversations instead of connected to the work."],
  ["Disconnected handoffs", "The next participant receives tasks without the full dependency history."],
  ["Unknown ownership", "Teams spend time discovering who must act before they can progress."],
  ["Missing evidence", "Required records surface late or without a clear source and status."],
  ["Late-stage surprises", "Readiness gaps become blockers after time and commitments have accumulated."],
  ["Status chasing", "Progress is reconstructed through calls, messages and manual follow-up."],
  ["Siloed stakeholders", "Participants optimize their own step without seeing the wider lifecycle."],
  ["Passive documents", "Files record an event but do not drive the next accountable action."],
  ["Process knowledge trapped in people", "Continuity depends on who remembers the rule, exception or handoff."],
] as const;

export const reosStateItems = [
  ["One operating model", "Every participant works within the same lifecycle logic."],
  ["One case state", "Status, evidence, actions and decisions describe one shared case."],
  ["One evidence chain", "Each requirement remains connected to its source, version and use."],
  ["One accountability path", "The active owner, reason and next handoff are visible."],
  ["Connected stakeholders", "Participants see the context needed for their role and dependency."],
  ["Connected workflow", "Actions and handoffs remain part of an end-to-end operating sequence."],
  ["Earlier readiness insights", "Missing prerequisites appear before the next critical gate."],
  ["Governed decisions", "Reviews remain connected to the evidence and authority behind them."],
  ["Shared visibility", "Teams can understand progress without creating another status trail."],
  ["Orchestrated lifecycle", "Work progresses through a coordinated property journey, not isolated tasks."],
] as const;

export const operatingPressures = [
  "Property complexity increased.",
  "Stakeholder count increased.",
  "Approval dependencies increased.",
  "Compliance requirements increased.",
  "Digital systems grew separately.",
  "The operating model never became connected.",
] as const;

export const executiveOutcomes = [
  ["01", "Clear Accountability", "Every active action has an owner, reason and next handoff.", "Who owns the next action, and why?"],
  ["02", "Operational Transparency", "Status becomes visible across participants and dependencies.", "What is the current case state across participating teams?"],
  ["03", "Earlier Readiness", "Evidence issues appear before they become blockers.", "What is likely to block the next critical gate?"],
  ["04", "Governed Execution", "Approvals and decisions stay connected to their source context.", "Which evidence and authority support this decision?"],
  ["05", "Shared Understanding", "Stakeholders operate from the same lifecycle model.", "Are all participants working from the same lifecycle context?"],
  ["06", "Audit Confidence", "Evidence and decisions remain connected to workflow history.", "Can the decision history and supporting evidence be reviewed?"],
] as const;

export const transformationStakeholders: TransformationStakeholder[] = [
  {
    name: "Landowners & Investors",
    currentPain: "Opportunity, title, feasibility and asset evidence are dispersed across reports and participants.",
    desiredOutcome: "A shared lifecycle view of ownership context, dependencies and operating readiness.",
    reosHelp: "REOS connects the relevant Property Journey context and evidence without replacing professional advice.",
    whyThisMatters: "Capital and ownership decisions need traceable context before downstream commitments are made.",
  },
  {
    name: "Developers",
    currentPain: "Approvals, evidence and handoffs are split across internal teams and delivery partners.",
    desiredOutcome: "One accountable view of development readiness, ownership and dependencies.",
    reosHelp: "REOS connects design, approvals, delivery and transfer work through one shared case state.",
    whyThisMatters: "Development leadership needs to see where cross-functional dependencies threaten the next gate.",
  },
  {
    name: "Consultants & Designers",
    currentPain: "Revisions, requirements and approvals move across separate files and communication trails.",
    desiredOutcome: "Current design context connected to downstream obligations.",
    reosHelp: "REOS keeps submissions, revisions, clarifications and dependencies connected to the case.",
    whyThisMatters: "A controlled design record reduces ambiguity when another Stakeholder must rely on the latest decision.",
  },
  {
    name: "Authorities & Regulators",
    currentPain: "Submission quality varies and clarifications can become detached from the original request.",
    desiredOutcome: "Structured, complete and traceable interactions without losing authority control.",
    reosHelp: "REOS prepares and routes the evidence while the authority remains the authoritative decision-maker.",
    whyThisMatters: "Clearer submission context supports review while preserving the authority's independent mandate.",
  },
  {
    name: "Utility Providers",
    currentPain: "Requests vary by asset and stage, while prerequisites often arrive incomplete.",
    desiredOutcome: "Structured requests with traceable clearances and dependencies.",
    reosHelp: "REOS maps requirements, routing and clarifications while the provider remains authoritative.",
    whyThisMatters: "Connected prerequisites make the service dependency understandable to every affected participant.",
  },
  {
    name: "Contractors",
    currentPain: "Work packages, approvals, completion evidence and handover requirements are fragmented.",
    desiredOutcome: "Visible blockers, owners and completion evidence before handover.",
    reosHelp: "REOS connects delivery actions to approvals, evidence and the next operational handoff.",
    whyThisMatters: "Delivery decisions need a clear link to approved scope, evidence and handover responsibility.",
  },
  {
    name: "Suppliers & Vendors",
    currentPain: "Requests, specifications, delivery evidence and acceptance decisions are maintained separately.",
    desiredOutcome: "A traceable connection between supply obligations, evidence and receiving actions.",
    reosHelp: "REOS places vendor contributions within the same case and dependency context as the wider workflow.",
    whyThisMatters: "Downstream teams need to know whether supplied work is current, accepted and ready for use.",
  },
  {
    name: "Brokers & Agencies",
    currentPain: "Case status depends on email, phone calls and repeated follow-up across parties.",
    desiredOutcome: "Visible readiness, clear dependencies and a known next owner.",
    reosHelp: "REOS gives the transaction a shared state and makes outstanding evidence visible by responsibility.",
    whyThisMatters: "Customer commitments are more credible when the transaction state and next action are explicit.",
  },
  {
    name: "Banks & Financial Institutions",
    currentPain: "Finance decisions wait on property evidence assembled from disconnected sources.",
    desiredOutcome: "Earlier visibility into readiness, ownership and dependency risk.",
    reosHelp: "REOS structures the evidence chain and case state while the bank retains its decision authority.",
    whyThisMatters: "Credit and release decisions depend on evidence whose source, currency and context can be reviewed.",
  },
  {
    name: "Property Owners",
    currentPain: "Obligations, progress and the next required action are often difficult to understand.",
    desiredOutcome: "An understandable path with accountable action at every handoff.",
    reosHelp: "REOS provides a responsibility-relevant view of the workflow, evidence and current action.",
    whyThisMatters: "Ownership decisions require clear visibility into obligations, evidence and accountable follow-through.",
  },
  {
    name: "Residents & Tenants",
    currentPain: "Requests are repeated across channels with limited visibility into resolution.",
    desiredOutcome: "One understandable path from request to owned outcome.",
    reosHelp: "REOS connects the request, context, owner, status and next handoff in one case.",
    whyThisMatters: "Service confidence depends on knowing who owns the request and what happens next.",
  },
  {
    name: "Facility & Community Operators",
    currentPain: "Handover information, service cases, compliance records and vendor decisions arrive through separate channels.",
    desiredOutcome: "Enter and sustain operations with complete context and clearly owned actions.",
    reosHelp: "REOS carries delivery evidence, operating cases and unresolved responsibilities through one connected history.",
    whyThisMatters: "Community continuity relies on complete handover context and accountable operational ownership.",
  },
];

export const transformationStages = [
  ["01", "Understand", "Establish the journey, participants and outcome before selecting a workflow."],
  ["02", "Map", "Connect responsibilities, evidence, dependencies and authority boundaries."],
  ["03", "Prepare", "Make the case, evidence and operating roles ready for controlled adoption."],
  ["04", "Operate", "Put the prepared workflow into operation through the existing REOS execution model."],
  ["05", "Govern", "Keep decisions, evidence, ownership and improvement connected over time."],
] as const;

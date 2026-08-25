import { groups as ecosystemGroups } from "./ecosystem.ts";

export type GatewayId = "G1" | "G2" | "G3" | "G4" | "G5" | "G6" | "G7";
export type GroupId = `GR${string}`;
export type StepId = `${GatewayId}-S${string}` | `UX-S${string}`;
export type ProcessStatus = "Not started" | "In progress" | "At risk" | "Blocked" | "Ready for review" | "Accepted" | "Accepted with condition" | "Rejected" | "Not applicable";

export interface Gateway {
  id: GatewayId;
  slug: string;
  name: string;
  question: string;
  purpose: string;
  landmark: string;
  accent: string;
  steps: StepId[];
  inputs: string[];
  outputs: string[];
  exitCriteria: string[];
  redFlags: string[];
}

export interface StakeholderGroup {
  id: GroupId;
  displayId: `SG${string}`;
  ecosystemId: string;
  name: string;
  stakeholders: string;
  controlledInformation: string;
  responsibility: string;
  boundary?: string;
}

export interface ConfirmationRecord {
  prepare: { by: string | null; date: string | null };
  review: { by: string | null; date: string | null };
  accept: { by: string | null; date: string | null; decision: "Pending" | "Accepted" | "Rejected" | "Conditional" };
}

export interface ProcessStep {
  id: StepId;
  gatewayId: GatewayId | "UX";
  groupIds: GroupId[];
  title: string;
  purpose: string;
  entryCriteria: string[];
  inputIds: string[];
  responsibleOwner: string;
  accountableOwner: string;
  reviewer: string;
  plannedDate: string | null;
  actualDate: string | null;
  outputIds: string[];
  evidenceIds: string[];
  confirmation: ConfirmationRecord;
  status: ProcessStatus;
  reason: string;
  conditions: string[];
  dependencyIds: StepId[];
  nextStepIds: StepId[];
  version: number;
  auditHistory: { event: string; at: string; by: string }[];
}

export interface MatrixCell {
  id: string;
  gatewayId: GatewayId;
  groupId: GroupId;
  outcome: string;
  stepIds: StepId[];
  responsibleRole: string;
  accountableRole: string;
  inputIds: string[];
  outputIds: string[];
  evidenceIds: string[];
  confirmationState: "Not started";
  condition: null;
  naReason: null;
}

const stakeholderInformation = [
  "Land title, investment mandate, equity commitments, shareholder decisions and return objectives",
  "Business case, development brief, project baseline, approvals, contracts, progress and handover obligations",
  "Surveys, studies, designs, calculations, specifications, professional submissions and certifications",
  "Registrations, licences, permits, NOCs, statutory decisions, conditions and compliance records",
  "Capacity confirmations, corridor requirements, designs, NOCs, connection records and service activation",
  "Methods, programmes, submittals, RFIs, inspections, tests, progress records, defects and completion evidence",
  "Product data, samples, certifications, manufacturing records, delivery status, warranties and spares",
  "Market evidence, listing and advertising permissions, buyer feedback, transaction records and communications",
  "Finance approvals, valuations, security, escrow records, drawdowns, mortgages, payments and discharges",
  "Reservations, sale agreements, payments, inspections, title, handover, defects and ownership records",
  "Occupancy needs, accessibility requirements, tenancy records, service requests, feedback and complaints",
  "Asset registers, as-builts, O&M information, training, warranties, service levels, defects and performance data",
] as const;

export const stakeholderGroups: StakeholderGroup[] = ecosystemGroups.map((group, index) => {
  const sequence = String(index + 1).padStart(2, "0");
  return {
    id: `GR${sequence}` as GroupId,
    displayId: `SG${sequence}` as `SG${string}`,
    ecosystemId: group.id,
    name: group.name,
    stakeholders: group.members.join(", "),
    controlledInformation: stakeholderInformation[index] ?? "Lifecycle records and evidence",
    responsibility: group.controls.replace(/\.$/, ""),
    boundary: group.boundary,
  };
});

export const stakeholderGroupCode = (id: GroupId) => `SG${id.slice(2)}` as `SG${string}`;
export const normalizeStakeholderGroupId = (value: string) => `GR${value.toUpperCase().replace(/^(SG|GR)/, "")}` as GroupId;

const gatewayContent = [
  { id:"G1", slug:"feasibility", name:"Feasibility", question:"Should we invest more time and money in this opportunity?", purpose:"Test whether the opportunity is viable and choose an evidence-backed route.", landmark:"Parcel, compass and option blocks", accent:"#C9B458",
    titles:["Confirm opportunity brief","Verify land/title and legal due diligence","Validate market and demand","Confirm site, access, utility and environmental constraints","Compare development options and capacity","Validate planning/authority pathway","Test programme and procurement options","Validate cost, revenue, cash flow and sensitivities","Confirm risk/opportunity responses","Approve preferred option and business case","Record investment-gate decision and baseline"],
    inputs:["Sponsor objectives and success measures","Land and ownership information","Available surveys, controls and utility information","Market, customer and product assumptions","Funding, return and time constraints","Lessons from comparable projects"],
    outputs:["Approved feasibility and business case","Preferred option and scope boundary","Feasibility cost plan and funding profile","Initial master programme","Due-diligence, risk, opportunity and assumption registers","Initial authority and stakeholder maps","Next-gateway execution plan"],
    exit:["Land, title and material legal constraints are understood","The preferred option is supported by traceable evidence","Cost, revenue, time and funding assumptions are explicit","Authority and site constraints are identified","Sensitivities expose viability limits","Top risks have owners and responses","Next-stage scope, budget, team and programme are authorized"],
    flags:["Unverified land rights","Hidden utility diversion","Optimistic demand assumptions","Missing access strategy","Unsupported authority assumptions","Excluded enabling works"] },
  { id:"G2", slug:"authority", name:"Authority", question:"Is there a verified, achievable route to all required statutory approvals?", purpose:"Verify the applicable approval route, submissions, conditions and expiry controls.", landmark:"Civic checkpoint and permit lanes", accent:"#62C8B5",
    titles:["Accept feasibility baseline","Verify jurisdiction and asset-specific authorities","Build approval/NOC/permit matrix","Confirm codes, submission stages and prerequisites","Complete pre-application engagement","Verify surveys and specialist studies","Prepare coordinated submissions","Submit, track and close comments","Record approvals, conditions and expiry dates","Complete compliance assurance","Record authority-gate decision and baseline"],
    inputs:["Approved development option","Verified site, land and jurisdiction data","Concept information for early engagement","Authority, utility-provider and specialist requirements","Programme dependencies and long-lead approvals"],
    outputs:["Authority and NOC matrix","Applicable-code and compliance register","Submission, response and approval repository","Conditions, commitments and expiry register","Authority-integrated programme","Design compliance brief"],
    exit:["The authority matrix is verified and programme-linked","Approvals, fees, prerequisites and validity periods are known","Major statutory constraints are resolved or controlled","Comments and conditions are in project requirements","Internal decisions are not represented as authority approvals","The design team has a clear compliance basis"],
    flags:["Generic authority checklist","Expired NOCs","Unclosed comments","Permits disconnected from programme","Design changed after approval","Approval claim without source"] },
  { id:"G3", slug:"design", name:"Design", question:"Is the coordinated design compliant, affordable, buildable, operable and ready for procurement?", purpose:"Turn requirements into a coordinated, verified and controlled technical baseline.", landmark:"Exploded coordinated building model", accent:"#8DB7E8",
    titles:["Accept requirements and authority conditions","Validate design brief and traceability","Develop concept design","Evaluate options and confirm concept","Develop schematic design","Complete multidisciplinary/BIM coordination","Develop detailed design","Close value, buildability, safety and operability reviews","Verify specifications, schedules and calculations","Complete IFC/tender-package quality assurance","Freeze design and record design-gate decision"],
    inputs:["Approved project and user requirements","Authority conditions and codes","Surveys, investigations and utility information","Budget, programme, procurement and sustainability targets","Operator and maintainability requirements"],
    outputs:["Design brief and requirements traceability matrix","Coordinated design and drawing register","Calculations, reports, schedules and specifications","BIM and information delivery records","Design risk, interface, decision and change logs","Updated cost plan and programme","Tender/IFC readiness certificate"],
    exit:["Requirements trace into design","Disciplines and interfaces are coordinated","Clashes are within approved tolerances","Outputs are supported by verified technical information","Cost is within authorized limits","Buildability, safety, maintainability and accessibility reviews are closed","Authority and sustainability commitments are met","Residual risks and exclusions are explicit","The baseline is frozen under change control"],
    flags:["Unbuildable design","Unresolved clashes","Outdated cost scope","Hidden contractor design","Weak interface ownership","Missing operator input"] },
  { id:"G4", slug:"tendering", name:"Tendering", question:"Can we award a fair, complete and deliverable contract with controlled risk?", purpose:"Run a controlled competition and award a contract with visible scope and risk.", landmark:"Bid tables, packages and balanced scales", accent:"#E8A56A",
    titles:["Accept procurement-ready design","Confirm packaging and contract strategy","Complete market sounding and prequalification","Approve tender documents and evaluation rules","Issue controlled tender","Control clarifications and addenda","Receive and secure bids","Complete compliance, technical and commercial evaluation","Normalize bids and verify risk/capability","Complete permitted negotiation/BAFO","Approve recommendation","Execute award/contract and record tender-gate decision"],
    inputs:["Approved procurement strategy","Complete tender package and responsibility matrix","Budget and pre-tender estimate","Evaluation method and governance rules","Qualified bidders and market-capacity view"],
    outputs:["Tender and addenda register","Bid records and evaluation report","Bid normalization and risk schedules","Approved award recommendation","Executed contract or controlled award letter","Award cost plan and baseline programme","Mobilization plan"],
    exit:["Bidders received equal controlled information","Clarifications and conflicts are governed","Evaluation follows published criteria","Scope gaps and qualifications are normalized","The bidder has credible capability and controls","Price and cash flow fit the business case","Negotiations are auditable","Bonds, insurance and conditions are ready","Mobilization requires formal authority"],
    flags:["Lowest-price-only selection","Unequal bidder information","Undocumented negotiation","Unpriced exclusions","Incomplete fixed scope","Missing bonds or insurance"] },
  { id:"G5", slug:"construction", name:"Construction", question:"Has the contracted work been safely delivered, verified and made ready for handover?", purpose:"Build, inspect, test and reconcile the asset against the controlled baseline.", landmark:"Crane, approved model and inspection points", accent:"#E47D6D",
    titles:["Accept executed contract and approved baseline","Verify mobilization and logistics readiness","Approve submittals, samples and method statements","Control procurement and long-lead items","Construct, inspect and record conformance","Control RFIs, coordination and changes","Verify progress, cost, risk, HSE and quality","Complete systems and pre-commission","Test and commission systems","Control defects/punch items","Confirm completion readiness and construction-gate decision"],
    inputs:["Executed contract and baseline programme","Construction permits and authority conditions","Approved-for-construction information","Quality, HSE, inspection and method controls","Procurement, submittal and interface schedules"],
    outputs:["Verified completion status and quality dossier","Inspection, test and commissioning records","Approved changes and contract forecast","Authority inspection records","Draft as-built and asset information","Defect register","Handover readiness certificate"],
    exit:["Scope meets the defined completion standard","Quality records prove conformance","Critical systems have accepted tests","Changes, claims and RFIs are reconciled","Reports match verified site reality","Statutory prerequisites are satisfied","Residual defects are non-critical and owned","Asset information is handover-ready","Operator readiness is confirmed"],
    flags:["Invoice-based progress","Concealed defects","Unapproved materials","Uncalibrated tests","Late commissioning","Incomplete asset data"] },
  { id:"G6", slug:"handover", name:"Handover", question:"Can the asset be safely occupied, operated, maintained and contractually accepted?", purpose:"Transfer a safe, usable asset with accepted information and clear responsibility.", landmark:"Completed asset, bridge, keys and data cube", accent:"#A98CE6",
    titles:["Accept construction-completion evidence","Complete integrated commissioning and witnessing","Verify statutory completion/occupancy evidence","Close critical defects","Accept as-builts, O&M manuals and asset data","Train operators and transfer keys/access/spares","Complete emergency and operational-readiness drills","Complete customer/unit handover where applicable","Verify commercial and contractual completion","Issue applicable acceptance certificates and handover decision"],
    inputs:["Construction completion-readiness pack","Commissioning scripts and results","Defect register","Draft as-built, O&M, warranty and asset information","Operator, customer and statutory requirements"],
    outputs:["Signed asset and area handover records","Applicable completion and taking-over certificates","Accepted as-built, O&M, asset and warranty repository","Training and readiness records","Keys, access, spares and transfer logs","Residual defect and deferred-test register","Post-handover service plan"],
    exit:["Required authority clearances are valid","Life-safety, utilities and critical systems operate","Critical defects are closed","Deferred tests are controlled","Operator information and training are accepted","Asset and responsibility boundaries are recorded","Customer interfaces are managed","Contract decisions are not inferred from occupancy","The post-handover plan is active"],
    flags:["Keys treated as full acceptance","Missing authority certificate","Incomplete emergency training","Placeholder as-builts","Unassigned warranties","Inconsistent customer information"] },
  { id:"G7", slug:"post-handover", name:"Post Handover", question:"Is the asset performing as intended, are obligations closed, and have lessons been captured?", purpose:"Stabilize operations, close obligations, verify benefits and return lessons to G1.", landmark:"Operating asset and human feedback loop", accent:"#70D39B",
    titles:["Accept asset and obligations register","Stabilize operations and support users","Triage, correct and confirm defects","Complete seasonal/deferred testing","Monitor asset and service KPIs","Control warranties and supplier obligations","Complete post-occupancy and user-happiness evaluation","Close defects-liability obligations","Close final account and contracts","Archive verified records and publish lessons","Verify benefits and record post-handover decision"],
    inputs:["Accepted handover pack and asset baseline","Defect, warranty and obligation registers","Target operational and customer outcomes","Contracts, service levels and performance criteria","Feedback and system data"],
    outputs:["Closed defect and obligation records","Post-occupancy and performance report","Warranty status and asset-information baseline","Final account and contract closeout evidence","Benefits review","Lessons library and actions","Final asset closeout decision"],
    exit:["Defects meet classified service levels","Seasonal and deferred tests are complete","Warranties are preserved and transferred","Performance is compared with targets","Safety, comfort, accessibility and feedback are reviewed","Commercial closeout is authorized","Records are searchable and retained","Lessons feed future work","Residual operational risks are accepted"],
    flags:["Administrative defect closure","Complaints treated as noise","Warranty expiry without action","No actual-versus-designed comparison","Lost asset data","Lessons nobody can find"] },
] as const;

const pad = (value: number) => String(value).padStart(2, "0");

export const gateways: Gateway[] = gatewayContent.map((gateway) => ({
  id: gateway.id,
  slug: gateway.slug,
  name: gateway.name,
  question: gateway.question,
  purpose: gateway.purpose,
  landmark: gateway.landmark,
  accent: gateway.accent,
  steps: gateway.titles.map((_, index) => `${gateway.id}-S${pad(index + 1)}` as StepId),
  inputs: [...gateway.inputs], outputs: [...gateway.outputs], exitCriteria: [...gateway.exit], redFlags: [...gateway.flags],
}));

const groupAccountableRoles: Record<GroupId, string> = {
  GR01:"Landowner / Investment Committee", GR02:"Development Director / Project Sponsor",
  GR03:"Lead Consultant / Developer", GR04:"Applicable Authority / Regulator",
  GR05:"Utility Provider / Developer", GR06:"Main Contractor / Developer",
  GR07:"Supplier Lead / Main Contractor", GR08:"Brokerage Principal / Developer",
  GR09:"Financial Institution / Project Sponsor", GR10:"Property Owner / Developer",
  GR11:"Property Operator / Community Manager", GR12:"Asset Owner / FM Lead",
};
const groupOwners: Record<GroupId, [string, string]> = Object.fromEntries(stakeholderGroups.map((group) => [group.id, [group.stakeholders.split(",")[0], groupAccountableRoles[group.id]]]));

const matrixStepIndex: Record<GatewayId, number[]> = {
  G1:[9,9,4,5,3,6,6,2,7,2,2,4], G2:[1,10,6,7,2,5,3,4,3,3,3,3],
  G3:[3,10,9,0,5,7,8,1,7,1,1,7], G4:[10,11,7,3,3,8,7,3,8,3,3,3],
  G5:[6,6,5,8,8,4,3,6,6,6,6,8], G6:[8,9,1,2,2,3,4,7,8,7,6,4],
  G7:[10,9,3,9,4,7,5,6,8,6,6,4],
};

const previousStep = (gatewayIndex: number, stepIndex: number): StepId[] => {
  if (stepIndex > 0) return [gateways[gatewayIndex].steps[stepIndex - 1]];
  if (gatewayIndex > 0) return [gateways[gatewayIndex - 1].steps.at(-1)!];
  return [];
};

export const processSteps: ProcessStep[] = gateways.flatMap((gateway, gatewayIndex) =>
  gatewayContent[gatewayIndex].titles.map((title, stepIndex) => {
    const id = gateway.steps[stepIndex];
    const groupIds = stakeholderGroups.filter((_, groupIndex) => matrixStepIndex[gateway.id][groupIndex] === stepIndex).map((group) => group.id);
    const primaryGroup = groupIds[0] ?? "GR02";
    const [responsibleOwner, accountableOwner] = groupOwners[primaryGroup];
    const dependencies = previousStep(gatewayIndex, stepIndex);
    const next = stepIndex < gateway.steps.length - 1 ? [gateway.steps[stepIndex + 1]] : gatewayIndex < gateways.length - 1 ? [gateways[gatewayIndex + 1].steps[0]] : [];
    return {
      id, gatewayId:gateway.id, groupIds:groupIds.length ? groupIds : ["GR02"], title,
      purpose:`Produce and confirm the controlled outcome needed to ${title.toLowerCase()}.`,
      entryCriteria: dependencies.length ? dependencies.map((item) => `${item} output resolves to its current accepted version`) : ["Approved opportunity mandate is available"],
      inputIds: dependencies.length ? dependencies.map((item) => `DOC-${item}-V1`) : ["REQ-PROJECT-MANDATE"],
      responsibleOwner, accountableOwner, reviewer:"Competent reviewer independent of preparation", plannedDate:null, actualDate:null,
      outputIds:[`DOC-${id}-V1`], evidenceIds:[`EV-${id}`],
      confirmation:{ prepare:{by:null,date:null}, review:{by:null,date:null}, accept:{by:null,date:null,decision:"Pending"} },
      status:"Not started" as const, reason:"Template record — no live project evidence has been loaded.", conditions:[], dependencyIds:dependencies, nextStepIds:next,
      version:1, auditHistory:[{event:"Blueprint record created",at:"Blueprint v2.0",by:"REOS process model"}],
    };
  })
);

const uxTitles = [
  "Identify users, needs, risks and accessibility requirements","Agree measurable experience outcomes and listening plan","Validate authority/customer communication touchpoints","Prototype and test critical journeys with representative users","Contract service levels, support and handover obligations","Communicate disruption and test support readiness","Verify expectation, accessibility and operational readiness","Deliver guided handover and capture immediate feedback","Triage feedback, complaints and defects with visible ownership","Measure outcomes at agreed intervals","Complete service recovery and confirm closure with affected users","Approve the User Happiness Outcome and feed lessons into the next G1",
];
const uxGatewayIds: GatewayId[] = ["G1","G1","G2","G3","G4","G5","G6","G6","G7","G7","G7","G7"];
export const uxSteps: ProcessStep[] = uxTitles.map((title,index) => {
  const id = `UX-S${pad(index+1)}` as StepId;
  return { id, gatewayId:"UX", groupIds:["GR02","GR10","GR11","GR12"], title, purpose:`Execute and evidence the user-outcome control: ${title.toLowerCase()}.`, entryCriteria:index ? [`UX-S${pad(index)} is accepted`] : ["Project user segments are authorized"], inputIds:index ? [`DOC-UX-S${pad(index)}-V1`] : ["REQ-USER-OUTCOMES"], responsibleOwner:"Customer / Resident Experience Lead", accountableOwner:"Development Director / Asset Owner", reviewer:"Accessibility or service assurance reviewer", plannedDate:null, actualDate:null, outputIds:[`DOC-${id}-V1`], evidenceIds:[`EV-${id}`], confirmation:{prepare:{by:null,date:null},review:{by:null,date:null},accept:{by:null,date:null,decision:"Pending"}}, status:"Not started", reason:`Mandatory assurance step linked to ${uxGatewayIds[index]}; no live measurements loaded.`, conditions:[], dependencyIds:index ? [`UX-S${pad(index)}` as StepId] : [], nextStepIds:index<uxTitles.length-1 ? [`UX-S${pad(index+2)}` as StepId] : ["G1-S01"], version:1, auditHistory:[{event:"Blueprint record created",at:"Blueprint v2.0",by:"REOS process model"}] };
});

const matrixOutcomes: Record<GroupId,string[]> = {
  GR01:["Confirm land and investment mandate","Resolve ownership inputs for approvals","Endorse design against investment intent","Confirm funding and award parameters","Monitor capital, risk and material variance","Confirm ownership and investment handover","Review asset performance and investment outcomes"],
  GR02:["Lead feasibility and the business case","Coordinate approvals and NOCs","Own the brief, design and budget baseline","Run procurement and authorize award","Govern delivery, change and reporting","Coordinate completion and stakeholder handover","Close obligations and feed lessons forward"],
  GR03:["Test site, options and technical feasibility","Prepare and coordinate authority submissions","Develop, coordinate and certify the design","Issue tender information and evaluate bids","Review submittals, inspect and certify work","Verify testing, records and completion","Support defects, performance review and lessons"],
  GR04:["Confirm planning and regulatory constraints","Review submissions and issue statutory decisions","Verify design compliance at required stages","Maintain applicable permit and licence conditions","Inspect works and enforce conditions","Issue completion and occupancy clearances","Maintain operational and property compliance"],
  GR05:["Confirm capacity, corridors and connection constraints","Define NOCs, approvals and connection requirements","Review utility designs and interfaces","Confirm utility scope and provider obligations","Inspect interfaces and deliver connections","Activate services and close connection NOCs","Support service performance and modifications"],
  GR06:["Advise buildability and delivery risk","Plan permit and enabling-work inputs","Review buildability, methods and commissioning","Bid, clarify scope and demonstrate capability","Build, inspect, test and report conformance","Complete defects, commissioning and handover","Rectify defects and close contractual obligations"],
  GR07:["Advise availability, lead times and supply risk","Identify product approvals and certifications","Support specifications, samples and product data","Submit compliant offers, warranties and delivery plans","Manufacture, deliver and support quality testing","Transfer warranties, spares and product records","Fulfil warranty and replacement obligations"],
  GR08:["Test market demand, pricing and product fit","Verify the marketing and sales permission route","Share buyer feedback and product requirements","Maintain compliant market representation","Communicate verified delivery status to the market","Coordinate buyer communications and handover appointments","Support leasing, resale and customer feedback"],
  GR09:["Assess financeability, funding and the escrow route","Confirm regulatory and financial prerequisites","Review cost, valuation and drawdown assumptions","Validate funding conditions and award securities","Control drawdowns, valuations and escrow releases","Confirm completion-related finance and discharge actions","Close facilities, mortgages and escrow obligations"],
  GR10:["Represent buyer and investor-owner expectations","Receive verified regulatory disclosure","Validate usability, value and end-user requirements","Receive committed specification and service obligations","Track progress and raise contractually relevant issues","Inspect and accept unit and ownership handover records","Confirm defect closure, services and ownership outcomes"],
  GR11:["Inform intended use, access and amenity expectations","Understand occupancy and tenancy requirements","Validate accessibility, comfort and operational needs","Shape service and support requirements","Receive disruption and safety communications","Complete move-in readiness and orientation","Report experience issues and confirm service recovery"],
  GR12:["Define whole-life operating and maintenance outcomes","Identify operating permits and service conditions","Review maintainability, access and asset information","Set FM mobilization, O&M and warranty requirements","Prepare operating systems, assets and teams","Accept asset data, training, keys and warranties","Operate the community, measure performance and return lessons"],
};

export const matrixCells: MatrixCell[] = stakeholderGroups.flatMap((group, groupIndex) => gateways.map((gateway, gatewayIndex) => {
  const step = gateway.steps[matrixStepIndex[gateway.id][groupIndex]];
  return { id:`${gateway.id}-${group.id}`, gatewayId:gateway.id, groupId:group.id, outcome:matrixOutcomes[group.id][gatewayIndex], stepIds:[step], responsibleRole:group.stakeholders.split(",")[0], accountableRole:groupAccountableRoles[group.id], inputIds:[`REQ-${gateway.id}-${group.id}`], outputIds:[`DOC-${step}-V1`], evidenceIds:[`EV-${step}`], confirmationState:"Not started", condition:null, naReason:null };
}));

export const allSteps = [...processSteps, ...uxSteps];
export const gatewayBySlug = Object.fromEntries(gateways.map((gateway) => [gateway.slug,gateway]));
export const gatewayById = Object.fromEntries(gateways.map((gateway) => [gateway.id,gateway]));
export const groupById = Object.fromEntries(stakeholderGroups.flatMap((group) => [[group.id,group], [group.displayId,group]]));
export const stepById = Object.fromEntries(allSteps.map((step) => [step.id,step]));

export const roles = [
  ["Project Sponsor / Investment Committee","Own strategic alignment, funding and go or stop decisions"], ["Development Director / Project Director","Accountable for the integrated gateway submission"], ["Gateway Manager / PMO","Own criteria, evidence index, review agenda, actions and audit trail"], ["Discipline and Workstream Leads","Produce and self-check evidence in their scope"], ["Cost, Planning, Risk and Commercial Leads","Challenge readiness independently"], ["Design Lead / Lead Consultant","Coordinate design, compliance and deliverables"], ["Authority Liaison","Manage verified approvals, submissions and conditions"], ["Main Contractor / Package Contractors","Deliver construction, quality and completion evidence"], ["HSE and Quality Leads","Verify mandatory controls independently"], ["Operator / FM / Asset Owner","Define operating requirements and accept usable asset information"], ["Independent Reviewer","Provide objective assurance where required"], ["Gate Chair / Authorized Approver","Record the gateway decision and conditions"],
] as const;

export const glossary = [
  ["Accountable owner","The person who has authority to accept or reject the result."], ["Authority approval","A decision issued by the applicable statutory body; an internal gate cannot replace it."], ["Baseline","The accepted version used to control the next stage."], ["Condition","A named, owned and dated obligation attached to an acceptance."], ["Controlled document","A uniquely identified and versioned project record."], ["Evidence assurance","Confidence that evidence is current, relevant, traceable and independently checked."], ["Gate ready","All mandatory data and links validate, with zero critical blockers."], ["Maker-checker","Separation between the person preparing work and the person accepting it."], ["NOC","A no-objection certificate. Applicability and legal effect vary by jurisdiction."], ["O&M manual","Operating and maintenance information transferred to the asset operator."], ["Proceed with conditions","Progress with only named, non-critical and time-bound actions remaining."], ["User Happiness Assurance","A measurable process for understanding, supporting and improving user outcomes—not a promise of emotion."],
] as const;

export function completenessForStep(step: ProcessStep) {
  const checks = [step.groupIds.length>0,step.entryCriteria.length>0,step.inputIds.length>0,Boolean(step.responsibleOwner),Boolean(step.accountableOwner),Boolean(step.reviewer),step.outputIds.length>0,step.evidenceIds.length>0,Boolean(step.confirmation.prepare.by),Boolean(step.confirmation.review.by),Boolean(step.confirmation.accept.by),step.confirmation.accept.decision!=="Pending",step.version>0,step.auditHistory.length>0];
  return Math.floor((checks.filter(Boolean).length/checks.length)*100);
}

export function validateGatewayModel() {
  const errors:string[]=[];
  if(gateways.length!==7) errors.push("Gateway count must equal 7");
  if(stakeholderGroups.length!==12) errors.push("Stakeholder-group count must equal 12");
  if(matrixCells.length!==84) errors.push("Matrix coverage must equal 84 cells");
  const ids=allSteps.map((step)=>step.id); if(new Set(ids).size!==ids.length) errors.push("Step IDs must be unique");
  for(const cell of matrixCells){ if(!gatewayById[cell.gatewayId]||!groupById[cell.groupId]||cell.stepIds.some((id)=>!stepById[id])) errors.push(`Broken matrix cell ${cell.id}`); }
  for(const step of allSteps){ if(step.responsibleOwner===step.confirmation.accept.by&&step.confirmation.accept.by) errors.push(`Self-acceptance ${step.id}`); }
  return {errors,counts:{gateways:gateways.length,groups:stakeholderGroups.length,cells:matrixCells.length,gatewaySteps:processSteps.length,uxSteps:uxSteps.length,totalSteps:allSteps.length}};
}

export function canTransition(step: ProcessStep, acceptedDocumentIds: Set<string>) {
  const currentInputs=step.inputIds.every((id)=>acceptedDocumentIds.has(id));
  const separated=!step.confirmation.accept.by||step.confirmation.accept.by!==step.confirmation.prepare.by;
  const accepted=step.confirmation.accept.decision==="Accepted"||step.confirmation.accept.decision==="Conditional";
  const criticalCondition=step.conditions.some((item)=>/legal|safety|accessibility|funding|authority/i.test(item));
  return {allowed:currentInputs&&separated&&accepted&&!criticalCondition,currentInputs,separated,accepted,criticalCondition};
}

export function downstreamStepsToReopen(sourceId: StepId) {
  const reopened=new Set<StepId>(); const queue=[sourceId];
  while(queue.length){ const current=queue.shift()!; const step=stepById[current]; for(const next of step?.nextStepIds??[]){ if(!reopened.has(next)){reopened.add(next);queue.push(next);} } }
  return [...reopened];
}

export function canCloseG7(steps=uxSteps, criticalUserIssues=0) {
  const uxComplete=steps.every((step)=>step.confirmation.prepare.by&&step.confirmation.review.by&&step.confirmation.accept.decision==="Accepted");
  return {allowed:Boolean(uxComplete&&criticalUserIssues===0),uxComplete,criticalUserIssues};
}

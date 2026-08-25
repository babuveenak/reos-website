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
  activities: string[];
  primaryOutput: string;
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
  { id:"G1", slug:"land-vision", name:"Land & Vision", question:"Is this the right opportunity to pursue?", purpose:"Secure the land opportunity and prove that the investment vision is viable before major commitments are made.", activities:["Land acquisition","Feasibility studies","Investment planning","Market analysis"], primaryOutput:"Opportunity identified", landmark:"Parcel, compass and option blocks", accent:"#B78A45",
    titles:["Confirm land opportunity and vision","Verify land title and acquisition route","Complete legal and ownership due diligence","Complete market analysis","Confirm site, access, utility and environmental constraints","Test development capacity and options","Complete feasibility studies","Build the investment plan and funding strategy","Validate cost, revenue, cash flow and sensitivities","Confirm risk and opportunity responses","Approve the opportunity and investment baseline"],
    inputs:["Sponsor objectives and success measures","Land and ownership information","Available surveys, controls and utility information","Market, customer and product assumptions","Funding, return and time constraints","Lessons from comparable projects"],
    outputs:["Opportunity identified","Approved feasibility and business case","Preferred option and scope boundary","Feasibility cost plan and funding profile","Initial master programme","Due-diligence, risk, opportunity and assumption registers","Initial authority and stakeholder maps","Next-stage execution plan"],
    exit:["Land, title and material legal constraints are understood","The preferred option is supported by traceable evidence","Cost, revenue, time and funding assumptions are explicit","Authority and site constraints are identified","Sensitivities expose viability limits","Top risks have owners and responses","Next-stage scope, budget, team and programme are authorized"],
    flags:["Unverified land rights","Hidden utility diversion","Optimistic demand assumptions","Missing access strategy","Unsupported authority assumptions","Excluded enabling works"] },
  { id:"G2", slug:"planning-design", name:"Planning & Design", question:"Is the proposed development coordinated, buildable and ready for authority submission?", purpose:"Turn the investment vision into an integrated master plan and consultant-coordinated design package.", activities:["Master planning","Architecture","Engineering","Consultant design coordination"], primaryOutput:"Approved design package", landmark:"Exploded coordinated building model", accent:"#C7A66A",
    titles:["Accept the opportunity and investment baseline","Confirm the master-planning brief","Appoint architects, engineers and specialist consultants","Develop the master plan","Develop the architectural concept","Develop structural and building-services engineering","Coordinate consultant designs and BIM interfaces","Test value, buildability, safety and operability","Verify specifications, schedules and calculations","Complete design-package quality assurance","Approve and freeze the coordinated design package"],
    inputs:["Approved project and user requirements","Authority conditions and codes","Surveys, investigations and utility information","Budget, programme, procurement and sustainability targets","Operator and maintainability requirements"],
    outputs:["Approved design package","Design brief and requirements traceability matrix","Coordinated design and drawing register","Calculations, reports, schedules and specifications","BIM and information delivery records","Design risk, interface, decision and change logs","Updated cost plan and programme"],
    exit:["Requirements trace into design","Disciplines and interfaces are coordinated","Clashes are within approved tolerances","Outputs are supported by verified technical information","Cost is within authorized limits","Buildability, safety, maintainability and accessibility reviews are closed","Authority and sustainability commitments are met","Residual risks and exclusions are explicit","The baseline is frozen under change control"],
    flags:["Unbuildable design","Unresolved clashes","Outdated cost scope","Hidden contractor design","Weak interface ownership","Missing operator input"] },
  { id:"G3", slug:"authorities-approvals", name:"Authorities & Approvals", question:"Have all applicable authorities granted permission to build?", purpose:"Coordinate Municipality, DDA, RERA, DLD, Civil Defense and utility requirements into a verified approval route.", activities:["Municipality","DDA","RERA","DLD","Civil Defense","Utility approvals"], primaryOutput:"Permission to build", landmark:"Civic checkpoint and permit lanes", accent:"#6F918D",
    titles:["Accept the approved design package","Verify jurisdiction and asset-specific authorities","Build the approval, NOC and permit matrix","Confirm Municipality or DDA requirements","Confirm RERA and DLD requirements","Confirm Civil Defense requirements","Confirm utility-approval requirements","Prepare and coordinate statutory submissions","Submit, track and close authority comments","Record approvals, conditions and expiry dates","Confirm permission to build"],
    inputs:["Approved design package","Verified site, land and jurisdiction data","Authority, utility-provider and specialist requirements","Programme dependencies and long-lead approvals"],
    outputs:["Permission to build","Authority and NOC matrix","Applicable-code and compliance register","Submission, response and approval repository","Conditions, commitments and expiry register","Authority-integrated programme"],
    exit:["The approving jurisdiction is verified","Municipality or DDA requirements are satisfied as applicable","RERA and DLD requirements are satisfied as applicable","Civil Defense and utility approvals are current","Major statutory constraints are resolved or controlled","The building permit and required NOCs are recorded","Internal decisions are not represented as authority approvals"],
    flags:["Generic authority checklist","Wrong approving jurisdiction","Expired NOCs","Unclosed comments","Permits disconnected from programme","Design changed after approval","Approval claim without source"] },
  { id:"G4", slug:"construction-delivery", name:"Construction & Delivery", question:"Has the physical asset been safely built, inspected and completed?", purpose:"Contract, mobilise and deliver the approved asset with verified progress, quality and commissioning evidence.", activities:["Main contractor","Subcontractors","Site execution","Quality inspections"], primaryOutput:"Physical asset completed", landmark:"Crane, approved model and inspection points", accent:"#8B6339",
    titles:["Accept approved design and permission to build","Confirm procurement and contract strategy","Prequalify the main contractor and key subcontractors","Issue and evaluate the controlled tender","Execute the main contract and verify insurances","Mobilise the site and logistics controls","Approve submittals, samples and method statements","Execute construction and coordinate subcontractors","Inspect quality, HSE, progress and conformance","Test and commission systems","Close critical defects and confirm physical completion","Accept the completed physical asset"],
    inputs:["Approved design package and building permit","Executed contract and baseline programme","Approved-for-construction information","Quality, HSE, inspection and method controls","Procurement, submittal and interface schedules"],
    outputs:["Physical asset completed","Verified completion status and quality dossier","Inspection, test and commissioning records","Approved changes and contract forecast","Authority inspection records","As-built and asset information","Defect register"],
    exit:["The main contract and subcontract responsibilities are controlled","Site execution matches approved information","Quality inspections prove conformance","Critical systems have accepted tests","Changes, claims and RFIs are reconciled","Statutory inspections are satisfied","Critical defects are closed","The physical asset is complete and ready for transfer"],
    flags:["Uncontrolled subcontract scope","Invoice-based progress","Concealed defects","Unapproved materials","Uncalibrated tests","Late commissioning","Incomplete asset data"] },
  { id:"G5", slug:"sales-transfer", name:"Sales & Transfer", question:"Are buyers properly onboarded and ownership transfers correctly registered?", purpose:"Market the property, contract with buyers and complete each transfer through the applicable DLD registration route.", activities:["Marketing","Brokers","Buyer onboarding","SPA","DLD registration"], primaryOutput:"Property ownership transferred", landmark:"Sales suite, signed agreement and title key", accent:"#C29B5B",
    titles:["Confirm project registration and sales readiness","Open and verify the regulated escrow account","Obtain advertising and marketing permits","Appoint and brief licensed brokers","Launch controlled marketing and listings","Qualify and onboard buyers","Issue reservations and buyer disclosures","Execute the sale and purchase agreement","Control buyer payments and escrow records","Complete DLD sale registration","Transfer and record property ownership"],
    inputs:["Registered development and approved sales plan","Regulatory approvals and advertising permits","Approved product, pricing and disclosure information","Escrow account and buyer-payment controls","Buyer identity and eligibility records"],
    outputs:["Property ownership transferred","Project and advertising registration records","Broker appointment and listing records","Buyer onboarding and disclosure pack","Executed sale and purchase agreement","Escrow payment records","DLD registration and title-transfer record"],
    exit:["The project and marketing activity are properly registered","Only licensed brokers act for the project","Buyer disclosures match the approved property and contract","The SPA is executed and controlled","Payments are recorded through the required escrow route","DLD registration protects the buyer's interest","Ownership transfer is evidenced on the official register"],
    flags:["Marketing before registration","Unlicensed broker activity","Deposits outside escrow","Marketing promises absent from the SPA","Incomplete buyer due diligence","Unregistered sale","Title transfer without required clearances"] },
  { id:"G6", slug:"living-operations", name:"Living & Operations", question:"Is the asset handed over, occupied and operating as intended?", purpose:"Move owners and tenants into a safe, serviced asset and establish facility and community operations.", activities:["Handover","Facility management","Community management","Tenant/Owner interactions"], primaryOutput:"Occupied and operational asset", landmark:"Completed community, residents, keys and service desk", accent:"#A97A45",
    titles:["Accept physical completion and transfer records","Verify completion and occupancy approvals","Complete owner and unit handover","Inspect units and record snagging","Close critical defects and activate the liability process","Connect and activate utilities","Mobilise facility management","Mobilise community management","Onboard residents and tenants","Confirm the occupied and operational asset"],
    inputs:["Construction completion-readiness pack","Commissioning scripts and results","Defect register","Draft as-built, O&M, warranty and asset information","Operator, customer and statutory requirements"],
    outputs:["Occupied and operational asset","Signed owner and unit handover records","Completion and occupancy certificates","Accepted as-built, O&M, asset and warranty repository","Utility activation records","Facility and community management mobilisation records","Resident and tenant onboarding records","Residual defect and service-request register"],
    exit:["Required authority clearances are valid","Life-safety, utilities and critical systems operate","Critical defects are closed","Deferred tests are controlled","Operator information and training are accepted","Asset and responsibility boundaries are recorded","Customer interfaces are managed","Contract decisions are not inferred from occupancy","The post-handover plan is active"],
    flags:["Keys treated as full acceptance","Missing authority certificate","Incomplete emergency training","Placeholder as-builts","Unassigned warranties","Inconsistent customer information"] },
  { id:"G7", slug:"asset-growth-intelligence", name:"Asset Growth & Intelligence", question:"How will the operating asset create and protect long-term value?", purpose:"Use portfolio management, leasing, resale, analytics and AI-supported insight to improve asset and investment performance.", activities:["Portfolio management","Investment performance","Resale","Leasing","Analytics","AI insights"], primaryOutput:"Long-term value creation", landmark:"Operating portfolio, analytics and growth curve", accent:"#B99255",
    titles:["Accept the operating asset baseline","Establish portfolio and asset-performance controls","Monitor income, cost, yield and investment performance","Run planned and reactive maintenance","Control warranties and supplier obligations","Manage leasing and tenancy registration","Plan and execute resale or ownership transfer","Complete valuation, refinancing and capital reviews","Apply portfolio analytics and benchmarking","Generate governed AI insights and recommended actions","Approve the long-term value-creation plan"],
    inputs:["Accepted handover pack and asset baseline","Defect, warranty and obligation registers","Target operational and customer outcomes","Contracts, service levels and performance criteria","Feedback and system data"],
    outputs:["Long-term value creation plan","Portfolio and investment-performance dashboard","Lease, resale and tenancy records","Maintenance, warranty and asset-information baseline","Valuation and refinancing evidence","Analytics and governed AI insight record","Benefits review and improvement actions"],
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
  activities: [...gateway.activities],
  primaryOutput: gateway.primaryOutput,
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
  GR01:["Confirm the land and investment mandate","Endorse the plan and design against investment intent","Support ownership evidence and authority conditions","Monitor delivery capital, risk and material variance","Confirm sale and transfer conditions affecting the investment","Review owner handover and operational outcomes","Review portfolio performance and long-term value creation"],
  GR02:["Lead land assessment, feasibility and investment planning","Own the master plan, brief and coordinated design baseline","Coordinate the authority strategy and close approval conditions","Govern procurement, construction, change and delivery reporting","Lead marketing, buyer onboarding, SPA and transfer controls","Coordinate handover and establish operating responsibilities","Drive portfolio strategy, analytics and improvement actions"],
  GR03:["Test site constraints, capacity and technical feasibility","Develop and coordinate the master plan, architecture and engineering","Prepare, coordinate and certify authority submissions","Review submittals, inspect quality and certify completed work","Provide accurate technical disclosure for sales and transfer","Verify handover information, defects and operational readiness","Analyse performance and identify technical optimisation opportunities"],
  GR04:["Confirm land-use, planning and regulatory constraints","Advise design compliance and submission requirements","Review submissions and issue statutory approvals, NOCs and permits","Inspect works and enforce approval conditions","Regulate project marketing, sale registration and ownership transfer","Issue completion or occupancy clearances and oversee ongoing compliance","Maintain property, tenancy and operational regulatory compliance"],
  GR05:["Confirm capacity, corridors and connection constraints","Review utility designs and interface requirements","Issue utility NOCs and technical approvals","Inspect utility interfaces and deliver connections","Confirm utility status and customer connection requirements","Activate and support occupied-asset services","Improve service performance, efficiency and future capacity"],
  GR06:["Advise buildability, logistics and delivery risk","Review design buildability, methods and construction interfaces","Provide permit, method and enabling-work inputs","Mobilise, build, inspect, test and report conformance","Provide completion evidence and resolve buyer-facing defects","Complete snagging, commissioning, handover and liability obligations","Deliver lifecycle repairs, upgrades and contractual closeout"],
  GR07:["Advise availability, lead times and supply risk","Support specifications, samples and product data","Provide certifications and product-approval evidence","Manufacture, deliver and support quality inspections","Provide product, warranty and specification disclosures","Transfer warranties, spares and product records to operations","Fulfil replacement, warranty and upgrade obligations"],
  GR08:["Test market demand, pricing and product fit","Share buyer feedback with planning and design teams","Verify advertising, listing and broker permission requirements","Communicate verified construction progress to the market","Lead compliant marketing, buyer onboarding and transaction support","Coordinate buyer communications and handover appointments","Support leasing, resale and market-performance intelligence"],
  GR09:["Assess financeability, funding structure and investment returns","Review cost, valuation and funding assumptions","Confirm regulatory, escrow and financial prerequisites","Control construction valuations and drawdowns","Operate mortgage, escrow, payment and transfer controls","Complete handover-related discharge and finance actions","Review yield, refinancing and portfolio-capital options"],
  GR10:["Represent buyer and investor-owner expectations","Validate usability, value and end-user design requirements","Receive verified regulatory and project disclosure","Track verified delivery progress and specification commitments","Complete SPA, payments, registration and ownership transfer","Inspect, accept and operate the handed-over property","Monitor investment performance, leasing and resale options"],
  GR11:["Inform intended use, access and amenity expectations","Validate accessibility, comfort and resident needs","Understand occupancy, safety and tenancy requirements","Receive disruption, progress and safety communications","Complete buyer or tenant onboarding requirements","Move in, use services and report resident experience issues","Inform service, leasing and community-performance improvements"],
  GR12:["Define whole-life operating and maintenance outcomes","Review maintainability, access and asset-information requirements","Identify operating permits and authority conditions","Prepare FM systems, community operations, assets and teams","Prepare handover, service and customer-support information","Operate the asset and community and manage owner or tenant interactions","Measure performance and return operational intelligence to the portfolio"],
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

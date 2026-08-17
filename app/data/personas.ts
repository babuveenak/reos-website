import type { ContentStatus } from "./reos";

/**
 * PERSONA ROUTES — "where do I fit?"
 *
 * Personas are entry points, not a second taxonomy. Every step maps to a
 * stage in journey.ts, so a persona flow is a filtered view of the canonical
 * journey rather than a parallel story that can drift away from it.
 *
 * "New to UAE property" is kept deliberately: for a global reader who does
 * not yet know which role they occupy, an orientation route is the entry,
 * and sending them straight to a role they have not chosen would be worse.
 */

export type PersonaStep = {
  title: string;
  detail: string;
  /** Canonical stage id from journey.ts */
  stageId: string;
};

export type Persona = {
  slug: string;
  /** Card label on the selector — first person, as the visitor would say it. */
  card: string;
  name: string;
  /** Subject of "<plural> see the whole journey." Never derive this from
   *  `name` — that yields "Orientations" and "Bank or Financiers". */
  plural: string;
  headline: string;
  promise: string;
  /** Who this is for, said plainly for a reader outside the UAE. */
  audience: string;
  steps: PersonaStep[];
  worksWith: string[];
  documents: string[];
  risks: string[];
  reosHelp: string;
  status: ContentStatus;
};

export const personas: Persona[] = [
  {
    slug: "buying",
    card: "I am buying a property",
    name: "Buyer",
    plural: "Buyers",
    headline: "Buying property in the UAE: know every step before you commit.",
    promise: "From first search to keys in hand — what to verify, what to sign, and what protects your money along the way.",
    audience: "Individuals and families buying a home or first investment property, whether resident in the UAE or buying from abroad.",
    steps: [
      { title: "Search and shortlist", detail: "Decide budget, location and whether you are buying a completed property or one still being built — the two routes have different risks and different evidence.", stageId: "marketing-sales" },
      { title: "Compare the two routes", detail: "Ready property exists and can be inspected. Off-plan is bought before completion, paid in instalments, and protected by different rules.", stageId: "marketing-sales" },
      { title: "Verify the developer and project", detail: "Check the project is registered with the regulator and that the seller or developer is licensed to sell it. This is a public check, and it is the single most useful thing you can do.", stageId: "registration-compliance" },
      { title: "Understand what you are buying", detail: "Unit, floor area, finish specification, completion date, payment plan and what happens if the project is delayed.", stageId: "marketing-sales" },
      { title: "Reserve and contract", detail: "A reservation is not the sale. The sale and purchase agreement sets the binding obligations — read the delay, cancellation and refund terms before signing.", stageId: "marketing-sales" },
      { title: "Arrange your funds", detail: "Confirm cash or mortgage before committing. A mortgage pre-approval has conditions and an expiry date; it is not a guarantee.", stageId: "finance-escrow" },
      { title: "Pay into escrow", detail: "For off-plan, your payments should go to the project's regulated escrow account, not to the developer directly. Keep every receipt.", stageId: "finance-escrow" },
      { title: "Register your purchase", detail: "Your purchase is recorded on the official register against your name and the specific unit. This is what protects your interest.", stageId: "registration-compliance" },
      { title: "Monitor construction", detail: "Track progress against the payment plan. Payments should follow construction, not run ahead of it.", stageId: "construction-delivery" },
      { title: "Inspect and take handover", detail: "Inspect before you accept. Record every defect in writing — the developer remains responsible for putting them right during the liability period.", stageId: "handover-snagging" },
      { title: "Move in", detail: "Connect utilities, register with the community, and understand the service charges you will pay each year.", stageId: "occupancy-community" },
      { title: "Live, lease or sell", detail: "Ownership continues. Understand your options for renting it out, and what a future sale will require.", stageId: "investment-resale" },
    ],
    worksWith: ["land-developer", "sales-brokerage", "escrow-financial", "authorities", "investors", "operations"],
    documents: ["Passport and identity evidence", "Proof of funds or mortgage pre-approval", "Reservation form", "Sale and purchase agreement", "Escrow payment receipts", "Registration record", "Handover and inspection pack"],
    risks: [
      "Paying a developer directly instead of into the project's escrow account",
      "Relying on a brochure rather than the contract for the completion date and specification",
      "Assuming a property purchase automatically grants residency — the two are related but assessed separately",
      "Budgeting only the purchase price, and not transfer fees, agency fees and annual service charges",
    ],
    reosHelp: "REOS shows the buyer journey as one connected sequence — what to verify at each step, which official channel confirms it, and what should already be in place before money moves.",
    status: "Validated",
  },
  {
    slug: "investing",
    card: "I am investing in property",
    name: "Investor",
    plural: "Investors",
    headline: "Invest with visibility across the property lifecycle.",
    promise: "See where capital enters, what controls protect it, which risks concentrate where, and how an exit actually works.",
    audience: "Private investors, family offices and institutional capital allocating to UAE property or development projects.",
    steps: [
      { title: "Market research", detail: "Understand supply, absorption and pricing in the specific submarket — averages across an emirate hide what matters.", stageId: "planning-feasibility" },
      { title: "Select the asset or project", detail: "Completed income-producing asset, off-plan unit, or equity into a development — each has a different risk profile and a different exit.", stageId: "land-ownership" },
      { title: "Review the developer", detail: "Delivery record, current pipeline, escrow discipline and whether previous projects completed on the terms originally sold.", stageId: "project-formation" },
      { title: "Test feasibility", detail: "Independent view of cost, programme and revenue rather than the promoter's model. Stress the downside case.", stageId: "planning-feasibility" },
      { title: "Legal and structural review", detail: "Ownership structure, your rights within it, security, and what happens if the project stalls or a partner exits.", stageId: "project-formation" },
      { title: "Arrange financing", detail: "Understand the capital stack — who ranks ahead of you, on what security, and what triggers their rights.", stageId: "finance-escrow" },
      { title: "Commit capital", detail: "Complete purchase or investment, with funds flowing through the controlled account the structure requires.", stageId: "finance-escrow" },
      { title: "Track progress", detail: "Monitor construction against the payment schedule and the escrow position. Divergence between the two is the earliest warning signal available.", stageId: "construction-delivery" },
      { title: "Completion and handover", detail: "Confirm completion approval, registration and transfer are genuinely done, not merely announced.", stageId: "handover-snagging" },
      { title: "Lease and yield", detail: "Move from capital value to income: rent achieved, service charges, vacancy and the real net yield.", stageId: "investment-resale" },
      { title: "Exit or reinvest", detail: "Clear encumbrances, transfer title, and plan the next allocation or succession.", stageId: "investment-resale" },
    ],
    worksWith: ["investors", "land-developer", "escrow-financial", "legal-assurance", "enablers", "authorities"],
    documents: ["Investment or subscription agreement", "Feasibility and valuation reports", "Escrow and payment records", "Progress certificates", "Title and registration evidence", "Lease and income records"],
    risks: [
      "Judging a developer on marketing rather than on completed delivery",
      "Yield quoted gross, before service charges, agency fees and vacancy",
      "Cross-emirate portfolios where each asset sits under different rules and no shared view exists",
      "Exit assumed liquid in a market where transfer depends on clearances that take time",
    ],
    reosHelp: "REOS connects the investment case to the delivery reality — which approvals exist, how escrow is performing, and which dependencies sit between today and completion.",
    status: "Validated",
  },
  {
    slug: "developing",
    card: "I am developing a project",
    name: "Developer",
    plural: "Developers",
    headline: "From land to handover: coordinate the full development journey.",
    promise: "Every approval, appointment, dependency and handoff between buying a plot and handing over the last unit.",
    audience: "Developers, master developers, landowners building for themselves, and development managers acting for owners.",
    steps: [
      { title: "Secure the land", detail: "Confirm title, permitted use, eligibility and any master-community obligations before committing.", stageId: "land-ownership" },
      { title: "Form the entity", detail: "Establish the project vehicle and obtain the licences and developer registration the activity requires.", stageId: "project-formation" },
      { title: "Prove feasibility", detail: "Test the scheme against development controls, cost, programme and market before design spend accelerates.", stageId: "planning-feasibility" },
      { title: "Appoint consultants", detail: "Engage licensed designers and the consultant of record who will sign submissions and carry design liability.", stageId: "design-approvals" },
      { title: "Obtain approvals", detail: "Resolve which authority governs the plot, then work through planning, building, safety and infrastructure approvals to the building permit.", stageId: "design-approvals" },
      { title: "Register and open escrow", detail: "Register the project with the regulator and open the escrow account before any unit is offered for sale.", stageId: "finance-escrow" },
      { title: "Arrange finance", detail: "Put construction finance in place and agree how drawdowns are evidenced against verified progress.", stageId: "finance-escrow" },
      { title: "Procure and build", detail: "Tender, award, insure, mobilise and construct — with inspection and certification agreed before work starts.", stageId: "construction-delivery" },
      { title: "Sell during construction", detail: "Obtain advertising permits, appoint licensed brokers and sell — this runs alongside construction, not after it.", stageId: "marketing-sales" },
      { title: "Register every sale", detail: "Record each off-plan sale officially and keep the register reconciled with your own records.", stageId: "registration-compliance" },
      { title: "Complete and hand over", detail: "Obtain completion approval, notify buyers, complete transfers and manage snagging through the liability period.", stageId: "handover-snagging" },
      { title: "Transition to operations", detail: "Establish the owners' association, set service charges and hand the building to those who will run it.", stageId: "occupancy-community" },
    ],
    worksWith: ["land-developer", "authorities", "consultants", "contractors", "escrow-financial", "sales-brokerage", "investors", "operations"],
    documents: ["Title and planning information", "Licences and developer registration", "Approved drawings and building permit", "Project registration and escrow agreement", "Main contract and insurances", "Advertising permits", "Completion certificate and handover records"],
    risks: [
      "Design frozen before the governing authority for the plot was confirmed",
      "Selling or advertising before project registration and escrow are in place",
      "Payment plan collecting ahead of construction, creating exposure if the programme slips",
      "Handover promised on a date that assumes approvals arrive without float",
    ],
    reosHelp: "REOS maps the approvals, appointments, documents and dependencies across the project so prerequisites surface before they block, and handoffs between parties stay traceable.",
    status: "Validated",
  },
  {
    slug: "financing",
    card: "I am financing property",
    name: "Bank or Financier",
    plural: "Banks and financiers",
    headline: "Connect finance, escrow, payments and project progress.",
    promise: "Where money enters, what controls it, how progress is verified, and what evidence supports each release.",
    audience: "Project finance lenders, mortgage providers, Islamic finance institutions, escrow trustee banks and financial operations teams.",
    steps: [
      { title: "Due diligence", detail: "Assess the borrower, the structure, the land, the approvals obtained and the approvals still outstanding.", stageId: "project-formation" },
      { title: "Assess the counterparty", detail: "Developer delivery record for project finance; income, liabilities and eligibility for buyer mortgages.", stageId: "planning-feasibility" },
      { title: "Establish escrow", detail: "Open and operate the regulated project account, with release conditions defined before the first buyer payment.", stageId: "finance-escrow" },
      { title: "Set payment milestones", detail: "Tie buyer instalments and facility drawdowns to construction milestones that can actually be evidenced.", stageId: "finance-escrow" },
      { title: "Manage collections", detail: "Receive buyer payments into escrow, reconcile against the sales register and flag arrears early.", stageId: "marketing-sales" },
      { title: "Validate progress", detail: "Verify claimed progress independently before releasing funds — usually through a quantity surveyor or engineer's certificate.", stageId: "construction-delivery" },
      { title: "Provide buyer finance", detail: "Underwrite mortgages, obtain valuation, and coordinate disbursement with registration and transfer timing.", stageId: "handover-snagging" },
      { title: "Reconcile", detail: "Match collections, releases, construction progress and the official register — divergence between them is the risk signal.", stageId: "registration-compliance" },
      { title: "Completion and discharge", detail: "Confirm completion, release retained funds, discharge security and close the facility.", stageId: "handover-snagging" },
    ],
    worksWith: ["escrow-financial", "investors", "land-developer", "authorities", "consultants", "legal-assurance"],
    documents: ["Facility and security agreements", "Escrow account agreement and release conditions", "Progress and valuation certificates", "Sales register reconciliation", "Regulatory reporting", "Discharge and clearance records"],
    risks: [
      "Releasing against claimed rather than independently verified progress",
      "Collections and the official sales register drifting apart unnoticed",
      "Mortgage timing that does not align with registration and transfer",
      "Escrow release conditions agreed loosely and interpreted differently under pressure",
    ],
    reosHelp: "REOS presents lifecycle context — approvals obtained, progress evidenced, registration status — alongside the financial position, without becoming a bank or holding client money.",
    status: "Validated",
  },
  {
    slug: "building",
    card: "I am building or supplying",
    name: "Contractor or Supplier",
    plural: "Contractors and suppliers",
    headline: "Understand where delivery partners fit in the property journey.",
    promise: "What must exist before you mobilise, what you must evidence during construction, and what completion actually requires.",
    audience: "Main contractors, subcontractors, specialist trades, suppliers, manufacturers and equipment providers.",
    steps: [
      { title: "Qualify and tender", detail: "Confirm your classification permits work of this scale, then price against the approved drawings and the real programme.", stageId: "construction-delivery" },
      { title: "Contract and insure", detail: "Agree scope, programme, payment terms and liability — and put contractor's all-risks and third-party cover in place before site access.", stageId: "construction-delivery" },
      { title: "Mobilise", detail: "Site setup, safety systems, permits to work, and confirmation that the building permit and approved drawings are current.", stageId: "construction-delivery" },
      { title: "Procure", detail: "Order long-lead materials and equipment against approved specification, allowing for approval of substitutions.", stageId: "construction-delivery" },
      { title: "Build and report", detail: "Construct to the approved design, and evidence progress in the form the consultant and the bank will accept.", stageId: "construction-delivery" },
      { title: "Manage variations", detail: "Record instructed changes and their programme and cost effect as they happen, not at the end.", stageId: "construction-delivery" },
      { title: "Inspect and test", detail: "Meet the inspection regime for the plot's authority — recorded, dated and signed by whoever is entitled to sign.", stageId: "construction-delivery" },
      { title: "Complete", detail: "Close out works, testing and documentation to the standard completion approval requires.", stageId: "handover-snagging" },
      { title: "Support handover", detail: "Provide warranties, manuals and as-built records, and rectify defects through the liability period.", stageId: "handover-snagging" },
    ],
    worksWith: ["contractors", "consultants", "land-developer", "authorities", "escrow-financial"],
    documents: ["Classification and licence evidence", "Main contract or subcontract", "Insurance certificates", "Method statements and permits to work", "Progress valuations", "Variation records", "Inspection, test and as-built records"],
    risks: [
      "Mobilising against drawings that have since been superseded",
      "Variations instructed verbally and disputed at final account",
      "Payment delayed because progress evidence does not match what the certifier requires",
      "Completion held up by documentation rather than by physical work",
    ],
    reosHelp: "REOS connects delivery evidence to the wider project state — which approval it supports, which payment it unlocks, and who is waiting on it.",
    status: "Validated",
  },
  {
    slug: "professional-services",
    card: "I provide professional services",
    name: "Consultant or Advisor",
    plural: "Consultants and advisors",
    headline: "See where your work sits in the wider property journey.",
    promise: "Your appointment, your submissions, your liability, and the parties whose work depends on yours.",
    audience: "Architects, engineers, project and cost consultants, surveyors, lawyers, valuers, insurers and specialist advisors.",
    steps: [
      { title: "Appointment", detail: "Agree scope, deliverables, liability and fee — and confirm which of your outputs carry statutory responsibility.", stageId: "design-approvals" },
      { title: "Establish the brief", detail: "Development controls, client requirements, master-community rules and the constraints of the plot itself.", stageId: "planning-feasibility" },
      { title: "Design and coordinate", detail: "Produce and coordinate your discipline against the others — clashes resolved on paper cost a fraction of clashes resolved on site.", stageId: "design-approvals" },
      { title: "Submit for approval", detail: "Submit through the correct authority for that plot, and manage comments to a decision.", stageId: "design-approvals" },
      { title: "Obtain clearances", detail: "Secure the no-objection certificates that utility, transport and safety bodies require.", stageId: "design-approvals" },
      { title: "Support procurement", detail: "Tender documentation, technical evaluation and advice on award.", stageId: "construction-delivery" },
      { title: "Supervise construction", detail: "Review submittals, inspect, instruct, and certify progress and quality.", stageId: "construction-delivery" },
      { title: "Certify completion", detail: "Produce the evidence completion approval requires, and coordinate final inspection.", stageId: "handover-snagging" },
      { title: "Close out", detail: "As-built records, warranties and support through the defects liability period.", stageId: "handover-snagging" },
    ],
    worksWith: ["consultants", "authorities", "land-developer", "contractors", "legal-assurance", "enablers"],
    documents: ["Appointment and scope of services", "Professional indemnity insurance", "Drawings, specifications and reports", "Authority submissions and comment responses", "Inspection and certification records"],
    risks: [
      "Scope gaps between consultants that nobody owns until an approval is refused",
      "Designing to a standard the governing authority for this plot does not apply",
      "Certifying on information you have not independently verified",
      "Liability that survives long after the fee has been paid",
    ],
    reosHelp: "REOS links professional outputs to the lifecycle — which approval a submission serves, which party is waiting on it, and what becomes possible once it is issued.",
    status: "Validated",
  },
  {
    slug: "managing",
    card: "I manage property",
    name: "Property or Facility Manager",
    plural: "Property and facility managers",
    headline: "The property journey continues after handover.",
    promise: "Taking the building on, running it well, funding it correctly and keeping the record intact for whoever comes next.",
    audience: "Property managers, facility managers, community managers, owners' association managers and asset managers.",
    steps: [
      { title: "Take handover", detail: "Receive the building with as-built records, warranties, asset register and outstanding defects clearly listed.", stageId: "handover-snagging" },
      { title: "Close out snagging", detail: "Track defects through the liability period and hold the developer to rectification while the obligation still exists.", stageId: "handover-snagging" },
      { title: "Onboard occupants", detail: "Register residents, issue access, set the rules and establish how faults get reported.", stageId: "occupancy-community" },
      { title: "Establish the community", detail: "Constitute the owners' association, set the budget and start collecting service charges.", stageId: "occupancy-community" },
      { title: "Run maintenance", detail: "Planned maintenance on the asset register, reactive response on service requests, both evidenced.", stageId: "property-management" },
      { title: "Fund the future", detail: "Build the reserve fund against a real condition-based replacement schedule, not a flat percentage.", stageId: "property-management" },
      { title: "Stay compliant", detail: "Insurance, fire and life-safety certification, lift and equipment inspections — current, not lapsed.", stageId: "property-management" },
      { title: "Support leasing", detail: "Enable tenancy registration, move-ins and move-outs without losing condition evidence.", stageId: "investment-resale" },
      { title: "Report and renew", detail: "Report performance to owners, and hand over cleanly if the management contract changes.", stageId: "investment-resale" },
    ],
    worksWith: ["operations", "customers", "utilities", "legal-assurance", "land-developer"],
    documents: ["Handover pack and asset register", "Defects and rectification log", "Service charge budget and reserve fund study", "Insurance and safety certificates", "Maintenance and service records", "Owner reporting pack"],
    risks: [
      "Taking handover without as-built records, warranties or an asset register",
      "Defects liability expiring before the building's real faults have surfaced",
      "Service charges set to be popular rather than to cover the cost of running the building",
      "Records held by the outgoing agent and lost at contract change",
    ],
    reosHelp: "REOS carries the property's record forward past handover, so the people running the building inherit its history instead of rebuilding it.",
    status: "Validated",
  },
  {
    slug: "new-to-uae",
    card: "I am new to UAE property",
    name: "Orientation",
    plural: "Newcomers to the UAE",
    headline: "New to UAE property? Start here.",
    promise: "How the market is structured, what the common terms mean, and which route applies to you — before you choose a role.",
    audience: "Anyone approaching UAE real estate for the first time, including international buyers, investors and businesses entering the market.",
    steps: [
      { title: "Understand the emirates", detail: "The UAE is seven emirates, each with its own property laws, registers and authorities. Rules that apply in Dubai do not automatically apply in Abu Dhabi or Sharjah.", stageId: "land-ownership" },
      { title: "Understand where you may own", detail: "Ownership rights depend on nationality and on the specific area. Some areas permit full foreign ownership; others do not. This is checked per location, never assumed.", stageId: "land-ownership" },
      { title: "Learn the two buying routes", detail: "Ready property is complete and can be inspected. Off-plan is bought before completion, paid in stages, and governed by additional protections including mandatory escrow.", stageId: "marketing-sales" },
      { title: "Learn what escrow means here", detail: "For off-plan sales, developers must hold buyer money in a regulated account tied to that one project, released against verified construction progress.", stageId: "finance-escrow" },
      { title: "Understand registration", detail: "Property interests are recorded on an official register maintained by each emirate. Registration is what makes your interest enforceable.", stageId: "registration-compliance" },
      { title: "Understand the ongoing costs", detail: "Beyond the price: transfer fees, agency fees, mortgage costs, annual service charges and, in many communities, cooling charges.", stageId: "occupancy-community" },
      { title: "Separate property from residency", detail: "Property ownership and residency are related but assessed separately, by different authorities, against criteria that change. Never treat a purchase as an automatic visa.", stageId: "investment-resale" },
      { title: "Choose your route", detail: "Once the landscape makes sense, move into the journey that matches what you are actually doing.", stageId: "land-ownership" },
    ],
    worksWith: ["authorities", "customers", "sales-brokerage", "legal-assurance", "enablers"],
    documents: ["Passport and identity evidence", "Proof of funds", "Records of any professional advice taken"],
    risks: [
      "Applying advice about one emirate to a property in another",
      "Treating a property purchase as an automatic route to residency",
      "Acting on marketing material rather than the official register",
      "Budgeting the headline price without the recurring costs of ownership",
    ],
    reosHelp: "REOS explains the landscape in plain language first, then routes you into the specific journey that matches what you are trying to do.",
    status: "Validated",
  },
];

export const personaBySlug = Object.fromEntries(personas.map((p) => [p.slug, p]));

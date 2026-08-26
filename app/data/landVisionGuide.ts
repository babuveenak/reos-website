export type GuideSource = {
  label: string;
  href: string;
  jurisdiction: string;
};

export type LandVisionGuideStep = {
  id: string;
  shortTitle: string;
  title: string;
  objective: string;
  actors: string[];
  checks: string[];
  inputs: string[];
  output: string;
  redFlags: string[];
  nextAction: string;
  sources: GuideSource[];
};

const UAE_OWNERSHIP: GuideSource = {
  label: "UAE Government — expatriate property ownership",
  href: "https://u.ae/en/information-and-services/moving-to-the-uae/expatriates-buying-a-property-in-the-uae",
  jurisdiction: "United Arab Emirates",
};

const DLD_SALE_REGISTRATION: GuideSource = {
  label: "Dubai Land Department — property sale registration",
  href: "https://dubailand.gov.ae/en/eservices/property-sale-registration/",
  jurisdiction: "Dubai",
};

const DLD_PROPERTY_STATUS: GuideSource = {
  label: "Dubai Land Department — property status enquiry",
  href: "https://dubailand.gov.ae/en/eservices/property-status-overview/property-status/",
  jurisdiction: "Dubai",
};

const DLD_FAQ: GuideSource = {
  label: "Dubai Land Department — frequently asked questions",
  href: "https://dubailand.gov.ae/en/frequently-asked-questions",
  jurisdiction: "Dubai",
};

const ADREC_OWNERSHIP: GuideSource = {
  label: "ADREC — property ownership framework",
  href: "https://adrec.gov.ae/en/rules_and_regulations/property-ownership",
  jurisdiction: "Abu Dhabi",
};

const ADREC_DEVELOPER_JOURNEY: GuideSource = {
  label: "ADREC — developer journey",
  href: "https://adrec.gov.ae/en/sectors/regulatory-services/project-development/developer-journey",
  jurisdiction: "Abu Dhabi",
};

export const landVisionGuideSteps: LandVisionGuideStep[] = [
  {
    id: "define-opportunity",
    shortTitle: "Define the opportunity",
    title: "Define what the land is expected to become",
    objective: "Create a clear opportunity brief before a location, price or design starts driving the decision.",
    actors: ["Landowners & Investors", "Developers", "Development advisers"],
    checks: [
      "Intended use, scale, customer and investment horizon",
      "Whether the route is land acquisition, a development partnership or development of land already owned",
      "Commercial objectives, non-negotiable constraints and decision authority",
    ],
    inputs: ["Opportunity brief", "Investor or developer mandate", "Initial location criteria"],
    output: "A documented opportunity definition that can be tested against real land and jurisdiction constraints.",
    redFlags: ["A site is selected before the intended use is clear", "Different sponsors are working to different return or exit assumptions"],
    nextAction: "Agree who can change the brief and who can approve expenditure before screening land.",
    sources: [],
  },
  {
    id: "select-jurisdiction",
    shortTitle: "Select the jurisdiction",
    title: "Identify which jurisdiction controls the route",
    objective: "Resolve the emirate, municipality, development zone, free zone or investment area before relying on a process or requirement.",
    actors: ["Developer", "Legal adviser", "Planning consultant", "Relevant authority"],
    checks: [
      "Emirate and land-registration authority",
      "Municipal, development-zone, free-zone or master-community controls",
      "Whether the location is inside an area with specific ownership or development rules",
    ],
    inputs: ["Plot or location information", "Proposed acquiring person or entity", "Intended development use"],
    output: "A jurisdiction map naming the bodies whose current requirements must be confirmed.",
    redFlags: ["A neighbouring plot's rules are assumed to apply", "Emirate-level guidance is treated as plot-specific approval"],
    nextAction: "Record the applicable authority and official information source for every location under consideration.",
    sources: [UAE_OWNERSHIP, ADREC_OWNERSHIP],
  },
  {
    id: "confirm-eligibility",
    shortTitle: "Confirm eligibility",
    title: "Confirm who may acquire which rights",
    objective: "Check the proposed buyer, ownership structure and available land right for the exact location before making a commitment.",
    actors: ["Buyer or landowner", "Legal adviser", "Land-registration authority", "Financier"],
    checks: [
      "Nationality, legal-person status and entity documentation",
      "Freehold, leasehold, usufruct, musataha or another available right",
      "Ownership-area, investment-area or other location restrictions",
      "Whether a company or project vehicle must be registered before the transaction",
    ],
    inputs: ["Identity or corporate documents", "Ownership structure", "Plot and jurisdiction details"],
    output: "A documented acquisition route that is eligible for the proposed buyer and location, subject to authority confirmation.",
    redFlags: ["Eligibility is inferred from marketing material", "The ownership vehicle is chosen before legal and financing review"],
    nextAction: "Obtain qualified advice and confirm the proposed right and registration route with the relevant authority.",
    sources: [UAE_OWNERSHIP, ADREC_OWNERSHIP, DLD_SALE_REGISTRATION],
  },
  {
    id: "shortlist-land",
    shortTitle: "Shortlist land",
    title: "Screen opportunities before detailed diligence",
    objective: "Create a traceable shortlist using the opportunity brief rather than progressing the first available plot.",
    actors: ["Landowner or seller", "Developer", "Authorized broker or representative", "Market adviser"],
    checks: [
      "Seller or representative identity and authority to engage",
      "Plot identity, location, size, access and asking terms",
      "High-level fit with intended use, budget and programme",
      "Source and date of every material claim",
    ],
    inputs: ["Opportunity brief", "Plot references", "Market and location evidence"],
    output: "A small, evidence-linked shortlist with clear reasons to proceed, hold or reject each opportunity.",
    redFlags: ["Unverified listings are treated as land records", "Pressure to reserve land before basic identity and plot checks"],
    nextAction: "Do not treat REOS or a marketplace as the official record; move shortlisted plots into formal verification.",
    sources: [DLD_PROPERTY_STATUS],
  },
  {
    id: "verify-title-rights",
    shortTitle: "Verify title & rights",
    title: "Verify the plot, registered interests and transaction authority",
    objective: "Establish what is registered, who can transact and which interests or restrictions may affect acquisition or development.",
    actors: ["Land-registration authority", "Seller or landowner", "Buyer", "Legal adviser", "Financier"],
    checks: [
      "Registered owner and exact plot identity",
      "Title or registered land right",
      "Mortgages, restrictions, easements, leases and other interests",
      "Seller authority, powers of attorney and required consents",
      "Access, boundaries and consistency between title, map and survey information",
    ],
    inputs: ["Official title or ownership evidence", "Official map or plot record", "Seller authority documents", "Survey information"],
    output: "A dated title-and-rights review with unresolved matters clearly assigned for resolution.",
    redFlags: ["Names or plot references do not match", "A copy is accepted without current official verification", "Access or encumbrances are not addressed"],
    nextAction: "Resolve every mismatch or registered interest before relying on price negotiations or feasibility conclusions.",
    sources: [DLD_PROPERTY_STATUS, DLD_FAQ, ADREC_OWNERSHIP],
  },
  {
    id: "confirm-development-potential",
    shortTitle: "Test development potential",
    title: "Test what the plot may realistically support",
    objective: "Compare the development idea with planning, site, access, utility, environmental and master-community constraints.",
    actors: ["Planning consultant", "Architect and engineers", "Developer", "Utility providers", "Relevant planning authority"],
    checks: [
      "Permitted use and applicable development controls",
      "Density, height, setbacks, parking and access assumptions",
      "Existing and required utility capacity",
      "Site, survey, geotechnical and environmental constraints",
      "Master-community or private development controls",
    ],
    inputs: ["Plot and survey information", "Applicable planning controls", "Concept test fit", "Utility and access information"],
    output: "A constraints-and-capacity record showing the concept range worth testing in feasibility.",
    redFlags: ["Permitted use is assumed from surrounding buildings", "Utility or access capacity is treated as a later design issue"],
    nextAction: "Ask the relevant authority and qualified consultants to validate the controls used in the test fit.",
    sources: [ADREC_DEVELOPER_JOURNEY],
  },
  {
    id: "complete-feasibility",
    shortTitle: "Complete feasibility",
    title: "Test whether the opportunity works as a development",
    objective: "Bring market, design capacity, cost, programme, revenue, funding and risk assumptions into one reviewable case.",
    actors: ["Developer", "Development manager", "Consultants", "Valuer or market adviser", "Financier", "Investor"],
    checks: [
      "Market demand, pricing, absorption or leasing assumptions",
      "Development yield and buildable-area assumptions",
      "Land, construction, professional, authority, finance and contingency costs",
      "Programme, approval dependencies and sales or leasing timing",
      "Base, downside and sensitivity cases",
    ],
    inputs: ["Market study", "Test fit", "Cost plan", "Development programme", "Financial model", "Risk register"],
    output: "A feasibility case whose assumptions, evidence dates and sensitivities can be challenged.",
    redFlags: ["Only the promoter's upside case is modelled", "Approval, utility or finance dependencies are missing from the programme"],
    nextAction: "Reconcile the model, cost plan and programme so that each uses the same scope and development assumptions.",
    sources: [ADREC_DEVELOPER_JOURNEY],
  },
  {
    id: "structure-investment",
    shortTitle: "Structure the investment",
    title: "Align ownership, funding and decision rights",
    objective: "Choose a structure that reflects acquisition eligibility, financing, development obligations, risk allocation and the intended exit.",
    actors: ["Landowner", "Developer", "Development investor", "Legal and tax advisers", "Financier"],
    checks: [
      "Acquiring and development entities",
      "Equity, debt, security and funding conditions",
      "Land contribution, joint-venture or development-agreement terms where relevant",
      "Decision rights, reserved matters, defaults and exit arrangements",
      "Registration or licensing dependencies",
    ],
    inputs: ["Feasibility case", "Proposed term sheet", "Corporate documents", "Funding strategy", "Risk allocation"],
    output: "An agreed structure and funding strategy ready for legal documentation and approval.",
    redFlags: ["The structure conflicts with ownership eligibility", "Funding conditions cannot be satisfied by the planned acquisition sequence"],
    nextAction: "Test the proposed structure with qualified advisers, the financier and the relevant registration route before signing.",
    sources: [DLD_SALE_REGISTRATION, ADREC_OWNERSHIP],
  },
  {
    id: "approve-opportunity",
    shortTitle: "Approve the opportunity",
    title: "Make an evidence-backed proceed, hold or stop decision",
    objective: "Turn diligence and feasibility into an explicit decision with conditions, owners and expiry dates.",
    actors: ["Investment committee or authorized decision-maker", "Developer", "Investor", "Financier", "Advisers"],
    checks: [
      "Whether the opportunity still matches the original mandate",
      "Material assumptions, unresolved risks and required mitigations",
      "Conditions that must be satisfied before contract, payment or registration",
      "Decision authority and any independent review requirements",
    ],
    inputs: ["Diligence reports", "Feasibility case", "Risk register", "Funding terms", "Proposed transaction terms"],
    output: "A recorded proceed, conditional proceed, hold or stop decision with named owners for every condition.",
    redFlags: ["Approval is inferred from meeting notes", "Material conditions have no owner or deadline"],
    nextAction: "Do not describe an internal decision as government approval or confirmation of legal eligibility.",
    sources: [],
  },
  {
    id: "contract-register-baseline",
    shortTitle: "Contract, register & baseline",
    title: "Complete the authorized transaction and establish the next-stage baseline",
    objective: "Satisfy transaction conditions, use the relevant official registration route and preserve the evidence needed for Planning & Design.",
    actors: ["Buyer and seller", "Authorized representatives", "Registration authority or trustee", "Legal adviser", "Financier", "Developer"],
    checks: [
      "Contract conditions, consents and payment arrangements",
      "Current authority procedure, channel and required documents",
      "Registration output and updated ownership evidence",
      "Handover of plot, survey, diligence, feasibility and decision records",
      "Unresolved constraints carried into Planning & Design",
    ],
    inputs: ["Executed transaction documents", "Identity and corporate documents", "Required consents", "Official registration application", "Stage evidence pack"],
    output: "Registered rights and an evidence-backed opportunity baseline ready to brief Planning & Design, subject to the applicable official process.",
    redFlags: ["Payment or possession is treated as registration", "The design team receives conclusions without the evidence or unresolved constraints behind them"],
    nextAction: "Confirm the official registration output, then issue one controlled baseline to the Planning & Design team.",
    sources: [DLD_SALE_REGISTRATION, DLD_FAQ, ADREC_OWNERSHIP],
  },
];

export const landVisionGuideReviewedOn = "26 August 2026";

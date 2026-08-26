import { groups } from "./ecosystem";
import { participationForStakeholder } from "./stakeholderParticipation";

export type EvidenceStatus = "verified" | "conditional" | "unverified";
export type EmirateId = "dubai" | "abu-dhabi" | "sharjah" | "ajman" | "umm-al-quwain" | "ras-al-khaimah" | "fujairah";
export type DubaiTrack = "track-neutral" | "dm-mainland" | "dda-tecom" | "trakhees-pcfc" | "financial-free-zone";

export type Provenance = {
  status: EvidenceStatus;
  source: string;
  sourceUrl?: string;
  checkedOn: string;
  note?: string;
};

export type SourcedFact = {
  label: string;
  value: string;
  appliesTo?: string;
  provenance: Provenance;
};

export type BlueprintStep = {
  id: string;
  number: number;
  title: string;
  actor: string;
  trigger: string;
  authority: string;
  portal: string;
  whatHappens: string[];
  documentsIn: string[];
  outputs: string[];
  fees: SourcedFact[];
  duration: SourcedFact[];
  failureModes: string[];
  unlocks: string;
  appliesTo: string;
  tracks: DubaiTrack[];
  provenance: Provenance;
};

export type ParticipationState = {
  stageId: string;
  state: "lead" | "participant" | "informed";
  relationshipLevel: "lead" | "active" | "supporting" | "informed";
  summary: string;
  evidence: EvidenceStatus;
};

export type JurisdictionCoverage = {
  emirate: EmirateId;
  label: string;
  state: "reference" | "structured-overview" | "not-yet-mapped";
  missing: string[];
};

export type StakeholderBlueprintProfile = {
  stakeholderId: string;
  overview: string;
  audience: string;
  firstDecision: string;
  coverage: JurisdictionCoverage[];
  participation: ParticipationState[];
  steps: BlueprintStep[];
};

const checkedOn = "2026-08-26";
const unverified = (note: string): Provenance => ({ status: "unverified", source: "REOS research register", checkedOn, note });
const official = (source: string, sourceUrl: string, note?: string): Provenance => ({ status: "verified", source, sourceUrl, checkedOn, note });
const conditional = (source: string, sourceUrl: string, note: string): Provenance => ({ status: "conditional", source, sourceUrl, checkedOn, note });

export const EMIRATES: { id: EmirateId; label: string; ar: string }[] = [
  { id: "dubai", label: "Dubai", ar: "دبي" },
  { id: "abu-dhabi", label: "Abu Dhabi", ar: "أبوظبي" },
  { id: "sharjah", label: "Sharjah", ar: "الشارقة" },
  { id: "ajman", label: "Ajman", ar: "عجمان" },
  { id: "umm-al-quwain", label: "Umm Al Quwain", ar: "أم القيوين" },
  { id: "ras-al-khaimah", label: "Ras Al Khaimah", ar: "رأس الخيمة" },
  { id: "fujairah", label: "Fujairah", ar: "الفجيرة" },
];

export const DUBAI_TRACKS: { id: DubaiTrack; label: string; note: string }[] = [
  { id: "track-neutral", label: "Registry-neutral", note: "DLD registry checks and transaction routes that apply before the plot-specific planning branch is confirmed." },
  { id: "dm-mainland", label: "Dubai Municipality", note: "Plots whose planning and site-plan route is administered by Dubai Municipality." },
  { id: "dda-tecom", label: "DDA / TECOM", note: "TECOM business-district plots under Dubai Development Authority planning jurisdiction." },
  { id: "trakhees-pcfc", label: "Trakhees / PCFC", note: "Listed PCFC and Dubai World special-development zones; plot-level applicability must be confirmed." },
  { id: "financial-free-zone", label: "DIFC property", note: "Property physically located in DIFC and administered by the DIFC Registrar of Real Property." },
];

const DLD_SALE = "https://dubailand.gov.ae/en/eservices/property-sale-registration/";
const DLD_STATUS = "https://dubailand.gov.ae/en/eservices/property-status-overview/";
const DLD_REPORT = "https://dubailand.gov.ae/en/eservices/request-detailed-property-report/";
const DLD_COMPANY = "https://dubailand.gov.ae/en/eservices/request-to-register-companies/";
const DLD_OQOOD = "https://dubailand.gov.ae/en/eservices/request-to-register-the-initial-sale/";
const DLD_MORTGAGE = "https://backoffice.dubailand.gov.ae/en/eservices/request-for-mortgage-registration/";
const DLD_EJARI = "https://dubailand.gov.ae/en/eservices/register-renew-ejari-contract/";
const DLD_GIFT = "https://dubailand.gov.ae/en/eservices/property-gift-registration/";
const DLD_INHERITANCE = "https://dubailand.gov.ae/en/eservices/inheritance-title-transfer/";
const DLD_LAW = "https://dlp.dubai.gov.ae/Legislation%20Reference/2006/Law%20No.%20(7)%20of%202006.html";

const dubaiInvestorSteps: BlueprintStep[] = [
  {
    id: "identify-route", number: 1, title: "Identify the investor and ownership route", actor: "Investor, landowner or authorised representative", trigger: "A Dubai land, ready-property or off-plan opportunity is being considered.", authority: "Dubai Land Department (DLD) for registry eligibility; the relevant licensing authority for a company NOC", portal: "DLD Company Registration and Property Status services", appliesTo: "All acquisition routes", tracks: ["track-neutral", "dm-mainland", "dda-tecom", "trakhees-pcfc", "financial-free-zone"],
    whatHappens: ["Separate personal ownership from company or wealth-structure ownership.", "Confirm nationality, legal-person structure and the asset location before treating ownership as available.", "For a company, verify DLD registration and the required licensing-authority NOC."],
    documentsIn: ["Investor identification", "Entity incorporation and licence documents where applicable", "Constitutional documents and owner identification where applicable"], outputs: ["Provisional ownership-route decision", "List of eligibility questions requiring registry confirmation"], fees: [], duration: [], failureModes: ["Treating incorporation as proof that the entity may own a particular plot", "Using a historic freehold-area list as an exhaustive current map"], unlocks: "A defensible route into plot and title qualification.", provenance: conditional("Dubai Land Department — Company Registration Application", DLD_COMPANY, "Eligibility remains asset- and entity-specific; DLD confirmation controls."),
  },
  {
    id: "resolve-jurisdiction", number: 2, title: "Resolve the registry and planning jurisdiction", actor: "Investor with adviser, broker, developer or plot representative", trigger: "A specific asset or plot has been identified.", authority: "DLD plus the plot-specific planning authority", portal: "DLD Property Status; authority site-plan channel", appliesTo: "Land and development opportunities", tracks: ["track-neutral", "dm-mainland", "dda-tecom", "trakhees-pcfc", "financial-free-zone"],
    whatHappens: ["Confirm whether the asset is registered through DLD or, for property physically within DIFC, the DIFC Registrar of Real Property.", "Identify whether planning sits with Dubai Municipality, DDA, Trakhees/PCFC or another plot-specific authority.", "Keep registry, planning and master-developer requirements as separate checks."],
    documentsIn: ["Title deed or property identifier", "Makani, municipality or map reference where available", "Master-community or site-plan references"], outputs: ["Recorded registry route", "Recorded planning branch", "Track-specific verification list"], fees: [], duration: [], failureModes: ["Assuming every Dubai plot follows Dubai Municipality planning", "Using a planning site plan as proof that the title is unencumbered"], unlocks: "The correct official channels for title, permitted-use and development-envelope checks.", provenance: official("Dubai Land Department — Property Status Enquiry", DLD_STATUS),
  },
  {
    id: "qualify-asset", number: 3, title: "Qualify title, permitted use and project status", actor: "Investor or landowner with qualified professional support", trigger: "The registry and planning branch are known.", authority: "DLD and the plot-specific planning authority", portal: "DLD Verify Title Deed, Property Status, Detailed Property Report and Project Status", appliesTo: "Land, ready property and off-plan", tracks: ["track-neutral", "dm-mainland", "dda-tecom", "trakhees-pcfc", "financial-free-zone"],
    whatHappens: ["Verify the title deed and retrieve property, mortgage, seizure, suspension and project information through the relevant DLD services.", "For a development plot, obtain the applicable official site plan and confirm zoning, land use and development controls.", "For off-plan, inspect project status, developer details and escrow information before commitment."],
    documentsIn: ["Title deed", "Property and plot identifiers", "Official site plan where applicable", "Off-plan project reference where applicable"], outputs: ["Title and status evidence", "Permitted-use and development-control record", "Open-risk list"],
    fees: [{ label: "Detailed Property Report", value: "AED 50 + AED 10 Knowledge Fee + AED 10 Innovation Fee", appliesTo: "Online/app report", provenance: official("DLD — Detailed Property Report", DLD_REPORT) }],
    duration: [{ label: "Detailed Property Report", value: "10 minutes", appliesTo: "Authority service estimate after complete submission", provenance: official("DLD — Detailed Property Report", DLD_REPORT) }],
    failureModes: ["Relying on marketing material instead of registry and project-status evidence", "Conflating title verification with planning approval"], unlocks: "A documented go, pause or stop decision before commercial commitment.", provenance: official("Dubai Land Department — Detailed Property Report", DLD_REPORT),
  },
  {
    id: "structure-commitment", number: 4, title: "Set the holding and commitment structure", actor: "Investor, legal adviser, tax adviser and authorised entity signatory", trigger: "The asset is qualified sufficiently to structure the commitment.", authority: "DLD for registrability; licensing authority for entity permissions", portal: "Transaction-specific DLD channel", appliesTo: "Personal, corporate and family-wealth routes", tracks: ["track-neutral", "dm-mainland", "dda-tecom", "trakhees-pcfc", "financial-free-zone"],
    whatHappens: ["Select personal or corporate ownership only after registry eligibility is confirmed.", "Record governance, signatory, beneficial-owner and funding decisions outside the property-registration decision.", "Obtain transaction-specific legal and tax advice; REOS does not determine suitability."],
    documentsIn: ["Investment mandate", "Entity and signatory records", "Professional advice where applicable"], outputs: ["Approved holding route", "Authorised signing and funding plan"], fees: [], duration: [], failureModes: ["Choosing an SPV before confirming plot-level registrability", "Treating general structure guidance as legal or tax advice"], unlocks: "A party capable of signing and funding the selected transaction.", provenance: conditional("Dubai Land Department — Company Registration Application", DLD_COMPANY, "No official source reviewed proves every company or wealth vehicle may own every Dubai asset."),
  },
  {
    id: "funding-controls", number: 5, title: "Separate finance and escrow routes", actor: "Investor, lender, developer and escrow bank as applicable", trigger: "The ownership route and acquisition type are known.", authority: "DLD/RERA and the financing institution", portal: "DLD mortgage service, Oqood or project-escrow services as applicable", appliesTo: "Ready finance, off-plan buyer finance or development project", tracks: ["track-neutral", "dm-mainland", "dda-tecom", "trakhees-pcfc"],
    whatHappens: ["Distinguish an ordinary acquisition/refinance mortgage from an off-plan purchaser mortgage and a developer project escrow.", "Confirm lender underwriting separately from registry requirements.", "For off-plan development, keep buyer receipts and development financing within the regulated project-escrow route."],
    documentsIn: ["Lender offer and registration letter", "SPA for off-plan finance", "Project and escrow records for development finance"], outputs: ["Selected finance route", "Registry and escrow actions", "Explicit exclusions and lender-dependent items"],
    fees: [{ label: "Mortgage registration", value: "0.25% of mortgage value plus conditional charges", appliesTo: "DLD ordinary mortgage registration", provenance: official("DLD — Mortgage Registration", DLD_MORTGAGE) }], duration: [],
    failureModes: ["Calling an ordinary investor mortgage a project escrow", "Publishing lender approval time, valuation fee or loan-to-value as a universal fact"], unlocks: "A finance path that matches the actual transaction type.", provenance: official("Dubai Land Department — Mortgage Registration", DLD_MORTGAGE),
  },
  {
    id: "register-acquisition", number: 6, title: "Register the acquisition through the applicable route", actor: "Seller, buyer/investor, developer, lender and Registration Trustee as applicable", trigger: "Commercial terms, eligibility, evidence and funds are ready.", authority: "DLD; DIFC Registrar of Real Property only for DIFC-located property", portal: "Registration Trustee, Oqood or eligible Dubai Now channel", appliesTo: "Ready, off-plan, mortgaged or eligible digital transfer", tracks: ["track-neutral", "dm-mainland", "dda-tecom", "trakhees-pcfc", "financial-free-zone"],
    whatHappens: ["Use the route matching ready property, off-plan initial sale, mortgaged property or eligible Dubai Now transfer.", "Submit route-specific identity, SPA, NOC, liability and payment evidence.", "Pay the applicable fee schedule and retain the official electronic title, map, provisional certificate and receipts."],
    documentsIn: ["Emirates ID or valid non-resident passport", "Electronic developer NOC for relevant freehold property", "SPA for off-plan", "Bank liability and manager's cheques for mortgaged sale"], outputs: ["Registered title or provisional registration", "Electronic map and receipts where applicable"],
    fees: [{ label: "Completed sale registration", value: "2% seller + 2% buyer; title, map, knowledge, innovation and trustee charges also apply", appliesTo: "Ordinary completed-property sale through trustee", provenance: official("DLD — Property Sale Registration", DLD_SALE) }, { label: "Off-plan initial sale", value: "2% seller + 2% purchaser; AED 10 Knowledge + AED 10 Innovation; AED 1,000 developer self-registration", appliesTo: "Developer registration through Oqood", provenance: official("DLD — Request to Register the Initial Sale", DLD_OQOOD) }],
    duration: [{ label: "Completed-sale processing", value: "25 minutes", appliesTo: "Authority service estimate once a complete transaction is presented", provenance: official("DLD — Property Sale Registration", DLD_SALE, "Not the total commercial transaction duration.") }, { label: "Off-plan initial sale", value: "DLD currently lists one business day", appliesTo: "Authority service listing", provenance: official("DLD — Request to Register the Initial Sale", DLD_OQOOD) }],
    failureModes: ["Combining channel-specific fees into one synthetic total", "Treating an authority processing estimate as the end-to-end purchase timeline", "Using Dubai Now when its eligibility conditions are not met"], unlocks: "The registry output that recognises the investor's interest.", provenance: official("Dubai Land Department — Property Sale Registration", DLD_SALE),
  },
  {
    id: "operate-asset", number: 7, title: "Maintain ownership, tenancy and community obligations", actor: "Owner/investor, property manager, tenant and jointly owned property manager", trigger: "Title or registered off-plan interest has been obtained.", authority: "DLD/RERA and relevant utilities/community channels", portal: "Dubai REST, Ejari, Mollak and Service Charge Index as applicable", appliesTo: "Held, leased or jointly owned property", tracks: ["track-neutral", "dm-mainland", "dda-tecom", "trakhees-pcfc", "financial-free-zone"],
    whatHappens: ["Maintain title, mortgage and authorised-representative records.", "Register or renew tenancy through Ejari where applicable.", "For jointly owned property, verify the property- and year-specific RERA-approved service charge through official channels."],
    documentsIn: ["Title and owner authority records", "Tenancy contract", "Approved service-charge record"], outputs: ["Registered tenancy where applicable", "Operating and service-charge evidence", "Current ownership record"],
    fees: [{ label: "Ejari online/app", value: "AED 177.75", appliesTo: "DLD-listed online/app total", provenance: official("DLD — Register or Renew Tenancy Contract", DLD_EJARI) }, { label: "Ejari trustee centre", value: "AED 220", appliesTo: "DLD-listed trustee-centre total", provenance: official("DLD — Register or Renew Tenancy Contract", DLD_EJARI) }], duration: [],
    failureModes: ["Publishing a generic service-charge rate", "Confusing the Mollak service-charge account with an off-plan project escrow"], unlocks: "A traceable operating record for income, cost, occupancy and compliance.", provenance: official("Dubai Land Department — Register or Renew Tenancy Contract", DLD_EJARI),
  },
  {
    id: "refinance-hold", number: 8, title: "Monitor, refinance or change lender", actor: "Owner/investor and existing/new lender", trigger: "The hold strategy or funding requirement changes.", authority: "DLD for registered mortgage changes", portal: "DLD Mortgage Transfer or Mortgage Release", appliesTo: "Mortgaged assets", tracks: ["track-neutral", "dm-mainland", "dda-tecom", "trakhees-pcfc"],
    whatHappens: ["Compare actual income, cost and asset condition with the investment mandate.", "For a lender change, obtain the former lender's NOC and the new lender's registration letter.", "Register the transfer or release rather than treating a private settlement as a registry change."],
    documentsIn: ["Existing lender NOC", "New lender registration letter", "Current title and mortgage records"], outputs: ["Registered mortgage transfer or release", "Updated hold and funding decision"], fees: [], duration: [], failureModes: ["Publishing lender underwriting outcomes as authority facts", "Assuming debt settlement automatically updates the registry"], unlocks: "A current financing position and an evidence-backed hold or exit decision.", provenance: official("Dubai Land Department — Mortgage Registration", DLD_MORTGAGE),
  },
  {
    id: "exit-transfer", number: 9, title: "Exit through the correct transfer route", actor: "Owner/investor, buyer or recipient, broker, lender and trustee as applicable", trigger: "A sale, qualifying gift or other transfer is approved.", authority: "DLD or the applicable property registrar", portal: "DLD sale, mortgaged-sale or gift-registration channel", appliesTo: "Sale, mortgaged sale or qualifying gift", tracks: ["track-neutral", "dm-mainland", "dda-tecom", "trakhees-pcfc", "financial-free-zone"],
    whatHappens: ["Clear the route-specific mortgage, community and developer conditions before transfer.", "Use the dedicated mortgaged-sale process when lender debt must be protected and released.", "Use gift registration only where the relationship, valuation and restrictions satisfy the official service."],
    documentsIn: ["Title and identity records", "NOCs and liability letter where applicable", "Relationship evidence and valuation for qualifying gift"], outputs: ["Registered transfer", "Mortgage release and transaction receipts where applicable"],
    fees: [{ label: "Qualifying property gift", value: "0.125% of valuation, minimum AED 2,000, plus conditional charges", appliesTo: "DLD Property Gift Registration", provenance: official("DLD — Property Gift Registration", DLD_GIFT) }], duration: [],
    failureModes: ["Leaving mortgage or community clearance to the end", "Assuming a gift route applies without official eligibility confirmation"], unlocks: "A registry-recognised exit or transfer.", provenance: official("Dubai Land Department — Property Gift Registration", DLD_GIFT),
  },
  {
    id: "succession", number: 10, title: "Prepare succession and register the resulting transfer", actor: "Owner/investor, heirs, courts or Awqaf, lender and developer as applicable", trigger: "Succession planning is undertaken or an estate transfer is required.", authority: "Dubai Courts/DIFC Courts as applicable; DLD for title transfer", portal: "DLD Inheritance Title Transfer", appliesTo: "Inheritance and eligible non-Muslim will planning", tracks: ["track-neutral", "dm-mainland", "dda-tecom", "trakhees-pcfc", "financial-free-zone"],
    whatHappens: ["Obtain case-specific legal advice for personal status, corporate shares, minors or cross-border estates.", "For the registry transfer, assemble the legal inheritance notification, identification and the official court or Awqaf request.", "Add lender NOC for mortgaged property and developer NOC for a preliminary sale where required."],
    documentsIn: ["Legal inheritance notification", "Heir identification", "Official court or Awqaf letter", "Lender or developer NOC where required"], outputs: ["Registered inheritance transfer", "Updated title record"],
    fees: [{ label: "Inheritance title transfer", value: "AED 1,000 per property plus deed, map, service-partner, knowledge and innovation fees", appliesTo: "DLD service", provenance: official("DLD — Inheritance Title Transfer", DLD_INHERITANCE) }],
    duration: [{ label: "Inheritance title transfer", value: "8 working hours", appliesTo: "Authority service estimate after complete submission", provenance: official("DLD — Inheritance Title Transfer", DLD_INHERITANCE) }],
    failureModes: ["Reducing Muslim, non-Muslim, corporate-share or cross-border succession to one generic path", "Treating a will as the later title-registration step"], unlocks: "A registry record aligned with the legally established succession outcome.", provenance: official("Dubai Land Department — Inheritance Title Transfer", DLD_INHERITANCE),
  },
];

const coverage = (): JurisdictionCoverage[] => EMIRATES.map((emirate) => ({
  emirate: emirate.id,
  label: emirate.label,
  state: emirate.id === "dubai" ? "reference" : "not-yet-mapped",
  missing: emirate.id === "dubai" ? [] : ["Sequenced authority blueprint", "Transaction-specific eligibility", "Official fee and service-time register", "Named portals and document rules"],
}));

const firstDecisionByStakeholder: Record<string, string> = {
  "landowners-investors": "First choose whether the opportunity is land, a ready property or an off-plan unit. Then confirm the registry and planning route before commitment.",
  developers: "First confirm control of the land, the development case and the competent planning authority before appointing the delivery team.",
  "consultants-designers": "First confirm the valid site plan, authority branch, appointment scope and submission standard before design begins.",
  "authorities-regulators": "First identify which statutory mandate applies to the plot, submission or transaction; one authority route must never be presented as universal.",
  "utility-providers": "First confirm the plot, projected demand, network capacity and the authority channel through which the NOC or connection request must enter.",
  contractors: "First confirm the approved design, permit conditions, appointment, access controls and inspection sequence before mobilising.",
  "suppliers-vendors": "First confirm the approved specification, responsible contractor, product evidence and required conformity or authority review before supply.",
  "brokers-agencies": "First confirm your instruction, licence scope, asset status and approved disclosure route before advertising or introducing a party.",
  "banks-financial": "First identify whether the facility supports acquisition, off-plan purchase or development, then separate mortgage, escrow and drawdown controls.",
  "property-owners": "First confirm the official title or provisional interest, handover status and the obligations attached to the unit, plot or jointly owned property.",
  "residents-tenants": "First confirm whether you are buying, leasing or occupying, then use the official onboarding, contract and service channels for that route.",
  "facility-community-operators": "First confirm the appointed operating scope, completion evidence, asset register, service obligations and authority conditions before mobilisation.",
};

for (const group of groups) {
  if (!firstDecisionByStakeholder[group.id]) throw new Error(`Missing stakeholder-specific entry decision: ${group.id}`);
}

const baseProfiles: StakeholderBlueprintProfile[] = groups.map((group) => ({
  stakeholderId: group.id,
  overview: group.controls,
  audience: group.members.slice(0, 4).join(", "),
  firstDecision: firstDecisionByStakeholder[group.id],
  coverage: coverage(),
  participation: participationForStakeholder(group.id).map((item) => ({
    stageId: item.stageId,
    state: item.involvement,
    relationshipLevel: item.relationshipLevel,
    summary: item.role,
    evidence: item.evidence,
  })),
  steps: group.id === "landowners-investors" ? dubaiInvestorSteps : [],
}));

export const stakeholderBlueprintProfiles = baseProfiles;
export const stakeholderBlueprintById = Object.fromEntries(baseProfiles.map((profile) => [profile.stakeholderId, profile]));

export const evidenceLabel: Record<EvidenceStatus, string> = {
  verified: "Official source",
  conditional: "Conditional",
  unverified: "Not yet verified",
};

export function blueprintEvidenceStatus(profile: StakeholderBlueprintProfile, emirate: EmirateId): EvidenceStatus {
  if (emirate !== "dubai" || profile.steps.length === 0) return "unverified";
  const statuses = profile.steps.flatMap((step) => [step.provenance.status, ...step.fees.map((fee) => fee.provenance.status), ...step.duration.map((duration) => duration.provenance.status)]);
  return statuses.includes("unverified") ? "unverified" : statuses.includes("conditional") ? "conditional" : "verified";
}

export const ownershipEligibilityFact: SourcedFact = {
  label: "Dubai ownership eligibility",
  value: "Eligibility depends on nationality, legal-person structure, property location and the applicable designated-area instrument. Confirm the specific plot with DLD before committing.",
  appliesTo: "Dubai acquisitions",
  provenance: official("Dubai Legislation Portal — Law No. 7 of 2006", DLD_LAW, "The historic designated-area list is not presented as an exhaustive current map."),
};

export const unpublishedFact = (label: string): SourcedFact => ({ label, value: "No verified, transaction-specific public fact is published here yet.", provenance: unverified("Awaiting primary authority evidence and editorial review.") });

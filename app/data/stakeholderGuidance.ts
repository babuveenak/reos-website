import type { StakeholderId } from "./stakeholderParticipation";

export type GuidanceStep = {
  title: string;
  description: string;
  sourceId?: string;
};
export type GuidancePath = {
  label: string;
  title: string;
  note: string;
  steps: GuidanceStep[];
};

export type GuidanceChallenge = {
  title: string;
  why: string;
  response: string;
  sourceId?: string;
};

export type GuidanceDirectoryItem = {
  name: string;
  description: string;
  emirates: string[];
  sourceId?: string;
  status: "official" | "pending";
  keywords?: string[];
};

export type GuidanceDirectory = {
  title: string;
  description: string;
  filters: string[];
  items: GuidanceDirectoryItem[];
};

export type StakeholderGuidance = {
  entryTitle: string;
  entryNote: string;
  paths: GuidancePath[];
  challenges: GuidanceChallenge[];
  supportingGuardrails?: Record<string, string>;
};

const rolePath = (title: string, note: string, steps: GuidanceStep[]): GuidancePath => ({ label: "Role route", title, note, steps });
const challenge = (title: string, why: string, response: string, sourceId?: string): GuidanceChallenge => ({ title, why, response, sourceId });

export const stakeholderGuidance: Record<StakeholderId, StakeholderGuidance> = {
  "landowners-investors": {
    supportingGuardrails: {
      "authorities-approvals": "Provides ownership, mandate and funding evidence; does not issue or waive an authority approval.",
      "construction-delivery": "Monitors capital, programme and evidence against the investment mandate; does not certify design, quality or completion.",
    },
    entryTitle: "Enter through an asset or an investment mandate.",
    entryNote: "Owning or funding property is not a professional licence. The route starts by proving who may hold the interest and what is actually being acquired.",
    paths: [rolePath("Acquire or fund with evidence", "The ownership, entity and asset route must be resolved before commitment.", [
      { title: "Define the mandate", description: "Record whether the intention is land development, ready-property ownership, off-plan acquisition or portfolio investment." },
      { title: "Verify the asset and registered interest", description: "Check title, restrictions, mortgages and project status through the applicable official channel.", sourceId: "dld.detailed-report" },
      { title: "Register the qualifying acquisition", description: "Use the official ready, off-plan or financed transaction route that matches the asset.", sourceId: "dld.sale" },
    ])],
    challenges: [
      challenge("The asset route is assumed", "Ready, off-plan, land and mortgaged assets do not follow one registration path.", "Classify the asset and registry route before signing or funding.", "dld.property-status"),
      challenge("Permitted use is inferred", "A neighbouring plot or marketing description is not plot-specific planning evidence.", "Obtain the competent authority's site-plan or planning record.", "dm.site-plan"),
      challenge("Encumbrances surface late", "Mortgage, seizure or suspension evidence may not be visible in commercial documents.", "Use the official detailed property report and transaction due diligence.", "dld.detailed-report"),
      challenge("Service time is treated as deal time", "An authority counter time starts after a complete accepted submission.", "Plan commercial, finance, NOC and authority dependencies separately.", "dld.sale"),
      challenge("Off-plan status is not refreshed", "Project and unit status can change between reservation, payment and registration.", "Recheck the official project and transaction evidence at each commitment gate.", "dld.project-registration"),
      challenge("Exit finance is sequenced late", "Sale, mortgage settlement and registration may depend on one another.", "Agree the lender, trustee and registry sequence before promising an exit date.", "dld.mortgaged-sale"),
    ],
  },
  developers: {
    supportingGuardrails: {
      "asset-growth-intelligence": "Provides project, handover and performance evidence; does not make the owner's hold, finance or disposal decision.",
    },
    entryTitle: "Enter through a licensed development entity and a registered project route.",
    entryNote: "A trade licence alone does not register a project or authorise off-plan activity.",
    paths: [rolePath("Establish the developer and project", "Entity, land, planning and project-registration evidence remain separate controls.", [
      { title: "Confirm the real-estate activity", description: "Apply through the licensing authority and complete the applicable RERA/Trakheesi route.", sourceId: "dld.real-estate-licensing" },
      { title: "Secure the land and planning branch", description: "Resolve ownership, site plan and competent planning authority before design submissions.", sourceId: "dld.property-status" },
      { title: "Register the qualifying project", description: "Complete the official project-registration requirements before regulated off-plan activity.", sourceId: "dld.project-registration" },
    ])],
    challenges: [
      challenge("Entity and project approval are conflated", "Licensing the company does not register a particular development.", "Maintain separate entity, land, project and permit evidence.", "dld.project-registration"),
      challenge("The wrong planning branch is selected", "DM, DDA, Trakhees and DIFC-related routes are not interchangeable.", "Resolve the plot's competent authority before design mobilisation.", "dm.site-plan"),
      challenge("Sales readiness outruns registration", "Marketing and off-plan sales require project and permit controls.", "Gate campaigns and reservations on current official evidence.", "dld.ad-permit"),
      challenge("Completion evidence is fragmented", "Consultant, contractor, utility and authority records close at different times.", "Maintain one controlled completion and handover register.", "dm.completion"),
      challenge("Buyer receipts outrun project controls", "Commercial collections can become disconnected from registration and project evidence.", "Keep buyer, escrow and project-registration controls aligned before accepting milestones.", "dld.project-registration"),
      challenge("Operational obligations arrive late", "Service-charge, management and handover records are often prepared after construction decisions are fixed.", "Mobilise the operating model and its evidence before completion.", "dld.mollak-budget"),
    ],
  },
  "consultants-designers": {
    supportingGuardrails: {
      "land-vision": "Tests planning and design feasibility; does not verify ownership, fund the acquisition or make the investment decision.",
      "sales-transfer": "Supplies approved design and disclosure evidence; does not market the asset or register the transfer.",
      "living-operations": "Explains design intent and closes technical records; does not operate the property or accept resident obligations.",
    },
    entryTitle: "Enter through professional appointment, competence and authority acceptance.",
    entryNote: "The applicable licence, registration and submission rights depend on discipline and planning authority.",
    paths: [rolePath("Become the appointed design professional", "Confirm discipline-specific eligibility before accepting responsibility for a submission.", [
      { title: "Define the discipline and scope", description: "Separate architecture, engineering, supervision, survey and specialist design responsibilities." },
      { title: "Confirm authority eligibility", description: "Check the selected planning authority's registration and submission requirements." },
      { title: "Record the appointment and design baseline", description: "Keep appointment, approved scope, site plan and authority comments controlled.", sourceId: "dda.preliminary-design" },
    ])],
    challenges: [
      challenge("The appointment scope is unclear", "Design, supervision and specialist duties can be assigned to different parties.", "Publish a responsibility matrix before submission."),
      challenge("A superseded design is used", "Comments and revisions move through several teams and portals.", "Control the approved drawing and comment-closure register.", "dda.final-design"),
      challenge("External NOCs arrive late", "Utility and safety inputs may depend on a coordinated design.", "Map each NOC prerequisite into the design programme.", "dewa.building-noc"),
      challenge("Site change lacks authority closure", "A construction change may affect the approved design or completion evidence.", "Assess, approve and record every regulated change before incorporation."),
      challenge("Professional eligibility is assumed", "Discipline, grade and submission rights can differ by authority and project type.", "Confirm the accepted professional and firm route before taking submission responsibility."),
      challenge("Completion records do not match the works", "As-built information, testing and authority comments may close on different baselines.", "Reconcile the approved design, site record and completion submission before certification.", "dda.completion"),
    ],
  },
  "authorities-regulators": {
    supportingGuardrails: {
      "planning-design": "Publishes requirements and reviews formal submissions; does not act as the applicant's designer or coordinator.",
      "living-operations": "Oversees applicable registration, safety or community controls; does not manage the asset day to day.",
      "asset-growth-intelligence": "Maintains official records within its mandate; does not provide investment advice or portfolio decisions.",
    },
    entryTitle: "This is a statutory mandate, not a public role-entry journey.",
    entryNote: "REOS explains where an authority acts; it does not describe recruitment, appointment or delegation as a property transaction.",
    paths: [rolePath("Locate the competent mandate", "The correct authority depends on the asset, emirate, zone, service and decision required.", [
      { title: "Identify the legal and geographic scope", description: "Resolve registry, planning, utility, safety and community mandates separately." },
      { title: "Use the official service channel", description: "Follow the authority's current applicant, document and submission rules." },
      { title: "Preserve the official decision", description: "Retain the permit, registration, approval, refusal or condition as the authoritative record." },
    ])],
    challenges: [
      challenge("Authority roles are merged", "One organisation's record cannot substitute for another organisation's mandate.", "Map each decision to its competent authority and official output."),
      challenge("Guidance is treated as approval", "Published information explains a route but does not approve a project.", "Retain the transaction-specific official decision."),
      challenge("A service time becomes a project promise", "Authority estimates exclude applicant preparation and dependency closure.", "Separate service estimates from the total programme."),
      challenge("Cross-jurisdiction facts leak", "DM, DDA, Trakhees and DIFC routes have different controls.", "Keep sources and claims isolated by route."),
      challenge("Duplicate submissions lose their baseline", "Parallel portals and revisions can make the current applicant record unclear.", "Use one submission, comment and decision register keyed to the official reference."),
      challenge("Decision conditions disappear downstream", "Teams may retain the approval but not the conditions attached to it.", "Carry every official condition into design, delivery and handover controls."),
    ],
  },
  "utility-providers": {
    supportingGuardrails: {
      "land-vision": "Provides network and capacity context; does not confirm ownership, permitted use or project viability.",
      "planning-design": "Provides utility criteria and review inputs; does not coordinate or approve the full building design.",
      "sales-transfer": "Provides connection and account evidence where applicable; does not approve marketing or register ownership.",
      "asset-growth-intelligence": "Provides metering and service records within its mandate; does not value the asset or direct investment decisions.",
    },
    entryTitle: "Enter through the regulated network and the applicable service mandate.",
    entryNote: "Utility participation starts when demand, capacity, corridor or customer activation reaches the provider's official channel.",
    paths: [rolePath("Connect the project to the network", "Project and consumer channels have different prerequisites and outputs.", [
      { title: "Confirm demand and network context", description: "Identify load, capacity, corridor and connection constraints early.", sourceId: "dewa.master-plan" },
      { title: "Obtain the applicable project NOC", description: "Use the planning-authority or DEWA channel that applies to the project.", sourceId: "dewa.building-noc" },
      { title: "Activate the customer account", description: "Complete the official move-in route after handover prerequisites are ready.", sourceId: "dewa.move-in" },
    ])],
    challenges: [
      challenge("Capacity is checked too late", "Demand can affect design, programme and cost.", "Confirm network inputs before freezing the design.", "dewa.master-plan"),
      challenge("The wrong NOC channel is used", "Submission channels vary by planning authority and request type.", "Follow the official service routing for the selected project.", "dewa.infrastructure-noc"),
      challenge("Connection readiness is incomplete", "Payment alone does not establish physical readiness.", "Close approved drawings, inspections and site prerequisites before requesting connection.", "dewa.water-connection"),
      challenge("Owner and occupier accounts are confused", "Project connection and consumer activation are separate events.", "Map builder and consumer services as distinct controls.", "dewa.move-in"),
      challenge("Corridor and access constraints surface late", "A capacity indication does not resolve routing, easement or site-access requirements.", "Coordinate the physical corridor and authority NOC before freezing the programme.", "dewa.infrastructure-noc"),
      challenge("Customer activation is treated as project acceptance", "A live account does not prove that every project completion obligation has closed.", "Keep network acceptance, building completion and customer move-in as separate evidence gates.", "dewa.move-in"),
    ],
  },
  contractors: {
    supportingGuardrails: {
      "planning-design": "Contributes buildability, sequencing and procurement input; does not own the appointed designer's approval responsibility.",
      "authorities-approvals": "Provides method, appointment and execution evidence; does not issue permits or interpret authority decisions.",
      "sales-transfer": "Provides progress and completion evidence; does not market units, advise buyers or register transfers.",
      "asset-growth-intelligence": "Provides defects, warranty and asset records; does not manage the investment or operating strategy.",
    },
    entryTitle: "Enter through a licensed, appointed and authority-accepted delivery role.",
    entryNote: "The trade activity, classification and permit-facing appointment depend on the project and planning authority.",
    paths: [rolePath("Become the controlled delivery party", "Do not mobilise from a commercial award alone.", [
      { title: "Confirm trade activity and competence", description: "Match the legal entity, activity and technical capability to the contracted scope." },
      { title: "Record the project appointment", description: "Complete the owner/consultant/contractor appointment evidence required by the authority route." },
      { title: "Mobilise under the issued permit", description: "Use approved drawings, NOCs, access and safety conditions as the execution baseline.", sourceId: "dm.new-building-permit" },
    ])],
    challenges: [
      challenge("Mobilisation starts before permit readiness", "Commercial urgency can outrun authority and access conditions.", "Gate site work on the current permit and prerequisites.", "dm.new-building-permit"),
      challenge("Changes bypass design control", "Site solutions may alter approved technical evidence.", "Route regulated changes through the consultant and competent authority."),
      challenge("Inspection evidence is incomplete", "Quality records sit across subcontractors and systems.", "Maintain a milestone inspection and test register."),
      challenge("Defects lose ownership at handover", "Open items can move between contractor, developer and operator without closure.", "Assign every defect an owner, due date and acceptance record."),
      challenge("Subcontractor evidence is uncoordinated", "Testing, inspection and warranty records arrive in different formats and at different times.", "Define evidence packages and acceptance gates in every subcontract."),
      challenge("Completion submission starts too late", "As-built, NOC and test records are often assembled only after physical work ends.", "Build the authority completion dossier progressively during delivery.", "dm.completion"),
    ],
  },
  "suppliers-vendors": {
    supportingGuardrails: {
      "planning-design": "Provides product data and technical options; does not approve a substitution or own design coordination.",
      "living-operations": "Provides spares, warranties and specialist support; does not accept the asset or operate the community.",
      "asset-growth-intelligence": "Provides product and maintenance evidence; does not assess asset performance or investment value.",
    },
    entryTitle: "Enter through an approved specification and controlled supply package.",
    entryNote: "A supplier does not become an authority-approved project participant simply by being commercially selected.",
    paths: [rolePath("Supply compliant, traceable evidence", "Product, installation and warranty responsibilities must be clear before delivery.", [
      { title: "Confirm the approved specification", description: "Match the product and submittal to the designer's controlled requirement." },
      { title: "Provide conformity and traceability", description: "Retain test, certification, batch and origin evidence where applicable.", sourceId: "dm.product-certification" },
      { title: "Close commissioning and warranty evidence", description: "Deliver manuals, commissioning results, spares and warranty records to the appointed party." },
    ])],
    challenges: [
      challenge("Substitution is not approved", "Commercial availability can diverge from the approved specification.", "Obtain the appointed designer's and authority's required acceptance before supply."),
      challenge("Product evidence is incomplete", "Certificates may not cover the exact model, batch or intended use.", "Verify scope, validity and traceability of conformity evidence.", "dm.product-certification"),
      challenge("Delivery outruns site readiness", "Storage and installation conditions can compromise compliant products.", "Align release, logistics and inspection points with the contractor."),
      challenge("Warranty records are lost", "Handover packs are assembled across many vendors.", "Provide indexed digital manuals, warranties and commissioning evidence."),
      challenge("Delivered material differs from the approved sample", "Model, batch or finish can change between submittal and delivery.", "Link delivery inspection to the approved sample and traceable product record."),
      challenge("Commissioning interfaces remain open", "A product may be installed correctly but not integrated with connected systems.", "Define interface tests, witnesses and signed outputs before handover."),
    ],
  },
  "brokers-agencies": {
    supportingGuardrails: {
      "land-vision": "Contributes market evidence, comparables and demand data; does not verify title or permitted use.",
    },
    entryTitle: "Become authorised before representing property or clients.",
    entryNote: "Dubai separates the individual's professional practice card from the company's real-estate activity licence and registration. The two routes connect but are not interchangeable.",
    paths: [
      {
        label: "Path A · Individual",
        title: "Licensed real-estate broker",
        note: "Training and examination occur before the accepted practice-card application. The DLD service time below is not the total qualification journey.",
        steps: [
          { title: "Confirm eligibility and employer association", description: "Check the current Trakheesi conditions, good-conduct requirement and licence association." },
          { title: "Complete the required learning and test", description: "Use the current DLD/RERA professional qualification route; exemptions are limited to the official listed cases.", sourceId: "dld.broker-card" },
          { title: "Apply for the professional practice card", description: "Submit the accepted documents, pay through Trakheesi and obtain the electronic card.", sourceId: "dld.broker-card" },
        ],
      },
      {
        label: "Path B · Company",
        title: "Real-estate brokerage agency",
        note: "The licensing authority and RERA/Trakheesi controls form one coordinated route. Office, ownership and activity conditions remain application-specific.",
        steps: [
          { title: "Select the exact brokerage activity", description: "Confirm sale, leasing, mortgage or other permitted activity before filing the licence application." },
          { title: "Apply through DET or the applicable licensing authority", description: "Submit the business-licence route, then complete the RERA/Trakheesi approval.", sourceId: "dld.real-estate-licensing" },
          { title: "Register the office and authorised practitioners", description: "Do not operate through unregistered staff; keep professional cards linked to a valid licence.", sourceId: "dld.broker-card" },
          { title: "Obtain permits before regulated advertising", description: "Use Trakheesi for the applicable property advertising and marketing permit.", sourceId: "dld.ad-permit" },
        ],
      },
    ],
    challenges: [
      challenge("A broker or office cannot be verified", "An expired, mismatched or unregistered record weakens the transaction chain.", "Check the live DLD registry before relying on the representation.", "dld.broker-directory"),
      challenge("A listing is advertised without the right permit", "Property marketing has permit and owner-authorisation controls.", "Verify the Trakheesi permit and the authority to market before publication.", "dld.ad-permit"),
      challenge("Property evidence is stale", "Status, mortgage or project information may change after a listing is prepared.", "Refresh official asset evidence at the relevant decision point.", "dld.detailed-report"),
      challenge("The transaction route is misclassified", "Ready, off-plan and mortgaged transfers use different prerequisites.", "Identify the registration route before accepting milestones or promising completion.", "dld.sale"),
      challenge("Commission expectations are disputed", "Scope, trigger and payment conditions may not be documented consistently.", "Use current written brokerage agreements and preserve acceptance evidence."),
      challenge("An unregistered person performs regulated activity", "Company employment does not replace the required professional authorisation.", "Confirm the individual's current practice card and office association.", "dld.broker-card"),
    ],
  },
  "banks-financial": {
    supportingGuardrails: {
      "authorities-approvals": "Provides finance conditions and regulated evidence; does not issue the project's planning or building approvals.",
      "living-operations": "Monitors security, insurance and account conditions; does not operate the property or manage residents.",
    },
    entryTitle: "Enter through a regulated institution and an approved credit mandate.",
    entryNote: "Property finance participation belongs to the licensed institution; individual employment is not a public property-licensing route.",
    paths: [rolePath("Provide finance against controlled evidence", "The lender's underwriting and the registry's mortgage process are separate decisions.", [
      { title: "Define the product and credit authority", description: "Confirm borrower, asset, facility and internal approval scope." },
      { title: "Verify valuation, title and conditions", description: "Use current evidence without treating it as a substitute for underwriting.", sourceId: "dld.detailed-report" },
      { title: "Register the qualifying security", description: "Use the official mortgage route after lender and transaction conditions are complete.", sourceId: "dld.mortgage" },
    ])],
    challenges: [
      challenge("Credit approval is confused with registration", "Internal approval does not create a registered mortgage.", "Track lender conditions and registry completion separately.", "dld.mortgage"),
      challenge("Valuation evidence becomes stale", "Market and asset conditions can change before drawdown.", "Apply the lender's currency and refresh rules.", "dld.valuation"),
      challenge("Drawdown evidence is fragmented", "Progress, permit and cost evidence comes from several parties.", "Maintain a controlled condition-precedent and drawdown register."),
      challenge("Release and transfer are sequenced incorrectly", "Mortgage release, new finance and sale registration may be interdependent.", "Agree the official transaction sequence with the lender and trustee.", "dld.mortgaged-sale"),
      challenge("Project finance and buyer finance are merged", "Escrow, development lending and an end-user mortgage protect different obligations.", "Keep facilities, security, drawdown and registration evidence separated by product.", "dld.mortgage"),
      challenge("Authority time is promised as credit time", "A published registry service duration excludes underwriting and condition closure.", "Publish separate internal, customer and authority milestones.", "dld.mortgage"),
    ],
  },
  "property-owners": {
    supportingGuardrails: {
      "land-vision": "States the ownership objective and provides acquisition evidence; does not establish permitted use or approve development feasibility.",
    },
    entryTitle: "Enter when a registered or provisional property interest is acquired.",
    entryNote: "Ownership begins through the applicable official registration route, not through keys, payment or occupancy alone.",
    paths: [rolePath("Become and remain the recorded owner", "Ready, off-plan, gift and inheritance routes create different evidence.", [
      { title: "Confirm the asset and acquisition route", description: "Verify title, project and encumbrance status before commitment.", sourceId: "dld.detailed-report" },
      { title: "Complete the official registration", description: "Use the route that matches the property interest and transaction.", sourceId: "dld.sale" },
      { title: "Take over owner obligations", description: "Receive handover, service-charge, tenancy and community evidence.", sourceId: "dld.service-charge-index" },
    ])],
    challenges: [
      challenge("Possession is treated as title", "Keys or payment do not by themselves establish the registered interest.", "Verify the official property record.", "dld.verify-title"),
      challenge("Service charges are unclear", "Budgets, arrears and approved charges are different records.", "Use the approved charge index and obtain property-specific statements.", "dld.service-charge-index"),
      challenge("Handover evidence is incomplete", "Defects, manuals, meters and community obligations close across several parties.", "Use a controlled owner handover checklist."),
      challenge("Exit route is assumed", "Sale, gift, inheritance and financed transfers have different requirements.", "Classify the legal action before preparing documents.", "dld.sale"),
      challenge("The tenancy record is not maintained", "A changed or renewed occupation arrangement may not match the registered tenancy record.", "Keep the applicable Ejari record current and retain the accepted output.", "dld.ejari"),
      challenge("Mortgage release is treated as automatic", "Repayment and registry release are separate evidence events.", "Close the lender requirements and complete the official release route.", "dld.mortgage-release"),
    ],
  },
  "residents-tenants": {
    supportingGuardrails: {
      "asset-growth-intelligence": "Provides occupancy, service and lived-experience feedback; does not value, finance or decide the owner's asset strategy.",
    },
    entryTitle: "Enter through an authorised occupation or tenancy route.",
    entryNote: "A resident may be an owner-occupier, tenant or authorised occupant. Each starts with different evidence.",
    paths: [rolePath("Move into a lawful, service-ready home", "Confirm the right to occupy before activating services or recording occupants.", [
      { title: "Confirm the occupation basis", description: "Identify owner occupation, tenancy or authorised co-occupation and retain the supporting record." },
      { title: "Register the qualifying tenancy", description: "Use Ejari for the applicable Dubai tenancy route.", sourceId: "dld.ejari" },
      { title: "Activate utilities and building access", description: "Complete account, deposit, move-in and community requirements through the official channels.", sourceId: "dewa.move-in" },
    ])],
    challenges: [
      challenge("The tenancy record is missing or stale", "Contract changes and renewals may not be reflected in the registered record.", "Register or renew through the official Ejari route.", "dld.ejari"),
      challenge("Utility activation is left until move day", "Payment and account prerequisites can delay occupancy.", "Complete the official move-in steps before the planned handover.", "dewa.move-in"),
      challenge("Defects are not evidenced", "Verbal handover observations are hard to control.", "Record dated defects, responsibility and acceptance status."),
      challenge("A dispute skips the documented route", "Not every complaint is a registrable rental case.", "Preserve notices and use the competent support or dispute channel.", "rdc.rental-case"),
      challenge("Owner and occupier obligations are mixed", "Service charges, rent, utilities and community rules attach to different parties and records.", "Read the registered contract and official charge evidence before allocating responsibility.", "dld.service-charge-index"),
      challenge("The utility account remains open after exit", "Keys and tenancy closure do not automatically close the customer account.", "Complete the official move-out route and retain the final account evidence.", "dewa.move-out"),
    ],
  },
  "facility-community-operators": {
    supportingGuardrails: {
      "land-vision": "Provides maintainability and operating-cost inputs; does not decide the investment case or verify title.",
      "planning-design": "Reviews access, maintainability and operational readiness; does not own the appointed designer's approvals.",
      "authorities-approvals": "Provides operating evidence requested by the applicant; does not issue authority decisions.",
      "sales-transfer": "Provides handover, access and service information; does not market property or register ownership.",
    },
    entryTitle: "Enter through an appointed operating scope and accepted handover baseline.",
    entryNote: "Property, facility and jointly owned property management activities can require distinct licensing, contract and Mollak controls.",
    paths: [rolePath("Mobilise the operating model", "Appointment does not replace licensing or authority registration where required.", [
      { title: "Confirm the activity and appointment", description: "Separate property management, facilities services and jointly owned property supervision scopes.", sourceId: "dld.real-estate-licensing" },
      { title: "Register the applicable management contract", description: "Use the official property-management contract route where it applies.", sourceId: "dld.management-contract" },
      { title: "Accept the asset and service baseline", description: "Receive completion, asset, defect, contract, budget and community evidence before steady-state operation.", sourceId: "dld.mollak-budget" },
    ])],
    challenges: [
      challenge("The operating scope is blurred", "Facility, property and community management duties may sit with different entities.", "Publish the operating responsibility and authority matrix."),
      challenge("Handover data is incomplete", "Asset registers, warranties and defects arrive from many project parties.", "Use a controlled readiness and acceptance register."),
      challenge("Service charges lack an approved basis", "Commercial budgets are not the same as RERA-approved charges.", "Follow the applicable Mollak approval route.", "dld.mollak-budget"),
      challenge("Management authority is not evidenced", "An appointment, licence and registered contract may each serve a different purpose.", "Retain the current authorisation and contract record.", "dld.management-contract"),
      challenge("Vendor procurement evidence is incomplete", "Scope, tender, performance and payment records can be split across operator systems.", "Maintain one approved procurement and service-performance file.", "dld.mollak-budget"),
      challenge("Owner and tenant communication is not controlled", "Notices, service interruptions and complaints may be sent through inconsistent channels.", "Use a dated communication register linked to the responsible service and resolution."),
    ],
  },
};

const officialDirectoryItem = (name: string, description: string, sourceId: string, keywords: string[] = []): GuidanceDirectoryItem => ({
  name,
  description,
  sourceId,
  status: "official",
  emirates: ["Dubai"],
  keywords,
});

const pendingDirectoryItem = (name: string, description: string): GuidanceDirectoryItem => ({
  name,
  description,
  status: "pending",
  emirates: ["Dubai"],
  keywords: ["registry", "directory", "verification"],
});

export const stakeholderDirectories: Record<StakeholderId, GuidanceDirectory> = {
  "landowners-investors": {
    title: "Verify the asset before relying on an ownership or investment claim.",
    description: "Use live official asset channels. REOS does not expose private owner identities or certify an investment.",
    filters: ["Title", "Property status", "Encumbrance", "Project"],
    items: [
      officialDirectoryItem("Verify Title Deed", "Validate the title-deed record through the Dubai Land Department channel.", "dld.verify-title", ["owner", "title deed"]),
      officialDirectoryItem("Property Status Enquiry", "Check the published status route before relying on a property claim.", "dld.property-status", ["asset", "status"]),
      officialDirectoryItem("Detailed Property Report", "Request the applicable detailed property and encumbrance evidence.", "dld.detailed-report", ["mortgage", "restriction"]),
    ],
  },
  developers: {
    title: "Find the official project and developer verification channels.",
    description: "Project registration and company licensing are separate controls. A live public developer-entity feed is not connected to REOS.",
    filters: ["Developer", "Project", "Registration", "Advertising"],
    items: [
      officialDirectoryItem("Register Real Estate Project", "Official project-registration service and its current application requirements.", "dld.project-registration", ["developer", "off-plan"]),
      officialDirectoryItem("Real Estate Activity Licensing", "Official route for the applicable real-estate activity and authority approvals.", "dld.real-estate-licensing", ["company", "licence"]),
      pendingDirectoryItem("Live licensed-developer entity register", "TODO: connect data source. No developer names are copied or inferred until an official live register is connected."),
    ],
  },
  "consultants-designers": {
    title: "Find the competent design channel and verify professional eligibility there.",
    description: "Eligibility depends on discipline, project and planning authority. REOS does not publish an inferred consultant ranking.",
    filters: ["Consultant", "Designer", "Discipline", "Planning authority"],
    items: [
      officialDirectoryItem("Dubai Development Authority design route", "Review the official design submission route for DDA-administered plots.", "dda.final-design", ["architect", "engineer"]),
      officialDirectoryItem("Dubai Municipality building-permit route", "Review the permit channel used for the applicable DM project route.", "dm.new-building-permit", ["architect", "engineer", "permit"]),
      pendingDirectoryItem("Live approved-consultant register", "TODO: connect data source. Confirm firm and professional eligibility directly with the competent authority."),
    ],
  },
  "authorities-regulators": {
    title: "Open the official authority index by decision type.",
    description: "Use the authority that owns the registry, planning, utility, community or dispute decision. One authority cannot replace another's mandate.",
    filters: ["Registry", "Planning", "Utilities", "Disputes"],
    items: [
      officialDirectoryItem("Dubai Land Department / RERA", "Property registry, real-estate regulation and related services.", "dld.property-status", ["registry", "rera"]),
      officialDirectoryItem("Dubai Municipality", "Municipal planning, building and completion services for the applicable route.", "dm.site-plan", ["planning", "building"]),
      officialDirectoryItem("Dubai Development Authority", "Planning and building services for the applicable DDA-administered route.", "dda.site-plan", ["dda", "tecom"]),
      officialDirectoryItem("Trakhees / PCFC", "Planning, permit and completion services for the applicable Trakhees route.", "trakhees.new-building-permit", ["pcfc", "trakhees"]),
      officialDirectoryItem("DEWA", "Electricity and water planning, NOC, connection and customer services.", "dewa.master-plan", ["utility", "electricity", "water"]),
      officialDirectoryItem("Rental Disputes Center", "Official Dubai rental-dispute registration channel.", "rdc.rental-case", ["tenant", "landlord", "dispute"]),
    ],
  },
  "utility-providers": {
    title: "Find the official utility channel for the connection decision.",
    description: "Project planning, infrastructure NOCs, physical connections and customer accounts are distinct service routes.",
    filters: ["Capacity", "NOC", "Connection", "Move-in"],
    items: [
      officialDirectoryItem("DEWA master-plan service", "Early network and master-plan requirements for the applicable Dubai route.", "dewa.master-plan", ["capacity", "demand"]),
      officialDirectoryItem("DEWA infrastructure NOC", "Official NOC route for the applicable infrastructure request.", "dewa.infrastructure-noc", ["corridor", "network"]),
      officialDirectoryItem("DEWA move-in", "Customer account activation after the required occupation evidence is ready.", "dewa.move-in", ["resident", "account"]),
      pendingDirectoryItem("Other-emirate utility provider feeds", "TODO: connect data source. Use the competent provider's current official channel for the asset location."),
    ],
  },
  contractors: {
    title: "Find the permit route and verify contractor eligibility with its competent authority.",
    description: "Commercial appointment alone does not establish classification or permit-facing acceptance.",
    filters: ["Contractor", "Classification", "Permit", "Completion"],
    items: [
      officialDirectoryItem("Dubai Municipality building-permit route", "Official permit channel for the applicable DM-administered project.", "dm.new-building-permit", ["contractor", "building"]),
      officialDirectoryItem("Dubai Development Authority building-permit route", "Official permit channel for the applicable DDA-administered project.", "dda.final-building-permit", ["contractor", "dda"]),
      officialDirectoryItem("Trakhees building-permit route", "Official permit channel for the applicable Trakhees-administered project.", "trakhees.new-building-permit", ["contractor", "pcfc"]),
      pendingDirectoryItem("Live classified-contractor register", "TODO: connect data source. Verify classification and project eligibility directly with the competent authority."),
    ],
  },
  "suppliers-vendors": {
    title: "Find official product evidence before approving a supply package.",
    description: "A commercial vendor list is not a conformity decision. Confirm the exact product, model and intended use.",
    filters: ["Supplier", "Product", "Certification", "Conformity"],
    items: [
      officialDirectoryItem("Dubai Municipality product certification", "Official certification channel for products within its service scope.", "dm.product-certification", ["material", "certificate"]),
      pendingDirectoryItem("Live approved-product and supplier feeds", "TODO: connect data source. No supplier is presented as approved without a current authority record."),
    ],
  },
  "brokers-agencies": {
    title: "Verify a broker or brokerage office in the official registry.",
    description: "Search the live Dubai Land Department service. REOS does not copy, rank or certify broker records.",
    filters: ["Broker or office", "ORN", "Sale / lease / mortgage", "Project or area"],
    items: [officialDirectoryItem("Licensed Real Estate Brokers", "Open the live DLD registry to search the broker or brokerage office.", "dld.broker-directory", ["broker", "office", "orn"])],
  },
  "banks-financial": {
    title: "Find the official property-finance and security-registration channels.",
    description: "REOS does not infer whether an institution is licensed or recommend a lender. Verify the institution with its financial regulator.",
    filters: ["Bank", "Mortgage", "Valuation", "Security"],
    items: [
      officialDirectoryItem("DLD mortgage registration", "Official property-registry route after lender and transaction conditions are complete.", "dld.mortgage", ["finance", "security"]),
      officialDirectoryItem("DLD property valuation", "Official valuation service for the applicable request.", "dld.valuation", ["asset", "valuation"]),
      pendingDirectoryItem("Live regulated-financial-institution register", "TODO: connect data source. Confirm the institution and permitted activity with the competent financial regulator."),
    ],
  },
  "property-owners": {
    title: "Open the official ownership and community-information channels.",
    description: "REOS does not expose private owner identities. These services help verify the asset record and owner-facing obligations.",
    filters: ["Title", "Service charge", "Owners committee", "Transfer"],
    items: [
      officialDirectoryItem("Verify Title Deed", "Validate the title-deed record through the official DLD channel.", "dld.verify-title", ["owner", "title"]),
      officialDirectoryItem("Service Charge Index", "Review the official approved service-charge information available for the property.", "dld.service-charge-index", ["mollak", "community"]),
      officialDirectoryItem("Owners Committee service", "Review the official route for the applicable jointly owned property committee.", "dld.owners-committee", ["jop", "committee"]),
    ],
  },
  "residents-tenants": {
    title: "Open the official tenancy, utility and dispute-support channels.",
    description: "Private resident records are not listed. Use the official service that matches the tenancy, account or dispute action.",
    filters: ["Ejari", "Utilities", "Move-out", "Dispute"],
    items: [
      officialDirectoryItem("Ejari registration", "Official tenancy-registration route for the applicable Dubai tenancy.", "dld.ejari", ["tenant", "contract"]),
      officialDirectoryItem("DEWA move-in", "Official customer account-activation channel.", "dewa.move-in", ["resident", "electricity", "water"]),
      officialDirectoryItem("DEWA move-out", "Official customer account-closure channel.", "dewa.move-out", ["resident", "final bill"]),
      officialDirectoryItem("Rental Disputes Center", "Official channel for a qualifying Dubai rental dispute.", "rdc.rental-case", ["tenant", "landlord"]),
    ],
  },
  "facility-community-operators": {
    title: "Find the official management, Mollak and operating-authority channels.",
    description: "Property, facility and jointly owned property roles can require different appointments and official records.",
    filters: ["Property manager", "Facility manager", "Mollak", "Contract"],
    items: [
      officialDirectoryItem("Real-estate activity licensing", "Official licensing route for the applicable management activity.", "dld.real-estate-licensing", ["manager", "licence"]),
      officialDirectoryItem("Property-management contract", "Official registration route where the management contract service applies.", "dld.management-contract", ["appointment", "contract"]),
      officialDirectoryItem("Mollak service-budget approval", "Official route for the applicable jointly owned property service budget.", "dld.mollak-budget", ["community", "service charge"]),
      pendingDirectoryItem("Live approved-management-company register", "TODO: connect data source. Confirm the company and activity through the competent official channel."),
    ],
  },
};

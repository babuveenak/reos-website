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

export type StakeholderGuidance = {
  entryTitle: string;
  entryNote: string;
  paths: GuidancePath[];
  challenges: GuidanceChallenge[];
  directory?: {
    title: string;
    description: string;
    sourceId: string;
    filters: string[];
  };
};

const rolePath = (title: string, note: string, steps: GuidanceStep[]): GuidancePath => ({ label: "Role route", title, note, steps });
const challenge = (title: string, why: string, response: string, sourceId?: string): GuidanceChallenge => ({ title, why, response, sourceId });

export const stakeholderGuidance: Record<StakeholderId, StakeholderGuidance> = {
  "landowners-investors": {
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
    ],
  },
  developers: {
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
    ],
  },
  "consultants-designers": {
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
    ],
  },
  "authorities-regulators": {
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
    ],
  },
  "utility-providers": {
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
    ],
  },
  contractors: {
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
    ],
  },
  "suppliers-vendors": {
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
    ],
  },
  "brokers-agencies": {
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
    directory: {
      title: "Verify a broker or brokerage office in the official registry.",
      description: "Search the live Dubai Land Department service. REOS does not copy, rank or certify broker records.",
      sourceId: "dld.broker-directory",
      filters: ["Broker or office", "ORN", "Sale / lease / mortgage", "Project or area"],
    },
  },
  "banks-financial": {
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
    ],
  },
  "property-owners": {
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
    ],
  },
  "residents-tenants": {
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
    ],
  },
  "facility-community-operators": {
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
    ],
  },
};

# REOS Seven-Gateway Development Process Blueprint

**Purpose:** Authoritative content source for a visual, plain-language project-delivery website  
**Primary audience:** Owners, developers, project directors, consultants, contractors, authorities, operators and non-technical stakeholders  
**Default context:** Real-estate and infrastructure development; jurisdiction-specific authority requirements must be configured and verified locally  
**Blueprint version:** 2.0 — human-centered, step-confirmed and end-to-end traceable

## 1. The whole journey in one line

```text
Opportunity
  -> G1 Feasibility
  -> G2 Authority
  -> G3 Design
  -> G4 Tendering
  -> G5 Construction
  -> G6 Handover
  -> G7 Post Handover
  -> Performing Asset + Lessons for the Next Project
```

Every gateway answers five questions:

1. Where are we?
2. What must happen now?
3. What evidence proves it?
4. Who decides?
5. What happens next?

## 2. Common gateway operating model

Each gateway uses the same repeatable flow:

```text
Inputs -> Work -> Checks -> Evidence Pack -> Gate Review -> Decision -> Controlled Baseline -> Next Gateway
```

### Gate decisions

- **Proceed:** all mandatory criteria are met; move to the next baseline.
- **Proceed with conditions:** only named, owned and time-bound non-critical actions remain.
- **Revise and resubmit:** material gaps must be corrected before progressing.
- **Hold:** an external dependency, strategic decision or material risk prevents a decision.
- **Stop:** the project is no longer viable, compliant or aligned with the approved strategy.

“Proceed with conditions” must never be used to bypass a legal approval, life-safety requirement, funding limit or other critical control.

### Minimum evidence on every item

```text
Evidence ID | Gateway | Requirement | Owner | Reviewer | Status | Version
Source file/link | Decision/date | Conditions | Due date | Audit history
```

### Mandatory confirmation for every process step

Every arrow in every gateway flow is a controlled step. A step cannot be shown as complete merely because work occurred. It must carry this confirmation record:

```text
Step ID | Gateway ID | Group ID | Step title | Purpose
Required inputs + source IDs | Responsible owner | Accountable owner
Planned/actual dates | Required output IDs | Evidence IDs
Prepared by/date | Reviewed by/date | Accepted by/date
Status | Conditions | Dependencies | Next-step ID | Version | Audit history
```

The platform must apply four checks in order:

1. **Prepare:** the responsible person confirms the output exists and identifies its source.
2. **Review:** a competent reviewer checks quality, consistency and requirement coverage.
3. **Accept:** the accountable authority accepts, rejects or conditionally accepts it.
4. **Transition:** the system confirms all mandatory inputs for the next step are linked and valid.

Self-acceptance is prohibited where maker-checker separation is required. A rejection or material change reopens the affected step and every downstream item whose basis is no longer valid.

### Meaning of 100% data completeness

“100% data” means every mandatory field, relationship, confirmation and evidence link required by the approved process is present and validated. It does **not** mean an external source is automatically true.

A gateway may report `100% complete` only when:

- every mandatory step has one valid status and accountable owner;
- every required input traces to an accepted source record;
- every required output has a unique ID, version and evidence source;
- every critical item has independent review and authorized acceptance;
- all 12 delivery groups have a recorded outcome for that gateway;
- every `Not applicable` decision has an authorized reason;
- no orphan record, broken link, superseded evidence or unresolved critical condition exists;
- referential-integrity, duplicate, version and transition checks pass;
- the receiving gateway confirms it can use the transferred baseline.

Use this calculation:

```text
Completeness = validated mandatory fields and links / total mandatory fields and links
Gate-ready = Completeness equals 100% AND critical blockers equal 0
```

Do not round 99.5% to 100%. Display completeness separately from factual assurance, approval status and user-happiness measures.

### Status language

- **Not started** — no accountable work has begun.
- **In progress** — work is active and evidence is incomplete.
- **At risk** — the outcome or target date needs intervention.
- **Blocked** — progress requires a named dependency or decision.
- **Ready for review** — owner states the acceptance evidence is complete.
- **Accepted** — the authorized reviewer has accepted the item.
- **Accepted with condition** — acceptance includes a named, dated obligation.
- **Rejected** — the evidence does not satisfy the requirement.
- **Not applicable** — the authorized reviewer has recorded a reason.

### Cross-cutting controls

These tracks run through all seven gateways:

- business case, funding and benefits;
- scope and requirements;
- programme and milestones;
- cost plan, cash flow and change control;
- risk, opportunity and decision logs;
- land, legal, title and statutory compliance;
- authority approvals and conditions;
- design, BIM, information and document control;
- procurement and contract administration;
- quality, HSE, sustainability and accessibility;
- stakeholder, customer and communications management;
- testing, commissioning, asset data and operational readiness;
- lessons learned and auditable records.

## 3. Roles and decision rights

| Role | Core responsibility |
|---|---|
| Project Sponsor / Investment Committee | Own strategic alignment, funding and go/stop decisions |
| Development Director / Project Director | Accountable for the integrated gateway submission |
| Gateway Manager / PMO | Owns criteria, evidence index, review agenda, actions and audit trail |
| Discipline and Workstream Leads | Produce and self-check evidence in their scope |
| Cost, Planning, Risk and Commercial Leads | Independently challenge cost, time, risk and procurement readiness |
| Design Lead / Lead Consultant | Coordinates design, compliance and design-stage deliverables |
| Authority Liaison | Manages the verified approval matrix, submissions, responses and conditions |
| Main Contractor / Package Contractors | Deliver construction, quality records and completion evidence |
| HSE and Quality Leads | Verify mandatory HSE and quality controls independently of production pressure |
| Operator / FM / Asset Owner | Defines operational requirements and accepts maintainable asset information |
| Independent Reviewer, where required | Provides objective assurance for critical or regulated outcomes |
| Gate Chair / Authorized Approver | Records one formal gateway decision and any conditions |

The producer of an item should not be its only approver. Statutory approval remains an authority decision; an internal gate cannot replace it.

## 4. Twelve integrated delivery groups

The platform must organize the full lifecycle into exactly 12 connected groups. Each group combines its stakeholders, controlled documents/data and recurring process responsibility.

| ID | Group | Principal stakeholders | Controlled documents/data | Recurring process and confirmation |
|---|---|---|---|---|
| GR01 | Sponsor, strategy and benefits | Sponsor, investment committee, development director | mandate, objectives, business case, benefits register, decisions | confirm strategic fit, funding authority and benefit ownership |
| GR02 | User, customer and stakeholder experience | users, buyers/occupants, community, customer care, accessibility representatives | personas, journey maps, requirements, communications, feedback, complaints | research needs, validate touchpoints, measure effort/satisfaction and close recovery actions |
| GR03 | PMO, gateway and information governance | project director, PMO, gateway manager, document controller | gateway plan, RACI, evidence index, action/decision logs, baselines, audit trail | control steps, versions, reviews, acceptance and gateway transitions |
| GR04 | Land, legal, title and compliance | landowner, legal counsel, surveyor, compliance officer | title/land records, surveys, agreements, obligations, compliance register | verify rights, boundaries, obligations and controlled legal acceptance |
| GR05 | Authorities, utilities and permits | authority liaison, regulators, municipalities, utility providers, civil defence where applicable | authority matrix, NOCs, permits, submissions, comments, conditions, expiry data | verify the applicable route, submit, close comments and track conditions |
| GR06 | Finance, cost and funding | finance, funder, cost consultant, development manager | cost plans, revenue assumptions, cash flow, funding approvals, forecasts | validate affordability, funding, sensitivities, changes and financial exposure |
| GR07 | Planning, logistics and controls | planner, logistics lead, project controls, delivery leads | master programme, milestones, dependencies, logistics plans, progress data | validate sequence, critical path, resources, progress and recovery plans |
| GR08 | Risk, assurance, HSE and sustainability | risk lead, independent reviewer, HSE, quality, ESG/sustainability leads | risk/opportunity registers, assurance plans, HSE files, sustainability targets, audit findings | identify, independently challenge, mitigate and accept residual exposure |
| GR09 | Design, BIM and technical integration | architects, engineers, BIM/information manager, specialists, operator representatives | brief, models, drawings, calculations, specifications, interfaces, design-change log | trace requirements, coordinate, verify, freeze and control technical information |
| GR10 | Commercial, procurement and contracts | commercial lead, procurement, bidders, contract administrator, legal counsel | procurement strategy, tender pack, bids, evaluations, contract, changes, claims | procure fairly, allocate risk, execute contracts and administer obligations |
| GR11 | Construction, quality and commissioning | contractor, subcontractors, supervision consultant, quality and commissioning teams | submittals, RFIs, ITPs, inspections, tests, progress, defects, commissioning records | build safely, verify conformance, test systems and prove completion |
| GR12 | Operations, FM, handover and lifecycle performance | asset owner, operator, FM, customer care, warranty and service teams | asset register, as-builts, O&M manuals, training, warranties, defects, performance KPIs | accept usable asset data, operate, support users, correct defects and feed lessons forward |

### Seven-gateway by 12-group linkage matrix

Every cell is mandatory. A cell may be `Not applicable` only through the authorized process above.

| Group | G1 Feasibility | G2 Authority | G3 Design | G4 Tendering | G5 Construction | G6 Handover | G7 Post Handover |
|---|---|---|---|---|---|---|---|
| GR01 Strategy | approve mandate/options | confirm strategic conditions | approve design baseline | authorize award | govern material variance | accept benefit readiness | verify benefits/closeout |
| GR02 User experience | confirm user needs | validate stakeholder pathway | test journeys/accessibility | contract service standards | manage disruption/comms | validate handover experience | measure happiness/recovery |
| GR03 Governance | establish IDs/RACI | control approval evidence | freeze/version design | audit tender decision | control records/changes | verify transfer baseline | archive/lessons loop |
| GR04 Land/legal | verify title/rights | confirm legal conditions | trace land obligations | allocate legal risk | monitor compliance | confirm transfer obligations | close residual obligations |
| GR05 Authorities | map approval route | secure/track approvals | verify design compliance | include permit duties | pass inspections/conditions | secure completion clearances | maintain operational compliance |
| GR06 Finance/cost | validate business case | price approval impacts | control design-to-budget | validate bid/award | forecast cost/change | confirm handover liabilities | close final account/benefits |
| GR07 Planning | test master timeline | integrate authority dates | validate design/procurement path | validate bidder programme | verify progress/recovery | coordinate transition dates | close deferred obligations |
| GR08 Risk/HSE/ESG | establish risk profile | assure statutory risks | close design risks | evaluate bidder controls | assure HSE/quality/ESG | accept residual safe-use risks | verify performance/lessons |
| GR09 Design/BIM | test options/capacity | develop compliant basis | coordinate/freeze design | answer controlled queries | control RFIs/as-builts | accept verified asset information | update lifecycle information |
| GR10 Commercial | select procurement route | plan approval obligations | package scope/interfaces | run fair tender/contract | administer change/claims | certify contractual completion | settle/close contracts |
| GR11 Build/quality | advise buildability | plan enabling constraints | verify methods/commissioning | validate delivery capability | build/inspect/test | demonstrate completion/train | correct defects/deferred tests |
| GR12 Operations/FM | define operating outcomes | identify operating permits | review maintainability | specify O&M/warranty duties | prepare mobilization/assets | accept operations transfer | operate/measure/improve |

Each matrix cell must link to at least one Step ID, responsible Group ID, required output/evidence ID and confirmation state. The user interface must allow the user to move from gate to group, group to record, and record back to its source without losing context.

## 5. Gateway 1 — Feasibility

**Question:** Should we invest more time and money in this opportunity?

### Flow

```text
G1-S01 Confirm opportunity brief
 -> G1-S02 Verify land/title and legal due diligence
 -> G1-S03 Validate market and demand
 -> G1-S04 Confirm site, access, utility and environmental constraints
 -> G1-S05 Compare development options and capacity
 -> G1-S06 Validate planning/authority pathway
 -> G1-S07 Test programme and procurement options
 -> G1-S08 Validate cost, revenue, cash flow and sensitivities
 -> G1-S09 Confirm risk/opportunity responses
 -> G1-S10 Approve preferred option and business case
 -> G1-S11 Record investment-gate decision and baseline
```

### Essential inputs

- sponsor objectives and success measures;
- land and ownership information;
- available surveys, planning controls and utility information;
- market, customer and product assumptions;
- funding, return and time constraints;
- lessons from comparable projects.

### Exit criteria

- land/title position and material legal constraints are understood;
- a preferred development option is supported by evidence;
- demand, capacity, cost, revenue, time and funding assumptions are traceable;
- utility, access, environmental, social and authority constraints are identified;
- sensitivities show what could make the project unviable;
- top risks have owners and realistic responses;
- the next-stage scope, budget, team and programme are approved.

### Controlled outputs

- approved feasibility/business case;
- preferred option and scope boundary;
- feasibility cost plan and funding profile;
- initial master programme;
- due-diligence, risk, opportunity and assumption registers;
- initial authority and stakeholder maps;
- next-gateway execution plan.

### Typical red flags

Unverified land rights, hidden utility diversion, optimistic sales assumptions, missing access strategy, unsupported authority assumptions, excluded enabling works, or a business case that works only in one perfect scenario.

## 6. Gateway 2 — Authority

**Question:** Is there a verified, achievable route to all required statutory approvals?

### Flow

```text
G2-S01 Accept feasibility baseline
 -> G2-S02 Verify jurisdiction and asset-specific authorities
 -> G2-S03 Build approval/NOC/permit matrix
 -> G2-S04 Confirm codes, submission stages and prerequisites
 -> G2-S05 Complete pre-application engagement
 -> G2-S06 Verify surveys and specialist studies
 -> G2-S07 Prepare coordinated submissions
 -> G2-S08 Submit, track and close comments
 -> G2-S09 Record approvals, conditions and expiry dates
 -> G2-S10 Complete compliance assurance
 -> G2-S11 Record authority-gate decision and baseline
```

### Essential inputs

- approved development option;
- verified site, land and jurisdiction data;
- concept information adequate for early engagement;
- authority, utility-provider and specialist requirements;
- programme dependencies and long-lead approvals.

### Exit criteria

- the authority matrix is verified, owned and linked to the programme;
- required approvals, NOCs, permits, fees, prerequisites and validity periods are known;
- major planning, access, fire/life-safety, environment and utility constraints are resolved or explicitly controlled;
- authority comments and approval conditions are incorporated into the project requirements;
- no internal document is misrepresented as an external authority approval;
- the design team has a clear compliance basis and submission schedule.

### Controlled outputs

- authority and NOC matrix;
- applicable-code and compliance register;
- submission/response tracker and approval repository;
- conditions, commitments and expiry register;
- authority-integrated master programme;
- design compliance brief.

### Typical red flags

Generic authority checklists, expired NOCs, unclosed comments, permits disconnected from the programme, design changes after approval, and approval claims without an authority reference or source document.

## 7. Gateway 3 — Design

**Question:** Is the coordinated design compliant, affordable, buildable, operable and ready for procurement?

### Flow

```text
G3-S01 Accept requirements and authority conditions
 -> G3-S02 Validate design brief and traceability
 -> G3-S03 Develop concept design
 -> G3-S04 Evaluate options and confirm concept
 -> G3-S05 Develop schematic design
 -> G3-S06 Complete multidisciplinary/BIM coordination
 -> G3-S07 Develop detailed design
 -> G3-S08 Close value, buildability, safety and operability reviews
 -> G3-S09 Verify specifications, schedules and calculations
 -> G3-S10 Complete IFC/tender-package quality assurance
 -> G3-S11 Freeze design and record design-gate decision
```

### Essential inputs

- approved project and user requirements;
- authority conditions and applicable codes;
- surveys, investigations and utility information;
- budget, programme, procurement and sustainability targets;
- operator/FM and maintainability requirements.

### Exit criteria

- scope and requirements are traceable into the design;
- architecture, structure, MEP, fire/life safety, landscape, infrastructure and specialist systems are coordinated;
- clashes and interface risks are within approved tolerances;
- design is supported by calculations, schedules, specifications and verified model/drawing outputs;
- cost plan is within the approved budget or variance is authorized;
- buildability, logistics, HSE-in-design, maintainability and accessibility reviews are closed;
- authority conditions and sustainability commitments are demonstrably satisfied;
- residual design risks, exclusions and contractor-design portions are explicit;
- the baseline is formally frozen and changes are controlled.

### Controlled outputs

- approved design brief and requirements traceability matrix;
- coordinated design/model and drawing register;
- design calculations, reports, schedules and specifications;
- BIM/information delivery records;
- design risk, interface, decision and change logs;
- updated cost plan and programme;
- tender/IFC readiness certificate and package index.

### Typical red flags

Beautiful but unbuildable design, unresolved clashes, cost plan based on old scope, hidden contractor-design obligations, weak interface ownership, missing operator input or uncontrolled “minor” post-freeze changes.

## 8. Gateway 4 — Tendering

**Question:** Can we award a fair, complete and deliverable contract with controlled risk?

### Flow

```text
G4-S01 Accept procurement-ready design
 -> G4-S02 Confirm packaging and contract strategy
 -> G4-S03 Complete market sounding and prequalification
 -> G4-S04 Approve tender documents and evaluation rules
 -> G4-S05 Issue controlled tender
 -> G4-S06 Control clarifications and addenda
 -> G4-S07 Receive and secure bids
 -> G4-S08 Complete compliance, technical and commercial evaluation
 -> G4-S09 Normalize bids and verify risk/capability
 -> G4-S10 Complete permitted negotiation/BAFO
 -> G4-S11 Approve recommendation
 -> G4-S12 Execute award/contract and record tender-gate decision
```

### Essential inputs

- approved procurement strategy;
- complete tender package and scope responsibility matrix;
- budget and pre-tender estimate;
- evaluation methodology and governance rules;
- qualified bidder list and market-capacity view.

### Exit criteria

- all bidders received the same controlled information;
- clarifications, addenda, conflicts and confidentiality are governed;
- bids are evaluated against published technical and commercial criteria;
- exclusions, qualifications, provisional sums and scope gaps are normalized;
- selected bidder has credible resources, programme, methodology, HSE/quality systems and financial capacity;
- price, risk allowances and cash flow fit the approved business case;
- negotiations and approvals are documented and auditable;
- bonds, insurance, licenses, contract documents and conditions precedent are ready or controlled;
- mobilization cannot begin merely on an informal award message.

### Controlled outputs

- tender and addenda register;
- compliant bid records and evaluation report;
- bid normalization and risk allocation schedules;
- approved recommendation to award;
- executed contract or controlled letter of award;
- award cost plan, cash flow and baseline programme;
- mobilization and handover-to-delivery plan.

### Typical red flags

Lowest-price-only selection, unequal bidder information, undocumented negotiation, unpriced exclusions, incomplete design issued as fixed scope, missing bonds/insurance or award before funding and authority prerequisites are secure.

## 9. Gateway 5 — Construction

**Question:** Has the contracted work been safely delivered, verified and made ready for handover?

### Flow

```text
G5-S01 Accept executed contract and approved baseline
 -> G5-S02 Verify mobilization and logistics readiness
 -> G5-S03 Approve submittals, samples and method statements
 -> G5-S04 Control procurement and long-lead items
 -> G5-S05 Construct, inspect and record conformance
 -> G5-S06 Control RFIs, coordination and changes
 -> G5-S07 Verify progress, cost, risk, HSE and quality
 -> G5-S08 Complete systems and pre-commission
 -> G5-S09 Test and commission systems
 -> G5-S10 Control defects/punch items
 -> G5-S11 Confirm completion readiness and construction-gate decision
```

### Essential inputs

- executed contract and approved baseline programme;
- construction permits and authority conditions;
- approved-for-construction information;
- project quality plan, HSE plan, ITPs and method statements;
- procurement, submittal and interface schedules.

### Exit criteria

- scope is physically complete to the defined completion standard;
- inspections, tests and quality records demonstrate conformance;
- life-safety and critical systems are tested with accepted results;
- changes, claims, instructions, RFIs and design revisions are reconciled;
- progress and cost reports match verified site reality;
- statutory inspections and completion prerequisites are satisfied;
- remaining defects are categorized, owned, dated and non-critical to safe use;
- as-built information, O&M data, training and spares are sufficiently mature for handover;
- the operator and handover team confirm operational readiness.

### Controlled outputs

- verified completion status and accepted quality dossier;
- inspection, test and commissioning records;
- approved changes and current contract forecast;
- authority inspection/certificate records;
- as-built and asset-information draft set;
- punch/defect register;
- handover readiness certificate and transition plan.

### Typical red flags

Progress based on invoices rather than site evidence, concealed defects, unapproved materials, tests without calibrated instruments, commissioning left to the final week, incomplete asset data or pressure to hand over before life-safety acceptance.

## 10. Gateway 6 — Handover

**Question:** Can the asset be safely occupied, operated, maintained and contractually accepted?

### Flow

```text
G6-S01 Accept construction-completion evidence
 -> G6-S02 Complete integrated commissioning and witnessing
 -> G6-S03 Verify statutory completion/occupancy evidence
 -> G6-S04 Close critical defects
 -> G6-S05 Accept as-builts, O&M manuals and asset data
 -> G6-S06 Train operators and transfer keys/access/spares
 -> G6-S07 Complete emergency and operational-readiness drills
 -> G6-S08 Complete customer/unit handover where applicable
 -> G6-S09 Verify commercial and contractual completion
 -> G6-S10 Issue applicable acceptance certificates and handover decision
```

### Essential inputs

- construction completion-readiness pack;
- commissioning plan, scripts and results;
- defect/punch register;
- draft as-built, O&M, warranty and asset information;
- operator, customer and statutory acceptance requirements.

### Exit criteria

- required occupancy/completion certificates and authority clearances are valid;
- life-safety, utilities and critical systems are fully operational;
- critical defects are closed and residual items do not prevent safe intended use;
- integrated testing and seasonal/late testing obligations are controlled;
- operator/FM has accepted training, access, spares, warranties, O&M and asset data;
- areas, assets, meters, keys and responsibility boundaries are recorded;
- customer/unit handovers, title-deed or registration interfaces are managed where in scope;
- taking-over/practical-completion decisions follow the contract and are not inferred from occupancy;
- the defects-liability and post-handover plan is active.

### Controlled outputs

- signed asset/area handover records;
- completion, occupancy and taking-over certificates as applicable;
- accepted as-built, O&M, asset register and warranty repository;
- training and operational-readiness records;
- keys, access, spares and responsibility-transfer logs;
- residual defect and deferred-test register;
- post-handover service and communications plan.

### Typical red flags

“Keys handed over” treated as full acceptance, missing authority certificates, incomplete emergency training, editable as-built placeholders, unassigned warranties, customers receiving inconsistent information or title/registration claims beyond the project’s verified scope.

## 11. Gateway 7 — Post Handover

**Question:** Is the asset performing as intended, are obligations closed, and have lessons been captured?

### Flow

```text
G7-S01 Accept asset and obligations register
 -> G7-S02 Stabilize operations and support users
 -> G7-S03 Triage, correct and confirm defects
 -> G7-S04 Complete seasonal/deferred testing
 -> G7-S05 Monitor asset and service KPIs
 -> G7-S06 Control warranties and supplier obligations
 -> G7-S07 Complete post-occupancy and user-happiness evaluation
 -> G7-S08 Close defects-liability obligations
 -> G7-S09 Close final account and contracts
 -> G7-S10 Archive verified records and publish lessons
 -> G7-S11 Verify benefits and record post-handover decision
```

### Essential inputs

- accepted handover pack and asset baseline;
- residual defects, warranty and obligation registers;
- target operational and customer outcomes;
- contracts, service levels and performance criteria;
- feedback and meter/system data.

### Exit criteria

- defects are resolved within classified service levels and root causes are addressed;
- seasonal and deferred tests are complete;
- warranties and supplier obligations are preserved and transferred correctly;
- asset performance is compared with design and business-case targets;
- safety, comfort, reliability, accessibility and customer feedback are reviewed;
- final account, claims, securities and contractual closeout are authorized;
- verified records are complete, searchable and retained;
- lessons have owners and are fed into standards and future feasibility work;
- residual operational risks are accepted by the asset owner.

### Controlled outputs

- closed defect and obligation records;
- post-occupancy and performance report;
- warranty status and final asset-information baseline;
- final account and contract closeout evidence;
- benefits-realization review;
- lessons-learned library and improvement actions;
- final gateway/asset closeout decision.

### Typical red flags

Defects closed administratively but not physically, customer complaints treated as noise, warranty expiry without action, no comparison of actual versus designed performance, lost asset data or lessons captured in a report that no future team can find.

## 12. Gateway review agenda

Run every formal review in this order:

1. Confirm scope, baseline and decision authority.
2. Show the one-screen gateway status map.
3. Review only critical gaps, exceptions, deltas and conditions.
4. Inspect linked evidence for disputed or high-risk items.
5. Confirm cost, programme, risk and authority impacts together.
6. Ask the independent challenge questions.
7. Record one decision, rationale, conditions, owners and dates.
8. Lock the accepted baseline and publish the next-stage brief.

### Independent challenge questions

- What evidence would prove this status wrong?
- Which assumption has the largest cost or time consequence?
- What is being accepted without direct verification?
- Which condition could become a safety, statutory or commercial blocker?
- What changed since the last baseline, and who authorized it?
- Can the receiving team actually use the information being transferred?

## 13. Human-centered service standard

The process exists for people, not merely for documents. Every gateway must satisfy these human-centered checks:

1. **Understandable:** a first-time user can explain the purpose, current status and next action in plain language.
2. **Relevant:** content changes according to the user’s role, decision and task without hiding the whole journey.
3. **Low effort:** information is entered once, reused from its authoritative source and never requested again without a reason.
4. **Transparent:** users can see who owns an action, why it matters, what evidence is required and how a decision was reached.
5. **Inclusive:** the journey supports accessibility, language, device, ability and experience-level differences.
6. **Recoverable:** errors explain what happened, preserve valid work and provide a safe next action.
7. **Trustworthy:** the platform never fabricates status, approval, completeness or happiness.
8. **Respectful:** communications are timely, calm and free of dark patterns, blame or unnecessary urgency.
9. **Closed-loop:** feedback produces a visible response, owner, due date and confirmed outcome.
10. **Measurable:** user effort, satisfaction, completion, complaints, accessibility and service recovery are measured by gateway and role.

## 14. Mandatory end-to-end User Happiness Assurance Loop

The platform cannot guarantee a human emotion. It can guarantee that a complete, measurable and accountable process for understanding, testing, supporting and improving the user experience is executed. This loop is mandatory and spans all seven gateways.

```text
UX-S01 G1 Identify users, needs, risks and accessibility requirements
 -> UX-S02 G1 Agree measurable experience outcomes and listening plan
 -> UX-S03 G2 Validate authority/customer communication touchpoints
 -> UX-S04 G3 Prototype and test critical journeys with representative users
 -> UX-S05 G4 Contract service levels, support and handover obligations
 -> UX-S06 G5 Communicate disruption and test support readiness
 -> UX-S07 G6 Verify expectation, accessibility and operational readiness
 -> UX-S08 G6 Deliver guided handover and capture immediate feedback
 -> UX-S09 G7 Triage feedback, complaints and defects with visible ownership
 -> UX-S10 G7 Measure outcomes at agreed intervals, including 30/90/180 days where applicable
 -> UX-S11 G7 Complete service recovery and confirm closure with affected users
 -> UX-S12 G7 Approve the User Happiness Outcome and feed lessons into the next G1
```

### Mandatory user-outcome dataset

```text
User/role segment ID | Journey/touchpoint ID | Gateway/Step ID
Need/expected outcome | Accessibility/language needs | Consent/privacy basis
Channel | Feedback date | CSAT | effort score | completion outcome
Complaint/defect ID | Severity | Owner | response/resolution target
Actual response/resolution | Recovery action | User closure confirmation
Trend | Root cause | Improvement ID | Verification result | Audit history
```

Use anonymous or aggregated data where personal identification is unnecessary. Never expose an individual’s sentiment or accessibility information beyond authorized purposes.

### Outcome measures

The product owner must approve thresholds before G1 closes. At minimum measure:

- successful journey completion by role and critical task;
- customer/user satisfaction after meaningful touchpoints;
- user effort required to complete the task;
- accessibility defects and successful accommodation;
- complaints, severity, first response and resolution time;
- defect recurrence and first-time resolution;
- adoption and abandonment at critical steps;
- qualitative themes and verified improvement outcomes.

NPS may be included, but it must never be the only happiness measure. Do not combine unlike measures into a misleading score without publishing the formula, sample size and limitations.

### Mandatory closure rule

The post-handover gateway cannot close until:

- `UX-S01` through `UX-S12` each has prepared, reviewed and accepted confirmation;
- required measurements meet the project-approved thresholds; **or** every gap has an accepted recovery plan, accountable owner, due date and sponsor/asset-owner risk acceptance;
- all critical safety, accessibility, privacy and unresolved high-severity user issues equal zero;
- affected users have been told the outcome through the appropriate channel;
- completed improvements have verification evidence;
- lessons and reusable user insights are linked into the next Feasibility Gateway.

The website must describe this honestly as **User Happiness Assurance**, never as a guaranteed emotional outcome.

## 15. Content rules for the website

- Use plain language first; reveal specialist detail on demand.
- Keep each visible flow node to a title plus no more than 25 words.
- Lead with status, purpose, owner, evidence and next action.
- Use verbs for actions and nouns for evidence.
- Never use “approved,” “certified,” “complete” or “compliant” without a named decision/evidence source.
- Distinguish an internal gateway decision from an authority, contractual or customer acceptance.
- Label jurisdiction-specific examples clearly; do not present them as universal law.
- Use one stable color, number, icon and isometric landmark for each gateway.
- Encode status with words and shapes as well as color.
- Provide a reduced-motion, keyboard-operable and screen-reader-readable alternative to every visual journey.

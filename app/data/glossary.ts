/**
 * GLOSSARY
 *
 * The site is written for readers with no prior knowledge of UAE property, so
 * local terms are explained at the point of use rather than assumed. Each entry
 * is one plain sentence — enough to keep reading, not a legal definition.
 *
 * Definitions describe general market practice. Where a term has a regulated
 * meaning that differs by emirate, the entry says so instead of picking one.
 */

export type Term = {
  id: string;
  term: string;
  /** Other spellings and phrasings that should resolve to this entry. */
  aka?: string[];
  short: string;
  /** Fuller explanation for the glossary page. */
  long: string;
  jurisdictional?: boolean;
};

export const terms: Term[] = [
  {
    id: "off-plan", term: "off-plan", aka: ["off plan"],
    short: "Buying a property before it is built, paying in instalments as construction progresses.",
    long: "An off-plan purchase commits you to a unit that does not exist yet. You pay against a schedule tied to construction milestones rather than all at once, the sale is recorded on the official register, and your money is held in a regulated escrow account rather than by the developer. The trade-off is price against delivery risk.",
  },
  {
    id: "escrow", term: "escrow", aka: ["escrow account", "escrow trustee"],
    short: "A regulated bank account that holds buyers' money for one specific project, released only against verified construction progress.",
    long: "For off-plan sales the developer must open an escrow account with an approved bank, tied to that single project. Buyer payments go into it rather than to the developer directly, and funds are released against progress that has been independently certified. It exists so that money paid for a building under construction cannot be spent elsewhere.",
    jurisdictional: true,
  },
  {
    id: "snagging", term: "snagging", aka: ["snag list", "snagging list"],
    short: "Inspecting a finished property and recording every defect in writing before you accept it.",
    long: "Snagging is the inspection you carry out at handover. Defects are listed, dated and shared with the developer, who remains responsible for putting them right during the defects liability period. Recording them informally is the most common and most expensive mistake buyers make at this point.",
  },
  {
    id: "dlp", term: "defects liability period", aka: ["DLP", "liability period"],
    short: "The window after handover during which the developer must fix defects at their own cost.",
    long: "A contractual period following completion in which the developer or contractor remains responsible for rectifying defects. Its length and what it covers are set by contract and by law, and structural cover often runs far longer than general cover. Faults that surface after it expires become the owner's problem.",
    jurisdictional: true,
  },
  {
    id: "service-charge", term: "service charge",
    short: "The annual amount owners pay towards running and maintaining the shared parts of a building or community.",
    long: "Service charges fund cleaning, security, insurance, lifts, landscaping and the reserve fund for future major works. They are budgeted per building or community, usually require regulatory approval, and are charged by area. They are a permanent cost of ownership, not a one-off.",
    jurisdictional: true,
  },
  {
    id: "owners-association", term: "owners' association", aka: ["owners association", "OA"],
    short: "The body of all owners in a building or community, which collectively controls its shared areas.",
    long: "Every owner of a unit is automatically a member. The association sets the budget, approves the service charge and appoints the company that manages the property day to day. The association is the owners; the management company is the operator it hires.",
    jurisdictional: true,
  },
  {
    id: "reserve-fund", term: "reserve fund",
    short: "Money set aside from service charges to pay for major replacements years in advance.",
    long: "Lifts, chillers, roofs and facades all reach end of life on a schedule. A reserve fund saves for those replacements so they do not arrive as a sudden levy on owners. It should be sized against a condition-based replacement schedule, not set as a flat percentage.",
  },
  {
    id: "noc", term: "no-objection certificate", aka: ["NOC", "NOCs"],
    short: "A written confirmation from an authority, utility or developer that it has no objection to something proceeding.",
    long: "Development and transaction processes are gated by NOCs from parties whose interests could be affected — a utility provider, a road authority, a master developer, or a developer confirming an owner has cleared their dues. Each has its own issuer, conditions and validity, and a missing one stops everything downstream.",
    jurisdictional: true,
  },
  {
    id: "spv", term: "special purpose vehicle", aka: ["SPV"],
    short: "A company created to own and deliver one project, so that project's risks stay separate from everything else.",
    long: "Developers commonly form a company for a single project. It holds the land, signs the contracts, borrows the money and sells the units. Keeping it separate protects other assets if the project fails, and gives lenders and investors a defined thing to secure against.",
  },
  {
    id: "development-controls", term: "development controls",
    short: "The rules set by the planning authority for a specific plot — how tall, how dense and what use is permitted.",
    long: "Every plot carries controls covering permitted use, height, floor area ratio, setbacks, parking and coverage. They are issued by whichever authority governs that plot, and a master community may layer further private requirements on top. They determine whether a scheme is possible before design begins.",
    jurisdictional: true,
  },
  {
    id: "permitted-use", term: "permitted use",
    short: "What a plot or unit is legally allowed to be used for — residential, commercial, hotel, retail and so on.",
    long: "Permitted use is recorded against the plot and enforced through planning and licensing. Buying land intending to build something its permitted use does not allow is one of the more expensive early mistakes in development, and changing use is not routinely granted.",
    jurisdictional: true,
  },
  {
    id: "registration-trustee", term: "registration trustee",
    short: "An office authorised to process property transfers on the land department's behalf.",
    long: "Rather than every transaction passing through a single government counter, authorised trustee offices verify parties and documents and complete registration. They act under the land department's authority, and which offices are authorised differs by emirate.",
    jurisdictional: true,
  },
  {
    id: "absorption", term: "absorption",
    short: "How quickly a market takes up available units — the rate at which supply actually sells or leases.",
    long: "Absorption tells you how long it takes for new supply to be taken up at a given price. A feasibility study that assumes faster absorption than the submarket has ever achieved will produce a return that does not exist.",
  },
  {
    id: "master-developer", term: "master developer",
    short: "The organisation that plans a whole district and sets the rules other developers must build to within it.",
    long: "A master developer delivers the infrastructure, roads and utilities for a large area, then sells or leases plots to other developers. It sets design and community requirements that sit alongside public approvals, and its consent is often needed before a plot can proceed.",
  },
  {
    id: "handover", term: "handover",
    short: "The point at which a completed property transfers from the developer to the buyer.",
    long: "Handover follows completion approval. The developer notifies the buyer, final payment and transfer complete, the unit is inspected, defects are recorded and keys, warranties and manuals change hands. It is a process with prerequisites, not a single date.",
  },
  {
    id: "consultant-of-record", term: "consultant of record",
    short: "The licensed engineer or architect who signs the submissions and carries the design liability.",
    long: "Authorities accept submissions from a licensed professional who takes statutory responsibility for the design. That liability is personal and institutional and survives the project, which is why the appointment matters more than the fee.",
  },
];

export const termById = Object.fromEntries(terms.map((t) => [t.id, t]));

/** Lookup by term or any alias, case-insensitive. */
export const findTerm = (needle: string): Term | undefined => {
  const n = needle.trim().toLowerCase();
  return terms.find((t) => t.term.toLowerCase() === n || t.aka?.some((a) => a.toLowerCase() === n));
};

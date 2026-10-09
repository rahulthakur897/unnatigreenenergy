import {
  Atom,
  BadgeCheck,
  BatteryCharging,
  Eye,
  Factory,
  FileCheck,
  HandCoins,
  Handshake,
  HardHat,
  Headset,
  Layers,
  Leaf,
  Lightbulb,
  Network,
  Recycle,
  RefreshCcw,
  Scale,
  ScanSearch,
  ShieldCheck,
  Sprout,
  Sun,
  Truck,
  type LucideIcon,
} from "lucide-react";

type Feature = { title: string; text: string; icon: LucideIcon };

/* -------------------------------------------------------------------------- */
/* Trust bar                                                                   */
/* -------------------------------------------------------------------------- */

export const trustHighlights: { label: string; icon: LucideIcon }[] = [
  { label: "Accountable Battery Trading", icon: ShieldCheck },
  { label: "Careful Lot Inspection", icon: BadgeCheck },
  { label: "Recovery-First Thinking", icon: Leaf },
  { label: "Clear, Documented Deals", icon: Scale },
  { label: "Ready for Industrial Volumes", icon: Factory },
];

/**
 * Formal credentials (certifications, registrations, authorisations).
 * Intentionally empty: none have been provided. Add only verified credentials, e.g.
 * { label: "ISO 14001:2015", detail: "Environmental Management" } — TODO: confirm before adding.
 * The trust bar renders this list automatically when it is not empty.
 */
export const credentials: { label: string; detail: string }[] = [];

/* -------------------------------------------------------------------------- */
/* Process                                                                     */
/* -------------------------------------------------------------------------- */

export const processSteps: Feature[] = [
  {
    title: "Sourcing & Pickup",
    text: "We collect scrap from manufacturers, businesses and aggregators — after first learning what the material is, what state it is in and how much there is.",
    icon: Truck,
  },
  {
    title: "Inspection & Sorting",
    text: "Each lot is checked and sorted by chemistry, format and condition, so the record matches what is actually there.",
    icon: ScanSearch,
  },
  {
    title: "Safe Handling",
    text: "Packing, storage and transport are planned to keep the risk of short circuits, leaks and physical damage low.",
    icon: HardHat,
  },
  {
    title: "Recovery Routing",
    text: "Material that suits recovery is sent on to processes where its metals and usable parts can be reclaimed.",
    icon: Atom,
  },
  {
    title: "Back Into Circulation",
    text: "Reclaimed materials and serviceable parts re-enter recycling and manufacturing supply chains.",
    icon: Recycle,
  },
  {
    title: "Shared Value",
    text: "Your scrap earns a return for your business and contributes to a cleaner, more circular energy sector.",
    icon: HandCoins,
  },
];

/* -------------------------------------------------------------------------- */
/* Why choose us                                                               */
/* -------------------------------------------------------------------------- */

export const whyChooseUs: Feature[] = [
  { title: "Care at Every Step", text: "Each battery is handled attentively and sent only to suitable downstream channels.", icon: ShieldCheck },
  { title: "Open, Honest Dealings", text: "You see how we arrive at our offer, agree clear terms and receive full records for each lot.", icon: Scale },
  { title: "Accurate Descriptions", text: "Thorough checks and sorting mean material is recorded as it really is.", icon: BadgeCheck },
  { title: "A Dependable Network", text: "Relationships across the battery value chain help keep material moving without delays.", icon: Network },
  { title: "A Recovery Mindset", text: "Reclaiming materials and cutting waste shape the decisions we make.", icon: Leaf },
  { title: "Partners, Not One-Off Deals", text: "We aim to earn repeat business through steady, reliable work.", icon: Handshake },
  { title: "Sector Know-How", text: "We understand cell formats, chemistries and how different industries generate scrap.", icon: Lightbulb },
  { title: "A Responsive Team", text: "Quick replies, on-time coordination and respect for your schedule.", icon: Headset },
];

/* -------------------------------------------------------------------------- */
/* Quality & safety                                                            */
/* -------------------------------------------------------------------------- */

export const qualityPillars: Feature[] = [
  { title: "Careful Handling", text: "Batteries are packed and stored to keep the risks of short circuits, leaks and impact damage as low as possible.", icon: HardHat },
  { title: "Lot Inspection", text: "Every lot is checked for type, format and condition before it moves, so its description is accurate.", icon: ScanSearch },
  { title: "Proper Segregation", text: "Sorting by chemistry, format and condition helps each lot reach a suitable recovery process.", icon: Layers },
  { title: "Planned Logistics", text: "Pickups and dispatches are arranged with the right packing and transport for the material.", icon: Truck },
  { title: "Clear Records", text: "Material, quantity and agreed terms are documented for every transaction.", icon: FileCheck },
  { title: "Care for the Environment", text: "The aim is straightforward: keep battery materials in use and out of landfill.", icon: Sprout },
];

/* -------------------------------------------------------------------------- */
/* Sustainability                                                              */
/* -------------------------------------------------------------------------- */

export const sustainabilityBenefits: Feature[] = [
  { title: "Materials Reclaimed", text: "Metals locked inside used batteries can be recovered rather than lost for good.", icon: Atom },
  { title: "Less Waste", text: "Diverting batteries from landfill and informal scrapping lowers environmental risk.", icon: Leaf },
  { title: "A Closed Loop", text: "Recovered materials can feed back into manufacturing, closing the battery loop.", icon: RefreshCcw },
  { title: "Less New Mining", text: "Reclaimed materials can ease reliance on freshly mined resources.", icon: Scale },
  { title: "Better Industrial Habits", text: "Organised scrap management helps businesses deal with battery waste properly.", icon: Factory },
  { title: "A Stronger Clean-Energy Chain", text: "Handling batteries well at end of life supports the wider shift to clean energy.", icon: Sun },
];

export const sustainabilityPrinciples = [
  { title: "Recovery comes first", text: "We see every battery as a store of materials. Throwing it away is never our starting point." },
  { title: "Safety is non-negotiable", text: "Lithium-ion batteries need careful treatment, so safe packing, storage and transport always come first." },
  { title: "Say what we see", text: "Accurate descriptions, fair assessments and full records build trust with everyone in the chain." },
  { title: "Think long term", text: "Steady relationships turn responsible recovery into a routine rather than a one-off." },
];

/* -------------------------------------------------------------------------- */
/* Circular economy loop                                                       */
/* -------------------------------------------------------------------------- */

export const circularStages: Feature[] = [
  { title: "In Use", text: "Throughout their working life, lithium-ion batteries run vehicles, devices, storage systems and industrial machines.", icon: BatteryCharging },
  { title: "Collection", text: "Once they reach end of life — or turn up as surplus or production scrap — batteries are gathered from businesses and aggregators.", icon: Truck },
  { title: "Sorting", text: "Each lot is checked and separated by chemistry, format and condition.", icon: Layers },
  { title: "Recovery", text: "Batteries suited to recovery are sent to processes that can reclaim their valuable materials.", icon: Atom },
  { title: "Recycling", text: "Depending on chemistry, materials such as lithium, nickel, cobalt, copper and aluminium are processed for reuse.", icon: Recycle },
  { title: "Reuse", text: "Recovered materials and still-usable parts return to manufacturing and the broader supply chain.", icon: RefreshCcw },
  { title: "Renewed Value", text: "What was waste becomes useful again, supporting cleaner energy and a more circular economy.", icon: Sprout },
];

/* -------------------------------------------------------------------------- */
/* About                                                                       */
/* -------------------------------------------------------------------------- */

export const focusAreas = [
  { title: "Accountable Sourcing", text: "We source scrap through traceable channels and describe each lot's material and condition clearly." },
  { title: "Scrap Trading", text: "We buy and trade lithium-ion cells, packs and modules on the basis of open, fair evaluation." },
  { title: "Material Recovery", text: "We direct material to channels that can reclaim the resources inside it." },
  { title: "Sustainability", text: "We treat every used battery as a resource with more to give." },
  { title: "Open Practices", text: "Clear terms, fair assessments and complete paperwork in every deal." },
  { title: "Lasting Partnerships", text: "We build long-running relationships with the businesses we serve." },
  { title: "Environmental Care", text: "We keep battery waste away from landfill and informal scrapping." },
];

export const values: Feature[] = [
  {
    title: "Responsibility",
    text: "We prioritize responsible battery scrap management through appropriate handling practices, careful material evaluation, and reliable recovery channels that support safer and more sustainable resource utilization.",
    icon: ShieldCheck,
  },
  {
    title: "Transparency",
    text: "We believe strong business relationships begin with honesty. From material specifications and quality assessments to pricing discussions and transaction documentation, we value clarity at every stage of the trading process.",
    icon: Eye,
  },
  {
    title: "Quality & Integrity",
    text: "We emphasize accurate material identification, consistent evaluation practices, and clear descriptions of battery cells, packs, and modules to help our business partners make informed commercial decisions.",
    icon: BadgeCheck,
  },
  {
    title: "Collaborative Partnerships",
    text: "We build lasting relationships through dependable communication, mutual respect, and a shared commitment to sustainable business growth, creating opportunities for collaboration across the battery and recycling ecosystem.",
    icon: Handshake,
  },
  {
    title: "Sustainable Progress",
    text: "Inspired by the meaning of Unnati—progress—we strive to advance responsible battery material trading, encourage circular resource utilization, and contribute to a future where valuable materials are given opportunities for recovery and reuse.",
    icon: Sprout,
  },
];

export const heroChecks = ["Accountable sourcing", "Documented transactions", "Bulk & industrial volumes"];

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
  { label: "Responsible Battery Trading", icon: ShieldCheck },
  { label: "Quality-Focused Operations", icon: BadgeCheck },
  { label: "Sustainable Approach", icon: Leaf },
  { label: "Transparent Transactions", icon: Scale },
  { label: "Industrial-Grade Solutions", icon: Factory },
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
    title: "Collection / Sourcing",
    text: "We source battery scrap from businesses, manufacturers and aggregators — starting with a clear picture of material type, condition and volume.",
    icon: Truck,
  },
  {
    title: "Inspection & Segregation",
    text: "Material is inspected and segregated by chemistry, format and condition so every lot is described accurately.",
    icon: ScanSearch,
  },
  {
    title: "Responsible Handling",
    text: "Batteries are packed, stored and moved with care to reduce the risk of damage, leakage or short-circuit.",
    icon: HardHat,
  },
  {
    title: "Material Recovery",
    text: "Suitable material is routed toward recovery processes where valuable metals and components can be reclaimed.",
    icon: Atom,
  },
  {
    title: "Reuse / Recycling Ecosystem",
    text: "Recovered materials and usable components move back into the recycling and manufacturing ecosystem.",
    icon: Recycle,
  },
  {
    title: "Value Creation",
    text: "Businesses unlock value from waste while contributing to a cleaner, circular energy economy.",
    icon: HandCoins,
  },
];

/* -------------------------------------------------------------------------- */
/* Why choose us                                                               */
/* -------------------------------------------------------------------------- */

export const whyChooseUs: Feature[] = [
  { title: "Responsible Approach", text: "Battery scrap is handled with care and directed to appropriate downstream channels.", icon: ShieldCheck },
  { title: "Transparent Transactions", text: "Clear evaluation, straightforward terms and complete records for every lot.", icon: Scale },
  { title: "Quality-Focused Handling", text: "Careful inspection and segregation so material is described accurately.", icon: BadgeCheck },
  { title: "Reliable Supply Network", text: "Working relationships across the battery value chain keep material moving.", icon: Network },
  { title: "Sustainable Practices", text: "Every decision is guided by resource recovery and reducing waste.", icon: Leaf },
  { title: "Long-Term Partnerships", text: "We value consistent, repeat relationships over one-off transactions.", icon: Handshake },
  { title: "Industry Understanding", text: "Familiarity with cell formats, chemistries and the needs of different sectors.", icon: Lightbulb },
  { title: "Professional Service", text: "Responsive communication, punctual coordination and respect for your timelines.", icon: Headset },
];

/* -------------------------------------------------------------------------- */
/* Quality & safety                                                            */
/* -------------------------------------------------------------------------- */

export const qualityPillars: Feature[] = [
  { title: "Safe Handling", text: "Batteries are handled, packed and stored with care to minimise risks such as short-circuit, damage and leakage.", icon: HardHat },
  { title: "Quality Inspection", text: "Lots are checked for type, format and condition so material is described accurately before it moves on.", icon: ScanSearch },
  { title: "Responsible Segregation", text: "Material is separated by chemistry, format and condition to support appropriate downstream recovery.", icon: Layers },
  { title: "Reliable Logistics", text: "Collection and dispatch are coordinated with suitable packing and transport arrangements.", icon: Truck },
  { title: "Transparent Documentation", text: "Every transaction is supported by clear records of material, quantity and agreed terms.", icon: FileCheck },
  { title: "Environmental Responsibility", text: "Our goal is simple: keep battery materials out of landfill and in productive use.", icon: Sprout },
];

/* -------------------------------------------------------------------------- */
/* Sustainability                                                              */
/* -------------------------------------------------------------------------- */

export const sustainabilityBenefits: Feature[] = [
  { title: "Resource Recovery", text: "Valuable metals inside used batteries can be reclaimed instead of lost.", icon: Atom },
  { title: "Reduced Waste", text: "Keeping batteries out of landfill and informal disposal reduces environmental risk.", icon: Leaf },
  { title: "Circular Economy", text: "Materials flow back into manufacturing, closing the loop on battery production.", icon: RefreshCcw },
  { title: "Responsible Material Use", text: "Recovered materials can reduce dependence on newly mined resources.", icon: Scale },
  { title: "Cleaner Industrial Practices", text: "Structured scrap management helps businesses handle battery waste responsibly.", icon: Factory },
  { title: "Sustainable Energy Ecosystem", text: "Responsible end-of-life handling strengthens the clean-energy transition.", icon: Sun },
];

export const sustainabilityPrinciples = [
  { title: "Recover before discard", text: "Every battery is treated as a source of materials first — disposal is never the default." },
  { title: "Handle with care", text: "Lithium-ion batteries demand respect. Safe packing, storage and movement come first." },
  { title: "Be transparent", text: "Clear descriptions, honest evaluations and complete records build trust across the chain." },
  { title: "Build for the long term", text: "Lasting relationships make responsible recovery consistent, not occasional." },
];

/* -------------------------------------------------------------------------- */
/* Circular economy loop                                                       */
/* -------------------------------------------------------------------------- */

export const circularStages: Feature[] = [
  { title: "Battery Use", text: "Lithium-ion batteries power vehicles, electronics, storage systems and industrial equipment through their working life.", icon: BatteryCharging },
  { title: "Collection", text: "At end of life — or as surplus and production scrap — batteries are collected from businesses and aggregators.", icon: Truck },
  { title: "Sorting", text: "Material is inspected and segregated by chemistry, format and condition.", icon: Layers },
  { title: "Recovery", text: "Suitable batteries are directed to recovery processes where valuable materials can be reclaimed.", icon: Atom },
  { title: "Recycling", text: "Materials such as lithium, nickel, cobalt, copper and aluminium are processed for re-use, depending on chemistry.", icon: Recycle },
  { title: "Reuse", text: "Reclaimed materials and serviceable components re-enter manufacturing and the wider value chain.", icon: RefreshCcw },
  { title: "New Energy Value", text: "Waste becomes value again — supporting cleaner energy and a more circular economy.", icon: Sprout },
];

/* -------------------------------------------------------------------------- */
/* About                                                                       */
/* -------------------------------------------------------------------------- */

export const focusAreas = [
  { title: "Responsible Sourcing", text: "Battery scrap sourced through accountable channels, with clear descriptions of material and condition." },
  { title: "Battery Scrap Trading", text: "Lithium-ion cells, packs and modules bought and traded with transparent evaluation." },
  { title: "Material Recovery", text: "Material directed toward channels where valuable resources can be reclaimed." },
  { title: "Sustainability", text: "Every battery treated as a resource with a second purpose." },
  { title: "Transparent Practices", text: "Clear terms, honest assessments and complete records in every transaction." },
  { title: "Long-Term Partnerships", text: "Lasting relationships with the businesses we work with." },
  { title: "Environmental Responsibility", text: "Keeping battery waste out of landfill and informal channels." },
];

export const values: Feature[] = [
  { title: "Responsibility", text: "We take ownership of how battery materials are handled.", icon: ShieldCheck },
  { title: "Transparency", text: "Clear communication and honest evaluation, always.", icon: Eye },
  { title: "Quality", text: "Careful inspection and accurate descriptions in every lot.", icon: BadgeCheck },
  { title: "Partnership", text: "Long-term relationships built on reliability.", icon: Handshake },
  { title: "Progress", text: "Unnati means progress — for business and the planet.", icon: Sprout },
];

export const heroChecks = ["Responsible sourcing", "Transparent transactions", "Bulk & industrial lots"];

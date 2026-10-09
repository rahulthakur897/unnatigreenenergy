import type { LucideIcon } from "lucide-react";
import { BatteryCharging, Boxes, Cylinder, Recycle, ShieldCheck, Warehouse, Workflow } from "lucide-react";
import { photos, type Photo } from "@/lib/images";

export type Service = {
  slug: string;
  title: string;
  /** Short label for menus and footers. */
  shortTitle: string;
  icon: LucideIcon;
  summary: string;
  intro: string[];
  /** Heading for the `scope` list on the detail page. */
  scopeTitle?: string;
  scope: string[];
  idealFor: string[];
  highlights: { title: string; text: string }[];
  image: Photo;
};

export const services: Service[] = [
  {
    slug: "lithium-ion-battery-scrap-trading",
    title: "Lithium-Ion Battery Scrap Trading",
    shortTitle: "Battery Scrap Trading",
    icon: BatteryCharging,
    summary:
      "Buying and trading end-of-life, surplus and rejected lithium-ion batteries — with transparent evaluation and clear communication.",
    intro: [
      "Lithium-ion batteries power vehicles, devices, storage systems and industrial equipment. When they reach end of life, are rejected in production or become surplus, they still hold valuable materials. Our trading service gives businesses a dependable, transparent route to move that material on responsibly.",
      "We evaluate each lot on battery type, chemistry, format, condition and volume, explain our assessment clearly, and coordinate the transaction so your material moves efficiently toward appropriate recovery channels.",
    ],
    scope: [
      "End-of-life lithium-ion batteries",
      "Production rejects and off-spec batteries",
      "Surplus, obsolete and slow-moving stock",
      "Warranty returns and replaced batteries",
      "Mixed lithium-ion battery lots",
      "Batteries from refurbishment and repair work",
    ],
    idealFor: [
      "Battery manufacturers and assemblers",
      "EV and e-mobility businesses",
      "Electronics companies and refurbishers",
      "Aggregators, collectors and traders",
    ],
    highlights: [
      { title: "Transparent evaluation", text: "Lots are assessed on type, condition and volume — and the basis of every offer is explained." },
      { title: "Responsible routing", text: "Material is directed toward appropriate recovery and recycling channels." },
      { title: "Smooth coordination", text: "A single point of contact for evaluation, scheduling and documentation." },
    ],
    image: photos.batteryModules,
  },
  {
    // TODO: Confirm the exact scope of this service (planning, equipment, installation, servicing, etc.)
    // and adjust the copy below so it only lists what UNNATI GREEN ENERGY actually provides.
    slug: "lithium-ion-battery-manufacturing-line",
    title: "Lithium-Ion Battery Manufacturing Line Services",
    shortTitle: "Manufacturing Line Services",
    icon: Workflow,
    summary:
      "Support for lithium-ion battery manufacturing lines — from line planning and equipment to setup, commissioning and ongoing service.",
    intro: [
      "Setting up or upgrading a lithium-ion battery manufacturing line involves many moving parts — process planning, equipment selection, installation, quality checks and trained operators. We support manufacturers and new entrants through each stage.",
      "Whether you are planning a new battery pack assembly line, expanding an existing one or keeping it running smoothly, we work with you to define the right scope and deliver it in a practical, well-coordinated way — with a responsible route for the production scrap your line generates.",
    ],
    scopeTitle: "What we offer",
    scope: [
      "Line planning and layout consultation",
      "Equipment sourcing for cell sorting, welding, assembly and testing",
      "Installation and commissioning support",
      "Process setup and quality checks",
      "Operator training and documentation",
      "Maintenance, servicing and upgrades",
    ],
    idealFor: [
      "New battery pack manufacturers",
      "EV and e-mobility companies",
      "Energy storage manufacturers",
      "Existing lines planning an upgrade",
    ],
    highlights: [
      { title: "Practical planning", text: "A line plan built around your products, volumes and available space." },
      { title: "Coordinated execution", text: "One point of contact across equipment, setup and commissioning." },
      { title: "Closed-loop scrap handling", text: "Production scrap from your line can be traded responsibly through our scrap services." },
    ],
    image: photos.factoryHall,
  },
  {
    slug: "lithium-cell-scrap",
    title: "Lithium Cell Scrap",
    shortTitle: "Lithium Cell Scrap",
    icon: Cylinder,
    summary:
      "Cylindrical, prismatic and pouch cells — rejected, surplus or end-of-life — identified carefully and traded responsibly.",
    intro: [
      "Loose cells are often the most common — and most varied — form of lithium-ion scrap. Production rejects, grading leftovers, surplus inventory and cells recovered from dismantled packs all need careful identification before they can move on.",
      "We work across common cell formats and chemistries, helping you segregate and describe material accurately so that it reaches the right downstream channel.",
    ],
    scope: [
      "Cylindrical cells, such as 18650, 21700, 26650 and 32650 formats",
      "Prismatic cells",
      "Pouch and polymer cells",
      "Chemistries such as NMC, LFP, LCO and LMO",
      "Grading rejects and capacity-tested leftovers",
      "Cells recovered from dismantled packs",
    ],
    idealFor: [
      "Cell manufacturers and importers",
      "Battery pack assemblers",
      "Refurbishers and testing labs",
      "Aggregators handling mixed cells",
    ],
    highlights: [
      { title: "Format-wise segregation", text: "Cells are sorted by format, chemistry and condition for an accurate evaluation." },
      { title: "Careful handling", text: "Packing guidance that reduces short-circuit and damage risks in transit." },
      { title: "Clarity per lot", text: "Each lot is evaluated individually, so you know how its value is determined." },
    ],
    image: photos.lithiumCells,
  },
  {
    slug: "battery-pack-scrap",
    title: "Battery Pack Scrap",
    shortTitle: "Battery Pack Scrap",
    icon: Boxes,
    summary:
      "Battery packs and modules from EVs, e-rickshaws, energy storage and electronics — handled with care at every stage.",
    intro: [
      "Battery packs combine cells, modules, wiring, casings and battery-management electronics. Each pack is different, and its value depends on what is inside and the condition it is in.",
      "We assess packs and modules from mobility, storage and electronics applications, share preparation and packing guidance — including for damaged or swollen units — and coordinate their onward movement responsibly.",
    ],
    scope: [
      "EV and e-rickshaw battery packs",
      "Two-wheeler and light-EV packs",
      "Energy storage and inverter battery packs",
      "Laptop, power-tool and device packs",
      "Battery modules and sub-assemblies",
      "Packs with BMS, casings and wiring",
    ],
    idealFor: [
      "EV makers, fleets and service centres",
      "Energy storage integrators",
      "Electronics and appliance businesses",
      "Workshops and refurbishers",
    ],
    highlights: [
      { title: "Pack-level assessment", text: "Evaluation considers the cells, casing, BMS and overall condition of each pack." },
      { title: "Safe-handling guidance", text: "Practical advice on preparing and packing damaged or swollen packs." },
      { title: "Value in every component", text: "Packs are assessed for recoverable cells, metals and materials." },
    ],
    image: photos.batteryPackSwap,
  },
  {
    slug: "battery-material-recovery",
    title: "Battery Material Recovery",
    shortTitle: "Material Recovery",
    icon: Recycle,
    summary:
      "Directing battery scrap into recovery and recycling channels so valuable materials can re-enter the supply chain.",
    intro: [
      "Lithium-ion batteries contain materials worth recovering — including lithium, nickel, cobalt, manganese, copper and aluminium, depending on chemistry. Recovering them reduces waste and the need for newly mined resources.",
      "Our focus is getting battery scrap to the right place: segregating material appropriately and moving it toward recovery and recycling channels where these materials can be reclaimed and returned to the value chain.",
    ],
    scope: [
      "End-of-life cells and packs suitable for recovery",
      "Damaged and non-reusable batteries",
      "Battery manufacturing scrap",
      "Lots segregated by chemistry",
      "Mixed battery lots that need sorting",
      "Battery components and assemblies",
    ],
    idealFor: [
      "Businesses with recurring battery waste",
      "Manufacturers with production scrap",
      "Organisations with sustainability goals",
      "Aggregators and collection partners",
    ],
    highlights: [
      { title: "Resource-first approach", text: "Material is evaluated for what can be recovered — not simply discarded." },
      { title: "Chemistry-aware segregation", text: "Sorting by chemistry helps material reach suitable recovery processes." },
      { title: "Circular outcomes", text: "Recovered materials can return to manufacturing and the wider economy." },
    ],
    image: photos.recyclingFacility,
  },
  {
    slug: "responsible-scrap-sourcing",
    title: "Responsible Scrap Sourcing",
    shortTitle: "Responsible Sourcing",
    icon: ShieldCheck,
    summary:
      "Sourcing battery scrap through accountable channels, with clear material descriptions and complete transaction records.",
    intro: [
      "How battery scrap is sourced matters as much as where it goes. We work with businesses and collection partners who value accountability — with clear descriptions of material, quantities and condition at every step.",
      "Our sourcing approach emphasises documentation, honest communication and careful handling, so that buyers and sellers can transact with confidence.",
    ],
    scope: [
      "Direct sourcing from manufacturers and businesses",
      "Lots from collection partners and aggregators",
      "Pre-dispatch inspection and description",
      "Consistent transaction records",
      "Handling and packing guidance",
      "Repeat and scheduled sourcing",
    ],
    idealFor: [
      "Businesses that need accountable disposal",
      "Collection partners and aggregators",
      "Buyers who need well-described lots",
      "Organisations with reporting requirements",
    ],
    highlights: [
      { title: "Accountable channels", text: "We work with partners who share our expectations for responsible handling." },
      { title: "Clear documentation", text: "Material, quantity and terms are recorded for every transaction." },
      { title: "Consistent standards", text: "The same inspection and description approach is applied to every lot." },
    ],
    image: photos.inspectionLine,
  },
  {
    slug: "bulk-industrial-trading",
    title: "Bulk Industrial Trading",
    shortTitle: "Bulk Industrial Trading",
    icon: Warehouse,
    summary:
      "Structured trading for manufacturers and industrial businesses with large or recurring battery scrap volumes.",
    intro: [
      "Industrial operations generate battery scrap in volumes that need planning — not ad-hoc disposal. We support bulk and recurring requirements with structured coordination, from scheduling and packing guidance to documentation and dispatch.",
      "Whether you have a one-time clearance or an ongoing stream of material, we work with you to build a process that fits your operations.",
    ],
    scope: [
      "Large one-time clearances",
      "Recurring monthly or quarterly lots",
      "Consolidation across multiple locations",
      "Production and warehouse scrap",
      "Mixed industrial battery lots",
      "Custom collection schedules",
    ],
    idealFor: [
      "Battery and EV manufacturers",
      "Industrial and warehouse operators",
      "Energy storage and solar EPC firms",
      "Large aggregators",
    ],
    highlights: [
      { title: "Volume planning", text: "Collection schedules aligned with your production or replacement cycles." },
      { title: "Dedicated coordination", text: "One team managing communication, documentation and dispatch." },
      { title: "Customised terms", text: "Commercial arrangements tailored to your volume and frequency." },
    ],
    image: photos.warehouse,
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

/** What to share for a faster, more accurate quotation. */
export const quoteChecklist = [
  "Battery type or chemistry, if known",
  "Format — cells, packs or modules",
  "Approximate quantity (kg or units)",
  "Condition — new, used or damaged",
  "Photographs of the material",
  "Pickup location",
];

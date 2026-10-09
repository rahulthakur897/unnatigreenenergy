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
      "We buy and trade used, surplus and rejected lithium-ion batteries, with an evaluation you can follow and communication you can rely on.",
    intro: [
      "Vehicles, gadgets, storage systems and machines all run on lithium-ion batteries. A battery that has worn out, failed a production check or simply isn't needed any more still contains materials worth recovering. Our trading service gives businesses a straightforward, open way to pass that material on responsibly.",
      "We look at each lot's battery type, chemistry, format, condition and quantity, walk you through how we've assessed it, and handle the arrangements so the material moves quickly toward the right recovery channel.",
    ],
    scope: [
      "Lithium-ion batteries at the end of their service life",
      "Off-spec batteries and production rejects",
      "Excess, outdated and slow-moving inventory",
      "Replaced batteries and warranty returns",
      "Lots containing mixed lithium-ion batteries",
      "Batteries removed during repair or refurbishment",
    ],
    idealFor: [
      "Battery makers and pack assemblers",
      "EV and e-mobility companies",
      "Electronics firms and refurbishers",
      "Collectors, aggregators and traders",
    ],
    highlights: [
      { title: "Evaluation you can follow", text: "We assess type, condition and quantity, and explain how we arrived at each offer." },
      { title: "The right destination", text: "Material is sent on to suitable recovery and recycling channels." },
      { title: "One point of contact", text: "A single person coordinates evaluation, scheduling and paperwork." },
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
      "Help with lithium-ion battery production lines, covering line planning, equipment, installation, commissioning and ongoing support.",
    intro: [
      "Building or upgrading a lithium-ion battery production line means getting a lot of things right at once: the process, the machines, the installation, quality checks and a trained team. We help manufacturers and newcomers to the industry through each of those stages.",
      "Whether you are planning your first battery pack assembly line, adding capacity or keeping an existing line in good shape, we agree a clear scope with you and deliver it in a practical, well-organised way. The scrap your line produces can then be traded responsibly through our scrap services.",
    ],
    scopeTitle: "What we offer",
    scope: [
      "Advice on line planning and floor layout",
      "Sourcing equipment for cell sorting, welding, assembly and testing",
      "Support with installation and commissioning",
      "Process set-up and quality checks",
      "Operator training and documentation",
      "Maintenance, servicing and upgrades",
    ],
    idealFor: [
      "Companies starting battery pack production",
      "EV and e-mobility manufacturers",
      "Energy storage producers",
      "Established lines due for an upgrade",
    ],
    highlights: [
      { title: "Planning that fits", text: "A line design based on your products, target volumes and the space you have." },
      { title: "Joined-up delivery", text: "One contact across equipment, installation and commissioning." },
      { title: "A home for your scrap", text: "Scrap from your line can be traded responsibly through our scrap services." },
    ],
    image: photos.factoryHall,
  },
  {
    slug: "lithium-cell-scrap",
    title: "Lithium Cell Scrap",
    shortTitle: "Lithium Cell Scrap",
    icon: Cylinder,
    summary:
      "Cylindrical, prismatic and pouch cells — whether rejected, surplus or worn out — identified with care and traded responsibly.",
    intro: [
      "Loose cells make up a large and very mixed share of lithium-ion scrap. Factory rejects, cells left over after grading, excess stock and cells taken out of dismantled packs all need to be identified properly before they can go anywhere.",
      "We work with the common cell formats and chemistries and help you sort and describe your material correctly, so it ends up in the right downstream channel.",
    ],
    scope: [
      "Cylindrical formats including 18650, 21700, 26650 and 32650",
      "Prismatic cells",
      "Pouch and lithium-polymer cells",
      "NMC, LFP, LCO, LMO and other chemistries",
      "Cells rejected at grading or capacity testing",
      "Cells taken out of dismantled packs",
    ],
    idealFor: [
      "Cell makers and importers",
      "Battery pack assemblers",
      "Refurbishers and test labs",
      "Aggregators with mixed cell lots",
    ],
    highlights: [
      { title: "Sorted by format", text: "Cells are grouped by format, chemistry and condition so the evaluation is accurate." },
      { title: "Handled with care", text: "Packing advice that lowers the chance of short circuits and damage in transit." },
      { title: "Lot-by-lot clarity", text: "Every lot is assessed on its own, so you can see how its value was worked out." },
    ],
    image: photos.lithiumCells,
  },
  {
    slug: "battery-pack-scrap",
    title: "Battery Pack Scrap",
    shortTitle: "Battery Pack Scrap",
    icon: Boxes,
    summary:
      "Packs and modules from EVs, e-rickshaws, storage systems and electronics, handled carefully from assessment to dispatch.",
    intro: [
      "A battery pack brings together cells, modules, wiring, an enclosure and battery-management electronics. No two packs are quite alike, and what one is worth depends on its contents and its condition.",
      "We assess packs and modules from mobility, storage and electronics uses, advise on how to prepare and pack them — including damaged or swollen units — and arrange for them to move on responsibly.",
    ],
    scope: [
      "Battery packs from EVs and e-rickshaws",
      "Packs from two-wheelers and light EVs",
      "Inverter and energy storage packs",
      "Packs from laptops, power tools and devices",
      "Modules and sub-assemblies",
      "Packs complete with BMS, enclosure and wiring",
    ],
    idealFor: [
      "EV manufacturers, fleets and service centres",
      "Energy storage integrators",
      "Electronics and appliance companies",
      "Repair workshops and refurbishers",
    ],
    highlights: [
      { title: "Whole-pack assessment", text: "We look at the cells, enclosure, BMS and general condition of every pack." },
      { title: "Help with risky packs", text: "Practical tips for preparing and packing damaged or swollen units." },
      { title: "Nothing overlooked", text: "Each pack is checked for recoverable cells, metals and other materials." },
    ],
    image: photos.batteryPackSwap,
  },
  {
    slug: "battery-material-recovery",
    title: "Battery Material Recovery",
    shortTitle: "Material Recovery",
    icon: Recycle,
    summary:
      "Steering battery scrap into recovery and recycling channels, so the valuable materials inside can return to the supply chain.",
    intro: [
      "Depending on their chemistry, lithium-ion batteries hold lithium, nickel, cobalt, manganese, copper and aluminium — all worth getting back. Recovering them cuts waste and reduces the demand for newly mined material.",
      "Our job is to get battery scrap to the right place: sorting it properly and sending it to recovery and recycling channels that can reclaim those materials and put them back to use.",
    ],
    scope: [
      "Worn-out cells and packs suitable for recovery",
      "Damaged batteries that can't be reused",
      "Scrap from battery production",
      "Lots sorted by chemistry",
      "Mixed lots that still need sorting",
      "Battery parts and assemblies",
    ],
    idealFor: [
      "Businesses that produce battery waste regularly",
      "Manufacturers with production scrap",
      "Organisations working toward sustainability targets",
      "Aggregators and collection partners",
    ],
    highlights: [
      { title: "Resources before disposal", text: "We look at what can be recovered first, instead of treating material as rubbish." },
      { title: "Sorted by chemistry", text: "Grouping by chemistry helps material reach a recovery process that suits it." },
      { title: "A closed loop", text: "Reclaimed materials can go back into manufacturing and the wider economy." },
    ],
    image: photos.recyclingFacility,
  },
  {
    slug: "responsible-scrap-sourcing",
    title: "Responsible Scrap Sourcing",
    shortTitle: "Responsible Sourcing",
    icon: ShieldCheck,
    summary:
      "Sourcing battery scrap through traceable channels, with accurate descriptions of the material and full records of every deal.",
    intro: [
      "Where battery scrap comes from matters just as much as where it ends up. We work with businesses and collection partners who take accountability seriously, and we describe material, quantity and condition clearly at every stage.",
      "Good records, honest conversations and careful handling sit at the heart of how we source, so both buyers and sellers can deal with us with confidence.",
    ],
    scope: [
      "Buying directly from manufacturers and businesses",
      "Lots from aggregators and collection partners",
      "Inspection and description before dispatch",
      "Consistent records for every transaction",
      "Advice on handling and packing",
      "Regular, scheduled sourcing",
    ],
    idealFor: [
      "Businesses that need accountable disposal",
      "Aggregators and collection partners",
      "Buyers who want accurately described lots",
      "Organisations with reporting obligations",
    ],
    highlights: [
      { title: "Traceable channels", text: "We partner with businesses that share our standards for responsible handling." },
      { title: "Full paperwork", text: "Material, quantity and terms are written down for every deal." },
      { title: "The same standard every time", text: "Every lot goes through the same inspection and description process." },
    ],
    image: photos.inspectionLine,
  },
  {
    slug: "bulk-industrial-trading",
    title: "Bulk Industrial Trading",
    shortTitle: "Bulk Industrial Trading",
    icon: Warehouse,
    summary:
      "Organised trading for manufacturers and industrial sites that produce battery scrap in large or regular volumes.",
    intro: [
      "Industrial sites produce battery scrap in quantities that call for a plan, not last-minute disposal. We support large and recurring volumes with organised coordination covering scheduling, packing advice, paperwork and dispatch.",
      "Whether you need a single large clear-out or have material building up every month, we'll work with you to set up a process that suits the way you operate.",
    ],
    scope: [
      "Large single clear-outs",
      "Regular monthly or quarterly lots",
      "Combining material from several sites",
      "Scrap from production floors and warehouses",
      "Mixed industrial battery lots",
      "Pickup schedules built around you",
    ],
    idealFor: [
      "Battery and EV manufacturers",
      "Industrial and warehouse operators",
      "Energy storage and solar EPC companies",
      "High-volume aggregators",
    ],
    highlights: [
      { title: "Planned around your volumes", text: "Pickups timed to match your production or battery replacement cycles." },
      { title: "A dedicated team", text: "One team looks after communication, paperwork and dispatch." },
      { title: "Terms that fit", text: "Commercial arrangements shaped around how much you produce and how often." },
    ],
    image: photos.warehouse,
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

/** What to share for a faster, more accurate quotation. */
export const quoteChecklist = [
  "Chemistry or battery type, if you know it",
  "Whether it is cells, packs or modules",
  "Rough quantity (kg or number of units)",
  "Condition: new, used or damaged",
  "A few photos of the material",
  "Where it should be collected from",
];

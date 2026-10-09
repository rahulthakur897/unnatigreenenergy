import type { LucideIcon } from "lucide-react";
import { BatteryFull, Car, Cog, Cpu, Factory, Smartphone, Sun, Zap } from "lucide-react";
import { photos, type Photo } from "@/lib/images";

export type Industry = {
  slug: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  intro: string[];
  scrapTypes: string[];
  support: { title: string; text: string }[];
  relatedServices: string[];
  image: Photo;
};

export const industries: Industry[] = [
  {
    slug: "ev-electric-mobility",
    title: "EV & Electric Mobility",
    icon: Zap,
    summary: "End-of-life traction batteries, swap packs and production scrap from EV makers, fleets and service centres.",
    intro: [
      "Electric mobility — from e-rickshaws and two-wheelers to cars and commercial vehicles — depends on lithium-ion traction batteries, and every one of them eventually reaches end of life.",
      "We help EV manufacturers, fleet operators, battery-swapping networks and service centres move traction batteries and production scrap responsibly, with evaluation that reflects pack condition and composition.",
    ],
    scrapTypes: [
      "E-rickshaw and three-wheeler battery packs",
      "Two-wheeler and light-EV packs",
      "Battery-swapping station packs",
      "Modules and cells from dismantled packs",
      "Production and assembly-line rejects",
    ],
    support: [
      { title: "Pack-level evaluation", text: "Assessment based on chemistry, format, condition and BMS." },
      { title: "Fleet-scale coordination", text: "Planned collections aligned with battery replacement cycles." },
      { title: "Safe-handling guidance", text: "Advice on preparing damaged or swollen packs for movement." },
    ],
    relatedServices: ["battery-pack-scrap", "lithium-cell-scrap", "bulk-industrial-trading"],
    image: photos.evBatteryHandling,
  },
  {
    slug: "battery-manufacturers",
    title: "Battery Manufacturers",
    icon: Factory,
    summary: "Rejected cells, off-spec batches and production scrap from cell and pack assembly lines.",
    intro: [
      "Cell and pack manufacturing inevitably produces scrap — grading rejects, off-spec batches, formation failures, trial runs and obsolete stock.",
      "We give manufacturers a consistent outlet for this material, with segregation by format and chemistry and records that fit into your production and inventory processes.",
    ],
    scrapTypes: [
      "Grading and formation rejects",
      "Off-spec and trial batches",
      "Surplus and obsolete cell inventory",
      "Rejected modules and packs",
      "Assembly-line scrap",
    ],
    support: [
      { title: "Recurring offtake planning", text: "Scheduled lots that keep production areas clear." },
      { title: "Format-wise segregation", text: "Material separated by format and chemistry for accurate evaluation." },
      { title: "Inventory-friendly records", text: "Clear documentation for your stock and compliance teams." },
    ],
    relatedServices: ["lithium-ion-battery-manufacturing-line", "lithium-cell-scrap", "bulk-industrial-trading"],
    image: photos.batteryFactoryLine,
  },
  {
    slug: "energy-storage",
    title: "Energy Storage",
    icon: BatteryFull,
    summary: "Retired modules and batteries from backup power, inverter and stationary storage systems.",
    intro: [
      "Stationary storage — from home inverters and UPS backup to commercial and grid-connected systems — increasingly relies on lithium-ion batteries.",
      "When these systems are upgraded, replaced or decommissioned, we help owners, integrators and service providers handle the retired batteries responsibly.",
    ],
    scrapTypes: [
      "Inverter and home backup batteries",
      "UPS and telecom backup batteries",
      "Rack-mounted storage modules",
      "Decommissioned stationary storage units",
      "Replaced and warranty-return units",
    ],
    support: [
      { title: "Coordinated removal", text: "Collections planned around system upgrades and replacements." },
      { title: "Module-level assessment", text: "Each module evaluated for condition and composition." },
      { title: "Clear records", text: "Documentation for asset write-offs and internal reporting." },
    ],
    relatedServices: ["battery-pack-scrap", "battery-material-recovery", "bulk-industrial-trading"],
    image: photos.energyStorageWiring,
  },
  {
    slug: "automotive",
    title: "Automotive",
    icon: Car,
    summary: "Battery scrap from automotive workshops, dealerships and component suppliers.",
    intro: [
      "As vehicles electrify, workshops, dealerships and component suppliers increasingly handle lithium-ion batteries — from hybrid and EV traction packs to auxiliary batteries.",
      "We offer the automotive aftermarket a reliable route for these batteries, with careful handling and clear records for every lot.",
    ],
    scrapTypes: [
      "Hybrid and EV traction battery packs",
      "Replaced and warranty-return batteries",
      "Auxiliary lithium batteries",
      "Battery modules from repairs",
      "Component supplier rejects",
    ],
    support: [
      { title: "Workshop-friendly pickups", text: "Collections scheduled around your service operations." },
      { title: "Clear lot records", text: "Every consignment documented for your records." },
      { title: "Responsible routing", text: "Batteries directed to appropriate recovery channels." },
    ],
    relatedServices: ["battery-pack-scrap", "lithium-ion-battery-scrap-trading", "responsible-scrap-sourcing"],
    image: photos.evDrivetrain,
  },
  {
    slug: "electronics",
    title: "Electronics",
    icon: Cpu,
    summary: "Batteries recovered from electronic assemblies, devices and repair operations.",
    intro: [
      "Electronics manufacturing, repair and refurbishment generate a steady flow of lithium-ion cells and packs — from device batteries to cells embedded in assemblies.",
      "We help electronics businesses separate battery scrap from wider e-waste streams and move it on responsibly.",
    ],
    scrapTypes: [
      "Device and gadget batteries",
      "Polymer and pouch cells",
      "Battery packs from assemblies",
      "Repair and refurbishment returns",
      "Mixed small-format cells",
    ],
    support: [
      { title: "Separation from e-waste", text: "Batteries identified and kept apart from general e-waste." },
      { title: "Small-lot consolidation", text: "Smaller quantities combined into practical lots." },
      { title: "Careful packing guidance", text: "Advice that reduces short-circuit risk during movement." },
    ],
    relatedServices: ["lithium-cell-scrap", "lithium-ion-battery-scrap-trading", "battery-material-recovery"],
    image: photos.electronicsBoards,
  },
  {
    slug: "renewable-energy",
    title: "Renewable Energy",
    icon: Sun,
    summary: "Storage batteries from solar and hybrid installations at the end of their service life.",
    intro: [
      "Solar and hybrid energy systems depend on batteries to store power — and those batteries eventually need replacement.",
      "We support solar EPC companies, installers and system owners with a responsible route for retired storage batteries, keeping the clean-energy promise intact through end of life.",
    ],
    scrapTypes: [
      "Solar storage batteries",
      "Hybrid system battery banks",
      "Off-grid and microgrid batteries",
      "Solar street-light batteries",
      "Replaced and upgraded storage units",
    ],
    support: [
      { title: "Project-based collection", text: "Coordination aligned with installation and replacement projects." },
      { title: "End-of-life planning", text: "A clear route for batteries before they become a liability." },
      { title: "Sustainability alignment", text: "Responsible handling that matches your clean-energy goals." },
    ],
    relatedServices: ["battery-pack-scrap", "battery-material-recovery", "bulk-industrial-trading"],
    image: photos.solarAerial,
  },
  {
    slug: "industrial-equipment",
    title: "Industrial Equipment",
    icon: Cog,
    summary: "Batteries from material-handling equipment, UPS systems, tools and machinery.",
    intro: [
      "Forklifts, AGVs, power tools, UPS systems and industrial machinery increasingly run on lithium-ion batteries.",
      "We help plant and facility teams handle replaced batteries in a planned, documented way that fits around operations.",
    ],
    scrapTypes: [
      "Material-handling equipment batteries",
      "Power-tool battery packs",
      "Industrial UPS batteries",
      "Batteries from machinery and instruments",
      "Bulk replaced battery stock",
    ],
    support: [
      { title: "Plant-friendly scheduling", text: "Collections planned to avoid disrupting operations." },
      { title: "Bulk and recurring lots", text: "Structured arrangements for ongoing volumes." },
      { title: "Documented transactions", text: "Clear records for every consignment." },
    ],
    relatedServices: ["bulk-industrial-trading", "battery-pack-scrap", "responsible-scrap-sourcing"],
    image: photos.industrialAutomation,
  },
  {
    slug: "consumer-electronics",
    title: "Consumer Electronics",
    icon: Smartphone,
    summary: "Phone, laptop, power-bank and gadget batteries collected through refurbishers and aggregators.",
    intro: [
      "Phones, laptops, tablets, power banks and wearables contain lithium-ion batteries that should never end up in general waste.",
      "We work with refurbishers, service centres, retailers and aggregators to move consumer battery scrap into responsible channels.",
    ],
    scrapTypes: [
      "Mobile phone batteries",
      "Laptop and tablet battery packs",
      "Power banks",
      "Wearable and gadget batteries",
      "Mixed consumer battery lots",
    ],
    support: [
      { title: "Aggregated small lots", text: "Smaller quantities consolidated into practical shipments." },
      { title: "Sorting by type", text: "Batteries separated by format and chemistry." },
      { title: "Safe packing guidance", text: "Simple steps to reduce risk during storage and transit." },
    ],
    relatedServices: ["lithium-cell-scrap", "lithium-ion-battery-scrap-trading", "responsible-scrap-sourcing"],
    image: photos.consumerDevices,
  },
];

export function getIndustry(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}

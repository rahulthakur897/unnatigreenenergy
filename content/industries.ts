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
    summary: "Worn-out traction batteries, swap-station packs and production scrap from EV makers, fleets and service centres.",
    intro: [
      "Every electric vehicle, from an e-rickshaw or scooter to a car or delivery van, runs on a lithium-ion traction battery, and sooner or later each of those batteries has to be replaced.",
      "We work with EV makers, fleet operators, battery-swapping networks and service centres to move traction batteries and production scrap on responsibly, with an evaluation based on what each pack contains and the state it is in.",
    ],
    scrapTypes: [
      "Packs from e-rickshaws and other three-wheelers",
      "Packs from scooters, motorcycles and light EVs",
      "Packs retired from battery-swapping stations",
      "Cells and modules from dismantled packs",
      "Rejects from production and assembly lines",
    ],
    support: [
      { title: "Evaluation by pack", text: "We assess chemistry, format, condition and the BMS." },
      { title: "Planned for fleets", text: "Pickups timed to match your battery replacement cycles." },
      { title: "Advice for damaged packs", text: "Guidance on preparing swollen or damaged packs for transport." },
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
      "Making cells and packs always produces some scrap: cells that fail grading or formation, off-spec batches, trial runs and stock that is no longer needed.",
      "We give manufacturers a steady outlet for this material. We sort it by format and chemistry and provide records that slot neatly into your production and inventory systems.",
    ],
    scrapTypes: [
      "Cells rejected at grading or formation",
      "Off-spec batches and trial runs",
      "Excess or outdated cell stock",
      "Rejected modules and packs",
      "Scrap from the assembly line",
    ],
    support: [
      { title: "Regular collections", text: "Scheduled pickups that keep your production floor clear." },
      { title: "Sorted by format", text: "Material grouped by format and chemistry for an accurate evaluation." },
      { title: "Records that fit", text: "Clear paperwork for your inventory and compliance teams." },
    ],
    relatedServices: ["lithium-ion-battery-manufacturing-line", "lithium-cell-scrap", "bulk-industrial-trading"],
    image: photos.batteryFactoryLine,
  },
  {
    slug: "energy-storage",
    title: "Energy Storage",
    icon: BatteryFull,
    summary: "Retired batteries and modules from inverters, backup power and stationary storage systems.",
    intro: [
      "More and more stationary storage, from home inverters and UPS backup to commercial and grid-scale installations, now uses lithium-ion batteries.",
      "When a system is upgraded, replaced or shut down, we help owners, integrators and service companies deal with the old batteries responsibly.",
    ],
    scrapTypes: [
      "Home inverter and backup batteries",
      "Batteries from UPS and telecom backup",
      "Rack-mounted storage modules",
      "Storage units taken out of service",
      "Replaced units and warranty returns",
    ],
    support: [
      { title: "Planned removal", text: "Pickups arranged around system upgrades and replacements." },
      { title: "Assessment by module", text: "Each module is checked for condition and composition." },
      { title: "Clear records", text: "Paperwork to support asset write-offs and internal reports." },
    ],
    relatedServices: ["battery-pack-scrap", "battery-material-recovery", "bulk-industrial-trading"],
    image: photos.energyStorageWiring,
  },
  {
    slug: "automotive",
    title: "Automotive",
    icon: Car,
    summary: "Battery scrap from vehicle workshops, dealerships and parts suppliers.",
    intro: [
      "As more vehicles go electric, workshops, dealerships and parts suppliers handle more lithium-ion batteries, from hybrid and EV traction packs to auxiliary batteries.",
      "We give the automotive aftermarket a dependable way to pass these batteries on, with careful handling and a clear record for every lot.",
    ],
    scrapTypes: [
      "Traction packs from hybrids and EVs",
      "Replaced batteries and warranty returns",
      "Auxiliary lithium batteries",
      "Modules removed during repairs",
      "Rejects from parts suppliers",
    ],
    support: [
      { title: "Pickups that suit workshops", text: "Collections timed around your service bays." },
      { title: "A record for every lot", text: "Each consignment documented for your files." },
      { title: "The right destination", text: "Batteries sent on to suitable recovery channels." },
    ],
    relatedServices: ["battery-pack-scrap", "lithium-ion-battery-scrap-trading", "responsible-scrap-sourcing"],
    image: photos.evDrivetrain,
  },
  {
    slug: "electronics",
    title: "Electronics",
    icon: Cpu,
    summary: "Batteries taken from electronic assemblies, devices and repair work.",
    intro: [
      "Making, repairing and refurbishing electronics creates a constant trickle of lithium-ion cells and packs, from device batteries to cells built into assemblies.",
      "We help electronics businesses pull battery scrap out of their wider e-waste and pass it on responsibly.",
    ],
    scrapTypes: [
      "Batteries from devices and gadgets",
      "Pouch and lithium-polymer cells",
      "Packs removed from assemblies",
      "Returns from repair and refurbishment",
      "Mixed small cells",
    ],
    support: [
      { title: "Kept apart from e-waste", text: "Batteries are identified and stored separately from general e-waste." },
      { title: "Small lots combined", text: "Small quantities are pooled into practical lots." },
      { title: "Packing advice", text: "Simple guidance that lowers short-circuit risk in transit." },
    ],
    relatedServices: ["lithium-cell-scrap", "lithium-ion-battery-scrap-trading", "battery-material-recovery"],
    image: photos.electronicsBoards,
  },
  {
    slug: "renewable-energy",
    title: "Renewable Energy",
    icon: Sun,
    summary: "Storage batteries from solar and hybrid installations that have reached the end of their service life.",
    intro: [
      "Solar and hybrid power systems rely on batteries to hold their energy, and those batteries eventually wear out.",
      "We give solar EPC firms, installers and system owners a responsible way to retire storage batteries, so a clean-energy project stays clean right to the end.",
    ],
    scrapTypes: [
      "Batteries from solar storage systems",
      "Battery banks from hybrid systems",
      "Off-grid and microgrid batteries",
      "Batteries from solar street lights",
      "Storage units replaced during upgrades",
    ],
    support: [
      { title: "Collections by project", text: "Pickups coordinated with installation and replacement work." },
      { title: "A plan for end of life", text: "A clear route for batteries before they turn into a problem." },
      { title: "In line with your goals", text: "Responsible handling that fits your clean-energy commitments." },
    ],
    relatedServices: ["battery-pack-scrap", "battery-material-recovery", "bulk-industrial-trading"],
    image: photos.solarAerial,
  },
  {
    slug: "industrial-equipment",
    title: "Industrial Equipment",
    icon: Cog,
    summary: "Batteries from forklifts and handling equipment, UPS systems, tools and machinery.",
    intro: [
      "Forklifts, AGVs, power tools, UPS units and factory machines are increasingly powered by lithium-ion batteries.",
      "We help plant and facility teams deal with replaced batteries in an organised, documented way that doesn't get in the way of operations.",
    ],
    scrapTypes: [
      "Batteries from forklifts and handling equipment",
      "Power tool packs",
      "Industrial UPS batteries",
      "Batteries from machines and instruments",
      "Large stocks of replaced batteries",
    ],
    support: [
      { title: "Scheduled around your plant", text: "Pickups planned so they don't disrupt operations." },
      { title: "Bulk and regular lots", text: "Organised arrangements for ongoing volumes." },
      { title: "Every deal documented", text: "A clear record for each consignment." },
    ],
    relatedServices: ["bulk-industrial-trading", "battery-pack-scrap", "responsible-scrap-sourcing"],
    image: photos.industrialAutomation,
  },
  {
    slug: "consumer-electronics",
    title: "Consumer Electronics",
    icon: Smartphone,
    summary: "Batteries from phones, laptops, power banks and gadgets, gathered through refurbishers and aggregators.",
    intro: [
      "Phones, laptops, tablets, power banks and wearables all hold lithium-ion batteries, and none of them belong in ordinary rubbish.",
      "We work with refurbishers, service centres, retailers and aggregators to send consumer battery scrap through responsible channels.",
    ],
    scrapTypes: [
      "Phone batteries",
      "Laptop and tablet packs",
      "Power banks",
      "Batteries from wearables and gadgets",
      "Mixed lots of consumer batteries",
    ],
    support: [
      { title: "Small lots pooled", text: "Small quantities combined into practical shipments." },
      { title: "Sorted by type", text: "Batteries grouped by format and chemistry." },
      { title: "Packing advice", text: "Easy steps to cut risk during storage and transport." },
    ],
    relatedServices: ["lithium-cell-scrap", "lithium-ion-battery-scrap-trading", "responsible-scrap-sourcing"],
    image: photos.consumerDevices,
  },
];

export function getIndustry(slug: string) {
  return industries.find((industry) => industry.slug === slug);
}

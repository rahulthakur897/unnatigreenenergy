import { photos, type Photo } from "@/lib/images";

/**
 * "Our Products" — the lithium-ion cell and battery categories UNNATI GREEN ENERGY trades.
 * TODO: Confirm this list matches the products you actually deal in; add or remove entries freely.
 */
export type Product = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  includes: string[];
  image: Photo;
};

export const products: Product[] = [
  {
    slug: "lithium-ion-cells",
    title: "Lithium-Ion Cells",
    description: "Single cylindrical, prismatic and pouch cells, from factory rejects and excess stock to cells at the end of their life.",
    tags: ["Cylindrical", "Prismatic", "Pouch"],
    includes: [
      "18650, 21700, 26650 and 32650 cylindrical cells",
      "Prismatic and pouch formats",
      "Cells rejected at production or grading",
      "Excess stock and worn-out cells",
    ],
    image: photos.lithiumCells,
  },
  {
    slug: "battery-packs",
    title: "Battery Packs & Modules",
    description: "Complete packs and modules taken from vehicles, storage systems and electronic products.",
    tags: ["Packs", "Modules", "BMS units"],
    includes: [
      "Complete packs, with or without a BMS",
      "Modules and sub-assemblies",
      "Packs from vehicles, storage and devices",
      "Damaged or swollen packs, safely packed",
    ],
    image: photos.batteryPackSwap,
  },
  {
    slug: "ev-e-rickshaw",
    title: "EV & E-Rickshaw Batteries",
    description: "Traction batteries from e-rickshaws, electric scooters and motorcycles, and other light electric vehicles.",
    tags: ["E-rickshaw", "2W / 3W", "Light EV"],
    includes: [
      "Packs from e-rickshaws and other three-wheelers",
      "Electric scooter and motorcycle batteries",
      "Packs from battery-swapping stations",
      "Light-EV traction batteries",
    ],
    image: photos.evBatteryHandling,
  },
  {
    slug: "energy-storage",
    title: "Energy Storage Batteries",
    description: "Batteries from inverters, backup power units and small stationary storage systems.",
    tags: ["Inverter", "Backup", "Stationary"],
    includes: [
      "Home inverter and backup batteries",
      "Batteries from UPS and telecom backup",
      "Compact stationary storage units",
      "Batteries from solar storage systems",
    ],
    image: photos.smallStorage,
  },
  {
    slug: "led-lighting",
    title: "LED & Lighting Batteries",
    description: "Cells and packs taken from solar lamps, emergency lights and LED products.",
    tags: ["Solar lights", "Emergency", "LED"],
    includes: [
      "Batteries from solar street lights",
      "Rechargeable and emergency light batteries",
      "Packs from LED products",
      "Small lithium cells",
    ],
    image: photos.ledLighting,
  },
  {
    slug: "medical-equipment",
    title: "Medical Equipment Batteries",
    description: "Batteries from portable medical and healthcare equipment, handled with the care they need.",
    tags: ["Portable devices", "Equipment"],
    includes: [
      "Batteries from portable medical devices",
      "Backup batteries from equipment",
      "Replaced and excess units",
      "Mixed small packs",
    ],
    image: photos.medical,
  },
  {
    slug: "consumer-electronics",
    title: "Consumer Electronics Batteries",
    description: "Batteries from laptops, phones, power banks and other everyday gadgets.",
    tags: ["Laptops", "Phones", "Power banks"],
    includes: [
      "Laptop and tablet packs",
      "Phone batteries",
      "Power banks",
      "Batteries from wearables and gadgets",
    ],
    image: photos.laptopBattery,
  },
  {
    slug: "industrial",
    title: "Industrial Battery Scrap",
    description: "Batteries from industrial machinery, UPS systems and commercial sites.",
    tags: ["UPS", "Equipment", "Commercial"],
    includes: [
      "Batteries from forklifts and other handling equipment",
      "Industrial UPS batteries",
      "Power tool packs",
      "Batteries from machines and instruments",
    ],
    image: photos.industrialBatteries,
  },
  {
    slug: "mixed-battery-waste",
    title: "Mixed Battery Waste",
    description: "Mixed lots of batteries and battery-containing e-waste, sorted before they move on.",
    tags: ["Mixed lots", "E-waste batteries"],
    includes: [
      "Mixed lithium-ion lots",
      "Unsorted battery collections",
      "Batteries taken out of e-waste",
      "Lots that still need sorting",
    ],
    image: photos.mixedBatteryScrap,
  },
];

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
    description: "Loose cylindrical, prismatic and pouch cells — production rejects, surplus stock and end-of-life cells.",
    tags: ["Cylindrical", "Prismatic", "Pouch"],
    includes: [
      "Cylindrical cells — 18650, 21700, 26650, 32650",
      "Prismatic and pouch cells",
      "Production rejects and grading leftovers",
      "Surplus and end-of-life cells",
    ],
    image: photos.lithiumCells,
  },
  {
    slug: "battery-packs",
    title: "Battery Packs & Modules",
    description: "Assembled packs and modules from mobility, storage and electronics applications.",
    tags: ["Packs", "Modules", "BMS units"],
    includes: [
      "Assembled packs, with or without BMS",
      "Modules and sub-assemblies",
      "Packs from mobility, storage and devices",
      "Damaged or swollen packs, packed safely",
    ],
    image: photos.batteryPackSwap,
  },
  {
    slug: "ev-e-rickshaw",
    title: "EV & E-Rickshaw Batteries",
    description: "Traction batteries from e-rickshaws, electric two-wheelers and other light EVs.",
    tags: ["E-rickshaw", "2W / 3W", "Light EV"],
    includes: [
      "E-rickshaw and three-wheeler packs",
      "Electric two-wheeler batteries",
      "Battery-swapping station packs",
      "Light-EV traction packs",
    ],
    image: photos.evRickshaw,
  },
  {
    slug: "energy-storage",
    title: "Energy Storage Batteries",
    description: "Batteries from inverter backup, small energy storage and stationary systems.",
    tags: ["Inverter", "Backup", "Stationary"],
    includes: [
      "Inverter and home backup batteries",
      "UPS and telecom backup batteries",
      "Small stationary storage units",
      "Solar storage batteries",
    ],
    image: photos.smallStorage,
  },
  {
    slug: "led-lighting",
    title: "LED & Lighting Batteries",
    description: "Cells and packs from solar lights, emergency lighting and LED products.",
    tags: ["Solar lights", "Emergency", "LED"],
    includes: [
      "Solar street-light batteries",
      "Emergency and rechargeable lights",
      "LED product battery packs",
      "Small-format lithium cells",
    ],
    image: photos.ledLighting,
  },
  {
    slug: "medical-equipment",
    title: "Medical Equipment Batteries",
    description: "Batteries from portable medical and healthcare devices, handled with appropriate care.",
    tags: ["Portable devices", "Equipment"],
    includes: [
      "Portable medical device batteries",
      "Equipment backup batteries",
      "Replaced and surplus units",
      "Mixed small-format packs",
    ],
    image: photos.medical,
  },
  {
    slug: "consumer-electronics",
    title: "Consumer Electronics Batteries",
    description: "Laptop, mobile phone, power bank and gadget batteries.",
    tags: ["Laptops", "Phones", "Power banks"],
    includes: [
      "Laptop and tablet packs",
      "Mobile phone batteries",
      "Power banks",
      "Wearable and gadget batteries",
    ],
    image: photos.laptopBattery,
  },
  {
    slug: "industrial",
    title: "Industrial Battery Scrap",
    description: "Batteries from industrial equipment, UPS systems and commercial installations.",
    tags: ["UPS", "Equipment", "Commercial"],
    includes: [
      "Material-handling equipment batteries",
      "Industrial UPS batteries",
      "Power-tool packs",
      "Batteries from machinery and instruments",
    ],
    image: photos.industrialBatteries,
  },
  {
    slug: "mixed-battery-waste",
    title: "Mixed Battery Waste",
    description: "Mixed lots of battery and electronic battery waste, segregated before onward movement.",
    tags: ["Mixed lots", "E-waste batteries"],
    includes: [
      "Mixed lithium-ion lots",
      "Unsorted battery collections",
      "Batteries separated from e-waste",
      "Lots that need segregation",
    ],
    image: photos.mixedBatteryScrap,
  },
];

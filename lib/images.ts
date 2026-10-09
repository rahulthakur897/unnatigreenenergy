import type { StaticImageData } from "next/image";

// Supplied by UNNATI GREEN ENERGY
import banner from "@/public/assets/images/banner.jpg";
import evRickshaw from "@/public/assets/images/categories/ev-rickshaw.jpg";
import ledLighting from "@/public/assets/images/categories/led.jpg";
import medical from "@/public/assets/images/categories/medical.jpg";
import smallStorage from "@/public/assets/images/categories/small-energy-storage.jpg";

// Licensed stock photography (Unsplash License) — see IMAGE_CREDITS.md
import heroModules from "@/public/assets/images/stock/hero-modules-duotone.jpg";
import batteryModules from "@/public/assets/images/stock/battery-modules.jpg";
import batteryFactoryLine from "@/public/assets/images/stock/battery-factory-line.jpg";
import batteryPackSwap from "@/public/assets/images/stock/battery-pack-swap.jpg";
import consumerDevices from "@/public/assets/images/stock/consumer-devices.jpg";
import electronicsBoards from "@/public/assets/images/stock/electronics-boards.jpg";
import energyStorageWiring from "@/public/assets/images/stock/energy-storage-wiring.jpg";
import evBatteryHandling from "@/public/assets/images/stock/ev-battery-handling.jpg";
import evDrivetrain from "@/public/assets/images/stock/ev-drivetrain.jpg";
import factoryHall from "@/public/assets/images/stock/factory-hall.jpg";
import fieldTeam from "@/public/assets/images/stock/field-team.jpg";
import industrialAutomation from "@/public/assets/images/stock/industrial-automation.jpg";
import industrialBatteries from "@/public/assets/images/stock/industrial-batteries.jpg";
import inspectionLine from "@/public/assets/images/stock/inspection-line.jpg";
import laptopBattery from "@/public/assets/images/stock/laptop-battery.jpg";
import leafDark from "@/public/assets/images/stock/leaf-dark.jpg";
import liIonLabel from "@/public/assets/images/stock/li-ion-label.jpg";
import lithiumCells from "@/public/assets/images/stock/lithium-cells.jpg";
import mixedBatteryScrap from "@/public/assets/images/stock/mixed-battery-scrap.jpg";
import recyclingFacility from "@/public/assets/images/stock/recycling-facility.jpg";
import safetyWorker from "@/public/assets/images/stock/safety-worker.jpg";
import solarAerial from "@/public/assets/images/stock/solar-aerial.jpg";
import warehouse from "@/public/assets/images/stock/warehouse.jpg";
import warehouseForklift from "@/public/assets/images/stock/warehouse-forklift.jpg";

export type Photo = { src: StaticImageData; alt: string };

/**
 * Single registry for all photography. To swap an image, replace the import above —
 * every section that uses it updates automatically.
 */
export const photos = {
  // Supplied
  banner: { src: banner, alt: "Wind turbines on a green hillside under a clear sky" },
  evRickshaw: { src: evRickshaw, alt: "Electric three-wheeler (e-rickshaw) in a vehicle facility" },
  ledLighting: { src: ledLighting, alt: "LED light bulbs resting on green grass" },
  medical: { src: medical, alt: "Technician operating equipment in a clean manufacturing environment" },
  smallStorage: { src: smallStorage, alt: "Small cylindrical units held in a person's open hand" },

  // Stock
  heroModules: { src: heroModules, alt: "Rows of interconnected lithium-ion battery modules" },
  batteryModules: { src: batteryModules, alt: "Interconnected battery modules arranged in rows" },
  batteryFactoryLine: { src: batteryFactoryLine, alt: "Automated production line inside a modern manufacturing plant" },
  batteryPackSwap: { src: batteryPackSwap, alt: "A battery pack being placed into a charging and swapping cabinet" },
  consumerDevices: { src: consumerDevices, alt: "A collection of used mobile phones and handheld devices" },
  electronicsBoards: { src: electronicsBoards, alt: "Close-up of electronic circuit boards and display modules" },
  energyStorageWiring: { src: energyStorageWiring, alt: "Electrical cabling connected to power equipment racks" },
  evBatteryHandling: { src: evBatteryHandling, alt: "Technician handling a removable electric vehicle battery" },
  evDrivetrain: { src: evDrivetrain, alt: "Electric vehicle drivetrain with wiring and battery components" },
  factoryHall: { src: factoryHall, alt: "Industrial production hall with automated machinery" },
  fieldTeam: { src: fieldTeam, alt: "Field professional wearing a yellow safety helmet" },
  industrialAutomation: { src: industrialAutomation, alt: "Automated industrial equipment on a factory floor" },
  industrialBatteries: { src: industrialBatteries, alt: "Rows of industrial batteries with red and blue terminals" },
  inspectionLine: { src: inspectionLine, alt: "Team members inspecting components along a production line" },
  laptopBattery: { src: laptopBattery, alt: "Lithium-ion battery pack inside a laptop" },
  leafDark: { src: leafDark, alt: "Sunlight falling on a fresh green leaf" },
  liIonLabel: { src: liIonLabel, alt: "Close-up of a Li-ion battery label with a recycling symbol" },
  lithiumCells: { src: lithiumCells, alt: "Hundreds of cylindrical battery cells with green energy symbols" },
  mixedBatteryScrap: { src: mixedBatteryScrap, alt: "A large pile of used batteries of different types" },
  recyclingFacility: { src: recyclingFacility, alt: "Worker in safety gear operating machinery at a material recovery facility" },
  safetyWorker: { src: safetyWorker, alt: "Worker wearing a safety helmet and high-visibility vest" },
  solarAerial: { src: solarAerial, alt: "Aerial view of solar panel rows separated by green grass" },
  warehouse: { src: warehouse, alt: "Organised industrial warehouse with racking and material lots" },
  warehouseForklift: { src: warehouseForklift, alt: "Forklift moving through a warehouse aisle" },
} satisfies Record<string, Photo>;

import { photos, type Photo } from "@/lib/images";

/**
 * Blog posts.
 * The three posts below are starter articles containing general, factual guidance.
 * TODO: Review them, set real publication dates, and add new posts by appending to `posts`.
 */
export type BlogBlock = {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: "Safety" | "Insights" | "Sustainability" | "Company News";
  /** ISO date, e.g. "2026-10-08". */
  date: string;
  author: string;
  image: Photo;
  body: BlogBlock[];
};

const AUTHOR = "UNNATI GREEN ENERGY Team";

export const posts: BlogPost[] = [
  {
    slug: "how-to-safely-store-and-pack-lithium-ion-battery-scrap",
    title: "How to Safely Store and Pack Lithium-Ion Battery Scrap",
    excerpt:
      "Simple, practical habits that reduce fire and short-circuit risks while lithium-ion battery scrap waits for collection.",
    category: "Safety",
    date: "2026-10-08", // TODO: Set the actual publication date
    author: AUTHOR,
    image: photos.liIonLabel,
    body: [
      {
        paragraphs: [
          "A lithium-ion battery at the end of its working life is not an empty one. Most still hold some charge, and a damaged, crushed or short-circuited cell can overheat — sometimes enough to start a fire. The good news: a few disciplined habits dramatically reduce that risk while scrap waits to be collected.",
          "This guide covers the basics we recommend to every business that stores lithium-ion battery scrap, whether it is a few kilograms of phone batteries or tonnes of production rejects.",
        ],
      },
      {
        heading: "1. Protect the terminals",
        paragraphs: [
          "Exposed terminals are the most common cause of short circuits in stored batteries. Make sure terminals cannot touch each other, metal tools or conductive surfaces.",
        ],
        list: [
          "Cover exposed terminals and connectors with insulating tape",
          "Bag small batteries individually where practical",
          "Never store loose batteries in metal containers",
        ],
      },
      {
        heading: "2. Separate damaged batteries",
        paragraphs: [
          "Swollen, leaking, punctured, dented or heat-damaged batteries carry a higher risk. Keep them apart from intact batteries in a separate non-combustible container, and tell your scrap buyer about them before collection — they may need different packing.",
        ],
      },
      {
        heading: "3. Choose the right storage area",
        list: [
          "Cool, dry and well ventilated",
          "Away from direct sunlight, heaters and other heat sources",
          "Away from flammable materials such as cardboard stacks, solvents and fuels",
          "Protected from rain, flooding and high humidity",
          "Accessible, with clear walkways and no heavy loads stacked on top",
        ],
      },
      {
        heading: "4. Use suitable containers",
        paragraphs: [
          "Store batteries in sturdy, non-conductive containers that will not crush under load. Fill empty space with non-conductive cushioning so batteries cannot shift, rub or puncture each other during handling.",
        ],
      },
      {
        heading: "5. Label and keep records",
        paragraphs: [
          "Label each container with the battery type, approximate weight and condition, and keep a simple log of what is stored. Good records make evaluation faster, collection safer and give you a clear audit trail.",
        ],
      },
      {
        heading: "6. Plan collection before dispatch",
        paragraphs: [
          "Lithium batteries are regulated as dangerous goods in transport, and damaged batteries can carry additional requirements. Agree packing, labelling and documentation with your scrap buyer before material leaves your site.",
        ],
      },
      {
        heading: "7. Be prepared for emergencies",
        paragraphs: [
          "Make sure your team knows what to do if a battery starts to smoke, swell rapidly or catch fire: keep people clear, raise the alarm and follow your site's fire-safety procedures. Keep the storage area accessible to emergency responders.",
        ],
      },
      {
        heading: "The bottom line",
        paragraphs: [
          "Most battery incidents in storage are preventable. Protect terminals, isolate damaged units, keep storage cool and organised, and plan collection early. If you are unsure how to prepare a particular lot, our team is happy to advise before collection.",
        ],
      },
    ],
  },
  {
    slug: "understanding-lithium-ion-battery-chemistries",
    title: "Understanding Lithium-Ion Chemistries: NMC, LFP, LCO and Beyond",
    excerpt:
      "“Lithium-ion” is a family, not a single battery. Here's how the common chemistries differ — and why it matters at end of life.",
    category: "Insights",
    date: "2026-10-08", // TODO: Set the actual publication date
    author: AUTHOR,
    image: photos.lithiumCells,
    body: [
      {
        paragraphs: [
          "“Lithium-ion” describes a family of rechargeable batteries rather than a single design. Every lithium-ion cell works on the same principle — lithium ions moving between two electrodes as the battery charges and discharges — but the materials used, especially in the cathode, vary widely.",
          "Those materials shape how a battery performs in daily use. They also determine what can be recovered when it reaches end of life, which is why chemistry matters so much in battery scrap trading.",
        ],
      },
      {
        heading: "NMC — lithium nickel manganese cobalt oxide",
        paragraphs: [
          "NMC offers high energy density, which is why it is widely used in electric vehicles, e-bikes and power tools. Its cathode contains nickel, manganese and cobalt — metals with significant recovery value.",
        ],
      },
      {
        heading: "LFP — lithium iron phosphate",
        paragraphs: [
          "LFP is valued for long cycle life, thermal stability and safety. It is increasingly common in energy storage systems, electric buses, two- and three-wheelers and some passenger cars. LFP cathodes contain no nickel or cobalt, which changes how the material is valued and processed at end of life.",
        ],
      },
      {
        heading: "LCO — lithium cobalt oxide",
        paragraphs: [
          "LCO has long been used in smartphones, laptops, cameras and other portable electronics, where compact size matters most. Its cathode is rich in cobalt.",
        ],
      },
      {
        heading: "LMO and NCA",
        paragraphs: [
          "LMO (lithium manganese oxide) appears in some power tools and medical devices, and is often blended with NMC. NCA (lithium nickel cobalt aluminium oxide) is used in some electric vehicles for its high energy density.",
        ],
      },
      {
        heading: "Formats matter too",
        paragraphs: ["Chemistry is only half of the picture. Cells also come in different formats:"],
        list: [
          "Cylindrical — such as 18650, 21700 and 26650 cells",
          "Prismatic — rigid rectangular cells, common in EVs and energy storage",
          "Pouch — flexible laminated cells used in phones, tablets and some EVs",
        ],
      },
      {
        heading: "Why chemistry matters at end of life",
        paragraphs: [
          "Different chemistries contain different materials and suit different recovery processes. Segregating batteries by chemistry and format helps each lot reach the right downstream channel and allows a more accurate evaluation. To identify what you have:",
        ],
        list: [
          "Check labels and markings on the cell or pack",
          "Refer to datasheets or purchase records",
          "Note model numbers and the original application",
          "Share clear photographs if you are unsure",
        ],
      },
      {
        heading: "Not sure what you have?",
        paragraphs: [
          "Mixed and unlabelled lots are common. Share photographs and whatever details you have, and our team will help identify the material before evaluation.",
        ],
      },
    ],
  },
  {
    slug: "why-responsible-battery-recycling-matters-in-india",
    title: "Why Responsible Battery Recycling Matters for India's Clean-Energy Future",
    excerpt:
      "As India electrifies transport and adds energy storage, the batteries behind the transition need a responsible end-of-life pathway.",
    category: "Sustainability",
    date: "2026-10-08", // TODO: Set the actual publication date
    author: AUTHOR,
    image: photos.solarAerial,
    body: [
      {
        paragraphs: [
          "Electric two- and three-wheelers, e-rickshaws, rooftop solar with battery backup, telecom towers and the phones and laptops we rely on every day — lithium-ion batteries are fast becoming part of everyday life in India. Every one of them will eventually reach the end of its working life.",
          "What happens next matters. Handled responsibly, used batteries are a valuable source of materials. Handled carelessly, they are a safety and environmental hazard.",
        ],
      },
      {
        heading: "Used batteries are a resource",
        paragraphs: [
          "Depending on chemistry, lithium-ion batteries contain lithium, nickel, cobalt, manganese, copper, aluminium and graphite. Recovering these materials keeps them in productive use and can reduce dependence on newly mined — and often imported — raw materials.",
        ],
      },
      {
        heading: "The cost of informal disposal",
        paragraphs: [
          "Batteries thrown away with general waste, or dismantled without proper controls, can short-circuit and catch fire in waste vehicles and facilities. Damaged cells can also release hazardous substances. Responsible channels reduce these risks for workers, communities and the environment.",
        ],
      },
      {
        heading: "Regulation is raising the bar",
        paragraphs: [
          "India's Battery Waste Management Rules, 2022 introduced Extended Producer Responsibility (EPR) for batteries, making producers responsible for the collection and recycling or refurbishment of the batteries they place on the market. The framework encourages a more organised, accountable battery value chain.",
        ],
      },
      {
        heading: "Where battery scrap traders fit in",
        paragraphs: [
          "Between the businesses that generate battery scrap and the facilities that recover its materials sits a crucial link: accurate identification, segregation, documentation and logistics. Done well, this step ensures material reaches the right process — and that every party has a clear record of where it went.",
        ],
      },
      {
        heading: "What businesses can do today",
        list: [
          "Designate a safe, organised storage area for battery scrap",
          "Segregate batteries by type and condition",
          "Keep simple records of quantities and dispatches",
          "Work with accountable partners who document every transaction",
          "Plan regular collections rather than letting stock accumulate",
        ],
      },
      {
        heading: "Waste today, value tomorrow",
        paragraphs: [
          "The clean-energy transition will be measured not only by how many batteries we deploy, but by how responsibly we manage them at end of life. Every battery recovered properly keeps valuable materials in the economy and out of landfill — a future worth building.",
        ],
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function readingMinutes(post: BlogPost) {
  const words = post.body
    .flatMap((block) => [block.heading ?? "", ...(block.paragraphs ?? []), ...(block.list ?? [])])
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatPostDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}

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
    title: "Storing and Packing Lithium-Ion Battery Scrap Safely: A Practical Guide",
    excerpt:
      "Lithium-ion scrap waiting for pickup can still short-circuit or overheat. These everyday precautions keep the risk low.",
    category: "Safety",
    date: "2026-10-08", // TODO: Set the actual publication date
    author: AUTHOR,
    image: photos.liIonLabel,
    body: [
      {
        paragraphs: [
          "It is easy to assume that a used lithium-ion battery is a dead one. In practice, most scrap batteries still carry some charge, and a cell that has been dented, crushed or shorted can heat up quickly enough to catch fire. Fortunately, most of that risk can be managed with a handful of simple routines.",
          "Below are the precautions we suggest to any business holding lithium-ion scrap, whether that means one carton of old phone batteries or several pallets of factory rejects.",
        ],
      },
      {
        heading: "Cover exposed terminals",
        paragraphs: [
          "Short circuits in storage usually start when a battery's terminals touch each other, a metal object or a conductive surface. Stop that from happening and you remove one of the biggest hazards.",
        ],
        list: [
          "Tape over bare terminals and connectors with insulating tape",
          "Put small batteries in their own bags wherever you can",
          "Keep loose batteries out of metal bins and drums",
        ],
      },
      {
        heading: "Keep damaged batteries apart",
        paragraphs: [
          "Batteries that are swollen, leaking, punctured, dented or scorched are more likely to fail. Store them away from intact batteries in their own non-combustible container, and mention them to your buyer before pickup, as they may need special packing.",
        ],
      },
      {
        heading: "Pick a suitable storage spot",
        list: [
          "Somewhere cool and dry with good airflow",
          "Out of direct sun and well away from heaters or other heat sources",
          "Clear of anything flammable, such as stacked cardboard, solvents or fuel",
          "Sheltered from rain, standing water and damp",
          "Easy to reach, with clear access and nothing heavy piled on top",
        ],
      },
      {
        heading: "Choose sturdy, non-conductive containers",
        paragraphs: [
          "Use strong containers made from non-conductive material that won't collapse when stacked. Pack any gaps with non-conductive padding so the batteries can't slide around, rub together or pierce one another when the container is moved.",
        ],
      },
      {
        heading: "Label every container and keep a log",
        paragraphs: [
          "Mark each container with the type of battery, a rough weight and its condition, and keep a basic record of what you have in storage. A good log speeds up evaluation, makes pickups safer and leaves you with a clear paper trail.",
        ],
      },
      {
        heading: "Agree the details before anything leaves your site",
        paragraphs: [
          "Lithium batteries are classed as dangerous goods for transport, and damaged ones may come with extra rules. Settle packing, labelling and paperwork with your scrap buyer before the material is collected.",
        ],
      },
      {
        heading: "Have an emergency plan",
        paragraphs: [
          "Make sure everyone on site knows what to do if a battery begins to smoke, swell suddenly or ignite: move people away, raise the alarm and follow your fire-safety procedure. Keep the storage area clear so emergency services can get to it.",
        ],
      },
      {
        heading: "In short",
        paragraphs: [
          "Nearly every storage incident involving batteries can be avoided. Cover the terminals, separate damaged units, keep the area cool and tidy, and arrange collection in good time. If you're not sure how to prepare a particular lot, ask our team before pickup and we'll advise.",
        ],
      },
    ],
  },
  {
    slug: "understanding-lithium-ion-battery-chemistries",
    title: "NMC, LFP, LCO and More: A Plain-English Guide to Lithium-Ion Chemistries",
    excerpt:
      "Not all lithium-ion batteries are alike. A quick look at the main chemistries, and why the differences count when a battery is scrapped.",
    category: "Insights",
    date: "2026-10-08", // TODO: Set the actual publication date
    author: AUTHOR,
    image: photos.lithiumCells,
    body: [
      {
        paragraphs: [
          "“Lithium-ion” is an umbrella term. Every lithium-ion cell works the same basic way, with lithium ions travelling from one electrode to the other as it charges and back again as it discharges. What changes from one battery to the next is the choice of materials, above all in the cathode.",
          "Those materials decide how a battery behaves while it is in service. They also decide what can be recovered from it at the end, which is why chemistry is one of the first things we ask about when we evaluate scrap.",
        ],
      },
      {
        heading: "NMC (nickel manganese cobalt)",
        paragraphs: [
          "NMC packs a lot of energy into a small space, so it is a common choice for electric vehicles, e-bikes and power tools. Its cathode contains nickel, manganese and cobalt, all of which are valuable to recover.",
        ],
      },
      {
        heading: "LFP (lithium iron phosphate)",
        paragraphs: [
          "LFP is known for lasting through many charge cycles and for being thermally stable. It is now widely used in energy storage, electric buses, two- and three-wheelers and some cars. Because an LFP cathode has no nickel or cobalt, it is valued and processed differently from other chemistries at end of life.",
        ],
      },
      {
        heading: "LCO (lithium cobalt oxide)",
        paragraphs: [
          "For many years LCO has been the go-to chemistry for phones, laptops, cameras and other portable devices where small size matters. Its cathode is high in cobalt.",
        ],
      },
      {
        heading: "LMO, NCA and LTO",
        paragraphs: [
          "LMO (lithium manganese oxide) turns up in some power tools and medical equipment, and is often mixed with NMC. NCA (nickel cobalt aluminium) is used in certain electric vehicles because of its high energy density. LTO (lithium titanate) differs in that it changes the anode rather than the cathode, and is chosen for very long life and fast charging in some specialist uses.",
        ],
      },
      {
        heading: "The shape of the cell matters too",
        paragraphs: ["Chemistry tells only part of the story. Cells are also made in several physical formats:"],
        list: [
          "Cylindrical, for example 18650, 21700 and 26650 cells",
          "Prismatic: hard-cased rectangular cells, often found in EVs and storage systems",
          "Pouch: soft, flat cells used in phones, tablets and some vehicles",
        ],
      },
      {
        heading: "Why it matters when a battery is scrapped",
        paragraphs: [
          "Each chemistry contains its own mix of materials and is suited to particular recovery processes. Separating batteries by chemistry and format helps every lot reach the right place and makes the evaluation more accurate. To find out what you have:",
        ],
        list: [
          "Look for labels and markings on the cell or pack",
          "Check the datasheet or your purchase records",
          "Write down model numbers and what the battery was used in",
          "Take clear photos if you're still unsure",
        ],
      },
      {
        heading: "Still can't tell?",
        paragraphs: [
          "Mixed and unmarked lots are very common. Send us photos and any details you have, and our team will help identify the material before we evaluate it.",
        ],
      },
    ],
  },
  {
    slug: "why-responsible-battery-recycling-matters-in-india",
    title: "Responsible Battery Recycling and India's Clean-Energy Future",
    excerpt:
      "India is electrifying its transport and adding energy storage at pace. The batteries that make this possible need a responsible route at end of life.",
    category: "Sustainability",
    date: "2026-10-08", // TODO: Set the actual publication date
    author: AUTHOR,
    image: photos.solarAerial,
    body: [
      {
        paragraphs: [
          "Think of the e-rickshaws and electric scooters on Indian roads, the rooftop solar systems with battery backup, the telecom towers, and the phones and laptops in every home and office. Lithium-ion batteries are now part of daily life across India, and each one will eventually be worn out.",
          "What we do with them at that point makes a real difference. Managed well, old batteries are a valuable supply of materials. Managed badly, they put people and the environment at risk.",
        ],
      },
      {
        heading: "Old batteries are worth something",
        paragraphs: [
          "Depending on chemistry, a lithium-ion battery can contain lithium, nickel, cobalt, manganese, copper, aluminium and graphite. Recovering these keeps them in use and can lower the need for newly mined raw materials, many of which India currently imports.",
        ],
      },
      {
        heading: "The hidden cost of careless disposal",
        paragraphs: [
          "Batteries dumped with household or commercial waste, or broken apart without proper controls, can short-circuit and start fires in collection vehicles and waste sites. Damaged cells can also leak harmful substances. Responsible channels cut these risks for workers, neighbourhoods and the environment.",
        ],
      },
      {
        heading: "The rules are getting stricter",
        paragraphs: [
          "The Battery Waste Management Rules, 2022, issued by India's Ministry of Environment, Forest and Climate Change, replaced the earlier 2001 rules and brought in Extended Producer Responsibility (EPR) for batteries. Producers are now responsible for making sure the batteries they sell are collected and then recycled or refurbished. The aim is a better-organised, more accountable battery supply chain.",
        ],
      },
      {
        heading: "The role of a battery scrap trader",
        paragraphs: [
          "Between the businesses that produce battery scrap and the plants that recover its materials, someone has to identify the batteries correctly, sort them, document them and move them. When that link works well, material reaches a suitable process and everyone involved has a clear record of where it went.",
        ],
      },
      {
        heading: "Steps any business can take now",
        list: [
          "Set aside a safe, tidy area for storing battery scrap",
          "Sort batteries by type and by condition",
          "Keep a basic log of quantities stored and dispatched",
          "Deal only with partners who document every transaction",
          "Book regular pickups instead of letting stock build up",
        ],
      },
      {
        heading: "Waste today, value tomorrow",
        paragraphs: [
          "India's move to clean energy will be judged not just by how many batteries it puts to work, but by how well it looks after them once they wear out. Each battery recovered properly keeps useful materials in the economy and out of landfill. That is a future worth working toward.",
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

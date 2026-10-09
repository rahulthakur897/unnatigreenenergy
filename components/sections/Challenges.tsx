import { HardHat, Package, Scale } from "lucide-react";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const challenges = [
  {
    title: "Scrap that keeps accumulating",
    text: "Rejected cells, returns and end-of-life packs take up space and add risk. We provide a planned, dependable outlet.",
    icon: Package,
  },
  {
    title: "Uncertain value",
    text: "Battery scrap varies widely. Clear evaluation by type, chemistry and condition shows how your material is valued.",
    icon: Scale,
  },
  {
    title: "Handling and safety concerns",
    text: "Lithium-ion batteries need care. We share packing guidance and coordinate movement responsibly.",
    icon: HardHat,
  },
];

export function Challenges({ id = "challenges" }: { id?: string }) {
  return (
    <section aria-labelledby={`${id}-title`} className="section-y">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            id={`${id}-title`}
            align="center"
            eyebrow="Common Challenges"
            title="Whatever your sector, the challenges are familiar"
          />
        </Reveal>
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {challenges.map((challenge, index) => (
            <Reveal as="li" key={challenge.title} delay={index * 90}>
              <FeatureCard {...challenge} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

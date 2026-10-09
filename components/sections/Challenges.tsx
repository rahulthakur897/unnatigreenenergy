import { HardHat, Package, Scale } from "lucide-react";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const challenges = [
  {
    title: "Scrap piling up",
    text: "Rejected cells, returns and worn-out packs eat up floor space and add risk. We give you a regular, reliable way to clear them.",
    icon: Package,
  },
  {
    title: "Not knowing what it's worth",
    text: "No two lots of battery scrap are the same. We assess type, chemistry and condition and show you how we reached our figure.",
    icon: Scale,
  },
  {
    title: "Worries about safety",
    text: "Lithium-ion batteries have to be handled with care. We advise on packing and arrange transport responsibly.",
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
            eyebrow="Familiar Problems"
            title="Different industries, the same headaches"
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

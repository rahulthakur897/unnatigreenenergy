import { Challenges } from "@/components/sections/Challenges";
import { CTA } from "@/components/sections/CTA";
import { IndustriesGrid } from "@/components/sections/IndustriesGrid";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { photos } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";
import { quoteHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Industries We Serve",
  description:
    "How UNNATI GREEN ENERGY handles battery scrap for EV makers, battery manufacturers, energy storage, automotive, electronics, renewable energy, industrial equipment and consumer electronics.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        id="industries-hero"
        eyebrow="Industries"
        title="Industries We Serve"
        description="From vehicles to factories to the phone in your hand, lithium-ion batteries are everywhere. Whatever your industry, we can take your battery scrap and recover its value."
        image={photos.industrialBatteries}
        crumbs={[{ label: "Industries", href: "/industries" }]}
      >
        <ButtonLink href={quoteHref} variant="accent" size="lg" arrow>
          Tell Us What You Need
        </ButtonLink>
      </PageHero>
      <IndustriesGrid
        id="industries-list"
        eyebrow="Sectors"
        title="Know-how for each sector, one standard for all"
        description="Each industry ends up with battery scrap in its own way. Pick a sector to see the material we usually handle there and how we help."
        showLink={false}
      />
      <Challenges id="industries-challenges" />
      <CTA id="industries-cta" />
    </>
  );
}

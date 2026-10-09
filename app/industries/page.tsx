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
    "Battery scrap solutions for EV and electric mobility, battery manufacturers, energy storage, automotive, electronics, renewable energy, industrial equipment and consumer electronics.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        id="industries-hero"
        eyebrow="Industries"
        title="Industries We Serve"
        description="Lithium-ion batteries power almost every modern industry. We help each one manage battery scrap responsibly — and recover the value inside it."
        image={photos.industrialBatteries}
        crumbs={[{ label: "Industries", href: "/industries" }]}
      >
        <ButtonLink href={quoteHref} variant="accent" size="lg" arrow>
          Discuss Your Requirements
        </ButtonLink>
      </PageHero>
      <IndustriesGrid
        id="industries-list"
        eyebrow="Sectors"
        title="Sector understanding, one responsible standard"
        description="Every industry generates battery scrap differently. Select a sector to see the material we typically handle and how we support it."
        showLink={false}
      />
      <Challenges id="industries-challenges" />
      <CTA id="industries-cta" />
    </>
  );
}

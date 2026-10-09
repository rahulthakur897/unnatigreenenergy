import { PageHero } from "@/components/sections/PageHero";
import { EvaluationFactors, ProductGrid } from "@/components/sections/ProductGrid";
import { ButtonLink } from "@/components/ui/Button";
import { photos } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";
import { quoteHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Our Products — Lithium-Ion Cells & Battery Scrap",
  description:
    "Lithium-ion cells, battery packs and modules, EV and e-rickshaw batteries, energy storage, LED, medical, consumer electronics and industrial battery scrap traded by UNNATI GREEN ENERGY.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <PageHero
        id="products-hero"
        eyebrow="Our Products"
        title="Lithium-Ion Cells & Battery Scrap We Trade"
        description="Cells, packs and modules across chemistries, formats and applications — each lot evaluated transparently and routed responsibly."
        image={photos.batteryModules}
        crumbs={[{ label: "Our Products", href: "/products" }]}
      >
        <ButtonLink href={quoteHref} variant="accent" size="lg" arrow>
          Request a Quote
        </ButtonLink>
      </PageHero>
      <ProductGrid id="products-catalogue" />
      <EvaluationFactors id="products-evaluation" />
    </>
  );
}

import { PageHero } from "@/components/sections/PageHero";
import { EvaluationFactors, ProductGrid } from "@/components/sections/ProductGrid";
import { ButtonLink } from "@/components/ui/Button";
import { photos } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";
import { quoteHref } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Our Products — Lithium-Ion Cells & Battery Scrap",
  description:
    "UNNATI GREEN ENERGY buys lithium-ion cells, packs and modules, EV and e-rickshaw batteries, and battery scrap from energy storage, lighting, medical, consumer electronics and industrial sources.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <PageHero
        id="products-hero"
        eyebrow="Our Products"
        title="The Cells and Battery Scrap We Buy"
        description="Cells, packs and modules of almost every chemistry, format and use. Each lot is assessed openly and sent on to the right place."
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

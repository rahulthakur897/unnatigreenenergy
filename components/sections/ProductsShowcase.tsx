import { Camera } from "lucide-react";
import { ProductCard } from "@/components/cards/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowLink, ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products } from "@/content/products";
import { quoteHref } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Editorial bento grid of product categories (swipeable carousel on phones). */
export function ProductsShowcase({
  id = "products",
  showLink = true,
  className,
}: {
  id?: string;
  showLink?: boolean;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("section-y", className)}>
      <div className="container-site">
        <Reveal>
          <SectionHeading
            id={`${id}-title`}
            split
            eyebrow="Our Products"
            title="The Cells and Battery Scrap We Buy"
            description="Single cells, complete packs and everything in between, from almost any application. We price each lot on its chemistry, condition and quantity."
            action={showLink ? <ArrowLink href="/products">View all products</ArrowLink> : undefined}
          />
        </Reveal>

        <ul
          aria-label="Product categories"
          className="no-scrollbar -mx-4 mt-12 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 md:mx-0 md:mt-14 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4"
        >
          {products.map((product, index) => (
            <li
              key={product.slug}
              className={cn("w-[82%] shrink-0 snap-start sm:w-[58%] md:w-auto", index === 0 && "md:col-span-2 lg:row-span-2")}
            >
              <Reveal className="h-full" delay={(index % 4) * 80}>
                <ProductCard product={product} featured={index === 0} />
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-center text-xs text-ink-400 md:hidden" aria-hidden="true">
          Swipe to see all products →
        </p>

        <Reveal className="mt-8 md:mt-10">
          <div className="flex flex-col gap-6 rounded-[1.5rem] border border-dashed border-leaf-300 bg-leaf-50/70 p-6 sm:p-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-forest-700 shadow-soft">
                <Camera className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-ink-950">Don&rsquo;t know which category fits?</h3>
                <p className="mt-1 max-w-xl text-[0.9375rem] leading-relaxed text-ink-500">
                  Send us some photos and a few lines about it. We&rsquo;ll work out what it is and tell you what happens next.
                </p>
              </div>
            </div>
            <ButtonLink href={quoteHref} arrow className="self-start md:self-auto">
              Share Material Details
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Atom, Boxes, Check, ScanSearch, Weight } from "lucide-react";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { products } from "@/content/products";
import { quoteHref } from "@/lib/site";
import { stepNumber } from "@/lib/utils";

/** Detailed product catalogue used on the Products page. */
export function ProductGrid({ id = "product-catalogue" }: { id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section-y bg-white">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            id={`${id}-title`}
            split
            eyebrow="Product Range"
            title="The material we buy"
            description="We assess each category on its own merits. If your material falls between categories, just send us the details. Mixed lots are very common."
          />
        </Reveal>

        <ul className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
            <Reveal as="li" key={product.slug} delay={(index % 3) * 90}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-mist-200 bg-white transition-[box-shadow,border-color,transform] duration-500 ease-premium hover:-translate-y-1 hover:border-leaf-300/60 hover:shadow-lift">
                <div className="relative aspect-[16/10] overflow-hidden bg-forest-900">
                  <Image
                    src={product.image.src}
                    alt={product.image.alt}
                    fill
                    sizes="(min-width: 1280px) 400px, (min-width: 768px) 50vw, 92vw"
                    placeholder="blur"
                    className="object-cover transition-transform duration-[1400ms] ease-premium group-hover:scale-[1.05]"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-forest-950/50 to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 font-display text-xs font-bold text-forest-700 shadow-soft">
                    {stepNumber(index)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 sm:p-7">
                  <ul className="flex flex-wrap gap-1.5" aria-label={`${product.title} formats`}>
                    {product.tags.map((tag) => (
                      <li key={tag} className="rounded-full bg-leaf-50 px-2.5 py-1 text-[0.6875rem] font-semibold text-forest-700 ring-1 ring-leaf-100">
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <h3 className="mt-4 font-display text-xl font-bold tracking-tight text-ink-950">{product.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-500">{product.description}</p>
                  <ul className="mt-5 flex-1 space-y-2.5 border-t border-mist-200 pt-5">
                    {product.includes.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-ink-700">
                        <Check className="mt-0.5 size-4 shrink-0 text-leaf-600" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={quoteHref}
                    className="group/link mt-6 inline-flex items-center gap-2 self-start text-sm font-semibold text-forest-700 hover:text-forest-900"
                  >
                    Request a quote
                    <span className="sr-only"> for {product.title}</span>
                    <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover/link:translate-x-1" />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

const factors = [
  {
    title: "Chemistry",
    text: "NMC, LFP, LCO, LMO and other chemistries contain different materials, which affects both value and where a lot is sent.",
    icon: Atom,
  },
  {
    title: "Format",
    text: "Whether it's cells, packs or modules, and whether cells are cylindrical, prismatic or pouch, changes how material is handled and recovered.",
    icon: Boxes,
  },
  {
    title: "Condition",
    text: "New, used, rejected or damaged: the state of the material sets its handling needs and its value.",
    icon: ScanSearch,
  },
  {
    title: "Volume",
    text: "How much you have, and how often, shapes the commercial terms for a single lot or a regular supply.",
    icon: Weight,
  },
];

export function EvaluationFactors({ id = "evaluation" }: { id?: string }) {
  return (
    <section aria-labelledby={`${id}-title`} className="section-y">
      <div className="container-site">
        <Reveal>
          <SectionHeading
            id={`${id}-title`}
            align="center"
            eyebrow="How We Evaluate"
            title="The four things we look at"
            description="A fair evaluation begins with knowing exactly what your material is."
          />
        </Reveal>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {factors.map((factor, index) => (
            <Reveal as="li" key={factor.title} delay={index * 80}>
              <FeatureCard {...factor} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

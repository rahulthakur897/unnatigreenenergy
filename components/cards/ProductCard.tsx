import Image from "next/image";
import type { Product } from "@/content/products";
import { cn } from "@/lib/utils";

/** Premium image card for a product product. */
export function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  return (
    <article
      className={cn(
        "group relative isolate flex h-full min-h-[24rem] flex-col justify-end overflow-hidden rounded-[1.5rem] bg-forest-900 text-white sm:min-h-[22rem]",
        featured && "lg:min-h-[100%]",
      )}
    >
      <Image
        src={product.image.src}
        alt={product.image.alt}
        fill
        sizes={featured ? "(min-width: 1024px) 50vw, (min-width: 768px) 100vw, 80vw" : "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 80vw"}
        placeholder="blur"
        className="-z-20 object-cover transition-transform duration-[1400ms] ease-premium group-hover:scale-[1.06]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950 via-forest-950/55 to-forest-950/0 transition-opacity duration-500"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-forest-950/0 transition-colors duration-500 group-hover:bg-forest-950/25"
      />

      <div className={cn("p-6 sm:p-7", featured && "lg:p-10")}>
        <ul className="flex flex-wrap gap-1.5" aria-label={`${product.title} includes`}>
          {product.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[0.6875rem] font-medium tracking-wide text-white/90 backdrop-blur-sm"
            >
              {tag}
            </li>
          ))}
        </ul>
        <h3
          className={cn(
            "mt-4 font-display font-bold leading-tight tracking-tight",
            featured ? "text-2xl lg:text-[2rem]" : "text-xl sm:text-[1.375rem]",
          )}
        >
          {product.title}
        </h3>
        <p className={cn("mt-2 text-sm leading-relaxed text-white/75", featured && "lg:max-w-md lg:text-base")}>
          {product.description}
        </p>
        <span
          aria-hidden="true"
          className="mt-5 block h-0.5 w-10 origin-left rounded-full bg-sun-400 transition-transform duration-700 ease-premium group-hover:scale-x-[2.5]"
        />
      </div>
    </article>
  );
}

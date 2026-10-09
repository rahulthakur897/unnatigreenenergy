import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { CellPattern, SunGlow } from "@/components/ui/Decor";
import { quoteHref } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

const shortcuts = [
  { label: "Our Products", href: "/products" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Blog", href: "/blog" },
];

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title" className="surface-dark relative isolate overflow-hidden bg-forest-950 text-white">
      <CellPattern id="not-found-cells" className="-z-10 text-white/[0.04] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <SunGlow className="-right-40 -top-56 -z-10 size-[40rem]" />
      <div className="container-site flex min-h-[100svh] flex-col items-start justify-center pb-24 pt-40">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-sun-300">Error 404</p>
        <h1 id="not-found-title" className="mt-5 max-w-3xl font-display text-5xl font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-7xl">
          This page has been <span className="text-gradient-energy">recycled.</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved. Let&rsquo;s get you back on track.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/" variant="accent" size="lg" arrow>
            Back to Home
          </ButtonLink>
          <ButtonLink href={quoteHref} variant="outlineLight" size="lg">
            Request a Quote
          </ButtonLink>
        </div>
        <nav aria-label="Popular pages" className="mt-14">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {shortcuts.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

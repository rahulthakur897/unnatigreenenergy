import Image from "next/image";
import { Building2 } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { PlaceholderTag } from "@/components/ui/Decor";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { partners } from "@/content/placeholders";

/** Partner/client logos. Replace the placeholders in content/placeholders.ts. */
export function LogoCloud({ id = "partners" }: { id?: string }) {
  const hasPlaceholders = partners.some((partner) => partner.isPlaceholder);

  return (
    <section aria-labelledby={`${id}-title`} className="border-t border-mist-200 bg-white py-16 md:py-24">
      <div className="container-site">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Partners</Eyebrow>
            <h2 id={`${id}-title`} className="mt-4 font-display text-[1.75rem] font-bold tracking-tight text-ink-950 sm:text-4xl">
              Building Stronger Partnerships
            </h2>
          </div>
          <div className="flex max-w-md flex-col items-start gap-3 md:items-end md:text-right">
            <p className="leading-relaxed text-ink-500">
              Responsible battery recovery is a team effort across the value chain — from manufacturers and aggregators to
              recyclers and industrial businesses.
            </p>
            {hasPlaceholders && <PlaceholderTag />}
          </div>
        </Reveal>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {partners.map((partner, index) => (
            <Reveal as="li" key={partner.name} delay={index * 60}>
              <div className="group grid aspect-[5/3] place-items-center rounded-2xl border border-dashed border-mist-300 bg-mist-50 px-4 text-ink-400 transition-colors duration-500 hover:border-leaf-300 hover:bg-leaf-50/60 hover:text-forest-700">
                {partner.logo ? (
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    width={160}
                    height={64}
                    className="h-10 w-auto object-contain opacity-70 grayscale transition duration-500 group-hover:opacity-100 group-hover:grayscale-0"
                  />
                ) : (
                  <span className="flex flex-col items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]">
                    <Building2 className="size-6" aria-hidden="true" />
                    Partner Logo
                  </span>
                )}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

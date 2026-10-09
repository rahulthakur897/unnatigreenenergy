import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { CellPattern, SunGlow } from "@/components/ui/Decor";
import { Eyebrow } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { quoteHref, talkHref } from "@/lib/site";

/** High-conversion quote call-to-action. */
export function CTA({
  id = "quote-cta",
  title = (
    <>
      Got Battery Scrap <span className="text-gradient-energy">to Move On?</span>
    </>
  ),
  description = "Tell us what you have, and we'll work out a responsible route for it that pays.",
}: {
  id?: string;
  title?: ReactNode;
  description?: string;
}) {
  return (
    <section aria-labelledby={`${id}-title`} className="surface-dark relative isolate overflow-hidden bg-forest-950 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_120%,rgb(8_87_22/0.7),transparent_60%)]" />
      <CellPattern
        id={`${id}-cells`}
        className="-z-10 text-white/[0.06] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]"
      />
      {/* Concentric rings echo the circular economy and the sun in the logo */}
      <div aria-hidden="true" className="absolute left-1/2 top-1/2 -z-10 size-[44rem] -translate-x-1/2 -translate-y-1/2 sm:size-[56rem]">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeOpacity="0.07" strokeWidth="0.15" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="0.15" />
          <g className="origin-center animate-spin-slow [transform-box:fill-box]">
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#fec702"
              strokeOpacity="0.55"
              strokeWidth="0.3"
              strokeLinecap="round"
              strokeDasharray="22 242"
            />
          </g>
          <g className="origin-center animate-spin-slower [transform-box:fill-box]">
            <circle cx="50" cy="50" r="30" fill="none" stroke="#b2dc82" strokeOpacity="0.5" strokeWidth="0.3" strokeLinecap="round" strokeDasharray="14 175" />
          </g>
        </svg>
      </div>
      <SunGlow className="-right-40 -top-40 size-[32rem]" />

      <div className="container-site py-24 md:py-32 lg:py-40">
        <Reveal className="mx-auto max-w-4xl text-center">
          <Eyebrow tone="dark" className="justify-center">
            Get in Touch
          </Eyebrow>
          <h2
            id={`${id}-title`}
            className="mt-6 font-display text-[2.625rem] font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-6xl lg:text-7xl"
          >
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/70 sm:text-xl">{description}</p>
          <div className="mt-11 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href={quoteHref} variant="accent" size="lg" arrow>
              Request a Quote
            </ButtonLink>
            <ButtonLink href={talkHref} variant="outlineLight" size="lg">
              Talk to Our Team
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

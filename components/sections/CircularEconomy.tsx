import { Reveal } from "@/components/motion/Reveal";
import { CircularLoop } from "@/components/sections/CircularLoop";
import { CellPattern, SunGlow } from "@/components/ui/Decor";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CircularEconomy({ id = "circular-economy" }: { id?: string }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="surface-dark section-y relative isolate overflow-hidden bg-forest-950 text-white"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_28%_60%,rgb(8_87_22/0.55),transparent_60%)]" />
      <CellPattern id={`${id}-cells`} className="-z-10 text-white/[0.03] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <SunGlow className="-right-56 -top-72 size-[46rem] opacity-80" />

      <div className="container-site">
        <Reveal>
          <SectionHeading
            id={`${id}-title`}
            align="center"
            tone="dark"
            eyebrow="Circular Economy"
            title="Closing the Loop on Battery Waste"
            description="Batteries don't have to end as waste. Each stage of the loop keeps valuable materials moving — from first use to new energy value."
          />
        </Reveal>
        <Reveal className="mt-14 md:mt-20" delay={120}>
          <CircularLoop />
        </Reveal>
      </div>
    </section>
  );
}

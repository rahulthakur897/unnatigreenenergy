import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCarousel } from "@/components/sections/TestimonialCarousel";

export function Testimonials({ id = "testimonials" }: { id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="section-y bg-white">
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <Reveal className="lg:col-span-4">
          <SectionHeading
            id={`${id}-title`}
            eyebrow="Testimonials"
            title="In Our Clients' Words"
            description="Real comments from the businesses we work with will appear here, published only with each client's consent."
          />
        </Reveal>
        <Reveal className="lg:col-span-8" delay={100}>
          <TestimonialCarousel />
        </Reveal>
      </div>
    </section>
  );
}

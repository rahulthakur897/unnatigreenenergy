import { Quote } from "lucide-react";
import { PlaceholderTag } from "@/components/ui/Decor";
import type { Testimonial } from "@/content/placeholders";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="relative">
      <Quote className="size-11 text-sun-400" aria-hidden="true" />
      <blockquote className="mt-6 font-display text-[1.375rem] font-semibold leading-snug tracking-tight text-ink-900 sm:text-[1.75rem]">
        <p>&ldquo;{testimonial.quote}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-9 flex flex-wrap items-center gap-4">
        <span
          aria-hidden="true"
          className="grid size-12 place-items-center rounded-full bg-forest-700 font-display text-sm font-bold text-sun-300"
        >
          {initials(testimonial.name)}
        </span>
        <span>
          <span className="block font-semibold text-ink-950">{testimonial.name}</span>
          <span className="block text-sm text-ink-500">
            {testimonial.role}, {testimonial.company}
          </span>
        </span>
        {testimonial.isPlaceholder && <PlaceholderTag className="sm:ml-auto" />}
      </figcaption>
    </figure>
  );
}

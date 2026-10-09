"use client";

import { AnimatePresence, m } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { testimonials } from "@/content/placeholders";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function TestimonialCarousel() {
  const [[index, direction], setSlide] = useState<[number, number]>([0, 1]);
  const total = testimonials.length;

  const go = (next: number, dir: number) => setSlide([(next + total) % total, dir]);

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Client testimonials">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-mist-200 bg-mist-50 p-7 sm:p-12">
        <div
          aria-hidden="true"
          className="absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,rgb(254_199_2/0.18),transparent_70%)]"
        />
        <div className="relative min-h-[17rem] sm:min-h-[15rem]" aria-live="polite">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <m.div
              key={index}
              custom={direction}
              variants={{
                enter: (dir: number) => ({ opacity: 0, x: dir * 36 }),
                center: { opacity: 1, x: 0 },
                exit: (dir: number) => ({ opacity: 0, x: dir * -36 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: EASE }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${total}`}
            >
              <TestimonialCard testimonial={testimonials[index]} />
            </m.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex gap-2">
          {testimonials.map((_, dot) => (
            <button
              key={dot}
              type="button"
              onClick={() => go(dot, dot > index ? 1 : -1)}
              aria-label={`Show testimonial ${dot + 1}`}
              aria-current={dot === index ? "true" : undefined}
              className="grid h-8 place-items-center px-1"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-500",
                  dot === index ? "w-8 bg-forest-700" : "w-3 bg-mist-300 hover:bg-ink-400",
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-display text-sm font-semibold tabular-nums text-ink-500">
            {String(index + 1).padStart(2, "0")} <span className="text-ink-400">/ {String(total).padStart(2, "0")}</span>
          </span>
          <button
            type="button"
            onClick={() => go(index - 1, -1)}
            aria-label="Previous testimonial"
            className="grid size-11 place-items-center rounded-full border border-mist-300 text-ink-900 transition-colors hover:border-forest-700 hover:bg-forest-700 hover:text-white"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1, 1)}
            aria-label="Next testimonial"
            className="grid size-11 place-items-center rounded-full border border-mist-300 text-ink-900 transition-colors hover:border-forest-700 hover:bg-forest-700 hover:text-white"
          >
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

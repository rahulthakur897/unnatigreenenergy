"use client";

import Image from "next/image";
import { AnimatePresence, m, useInView, useReducedMotion } from "motion/react";
import { Pause, Play, ShieldCheck } from "lucide-react";
import { useId, useRef, useState, type ReactNode } from "react";
import type { Photo } from "@/lib/images";
import { cn, stepNumber } from "@/lib/utils";

export type QualityItem = { title: string; text: string; icon: ReactNode; image: Photo };

const STEP_SECONDS = 6;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Interactive "standards" explorer. Auto-advances with a progress bar (driven by a CSS
 * animation, so pausing is exact), pauses on hover, focus and when off-screen, stops
 * after the visitor chooses a standard, and never auto-plays for reduced-motion users.
 */
export function QualityExplorer({ items }: { items: QualityItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const uid = useId();
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [hovering, setHovering] = useState(false);

  const showProgress = autoplay && !reduceMotion;
  const paused = !inView || hovering;
  const current = items[active];

  const select = (index: number) => {
    setActive(index);
    setAutoplay(false);
  };

  return (
    <div
      ref={ref}
      data-paused={paused ? "true" : undefined}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="grid gap-8 lg:grid-cols-12 lg:gap-14"
    >
      {/* Image stage — decorative; the list below carries the content */}
      <div aria-hidden="true" className="lg:order-2 lg:col-span-7">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-forest-900 shadow-lift sm:aspect-[16/11] lg:aspect-auto lg:h-full lg:min-h-[36rem]">
          {items.map((item, index) => (
            <Image
              key={item.title}
              src={item.image.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 700px, 100vw"
              placeholder="blur"
              className={cn(
                "object-cover transition-[opacity,transform] duration-[1400ms] ease-premium",
                index === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0",
              )}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/20 to-forest-950/10" />

          {/* Rotating values seal (not a certification) */}
          <div className="absolute right-5 top-5 size-24 sm:right-7 sm:top-7 sm:size-28">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow">
              <defs>
                <path id={`${uid}-seal`} d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <circle cx="50" cy="50" r="49" fill="rgb(1 23 10 / 0.55)" />
              <text fill="white" fillOpacity="0.85" fontSize="8" fontWeight="600" letterSpacing="1.7">
                <textPath href={`#${uid}-seal`}>SAFETY • QUALITY • RESPONSIBILITY •</textPath>
              </text>
            </svg>
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-10 place-items-center rounded-full bg-sun-400 text-forest-950 sm:size-11">
                <ShieldCheck className="size-5" />
              </span>
            </span>
          </div>

          <p className="absolute left-5 top-5 rounded-full border border-white/20 bg-forest-950/55 px-3.5 py-1.5 font-display text-xs font-semibold text-white sm:left-7 sm:top-7">
            Standard {stepNumber(active)} <span className="text-white/50">/ {stepNumber(items.length - 1)}</span>
          </p>

          <div className="absolute inset-x-5 bottom-5 sm:inset-x-7 sm:bottom-7">
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={active}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="flex max-w-xl items-start gap-4 rounded-2xl border border-white/15 bg-forest-950/60 p-5 text-white backdrop-blur-md sm:p-6"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-sun-400 text-forest-950 [&_svg]:size-6">
                  {current.icon}
                </span>
                <span>
                  <span className="block font-display text-lg font-bold sm:text-xl">{current.title}</span>
                  <span className="mt-1 hidden text-sm leading-relaxed text-white/70 sm:block">{current.text}</span>
                </span>
              </m.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Standards list */}
      <div className="flex flex-col lg:order-1 lg:col-span-5">
        <ol className="border-t border-mist-300/70">
          {items.map((item, index) => {
            const isActive = index === active;
            const buttonId = `${uid}-tab-${index}`;
            const panelId = `${uid}-panel-${index}`;
            return (
              <li key={item.title} className="relative border-b border-mist-300/70">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={panelId}
                    onClick={() => select(index)}
                    className="group flex w-full items-center gap-5 py-5 text-left"
                  >
                    <span
                      className={cn(
                        "w-7 font-display text-sm font-bold tabular-nums transition-colors duration-500",
                        isActive ? "text-leaf-600" : "text-ink-400",
                      )}
                    >
                      {stepNumber(index)}
                    </span>
                    <span
                      className={cn(
                        "flex-1 font-display text-lg font-bold tracking-tight transition-colors duration-500 sm:text-xl",
                        isActive ? "text-ink-950" : "text-ink-500 group-hover:text-ink-900",
                      )}
                    >
                      {item.title}
                    </span>
                    <span
                      className={cn(
                        "grid size-11 shrink-0 place-items-center rounded-full transition-colors duration-500 [&_svg]:size-5",
                        isActive
                          ? "bg-forest-700 text-sun-300"
                          : "bg-white text-ink-500 ring-1 ring-mist-200 group-hover:text-forest-700",
                      )}
                    >
                      {item.icon}
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={cn(
                    "grid transition-[grid-template-rows,opacity] duration-500 ease-premium",
                    isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden" inert={!isActive}>
                    <p className="pb-6 pl-12 pr-4 text-[0.9375rem] leading-relaxed text-ink-500 sm:pr-16">{item.text}</p>
                  </div>
                </div>
                {isActive && showProgress && (
                  <span
                    key={`progress-${active}`}
                    aria-hidden="true"
                    onAnimationEnd={() => setActive((value) => (value + 1) % items.length)}
                    style={{ animationDuration: `${STEP_SECONDS}s` }}
                    className="absolute inset-x-0 -bottom-px h-0.5 origin-left animate-[progress-fill_6s_linear_forwards] bg-gradient-to-r from-leaf-400 to-sun-400"
                  />
                )}
              </li>
            );
          })}
        </ol>

        {!reduceMotion && (
          <button
            type="button"
            onClick={() => setAutoplay((value) => !value)}
            className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-mist-300 px-4 py-2 text-xs font-semibold text-ink-600 transition-colors hover:border-forest-700 hover:text-forest-700"
          >
            {autoplay ? <Pause className="size-3.5" aria-hidden="true" /> : <Play className="size-3.5" aria-hidden="true" />}
            {autoplay ? "Pause tour" : "Play tour"}
          </button>
        )}
      </div>
    </div>
  );
}

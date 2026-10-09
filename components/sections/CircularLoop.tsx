"use client";

import { AnimatePresence, m, useInView, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { circularStages } from "@/content/company";
import { cn, stepNumber } from "@/lib/utils";

const STEP_MS = 3200;
const RING = 38; // ring radius, % of diagram size
const GAP_DEG = 13; // keeps arcs clear of the nodes
const LABEL_OFFSET = 6.6; // node radius + breathing room, % of diagram size
const EASE = [0.22, 1, 0.36, 1] as const;

const count = circularStages.length;
const angleOf = (index: number) => -90 + (index * 360) / count;
const toRad = (deg: number) => (deg * Math.PI) / 180;
const point = (deg: number, radius = RING) => ({
  x: 50 + radius * Math.cos(toRad(deg)),
  y: 50 + radius * Math.sin(toRad(deg)),
});
const round = (value: number) => Math.round(value * 1000) / 1000;

/** Arc from stage `index` to the next stage, drawn clockwise. */
function arcPath(index: number) {
  const start = point(angleOf(index) + GAP_DEG);
  const end = point(angleOf(index + 1) - GAP_DEG);
  return `M ${round(start.x)} ${round(start.y)} A ${RING} ${RING} 0 0 1 ${round(end.x)} ${round(end.y)}`;
}

const arcs = circularStages.map((_, index) => arcPath(index));
const nodes = circularStages.map((_, index) => point(angleOf(index)));

/** Labels sit outside the ring, pointing away from the centre, so they never cross the arrows. */
const labels = circularStages.map((_, index) => {
  const deg = angleOf(index);
  const cos = Math.cos(toRad(deg));
  const sin = Math.sin(toRad(deg));
  const node = nodes[index];
  if (Math.abs(sin) > 0.85) {
    return { x: node.x, y: node.y + Math.sign(sin) * LABEL_OFFSET, align: sin < 0 ? "above" : "below" } as const;
  }
  return { x: node.x + Math.sign(cos) * LABEL_OFFSET, y: node.y, align: cos > 0 ? "right" : "left" } as const;
});

const labelTransform = {
  above: "-translate-x-1/2 -translate-y-full text-center",
  below: "-translate-x-1/2 text-center",
  right: "-translate-y-1/2 text-left",
  left: "-translate-x-full -translate-y-1/2 text-right",
} as const;

export function CircularLoop() {
  const ref = useRef<HTMLDivElement>(null);
  // Unique SVG ids: Cache Components keeps previous routes in the DOM, so fixed ids could collide.
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ids = { sweep: `${uid}-sweep`, arrow: `${uid}-arrow`, arrowActive: `${uid}-arrow-active` };
  const inView = useInView(ref, { margin: "-15% 0px" });
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const playing = !reduceMotion && !paused && inView;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % count), STEP_MS);
    return () => window.clearInterval(timer);
  }, [playing]);

  const select = (index: number) => {
    setActive(index);
    setPaused(true);
    setInteracted(true);
  };

  const stage = circularStages[active];
  const incomingArc = (active - 1 + count) % count;

  return (
    <div ref={ref} className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10" data-paused={!playing ? "true" : undefined}>
      {/* Diagram (visual only — the stage buttons on the right are the accessible controls) */}
      <div className="lg:col-span-7">
        <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[34rem]">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <linearGradient id={ids.sweep} x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#fec702" stopOpacity="0" />
                <stop offset="1" stopColor="#fec702" stopOpacity="0.9" />
              </linearGradient>
              <marker id={ids.arrow} viewBox="0 0 6 6" refX="4.5" refY="3" markerWidth="2.4" markerHeight="2.4" markerUnits="userSpaceOnUse" orient="auto">
                <path d="M0,0 L6,3 L0,6 z" fill="#b2dc82" fillOpacity="0.75" />
              </marker>
              <marker id={ids.arrowActive} viewBox="0 0 6 6" refX="4.5" refY="3" markerWidth="2.8" markerHeight="2.8" markerUnits="userSpaceOnUse" orient="auto">
                <path d="M0,0 L6,3 L0,6 z" fill="#fec702" />
              </marker>
            </defs>

            {/* Inner decorative rings */}
            <circle cx="50" cy="50" r="28.5" fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="0.25" />
            <g className="origin-center animate-spin-slow [transform-box:fill-box]">
              <circle cx="50" cy="50" r="28.5" fill="none" stroke={`url(#${ids.sweep})`} strokeWidth="0.7" strokeLinecap="round" strokeDasharray="24 155" />
            </g>
            <g className="origin-center animate-spin-slower [transform-box:fill-box]">
              <circle cx="50" cy="50" r="33" fill="none" stroke="white" strokeOpacity="0.16" strokeWidth="0.5" strokeLinecap="round" strokeDasharray="0.1 2.2" />
            </g>
            <circle cx="50" cy="50" r={RING} fill="none" stroke="white" strokeOpacity="0.05" strokeWidth="0.25" />

            {/* Flowing arrows between stages */}
            {arcs.map((d, index) => (
              <path
                key={d}
                d={d}
                fill="none"
                stroke="#b2dc82"
                strokeOpacity="0.45"
                strokeWidth="0.45"
                strokeLinecap="round"
                strokeDasharray="1.1 1.3"
                markerEnd={`url(#${ids.arrow})`}
                className="animate-[dash-flow_14s_linear_infinite]"
                style={{ animationDelay: `${index * -2}s` }}
              />
            ))}
            <m.path
              key={incomingArc}
              d={arcs[incomingArc]}
              fill="none"
              stroke="#fec702"
              strokeWidth="0.8"
              strokeLinecap="round"
              markerEnd={`url(#${ids.arrowActive})`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE }}
            />
          </svg>

          {/* Logo at the heart of the loop, on white for legibility */}
          <div className="absolute left-1/2 top-1/2 grid size-[36%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white p-[5.5%] shadow-[0_0_0_10px_rgb(255_255_255/0.05),0_0_0_22px_rgb(255_255_255/0.025),0_0_90px_rgb(254_199_2/0.22)]">
            <Logo className="h-auto w-full" sizes="(min-width: 640px) 160px, 100px" />
          </div>

          {/* Stage nodes */}
          {circularStages.map(({ title, icon: Icon }, index) => {
            const isActive = index === active;
            return (
              <div
                key={title}
                onClick={() => select(index)}
                style={{ left: `${nodes[index].x}%`, top: `${nodes[index].y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              >
                <span
                  className={cn(
                    "relative grid size-11 place-items-center rounded-full border transition-all duration-500 sm:size-14",
                    isActive
                      ? "scale-110 border-sun-300 bg-sun-400 text-forest-950 shadow-glow"
                      : "border-white/15 bg-forest-800 text-leaf-200 hover:border-leaf-300",
                  )}
                >
                  <Icon className="size-5 sm:size-6" />
                  <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-forest-950 font-display text-[0.625rem] font-bold text-white/75 ring-1 ring-white/15">
                    {index + 1}
                  </span>
                </span>
              </div>
            );
          })}

          {/* Stage labels (tablet and up; small screens use the stage list) */}
          {circularStages.map(({ title }, index) => (
            <span
              key={title}
              style={{ left: `${labels[index].x}%`, top: `${labels[index].y}%` }}
              className={cn(
                "pointer-events-none absolute hidden whitespace-nowrap text-xs font-semibold tracking-wide transition-colors duration-500 md:block",
                labelTransform[labels[index].align],
                index === active ? "text-sun-300" : "text-white/65",
              )}
            >
              {title}
            </span>
          ))}
        </div>
      </div>

      {/* Stage detail + accessible controls */}
      <div className="lg:col-span-5">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-9">
          <div className="flex items-center justify-between gap-4">
            <p className="font-display text-sm font-semibold text-sun-300">
              Stage {stepNumber(active)} <span className="text-white/40">/ {stepNumber(count - 1)}</span>
            </p>
            {!reduceMotion && (
              <button
                type="button"
                onClick={() => setPaused((value) => !value)}
                aria-label={paused ? "Play circular economy animation" : "Pause circular economy animation"}
                className="inline-flex h-9 items-center gap-2 rounded-full border border-white/15 px-3.5 text-xs font-semibold text-white/75 transition-colors hover:border-white/40 hover:text-white"
              >
                {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
                {paused ? "Play" : "Pause"}
              </button>
            )}
          </div>
          <div className="min-h-[11.5rem] sm:min-h-[10.5rem]" aria-live={interacted ? "polite" : "off"}>
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={active}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <h3 className="mt-4 font-display text-[1.75rem] font-bold tracking-tight sm:text-3xl">{stage.title}</h3>
                <p className="mt-3 text-[1.0625rem] leading-relaxed text-white/70">{stage.text}</p>
              </m.div>
            </AnimatePresence>
          </div>
          <div aria-hidden="true" className="mt-6 grid grid-cols-7 gap-1.5">
            {circularStages.map((item, index) => (
              <span
                key={item.title}
                className={cn("h-1 rounded-full transition-colors duration-500", index <= active ? "bg-leaf-300" : "bg-white/15")}
              />
            ))}
          </div>
        </div>

        <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2" aria-label="Circular economy stages">
          {circularStages.map(({ title }, index) => (
            <li key={title}>
              <button
                type="button"
                aria-pressed={index === active}
                onClick={() => select(index)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition-colors duration-300",
                  index === active
                    ? "border-sun-400/50 bg-sun-400/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white",
                )}
              >
                <span className="font-display text-xs font-bold text-sun-300">{stepNumber(index)}</span>
                {title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

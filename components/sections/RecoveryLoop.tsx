"use client";

import { m, useInView, useReducedMotion } from "motion/react";
import { BatteryCharging, Leaf, Pause, Play, Recycle, RefreshCcw, ScanSearch } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn, stepNumber } from "@/lib/utils";

const STAGES = [
  { label: "Battery", note: "Worn-out cells & packs", icon: BatteryCharging },
  { label: "Recovery", note: "Picked up, checked & sorted", icon: ScanSearch },
  { label: "Recycling", note: "Useful materials reclaimed", icon: Recycle },
  { label: "Reuse", note: "Returned to the supply chain", icon: RefreshCcw },
  { label: "Sustainability", note: "Less waste, more worth", icon: Leaf },
] as const;

const STEP_MS = 2400;
const EASE = [0.22, 1, 0.36, 1] as const;

type StageState = "active" | "done" | "next";

function iconClasses(state: StageState) {
  return cn(
    "relative grid shrink-0 place-items-center rounded-full transition-[background-color,color,box-shadow] duration-500",
    state === "active" && "bg-sun-400 text-forest-950 shadow-glow",
    state === "done" && "bg-leaf-500 text-white",
    state === "next" && "bg-white/[0.07] text-white/60 ring-1 ring-white/10",
  );
}

function PauseButton({ paused, onToggle, className }: { paused: boolean; onToggle: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={paused ? "Play recovery loop animation" : "Pause recovery loop animation"}
      className={cn(
        "grid size-8 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/40 hover:text-white",
        className,
      )}
    >
      {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
    </button>
  );
}

/**
 * Battery → Recovery → Recycling → Reuse → Sustainability.
 * Auto-advances only while visible, can be paused, and stays static for reduced-motion users.
 */
export function RecoveryLoop({ variant }: { variant: "card" | "rail" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduceMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(0);
  const playing = !reduceMotion && !paused && inView;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setStep((current) => (current + 1) % STAGES.length), STEP_MS);
    return () => window.clearInterval(timer);
  }, [playing]);

  const current = reduceMotion ? STAGES.length - 1 : step;
  const progress = current / (STAGES.length - 1);
  const stateOf = (index: number): StageState => (index === current ? "active" : index < current ? "done" : "next");

  if (variant === "rail") {
    const stage = STAGES[current];
    return (
      <div ref={ref} className="rounded-2xl border border-white/12 bg-forest-950/40 p-4 backdrop-blur-md sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-leaf-200">The Recovery Loop</p>
          {!reduceMotion && <PauseButton paused={paused} onToggle={() => setPaused((value) => !value)} />}
        </div>
        <div className="relative mt-4">
          <div aria-hidden="true" className="absolute inset-x-[10%] top-5 h-px bg-white/12">
            <m.div
              className="h-full origin-left bg-gradient-to-r from-leaf-300 to-sun-400"
              initial={false}
              animate={{ scaleX: progress }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </div>
          <ol className="relative grid grid-cols-5">
            {STAGES.map(({ label, icon: Icon }, index) => (
              <li key={label} className="flex justify-center">
                <span className={cn(iconClasses(stateOf(index)), "size-10")}>
                  <Icon className="size-[1.125rem]" aria-hidden="true" />
                </span>
                <span className="sr-only">{label}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-4 text-center text-sm">
          <span className="font-semibold text-white">{stage.label}</span>
          <span className="text-white/60"> — {stage.note}</span>
        </p>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-8 -z-10 rounded-[2.5rem] border border-white/[0.06] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/12 bg-forest-950/45 p-7 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.85)] backdrop-blur-xl xl:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-leaf-200">The Recovery Loop</p>
            <p className="mt-2 font-display text-lg font-semibold text-white">
              Waste Today, <span className="text-sun-300">Value Tomorrow</span>
            </p>
          </div>
          {!reduceMotion && <PauseButton paused={paused} onToggle={() => setPaused((value) => !value)} />}
        </div>

        <div className="relative mt-7">
          <div aria-hidden="true" className="absolute bottom-[30px] left-[29.5px] top-[30px] w-px bg-white/12">
            <m.div
              className="h-full w-full origin-top bg-gradient-to-b from-leaf-300 to-sun-400"
              initial={false}
              animate={{ scaleY: progress }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </div>
          <ol className="relative space-y-1">
            {STAGES.map(({ label, note, icon: Icon }, index) => {
              const state = stateOf(index);
              return (
                <li
                  key={label}
                  aria-current={state === "active" ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-4 rounded-2xl px-2.5 py-2.5 transition-colors duration-500",
                    state === "active" && "bg-white/[0.06]",
                  )}
                >
                  <span className={cn(iconClasses(state), "size-10")}>
                    <Icon className="size-[1.125rem]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block font-semibold transition-colors duration-500", state === "next" ? "text-white/70" : "text-white")}>
                      {label}
                    </span>
                    <span className="block text-sm text-white/55">{note}</span>
                  </span>
                  <span className="font-display text-xs font-semibold text-white/30">{stepNumber(index)}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}

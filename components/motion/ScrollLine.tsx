"use client";

import { m, useReducedMotion, useScroll } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * A connector line that fills as the visitor scrolls past it.
 * Animates `transform` only, so it stays smooth on low-end devices.
 */
export function ScrollLine({
  orientation,
  className,
  trackClassName = "bg-white/12",
  fillClassName = "bg-gradient-to-r from-leaf-300 via-leaf-200 to-sun-400",
}: {
  orientation: "horizontal" | "vertical";
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: orientation === "horizontal" ? ["start 85%", "start 45%"] : ["start 70%", "end 60%"],
  });
  const horizontal = orientation === "horizontal";

  return (
    <div ref={ref} aria-hidden="true" className={cn("pointer-events-none overflow-hidden rounded-full", trackClassName, className)}>
      <m.div
        className={cn("h-full w-full rounded-full", horizontal ? "origin-left" : "origin-top", fillClassName)}
        style={reduceMotion ? undefined : horizontal ? { scaleX: scrollYProgress } : { scaleY: scrollYProgress }}
      />
    </div>
  );
}

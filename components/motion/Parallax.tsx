"use client";

import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Gentle scroll parallax for imagery. Children should be a `fill` image;
 * the inner layer is oversized by `offset` px so edges never show.
 */
export function Parallax({ children, className, offset = 36 }: { children: ReactNode; className?: string; offset?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <m.div
        className="absolute inset-x-0"
        style={{ top: -offset, bottom: -offset, ...(reduceMotion ? {} : { y }) }}
      >
        {children}
      </m.div>
    </div>
  );
}

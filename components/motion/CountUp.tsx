"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

const formatter = new Intl.NumberFormat("en-IN");

/**
 * Counts up to `value` once visible. The final number is server-rendered,
 * so it is correct for crawlers, no-JS visitors and reduced-motion users.
 */
export function CountUp({ value, duration = 2.2 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node || !inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => {
        node.textContent = formatter.format(Math.round(latest));
      },
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {formatter.format(value)}
    </span>
  );
}

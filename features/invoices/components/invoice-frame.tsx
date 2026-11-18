"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/ui-utils";

const SHEET_WIDTH_PX = 793.7; // 210mm at 96 dpi

/**
 * Scales a full-size A4 sheet down to the available width (never up).
 * Printing uses <PrintPortal> instead (see billing.css).
 */
export function InvoiceFrame({ children, className, maxScale = 1 }: { children: ReactNode; className?: string; maxScale?: number }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | null>(null);

  useLayoutEffect(() => {
    const update = () => {
      if (!outer.current || !inner.current) return;
      const next = Math.min(maxScale, outer.current.clientWidth / SHEET_WIDTH_PX);
      setScale(next);
      setHeight(inner.current.scrollHeight * next);
    };
    update();
    const ro = new ResizeObserver(update);
    if (outer.current) ro.observe(outer.current);
    if (inner.current) ro.observe(inner.current);
    return () => ro.disconnect();
  }, [maxScale]);

  return (
    <div ref={outer} className={cn("w-full", className)}>
      <div className="invoice-scaler relative overflow-hidden" style={{ height: height ?? undefined }}>
        <div
          ref={inner}
          className="origin-top-left [&_.invoice-sheet]:shadow-[0_1px_3px_rgba(15,23,42,0.08),0_12px_32px_-12px_rgba(15,23,42,0.18)]"
          style={{ transform: `scale(${scale})`, width: SHEET_WIDTH_PX }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

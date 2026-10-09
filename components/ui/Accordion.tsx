"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { cn } from "@/lib/utils";

type Item = { question: string; answer: string };

/**
 * Accessible accordion. Answers stay in the DOM (collapsed with a CSS grid
 * transition and `inert`) so they remain indexable by search engines.
 */
export function Accordion({ items, defaultOpen = 0 }: { items: Item[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();

  return (
    <div className="divide-y divide-mist-200 rounded-[1.5rem] border border-mist-200 bg-white px-5 shadow-soft sm:px-8">
      {items.map((item, index) => {
        const isOpen = open === index;
        const buttonId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left font-display text-[1.0625rem] font-semibold leading-snug text-ink-950 transition-colors hover:text-forest-700 sm:text-lg"
              >
                {item.question}
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-premium",
                    isOpen
                      ? "rotate-45 border-forest-700 bg-forest-700 text-sun-300"
                      : "border-mist-300 text-forest-700 group-hover:border-forest-700",
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-premium",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p className="pb-6 pr-2 text-[0.9375rem] leading-relaxed text-ink-500 sm:pr-14 sm:text-base">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

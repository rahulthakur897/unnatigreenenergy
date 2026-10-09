"use client";

import { useState, type ReactNode } from "react";
import { cn, stepNumber } from "@/lib/utils";

export type ValueItem = { title: string; text: string; icon: ReactNode };

const tones = ["bg-forest-800", "bg-forest-900", "bg-forest-700", "bg-forest-950", "bg-forest-800"];

/** Expanding panels on desktop (hover, focus or click); stacked cards on smaller screens. */
export function ValuesShowcase({ items }: { items: ValueItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <>
      <div className="hidden h-[28rem] gap-3 lg:flex">
        {items.map((item, index) => {
          const isActive = index === active;
          return (
            <button
              key={item.title}
              type="button"
              aria-expanded={isActive}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              style={{ flexGrow: isActive ? 3.4 : 1 }}
              className={cn(
                "surface-dark group relative isolate flex min-w-0 basis-0 flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/10 p-7 text-left text-white transition-[flex-grow] duration-700 ease-premium",
                tones[index % tones.length],
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -right-24 -top-24 -z-10 size-72 rounded-full bg-[radial-gradient(circle,rgb(254_199_2/0.28),transparent_70%)] transition-opacity duration-700",
                  isActive ? "opacity-100" : "opacity-0",
                )}
              />
              <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-br from-white/[0.06] to-transparent" />

              <span className="font-display text-sm font-bold text-sun-300">{stepNumber(index)}</span>

              {/* Collapsed: vertical title */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute bottom-7 left-7 rotate-180 whitespace-nowrap font-display text-xl font-bold tracking-tight transition-opacity duration-300 [writing-mode:vertical-rl]",
                  isActive ? "opacity-0" : "opacity-100 delay-200",
                )}
              >
                {item.title}
              </span>

              {/* Expanded: fixed width so text never reflows while the panel grows */}
              <span
                className={cn(
                  "block w-[22rem] transition-[opacity,transform] duration-500",
                  isActive ? "translate-y-0 opacity-100 delay-200" : "pointer-events-none translate-y-4 opacity-0",
                )}
              >
                <span className="grid size-14 place-items-center rounded-2xl bg-sun-400 text-forest-950 [&_svg]:size-6">
                  {item.icon}
                </span>
                <span className="mt-6 block font-display text-[2rem] font-bold leading-tight tracking-tight">{item.title}</span>
                <span className="mt-3 block text-[1.0625rem] leading-relaxed text-white/70">{item.text}</span>
              </span>
            </button>
          );
        })}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {items.map((item, index) => (
          <li
            key={item.title}
            className={cn("surface-dark relative overflow-hidden rounded-[1.5rem] p-7 text-white", tones[index % tones.length])}
          >
            <div className="flex items-center justify-between">
              <span className="grid size-12 place-items-center rounded-2xl bg-sun-400 text-forest-950 [&_svg]:size-5">
                {item.icon}
              </span>
              <span className="font-display text-sm font-bold text-sun-300">{stepNumber(index)}</span>
            </div>
            <h3 className="mt-6 font-display text-xl font-bold tracking-tight">{item.title}</h3>
            <p className="mt-2 leading-relaxed text-white/70">{item.text}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

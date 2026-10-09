import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Icon + title + text. Used for differentiators, quality pillars and benefits. */
export function FeatureCard({
  title,
  text,
  icon: Icon,
  variant = "card",
  className,
}: {
  title: string;
  text: string;
  icon: LucideIcon;
  variant?: "card" | "plain";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group h-full",
        variant === "card" &&
          "rounded-[1.25rem] border border-mist-200 bg-white p-7 transition-[border-color,box-shadow,transform] duration-500 ease-premium hover:-translate-y-0.5 hover:border-leaf-300/60 hover:shadow-soft",
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-xl bg-leaf-50 text-forest-700 ring-1 ring-leaf-100 transition-colors duration-500 group-hover:bg-forest-700 group-hover:text-sun-300">
        <Icon className="size-[1.375rem]" aria-hidden="true" />
      </span>
      <h3 className="mt-6 font-display text-lg font-bold tracking-tight text-ink-950">{title}</h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-500">{text}</p>
    </div>
  );
}

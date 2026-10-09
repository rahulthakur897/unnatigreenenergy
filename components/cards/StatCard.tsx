import { CountUp } from "@/components/motion/CountUp";
import type { Stat } from "@/content/placeholders";
import { cn } from "@/lib/utils";

/**
 * Shows a verified figure with a count-up animation, or — while `value` is null —
 * the clearly-labelled placeholder from content/placeholders.ts (e.g. "XX+", "XX Tons").
 */
export function StatCard({ stat }: { stat: Stat }) {
  const isPlaceholder = stat.value === null;
  const suffix = stat.suffix?.trim();
  const wordSuffix = suffix ? /[a-z]/i.test(suffix) : false;

  return (
    <div className="flex h-full flex-col-reverse justify-end border-l border-white/15 pl-5 sm:pl-6">
      <dt className="mt-3">
        <span className="block font-semibold text-white">{stat.label}</span>
        <span className="mt-1 block text-sm text-white/55">{stat.detail}</span>
      </dt>
      <dd className="whitespace-nowrap font-display text-[2.5rem] font-bold leading-none tracking-[-0.03em] text-white sm:text-5xl xl:text-6xl">
        {stat.prefix}
        {isPlaceholder ? (
          <span title="Placeholder — replace with a verified figure" className="animate-shimmer text-white/85">
            {stat.placeholder}
          </span>
        ) : (
          <CountUp value={stat.value as number} />
        )}
        {suffix && (
          <span className={cn("text-leaf-300", wordSuffix && "ml-1.5 text-[0.42em] font-semibold tracking-normal")}>
            {suffix}
          </span>
        )}
      </dd>
    </div>
  );
}

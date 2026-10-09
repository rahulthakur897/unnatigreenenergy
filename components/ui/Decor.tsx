import { cn } from "@/lib/utils";

/**
 * Original brand pattern: the tops of cylindrical cells in hexagonal packing,
 * as seen when looking down into a battery module. Inherits `currentColor`.
 */
export function CellPattern({ id, className }: { id: string; className?: string }) {
  return (
    <svg aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}>
      <defs>
        <pattern id={id} width="44" height="76.2" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="22" cy="19.05" r="17" />
            <circle cx="22" cy="19.05" r="6.5" />
            <circle cx="0" cy="57.15" r="17" />
            <circle cx="0" cy="57.15" r="6.5" />
            <circle cx="44" cy="57.15" r="17" />
            <circle cx="44" cy="57.15" r="6.5" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Soft sunlight bloom echoing the sun in the logo. */
export function SunGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full bg-[radial-gradient(circle,rgb(254_199_2/0.2)_0%,rgb(254_184_1/0.05)_38%,transparent_68%)]",
        className,
      )}
    />
  );
}

/** Dashed tag used to flag placeholder content that must be replaced before launch. */
export function PlaceholderTag({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-dashed px-2.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em]",
        tone === "light" ? "border-ink-400/60 text-ink-500" : "border-white/40 text-white/70",
        className,
      )}
    >
      Placeholder
    </span>
  );
}

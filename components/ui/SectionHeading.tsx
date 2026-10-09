import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

export function Eyebrow({ children, tone = "light", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-3 text-[0.75rem] font-semibold uppercase tracking-[0.18em]",
        tone === "light" ? "text-leaf-700" : "text-leaf-200",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("h-px w-8", tone === "light" ? "bg-leaf-500" : "bg-sun-400")} />
      {children}
    </p>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: Tone;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  /** Places the description beside the title on large screens. */
  split?: boolean;
  action?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  as: Heading = "h2",
  id,
  className,
  split,
  action,
}: SectionHeadingProps) {
  const titleEl = (
    <Heading
      id={id}
      className={cn(
        "mt-5 font-display text-[2rem] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[2.5rem] lg:text-[2.875rem] xl:text-[3.25rem]",
        tone === "light" ? "text-ink-950" : "text-white",
      )}
    >
      {title}
    </Heading>
  );

  const descriptionEl = description ? (
    <div
      className={cn(
        "text-[1.0625rem] leading-relaxed sm:text-lg",
        tone === "light" ? "text-ink-500" : "text-white/70",
        split ? "lg:pb-2" : "mt-5",
        align === "center" && !split && "mx-auto",
        "max-w-2xl",
      )}
    >
      {description}
    </div>
  ) : null;

  if (split) {
    return (
      <div className={cn("grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-12", className)}>
        <div className="lg:col-span-7">
          {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
          {titleEl}
        </div>
        <div className="flex flex-col gap-6 lg:col-span-5">
          {descriptionEl}
          {action}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(align === "center" && "mx-auto max-w-3xl text-center", className)}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      {titleEl}
      {descriptionEl}
      {action && <div className={cn("mt-8", align === "center" && "flex justify-center")}>{action}</div>}
    </div>
  );
}

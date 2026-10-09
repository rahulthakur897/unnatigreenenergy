import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "secondary" | "outlineLight";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative shrink-0 items-center gap-3 whitespace-nowrap rounded-full font-semibold tracking-[-0.01em] transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-premium active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-forest-700 text-white shadow-[0_10px_28px_-12px_rgb(2_70_23/0.75)] hover:bg-forest-800",
  accent: "bg-sun-400 text-forest-950 shadow-[0_12px_32px_-12px_rgb(254_184_1/0.8)] hover:bg-sun-300",
  secondary: "border border-forest-700/20 bg-white text-forest-800 hover:border-forest-700/60 hover:bg-leaf-50",
  outlineLight: "border border-white/25 bg-white/[0.06] text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/[0.12]",
};

const arrowTone: Record<Variant, string> = {
  primary: "bg-white/15 text-white group-hover/btn:bg-sun-400 group-hover/btn:text-forest-950",
  accent: "bg-forest-950/10 text-forest-950 group-hover/btn:bg-forest-950 group-hover/btn:text-sun-300",
  secondary: "bg-forest-700 text-white group-hover/btn:bg-sun-400 group-hover/btn:text-forest-950",
  outlineLight: "bg-white/15 text-white group-hover/btn:bg-white group-hover/btn:text-forest-900",
};

const sizes: Record<Size, { plain: string; arrow: string; circle: string }> = {
  sm: { plain: "h-10 px-5 text-sm", arrow: "h-10 pl-5 pr-1.5 text-sm", circle: "size-7" },
  md: { plain: "h-12 px-6 text-[0.9375rem]", arrow: "h-12 pl-6 pr-2 text-[0.9375rem]", circle: "size-8" },
  lg: { plain: "h-14 px-8 text-base", arrow: "h-14 pl-7 pr-2 text-base", circle: "size-10" },
};

type StyleProps = {
  variant?: Variant;
  size?: Size;
  /** Adds the animated arrow chip. */
  arrow?: boolean;
  /** Full-width button with label and arrow pushed to opposite ends. */
  block?: boolean;
  className?: string;
  children: ReactNode;
};

function styles({ variant = "primary", size = "md", arrow, block, className }: Omit<StyleProps, "children">) {
  return cn(
    base,
    block ? "flex w-full justify-between" : "inline-flex justify-center",
    variants[variant],
    arrow ? sizes[size].arrow : sizes[size].plain,
    className,
  );
}

function Content({ children, arrow, variant = "primary", size = "md" }: Omit<StyleProps, "className">) {
  return (
    <>
      <span>{children}</span>
      {arrow && (
        <span
          aria-hidden="true"
          className={cn(
            "grid place-items-center rounded-full transition-colors duration-300",
            sizes[size].circle,
            arrowTone[variant],
          )}
        >
          <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
        </span>
      )}
    </>
  );
}

type ButtonLinkProps = StyleProps & { href: string } & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;

/** Link styled as a button. Internal routes use next/link; tel:, mailto: and external URLs use <a>. */
export function ButtonLink({ href, variant, size, arrow, block, className, children, ...rest }: ButtonLinkProps) {
  const cls = styles({ variant, size, arrow, block, className });
  const content = (
    <Content arrow={arrow} variant={variant} size={size}>
      {children}
    </Content>
  );
  if (/^(https?:|tel:|mailto:)/.test(href)) {
    const external = href.startsWith("http");
    return (
      <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
}

type ButtonProps = StyleProps & Omit<ComponentPropsWithoutRef<"button">, "className" | "children">;

export function Button({ variant, size, arrow, block, className, children, type = "button", ...rest }: ButtonProps) {
  return (
    <button type={type} className={styles({ variant, size, arrow, block, className })} {...rest}>
      <Content arrow={arrow} variant={variant} size={size}>
        {children}
      </Content>
    </button>
  );
}

/** Understated text link with a moving arrow. */
export function ArrowLink({
  href,
  children,
  tone = "light",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group/link inline-flex items-center gap-2 font-semibold transition-colors",
        tone === "light" ? "text-forest-700 hover:text-forest-900" : "text-leaf-200 hover:text-white",
        className,
      )}
    >
      <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover/link:bg-[length:100%_1px]">
        {children}
      </span>
      <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover/link:translate-x-1" />
    </Link>
  );
}

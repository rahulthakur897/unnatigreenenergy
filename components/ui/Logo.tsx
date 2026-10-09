import Image from "next/image";
import { logo } from "@/lib/brand";
import { cn } from "@/lib/utils";

/**
 * The official UNNATI GREEN ENERGY logo, rendered unaltered.
 * Its wordmark is dark green/black, so it must always sit on a white or very light surface.
 */
export function Logo({ className, sizes = "120px", eager }: { className?: string; sizes?: string; eager?: boolean }) {
  return (
    <Image
      src={logo.src}
      alt={logo.alt}
      width={logo.width}
      height={logo.height}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      className={cn("h-auto w-auto select-none", className)}
    />
  );
}

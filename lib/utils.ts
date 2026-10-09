/** Joins class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Two-digit step index, e.g. 0 -> "01". */
export function stepNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

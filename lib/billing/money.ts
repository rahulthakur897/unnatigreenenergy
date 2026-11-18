import Decimal from "decimal.js";

/**
 * Money helpers. All amounts are integer paise in storage and calculations;
 * conversions go through decimal.js so binary floating-point rounding never leaks in.
 */
Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP });

export { Decimal };

/** "46,000.50" | "46000.5" | 46000.5 → 4600050 paise. Throws on invalid input. */
export function toPaise(rupees: string | number): number {
  const clean = typeof rupees === "string" ? rupees.replace(/[,₹\s]/g, "") : rupees;
  if (clean === "") return 0;
  return new Decimal(clean).mul(100).toDecimalPlaces(0, Decimal.ROUND_HALF_UP).toNumber();
}

/** Like toPaise but returns null instead of throwing (for live form input). */
export function tryToPaise(rupees: string | number | null | undefined): number | null {
  try {
    if (rupees === null || rupees === undefined || String(rupees).trim() === "") return null;
    return toPaise(rupees);
  } catch {
    return null;
  }
}

/** 4600050 → "46000.50" (plain string for form inputs). */
export function paiseToRupeeString(paise: number): string {
  return new Decimal(paise).div(100).toFixed(2);
}

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const numberFormatter = new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** 16284000 → "₹1,62,840.00" */
export function formatINR(paise: number): string {
  return inrFormatter.format(new Decimal(paise).div(100).toNumber());
}

/** 16284000 → "1,62,840.00" (no currency symbol). */
export function formatAmount(paise: number): string {
  return numberFormatter.format(new Decimal(paise).div(100).toNumber());
}

/**
 * 16284000 → "₹1.63 L" — Indian units (K, L, Cr) for stat cards and chart axes.
 * Implemented by hand (not Intl compact notation) so server and browser output match exactly.
 */
export function formatINRCompact(paise: number): string {
  const rupees = new Decimal(paise).div(100);
  const abs = rupees.abs();
  const sign = rupees.isNeg() ? "-" : "";
  const trim = (d: Decimal, dp: number) => d.toDecimalPlaces(dp, Decimal.ROUND_HALF_UP).toString();
  if (abs.gte(1e7)) return `${sign}₹${trim(abs.div(1e7), 2)} Cr`;
  if (abs.gte(1e5)) return `${sign}₹${trim(abs.div(1e5), 2)} L`;
  if (abs.gte(1e3)) return `${sign}₹${trim(abs.div(1e3), 1)}K`;
  return `${sign}₹${trim(abs, 0)}`;
}

/** Signed display for round-off: 40 → "+0.40", -12 → "-0.12". */
export function formatSignedAmount(paise: number): string {
  const sign = paise > 0 ? "+" : paise < 0 ? "-" : "";
  return `${sign}${formatAmount(Math.abs(paise))}`;
}

/** Normalises a decimal string: "03.50" → "3.5". Returns "0" for blanks. */
export function normalizeDecimal(value: string | number | null | undefined): string {
  if (value === null || value === undefined || String(value).trim() === "") return "0";
  return new Decimal(String(value).replace(/,/g, "")).toString();
}

/** Adds two decimal strings exactly. */
export function addDecimal(a: string, b: string): string {
  return new Decimal(a || "0").plus(new Decimal(b || "0")).toString();
}

/** Formats a quantity string for display: "3" → "3", "2.500" → "2.5". */
export function formatQty(value: string): string {
  try {
    return new Decimal(value || "0").toDecimalPlaces(3).toString();
  } catch {
    return value;
  }
}

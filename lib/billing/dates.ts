import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";

/** Today's date as YYYY-MM-DD in India Standard Time. */
export function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function addDaysISO(date: string, days: number): string {
  return format(addDays(parseISO(date), days), "yyyy-MM-dd");
}

/** "2026-12-11" → "11/12/2026" (Indian day-first format, as on the printed invoice). */
export function formatDate(date: string | null | undefined): string {
  if (!date) return "";
  return format(parseISO(date), "dd/MM/yyyy");
}

/** "2026-12-11" → "11 Dec 2026" */
export function formatDateLong(date: string | null | undefined): string {
  if (!date) return "";
  return format(parseISO(date), "dd MMM yyyy");
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * ISO timestamp → "11 Dec 2026, 4:05 pm" in IST. Formatted by hand so the server and every
 * browser produce identical text (no hydration mismatches from ICU or time-zone differences).
 */
export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const ist = new Date(new Date(iso).getTime() + 330 * 60 * 1000);
  const h = ist.getUTCHours();
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const minutes = String(ist.getUTCMinutes()).padStart(2, "0");
  const day = String(ist.getUTCDate()).padStart(2, "0");
  return `${day} ${MONTHS[ist.getUTCMonth()]} ${ist.getUTCFullYear()}, ${hour12}:${minutes} ${h < 12 ? "am" : "pm"}`;
}

/** Calendar days from `fromISO` to `toISO` (positive when `toISO` is later). */
export function daysBetween(fromISO: string, toISO: string): number {
  return differenceInCalendarDays(parseISO(toISO), parseISO(fromISO));
}

/** Relative time, e.g. "3 hours ago". */
export function timeAgo(iso: string): string {
  const rtf = new Intl.RelativeTimeFormat("en-IN", { numeric: "auto" });
  let value = (Date.now() - new Date(iso).getTime()) / 1000;
  const steps: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  for (const [size, unit] of steps) {
    if (Math.abs(value) < size) return rtf.format(-Math.round(value), unit);
    value /= size;
  }
  return "";
}

/** Indian financial year (April–March) for a YYYY-MM-DD date: "2026-12-11" → "2026-27". */
export function financialYearOf(date: string): string {
  const [y, m] = date.split("-").map(Number);
  const start = m >= 4 ? y : y - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
}

/** "2026-27" → { from: "2026-04-01", to: "2027-03-31" } */
export function financialYearRange(fy: string): { from: string; to: string } {
  const start = Number(fy.slice(0, 4));
  return { from: `${start}-04-01`, to: `${start + 1}-03-31` };
}

/** Recent financial years, newest first: ["2026-27", "2025-26", …]. */
export function recentFinancialYears(count = 5, reference = todayISO()): string[] {
  const current = Number(financialYearOf(reference).slice(0, 4));
  return Array.from({ length: count }, (_, i) => {
    const start = current - i;
    return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
  });
}

/** Months of a financial year as YYYY-MM keys, April to March. */
export function financialYearMonths(fy: string): string[] {
  const start = Number(fy.slice(0, 4));
  return Array.from({ length: 12 }, (_, i) => {
    const month = ((3 + i) % 12) + 1;
    const year = month >= 4 ? start : start + 1;
    return `${year}-${String(month).padStart(2, "0")}`;
  });
}

/** "2026-04" → "Apr 2026" (or "Apr 26" when short). */
export function formatMonthKey(key: string, short = false): string {
  return format(parseISO(`${key}-01`), short ? "MMM yy" : "MMM yyyy");
}

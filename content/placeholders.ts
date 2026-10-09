/**
 * PLACEHOLDER CONTENT
 * ---------------------------------------------------------------------------
 * Everything in this file is placeholder content awaiting verified company data.
 * Nothing here may be published as fact. Replace each TODO, then set
 * `isPlaceholder: false` (where present) so the UI drops the placeholder styling.
 */

export type Stat = {
  label: string;
  detail: string;
  /** Verified numeric value. Leave `null` until confirmed — the placeholder text is shown instead. */
  value: number | null;
  prefix?: string;
  suffix?: string;
  /** Shown with the suffix while `value` is null, e.g. "XX" + "+" = "XX+". */
  placeholder: string;
};

export const stats: Stat[] = [
  {
    label: "Battery Material Recovered",
    detail: "Cumulative tonnage handled", // TODO: Replace with actual company statistic
    value: null, // TODO: Replace with actual company statistic, e.g. 1200
    suffix: " Tons",
    placeholder: "XX",
  },
  {
    label: "Business Partners",
    detail: "Suppliers and buyers we work with", // TODO: Replace with actual company statistic
    value: null, // TODO: Replace with actual company statistic
    suffix: "+",
    placeholder: "XX",
  },
  {
    label: "Cities Served",
    detail: "Locations we have collected from", // TODO: Replace with actual company statistic
    value: null, // TODO: Replace with actual company statistic
    suffix: "+",
    placeholder: "XX",
  },
  {
    label: "Years of Experience",
    detail: "In battery scrap and recycling trade", // TODO: Replace with actual company statistic
    value: null, // TODO: Replace with actual company statistic
    suffix: "+",
    placeholder: "XX",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  isPlaceholder: boolean;
};

/** TODO: Replace with genuine client testimonials, used with each client's written permission. */
export const testimonials: Testimonial[] = [
  {
    quote: "Client testimonial will appear here. Share a short, genuine quote about working with UNNATI GREEN ENERGY.",
    name: "Client Name",
    role: "Designation",
    company: "Company Name",
    isPlaceholder: true,
  },
  {
    quote: "Client testimonial will appear here. Real feedback from a verified customer or partner goes in this space.",
    name: "Client Name",
    role: "Designation",
    company: "Company Name",
    isPlaceholder: true,
  },
  {
    quote: "Client testimonial will appear here. Replace this placeholder with an approved testimonial before launch.",
    name: "Client Name",
    role: "Designation",
    company: "Company Name",
    isPlaceholder: true,
  },
];

export type Partner = {
  name: string;
  /** Path to a logo in /public, e.g. "/assets/images/partners/acme.svg". */
  logo?: string;
  href?: string;
  isPlaceholder: boolean;
};

/** TODO: Replace with real partner/client logos — only with their permission. */
export const partners: Partner[] = Array.from({ length: 6 }, (_, index) => ({
  name: `Partner Logo ${index + 1}`,
  isPlaceholder: true,
}));

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
    label: "Battery Material Handled",
    detail: "Total tonnage moved to date", // TODO: Replace with actual company statistic
    value: null, // TODO: Replace with actual company statistic, e.g. 1200
    suffix: " Tons",
    placeholder: "XX",
  },
  {
    label: "Partner Businesses",
    detail: "Suppliers and buyers in our network", // TODO: Replace with actual company statistic
    value: null, // TODO: Replace with actual company statistic
    suffix: "+",
    placeholder: "XX",
  },
  {
    label: "Cities Covered",
    detail: "Places we have collected material from", // TODO: Replace with actual company statistic
    value: null, // TODO: Replace with actual company statistic
    suffix: "+",
    placeholder: "XX",
  },
  {
    label: "Years in the Trade",
    detail: "Working in battery scrap and recycling", // TODO: Replace with actual company statistic
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
    quote: "A client testimonial goes here. Add a short, genuine quote about working with UNNATI GREEN ENERGY.",
    name: "Client Name",
    role: "Designation",
    company: "Company Name",
    isPlaceholder: true,
  },
  {
    quote: "A client testimonial goes here. Use real feedback from a verified customer or partner.",
    name: "Client Name",
    role: "Designation",
    company: "Company Name",
    isPlaceholder: true,
  },
  {
    quote: "A client testimonial goes here. Swap this placeholder for an approved testimonial before launch.",
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

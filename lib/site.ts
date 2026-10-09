/**
 * Central company configuration.
 * Every value marked TODO is a placeholder — replace it with verified company
 * information before launch. Nothing here should be presented as fact until confirmed.
 */
export const site = {
  name: "UNNATI GREEN ENERGY",
  // TODO: Replace with the registered legal entity name (e.g. "... Private Limited").
  legalName: "UNNATI GREEN ENERGY",
  descriptor: "Lithium Ion Cell & Battery Scrap Trading",
  tagline: "Waste Today, Value Tomorrow",
  description:
    "UNNATI GREEN ENERGY specializes in lithium-ion cell and battery scrap trading, responsible material recovery, and sustainable energy solutions.",
  // TODO: Replace with the production domain, or set NEXT_PUBLIC_SITE_URL in the hosting environment.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.unnatigreenenergy.com",
  locale: "en_IN",
  foundingCountry: "IN",

  contact: {
    phone: {
      // TODO: Replace with the official phone number.
      display: "+91 XXXXX XXXXX",
      // TODO: Set to the dialable number, e.g. "tel:+919876543210". Leave empty to hide call links.
      href: "",
    },
    // TODO: Replace with the official email address.
    email: "info@unnatigreenenergy.com",
    address: {
      // TODO: Replace with the registered business address.
      lines: ["Business Address Line 1", "City, State – PIN Code", "India"],
      short: "City, State, India",
    },
    // TODO: Confirm business hours.
    hours: [
      { days: "Monday – Saturday", time: "9:30 AM – 6:30 PM IST" },
      { days: "Sunday", time: "Closed" },
    ],
  },

  /**
   * Social profiles render in the footer only when a URL is provided.
   * TODO: Add official profile URLs, e.g. { label: "LinkedIn", href: "https://www.linkedin.com/company/..." }.
   */
  social: [] as { label: "LinkedIn" | "Instagram" | "Facebook" | "X" | "YouTube"; href: string }[],
} as const;

export type NavItem = {
  label: string;
  href: string;
  /** Renders the industries dropdown. */
  dropdown?: boolean;
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Our Products", href: "/products" },
  { label: "Industries", href: "/industries", dropdown: true },
  { label: "Services", href: "/services" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const quoteHref = "/contact#quote-form";

/** Call link when a phone number is configured, otherwise the contact form. */
export const callHref = site.contact.phone.href || quoteHref;

/** "Talk to our team": call when a number is configured, otherwise the contact page. */
export const talkHref = site.contact.phone.href || "/contact";

import type { Metadata } from "next";
import type { BlogPost } from "@/content/blog";
import { site } from "@/lib/site";

type PageMetaInput = {
  title: string;
  description: string;
  /** Route path, e.g. "/about". Used for the canonical URL and og:url. */
  path: string;
  /** Use the full title as-is instead of the "%s | UNNATI GREEN ENERGY" template. */
  absoluteTitle?: boolean;
};

/**
 * Consistent per-page metadata. Open Graph/Twitter objects are replaced (not merged)
 * between segments, so every page restates the shared fields here.
 * Share images come from app/opengraph-image.png and app/twitter-image.png.
 */
export function pageMetadata({ title, description, path, absoluteTitle }: PageMetaInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      url: path,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${absoluteUrl("/")}#organization`,
    name: site.name,
    legalName: site.legalName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/assets/images/brand/unnati-logo.png"),
    slogan: site.tagline,
    description: site.description,
    knowsAbout: [
      "Lithium-ion battery scrap trading",
      "Lithium cell scrap",
      "Battery pack scrap",
      "Battery material recovery",
      "Circular economy",
    ],
    // TODO: Add "telephone", "email", "address" and "sameAs" once official details are confirmed.
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${absoluteUrl("/")}#website`,
    name: site.name,
    url: absoluteUrl("/"),
    inLanguage: "en-IN",
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
  };
}

export function breadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function serviceSchema(service: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: absoluteUrl(service.path),
    serviceType: service.name,
    provider: { "@id": `${absoluteUrl("/")}#organization` },
    areaServed: { "@type": "Country", name: "India" },
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function blogPostingSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    image: absoluteUrl(post.image.src.src),
    url: absoluteUrl(`/blog/${post.slug}`),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    author: { "@type": "Organization", name: post.author },
    publisher: { "@id": `${absoluteUrl("/")}#organization` },
  };
}

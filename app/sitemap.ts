import type { MetadataRoute } from "next";
import { posts } from "@/content/blog";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import { absoluteUrl } from "@/lib/seo";

// Update when content changes materially.
const LAST_UPDATED = new Date("2026-10-08");

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number; changeFrequency: "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/products", priority: 0.9, changeFrequency: "monthly" },
    { path: "/services", priority: 0.9, changeFrequency: "monthly" },
    ...services.map((service) => ({
      path: `/services/${service.slug}`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    { path: "/industries", priority: 0.8, changeFrequency: "monthly" },
    ...industries.map((industry) => ({
      path: `/industries/${industry.slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
    { path: "/sustainability", priority: 0.7, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.7, changeFrequency: "monthly" },
    ...posts.map((post) => ({ path: `/blog/${post.slug}`, priority: 0.6, changeFrequency: "yearly" as const })),
    { path: "/contact", priority: 0.8, changeFrequency: "yearly" },
    { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  ];

  return pages.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path),
    lastModified: LAST_UPDATED,
    changeFrequency,
    priority,
  }));
}

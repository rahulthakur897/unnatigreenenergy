# UNNATI GREEN ENERGY — Corporate Website

Marketing website for **UNNATI GREEN ENERGY** — *Lithium Ion Cell & Battery Scrap Trading* ("Waste Today, Value Tomorrow").

Built with Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion) and Lucide icons. Every page is prerendered as static HTML.

## Run the project

Requirements: Node.js 20.9 or newer.

```bash
npm install        # install dependencies
npm run dev        # development server at http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run lint       # ESLint
```

## Pages

| Route | Content |
| --- | --- |
| `/` | Home — hero, trust bar, about, services, products, process, industries, why us, circular economy, sustainability, stats, quality & safety, testimonials, partners, FAQ, quote CTA, contact |
| `/about` | Story, mission & vision, approach, values, why us |
| `/products` | Product catalogue (cells and battery scrap categories) |
| `/services`, `/services/[slug]` | Seven services, including lithium-ion battery manufacturing line services |
| `/industries`, `/industries/[slug]` | Eight industries (also in the header dropdown) |
| `/blog`, `/blog/[slug]` | Articles |
| `/sustainability`, `/contact`, `/privacy-policy`, `/terms` | |

`/solutions/*` permanently redirects to `/services/*`.

## Where to edit content

| What | File |
| --- | --- |
| Company name, contact details, site URL, navigation | `lib/site.ts` |
| Services | `content/services.ts` |
| Products | `content/products.ts` |
| Industries | `content/industries.ts` |
| Blog posts | `content/blog.ts` |
| FAQ | `content/faqs.ts` |
| Trust bar, process, why us, quality & safety, values, sustainability copy | `content/company.ts` |
| **Statistics, testimonials, partner logos (placeholders)** | `content/placeholders.ts` |
| Photography | `lib/images.ts` (swap an import to change an image everywhere) |
| Colours, fonts, animations | `app/globals.css` (`@theme` tokens) |

## Before launch — replace placeholders

Search the codebase for `TODO` to find every item. In particular:

- **Contact details** (`lib/site.ts`): phone, email, address, business hours, legal name, social profiles.
- **Statistics** (`content/placeholders.ts`): set each `value` to a verified number — the count-up animation activates automatically and the "XX" placeholder disappears.
- **Testimonials and partner logos** (`content/placeholders.ts`): use only genuine, approved content.
- **Certifications**: none are shown. Add verified ones to `credentials` in `content/company.ts`.
- **Manufacturing line service scope** (`content/services.ts`): confirm the listed offerings.
- **Blog dates** (`content/blog.ts`) and **legal pages** (`/privacy-policy`, `/terms` need legal review).

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production URL used for canonical links, sitemap and structured data, e.g. `https://www.example.com` |
| `INQUIRY_WEBHOOK_URL` | Endpoint that receives quote-form submissions as JSON (Zapier, Make, n8n, a CRM intake URL, etc.). Without it the form works in development (submissions are logged) but shows an "email us instead" message in production. |

## Notes

- **Logo**: `public/assets/images/brand/unnati-logo-horizontal.png` is the supplied horizontal logo (`public/assets/images/logo-horizontal.jpg`) with its flat background made transparent and trimmed — artwork unchanged. Its text is dark, so it is always placed on a white surface. The share images (`app/opengraph-image.png`, `app/twitter-image.png`) use the same logo. Favicons (`app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`) use the logo's emblem.
- **Photography**: supplied images live in `public/assets/images/`; stock photos are listed in `IMAGE_CREDITS.md`.
- **Accessibility & motion**: all animations respect `prefers-reduced-motion`; auto-advancing elements can be paused.

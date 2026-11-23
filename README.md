# UNNATI GREEN ENERGY — Website & Billing

This repository holds two apps in one Next.js project:

- **Corporate website** for **UNNATI GREEN ENERGY** — *Lithium Ion Cell & Battery Scrap Trading* ("Waste Today, Value Tomorrow"). Public pages, prerendered as static HTML, in `app/(site)`.
- **Billing & Invoice Management System** — a sign-in protected dashboard at `/dashboard` for leads, customers, products, GST tax invoices and payments, in `app/(billing)`. See [Billing system](#billing-system).

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Motion (Framer Motion) and Lucide icons.

## Run the project

Requirements: Node.js 20.9 or newer.

```bash
npm install        # install dependencies
npm run db:setup   # billing: create the database, admin user and company profile
npm run dev        # development server at http://localhost:3000 (billing at /dashboard)
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

## Billing system

Sign in at `/login` with the admin account created by `npm run db:seed` (`ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env.local`; defaults `admin@unnatigreenenergy.com` / `Admin@12345`). Change that password under **Settings → My profile** straight away.

**Stack:** Next.js App Router (server components and server actions), TypeScript, Tailwind CSS v4, shadcn/ui (`components/billing/ui`), Lucide, React Hook Form + Zod (the same schema validates in the browser and again on the server), TanStack Table, Recharts, Drizzle ORM on SQLite/libSQL, `@react-pdf/renderer` for PDFs, ExcelJS for Excel exports, decimal.js for money.

### Setup and scripts

```bash
cp .env.example .env.local   # then set AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run db:setup             # migrate + seed (safe to re-run)
npm run db:seed:demo         # optional sample data; refuses to run if the database already has invoices
npm run db:generate          # after editing server/db/schema.ts, create a migration
npm run db:studio            # browse the database (Drizzle Studio)
npm run typecheck
```

To try the demo data without touching real books, use a separate database file:
`DATABASE_URL=file:./data/demo.db npm run db:setup`, then `DATABASE_URL=file:./data/demo.db npm run db:seed:demo`, and start the app with the same `DATABASE_URL`.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | `file:./data/billing.db` (default, local SQLite) or a Turso/libSQL URL `libsql://…` |
| `DATABASE_AUTH_TOKEN` | Token for a remote libSQL/Turso database |
| `AUTH_SECRET` | Long random string; signs public invoice share links (changing it invalidates old links) |
| `APP_URL` | Public base URL used in invoice share links |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | First admin account created by `db:seed` |
| `SEED_LAST_INVOICE_NUMBER` | Last invoice number already issued in FY 2026-27 (default `20`, so the first new invoice is `UGE/2026-27/021`) |

### How the key rules work

- **Money** is stored as integer paise and calculated with decimal.js (`lib/billing/money.ts`, `lib/billing/invoice-calc.ts`). Totals are always recomputed on the server; the browser's figures are only a preview.
- **GST:** line amount = quantity × rate; tax is calculated per GST rate on the taxable value. When the place of supply is the company's own state (Uttar Pradesh, `09`) it is split into CGST + SGST, otherwise it is IGST. Place of supply defaults to the customer's state and can be changed per invoice.
- **Invoice numbers** (`PREFIX/FY/NNN`, e.g. `UGE/2026-27/021`) are assigned only when an invoice is *generated*, inside a database transaction, and are unique (database index). Drafts have no number, so deleting a draft never leaves a gap. **Settings** can set the next number for a financial year, but never back to a number already used.
- **Immutability:** a generated invoice can't be edited or deleted. An admin can *cancel* it (with a reason, and only while it has no payments); the number stays on record and stock is returned. **Create corrected invoice** then makes a new draft linked to the cancelled one. Company, bank and signatory details are frozen into each invoice when it is generated.
- **Stock** goes down when an invoice is generated and back up when it is cancelled; every change is logged. Items with a SAC code (starting `99`) are services and carry no stock.
- **Roles:** *admin* can change settings (including the company profile), manage users, cancel invoices and remove payments; *staff* can do everything else.
- **Sharing:** the Share button creates a signed link to the invoice PDF that opens without signing in (`/api/share/invoices/…`).

### Where things live

| Path | Contents |
| --- | --- |
| `app/(billing)/` | Billing root layout, sign-in pages and `dashboard/*` routes |
| `app/api/billing/` | Signed-in PDF, report, export and file routes (`app/api/share/` is the public share link) |
| `features/<module>/` | Each module's Zod schemas, server actions, queries and components |
| `features/invoices/components/invoice-sheet.tsx` | On-screen and printed A4 invoice |
| `server/pdf/invoice-pdf.tsx` | Downloadable PDF invoice (same layout) |
| `server/db/` | Drizzle schema, migrations and seed scripts |
| `server/auth/` | Password hashing (scrypt), database sessions, `requireUser` / `requireAdmin` |
| `lib/billing/` | Money, GST, financial-year, state-code and validation helpers |
| `proxy.ts` | Redirects signed-out visitors away from `/dashboard` |
| `assets/fonts/carlito/` | Carlito font (metric-compatible with Calibri, OFL licence) so invoices match the original Excel invoice |

### Deploying

The billing app needs a Node.js server (`npm run build && npm start`) and a persistent database:

- **One server / VPS:** keep the default SQLite file and back up `data/billing.db` regularly.
- **Serverless (e.g. Vercel):** the filesystem doesn't persist, so use a hosted libSQL database (Turso) via `DATABASE_URL` and `DATABASE_AUTH_TOKEN`, and run `npm run db:setup` against it once.

In production, set `APP_URL` and a strong `AUTH_SECRET`, and serve over HTTPS (session cookies are `Secure` in production).

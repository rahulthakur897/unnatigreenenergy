import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header, type MenuItem } from "@/components/layout/Header";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { NotFoundContent } from "@/components/sections/NotFoundContent";
import { industries } from "@/content/industries";
import { site } from "@/lib/site";
import "./(site)/globals.css";

// The app has two root layouts (public site and billing), so unmatched URLs render this page directly.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Page Not Found | UNNATI GREEN ENERGY",
  robots: { index: false, follow: true },
};

const industriesMenu: MenuItem[] = industries.map(({ slug, title, summary, icon: Icon }) => ({
  href: `/industries/${slug}`,
  title,
  summary,
  icon: <Icon className="size-5" aria-hidden="true" />,
}));

export default function GlobalNotFound() {
  return (
    <html lang="en-IN" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-dvh antialiased">
        <MotionProvider>
          <Header industriesMenu={industriesMenu} />
          <main id="main" tabIndex={-1} className="outline-none">
            <NotFoundContent />
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}

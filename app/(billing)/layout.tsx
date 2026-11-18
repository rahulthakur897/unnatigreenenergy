import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "@/components/billing/ui/sonner";
import { TooltipProvider } from "@/components/billing/ui/tooltip";
import "./billing.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

/** Carlito is metric-compatible with Calibri, the typeface of the printed tax invoice. */
const carlito = localFont({
  variable: "--font-carlito",
  display: "swap",
  src: [
    { path: "../../assets/fonts/carlito/Carlito-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../assets/fonts/carlito/Carlito-Italic.ttf", weight: "400", style: "italic" },
    { path: "../../assets/fonts/carlito/Carlito-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../assets/fonts/carlito/Carlito-BoldItalic.ttf", weight: "700", style: "italic" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  title: { default: "Billing | UNNATI GREEN ENERGY", template: "%s | UGE Billing" },
  description: "Billing & invoice management for UNNATI GREEN ENERGY.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#087a3d",
  colorScheme: "light",
};

export default function BillingRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${jakarta.variable} ${carlito.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        <Toaster richColors position="top-right" closeButton />
      </body>
    </html>
  );
}

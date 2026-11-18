import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Native / Node-only packages used by the billing backend stay out of the server bundle.
  serverExternalPackages: ["@libsql/client", "libsql", "@react-pdf/renderer", "exceljs", "nodemailer"],
  experimental: {
    // Two root layouts (public site + billing app) need a single global 404.
    globalNotFound: true,
    serverActions: {
      // Logo, signature and receipt uploads go through server actions.
      bodySizeLimit: "6mb",
    },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

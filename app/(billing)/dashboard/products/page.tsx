import type { Metadata } from "next";
import { listCategories, listProducts } from "@/features/products/queries";
import { ProductsView } from "@/features/products/components/products-view";
import { requireUser } from "@/server/auth/dal";
import { getCompanySettings } from "@/server/settings";

export const metadata: Metadata = { title: "Products & Services" };

export default async function ProductsPage() {
  await requireUser();
  const [products, categories, settings] = await Promise.all([listProducts(), listCategories(), getCompanySettings()]);
  return <ProductsView products={products} categories={categories} defaultGstRate={settings.defaultGstRate} />;
}

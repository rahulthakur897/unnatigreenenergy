import "server-only";
import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/server/db";
import { invoiceItems, invoices, productCategories, products, stockMovements } from "@/server/db/schema";

export type ProductRow = Awaited<ReturnType<typeof listProducts>>[number];

export async function listProducts() {
  const soldQty = db
    .select({
      productId: invoiceItems.productId,
      invoiceCount: sql<number>`count(distinct ${invoiceItems.invoiceId})`.as("invoice_count"),
    })
    .from(invoiceItems)
    .innerJoin(invoices, eq(invoices.id, invoiceItems.invoiceId))
    .where(eq(invoices.status, "generated"))
    .groupBy(invoiceItems.productId)
    .as("sold");

  return db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      hsnCode: products.hsnCode,
      unit: products.unit,
      categoryId: products.categoryId,
      categoryName: productCategories.name,
      availableQty: products.availableQty,
      purchasePrice: products.purchasePrice,
      sellingPrice: products.sellingPrice,
      gstRate: products.gstRate,
      status: products.status,
      updatedAt: products.updatedAt,
      invoiceCount: sql<number>`coalesce(${soldQty.invoiceCount}, 0)`,
    })
    .from(products)
    .leftJoin(productCategories, eq(productCategories.id, products.categoryId))
    .leftJoin(soldQty, eq(soldQty.productId, products.id))
    .orderBy(asc(products.name));
}

export type CatalogProduct = Awaited<ReturnType<typeof listCatalog>>[number];

/** Active products offered in the invoice item picker. */
export async function listCatalog() {
  return db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      hsnCode: products.hsnCode,
      unit: products.unit,
      availableQty: products.availableQty,
      sellingPrice: products.sellingPrice,
      gstRate: products.gstRate,
    })
    .from(products)
    .where(eq(products.status, "active"))
    .orderBy(asc(products.name));
}

export async function listCategories() {
  const counts = db
    .select({ categoryId: products.categoryId, n: sql<number>`count(*)`.as("n") })
    .from(products)
    .groupBy(products.categoryId)
    .as("counts");
  return db
    .select({ id: productCategories.id, name: productCategories.name, productCount: sql<number>`coalesce(${counts.n}, 0)` })
    .from(productCategories)
    .leftJoin(counts, eq(counts.categoryId, productCategories.id))
    .orderBy(asc(productCategories.name));
}

export async function listStockMovements(productId: string) {
  return db.select().from(stockMovements).where(eq(stockMovements.productId, productId)).orderBy(desc(stockMovements.createdAt)).limit(50);
}

"use server";

import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Decimal, normalizeDecimal, toPaise } from "@/lib/billing/money";
import { action, AppError, ok, parseInput, type ActionResult } from "@/server/action-result";
import { logActivity } from "@/server/activity";
import { requireUser } from "@/server/auth/dal";
import { db } from "@/server/db";
import { invoiceItems, productCategories, products, stockMovements } from "@/server/db/schema";
import { categorySchema, productSchema, stockAdjustmentSchema, type CategoryInput, type ProductInput, type StockAdjustmentInput } from "./schemas";

function toRow(data: ReturnType<typeof productSchema.parse>) {
  return {
    name: data.name,
    description: data.description,
    hsnCode: data.hsnCode,
    unit: data.unit,
    categoryId: data.categoryId && data.categoryId !== "none" ? data.categoryId : null,
    purchasePrice: toPaise(data.purchasePrice || "0"),
    sellingPrice: toPaise(data.sellingPrice || "0"),
    gstRate: data.gstRate,
    status: data.status,
  };
}

export async function createProduct(input: ProductInput): Promise<ActionResult<{ id: string }>> {
  return action(async () => {
    const user = await requireUser();
    const data = parseInput(productSchema, input);
    const opening = normalizeDecimal(data.availableQty);
    const id = await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(products)
        .values({ ...toRow(data), availableQty: opening })
        .returning({ id: products.id });
      if (new Decimal(opening).gt(0)) {
        await tx.insert(stockMovements).values({ productId: row.id, change: opening, reason: "opening", note: "Opening stock", createdBy: user.id });
      }
      await logActivity({ entityType: "product", entityId: row.id, action: "created", description: `Product “${data.name}” added`, userId: user.id }, tx);
      return row.id;
    });
    revalidatePath("/dashboard/products");
    return ok({ id }, "Product added");
  });
}

export async function updateProduct(id: string, input: ProductInput): Promise<ActionResult> {
  return action(async () => {
    await requireUser();
    const data = parseInput(productSchema, input);
    // Stock is changed through adjustments (so every change is logged), not through this form.
    const result = await db.update(products).set(toRow(data)).where(eq(products.id, id)).returning({ id: products.id });
    if (result.length === 0) throw new AppError("Product not found.");
    revalidatePath("/dashboard/products");
    return ok(null, "Product updated");
  });
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  return action(async () => {
    await requireUser();
    const [used] = await db.select({ n: sql<number>`count(*)` }).from(invoiceItems).where(eq(invoiceItems.productId, id));
    if (used.n > 0) {
      throw new AppError("This product appears on invoices, so it can't be deleted. Mark it as inactive instead.");
    }
    await db.delete(products).where(eq(products.id, id));
    revalidatePath("/dashboard/products");
    return ok(null, "Product deleted");
  });
}

export async function adjustStock(productId: string, input: StockAdjustmentInput): Promise<ActionResult<{ availableQty: string }>> {
  return action(async () => {
    const user = await requireUser();
    const data = parseInput(stockAdjustmentSchema, input);
    const qty = new Decimal(data.quantity);
    const change = data.direction === "add" ? qty : qty.neg();

    const availableQty = await db.transaction(async (tx) => {
      const [product] = await tx.select({ availableQty: products.availableQty, name: products.name }).from(products).where(eq(products.id, productId));
      if (!product) throw new AppError("Product not found.");
      const next = new Decimal(product.availableQty).plus(change);
      if (next.lt(0)) throw new AppError(`Only ${product.availableQty} in stock — you can't remove ${data.quantity}.`, { quantity: "More than available stock" });
      await tx.update(products).set({ availableQty: next.toString() }).where(eq(products.id, productId));
      await tx.insert(stockMovements).values({
        productId,
        change: change.toString(),
        reason: "adjustment",
        note: data.note || (data.direction === "add" ? "Stock added" : "Stock removed"),
        createdBy: user.id,
      });
      return next.toString();
    });
    revalidatePath("/dashboard/products");
    return ok({ availableQty }, "Stock updated");
  });
}

export async function createCategory(input: CategoryInput): Promise<ActionResult<{ id: string; name: string }>> {
  return action(async () => {
    await requireUser();
    const data = parseInput(categorySchema, input);
    const existing = await db
      .select({ id: productCategories.id })
      .from(productCategories)
      .where(sql`lower(${productCategories.name}) = lower(${data.name})`);
    if (existing.length) throw new AppError("A category with this name already exists.", { name: "Already exists" });
    const [row] = await db.insert(productCategories).values({ name: data.name }).returning();
    revalidatePath("/dashboard/products");
    return ok({ id: row.id, name: row.name }, "Category added");
  });
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  return action(async () => {
    await requireUser();
    // Products in this category become uncategorised (FK is ON DELETE SET NULL).
    await db.delete(productCategories).where(eq(productCategories.id, id));
    revalidatePath("/dashboard/products");
    return ok(null, "Category deleted");
  });
}

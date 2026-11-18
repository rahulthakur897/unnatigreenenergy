import { z } from "zod";
import { GST_RATES, PRODUCT_STATUSES } from "@/lib/billing/constants";
import { optionalMoney, quantity, requiredText, text } from "@/lib/billing/validation";

export const productSchema = z.object({
  name: requiredText("Product name", 200),
  description: text(1000),
  hsnCode: z
    .string()
    .trim()
    .refine((v) => v === "" || /^\d{4}(\d{2})?(\d{2})?$/.test(v), "HSN/SAC code is 4, 6 or 8 digits"),
  unit: requiredText("Unit", 12).transform((v) => v.toUpperCase()),
  categoryId: z.string(),
  availableQty: quantity("Available quantity"),
  purchasePrice: optionalMoney("purchase price"),
  sellingPrice: optionalMoney("selling price"),
  gstRate: z.enum(GST_RATES, "Select a GST rate"),
  status: z.enum(PRODUCT_STATUSES),
});
export type ProductInput = z.input<typeof productSchema>;

export const stockAdjustmentSchema = z.object({
  direction: z.enum(["add", "remove"]),
  quantity: quantity().refine((v) => Number(v) > 0, "Quantity must be more than 0"),
  note: text(300),
});
export type StockAdjustmentInput = z.input<typeof stockAdjustmentSchema>;

export const categorySchema = z.object({ name: requiredText("Category name", 80) });
export type CategoryInput = z.input<typeof categorySchema>;

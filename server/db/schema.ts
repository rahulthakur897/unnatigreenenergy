/**
 * Billing database schema (SQLite / libSQL via Drizzle ORM).
 *
 * Conventions
 * - Money is stored as INTEGER paise (₹1 = 100) so sums are exact in SQL and JS.
 * - Quantities and GST rates are stored as decimal strings ("3", "12.5") and computed with decimal.js.
 * - Business dates (invoice date, due date, payment date…) are "YYYY-MM-DD" strings.
 * - Audit timestamps are ISO-8601 strings.
 */
import { relations } from "drizzle-orm";
import { blob, index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import {
  CUSTOMER_TYPES,
  INVOICE_STATUSES,
  INVOICE_TYPES,
  LEAD_ACTIVITY_TYPES,
  LEAD_SOURCES,
  LEAD_STATUSES,
  PAYMENT_MODES,
  PRODUCT_STATUSES,
  STOCK_REASONS,
  TAX_TYPES,
  USER_ROLES,
} from "../../lib/billing/constants";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

const now = () => new Date().toISOString();

const timestamps = {
  createdAt: text("created_at").notNull().$defaultFn(now),
  updatedAt: text("updated_at").notNull().$defaultFn(now).$onUpdateFn(now),
};

/* -------------------------------------------------------------------------- */
/* Auth                                                                        */
/* -------------------------------------------------------------------------- */

export const users = sqliteTable("users", {
  id: id(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: USER_ROLES }).notNull().default("staff"),
  avatarFileId: text("avatar_file_id"),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const sessions = sqliteTable(
  "sessions",
  {
    /** SHA-256 of the session token; the raw token only lives in the cookie. */
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: text("expires_at").notNull(),
    userAgent: text("user_agent"),
    createdAt: text("created_at").notNull().$defaultFn(now),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const passwordResets = sqliteTable("password_resets", {
  /** SHA-256 of the reset token. */
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: text("expires_at").notNull(),
  usedAt: text("used_at"),
  createdAt: text("created_at").notNull().$defaultFn(now),
});

/* -------------------------------------------------------------------------- */
/* Files (logo, signature, avatars, expense receipts)                           */
/* -------------------------------------------------------------------------- */

export const files = sqliteTable("files", {
  id: id(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  data: blob("data", { mode: "buffer" }).notNull(),
  uploadedBy: text("uploaded_by"),
  createdAt: text("created_at").notNull().$defaultFn(now),
});

/* -------------------------------------------------------------------------- */
/* Company profile & invoice settings (single row, id = 1)                      */
/* -------------------------------------------------------------------------- */

export const companySettings = sqliteTable("company_settings", {
  id: integer("id").primaryKey(),
  // Company profile
  name: text("name").notNull(),
  logoFileId: text("logo_file_id"),
  address: text("address").notNull().default(""),
  gstin: text("gstin").notNull().default(""),
  pan: text("pan").notNull().default(""),
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  website: text("website").notNull().default(""),
  state: text("state").notNull().default(""),
  stateCode: text("state_code").notNull().default(""),
  // Bank details
  bankName: text("bank_name").notNull().default(""),
  bankAccountName: text("bank_account_name").notNull().default(""),
  bankAccountNumber: text("bank_account_number").notNull().default(""),
  bankIfsc: text("bank_ifsc").notNull().default(""),
  bankBranch: text("bank_branch").notNull().default(""),
  upiId: text("upi_id").notNull().default(""),
  // Invoice settings
  invoicePrefix: text("invoice_prefix").notNull().default("UGE"),
  /** Separate number series for bills of supply, e.g. BOS/2026-27/001. */
  billOfSupplyPrefix: text("bill_of_supply_prefix").notNull().default("BOS"),
  autoNumbering: integer("auto_numbering", { mode: "boolean" }).notNull().default(true),
  numberPadding: integer("number_padding").notNull().default(3),
  defaultGstRate: text("default_gst_rate").notNull().default("18"),
  defaultDueDays: integer("default_due_days").notNull().default(0),
  defaultTerms: text("default_terms").notNull().default(""),
  defaultFooter: text("default_footer").notNull().default(""),
  roundOffTotal: integer("round_off_total", { mode: "boolean" }).notNull().default(true),
  signatoryName: text("signatory_name").notNull().default(""),
  signatoryDesignation: text("signatory_designation").notNull().default("Authorized Signatory"),
  signatureFileId: text("signature_file_id"),
  updatedAt: text("updated_at").notNull().$defaultFn(now).$onUpdateFn(now),
});

/** Last issued number per prefix + financial year, e.g. UGE / 2026-27 → 20. */
export const invoiceSequences = sqliteTable("invoice_sequences", {
  id: text("id").primaryKey(),
  prefix: text("prefix").notNull(),
  financialYear: text("financial_year").notNull(),
  lastNumber: integer("last_number").notNull().default(0),
});

/* -------------------------------------------------------------------------- */
/* CRM                                                                         */
/* -------------------------------------------------------------------------- */

export const customers = sqliteTable(
  "customers",
  {
    id: id(),
    name: text("name").notNull(),
    contactPerson: text("contact_person").notNull().default(""),
    mobile: text("mobile").notNull().default(""),
    email: text("email").notNull().default(""),
    gstin: text("gstin").notNull().default(""),
    pan: text("pan").notNull().default(""),
    billingAddress: text("billing_address").notNull().default(""),
    shippingAddress: text("shipping_address").notNull().default(""),
    state: text("state").notNull().default(""),
    stateCode: text("state_code").notNull().default(""),
    customerType: text("customer_type", { enum: CUSTOMER_TYPES }).notNull().default("business"),
    notes: text("notes").notNull().default(""),
    leadId: text("lead_id"),
    ...timestamps,
  },
  (t) => [index("customers_name_idx").on(t.name)],
);

export const leads = sqliteTable(
  "leads",
  {
    id: id(),
    leadName: text("lead_name").notNull(),
    companyName: text("company_name").notNull().default(""),
    contactPerson: text("contact_person").notNull().default(""),
    mobile: text("mobile").notNull().default(""),
    email: text("email").notNull().default(""),
    gstin: text("gstin").notNull().default(""),
    address: text("address").notNull().default(""),
    productInterest: text("product_interest").notNull().default(""),
    expectedQuantity: text("expected_quantity").notNull().default(""),
    expectedValue: integer("expected_value").notNull().default(0),
    source: text("source", { enum: LEAD_SOURCES }).notNull().default("other"),
    followUpDate: text("follow_up_date"),
    status: text("status", { enum: LEAD_STATUSES }).notNull().default("new"),
    notes: text("notes").notNull().default(""),
    customerId: text("customer_id").references(() => customers.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => [index("leads_status_idx").on(t.status), index("leads_created_idx").on(t.createdAt)],
);

export const leadActivities = sqliteTable(
  "lead_activities",
  {
    id: id(),
    leadId: text("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    type: text("type", { enum: LEAD_ACTIVITY_TYPES }).notNull(),
    content: text("content").notNull(),
    createdBy: text("created_by").references(() => users.id, { onDelete: "set null" }),
    createdAt: text("created_at").notNull().$defaultFn(now),
  },
  (t) => [index("lead_activities_lead_idx").on(t.leadId)],
);

/* -------------------------------------------------------------------------- */
/* Catalogue                                                                    */
/* -------------------------------------------------------------------------- */

export const productCategories = sqliteTable("product_categories", {
  id: id(),
  name: text("name").notNull().unique(),
  createdAt: text("created_at").notNull().$defaultFn(now),
});

export const products = sqliteTable(
  "products",
  {
    id: id(),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    hsnCode: text("hsn_code").notNull().default(""),
    unit: text("unit").notNull().default("PCS"),
    categoryId: text("category_id").references(() => productCategories.id, { onDelete: "set null" }),
    availableQty: text("available_qty").notNull().default("0"),
    purchasePrice: integer("purchase_price").notNull().default(0),
    sellingPrice: integer("selling_price").notNull().default(0),
    gstRate: text("gst_rate").notNull().default("18"),
    status: text("status", { enum: PRODUCT_STATUSES }).notNull().default("active"),
    ...timestamps,
  },
  (t) => [index("products_name_idx").on(t.name)],
);

export const stockMovements = sqliteTable(
  "stock_movements",
  {
    id: id(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    /** Signed decimal string: "+5", "-3". */
    change: text("change").notNull(),
    reason: text("reason", { enum: STOCK_REASONS }).notNull(),
    note: text("note").notNull().default(""),
    invoiceId: text("invoice_id"),
    createdBy: text("created_by"),
    createdAt: text("created_at").notNull().$defaultFn(now),
  },
  (t) => [index("stock_movements_product_idx").on(t.productId)],
);

/* -------------------------------------------------------------------------- */
/* Invoices                                                                    */
/* -------------------------------------------------------------------------- */

export const invoices = sqliteTable(
  "invoices",
  {
    id: id(),
    /** Assigned when the invoice is generated; drafts have no number. */
    invoiceNumber: text("invoice_number"),
    sequenceNumber: integer("sequence_number"),
    financialYear: text("financial_year").notNull(),
    status: text("status", { enum: INVOICE_STATUSES }).notNull().default("draft"),
    invoiceType: text("invoice_type", { enum: INVOICE_TYPES }).notNull().default("tax_invoice"),
    invoiceDate: text("invoice_date").notNull(),
    dueDate: text("due_date"),
    customerId: text("customer_id").references(() => customers.id, { onDelete: "set null" }),

    billName: text("bill_name").notNull(),
    billAddress: text("bill_address").notNull().default(""),
    billGstin: text("bill_gstin").notNull().default(""),
    billState: text("bill_state").notNull().default(""),
    billStateCode: text("bill_state_code").notNull().default(""),
    billPhone: text("bill_phone").notNull().default(""),
    billEmail: text("bill_email").notNull().default(""),

    shipSameAsBilling: integer("ship_same_as_billing", { mode: "boolean" }).notNull().default(true),
    shipName: text("ship_name").notNull().default(""),
    shipAddress: text("ship_address").notNull().default(""),
    shipGstin: text("ship_gstin").notNull().default(""),
    shipState: text("ship_state").notNull().default(""),
    shipStateCode: text("ship_state_code").notNull().default(""),

    placeOfSupply: text("place_of_supply").notNull().default(""),
    taxType: text("tax_type", { enum: TAX_TYPES }).notNull().default("intra"),

    vehicleNumber: text("vehicle_number").notNull().default(""),
    transporterName: text("transporter_name").notNull().default(""),
    lrNumber: text("lr_number").notNull().default(""),
    ewayBillNumber: text("eway_bill_number").notNull().default(""),

    subtotal: integer("subtotal").notNull().default(0),
    taxableAmount: integer("taxable_amount").notNull().default(0),
    cgstAmount: integer("cgst_amount").notNull().default(0),
    sgstAmount: integer("sgst_amount").notNull().default(0),
    igstAmount: integer("igst_amount").notNull().default(0),
    roundOff: integer("round_off").notNull().default(0),
    total: integer("total").notNull().default(0),

    terms: text("terms").notNull().default(""),
    notes: text("notes").notNull().default(""),
    /** JSON snapshot of seller, bank and signatory details, frozen when the invoice is generated. */
    sellerSnapshot: text("seller_snapshot"),

    generatedAt: text("generated_at"),
    cancelledAt: text("cancelled_at"),
    cancelReason: text("cancel_reason"),
    cancelledBy: text("cancelled_by"),
    /** A corrected invoice points at the cancelled invoice it replaces. */
    replacesInvoiceId: text("replaces_invoice_id"),
    createdBy: text("created_by"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("invoices_number_unique").on(t.invoiceNumber),
    index("invoices_status_idx").on(t.status),
    index("invoices_customer_idx").on(t.customerId),
    index("invoices_date_idx").on(t.invoiceDate),
  ],
);

export const invoiceItems = sqliteTable(
  "invoice_items",
  {
    id: id(),
    invoiceId: text("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    productId: text("product_id").references(() => products.id, { onDelete: "set null" }),
    description: text("description").notNull(),
    hsnCode: text("hsn_code").notNull().default(""),
    unit: text("unit").notNull().default("PCS"),
    quantity: text("quantity").notNull(),
    rate: integer("rate").notNull(),
    gstRate: text("gst_rate").notNull(),
    amount: integer("amount").notNull(),
    taxAmount: integer("tax_amount").notNull(),
    /** Product purchase price at the time of sale, used for profit reporting. */
    costPrice: integer("cost_price"),
  },
  (t) => [index("invoice_items_invoice_idx").on(t.invoiceId)],
);

export const payments = sqliteTable(
  "payments",
  {
    id: id(),
    invoiceId: text("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "restrict" }),
    paymentDate: text("payment_date").notNull(),
    amount: integer("amount").notNull(),
    mode: text("mode", { enum: PAYMENT_MODES }).notNull(),
    reference: text("reference").notNull().default(""),
    notes: text("notes").notNull().default(""),
    createdBy: text("created_by"),
    ...timestamps,
  },
  (t) => [index("payments_invoice_idx").on(t.invoiceId), index("payments_date_idx").on(t.paymentDate)],
);

/* -------------------------------------------------------------------------- */
/* Expenses                                                                    */
/* -------------------------------------------------------------------------- */

export const expenses = sqliteTable(
  "expenses",
  {
    id: id(),
    category: text("category").notNull(),
    description: text("description").notNull().default(""),
    /** Amount before GST, in paise. */
    amount: integer("amount").notNull(),
    gstAmount: integer("gst_amount").notNull().default(0),
    expenseDate: text("expense_date").notNull(),
    paymentMode: text("payment_mode", { enum: PAYMENT_MODES }).notNull(),
    vendorName: text("vendor_name").notNull().default(""),
    attachmentFileId: text("attachment_file_id"),
    createdBy: text("created_by"),
    ...timestamps,
  },
  (t) => [index("expenses_date_idx").on(t.expenseDate)],
);

/* -------------------------------------------------------------------------- */
/* Activity log (dashboard feed)                                               */
/* -------------------------------------------------------------------------- */

export const activityLog = sqliteTable(
  "activity_log",
  {
    id: id(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    action: text("action").notNull(),
    description: text("description").notNull(),
    userId: text("user_id"),
    createdAt: text("created_at").notNull().$defaultFn(now),
  },
  (t) => [index("activity_created_idx").on(t.createdAt)],
);

/* -------------------------------------------------------------------------- */
/* Relations                                                                    */
/* -------------------------------------------------------------------------- */

export const invoicesRelations = relations(invoices, ({ many, one }) => ({
  items: many(invoiceItems),
  payments: many(payments),
  customer: one(customers, { fields: [invoices.customerId], references: [customers.id] }),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, { fields: [invoiceItems.invoiceId], references: [invoices.id] }),
  product: one(products, { fields: [invoiceItems.productId], references: [products.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  invoice: one(invoices, { fields: [payments.invoiceId], references: [invoices.id] }),
}));

export const customersRelations = relations(customers, ({ many }) => ({
  invoices: many(invoices),
}));

export const leadsRelations = relations(leads, ({ many, one }) => ({
  activities: many(leadActivities),
  customer: one(customers, { fields: [leads.customerId], references: [customers.id] }),
}));

export const leadActivitiesRelations = relations(leadActivities, ({ one }) => ({
  lead: one(leads, { fields: [leadActivities.leadId], references: [leads.id] }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(productCategories, { fields: [products.categoryId], references: [productCategories.id] }),
  movements: many(stockMovements),
}));

/* -------------------------------------------------------------------------- */
/* Entity types                                                                */
/* -------------------------------------------------------------------------- */

export type User = typeof users.$inferSelect;
export type CompanySettings = typeof companySettings.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Lead = typeof leads.$inferSelect;
export type LeadActivity = typeof leadActivities.$inferSelect;
export type ProductCategory = typeof productCategories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type StockMovement = typeof stockMovements.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
export type InvoiceItem = typeof invoiceItems.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type Expense = typeof expenses.$inferSelect;
export type ActivityLogEntry = typeof activityLog.$inferSelect;

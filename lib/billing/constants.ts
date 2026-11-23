/** Enumerations shared by the database schema, validation and UI (safe for client bundles). */

export const USER_ROLES = ["admin", "staff"] as const;
export const CUSTOMER_TYPES = ["business", "individual", "dealer", "government", "other"] as const;
export const LEAD_STATUSES = ["new", "contacted", "qualified", "proposal_sent", "converted", "lost"] as const;
export const LEAD_SOURCES = ["website", "referral", "phone", "whatsapp", "email", "indiamart", "trade_show", "walk_in", "other"] as const;
export const LEAD_ACTIVITY_TYPES = ["created", "note", "call", "email", "meeting", "follow_up", "status_change", "converted"] as const;
export const PRODUCT_STATUSES = ["active", "inactive"] as const;
export const INVOICE_STATUSES = ["draft", "generated", "cancelled"] as const;
/** Tax invoice charges GST; a bill of supply (exempt / nil-rated goods) charges none. Each has its own number series. */
export const INVOICE_TYPES = ["tax_invoice", "bill_of_supply"] as const;
export const PAYMENT_STATUSES = ["paid", "partially_paid", "pending", "overdue"] as const;
export const TAX_TYPES = ["intra", "inter"] as const;
export const PAYMENT_MODES = ["cash", "bank_transfer", "upi", "cheque", "other"] as const;
export const STOCK_REASONS = ["opening", "adjustment", "invoice", "invoice_cancel"] as const;

/** GST slabs offered in forms. 12% and 28% are kept for legacy items; 40% is the post-Sept-2025 special slab. */
export const GST_RATES = ["0", "5", "12", "18", "28", "40"] as const;

export const UNITS = ["PCS", "NOS", "KG", "TON", "SET", "BOX", "MTR", "LTR"] as const;

export type UserRole = (typeof USER_ROLES)[number];
export type CustomerType = (typeof CUSTOMER_TYPES)[number];
export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];
export type LeadActivityType = (typeof LEAD_ACTIVITY_TYPES)[number];
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];
export type InvoiceType = (typeof INVOICE_TYPES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type TaxType = (typeof TAX_TYPES)[number];
export type PaymentMode = (typeof PAYMENT_MODES)[number];

export const roleLabels: Record<UserRole, string> = { admin: "Admin", staff: "Staff" };

export const customerTypeLabels: Record<CustomerType, string> = {
  business: "Business (B2B)",
  individual: "Individual (B2C)",
  dealer: "Dealer / Trader",
  government: "Government / PSU",
  other: "Other",
};

export const leadStatusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal_sent: "Proposal Sent",
  converted: "Converted",
  lost: "Lost",
};

export const leadSourceLabels: Record<LeadSource, string> = {
  website: "Website",
  referral: "Referral",
  phone: "Phone Call",
  whatsapp: "WhatsApp",
  email: "Email",
  indiamart: "IndiaMART",
  trade_show: "Trade Show",
  walk_in: "Walk-in",
  other: "Other",
};

export const leadActivityLabels: Record<LeadActivityType, string> = {
  created: "Lead created",
  note: "Note",
  call: "Call",
  email: "Email",
  meeting: "Meeting",
  follow_up: "Follow-up",
  status_change: "Status changed",
  converted: "Converted",
};

export const invoiceTypeLabels: Record<InvoiceType, string> = {
  tax_invoice: "Tax Invoice",
  bill_of_supply: "Bill of Supply",
};

export const invoiceStatusLabels: Record<InvoiceStatus, string> = {
  draft: "Draft",
  generated: "Generated",
  cancelled: "Cancelled",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  paid: "Paid",
  partially_paid: "Partially Paid",
  pending: "Pending",
  overdue: "Overdue",
};

export const paymentModeLabels: Record<PaymentMode, string> = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  upi: "UPI",
  cheque: "Cheque",
  other: "Other",
};

export const productStatusLabels: Record<ProductStatus, string> = { active: "Active", inactive: "Inactive" };

/** GST SAC codes (services) start with "99"; services carry no stock. */
export const isServiceCode = (hsnOrSac: string | null | undefined) => (hsnOrSac ?? "").trim().startsWith("99");

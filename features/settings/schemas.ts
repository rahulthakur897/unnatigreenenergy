import { z } from "zod";
import { GST_RATES, INVOICE_TYPES, USER_ROLES } from "@/lib/billing/constants";
import { email, gstin, ifsc, pan, password, phone, requiredEmail, requiredText, stateCode, text } from "@/lib/billing/validation";

export const companyProfileSchema = z.object({
  name: requiredText("Company name", 200),
  address: requiredText("Address", 500),
  gstin: gstin(),
  pan: pan(),
  phone: phone(),
  email: email(),
  website: text(200),
  state: text(80),
  stateCode: stateCode().refine((v) => v.length === 2, "Select the company's state"),
});
export type CompanyProfileInput = z.input<typeof companyProfileSchema>;

const numberPrefix = () =>
  z
    .string()
    .trim()
    .min(1, "Prefix is required")
    .max(12)
    .regex(/^[A-Za-z0-9-]+$/, "Letters, numbers and hyphens only")
    .transform((v) => v.toUpperCase());

export const invoiceSettingsSchema = z.object({
  invoicePrefix: numberPrefix(),
  billOfSupplyPrefix: numberPrefix(),
  autoNumbering: z.boolean(),
  numberPadding: z.enum(["1", "2", "3", "4", "5"]),
  defaultGstRate: z.enum(GST_RATES),
  defaultDueDays: z
    .string()
    .trim()
    .regex(/^\d{1,3}$/, "Enter a number of days (0–365)")
    .refine((v) => Number(v) <= 365, "At most 365 days"),
  roundOffTotal: z.boolean(),
  defaultTerms: text(3000),
  defaultFooter: text(300),
  bankName: text(120),
  bankAccountName: text(120),
  bankAccountNumber: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v === "" || /^[0-9 ]{6,30}$/.test(v), "Digits (and spaces) only"),
  bankIfsc: ifsc(),
  bankBranch: text(200),
  upiId: z
    .string()
    .trim()
    .max(80)
    .refine((v) => v === "" || /^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(v), "Enter a valid UPI ID (e.g. name@bank)"),
  signatoryName: text(120),
  signatoryDesignation: text(120),
});
export type InvoiceSettingsInput = z.input<typeof invoiceSettingsSchema>;

export const numberingSchema = z.object({
  series: z.enum(INVOICE_TYPES),
  financialYear: z.string().regex(/^\d{4}-\d{2}$/, "Select a financial year"),
  nextNumber: z
    .string()
    .trim()
    .regex(/^\d{1,6}$/, "Enter a whole number")
    .refine((v) => Number(v) >= 1, "Must be at least 1"),
});
export type NumberingInput = z.input<typeof numberingSchema>;

export const profileSchema = z.object({ name: requiredText("Name", 120), email: requiredEmail() });
export type ProfileInput = z.input<typeof profileSchema>;

export const changePasswordSchema = z
  .object({ currentPassword: z.string().min(1, "Enter your current password"), password: password(), confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });
export type ChangePasswordInput = z.input<typeof changePasswordSchema>;

export const newUserSchema = z.object({
  name: requiredText("Name", 120),
  email: requiredEmail(),
  role: z.enum(USER_ROLES),
  password: password(),
});
export type NewUserInput = z.input<typeof newUserSchema>;

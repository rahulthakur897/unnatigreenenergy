import { z } from "zod";
import { GSTIN_REGEX, IFSC_REGEX, PAN_REGEX } from "./states";

/**
 * Reusable Zod field builders. Form values stay strings (what inputs produce), so the same
 * schema validates in React Hook Form on the client and again inside server actions.
 */

const MONEY_RE = /^\d{1,11}(\.\d{1,2})?$/;
const QTY_RE = /^\d{1,9}(\.\d{1,3})?$/;
const PERCENT_RE = /^\d{1,2}(\.\d{1,2})?$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PHONE_RE = /^\+?[\d\s-]{7,16}$/;

const stripCommas = (v: string) => v.replace(/,/g, "");

export const text = (max = 200) => z.string().trim().max(max, `Must be at most ${max} characters`);

export const requiredText = (label: string, max = 200) =>
  z.string().trim().min(1, `${label} is required`).max(max, `Must be at most ${max} characters`);

export const money = (label = "amount") =>
  z
    .string()
    .trim()
    .transform(stripCommas)
    .refine((v) => MONEY_RE.test(v), `Enter a valid ${label} (numbers, up to 2 decimals)`);

export const optionalMoney = (label = "amount") =>
  z
    .string()
    .trim()
    .transform(stripCommas)
    .refine((v) => v === "" || MONEY_RE.test(v), `Enter a valid ${label} (numbers, up to 2 decimals)`);

export const positiveMoney = (label = "amount") =>
  money(label).refine((v) => Number(v) > 0, `${label[0].toUpperCase()}${label.slice(1)} must be greater than zero`);

export const quantity = (label = "Quantity") =>
  z
    .string()
    .trim()
    .transform(stripCommas)
    .refine((v) => QTY_RE.test(v), `${label} must be a number (up to 3 decimals)`);

export const percent = () =>
  z
    .string()
    .trim()
    .refine((v) => PERCENT_RE.test(v) && Number(v) <= 100, "Enter a valid percentage");

export const dateString = (label = "Date") => z.string().trim().regex(DATE_RE, `${label} is required`);

export const optionalDate = () => z.string().trim().refine((v) => v === "" || DATE_RE.test(v), "Enter a valid date");

export const email = () =>
  z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => v === "" || z.email().safeParse(v).success, "Enter a valid email address");

export const requiredEmail = () => z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address"));

export const phone = () => z.string().trim().refine((v) => v === "" || PHONE_RE.test(v), "Enter a valid phone number");

export const gstin = () =>
  z
    .string()
    .trim()
    .toUpperCase()
    .refine((v) => v === "" || GSTIN_REGEX.test(v), "Enter a valid 15-character GSTIN (e.g. 09ABCDE1234F1Z5)");

export const pan = () =>
  z
    .string()
    .trim()
    .toUpperCase()
    .refine((v) => v === "" || PAN_REGEX.test(v), "Enter a valid PAN (e.g. ABCDE1234F)");

export const ifsc = () =>
  z
    .string()
    .trim()
    .toUpperCase()
    .refine((v) => v === "" || IFSC_REGEX.test(v), "Enter a valid IFSC code (e.g. YESB0001454)");

export const stateCode = () => z.string().trim().max(2);

export const password = () =>
  z
    .string()
    .min(8, "Use at least 8 characters")
    .max(128, "Use at most 128 characters")
    .refine((v) => /[A-Za-z]/.test(v) && /\d/.test(v), "Include at least one letter and one number");

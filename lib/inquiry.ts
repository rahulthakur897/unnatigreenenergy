/**
 * Quote / inquiry form model. Shared by the client form (instant feedback)
 * and the server action (authoritative validation).
 */

export const materialOptions = [
  "Lithium-ion cells",
  "Battery packs & modules",
  "EV / e-rickshaw batteries",
  "Energy storage batteries",
  "LED & lighting batteries",
  "Medical equipment batteries",
  "Consumer electronics batteries",
  "Industrial battery scrap",
  "Mixed battery waste",
  "Battery manufacturing line services",
  "Other / not sure",
] as const;

export const inquiryFields = ["fullName", "company", "phone", "email", "material", "quantity", "message"] as const;

export type InquiryField = (typeof inquiryFields)[number];
export type InquiryValues = Record<InquiryField, string>;
export type InquiryErrors = Partial<Record<InquiryField, string>>;

export type InquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: InquiryErrors;
  values?: InquiryValues;
};

export const initialInquiryState: InquiryState = { status: "idle" };

const LIMITS: Record<InquiryField, number> = {
  fullName: 100,
  company: 120,
  phone: 20,
  email: 254,
  material: 60,
  quantity: 80,
  message: 2000,
};

export function readInquiry(formData: FormData): InquiryValues {
  const values = {} as InquiryValues;
  for (const field of inquiryFields) {
    const raw = formData.get(field);
    values[field] = typeof raw === "string" ? raw.trim() : "";
  }
  return values;
}

export function validateField(field: InquiryField, value: string): string | undefined {
  const v = value.trim();
  if (v.length > LIMITS[field]) return `Please keep this under ${LIMITS[field]} characters.`;

  switch (field) {
    case "fullName":
      if (v.length < 2) return "Please enter your full name.";
      return;
    case "phone": {
      if (!v) return "Please enter your phone number.";
      const digits = v.replace(/\D/g, "");
      if (!/^\+?[\d\s()-]+$/.test(v) || digits.length < 10 || digits.length > 15) {
        return "Please enter a valid phone number (10–15 digits).";
      }
      return;
    }
    case "email":
      if (!v) return "Please enter your email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Please enter a valid email address.";
      return;
    case "material":
      if (!v) return "Please select the material or battery type.";
      if (!(materialOptions as readonly string[]).includes(v)) return "Please choose an option from the list.";
      return;
    case "message":
      if (v.length < 10) return "Please add a few details about your material (at least 10 characters).";
      return;
    default:
      return;
  }
}

export function validateInquiry(values: InquiryValues): InquiryErrors {
  const errors: InquiryErrors = {};
  for (const field of inquiryFields) {
    const error = validateField(field, values[field] ?? "");
    if (error) errors[field] = error;
  }
  return errors;
}

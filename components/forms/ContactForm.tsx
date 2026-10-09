"use client";

import Link from "next/link";
import { ChevronDown, CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";
import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { submitInquiry } from "@/lib/actions";
import {
  initialInquiryState,
  inquiryFields,
  materialOptions,
  readInquiry,
  validateField,
  validateInquiry,
  type InquiryField,
} from "@/lib/inquiry";
import { cn } from "@/lib/utils";

type FieldErrors = Partial<Record<InquiryField, string | undefined>>;

/** Quote / inquiry form with instant client-side validation and server-side validation. */
export function ContactForm() {
  const [formKey, setFormKey] = useState(0);
  return <InquiryForm key={formKey} onReset={() => setFormKey((key) => key + 1)} />;
}

const control =
  "block w-full rounded-xl border bg-white px-4 text-[0.9375rem] text-ink-950 shadow-[0_1px_2px_rgb(16_37_26/0.04)] transition-[border-color,box-shadow] duration-300 placeholder:text-ink-400 focus:border-forest-600 focus:ring-4 focus:ring-leaf-200/60 focus-visible:outline-none";

function controlState(error?: string) {
  return error
    ? "border-[#b42318]/70 focus:border-[#b42318] focus:ring-[#b42318]/15"
    : "border-mist-300 hover:border-ink-400/70";
}

function Field({
  id,
  label,
  required,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-ink-900">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-leaf-600">
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-ink-400"> (optional)</span>
        )}
      </label>
      <div className="mt-2">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-1.5 text-sm font-medium text-[#b42318]">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 text-xs text-ink-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function InquiryForm({ onReset }: { onReset: () => void }) {
  const [state, formAction, pending] = useActionState(submitInquiry, initialInquiryState);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  const [attempted, setAttempted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const uid = useId();
  const idFor = (field: string) => `${uid}-${field}`;

  // A fresh server response is authoritative: drop stale client-side results.
  const [seenState, setSeenState] = useState(state);
  if (seenState !== state) {
    setSeenState(state);
    setClientErrors({});
  }

  // Client results override server results field-by-field (undefined clears an error).
  const errors: FieldErrors = { ...(state.status === "error" ? state.errors : {}), ...clientErrors };
  const errorCount = inquiryFields.filter((field) => errors[field]).length;

  useEffect(() => {
    if (state.status === "success") successRef.current?.focus();
  }, [state.status]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const result = validateInquiry(readInquiry(new FormData(event.currentTarget)));
    setAttempted(true);
    setClientErrors(Object.fromEntries(inquiryFields.map((field) => [field, result[field]])));
    const firstInvalid = inquiryFields.find((field) => result[field]);
    if (firstInvalid) {
      event.preventDefault();
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
    }
  }

  function revalidate(event: FocusEvent<HTMLFormElement> | FormEvent<HTMLFormElement>, onlyIfShowing: boolean) {
    const target = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const field = target.name as InquiryField;
    if (!inquiryFields.includes(field)) return;
    if (onlyIfShowing && !errors[field]) return;
    if (!onlyIfShowing && !attempted && !target.value) return;
    setClientErrors((previous) => ({ ...previous, [field]: validateField(field, target.value) }));
  }

  if (state.status === "success") {
    return (
      <div className="flex flex-col items-start gap-5 py-4" role="status">
        <span className="grid size-14 place-items-center rounded-full bg-leaf-100 text-forest-700">
          <CircleCheck className="size-7" aria-hidden="true" />
        </span>
        <h3 ref={successRef} tabIndex={-1} className="font-display text-2xl font-bold text-ink-950 focus:outline-none">
          Inquiry received
        </h3>
        <p className="max-w-md leading-relaxed text-ink-500">{state.message}</p>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-semibold text-forest-700 underline decoration-leaf-300 underline-offset-4 hover:text-forest-900"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  const describedBy = (field: InquiryField) => (errors[field] ? `${idFor(field)}-error` : undefined);
  const values = state.values;

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={handleSubmit}
      onBlur={(event) => revalidate(event, false)}
      onChange={(event) => revalidate(event, true)}
      noValidate
      className="relative"
    >
      {attempted && errorCount > 0 && (
        <p role="alert" className="mb-6 flex items-start gap-2.5 rounded-xl border border-[#b42318]/20 bg-[#fef3f2] p-4 text-sm font-medium text-[#912018]">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Please correct the {errorCount === 1 ? "highlighted field" : `${errorCount} highlighted fields`} below.
        </p>
      )}
      {state.status === "error" && !state.errors && state.message && (
        <p role="alert" className="mb-6 flex items-start gap-2.5 rounded-xl border border-[#b42318]/20 bg-[#fef3f2] p-4 text-sm font-medium text-[#912018]">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={idFor("fullName")} label="Full Name" required error={errors.fullName}>
          <input
            id={idFor("fullName")}
            name="fullName"
            type="text"
            autoComplete="name"
            defaultValue={values?.fullName}
            aria-required="true"
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={describedBy("fullName")}
            className={cn(control, "h-12", controlState(errors.fullName))}
          />
        </Field>
        <Field id={idFor("company")} label="Company Name" error={errors.company}>
          <input
            id={idFor("company")}
            name="company"
            type="text"
            autoComplete="organization"
            defaultValue={values?.company}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={describedBy("company")}
            className={cn(control, "h-12", controlState(errors.company))}
          />
        </Field>
        <Field id={idFor("phone")} label="Phone Number" required error={errors.phone}>
          <input
            id={idFor("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91 98765 43210"
            defaultValue={values?.phone}
            aria-required="true"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone")}
            className={cn(control, "h-12", controlState(errors.phone))}
          />
        </Field>
        <Field id={idFor("email")} label="Email Address" required error={errors.email}>
          <input
            id={idFor("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@company.com"
            defaultValue={values?.email}
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            className={cn(control, "h-12", controlState(errors.email))}
          />
        </Field>
        <Field id={idFor("material")} label="Material / Battery Type" required error={errors.material}>
          <div className="relative">
            <select
              id={idFor("material")}
              name="material"
              defaultValue={values?.material ?? ""}
              aria-required="true"
              aria-invalid={Boolean(errors.material)}
              aria-describedby={describedBy("material")}
              className={cn(control, "h-12 appearance-none pr-11", controlState(errors.material))}
            >
              <option value="" disabled>
                Select a category
              </option>
              {materialOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-ink-500" />
          </div>
        </Field>
        <Field
          id={idFor("quantity")}
          label="Estimated Quantity"
          error={errors.quantity}
          hint="e.g. 500 kg, 2 tonnes, 1,000 cells or monthly lots"
        >
          <input
            id={idFor("quantity")}
            name="quantity"
            type="text"
            defaultValue={values?.quantity}
            aria-invalid={Boolean(errors.quantity)}
            aria-describedby={errors.quantity ? `${idFor("quantity")}-error` : `${idFor("quantity")}-hint`}
            className={cn(control, "h-12", controlState(errors.quantity))}
          />
        </Field>
        <Field id={idFor("message")} label="Message" required error={errors.message} className="sm:col-span-2">
          <textarea
            id={idFor("message")}
            name="message"
            rows={5}
            placeholder="Describe the battery type, condition, packing and pickup location."
            defaultValue={values?.message}
            aria-required="true"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy("message")}
            className={cn(control, "resize-y py-3", controlState(errors.message))}
          />
        </Field>
      </div>

      {/* Spam honeypot — hidden from people and assistive technology */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={idFor("website")}>Website</label>
        <input id={idFor("website")} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-ink-400">
          By submitting, you agree to our{" "}
          <Link href="/privacy-policy" className="font-medium text-forest-700 underline underline-offset-2">
            Privacy Policy
          </Link>
          . We only use your details to respond to your inquiry.
        </p>
        <button
          type="submit"
          disabled={pending}
          className="group/btn inline-flex h-14 shrink-0 items-center justify-center gap-3 rounded-full bg-forest-700 pl-7 pr-2 font-semibold text-white shadow-[0_10px_28px_-12px_rgb(2_70_23/0.75)] transition-colors duration-300 hover:bg-forest-800 disabled:cursor-wait disabled:opacity-75"
        >
          {pending ? "Submitting…" : "Submit Inquiry"}
          <span className="grid size-10 place-items-center rounded-full bg-white/15 transition-colors duration-300 group-hover/btn:bg-sun-400 group-hover/btn:text-forest-950">
            {pending ? (
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="size-4" aria-hidden="true" />
            )}
          </span>
        </button>
      </div>
    </form>
  );
}

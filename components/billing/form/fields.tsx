"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState, type ComponentProps, type ReactNode } from "react";
import { Controller, type Control, type FieldPath, type FieldValues, type UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/billing/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/billing/ui/field";
import { Input } from "@/components/billing/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/billing/ui/select";
import { Switch } from "@/components/billing/ui/switch";
import { Textarea } from "@/components/billing/ui/textarea";
import { INDIAN_STATES } from "@/lib/billing/states";
import { cn } from "@/lib/ui-utils";

type BaseProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: ReactNode;
  description?: ReactNode;
  required?: boolean;
  className?: string;
  disabled?: boolean;
};

function Label({ children, required, htmlFor }: { children: ReactNode; required?: boolean; htmlFor: string }) {
  return (
    <FieldLabel htmlFor={htmlFor} className="text-[13px] font-medium text-foreground/90">
      {children}
      {required && (
        <span className="text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </FieldLabel>
  );
}

const fieldId = (name: string) => `f-${name.replace(/\./g, "-")}`;

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  className,
  disabled,
  ...input
}: BaseProps<T> & Omit<ComponentProps<typeof Input>, "name" | "defaultValue">) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("gap-1.5", className)}>
          <Label htmlFor={fieldId(name)} required={required}>
            {label}
          </Label>
          <Input
            id={fieldId(name)}
            {...input}
            {...field}
            value={field.value ?? ""}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
          />
          {description && !fieldState.invalid && <FieldDescription className="text-xs">{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-xs" />}
        </Field>
      )}
    />
  );
}

export function PasswordField<T extends FieldValues>(props: BaseProps<T> & { autoComplete?: string; placeholder?: string }) {
  const [visible, setVisible] = useState(false);
  const { control, name, label, required, className, autoComplete, placeholder, description } = props;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("gap-1.5", className)}>
          <Label htmlFor={fieldId(name)} required={required}>
            {label}
          </Label>
          <div className="relative">
            <Input
              id={fieldId(name)}
              type={visible ? "text" : "password"}
              autoComplete={autoComplete}
              placeholder={placeholder}
              className="pr-10"
              {...field}
              value={field.value ?? ""}
              aria-invalid={fieldState.invalid}
            />
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground"
              aria-label={visible ? "Hide password" : "Show password"}
              aria-pressed={visible}
            >
              {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {description && !fieldState.invalid && <FieldDescription className="text-xs">{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-xs" />}
        </Field>
      )}
    />
  );
}

export function MoneyField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  className,
  disabled,
  placeholder = "0.00",
}: BaseProps<T> & { placeholder?: string }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("gap-1.5", className)}>
          <Label htmlFor={fieldId(name)} required={required}>
            {label}
          </Label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-sm text-muted-foreground">₹</span>
            <Input
              id={fieldId(name)}
              inputMode="decimal"
              placeholder={placeholder}
              className="pl-7 tabular"
              {...field}
              value={field.value ?? ""}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
          </div>
          {description && !fieldState.invalid && <FieldDescription className="text-xs">{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-xs" />}
        </Field>
      )}
    />
  );
}

export function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  className,
  disabled,
  ...textarea
}: BaseProps<T> & Omit<ComponentProps<typeof Textarea>, "name" | "defaultValue">) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("gap-1.5", className)}>
          <Label htmlFor={fieldId(name)} required={required}>
            {label}
          </Label>
          <Textarea
            id={fieldId(name)}
            {...textarea}
            {...field}
            value={field.value ?? ""}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
          />
          {description && !fieldState.invalid && <FieldDescription className="text-xs">{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-xs" />}
        </Field>
      )}
    />
  );
}

export type Option = { value: string; label: string };

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  className,
  disabled,
  options,
  placeholder = "Select…",
  onValueChange,
}: BaseProps<T> & { options: readonly Option[]; placeholder?: string; onValueChange?: (value: string) => void }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={cn("gap-1.5", className)}>
          <Label htmlFor={fieldId(name)} required={required}>
            {label}
          </Label>
          <Select
            value={field.value ?? ""}
            onValueChange={(value) => {
              field.onChange(value);
              onValueChange?.(value);
            }}
            disabled={disabled}
          >
            <SelectTrigger id={fieldId(name)} className="w-full" aria-invalid={fieldState.invalid} onBlur={field.onBlur}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && !fieldState.invalid && <FieldDescription className="text-xs">{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} className="text-xs" />}
        </Field>
      )}
    />
  );
}

export const stateOptions: Option[] = INDIAN_STATES.map((s) => ({ value: s.code, label: `${s.code} · ${s.name}` }));

/** Select bound to a state-code field; also writes the state name into `nameField`. */
export function StateSelectField<T extends FieldValues>({
  form,
  codeField,
  nameField,
  label = "State",
  required,
  className,
  disabled,
}: {
  form: UseFormReturn<T>;
  codeField: FieldPath<T>;
  nameField: FieldPath<T>;
  label?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <SelectField
      control={form.control}
      name={codeField}
      label={label}
      required={required}
      className={className}
      disabled={disabled}
      options={stateOptions}
      placeholder="Select state"
      onValueChange={(code) => {
        const state = INDIAN_STATES.find((s) => s.code === code);
        form.setValue(nameField, (state?.name ?? "") as never, { shouldDirty: true, shouldValidate: true });
      }}
    />
  );
}

export function DateField<T extends FieldValues>(props: BaseProps<T> & { min?: string; max?: string }) {
  return <TextField {...props} type="date" />;
}

export function CheckboxField<T extends FieldValues>({ control, name, label, description, className, disabled }: BaseProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field orientation="horizontal" className={cn("items-start gap-2.5", className)}>
          <Checkbox
            id={fieldId(name)}
            checked={!!field.value}
            onCheckedChange={(checked) => field.onChange(checked === true)}
            disabled={disabled}
            className="mt-0.5"
          />
          <FieldContent className="gap-0.5">
            <FieldLabel htmlFor={fieldId(name)} className="text-sm font-normal">
              {label}
            </FieldLabel>
            {description && <FieldDescription className="text-xs">{description}</FieldDescription>}
          </FieldContent>
        </Field>
      )}
    />
  );
}

export function SwitchField<T extends FieldValues>({ control, name, label, description, className, disabled }: BaseProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field orientation="horizontal" className={cn("items-start justify-between gap-4 rounded-lg border p-3.5", className)}>
          <FieldContent className="gap-0.5">
            <FieldLabel htmlFor={fieldId(name)} className="text-sm font-medium">
              {label}
            </FieldLabel>
            {description && <FieldDescription className="text-xs">{description}</FieldDescription>}
          </FieldContent>
          <Switch id={fieldId(name)} checked={!!field.value} onCheckedChange={field.onChange} disabled={disabled} />
        </Field>
      )}
    />
  );
}

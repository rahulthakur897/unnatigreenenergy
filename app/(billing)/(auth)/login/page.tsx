"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CheckboxField, PasswordField, TextField } from "@/components/billing/form/fields";
import { Button } from "@/components/billing/ui/button";
import { FieldGroup } from "@/components/billing/ui/field";
import { Spinner } from "@/components/billing/ui/spinner";
import { signIn } from "@/features/auth/actions";
import { signInSchema, type SignInInput } from "@/features/auth/schemas";

/** Sign-in page. The page title and the "already signed in" redirect live in the (auth) layout. */
export default function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = use(searchParams);
  const next = typeof params.next === "string" ? params.next : undefined;
  const signedOut = params.signedOut !== undefined;

  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  useEffect(() => {
    if (signedOut) toast.success("You have been signed out.");
  }, [signedOut]);

  const onSubmit = form.handleSubmit((values) => {
    setError(null);
    startTransition(async () => {
      const result = await signIn(values, next);
      if (result.ok) {
        toast.success(result.message ?? "Signed in");
        router.replace(result.data.redirectTo);
        router.refresh();
      } else {
        setError(result.error);
        form.setValue("password", "");
        form.setFocus("password");
      }
    });
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-[1.75rem] font-bold tracking-tight text-foreground">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Sign in to manage invoices, customers and payments.</p>
      </div>
      <form onSubmit={onSubmit} noValidate className="space-y-6">
        {error && (
          <div role="alert" className="flex items-start gap-2.5 rounded-lg border border-destructive/25 bg-danger-soft px-3.5 py-3 text-sm text-danger">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}
        <FieldGroup className="gap-5">
          <TextField
            control={form.control}
            name="email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@unnatigreenenergy.com"
            className="[&_input]:h-11"
            autoFocus
          />
          <PasswordField
            control={form.control}
            name="password"
            label="Password"
            autoComplete="current-password"
            placeholder="Enter your password"
            className="[&_input]:h-11"
          />
          <CheckboxField control={form.control} name="remember" label="Remember me for 30 days" className="w-auto" />
        </FieldGroup>
        <Button type="submit" className="h-11 w-full text-[15px]" disabled={pending}>
          {pending ? <Spinner /> : null}
          {pending ? "Signing in…" : "Sign in"}
          {!pending && <ArrowRight />}
        </Button>
      </form>
    </div>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Plus, Save, ShieldCheck, UserCog } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { ToneBadge } from "@/components/billing/common";
import { PasswordField, SelectField, TextField } from "@/components/billing/form/fields";
import { handleActionResult } from "@/components/billing/form/submit";
import { ImageUpload, type ImageChange } from "@/components/billing/image-upload";
import { Button } from "@/components/billing/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/billing/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/billing/ui/dialog";
import { Spinner } from "@/components/billing/ui/spinner";
import { Switch } from "@/components/billing/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/billing/ui/table";
import { roleLabels, USER_ROLES, type UserRole } from "@/lib/billing/constants";
import { formatDateTime } from "@/lib/billing/dates";
import { changePassword, createUser, updateMyProfile, updateUserAccess } from "../actions";
import {
  changePasswordSchema,
  newUserSchema,
  profileSchema,
  type ChangePasswordInput,
  type NewUserInput,
  type ProfileInput,
} from "../schemas";

export function ProfileForm({ values, avatarUrl }: { values: ProfileInput; avatarUrl: string | null }) {
  const [pending, startTransition] = useTransition();
  const [avatar, setAvatar] = useState<ImageChange>({ file: null, remove: false });
  const form = useForm<ProfileInput>({ resolver: zodResolver(profileSchema), defaultValues: values });
  const onSubmit = form.handleSubmit((v) =>
    startTransition(async () => {
      const fd = new FormData();
      fd.set("values", JSON.stringify(v));
      if (avatar.file) fd.set("avatar", avatar.file);
      if (avatar.remove) fd.set("remove_avatar", "1");
      const result = await updateMyProfile(fd);
      handleActionResult(result, form);
    }),
  );
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="size-4 text-primary" /> My profile
        </CardTitle>
        <CardDescription>Your name and email for signing in.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit} noValidate>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <ImageUpload
              label="Profile picture"
              hint="PNG, JPG or WebP, up to 2 MB."
              accept="image/png,image/jpeg,image/webp"
              currentUrl={avatarUrl}
              onChange={setAvatar}
              previewClassName="size-20 w-20 rounded-full p-0 [&_img]:size-full [&_img]:object-cover"
            />
          </div>
          <TextField control={form.control} name="name" label="Name" required />
          <TextField control={form.control} name="email" label="Email" type="email" required />
        </CardContent>
        <CardFooter className="mt-6 justify-end border-t">
          <Button type="submit" disabled={pending}>
            {pending ? <Spinner /> : <Save />} Save profile
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export function PasswordForm() {
  const [pending, startTransition] = useTransition();
  const form = useForm<ChangePasswordInput>({ resolver: zodResolver(changePasswordSchema), defaultValues: { currentPassword: "", password: "", confirmPassword: "" } });
  const onSubmit = form.handleSubmit((v) =>
    startTransition(async () => {
      const result = await changePassword(v);
      handleActionResult(result, form);
      if (result.ok) form.reset();
    }),
  );
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="size-4 text-primary" /> Change password
        </CardTitle>
        <CardDescription>At least 8 characters, including a letter and a number.</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit} noValidate>
        <CardContent className="grid gap-4">
          <PasswordField control={form.control} name="currentPassword" label="Current password" autoComplete="current-password" />
          <PasswordField control={form.control} name="password" label="New password" autoComplete="new-password" />
          <PasswordField control={form.control} name="confirmPassword" label="Confirm new password" autoComplete="new-password" />
        </CardContent>
        <CardFooter className="mt-6 justify-end border-t">
          <Button type="submit" variant="secondary" disabled={pending}>
            {pending && <Spinner />} Update password
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

type UserRow = { id: string; name: string; email: string; role: UserRole; isActive: boolean; createdAt: string };

export function UsersCard({ users, currentUserId }: { users: UserRow[]; currentUserId: string }) {
  const [busy, setBusy] = useState<string | null>(null);
  async function patch(id: string, change: { role?: UserRole; isActive?: boolean }) {
    setBusy(id);
    handleActionResult(await updateUserAccess(id, change));
    setBusy(null);
  }
  return (
    <Card className="gap-0 py-0 shadow-card">
      <CardHeader className="flex flex-row items-start justify-between gap-4 border-b py-5">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" /> Users & access
          </CardTitle>
          <CardDescription className="mt-1.5">Admins manage settings, users and cancellations. Staff handle day-to-day billing.</CardDescription>
        </div>
        <AddUserDialog />
      </CardHeader>
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden md:table-cell">Added</TableHead>
            <TableHead className="text-right">Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => {
            const self = u.id === currentUserId;
            return (
              <TableRow key={u.id}>
                <TableCell>
                  <p className="font-medium">
                    {u.name} {self && <span className="text-xs font-normal text-muted-foreground">(you)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </TableCell>
                <TableCell>
                  {self ? (
                    <ToneBadge tone="green">{roleLabels[u.role]}</ToneBadge>
                  ) : (
                    <select
                      value={u.role}
                      onChange={(e) => patch(u.id, { role: e.target.value as UserRole })}
                      disabled={busy === u.id}
                      className="h-8 rounded-md border bg-white px-2 text-sm"
                      aria-label={`Role for ${u.name}`}
                    >
                      {USER_ROLES.map((r) => (
                        <option key={r} value={r}>
                          {roleLabels[r]}
                        </option>
                      ))}
                    </select>
                  )}
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{formatDateTime(u.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Switch checked={u.isActive} disabled={self || busy === u.id} onCheckedChange={(v) => patch(u.id, { isActive: v })} aria-label={`${u.name} active`} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}

function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const form = useForm<NewUserInput>({ resolver: zodResolver(newUserSchema), defaultValues: { name: "", email: "", role: "staff", password: "" } });
  const onSubmit = form.handleSubmit((v) =>
    startTransition(async () => {
      const result = await createUser(v);
      handleActionResult(result, form);
      if (result.ok) {
        setOpen(false);
        form.reset();
      }
    }),
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus /> Add user
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add user</DialogTitle>
          <DialogDescription>Share the temporary password securely; they can change it under Settings → My profile.</DialogDescription>
        </DialogHeader>
        <form id="user-form" onSubmit={onSubmit} noValidate className="grid gap-4">
          <TextField control={form.control} name="name" label="Name" required />
          <TextField control={form.control} name="email" label="Email" type="email" required />
          <SelectField control={form.control} name="role" label="Role" options={USER_ROLES.map((r) => ({ value: r, label: roleLabels[r] }))} />
          <PasswordField control={form.control} name="password" label="Temporary password" autoComplete="new-password" />
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button type="submit" form="user-form" disabled={pending}>
            {pending && <Spinner />} Add user
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

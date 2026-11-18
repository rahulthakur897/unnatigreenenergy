import { cookies } from "next/headers";
import { AppHeader } from "@/components/billing/shell/app-header";
import { AppSidebar } from "@/components/billing/shell/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/billing/ui/sidebar";
import { requireUser } from "@/server/auth/dal";
import { fileUrl } from "@/server/files";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const sidebarState = (await cookies()).get("sidebar_state")?.value;

  return (
    <SidebarProvider defaultOpen={sidebarState !== "false"}>
      <AppSidebar />
      <SidebarInset className="min-w-0 bg-background">
        <AppHeader user={{ name: user.name, email: user.email, role: user.role, avatarUrl: fileUrl(user.avatarFileId) }} />
        <div className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 md:px-6 lg:px-8 lg:py-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

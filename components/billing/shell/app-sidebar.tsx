"use client";

import { ChevronRight, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/billing/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from "@/components/billing/ui/sidebar";
import { signOut } from "@/features/auth/actions";
import { logo } from "@/lib/brand";
import { isNavActive, navGroups, normalizePath } from "./nav";

export function AppSidebar() {
  const pathname = normalizePath(usePathname());
  const { setOpenMobile, isMobile } = useSidebar();
  const closeOnMobile = () => isMobile && setOpenMobile(false);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="h-16 justify-center border-b border-sidebar-border px-3">
        <Link href="/dashboard" onClick={closeOnMobile} className="flex items-center gap-2 overflow-hidden" aria-label="Billing dashboard">
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            className="h-10 w-auto group-data-[collapsible=icon]:hidden"
            priority
          />
          <Image
            src="/assets/images/brand/unnati-emblem.png"
            alt=""
            width={32}
            height={32}
            className="hidden size-8 group-data-[collapsible=icon]:block"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 py-2">
        {navGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-1.5">
            <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isNavActive(item, pathname);
                  if (item.children) {
                    return (
                      <Collapsible key={item.href} asChild defaultOpen={active} className="group/collapsible">
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title} isActive={active} className="h-9">
                              <item.icon />
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.children.map((child) => (
                                <SidebarMenuSubItem key={child.href}>
                                  <SidebarMenuSubButton asChild isActive={pathname === child.href}>
                                    <Link href={child.href} onClick={closeOnMobile}>
                                      <span>{child.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={active}
                        className="relative h-9 data-[active=true]:before:absolute data-[active=true]:before:inset-y-1.5 data-[active=true]:before:-left-2 data-[active=true]:before:w-1 data-[active=true]:before:rounded-r data-[active=true]:before:bg-primary group-data-[collapsible=icon]:before:hidden"
                      >
                        <Link href={item.href} onClick={closeOnMobile}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <form action={signOut}>
              <SidebarMenuButton type="submit" tooltip="Logout" className="h-9 text-slate-600 hover:bg-danger-soft hover:text-danger">
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </form>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

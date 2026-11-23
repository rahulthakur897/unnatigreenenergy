import { FilePlus2, FileText, LayoutDashboard, Package, Settings, Target, Users, type LucideIcon } from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Custom active matcher; defaults to prefix matching. */
  match?: (path: string) => boolean;
  children?: { title: string; href: string }[];
};

export type NavGroup = { label: string; items: NavItem[] };

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ title: "Overview", href: "/dashboard", icon: LayoutDashboard, match: (p) => p === "/dashboard" }],
  },
  {
    label: "Sales",
    items: [
      { title: "Leads", href: "/dashboard/leads", icon: Target },
      { title: "Customers", href: "/dashboard/customers", icon: Users },
      { title: "Products & Services", href: "/dashboard/products", icon: Package },
    ],
  },
  {
    label: "Billing",
    items: [
      { title: "Create Invoice", href: "/dashboard/invoices/new", icon: FilePlus2, match: (p) => p === "/dashboard/invoices/new" },
      {
        title: "All Invoices",
        href: "/dashboard/invoices",
        icon: FileText,
        match: (p) => p.startsWith("/dashboard/invoices") && p !== "/dashboard/invoices/new",
      },
    ],
  },
  {
    label: "Administration",
    items: [{ title: "Settings", href: "/dashboard/settings", icon: Settings }],
  },
];

/** Strips the trailing slash added by `trailingSlash: true`. */
export const normalizePath = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path);

export function isNavActive(item: NavItem, rawPath: string) {
  const path = normalizePath(rawPath);
  if (item.match) return item.match(path);
  return path === item.href || path.startsWith(`${item.href}/`);
}

/** Breadcrumb labels for known path segments. */
export const segmentLabels: Record<string, string> = {
  dashboard: "Dashboard",
  leads: "Leads",
  customers: "Customers",
  products: "Products & Services",
  invoices: "Invoices",
  new: "Create",
  edit: "Edit",
  settings: "Settings",
};

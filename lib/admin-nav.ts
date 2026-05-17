export type AdminNavItem = {
  href: string;
  label: string;
  icon: string;
  description?: string;
};

export const ADMIN_PRIMARY_NAV: AdminNavItem[] = [
  {
    href: "/admin",
    label: "Overview",
    icon: "◉",
    description: "Sales, queues, and health"
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: "📦",
    description: "Fulfillment queue"
  },
  {
    href: "/admin/products",
    label: "Inventory",
    icon: "🛋️",
    description: "Listings and approvals"
  },
  {
    href: "/admin/content",
    label: "Journal",
    icon: "✎",
    description: "Blog and editorial"
  }
];

export const ADMIN_OPERATIONS_NAV: AdminNavItem[] = [
  {
    href: "/admin/support",
    label: "Support",
    icon: "💬",
    description: "Customer tickets"
  },
  {
    href: "/admin/announcements",
    label: "Announcements",
    icon: "📣",
    description: "In-app broadcasts"
  },
  {
    href: "/admin/data",
    label: "Data manager",
    icon: "🗄",
    description: "Firestore browser"
  }
];

export function isAdminNavActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

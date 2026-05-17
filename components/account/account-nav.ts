export type AccountNavItem = {
  href: string;
  label: string;
  description: string;
  icon: string;
  match: (pathname: string) => boolean;
};

export const accountNavItems: AccountNavItem[] = [
  {
    href: "/account",
    label: "Overview",
    description: "Dashboard and quick actions",
    icon: "◉",
    match: (pathname) => pathname === "/account"
  },
  {
    href: "/account/orders",
    label: "Orders",
    description: "Track purchases and delivery",
    icon: "📦",
    match: (pathname) => pathname.startsWith("/account/orders")
  },
  {
    href: "/account/wishlist",
    label: "Wishlist",
    description: "Saved pieces for later",
    icon: "♥",
    match: (pathname) => pathname.startsWith("/account/wishlist")
  },
  {
    href: "/account/addresses",
    label: "Addresses",
    description: "Shipping and billing",
    icon: "📍",
    match: (pathname) => pathname.startsWith("/account/addresses")
  },
  {
    href: "/account/messages",
    label: "Messages",
    description: "Support conversations",
    icon: "💬",
    match: (pathname) => pathname.startsWith("/account/messages")
  }
];

export function getAccountPageMeta(pathname: string): {
  title: string;
  description: string;
} {
  const item = accountNavItems.find((entry) => entry.match(pathname));
  if (item) {
    return { title: item.label, description: item.description };
  }
  return {
    title: "Account",
    description: "Manage your Covmerc profile and activity"
  };
}

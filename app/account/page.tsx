"use client";

import Link from "next/link";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniButton } from "@/components/ui/FurniButton";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";

const shortcuts = [
  {
    href: "/account/orders",
    title: "Orders",
    description: "Track deliveries and payment status for every purchase."
  },
  {
    href: "/account/addresses",
    title: "Addresses",
    description: "Save home and office addresses for faster checkout."
  },
  {
    href: "/account/messages",
    title: "Messages",
    description: "Chat with Covmerc support about orders, products, or delivery."
  },
  {
    href: "/account/wishlist",
    title: "Wishlist",
    description: "Saved pieces you want to buy later—add them to cart in one tap."
  }
] as const;

export default function AccountOverviewPage() {
  const { currentUser } = useAuthSession();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {shortcuts.map((item) => (
        <Link key={item.href} href={item.href}>
          <FurniCard className="h-full transition hover:-translate-y-0.5">
            <h2 className="text-lg font-semibold text-furni-primary">{item.title}</h2>
            <p className="mt-2 text-sm text-furni-muted">{item.description}</p>
            <span className="mt-4 inline-block text-sm font-medium text-furni-primary">
              Open →
            </span>
          </FurniCard>
        </Link>
      ))}

      {currentUser?.userType === "vendor" ? (
        <FurniCard className="md:col-span-2 lg:col-span-4 bg-furni-primary text-white">
          <h2 className="font-display text-xl text-furni-accent">Vendor portal</h2>
          <p className="mt-2 text-sm text-white/85">
            Manage your product listings and vendor orders from the web dashboard.
          </p>
          <Link href="/vendor" className="mt-4 inline-block">
            <FurniButton variant="accent">Go to vendor portal</FurniButton>
          </Link>
        </FurniCard>
      ) : (
        <FurniCard className="md:col-span-2 lg:col-span-4">
          <h2 className="font-display text-xl text-furni-primary">Sell on Covmerc</h2>
          <p className="mt-2 text-sm text-furni-muted">
            Register as a vendor in the Covmerc mobile app to list products on the marketplace.
          </p>
        </FurniCard>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MarketingShell } from "@/components/layout/MarketingShell";
import { PageHero } from "@/components/content/PageHero";
import { RelatedPages } from "@/components/content/RelatedPages";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  CheckoutStepper,
  type CheckoutStep
} from "@/components/checkout/CheckoutStepper";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniInput } from "@/components/ui/FurniInput";
import { formatNgn } from "@/lib/format-currency";
import { relatedPageGroups } from "@/lib/site-content";
import type { CheckoutShipping } from "@/lib/furni-types";

export default function CheckoutPage() {
  const { cartCount, cartSubtotal, createOrder } = useFurniStore();
  const { currentUser, authLoading } = useAuthSession();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("Shipping");
  const [checkoutError, setCheckoutError] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [shippingDetails, setShippingDetails] = useState<CheckoutShipping>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zipCode: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [confirmedOrderId, setConfirmedOrderId] = useState("");

  useEffect(() => {
    if (!currentUser) return;
    setShippingDetails((current) => ({
      ...current,
      fullName: current.fullName || currentUser.name,
      email: current.email || currentUser.email
    }));
  }, [currentUser]);

  function handleShippingSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCurrentStep("Payment");
  }

  async function handlePaymentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckoutError("");
    setSubmittingOrder(true);

    try {
      const nextOrderId = await createOrder(shippingDetails, paymentMethod);
      setConfirmedOrderId(nextOrderId);
      setCurrentStep("Confirmation");
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Unable to place your order."
      );
    } finally {
      setSubmittingOrder(false);
    }
  }

  return (
    <MarketingShell maxWidth="4xl">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" }
        ]}
      />

      <PageHero
        eyebrow="Secure checkout"
        title="Complete your order"
        description="Enter delivery details, choose how you would like to pay, and we will confirm your order by email."
      />

      <CheckoutStepper currentStep={currentStep} />

      {authLoading ? (
        <FurniCard className="mt-8">
          <p className="text-sm text-furni-muted">Loading your account…</p>
        </FurniCard>
      ) : null}

      {!authLoading && !currentUser ? (
        <FurniCard className="mt-8">
          <h2 className="font-display text-xl text-furni-primary">Sign in to continue</h2>
          <p className="mt-2 text-sm leading-relaxed text-furni-muted">
            Browse freely without an account. To place an order and track delivery, sign in or
            create a Covmerc account—it takes less than a minute.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/auth/login?next=/checkout">
              <FurniButton variant="accent">Sign in</FurniButton>
            </Link>
            <Link href="/auth/register?next=/checkout">
              <FurniButton variant="outline">Create account</FurniButton>
            </Link>
          </div>
        </FurniCard>
      ) : null}

      {cartCount === 0 && currentStep !== "Confirmation" ? (
        <EmptyState
          className="mt-8"
          title="Your cart is empty"
          description="Add items from the shop before checking out."
        >
          <Link href="/shop">
            <FurniButton variant="accent">Browse shop</FurniButton>
          </Link>
        </EmptyState>
      ) : null}

      {!authLoading && currentUser && currentStep === "Shipping" && cartCount > 0 ? (
        <FurniCard className="mt-8">
          <form className="grid gap-3" onSubmit={handleShippingSubmit}>
            <h2 className="font-display text-xl text-furni-primary">Shipping information</h2>
            <p className="text-sm text-furni-muted">
              We deliver across Nigeria. Double-check your phone number for delivery updates.
            </p>
            <FurniInput
              required
              label="Full name"
              value={shippingDetails.fullName}
              onChange={(event) =>
                setShippingDetails((current) => ({
                  ...current,
                  fullName: event.target.value
                }))
              }
            />
            <FurniInput
              required
              type="email"
              label="Email"
              value={shippingDetails.email}
              onChange={(event) =>
                setShippingDetails((current) => ({
                  ...current,
                  email: event.target.value
                }))
              }
            />
            <FurniInput
              required
              type="tel"
              label="Phone number"
              value={shippingDetails.phone ?? ""}
              onChange={(event) =>
                setShippingDetails((current) => ({
                  ...current,
                  phone: event.target.value
                }))
              }
            />
            <FurniInput
              required
              label="Street address"
              value={shippingDetails.address}
              onChange={(event) =>
                setShippingDetails((current) => ({
                  ...current,
                  address: event.target.value
                }))
              }
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <FurniInput
                required
                label="City"
                value={shippingDetails.city}
                onChange={(event) =>
                  setShippingDetails((current) => ({
                    ...current,
                    city: event.target.value
                  }))
                }
              />
              <FurniInput
                required
                label="Country"
                value={shippingDetails.country}
                onChange={(event) =>
                  setShippingDetails((current) => ({
                    ...current,
                    country: event.target.value
                  }))
                }
              />
              <FurniInput
                required
                label="Postal code"
                value={shippingDetails.zipCode}
                onChange={(event) =>
                  setShippingDetails((current) => ({
                    ...current,
                    zipCode: event.target.value
                  }))
                }
              />
            </div>
            <FurniButton type="submit" variant="accent" className="mt-2 w-max">
              Continue to payment
            </FurniButton>
          </form>
        </FurniCard>
      ) : null}

      {!authLoading && currentUser && currentStep === "Payment" ? (
        <FurniCard className="mt-8">
          <form className="grid gap-4" onSubmit={handlePaymentSubmit}>
            <h2 className="font-display text-xl text-furni-primary">Payment method</h2>
            <label className="text-sm text-furni-muted">
              Choose method
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="mt-1 w-full rounded-xl border border-furni-primary/20 bg-white px-3 py-2.5 text-furni-ink"
              >
                <option>Card</option>
                <option>Bank Transfer</option>
                <option>Pay on Delivery</option>
              </select>
            </label>
            <p className="rounded-xl bg-furni-surface p-4 text-sm text-furni-muted">
              Order total:{" "}
              <span className="text-lg font-semibold text-furni-primary">
                {formatNgn(cartSubtotal)}
              </span>
            </p>
            {checkoutError ? (
              <p className="text-sm text-furni-danger">{checkoutError}</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <FurniButton
                type="button"
                variant="outline"
                onClick={() => setCurrentStep("Shipping")}
              >
                Back
              </FurniButton>
              <FurniButton type="submit" variant="accent" disabled={submittingOrder}>
                {submittingOrder ? "Placing order…" : "Confirm order"}
              </FurniButton>
            </div>
          </form>
        </FurniCard>
      ) : null}

      {currentUser && currentStep === "Confirmation" ? (
        <FurniCard className="mt-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-furni-accent">
            Thank you
          </p>
          <h2 className="mt-2 font-display text-2xl text-furni-primary">Order confirmed</h2>
          <p className="mt-3 text-sm leading-relaxed text-furni-muted">
            {shippingDetails.fullName}, your order{" "}
            <span className="font-semibold text-furni-primary">{confirmedOrderId}</span> has been
            placed. A confirmation will be sent to {shippingDetails.email}.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link href="/account/orders">
              <FurniButton variant="accent">View your orders</FurniButton>
            </Link>
            <Link href="/shop">
              <FurniButton variant="outline">Continue shopping</FurniButton>
            </Link>
            {currentUser?.userType === "admin" ? (
              <Link href="/admin/orders">
                <FurniButton variant="ghost">Admin orders</FurniButton>
              </Link>
            ) : null}
          </div>
        </FurniCard>
      ) : null}

      <RelatedPages
        className="mt-12"
        title="Need help?"
        links={relatedPageGroups.help}
      />
    </MarketingShell>
  );
}

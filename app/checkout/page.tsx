"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
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
import { orderGrandTotal } from "@/lib/shipping";
import { relatedPageGroups } from "@/lib/site-content";
import type { CheckoutShipping } from "@/lib/furni-types";
import { isPaystackEnabledClient } from "@/lib/paystack-client";

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const { cartCount, cartSubtotal, createOrder, estimateDeliveryFee } = useFurniStore();
  const { currentUser, authLoading } = useAuthSession();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("Shipping");
  const [checkoutError, setCheckoutError] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [shippingDetails, setShippingDetails] = useState<CheckoutShipping>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "Lagos",
    country: "Nigeria",
    zipCode: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [confirmedOrderId, setConfirmedOrderId] = useState("");
  const [checkoutAsGuest, setCheckoutAsGuest] = useState(true);

  const deliveryFee = useMemo(
    () => estimateDeliveryFee(shippingDetails.city),
    [estimateDeliveryFee, shippingDetails.city]
  );
  const orderTotal = orderGrandTotal(cartSubtotal, deliveryFee);

  useEffect(() => {
    if (!currentUser) return;
    setCheckoutAsGuest(false);
    setShippingDetails((current) => ({
      ...current,
      fullName: current.fullName || currentUser.name,
      email: current.email || currentUser.email
    }));
  }, [currentUser]);

  useEffect(() => {
    const paystackFlow = searchParams.get("paystack");
    const reference = searchParams.get("reference");
    if (paystackFlow !== "verify" || !reference) return;

    const savedShipping = window.sessionStorage.getItem("covmerc-checkout-shipping");
    const savedPayment = window.sessionStorage.getItem("covmerc-checkout-payment") ?? "Card";

    if (!savedShipping) {
      setCheckoutError("Checkout session expired. Please try again.");
      return;
    }

    const shipping = JSON.parse(savedShipping) as CheckoutShipping;

    void (async () => {
      setSubmittingOrder(true);
      setCheckoutError("");

      try {
        const verifyResponse = await fetch(
          `/api/paystack/verify?reference=${encodeURIComponent(reference)}`
        );
        const verifyPayload = (await verifyResponse.json()) as {
          paid?: boolean;
          error?: string;
        };

        if (!verifyResponse.ok || !verifyPayload.paid) {
          throw new Error(verifyPayload.error ?? "Payment was not completed.");
        }

        const orderId = await createOrder(shipping, savedPayment, {
          paystackReference: reference
        });
        window.sessionStorage.removeItem("covmerc-checkout-shipping");
        window.sessionStorage.removeItem("covmerc-checkout-payment");
        setConfirmedOrderId(orderId);
        setShippingDetails(shipping);
        setCurrentStep("Confirmation");
      } catch (error) {
        setCheckoutError(
          error instanceof Error ? error.message : "Unable to complete your order."
        );
        setCurrentStep("Payment");
      } finally {
        setSubmittingOrder(false);
      }
    })();
  }, [searchParams, createOrder]);

  function handleShippingSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCurrentStep("Payment");
  }

  async function placeOrder(paystackReference?: string) {
    const orderId = await createOrder(shippingDetails, paymentMethod, { paystackReference });
    setConfirmedOrderId(orderId);
    setCurrentStep("Confirmation");
  }

  async function handlePaymentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCheckoutError("");
    setSubmittingOrder(true);

    try {
      const usePaystack = paymentMethod === "Card" && isPaystackEnabledClient();

      if (usePaystack) {
        window.sessionStorage.setItem(
          "covmerc-checkout-shipping",
          JSON.stringify(shippingDetails)
        );
        window.sessionStorage.setItem("covmerc-checkout-payment", paymentMethod);

        const reference = `covmerc_${Date.now()}`;
        const initResponse = await fetch("/api/paystack/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: shippingDetails.email,
            amountNgn: orderTotal,
            reference,
            metadata: { source: "web_checkout" }
          })
        });

        const initPayload = (await initResponse.json()) as {
          authorizationUrl?: string;
          error?: string;
        };

        if (!initResponse.ok || !initPayload.authorizationUrl) {
          throw new Error(initPayload.error ?? "Unable to start card payment.");
        }

        window.location.href = initPayload.authorizationUrl;
        return;
      }

      await placeOrder();
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Unable to place your order."
      );
    } finally {
      setSubmittingOrder(false);
    }
  }

  const canCheckout = cartCount > 0 && (Boolean(currentUser) || checkoutAsGuest);
  const showShipping = canCheckout && currentStep === "Shipping";
  const showPayment = canCheckout && currentStep === "Payment";
  const isGuestOrder = checkoutAsGuest || !currentUser;

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
        description="Checkout as a guest or with your Covmerc account. Delivery fees are calculated from your city."
      />

      <CheckoutStepper currentStep={currentStep} />

      {authLoading ? (
        <FurniCard className="mt-8">
          <p className="text-sm text-furni-muted">Loading your account…</p>
        </FurniCard>
      ) : null}

      {!authLoading && !currentUser && currentStep !== "Confirmation" ? (
        <FurniCard className="mt-8">
          <h2 className="font-display text-xl text-furni-primary">How would you like to checkout?</h2>
          <p className="mt-2 text-sm text-furni-muted">
            Guest checkout is available. Sign in to save your order history and track delivery.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <FurniButton
              type="button"
              variant={checkoutAsGuest ? "accent" : "outline"}
              onClick={() => setCheckoutAsGuest(true)}
            >
              Continue as guest
            </FurniButton>
            <Link href="/auth/login?next=/checkout">
              <FurniButton variant={checkoutAsGuest ? "outline" : "accent"}>Sign in</FurniButton>
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

      {showShipping ? (
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
            <p className="text-sm text-furni-muted">
              Estimated delivery: {formatNgn(deliveryFee)}
              {deliveryFee === 0 ? " (free on large orders)" : ""}
            </p>
            <FurniButton type="submit" variant="accent" className="mt-2 w-max">
              Continue to payment
            </FurniButton>
          </form>
        </FurniCard>
      ) : null}

      {showPayment ? (
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
            {paymentMethod === "Card" && !isPaystackEnabledClient() ? (
              <p className="rounded-xl bg-furni-warning/10 p-3 text-sm text-furni-muted">
                Card payments will be confirmed manually until Paystack keys are configured.
              </p>
            ) : null}
            <div className="rounded-xl bg-furni-surface p-4 text-sm text-furni-muted space-y-1">
              <p className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatNgn(cartSubtotal)}</span>
              </p>
              <p className="flex justify-between">
                <span>Delivery</span>
                <span>{formatNgn(deliveryFee)}</span>
              </p>
              <p className="flex justify-between border-t border-furni-primary/10 pt-2 text-base font-semibold text-furni-primary">
                <span>Total</span>
                <span>{formatNgn(orderTotal)}</span>
              </p>
            </div>
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
                {submittingOrder
                  ? "Processing…"
                  : paymentMethod === "Card" && isPaystackEnabledClient()
                    ? "Pay with card"
                    : "Confirm order"}
              </FurniButton>
            </div>
          </form>
        </FurniCard>
      ) : null}

      {currentStep === "Confirmation" ? (
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
            {!isGuestOrder ? (
              <Link href="/account/orders">
                <FurniButton variant="accent">View your orders</FurniButton>
              </Link>
            ) : null}
            <Link href="/shop">
              <FurniButton variant={isGuestOrder ? "accent" : "outline"}>Continue shopping</FurniButton>
            </Link>
            {currentUser?.userType === "admin" ? (
              <Link href="/admin/orders">
                <FurniButton variant="ghost">Admin orders</FurniButton>
              </Link>
            ) : null}
          </div>
        </FurniCard>
      ) : null}

      <RelatedPages className="mt-12" title="Need help?" links={relatedPageGroups.help} />
    </MarketingShell>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <MarketingShell maxWidth="4xl">
          <p className="text-sm text-furni-muted">Loading checkout…</p>
        </MarketingShell>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}

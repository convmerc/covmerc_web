"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { useFurniStore } from "@/components/providers/FurniStoreProvider";
import { useAuthSession } from "@/components/providers/AuthSessionProvider";
import { FurniButton } from "@/components/ui/FurniButton";
import { FurniCard } from "@/components/ui/FurniCard";
import { FurniInput } from "@/components/ui/FurniInput";
import { formatNgn } from "@/lib/format-currency";
import type { CheckoutShipping } from "@/lib/furni-types";

const steps = ["Shipping", "Payment", "Confirmation"] as const;
type CheckoutStep = (typeof steps)[number];

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

  const stepIndex = useMemo(() => steps.indexOf(currentStep), [currentStep]);

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
    <div className="flex min-h-screen flex-col bg-furni-surface">
      <TopNav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 md:px-6">
        <h1 className="text-4xl font-semibold text-furni-primary">Checkout</h1>

        <div className="mt-6 flex flex-wrap gap-2">
          {steps.map((step, index) => (
            <span
              key={step}
              className={`rounded-full px-3 py-1 text-xs font-medium ${index <= stepIndex ? "bg-furni-primary text-white" : "bg-white text-furni-muted ring-1 ring-furni-primary/15"}`}
            >
              {index + 1}. {step}
            </span>
          ))}
        </div>

        {authLoading ? (
          <FurniCard className="mt-6">
            <p className="text-sm text-furni-muted">Loading your account...</p>
          </FurniCard>
        ) : null}

        {!authLoading && !currentUser ? (
          <FurniCard className="mt-6">
            <h2 className="text-xl font-semibold text-furni-primary">Authentication Required</h2>
            <p className="mt-2 text-sm text-furni-muted">
              You can browse all products without signing in. Please authenticate to
              continue with checkout.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/auth/login?next=/checkout">
                <FurniButton>Sign in to continue</FurniButton>
              </Link>
              <Link href="/auth/register?next=/checkout">
                <FurniButton variant="outline">Create account</FurniButton>
              </Link>
            </div>
          </FurniCard>
        ) : null}

        {cartCount === 0 && currentStep !== "Confirmation" ? (
          <FurniCard className="mt-6">
            <p className="text-sm text-furni-muted">
              Your cart is empty. Add products before checking out.
            </p>
            <Link href="/shop" className="mt-3 inline-block">
              <FurniButton>Browse products</FurniButton>
            </Link>
          </FurniCard>
        ) : null}

        {!authLoading && currentUser && currentStep === "Shipping" && cartCount > 0 ? (
          <FurniCard className="mt-6">
            <form className="grid gap-3" onSubmit={handleShippingSubmit}>
              <h2 className="text-xl font-semibold text-furni-primary">
                Shipping Information
              </h2>
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
                label="Address"
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
                  label="Zip code"
                  value={shippingDetails.zipCode}
                  onChange={(event) =>
                    setShippingDetails((current) => ({
                      ...current,
                      zipCode: event.target.value
                    }))
                  }
                />
              </div>
              <FurniButton type="submit" className="mt-2 w-max">
                Continue to payment
              </FurniButton>
            </form>
          </FurniCard>
        ) : null}

        {!authLoading && currentUser && currentStep === "Payment" ? (
          <FurniCard className="mt-6">
            <form className="grid gap-4" onSubmit={handlePaymentSubmit}>
              <h2 className="text-xl font-semibold text-furni-primary">Payment Method</h2>
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
              <p className="rounded-xl bg-furni-surface p-3 text-sm text-furni-muted">
                Total to pay: <span className="font-semibold text-furni-primary">{formatNgn(cartSubtotal)}</span>
              </p>
              {checkoutError ? (
                <p className="text-sm text-furni-danger">{checkoutError}</p>
              ) : null}
              <div className="flex gap-2">
                <FurniButton
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep("Shipping")}
                >
                  Back
                </FurniButton>
                <FurniButton type="submit" variant="accent" disabled={submittingOrder}>
                  {submittingOrder ? "Placing order..." : "Confirm order"}
                </FurniButton>
              </div>
            </form>
          </FurniCard>
        ) : null}

        {currentUser && currentStep === "Confirmation" ? (
          <FurniCard className="mt-6 text-center">
            <h2 className="text-2xl font-semibold text-furni-primary">
              Order Confirmed
            </h2>
            <p className="mt-2 text-sm text-furni-muted">
              Thank you, {shippingDetails.fullName}. Your order{" "}
              <span className="font-semibold text-furni-primary">{confirmedOrderId}</span>{" "}
              has been placed successfully.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <Link href="/account/orders">
                <FurniButton>View your orders</FurniButton>
              </Link>
              <Link href="/shop">
                <FurniButton variant="outline">Continue shopping</FurniButton>
              </Link>
              {currentUser?.userType === "admin" ? (
                <Link href="/admin/orders">
                  <FurniButton variant="outline">View in admin</FurniButton>
                </Link>
              ) : null}
            </div>
          </FurniCard>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}

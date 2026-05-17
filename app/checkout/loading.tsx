import { MarketingShell } from "@/components/layout/MarketingShell";
import { LoadingState } from "@/components/ui/LoadingState";

export default function CheckoutLoading() {
  return (
    <MarketingShell maxWidth="4xl">
      <LoadingState variant="checkout" message="Loading checkout…" />
    </MarketingShell>
  );
}

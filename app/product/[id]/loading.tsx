import { MarketingShell } from "@/components/layout/MarketingShell";
import { LoadingState } from "@/components/ui/LoadingState";

export default function ProductLoading() {
  return (
    <MarketingShell maxWidth="6xl">
      <LoadingState message="Loading product…" />
    </MarketingShell>
  );
}

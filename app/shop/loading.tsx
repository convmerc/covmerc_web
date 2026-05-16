import { MarketingShell } from "@/components/layout/MarketingShell";
import { LoadingState } from "@/components/ui/LoadingState";

export default function ShopLoading() {
  return (
    <MarketingShell maxWidth="6xl" flush>
      <LoadingState variant="grid" message="Loading catalog…" count={6} />
    </MarketingShell>
  );
}

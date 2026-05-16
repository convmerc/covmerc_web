import type { FurniOrderStatus } from "@/lib/furni-types";

const styles: Record<FurniOrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-sky-100 text-sky-800",
  Processing: "bg-furni-primary/15 text-furni-primary",
  Shipped: "bg-violet-100 text-violet-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-red-100 text-red-700",
  Returned: "bg-slate-200 text-slate-700"
};

export function OrderStatusBadge({ status }: { status: FurniOrderStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${styles[status]}`}
    >
      {status}
    </span>
  );
}

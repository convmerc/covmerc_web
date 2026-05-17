"use client";

import { useParams } from "next/navigation";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminOrderDetail } from "@/components/admin/AdminOrderDetail";

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();

  return (
    <AdminLayout
      title="Order detail"
      subtitle="Review line items, delivery details, and update fulfillment status."
    >
      <AdminOrderDetail orderId={params.id} />
    </AdminLayout>
  );
}

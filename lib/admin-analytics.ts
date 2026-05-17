import type { FurniOrder } from "@/lib/furni-types";

export type WeeklyBar = {
  label: string;
  value: number;
  amount: number;
  heightPercent: number;
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function parseOrderDate(createdAt: string): Date | null {
  const parsed = Date.parse(createdAt);
  if (Number.isFinite(parsed)) {
    return new Date(parsed);
  }
  return null;
}

/** Last 7 calendar days of order count and revenue (local timezone). */
export function weeklyOrderBars(orders: FurniOrder[]): WeeklyBar[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const buckets = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - index));
    return {
      date: day,
      label: DAY_LABELS[day.getDay()],
      value: 0,
      amount: 0
    };
  });

  for (const order of orders) {
    const orderDate = parseOrderDate(order.createdAt);
    if (!orderDate) continue;

    const normalized = new Date(orderDate);
    normalized.setHours(0, 0, 0, 0);

    const bucket = buckets.find(
      (entry) => entry.date.getTime() === normalized.getTime()
    );
    if (!bucket) continue;

    bucket.value += 1;
    bucket.amount += order.total;
  }

  const maxCount = Math.max(1, ...buckets.map((entry) => entry.value));

  return buckets.map((entry) => ({
    label: entry.label,
    value: entry.value,
    amount: entry.amount,
    heightPercent: Math.round((entry.value / maxCount) * 100)
  }));
}

export function countOrdersByStatus(orders: FurniOrder[]) {
  return orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.status] = (acc[order.status] ?? 0) + 1;
    return acc;
  }, {});
}

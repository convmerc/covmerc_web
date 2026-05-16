type StockBadgeProps = {
  stock: number;
};

export function StockBadge({ stock }: StockBadgeProps) {
  if (stock <= 0) {
    return (
      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        Out of stock
      </span>
    );
  }

  if (stock <= 3) {
    return (
      <span className="inline-flex rounded-full bg-furni-warning/20 px-3 py-1 text-xs font-semibold text-furni-warning">
        Only {stock} left
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-furni-success/20 px-3 py-1 text-xs font-semibold text-furni-success">
      In stock
    </span>
  );
}

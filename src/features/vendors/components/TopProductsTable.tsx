import CommonTable from "../../../shared/components/common/CommonTable";
import type { TopProductRow } from "../types/vendor.types";

export default function TopProductsTable({
  products,
}: {
  products: TopProductRow[];
}) {
  const data = products.map((product) => [
    <div key="product">
      <p className="text-ink">{product.name}</p>
      <p className="text-[11px] text-ink/40">{product.meta}</p>
    </div>,
    product.sold,
    product.revenue,
    <span
      key="stock"
      className={`rounded-full px-2 py-0.5 text-[10.5px] ${product.stock === "Good" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
    >
      {product.stock}
    </span>,
  ]);
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5">
      <h2 className="text-sm font-semibold text-ink mb-4">Top products</h2>
      <CommonTable
        headers={["Product", "Unit sold", "Revenue", "Stock"]}
        data={data}
        minWidth={520}
      />
    </div>
  );
}

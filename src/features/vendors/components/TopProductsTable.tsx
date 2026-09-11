import type { TopProductRow } from "../types/vendor.types";

interface TopProductsTableProps {
    products: TopProductRow[];
}

export default function TopProductsTable({ products }: TopProductsTableProps) {
    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5 overflow-x-auto">
            <h2 className="text-sm font-semibold text-ink mb-4">Top products</h2>
            <table className="w-full text-[12.5px] min-w-[420px]">
                <thead>
                    <tr className="text-left text-ink/30 text-[10.5px] uppercase tracking-wide border-b border-black/5">
                        <th className="pb-2.5">Product</th>
                        <th className="pb-2.5">Unit sold</th>
                        <th className="pb-2.5">Revenue</th>
                        <th className="pb-2.5">Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr
                            key={index}
                            className="border-b border-black/5 last:border-0"
                        >
                            <td className="py-3">
                                <p className="text-ink">{product.name}</p>
                                <p className="text-[11px] text-ink/40">{product.meta}</p>
                            </td>
                            <td className="py-3 text-ink/60">{product.sold}</td>
                            <td className="py-3 text-ink">{product.revenue}</td>
                            <td className="py-3">
                                <span
                                    className={`px-2 py-0.5 rounded-full text-[10.5px] ${
                                        product.stock === "Good"
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "bg-amber-50 text-amber-600"
                                    }`}
                                >
                                    {product.stock}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

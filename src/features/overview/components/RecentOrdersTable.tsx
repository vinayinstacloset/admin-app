import { Link } from "react-router-dom";
import StatusBadge from "../../../shared/components/common/StatusBadge";
import type { RecentOrderRow } from "../types/overview.types";

interface RecentOrdersTableProps {
    orders: RecentOrderRow[];
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5 overflow-x-auto">
            <h2 className="text-sm font-semibold text-ink mb-4">Recent orders</h2>
            <table className="w-full text-[12.5px] min-w-[560px]">
                <thead>
                    <tr className="text-left text-ink/30 text-[10.5px] uppercase tracking-wide border-b border-black/5">
                        <th className="pb-2.5">Order</th>
                        <th className="pb-2.5">Customer</th>
                        <th className="pb-2.5">Vendor</th>
                        <th className="pb-2.5">Rider</th>
                        <th className="pb-2.5">Amount</th>
                        <th className="pb-2.5">Status</th>
                        <th className="pb-2.5 text-right">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr
                            key={`${order.id}-${index}`}
                            className="border-b border-black/5 last:border-0"
                        >
                            <td className="py-3 text-ink">{order.id}</td>
                            <td className="py-3 text-ink/60">{order.customer}</td>
                            <td className="py-3 text-ink/60">{order.vendor}</td>
                            <td className="py-3 text-ink/60">{order.rider}</td>
                            <td className="py-3 text-ink">{order.amount}</td>
                            <td className="py-3">
                                <StatusBadge status={order.status} />
                            </td>
                            <td className="py-3 text-right">
                                <Link
                                    to="/admin-dashboard/orders/OD-5490"
                                    className="inline-flex px-3 py-1 rounded-md border border-black/10 text-[11px] text-ink/60 hover:bg-cream"
                                >
                                    View
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

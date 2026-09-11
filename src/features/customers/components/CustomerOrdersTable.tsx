import { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import type { CustomerOrderRow } from "../types/customer.types";

interface CustomerOrdersTableProps {
    orders: CustomerOrderRow[];
}

export default function CustomerOrdersTable({ orders }: CustomerOrdersTableProps) {
    const [query, setQuery] = useState("");

    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5 overflow-x-auto">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-sm font-semibold text-ink">Orders</h2>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search
                            size={13}
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/30"
                        />
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search order id"
                            className="h-8 pl-8 pr-3 rounded-md border border-black/10 text-xs w-40 outline-none focus:ring-2 focus:ring-brand-100"
                        />
                    </div>
                    <button
                        type="button"
                        className="h-8 w-8 rounded-md border border-black/10 flex items-center justify-center text-ink/40 hover:text-ink/70"
                    >
                        <Filter size={13} />
                    </button>
                    <button
                        type="button"
                        className="h-8 px-3 rounded-md border border-black/10 flex items-center gap-1 text-xs text-ink/50"
                    >
                        Newest first <ChevronDown size={12} />
                    </button>
                </div>
            </div>
            <table className="w-full text-[12.5px] min-w-[560px]">
                <thead>
                    <tr className="text-left text-ink/30 text-[10.5px] uppercase tracking-wide border-b border-black/5">
                        <th className="pb-2.5">Order ID</th>
                        <th className="pb-2.5">Items</th>
                        <th className="pb-2.5">Order Date</th>
                        <th className="pb-2.5">Item details</th>
                        <th className="pb-2.5">Amount</th>
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
                            <td className="py-3 text-ink/60">{order.items}</td>
                            <td className="py-3 text-ink/60">{order.date}</td>
                            <td className="py-3 text-ink/60">{order.details}</td>
                            <td className="py-3 text-ink">{order.amount}</td>
                            <td className="py-3 text-right">
                                <button
                                    type="button"
                                    className="inline-flex px-3 py-1 rounded-md border border-black/10 text-[11px] text-ink/60 hover:bg-cream"
                                >
                                    View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

import { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import CommonTable from "../../../shared/components/common/CommonTable";
import type { CustomerOrderRow } from "../types/customer.types";

export default function CustomerOrdersTable({
  orders,
}: {
  orders: CustomerOrderRow[];
}) {
  const [query, setQuery] = useState("");
  const visible = orders.filter((order) =>
    order.id.toLowerCase().includes(query.toLowerCase()),
  );
  const data = visible.map((order, index) => [
    order.id,
    order.items,
    order.date,
    order.details,
    order.amount,
    <button
      key="view"
      type="button"
      className="inline-flex rounded-md border border-black/10 px-3 py-1 text-[11px] text-ink/60 hover:bg-cream"
    >
      View
    </button>,
  ]);
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5">
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order id"
              className="h-8 pl-8 pr-3 rounded-md border border-black/10 text-xs w-40 outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <button
            type="button"
            className="h-8 w-8 rounded-md border border-black/10 flex items-center justify-center text-ink/40"
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
      <CommonTable
        headers={[
          "Order ID",
          "Items",
          "Order Date",
          "Item details",
          "Amount",
          "Action",
        ]}
        data={data}
        rowKeys={visible.map((o, i) => `${o.id}-${i}`)}
        minWidth={760}
      />
    </div>
  );
}

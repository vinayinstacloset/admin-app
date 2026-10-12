import { Link } from "react-router-dom";
import StatusBadge from "../../../shared/components/common/StatusBadge";
import CommonTable from "../../../shared/components/common/CommonTable";
import type { RecentOrderRow } from "../types/overview.types";

export default function RecentOrdersTable({
  orders,
}: {
  orders: RecentOrderRow[];
}) {
  const headers = [
    "Order",
    "Customer",
    "Vendor",
    "Rider",
    "Amount",
    "Status",
    "Action",
  ];
  const data = orders.map((order) => [
    order.id,
    order.customer,
    order.vendor,
    order.rider,
    order.amount,
    <StatusBadge key="status" status={order.status} />,
    <Link
      key="view"
      to="/admin-dashboard/orders/OD-5490"
      className="inline-flex rounded-md border border-black/10 px-3 py-1 text-[11px] text-ink/60 hover:bg-cream"
    >
      View
    </Link>,
  ]);
  return (
    <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5">
      <h2 className="text-sm font-semibold text-ink mb-4">Recent orders</h2>
      <CommonTable
        headers={headers}
        data={data}
        rowKeys={orders.map((o) => o.id)}
        minWidth={760}
      />
    </div>
  );
}

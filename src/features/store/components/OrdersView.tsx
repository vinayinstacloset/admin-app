import { ChevronDown, Filter, MapPin, PackageOpen, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreOrders } from "../hooks";
import type { OrderStatus } from "../types/store.types";
import { formatCurrency } from "../utils/store.utils";
import { classNames } from "./StoreCommon";
import CommonTable from "../../../shared/components/common/CommonTable";
import OrderConfirmModal from "../../orders/components/OrderConfirmModal";
import RejectOrderModal from "../../orders/components/RejectOrderModal";
import AssignRiderModal from "../../orders/components/AssignRiderModal";
import { setOrderRejectionReason, setOrderStatus } from "../../orders/orderState";

const orderTabs: Array<"All" | OrderStatus> = ["All", "New", "Packing", "Ready", "On the way", "Delivered", "Rejected"];

function statusClass(status: OrderStatus) {
  const map: Record<OrderStatus, string> = {
    New: "bg-[#eaf4ff] text-[#1882e9]",
    Packing: "bg-[#fff8dc] text-[#e6bc00]",
    Ready: "bg-[#eaf9ef] text-[#20ad60]",
    "On the way": "bg-[#f1e7ff] text-[#9749df]",
    Delivered: "bg-[#eaf9ef] text-[#20ad60]",
    Rejected: "bg-[#fff0f0] text-[#ef6b6b]",
  };
  return map[status];
}

function OrdersDateDropdown() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Today");
  const options = ["Today", "Yesterday", "This week"];
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((current) => !current)} className="flex h-9 min-w-[75px] items-center justify-between gap-2 rounded-md bg-white px-3 text-[10px] font-semibold shadow-sm">
        {value}
        <ChevronDown size={13} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-[80] min-w-[120px] rounded-md bg-white p-1 shadow-xl ring-1 ring-black/5">
          {options.map((option) => (
            <button key={option} type="button" onClick={() => { setValue(option); setOpen(false); }} className={classNames("block w-full rounded px-3 py-2 text-left text-[10px]", option === value ? "bg-[#eeeae6] font-semibold" : "hover:bg-[#f7f5f2]")}>{option}</button>
          ))}
        </div>
      )}
    </div>
  );
}

export function OrdersView({ showTitle = true, source }: { showTitle?: boolean; source?: { label: string; to: string; parentLabel?: string; parentTo?: string; rootLabel?: string; rootTo?: string } } = {}) {
  const { filteredOrders, search, setSearch, status, setStatus } = useStoreOrders();
  const navigate = useNavigate();
  const [localOrders, setLocalOrders] = useState(filteredOrders);
  const [rejectRow, setRejectRow] = useState<typeof filteredOrders[number] | null>(null);
  const [confirmRow, setConfirmRow] = useState<typeof filteredOrders[number] | null>(null);
  const [reassignRow, setReassignRow] = useState<typeof filteredOrders[number] | null>(null);

  useEffect(() => setLocalOrders(filteredOrders), [filteredOrders]);

  const updateLocalStatus = (id: string, next: OrderStatus) => {
    setLocalOrders((current) => current.map((item) => item.id === id ? { ...item, status: next, action: next === "Packing" ? "-" : item.action } : item));
    setOrderStatus(id, next);
  };

  return (
    <div>
      <div className="mt-2 mb-2 flex flex-wrap items-end justify-between gap-3">
        <div className="flex items-center gap-5 border-b border-black/10">
          {orderTabs.map((tab) => (
            <button key={tab} type="button" onClick={() => setStatus(tab)} className={classNames("relative pb-2 text-[13px] font-semibold", status === tab ? "text-[#76533d]" : "text-ink/35")}>
              {tab}
              {status === tab && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#76533d]" />}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search order id, customer name..." className="h-9 w-[300px] rounded-md bg-white pl-9 pr-3 text-[10px] outline-none" />
          </div>
          <Filter size={17} className="text-ink/65" />
          <OrdersDateDropdown />
        </div>
      </div>

      <CommonTable
        headers={["ORDER", "CUSTOMER", "RIDER", "ITEM", "STATUS", "AMOUNT", "ACTION"]}
        data={localOrders.map((order) => [
          <div key="order"><p className="text-[12px] font-bold">{order.id}</p><p className="mt-1 text-[9px] text-ink/50">{order.items}</p></div>,
          <div key="customer"><p className="text-[10px] font-semibold">{order.customer}</p><p className="mt-1 flex items-center gap-1 text-[9px] text-ink/50"><MapPin size={10} /> {order.customerLocation}</p></div>,
          order.rider === "-" ? "-" : <span key="rider" className="flex items-center gap-2"><img src="https://i.pravatar.cc/32?img=12" alt="" className="h-7 w-7 rounded-full" />{order.rider}</span>,
          <div key="item"><p className="max-w-[260px] text-[10px]">{order.itemSummary}</p><p className="mt-1 flex items-center gap-1 text-[9px] text-ink/50"><PackageOpen size={10} />{order.itemCounts}</p></div>,
          <span key="status" className={classNames("rounded-full px-3 py-1.5 text-[9px] font-semibold", statusClass(order.status))}>{order.status}</span>,
          <div key="amount"><p className="text-[12px] font-bold">{formatCurrency(order.amount)}</p><button type="button" onClick={() => navigate(`/admin-dashboard/orders/${order.id.replace("#", "")}`, { state: { source: source ?? { label: "Store", to: "/admin-dashboard/store" }, status: order.status, riderState: order.rider === "-" ? "not-accepted" : order.action.includes("ETA") ? "on-way" : "reached", row: order } })} className="mt-1 inline-block text-[9px] font-semibold text-blue-600 underline">View details</button></div>,
          order.status === "New" ? <div key="action" className="flex gap-2"><button type="button" onClick={() => setRejectRow(order)} className="rounded-md bg-[#ed7174] px-4 py-2 text-[9px] font-semibold text-white">Reject</button><button type="button" onClick={() => setConfirmRow(order)} className="rounded-md bg-[#27b967] px-4 py-2 text-[9px] font-semibold text-white">Accept</button></div> : order.status === "On the way" ? <button key="action" type="button" onClick={() => setReassignRow(order)} className="rounded-md border border-[#8b5e3c] bg-white px-4 py-2 text-[9px] font-semibold text-[#8b5e3c]">Reassign Rider</button> : <span key="action" className="text-[9px] text-ink/60">{order.action || "-"}</span>,
        ])}
        rowKeys={localOrders.map((order, index) => `${order.id}-${order.status}-${index}`)}
        minWidth={1080}
      />

      <OrderConfirmModal open={Boolean(confirmRow)} title="Accept order" message="Are you sure you want to accept this order?" tone="green" onClose={() => setConfirmRow(null)} onConfirm={() => { if (confirmRow) updateLocalStatus(confirmRow.id, "Packing"); setConfirmRow(null); }} />
      <RejectOrderModal open={Boolean(rejectRow)} orderId={rejectRow?.id} onClose={() => setRejectRow(null)} onConfirm={(reason) => { if (rejectRow) { setOrderRejectionReason(rejectRow.id, reason); updateLocalStatus(rejectRow.id, "Rejected"); } setRejectRow(null); }} />
      <AssignRiderModal open={Boolean(reassignRow)} title="Reassign rider" onClose={() => setReassignRow(null)} onConfirm={(rider) => { if (reassignRow) setLocalOrders((current) => current.map((item) => item.id === reassignRow.id ? { ...item, rider, action: item.action } : item)); setReassignRow(null); }} />
    </div>
  );
}

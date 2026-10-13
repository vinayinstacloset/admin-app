import { Filter, MapPin, PackageOpen, Search, Upload } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonTable from "../../../shared/components/common/CommonTable";
import OrderDropdown from "../components/OrderDropdown";
import OrderConfirmModal from "../components/OrderConfirmModal";
import RejectOrderModal from "../components/RejectOrderModal";
import RiderPicker from "../components/AssignRiderModal";
import { getOrderRows, orderStatuses, statusCounts, storeNames } from "../data";
import {
  getStatusOverrides,
  setOrderStatus,
  setOrderRejectionReason,
} from "../orderState";
import type { OrderListRow, OrderStatus } from "../types/order.types";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";

const statusClass: Record<OrderStatus, string> = {
  New: "bg-[#edf6ff] text-[#1481ee]",
  Packing: "bg-[#fffbe5] text-[#e3bd00]",
  Ready: "bg-[#ecfbf1] text-[#22b962]",
  "On the way": "bg-[#f5eaff] text-[#a24ae8]",
  Delivered: "bg-[#fff0eb] text-[#ef765c]",
  Rejected: "bg-[#fff0f0] text-[#ed7373]",
};

function riderStatus(row: OrderListRow) {
  if (row.riderState === "reached")
    return <span className="leading-4">Rider reached the store</span>;
  if (row.riderState === "on-way")
    return (
      <span className="leading-4">
        Rider is on the way
        <br />
        ETA: 12:30 PM
      </span>
    );
  return (
    <div className="leading-4">
      Rider is not accepted yet
      <button
        type="button"
        className="mt-1 rounded border border-[#805b42] px-3 py-1 text-[8px] font-semibold text-[#805b42]"
      >
        Assign rider
      </button>
    </div>
  );
}

export default function OrdersScreen() {
  const navigate = useNavigate();
  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("New");
  const [store, setStore] = useState("All Store");
  const [date, setDate] = useState("Today");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<OrderListRow[]>([]);
  const [confirm, setConfirm] = useState<{
    row: OrderListRow;
    type: "accept";
  } | null>(null);
  const [rejectRow, setRejectRow] = useState<OrderListRow | null>(null);
  const [assignRow, setAssignRow] = useState<OrderListRow | null>(null);

  useEffect(() => {
    const overrides = getStatusOverrides();
    setRows(
      getOrderRows().map((row) => ({
        ...row,
        status: overrides[row.id] ?? row.status,
      })),
    );
  }, [selectedStatus]);

  useEffect(() => {
    setExtraCrumbs([{ label: "Orders" }]);
    setPageAction(
      <button
        type="button"
        onClick={() => {
          const csv = [
            "Order,Store,Customer,Status,Amount",
            ...rows.map(
              (r) => `${r.id},${r.store},${r.customer},${r.status},${r.amount}`,
            ),
          ].join("\n");
          const url = URL.createObjectURL(
            new Blob([csv], { type: "text/csv" }),
          );
          const a = document.createElement("a");
          a.href = url;
          a.download = "orders.csv";
          a.click();
          URL.revokeObjectURL(url);
        }}
        className="flex h-8 items-center gap-2 rounded-md bg-[#0878df] px-3 text-[10px] font-semibold text-white"
      >
        Export <Upload size={13} />
      </button>,
    );
    return () => {
      setPageAction(null);
      setExtraCrumbs([]);
    };
  }, [rows, setExtraCrumbs, setPageAction]);

  const visible = useMemo(
    () =>
      rows.filter(
        (row) =>
          row.status === selectedStatus &&
          (store === "All Store" ||
            row.store.startsWith(store.split(" – ")[0]) ||
            row.store.includes(store)) &&
          `${row.id} ${row.customer} ${row.store} ${row.itemSummary}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [rows, selectedStatus, store, query],
  );

  const updateStatus = (row: OrderListRow, next: OrderStatus) => {
    setOrderStatus(row.id, next);
    setRows((current) =>
      current.map((item) =>
        item.id === row.id ? { ...item, status: next } : item,
      ),
    );
  };

  return (
    <div className="pb-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-5 border-b border-black/10">
          {orderStatuses.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`relative pb-2 text-[13px] font-semibold ${selectedStatus === status ? "text-[#76533d]" : "text-ink/35"}`}
            >
              {status}
              {statusCounts[status] > 0 && (
                <span> - {statusCounts[status]}</span>
              )}
              {selectedStatus === status && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[#76533d]" />
              )}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-[275px]">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search order id, customer name..."
              className="h-9 w-full rounded-md bg-white pl-8 pr-3 text-[10px] outline-none"
            />
          </div>
          <OrderDropdown
            value={store}
            options={storeNames}
            onChange={setStore}
            searchable
            width={145}
          />
          <Filter size={16} className="text-ink/70" />
          <OrderDropdown
            value={date}
            options={[
              "Today",
              "Yesterday",
              "Last 7 days",
              "Last 15 days",
              "Last month",
              "All time",
            ]}
            onChange={setDate}
            width={115}
          />
        </div>
      </div>

      <CommonTable
        minWidth={1180}
        headers={[
          { header: "ORDER", width: "1.05fr" },
          { header: "STORE", width: "1fr" },
          { header: "CUSTOMER", width: "1fr" },
          { header: "RIDER", width: "0.95fr" },
          { header: "ITEM", width: "1.55fr" },
          { header: "STATUS", width: "0.7fr" },
          { header: "AMOUNT", width: "0.75fr" },
          { header: "ACTION", width: "1.05fr" },
        ]}
        rowKeys={visible.map((r, i) => `${r.id}-${i}`)}
        data={visible.map((row) => [
          <div>
            <b className="text-[12px]">{row.id}</b>
            <span className="mt-1 block text-[9px] text-ink/45">
              {row.items} · {row.age}
            </span>
          </div>,
          <div>
            <b className="block max-w-[150px] truncate text-[10px]">
              {row.store}
            </b>
            <span className="text-[9px] text-ink/45">{row.city}</span>
          </div>,
          <div>
            <b className="block text-[10px]">{row.customer}</b>
            <span className="mt-1 flex items-center gap-1 text-[8.5px] text-ink/45">
              <MapPin size={9} />
              {row.customerLocation}
            </span>
          </div>,
          row.rider === "-" ? (
            <span className="text-ink/45">-</span>
          ) : (
            <div className="flex items-center gap-2">
              <img
                src={row.riderAvatar}
                alt=""
                className="h-7 w-7 rounded-full object-cover"
              />
              <span className="text-[10px]">{row.rider}</span>
            </div>
          ),
          <div>
            <span className="block max-w-[250px] truncate text-[10px]">
              {row.itemSummary}
            </span>
            <span className="mt-1 flex items-center gap-1 text-[8.5px] text-ink/45">
              <PackageOpen size={9} />
              {row.itemCounts}
            </span>
          </div>,
          <span
            className={`rounded-full px-3 py-1.5 text-[9px] font-medium ${statusClass[row.status]}`}
          >
            {row.status}
          </span>,
          <div>
            <b className="text-[12px]">₹{row.amount.toLocaleString("en-IN")}</b>
            <button
              type="button"
              onClick={() =>
                navigate(`/admin-dashboard/orders/${row.id.replace("#", "")}`, {
                  state: {
                    source: { label: "Orders", to: "/admin-dashboard/orders" },
                    status: row.status,
                    riderState: row.riderState,
                    row,
                  },
                })
              }
              className="mt-1 block text-[9px] text-blue-600 underline"
            >
              View details
            </button>
          </div>,
          selectedStatus === "New" ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setRejectRow(row)}
                className="rounded-md bg-[#ed7373] px-4 py-2 text-[9px] font-semibold text-white"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => setConfirm({ row, type: "accept" })}
                className="rounded-md bg-[#39be69] px-4 py-2 text-[9px] font-semibold text-white"
              >
                Accept
              </button>
            </div>
          ) : selectedStatus === "Ready" ? (
            row.riderState === "not-accepted" ? (
              <button
                type="button"
                onClick={() => setAssignRow(row)}
                className="rounded-md border border-[#805b42] px-3 py-2 text-[9px] font-semibold text-[#805b42]"
              >
                Assign rider
              </button>
            ) : (
              riderStatus(row)
            )
          ) : selectedStatus === "On the way" ? (
            <button
              type="button"
              onClick={() =>
                navigate(`/admin-dashboard/orders/${row.id.replace("#", "")}`, {
                  state: {
                    source: { label: "Orders", to: "/admin-dashboard/orders" },
                    status: row.status,
                    riderState: row.riderState,
                    row,
                  },
                })
              }
              className="rounded-md border border-[#805b42] px-3 py-2 text-[9px] font-semibold text-[#805b42]"
            >
              Track rider
            </button>
          ) : selectedStatus === "Delivered" ? (
            <span className="text-[9px] text-ink/65">
              ★ {row.rating ?? "5/5 rating"}
            </span>
          ) : selectedStatus === "Rejected" ? (
            <span className="text-[9px] text-ink/65">
              {row.rejectedAt ?? "20th Apr, 12:35 PM"}
            </span>
          ) : (
            <span className="text-[9px] text-ink/60">--</span>
          ),
        ])}
      />

      <OrderConfirmModal
        open={Boolean(confirm)}
        title="Accept order"
        message="Are you sure you want to accept this order?"
        tone="green"
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm) updateStatus(confirm.row, "Packing");
          setConfirm(null);
        }}
      />
      <RejectOrderModal
        open={Boolean(rejectRow)}
        orderId={rejectRow?.id}
        onClose={() => setRejectRow(null)}
        onConfirm={(reason) => {
          if (rejectRow) {
            setOrderRejectionReason(rejectRow.id, reason);
            updateStatus(rejectRow, "Rejected");
          }
          setRejectRow(null);
        }}
      />
      <RiderPicker
        open={Boolean(assignRow)}
        onClose={() => setAssignRow(null)}
        onConfirm={(rider) => {
          if (assignRow) {
            setRows((current) =>
              current.map((item) =>
                item.id === assignRow.id
                  ? {
                      ...item,
                      rider,
                      riderState: "on-way",
                      actionText: "Rider is on the way\nETA: 12:30 PM",
                    }
                  : item,
              ),
            );
          }
          setAssignRow(null);
        }}
      />
    </div>
  );
}

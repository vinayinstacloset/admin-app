import CommonTable from "../../../shared/components/common/CommonTable";
import {
  ChevronDown,
  PackageOpen,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type {
  CustomerExchangeRow,
  CustomerOrderRow,
  CustomerReturnRow,
  CustomerTab,
} from "../types/customer.types";
import { useNavigate } from "react-router-dom";
import { RejectExchangeModal } from "../../exchange/components/ExchangeModals";
import RejectOrderModal from "../../orders/components/RejectOrderModal";
import {
  setOrderRejectionReason,
  setOrderStatus,
} from "../../orders/orderState";
import { PaymentModal, RejectRefundModal } from "../../returns/components";

type Props = {
  tab: CustomerTab;
  orders: CustomerOrderRow[];
  returns: CustomerReturnRow[];
  exchanges: CustomerExchangeRow[];
  customerId: string;
  customerName: string;
  onTabChange: (tab: CustomerTab) => void;
};

const orderStatuses = [
  "All",
  "New",
  "Packing",
  "Ready",
  "On the way",
  "Delivered",
  "Rejected",
];
const returnStatuses = [
  "All",
  "New",
  "Refunded",
  "On the way",
  "Collected",
  "Rejected",
];
const exchangeStatuses = [
  "All",
  "New",
  "Approved",
  "Ready",
  "On the way",
  "Exchanged",
  "Rejected",
];

function SelectMenu({
  value,
  options,
  onChange,
  width = "w-[125px]",
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  width?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative ${width}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="h-8 w-full rounded-md border border-black/10 bg-white px-2.5 text-[10px] text-ink/65 flex items-center justify-between gap-2"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={11} />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-[80] w-full min-w-[145px] rounded-lg border border-black/10 bg-white shadow-xl py-1">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-[10px] hover:bg-[#f6f2ed] ${option === value ? "text-[#805b42] font-semibold" : "text-ink/65"}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const className =
    status === "Refunded" ||
    status === "Delivered" ||
    status === "Exchanged" ||
    status === "Approved"
      ? "bg-[#ecfbf2] text-[#37b86a]"
      : status === "Collected"
        ? "bg-[#e8f3ff] text-[#1682e8]"
        : status === "Rejected"
          ? "bg-[#fff0f0] text-[#ee7373]"
          : status === "New"
            ? "bg-[#fff9df] text-[#e9b800]"
            : status === "Ready" || status === "Ready for delivery"
              ? "bg-[#fff1e8] text-[#ef8a61]"
              : status === "On the way"
                ? "bg-[#f5eaff] text-[#a34be8]"
                : "bg-[#eaf4ff] text-[#438fe9]";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-medium whitespace-nowrap ${className}`}
    >
      {status}
    </span>
  );
}

function ReassignModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (rider: string) => void;
}) {
  const [rider, setRider] = useState("Rajan Kumar");
  const [riderMenuOpen, setRiderMenuOpen] = useState(false);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] bg-black/30 flex items-center justify-center p-5"
      onMouseDown={onClose}
    >
      <div
        className="w-[380px] rounded-xl bg-white shadow-2xl p-5"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <p className="text-[14px] font-semibold text-ink">Reassign rider</p>
        <p className="text-[10px] text-ink/45 mt-1 mb-4">
          Select a rider for this order.
        </p>
        <div className="relative">
          <button
            type="button"
            onClick={() => setRiderMenuOpen((current) => !current)}
            className="flex h-9 w-full items-center justify-between rounded-md border border-black/10 bg-white px-3 text-left text-[11px] outline-none"
          >
            <span>{rider}</span>
            <ChevronDown size={12} />
          </button>
          {riderMenuOpen && (
            <div className="absolute left-0 right-0 top-10 z-[120] rounded-md border border-black/10 bg-white p-1 shadow-xl">
              {["Rajan Kumar", "Nitish Kumar", "Arjun Singh"].map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setRider(option);
                    setRiderMenuOpen(false);
                  }}
                  className={`block w-full rounded px-3 py-2 text-left text-[10px] ${option === rider ? "bg-[#eeeae6] font-semibold text-[#76533d]" : "text-ink/65 hover:bg-[#f7f5f2]"}`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded-md border border-black/10 text-[10.5px] text-ink/65"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(rider)}
            className="h-8 px-4 rounded-md bg-[#805b42] text-white text-[10.5px] font-semibold"
          >
            Reassign rider
          </button>
        </div>
      </div>
    </div>
  );
}

function actionButtonClass(tone: "red" | "green" | "brown" = "green") {
  if (tone === "red") return "bg-[#ed7373] text-white";
  if (tone === "brown")
    return "border border-[#80634f] text-[#6f513e] bg-white";
  return "bg-[#39be69] text-white";
}

function ActionConfirmModal({
  open,
  title,
  message,
  tone,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  message: string;
  tone: "red" | "green" | "brown";
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  const button =
    tone === "red"
      ? "bg-[#ed7373]"
      : tone === "brown"
        ? "bg-[#805b42]"
        : "bg-[#39be69]";
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-5"
      onMouseDown={onClose}
    >
      <div
        className="w-[420px] max-w-full rounded-xl bg-white p-6 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="text-[15px] font-semibold">{title}</p>
          <button type="button" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        <div className="my-4 h-px bg-black/10" />
        <p className="text-[11px] leading-5 text-ink/60">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 flex-1 rounded-md border border-black/50 text-[10.5px] font-semibold"
          >
            No, Wait
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`h-9 flex-1 rounded-md text-[10.5px] font-semibold text-white ${button}`}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomerTables({
  tab,
  orders,
  returns,
  exchanges,
  customerId,
  customerName,
  onTabChange,
}: Props) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Newest first");
  const [orderRows, setOrderRows] = useState(orders);
  const [returnRows, setReturnRows] = useState(returns);
  const [exchangeRows, setExchangeRows] = useState(exchanges);
  const [reassignRow, setReassignRow] = useState<CustomerOrderRow | null>(null);
  const [rejectExchangeRow, setRejectExchangeRow] =
    useState<CustomerExchangeRow | null>(null);
  const [rejectOrderRow, setRejectOrderRow] = useState<CustomerOrderRow | null>(
    null,
  );
  const [rejectReturnRow, setRejectReturnRow] =
    useState<CustomerReturnRow | null>(null);
  const [refundReturnRow, setRefundReturnRow] =
    useState<CustomerReturnRow | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    title: string;
    message: string;
    tone: "red" | "green" | "brown";
    confirm: () => void;
  } | null>(null);

  useEffect(() => {
    setOrderRows(orders);
    setReturnRows(returns);
    setExchangeRows(exchanges);
  }, [orders, returns, exchanges]);

  useEffect(() => {
    setStatus("All");
    setQuery("");
    setSort(tab === "ORDER" ? "Newest first" : "Recent to oldest");
  }, [tab]);

  const filteredOrders = useMemo(
    () =>
      orderRows.filter(
        (item) =>
          (status === "All" || item.status === status) &&
          `${item.id} ${item.store} ${item.rider} ${item.details}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [orderRows, query, status],
  );
  const filteredReturns = useMemo(
    () =>
      returnRows.filter(
        (item) =>
          (status === "All" || item.status === status) &&
          `${item.id} ${item.store} ${item.rider} ${item.item} ${item.reason}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [returnRows, query, status],
  );
  const filteredExchanges = useMemo(
    () =>
      exchangeRows.filter(
        (item) =>
          (status === "All" ||
            item.status === status ||
            (status === "Ready" && item.status === "Ready for delivery")) &&
          `${item.id} ${item.store} ${item.rider} ${item.item} ${item.replace} ${item.reason}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [exchangeRows, query, status],
  );

  const dateValue = (value: string) => {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const sortedOrders = [...filteredOrders].sort((a, b) =>
    sort === "Oldest first"
      ? dateValue(a.date) - dateValue(b.date)
      : sort === "Amount high to low"
        ? b.amount - a.amount
        : sort === "Amount low to high"
          ? a.amount - b.amount
          : dateValue(b.date) - dateValue(a.date),
  );

  const sortedReturns = [...filteredReturns].sort((a, b) =>
    sort === "Oldest first"
      ? dateValue(a.requested) - dateValue(b.requested)
      : sort === "Amount high to low"
        ? b.refund - a.refund
        : sort === "Amount low to high"
          ? a.refund - b.refund
          : dateValue(b.requested) - dateValue(a.requested),
  );

  const sortedExchanges = [...filteredExchanges].sort((a, b) =>
    sort === "Oldest first"
      ? dateValue(a.requested) - dateValue(b.requested)
      : dateValue(b.requested) - dateValue(a.requested),
  );

  const statusOptions =
    tab === "ORDER"
      ? orderStatuses
      : tab === "RETURN"
        ? returnStatuses
        : exchangeStatuses;
  const sortOptions =
    tab === "ORDER"
      ? [
          "Newest first",
          "Oldest first",
          "Amount high to low",
          "Amount low to high",
        ]
      : [
          "Recent to oldest",
          "Oldest to recent",
          "Amount high to low",
          "Amount low to high",
        ];
  const visibleCount =
    tab === "ORDER"
      ? sortedOrders.length
      : tab === "RETURN"
        ? sortedReturns.length
        : sortedExchanges.length;
  const allCount = tab === "ORDER" ? 37 : tab === "RETURN" ? 6 : 6;

  const updateOrder = (target: CustomerOrderRow, nextStatus: string) => {
    setOrderRows((current) =>
      current.map((row) =>
        row === target ? { ...row, status: nextStatus } : row,
      ),
    );
  };
  const updateReturn = (target: CustomerReturnRow, nextStatus: string) => {
    setReturnRows((current) =>
      current.map((row) =>
        row === target ? { ...row, status: nextStatus } : row,
      ),
    );
  };
  const updateExchange = (target: CustomerExchangeRow, nextStatus: string) => {
    setExchangeRows((current) =>
      current.map((row) =>
        row === target ? { ...row, status: nextStatus } : row,
      ),
    );
  };

  const openOrder = (row: CustomerOrderRow) => {
    navigate(
      `/admin-dashboard/orders/${encodeURIComponent(row.id.replace("#", ""))}`,
      {
        state: {
          source: {
            label: "Orders",
            to: `/admin-dashboard/customers/${customerId}`,
            parentLabel: customerName,
            parentTo: `/admin-dashboard/customers/${customerId}`,
            rootLabel: "Customers",
            rootTo: "/admin-dashboard/customers",
          },
          status: row.status === "Ready for delivery" ? "Ready" : row.status,
          riderState:
            row.rider === "-"
              ? "not-accepted"
              : row.status === "Ready"
                ? "on-way"
                : "on-way",
          row,
        },
      },
    );
  };
  const openReturn = (row: CustomerReturnRow) => {
    navigate(
      `/admin-dashboard/customers/${customerId}/returns/${encodeURIComponent(row.id.replace("#", ""))}`,
      { state: { status: row.status } },
    );
  };
  const openExchange = (row: CustomerExchangeRow) => {
    navigate(
      `/admin-dashboard/customers/${customerId}/exchanges/${encodeURIComponent(row.id.replace("#", ""))}`,
      { state: { status: row.status, customerName, storeName: row.store } },
    );
  };

  return (
    <>
      <div className="bg-transparent">
        <div className="flex justify-center mb-2">
          <div className="inline-flex rounded-md overflow-hidden bg-[#e7e5e3] p-0.5">
            {(["ORDER", "RETURN", "EXCHANGE"] as CustomerTab[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onTabChange(item)}
                className={`h-8 min-w-[76px] px-5 text-[10px] font-medium ${tab === item ? "bg-[#f8f7f5] border border-[#80634f] text-[#6f513e] rounded-md" : "text-ink/55"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {statusOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setStatus(option)}
                className={`px-2.5 py-1.5 text-[10.5px] whitespace-nowrap border-b-2 ${status === option ? "border-[#80634f] text-[#6f513e] font-semibold" : "border-transparent text-ink/40"}`}
              >
                {option}
                {option === "All" ? ` - ${allCount}` : ""}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative w-[230px]">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/30"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  tab === "ORDER"
                    ? "Search order id..."
                    : tab === "RETURN"
                      ? "Search return id, customer name..."
                      : "Search exchange id, customer name..."
                }
                className="h-8 w-full rounded-md border border-black/10 bg-white pl-7 pr-2.5 text-[10px] outline-none"
              />
            </div>
            <span
              className="w-7 h-8 flex items-center justify-center text-ink/45"
              aria-hidden="true"
            >
              <SlidersHorizontal size={15} />
            </span>
            <SelectMenu value={sort} options={sortOptions} onChange={setSort} />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
          {tab === "ORDER" && (
            <CommonTable
              minWidth={1120}
              headers={[
                { header: "ORDER", width: "0.95fr" },
                { header: "STORE", width: "0.9fr" },
                { header: "RIDER", width: "0.8fr" },
                { header: "ITEM", width: "1.65fr" },
                { header: "STATUS", width: "0.85fr" },
                { header: "AMOUNT", width: "0.75fr" },
                { header: "ACTION", width: "0.85fr" },
              ]}
              data={sortedOrders.map((row, index) => [
                <button
                  key="order"
                  type="button"
                  onClick={() => openOrder(row)}
                  className="text-left font-semibold hover:text-[#805b42]"
                >
                  {row.id}
                  <span className="block text-[8.5px] text-ink/35 mt-1">
                    {row.items} Items · {row.date}
                  </span>
                </button>,
                <div key="store">
                  <span className="font-medium">{row.store}</span>
                  <span className="block text-[8.5px] text-ink/35 mt-1">
                    Mumbai
                  </span>
                </div>,
                row.rider === "-" ? "-" : row.rider,
                <div key="item">
                  <span className="block whitespace-normal break-words leading-4">
                    {row.details}
                  </span>
                  <span className="flex items-center text-[8.5px] text-ink/35 mt-1">
                    <PackageOpen size={10} /> 19&nbsp;&nbsp;{" "}
                    <PackageOpen size={10} /> 23
                  </span>
                </div>,
                <StatusPill
                  key="status"
                  status={
                    row.status === "Ready for delivery" ? "Ready" : row.status
                  }
                />,
                <div key="amount">
                  <b className="text-[11px]">
                    ₹{row.amount.toLocaleString("en-IN")}
                  </b>
                  <button
                    type="button"
                    onClick={() => openOrder(row)}
                    className="block text-[9px] text-blue-600 underline mt-0.5"
                  >
                    View details
                  </button>
                </div>,
                row.status === "New" ? (
                  <div key="action" className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRejectOrderRow(row)}
                      className={`h-7 px-3 rounded-md text-[9.5px] font-semibold ${actionButtonClass("red")}`}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPendingAction({
                          title: "Accept order",
                          message:
                            "Are you sure you want to accept this order?",
                          tone: "green",
                          confirm: () => {
                            updateOrder(row, "Packing");
                            setPendingAction(null);
                          },
                        })
                      }
                      className={`h-7 px-3 rounded-md text-[9.5px] font-semibold ${actionButtonClass("green")}`}
                    >
                      Accept
                    </button>
                  </div>
                ) : row.status === "Packing" ? (
                  <span key="action" className="text-[9.5px] text-ink/55">
                    -
                  </span>
                ) : row.status === "Ready" ? (
                  <span key="action" className="text-[9.5px] text-ink/55">
                    ETA: 12:30 PM
                  </span>
                ) : row.status === "On the way" ? (
                  <button
                    key="action"
                    type="button"
                    onClick={() => setReassignRow(row)}
                    className={`h-7 px-3 rounded-md text-[9.5px] ${actionButtonClass("brown")}`}
                  >
                    Reassign rider
                  </button>
                ) : row.status === "Delivered" ? (
                  <span key="action" className="text-[9.5px] text-ink/60">
                    ★ {row.rating ?? "5/5"} rating
                  </span>
                ) : (
                  <span key="action" className="text-[9.5px] text-ink/60">
                    20th Apr, 12:35 PM
                  </span>
                ),
              ])}
              rowKeys={sortedOrders.map(
                (row, index) => `${row.id}-${row.status}-${index}`,
              )}
              minWidth={1050}
            />
          )}

          {tab === "RETURN" && (
            <CommonTable
              headers={[
                "ORDER",
                "STORE",
                "RIDER",
                "ITEM",
                "REASON",
                "REQUESTED",
                "REFUND",
                "STATUS",
                "ACTION",
              ]}
              data={sortedReturns.map((row, index) => [
                <strong key="order">{row.id}</strong>,
                <div key="store">
                  <span className="font-medium">{row.store}</span>
                  <span className="block text-[8.5px] text-ink/35 mt-1">
                    Mumbai
                  </span>
                </div>,
                row.rider,
                <div key="item">
                  <span>{row.item}</span>
                  <button
                    type="button"
                    onClick={() => openReturn(row)}
                    className="block text-[9px] text-blue-600 underline mt-0.5"
                  >
                    View details
                  </button>
                </div>,
                <strong key="reason">{row.reason}</strong>,
                row.requested,
                `₹${row.refund.toLocaleString("en-IN")}`,
                <StatusPill
                  key="status"
                  status={
                    row.status === "Ready for delivery" ? "Ready" : row.status
                  }
                />,
                row.status === "New" ? (
                  <div key="action" className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRejectReturnRow(row)}
                      className="h-7 px-3 rounded-md bg-[#ed7373] text-white text-[9.5px] font-semibold"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => setRefundReturnRow(row)}
                      className="h-7 px-3 rounded-md bg-[#805b42] text-white text-[9.5px] font-semibold"
                    >
                      Refund
                    </button>
                  </div>
                ) : row.status === "On the way" ? (
                  <div key="action">
                    <span className="block text-[9px] text-ink/60">
                      ETA: 12:30 PM
                    </span>
                    <button
                      type="button"
                      onClick={() => openReturn(row)}
                      className="mt-1 h-6 px-3 rounded-md border border-[#80634f] text-[#6f513e] text-[9px]"
                    >
                      Track rider
                    </button>
                  </div>
                ) : (
                  <button
                    key="action"
                    type="button"
                    onClick={() => openReturn(row)}
                    className="h-7 px-3 rounded-md border border-[#80634f] text-[#6f513e] text-[9.5px]"
                  >
                    View details
                  </button>
                ),
              ])}
              rowKeys={sortedReturns.map(
                (row, index) => `${row.id}-${row.status}-${index}`,
              )}
              minWidth={1100}
            />
          )}

          {tab === "EXCHANGE" && (
            <CommonTable
              headers={[
                "ORDER",
                "STORE",
                "RIDER",
                "ITEM REPLACE",
                "REASON",
                "REQUESTED",
                "STATUS",
                "ACTION",
              ]}
              data={sortedExchanges.map((row, index) => [
                <strong key="order">{row.id}</strong>,
                <strong key="store">{row.store}</strong>,
                row.rider,
                <div key="item">
                  <span>
                    {row.item}, {row.replace}
                  </span>
                  <button
                    type="button"
                    onClick={() => openExchange(row)}
                    className="block text-[9px] text-blue-600 underline"
                  >
                    View details
                  </button>
                </div>,
                <strong key="reason">{row.reason}</strong>,
                row.requested,
                <StatusPill
                  key="status"
                  status={
                    row.status === "Ready for delivery" ? "Ready" : row.status
                  }
                />,
                row.status === "New" ? (
                  <div key="action" className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRejectExchangeRow(row)}
                      className={`h-7 px-3 rounded-md text-[9.5px] font-semibold ${actionButtonClass("red")}`}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPendingAction({
                          title: "Approve exchange",
                          message:
                            "Are you sure you want to approve this exchange?",
                          tone: "green",
                          confirm: () => {
                            updateExchange(row, "Ready for delivery");
                            setPendingAction(null);
                          },
                        })
                      }
                      className={`h-7 px-3 rounded-md text-[9.5px] font-semibold ${actionButtonClass("green")}`}
                    >
                      Approve
                    </button>
                  </div>
                ) : row.status === "Approved" ? (
                  <button
                    key="action"
                    type="button"
                    onClick={() => openExchange(row)}
                    className="h-7 px-3 rounded-md border border-[#80634f] text-[#6f513e] text-[9.5px]"
                  >
                    View details
                  </button>
                ) : row.status === "Ready for delivery" ? (
                  <span key="action" className="text-[9.5px] text-ink/55">
                    Rider reached the store
                  </span>
                ) : row.status === "On the way" ? (
                  <span key="action" className="text-[9.5px] text-ink/55">
                    Estimated Delivery in 18 mins
                  </span>
                ) : (
                  <button
                    key="action"
                    type="button"
                    onClick={() => openExchange(row)}
                    className="h-7 px-3 rounded-md border border-[#80634f] text-[#6f513e] text-[9.5px]"
                  >
                    View details
                  </button>
                ),
              ])}
              rowKeys={sortedExchanges.map(
                (row, index) => `${row.id}-${row.status}-${index}`,
              )}
              minWidth={1050}
            />
          )}

          {visibleCount === 0 && (
            <div className="py-10 text-center text-xs text-ink/40">
              No records found.
            </div>
          )}
        </div>
      </div>
      <RejectExchangeModal
        open={Boolean(rejectExchangeRow)}
        onClose={() => setRejectExchangeRow(null)}
        onConfirm={(message) => {
          if (!rejectExchangeRow) return;
          setExchangeRows((current) =>
            current.map((item) =>
              item.id === rejectExchangeRow.id
                ? { ...item, status: "Rejected", reason: message }
                : item,
            ),
          );
          setRejectExchangeRow(null);
        }}
      />
      <RejectOrderModal
        open={Boolean(rejectOrderRow)}
        orderId={rejectOrderRow?.id}
        onClose={() => setRejectOrderRow(null)}
        onConfirm={(reason) => {
          if (!rejectOrderRow) return;
          setOrderRejectionReason(rejectOrderRow.id, reason);
          setOrderStatus(rejectOrderRow.id, "Rejected");
          updateOrder(rejectOrderRow, "Rejected");
          setRejectOrderRow(null);
        }}
      />
      <RejectRefundModal
        open={Boolean(rejectReturnRow)}
        onClose={() => setRejectReturnRow(null)}
        onConfirm={(message) => {
          if (!rejectReturnRow) return;
          setReturnRows((current) =>
            current.map((item) =>
              item.id === rejectReturnRow.id
                ? { ...item, status: "Rejected", reason: message }
                : item,
            ),
          );
          setRejectReturnRow(null);
        }}
      />
      <PaymentModal
        open={Boolean(refundReturnRow)}
        amount={refundReturnRow?.refund ?? 599}
        onClose={() => setRefundReturnRow(null)}
        onContinue={() => {
          if (!refundReturnRow) return;
          updateReturn(refundReturnRow, "Refunded");
          setRefundReturnRow(null);
        }}
      />
      <ActionConfirmModal
        open={Boolean(pendingAction)}
        title={pendingAction?.title ?? "Confirm action"}
        message={pendingAction?.message ?? "Are you sure you want to continue?"}
        tone={pendingAction?.tone ?? "green"}
        onClose={() => setPendingAction(null)}
        onConfirm={() => pendingAction?.confirm()}
      />
      <ReassignModal
        open={Boolean(reassignRow)}
        onClose={() => setReassignRow(null)}
        onConfirm={() => setReassignRow(null)}
      />
    </>
  );
}

import { Download, Filter, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommonTable from "../../../shared/components/common/CommonTable";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { RETURN_ROWS, RETURN_STORES } from "../data";
import type { ReturnRow, ReturnStatus } from "../types/returns.types";
import {
  PaymentModal,
  RejectRefundModal,
  ReturnDropdown,
  ReturnSearch,
  ReturnStatusPill,
} from "../components";

function money(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function ReturnsScreen() {
  const { storeId } = useParams<{ storeId?: string }>();
  return storeId ? (
    <StoreReturnsScreen storeId={storeId} />
  ) : (
    <StoresReturnsScreen />
  );
}

function StoresReturnsScreen() {
  const navigate = useNavigate();
  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();
  const [query, setQuery] = useState("");
  const [state, setState] = useState("All state");
  const [sort, setSort] = useState("Name (A to Z)");
  useEffect(() => {
    setExtraCrumbs([{ label: "Returns" }]);
    setPageAction(
      <button
        type="button"
        className="h-8 px-3 rounded-md bg-blue-600 text-white text-[10.5px] font-semibold flex items-center gap-1.5"
      >
        Export <Download size={12} />
      </button>,
    );
    return () => setPageAction(null);
  }, [setExtraCrumbs, setPageAction]);
  const rows = useMemo(() => {
    const filtered = RETURN_STORES.filter(
      (row) =>
        (state === "All state" || row.state === state) &&
        row.name.toLowerCase().includes(query.toLowerCase()),
    );
    return [...filtered].sort((a, b) =>
      sort === "Name (Z to A)"
        ? b.name.localeCompare(a.name)
        : sort === "Returns ↑"
          ? a.totalReturns - b.totalReturns
          : sort === "Returns ↓"
            ? b.totalReturns - a.totalReturns
            : a.name.localeCompare(b.name),
    );
  }, [query, state, sort]);
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-[16px] font-semibold">Returns</h1>
        <span className="text-[14px] font-semibold">Total store - 64</span>
      </div>
      <div className="mb-3 flex items-center justify-end gap-2">
        <ReturnSearch
          value={query}
          onChange={setQuery}
          placeholder="Search store name"
        />
        <ReturnDropdown
          value={state}
          options={["All state", "Maharashtra", "Telangana"]}
          onChange={setState}
        />
        <span className="flex h-[30px] w-7 items-center justify-center text-[#6c655f]">
          <Filter size={15} />
        </span>
        <ReturnDropdown
          value={sort}
          options={["Name (A to Z)", "Name (Z to A)", "Returns ↑", "Returns ↓"]}
          onChange={setSort}
          width={125}
        />
      </div>
      <div className="rounded-xl bg-white border border-black/5 overflow-hidden">
        <CommonTable
          minWidth={1120}
          headers={[
            "STORE",
            "STATE",
            "TOTAL RETURNS",
            "RETURN RATE",
            "REFUND ISSUES",
            "COLLECTED ITEM",
            "REJECTED ITEM",
            "ACTION",
          ].map((header) => ({
            header,
            width: header === "STORE" ? "1.1fr" : "1fr",
          }))}
          data={rows.map((row) => [
            <div className="flex items-center gap-2">
              <img
                src="/reference/brands/nike.jpg"
                alt=""
                className="h-8 w-8 object-cover"
              />
              <b>{row.name}</b>
            </div>,
            row.state,
            row.totalReturns,
            row.returnRate,
            money(row.refundIssues),
            row.collected,
            row.rejected,
            <button
              type="button"
              onClick={() => navigate(`/admin-dashboard/returns/${row.id}`)}
              className="h-7 px-3 rounded-md border border-[#80634f] text-[#6f513e] text-[9.5px]"
            >
              View return
            </button>,
          ])}
          rowKeys={rows.map((row) => row.id)}
        />
      </div>
    </div>
  );
}

function StoreReturnsScreen({ storeId }: { storeId: string }) {
  const navigate = useNavigate();
  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();
  const [rows, setRows] = useState<ReturnRow[]>(RETURN_ROWS);
  const [status, setStatus] = useState<ReturnStatus>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Recent to oldest");
  const [rejectRow, setRejectRow] = useState<ReturnRow | null>(null);
  const [paymentRow, setPaymentRow] = useState<ReturnRow | null>(null);
  const store =
    RETURN_STORES.find((item) => item.id === storeId) ?? RETURN_STORES[0];
  useEffect(() => {
    setExtraCrumbs([
      { label: "Returns", to: "/admin-dashboard/returns" },
      { label: `${store.name} return` },
    ]);
    setPageAction(
      <button
        type="button"
        className="h-8 px-3 rounded-md bg-blue-600 text-white text-[10.5px] font-semibold flex items-center gap-1.5"
      >
        Export <Download size={12} />
      </button>,
    );
    return () => setPageAction(null);
  }, [setExtraCrumbs, setPageAction, store.name]);
  const filtered = useMemo(
    () =>
      rows.filter(
        (row) =>
          (status === "All" || row.status === status) &&
          `${row.id} ${row.customer} ${row.item} ${row.reason}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [rows, status, query],
  );
  const sorted = useMemo(() => {
    const copy = [...filtered];
    if (sort === "Amount high to low")
      return copy.sort((a, b) => b.refund - a.refund);
    if (sort === "Amount low to high")
      return copy.sort((a, b) => a.refund - b.refund);
    if (sort === "Oldest to recent") return copy.reverse();
    return copy;
  }, [filtered, sort]);
  const updateStatus = (
    id: string,
    nextStatus: ReturnRow["status"],
    rejectionMessage?: string,
  ) =>
    setRows((current) =>
      current.map((row) =>
        row.id === id ? { ...row, status: nextStatus, rejectionMessage } : row,
      ),
    );
  const tabs: ReturnStatus[] = [
    "All",
    "New",
    "Refunded",
    "On the way",
    "Collected",
    "Rejected",
  ];
  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-4">
        <Metric
          icon="↩"
          value={String(store.totalReturns)}
          label="Total Returns"
          tone="blue"
        />
        <Metric
          icon="↩"
          value={store.returnRate}
          label="Return Rate"
          tone="purple"
        />
        <Metric
          icon="⇧"
          value={money(store.refundIssues)}
          label="Refund issues"
          tone="orange"
        />
      </div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatus(tab)}
              className={`px-2.5 pb-2 pt-1 text-[10.5px] whitespace-nowrap border-b-2 ${status === tab ? "border-[#6f513e] text-[#6f513e] font-semibold" : "border-transparent text-[#aaa5a1]"}`}
            >
              {tab}
              {tab === "All" ? ` - ${rows.length}` : ""}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ReturnSearch
            value={query}
            onChange={setQuery}
            placeholder="Search order id, customer name..."
          />
          <span className="flex h-[30px] w-6 items-center justify-center">
            <Filter size={15} />
          </span>
          <ReturnDropdown
            value={sort}
            options={[
              "Recent to oldest",
              "Oldest to recent",
              "Amount high to low",
              "Amount low to high",
            ]}
            onChange={setSort}
            width={125}
          />
        </div>
      </div>
      <div className="rounded-xl bg-white border border-black/5 overflow-hidden">
        <CommonTable
          minWidth={1120}
          headers={[
            "ORDER",
            "CUSTOMER",
            "ITEM",
            "REASON",
            "REQUESTED",
            "REFUND",
            "STATUS",
            "ACTION",
          ].map((header) => ({
            header,
            width:
              header === "ITEM"
                ? "1.25fr"
                : header === "ACTION"
                  ? "1fr"
                  : "1fr",
          }))}
          data={sorted.map((row) => [
            <b>{row.id}</b>,
            row.customer,
            <div>
              <span>{row.item}</span>
              {row.status === "New" || row.status === "On the way" ? (
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/admin-dashboard/returns/${storeId}/${encodeURIComponent(row.id.replace("#", ""))}`,
                      {
                        state: {
                          status: row.status,
                          storeName: store.name,
                          row,
                        },
                      },
                    )
                  }
                  className="block text-[9px] text-blue-600 underline"
                >
                  View details
                </button>
              ) : null}
            </div>,
            <b>{row.reason}</b>,
            row.requested,
            money(row.refund),
            <ReturnStatusPill status={row.status} />,
            row.status === "New" ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRejectRow(row)}
                  className="h-7 px-3 rounded-md bg-[#ed7373] text-white text-[9.5px] font-semibold"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentRow(row)}
                  className="h-7 px-3 rounded-md bg-[#805b42] text-white text-[9.5px] font-semibold"
                >
                  Refund
                </button>
              </div>
            ) : row.status === "On the way" ? (
              <div>
                <span className="block text-[9px] text-[#5f5955]">
                  ETA: 12:30 PM
                </span>
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/admin-dashboard/returns/${storeId}/${encodeURIComponent(row.id.replace("#", ""))}`,
                      {
                        state: {
                          status: row.status,
                          storeName: store.name,
                          row,
                        },
                      },
                    )
                  }
                  className="mt-1 h-6 px-3 rounded-md border border-[#80634f] text-[#6f513e] text-[9px]"
                >
                  Track rider
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/admin-dashboard/returns/${storeId}/${encodeURIComponent(row.id.replace("#", ""))}`,
                    {
                      state: { status: row.status, storeName: store.name, row },
                    },
                  )
                }
                className="h-7 px-3 rounded-md border border-[#80634f] text-[#6f513e] text-[9.5px]"
              >
                View details
              </button>
            ),
          ])}
          rowKeys={sorted.map((row) => `${row.id}-${row.status}`)}
        />
      </div>
      <RejectRefundModal
        open={Boolean(rejectRow)}
        onClose={() => setRejectRow(null)}
        onConfirm={(message) => {
          if (rejectRow) updateStatus(rejectRow.id, "Rejected", message);
          setRejectRow(null);
        }}
      />
      <PaymentModal
        open={Boolean(paymentRow)}
        amount={paymentRow?.refund ?? 599}
        onClose={() => setPaymentRow(null)}
        onContinue={() => {
          if (paymentRow) updateStatus(paymentRow.id, "Refunded");
          setPaymentRow(null);
        }}
      />
    </div>
  );
}

function Metric({
  icon,
  value,
  label,
  tone,
}: {
  icon: string;
  value: string;
  label: string;
  tone: "blue" | "purple" | "orange";
}) {
  const styles =
    tone === "blue"
      ? "bg-[#e6f2ff] text-[#0071e3]"
      : tone === "purple"
        ? "bg-[#f5e8ff] text-[#a335f1]"
        : "bg-[#fff0ea] text-[#ff6536]";
  return (
    <div className="h-[100px] rounded-xl bg-white p-3 flex flex-col justify-between">
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center text-[19px] ${styles}`}
      >
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-[12px] text-[#5f5955]">{label}:</span>
        <b className="text-[22px]">{value}</b>
      </div>
    </div>
  );
}

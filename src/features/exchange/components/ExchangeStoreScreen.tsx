import { ChevronDown, Search, SlidersHorizontal, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CommonTable from "../../../shared/components/common/CommonTable";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { exchangeRows, exchangeStores, statusCounts } from "../data/mockData";
import type { ExchangeRow, ExchangeStatus } from "../types/exchange.types";
import {
  ConfirmationModal,
  RejectExchangeModal,
  SuccessModal,
} from "./ExchangeModals";

const exchangeSortOptions: string[] = ["Recent to oldest", "Oldest to recent"];

const tabs: Array<ExchangeStatus | "All"> = [
  "All",
  "New",
  "Approved",
  "Ready",
  "On the way",
  "Exchanged",
  "Rejected",
];

const statusClass: Record<ExchangeStatus, string> = {
  New: "bg-[#fff9df] text-[#e9b800]",
  Approved: "bg-[#ecfbf2] text-[#37b86a]",
  Ready: "bg-[#fff0ea] text-[#ef8065]",
  "On the way": "bg-[#f4eaff] text-[#a34be8]",
  Exchanged: "bg-[#eaf4ff] text-[#438fe9]",
  Rejected: "bg-[#fff0f0] text-[#ee7373]",
};

interface MenuProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  width?: string;
}

function Menu({
  value,
  options,
  onChange,
  width = "w-[120px]",
}: MenuProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className={`relative shrink-0 ${width}`}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-8 w-full items-center justify-between rounded-md border border-black/5 bg-white px-3 text-[10px] text-ink/65"
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          size={11}
          className={`shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-[100] w-full min-w-[120px] rounded-lg border border-black/5 bg-white py-1 shadow-xl">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`block w-full px-3 py-2 text-left text-[10px] hover:bg-[#f5f1ed] ${
                option === value
                  ? "font-semibold text-[#805b42]"
                  : "text-ink/65"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ExchangeStoreScreen(): JSX.Element {
  const { storeId = "nike" } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();

  const store =
    exchangeStores.find((item) => item.id === storeId) ?? exchangeStores[0];

  const [tab, setTab] = useState<ExchangeStatus | "All">("All");
  const [query, setQuery] = useState<string>("");
  const [sort, setSort] = useState<string>("Recent to oldest");
  const [rowsState, setRowsState] = useState<ExchangeRow[]>(exchangeRows);
  const [approveRow, setApproveRow] = useState<ExchangeRow | null>(null);
  const [rejectRow, setRejectRow] = useState<ExchangeRow | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    setExtraCrumbs([
      {
        label: "Exchange",
        to: "/admin-dashboard/exchange",
      },
      {
        label: `${store.name} exchange`,
      },
    ]);

    setPageAction(
      <button
        type="button"
        className="flex h-9 items-center gap-2 rounded-md bg-[#0878df] px-4 text-[11px] font-semibold text-white"
      >
        Export
        <Download size={13} />
      </button>,
    );

    return () => {
      setPageAction(null);
      setExtraCrumbs([]);
    };
  }, [setExtraCrumbs, setPageAction, store.name]);

  const rows = useMemo<ExchangeRow[]>(() => {
    const filtered = rowsState.filter(
      (row) =>
        (tab === "All" || row.status === tab) &&
        `${row.id} ${row.customer} ${row.item} ${row.replace} ${row.reason}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    );

    const dayNumber = (value: string): number =>
      Number.parseInt(value, 10) || 0;

    return [...filtered].sort((a, b) =>
      sort === "Oldest to recent"
        ? dayNumber(a.requested) - dayNumber(b.requested)
        : dayNumber(b.requested) - dayNumber(a.requested),
    );
  }, [rowsState, tab, query, sort]);

  const openDetails = (row: ExchangeRow): void => {
    navigate(
      `/admin-dashboard/exchange/${store.id}/${row.id.replace("#", "")}`,
      {
        state: {
          status: row.status,
          storeName: store.name,
          customerName: row.customer,
        },
      },
    );
  };

  const approve = (): void => {
    if (!approveRow) return;

    setRowsState((current) =>
      current.map((row) =>
        row.id === approveRow.id
          ? {
              ...row,
              status: "Approved",
              action: "View details",
            }
          : row,
      ),
    );

    setApproveRow(null);
    setSuccess("Exchange approved successfully.");
  };

  const reject = (message: string): void => {
    if (!rejectRow) return;

    setRowsState((current) =>
      current.map((row) =>
        row.id === rejectRow.id
          ? {
              ...row,
              status: "Rejected",
              action: "View details",
              reason: message,
            }
          : row,
      ),
    );

    setRejectRow(null);
    setSuccess("Exchange rejected successfully.");
  };

  return (
    <div className="min-w-0">
      <div className="mb-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-4">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf4ff] text-[#1477d1]">
            ⟳
          </div>

          <span className="text-[11px] text-ink/70">Total exchanges: </span>

          <b className="text-[22px]">{store.totalExchange}</b>
        </div>

        <div className="rounded-xl bg-white p-4">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#fff0ed] text-[#ef7a63]">
            ⟳
          </div>

          <span className="text-[11px] text-ink/70">Exchange rate: </span>

          <b className="text-[22px]">{store.exchangeRate}</b>
        </div>

        <div className="rounded-xl bg-white p-4">
          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#f4eaff] text-[#a34be8]">
            ◷
          </div>

          <span className="text-[11px] text-ink/70">Avg resolution time </span>

          <b className="text-[22px]">1.4d</b>
        </div>
      </div>

      {/* Tabs and controls */}
      <div className="relative z-20 mb-2 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        {/* Only the tabs scroll horizontally */}
        <div className="min-w-0 flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex min-w-max items-end">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`whitespace-nowrap border-b-2 px-3 py-2 text-[11px] ${
                  tab === item
                    ? "border-[#805b42] font-semibold text-[#6f513e]"
                    : "border-transparent text-ink/40"
                }`}
              >
                {item}

                {item !== "All" && (
                  <span className="ml-1">- {statusCounts[item]}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Controls are outside the overflow container */}
        <div className="relative z-30 flex shrink-0 items-center gap-2 pb-1">
          <div className="relative w-[300px]">
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/30"
            />

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search exchange id, customer name..."
              className="h-8 w-full rounded-md border border-black/5 bg-white pl-7 pr-2 text-[10px] outline-none"
            />
          </div>

          <SlidersHorizontal size={17} className="shrink-0 text-ink/50" />

          <Menu
            value={sort}
            options={exchangeSortOptions}
            onChange={setSort}
            width="w-[140px]"
          />
        </div>
      </div>

      <CommonTable
        headers={[
          "ORDER",
          "CUSTOMER",
          "RIDER",
          "ITEM REPLACE",
          "REASON",
          "REQUESTED",
          "STATUS",
          "ACTION",
        ]}
        data={rows.map((row) => [
          <strong key="order">{row.id}</strong>,
          row.customer,
          row.rider,
          <div key="item">
            <span>
              {row.item}, &lt;--&gt; {row.replace}
            </span>
            <button
              type="button"
              onClick={() => openDetails(row)}
              className="block text-[9px] text-blue-600 underline"
            >
              View details
            </button>
          </div>,
          row.reason,
          row.requested,
          <span
            key="status"
            className={`inline-flex rounded-full px-2.5 py-1 text-[9px] ${statusClass[row.status]}`}
          >
            {row.status}
          </span>,
          row.status === "New" ? (
            <div key="action" className="flex gap-2">
              <button
                type="button"
                onClick={() => setRejectRow(row)}
                className="h-7 rounded-md bg-[#ed7373] px-3 text-[9.5px] font-semibold text-white"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => setApproveRow(row)}
                className="h-7 rounded-md bg-[#39be69] px-3 text-[9.5px] font-semibold text-white"
              >
                Approve
              </button>
            </div>
          ) : row.status === "Ready" || row.status === "On the way" ? (
            <span key="action" className="text-[9.5px] text-ink/60">
              {row.action}
            </span>
          ) : (
            <button
              key="action"
              type="button"
              onClick={() => openDetails(row)}
              className="h-7 rounded-md border border-[#80634f] px-3 text-[9.5px] text-[#6f513e]"
            >
              View details
            </button>
          ),
        ])}
        rowKeys={rows.map((row) => row.id)}
        minWidth={1050}
        emptyMessage="No exchanges found for this status."
      />

      <ConfirmationModal
        open={Boolean(approveRow)}
        title="Approve exchange order"
        message={`Are you sure you want to approve ${
          approveRow?.id ?? "this exchange"
        }? The customer and vendor will be notified.`}
        confirmLabel="Confirm approval"
        onClose={() => setApproveRow(null)}
        onConfirm={approve}
      />

      <RejectExchangeModal
        open={Boolean(rejectRow)}
        onClose={() => setRejectRow(null)}
        onConfirm={reject}
      />

      <SuccessModal
        open={Boolean(success)}
        title=""
        message={success ?? ""}
        onClose={() => setSuccess(null)}
      />
    </div>
  );
}

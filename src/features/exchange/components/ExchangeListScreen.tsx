import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Download,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonTable from "../../../shared/components/common/CommonTable";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { exchangeStores, INDIAN_STATES } from "../data/mockData";
import type { ExchangeStoreRow } from "../types/exchange.types";

function Menu({
  value,
  options,
  onChange,
  width = "w-[126px]",
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
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-full items-center justify-between rounded-lg bg-white px-3 text-[10px] font-medium text-ink/65 shadow-sm"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={12} />
      </button>
      {open && (
        <div className="absolute right-0 top-9 z-20 max-h-64 w-40 overflow-auto rounded-lg border border-black/5 bg-white py-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[10px] hover:bg-[#f5f1ed] ${option === value ? "font-semibold text-[#805b42]" : "text-ink/65"}`}
            >
              {option === "Exchange ↑" ? (
                <ArrowUp size={12} strokeWidth={1.8} />
              ) : null}
              {option === "Exchange ↓" ? (
                <ArrowDown size={12} strokeWidth={1.8} />
              ) : null}
              <span>{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function exportRows(rows: ExchangeStoreRow[]) {
  const csv = [
    "Store,State,Total Exchange,Exchange Rate,Exchanged Item,Rejected Item",
    ...rows.map((row) =>
      [
        row.name,
        row.state,
        row.totalExchange,
        row.exchangeRate,
        row.exchangedItem,
        row.rejectedItem,
      ].join(","),
    ),
  ].join("\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "exchange-stores.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function ExchangeListScreen() {
  const navigate = useNavigate();
  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();
  const [query, setQuery] = useState("");
  const [state, setState] = useState("All State");
  const [sort, setSort] = useState("Name (A to Z)");

  useEffect(() => {
    setExtraCrumbs([{ label: "Exchange" }]);
    setPageAction(
      <button
        type="button"
        onClick={() => exportRows(exchangeStores)}
        className="flex h-9 items-center gap-2 rounded-md bg-[#0878df] px-4 text-[11px] font-semibold text-white"
      >
        <Download size={13} />
        Export
      </button>,
    );
    return () => {
      setPageAction(null);
      setExtraCrumbs([]);
    };
  }, [setExtraCrumbs, setPageAction]);

  const rows = useMemo(() => {
    let result = exchangeStores.filter(
      (row) =>
        (state === "All State" || row.state === state) &&
        row.name.toLowerCase().includes(query.toLowerCase()),
    );
    result = [...result].sort((a, b) => {
      if (sort === "Name (Z to A)") return b.name.localeCompare(a.name);
      if (sort === "Exchange ↑") return b.totalExchange - a.totalExchange;
      if (sort === "Exchange ↓") return a.totalExchange - b.totalExchange;
      return a.name.localeCompare(b.name);
    });
    return result;
  }, [query, state, sort]);

  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h1 className="text-[17px] font-semibold text-ink">
          Total store -{" "}
          {exchangeStores.length === 10 ? 64 : exchangeStores.length}
        </h1>
        <div className="flex items-center gap-2">
          <div className="relative w-[275px]">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search store name"
              className="h-8 w-full rounded-md border border-black/5 bg-white pl-8 pr-3 text-[10px] outline-none"
            />
          </div>
          <Menu
            value={state}
            options={INDIAN_STATES}
            onChange={setState}
            width="w-[112px]"
          />
          <SlidersHorizontal size={17} className="text-ink/50" />
          <Menu
            value={sort}
            options={[
              "Name (A to Z)",
              "Name (Z to A)",
              "Exchange ↑",
              "Exchange ↓",
            ]}
            onChange={setSort}
            width="w-[125px]"
          />
        </div>
      </div>
      <CommonTable
        headers={[
          "STORE",
          "STATE",
          "TOTAL EXCHANGE",
          "EXCHANGE RATE",
          "EXCHANGED ITEM",
          "REJECTED ITEM",
          "ACTION",
        ]}
        data={rows.map((row) => [
          <div key="store" className="flex items-center gap-2.5">
            <img
              src={row.logoUrl}
              alt=""
              className="h-8 w-8 rounded-md object-cover"
            />
            <b>{row.name}</b>
          </div>,
          row.state,
          row.totalExchange,
          row.exchangeRate,
          row.exchangedItem,
          row.rejectedItem,
          <button
            key="action"
            type="button"
            onClick={() => navigate(`/admin-dashboard/exchange/${row.id}`)}
            className="h-7 rounded-md border border-[#80634f] bg-white px-3 text-[9.5px] text-[#6f513e]"
          >
            View exchange
          </button>,
        ])}
        rowKeys={rows.map((row) => row.id)}
        minWidth={900}
        emptyMessage="No exchange stores found."
      />
    </div>
  );
}

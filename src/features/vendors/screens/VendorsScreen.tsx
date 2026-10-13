import CommonTable from "../../../shared/components/common/CommonTable";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  ChevronDown,
  Download,
  Filter,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useVendors } from "../hooks";

const states: string[] = [
  "All State",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Maharashtra",
];

const statusOptions: string[] = [
  "All",
  "Active",
  "Suspended",
  "Warning",
];

const sortOptions: string[] = [
  "Name (A to Z)",
  "Name (Z to A)",
  "Revenue ↑",
  "Revenue ↓",
  "Orders ↑",
  "Orders ↓",
];

type DropdownProps = {
  value: string;
  options: string[];
  open: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  icon?: ReactNode;
  width?: string;
};

type DropdownType = "state" | "status" | "sort" | null;

function Dropdown({
  value,
  options,
  open,
  onToggle,
  onSelect,
  icon,
  width = "w-auto",
}: DropdownProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={`flex h-9 items-center justify-between gap-3 rounded-md bg-white px-3 text-[10px] font-medium text-ink shadow-sm ${width}`}
      >
        <span className="flex min-w-0 items-center gap-2">
          {icon}
          <span className="truncate">{value}</span>
        </span>

        <ChevronDown
          size={13}
          className={`shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 min-w-[150px] overflow-hidden rounded-md bg-white p-1 shadow-xl ring-1 ring-black/5">
          {options.map((option: string) => (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`block w-full rounded px-3 py-2 text-left text-[10px] ${
                option === value
                  ? "bg-[#eeeae6] font-semibold text-ink"
                  : "text-ink/70 hover:bg-[#f7f5f2]"
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

export default function VendorsScreen() {
  const navigate = useNavigate();

  const { setPageAction, setExtraCrumbs } =
    useDashboardOutletContext();

  const {
    filteredRows,
    total,
    search,
    setSearch,
    state,
    setState,
    status,
    setStatus,
    sort,
    setSort,
  } = useVendors();

  const [open, setOpen] = useState<DropdownType>(null);

  useEffect(() => {
    setExtraCrumbs([{ label: "Vendor" }]);

    setPageAction(
      <button
        type="button"
        onClick={() => {
          const escapeCsv = (value: unknown): string => {
            const text = String(value ?? "");
            return `"${text.replace(/"/g, '""')}"`;
          };

          const csv: string = [
            [
              "Name",
              "Company",
              "Orders",
              "Revenue",
              "Rating",
              "City",
              "State",
              "Status",
            ],
            ...filteredRows.map((row) => [
              row.owner,
              row.company,
              row.orders,
              row.revenue,
              row.rating,
              row.city,
              row.state,
              row.status,
            ]),
          ]
            .map((line) => line.map(escapeCsv).join(","))
            .join("\n");

          const blob = new Blob(["\uFEFF", csv], {
            type: "text/csv;charset=utf-8;",
          });

          const url = URL.createObjectURL(blob);
          const anchor = document.createElement("a");

          anchor.href = url;
          anchor.download = "vendors.csv";

          document.body.appendChild(anchor);
          anchor.click();
          anchor.remove();

          URL.revokeObjectURL(url);
        }}
        className="flex h-8 items-center gap-2 rounded-md bg-[#0878df] px-3 text-[10px] font-semibold text-white hover:bg-[#066bc7]"
      >
        Export
        <Download size={14} />
      </button>,
    );

    return () => {
      setPageAction(null);
      setExtraCrumbs([]);
    };
  }, [filteredRows, setExtraCrumbs, setPageAction]);

  return (
    <div className="pb-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[16px] font-bold text-ink">
          Total Vendor - {total}
        </h1>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search owner name, company"
              className="h-9 w-[275px] rounded-md bg-white pl-9 pr-3 text-[10px] outline-none placeholder:text-ink/35"
            />
          </div>

          {/* State filter */}
          <Dropdown
            value={state}
            options={states}
            open={open === "state"}
            onToggle={() =>
              setOpen((current) =>
                current === "state" ? null : "state",
              )
            }
            onSelect={(value: string) => {
              setState(value);
              setOpen(null);
            }}
            width="w-[125px]"
          />

                  {/*<button*/}
                  {/*    type="button"*/}
                  {/*    onClick={() =>*/}
                  {/*        setOpen((current) =>*/}
                  {/*            current === "status" ? null : "status",*/}
                  {/*        )*/}
                  {/*    }*/}
                  {/*    className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-ink/65 shadow-sm"*/}
                  {/*    aria-label="Filter by status"*/}
                  {/*    aria-expanded={open === "status"}*/}
                  {/*>*/}
                  {/*    <Filter size={15} />*/}
                  {/*</button>*/}

                  <span className="flex h-9 w-6 shrink-0 items-center justify-center text-ink/65">
                      <Filter size={15} />
                  </span>

          <Dropdown
            value={status}
            options={statusOptions}
            open={open === "status"}
            onToggle={() =>
              setOpen((current) =>
                current === "status" ? null : "status",
              )
            }
            onSelect={(value: string) => {
              setStatus(value);
              setOpen(null);
            }}
            width="w-[100px]"
          />

          {/*<button*/}
          {/*  type="button"*/}
          {/*  onClick={() =>*/}
          {/*    setOpen((current) =>*/}
          {/*      current === "sort" ? null : "sort",*/}
          {/*    )*/}
          {/*  }*/}
          {/*  className="flex h-9 w-9 items-center justify-center rounded-md bg-white text-ink/65 shadow-sm"*/}
          {/*  aria-label="Sort vendors"*/}
          {/*  aria-expanded={open === "sort"}*/}
          {/*>*/}
          {/*  <SlidersHorizontal size={15} />*/}
          {/*        </button>*/}

                  <span className="flex h-9 w-6 shrink-0 items-center justify-center text-ink/65">
                      <SlidersHorizontal size={15} />
                  </span>

          {/* Sort dropdown */}
          <Dropdown
            value={sort}
            options={sortOptions}
            open={open === "sort"}
            onToggle={() =>
              setOpen((current) =>
                current === "sort" ? null : "sort",
              )
            }
            onSelect={(value: string) => {
              setSort(value);
              setOpen(null);
            }}
            width="w-[145px]"
          />
        </div>
      </div>

      {/* Vendors table */}
      <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
        <CommonTable
          headers={[
            "NAME",
            "COMPANY",
            "ORDERS",
            "REVENUE",
            "RATING",
            "CITY",
            "STATE",
            "STATUS",
            "ACTION",
          ]}
          data={filteredRows.map((row) => [
            row.owner,
            row.company,
            row.orders.toLocaleString("en-IN"),
            <strong key={`revenue-${row.id}`}>
              {row.revenue}
            </strong>,
            <span
              key={`rating-${row.id}`}
              className={
                row.rating < 3 ? "text-[#ef7171]" : ""
              }
            >
              <Star size={11} className="mr-1 inline" />
              {row.rating.toFixed(1)}
            </span>,
            row.city,
            row.state,
            <span
              key={`status-${row.id}`}
              className={`rounded-full px-3 py-1.5 text-[9px] font-medium ${
                row.status === "Active"
                  ? "bg-[#eaf9ef] text-[#16b45a]"
                  : row.status === "Suspended"
                    ? "bg-[#fff0ef] text-[#ef6f6f]"
                    : "bg-[#fff8dc] text-[#d2a900]"
              }`}
            >
              {row.status}
            </span>,
            <button
              key={`action-${row.id}`}
              type="button"
              onClick={() =>
                navigate(`/admin-dashboard/vendor/${row.id}`)
              }
              className="rounded-md border border-[#76533d] px-4 py-1.5 text-[9px] font-medium text-[#76533d] hover:bg-[#76533d] hover:text-white"
            >
              Manage
            </button>,
          ])}
          rowKeys={filteredRows.map((row) => row.id)}
          minWidth={1050}
          emptyMessage="No vendors found."
        />

        {filteredRows.length === 0 && (
          <div className="p-10 text-center text-xs text-ink/50">
            No vendors found.
          </div>
        )}
      </div>
    </div>
  );
}
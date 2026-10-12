import { ChevronDown, Search, Download } from "lucide-react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useEffect } from "react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CUSTOMER_ROWS } from "../api/customerApi";
import type { CustomerRow } from "../types/customer.types";
import CommonTable from "../../../shared/components/common/CommonTable";

function Dropdown({
  value,
  options,
  onChange,
  width,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  width: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`relative ${width}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-7 w-full rounded-md border border-black/10 bg-white px-2.5 text-[10.5px] text-ink/65 flex items-center justify-between gap-2"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={11} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 z-30 min-w-full w-max rounded-lg border border-black/10 bg-white shadow-xl py-1">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 text-[10.5px] hover:bg-[#f6f2ed] whitespace-nowrap ${option === value ? "font-semibold text-brand-700" : "text-ink/65"}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: CustomerRow["status"] }) {
  return (
    <span
      className={`inline-flex px-2 py-1 rounded-full text-[9px] font-medium ${status === "Active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}
    >
      {status}
    </span>
  );
}

export default function CustomersScreen() {
  const navigate = useNavigate();
  const { setPageAction, setExtraCrumbs } = useDashboardOutletContext();
  const [query, setQuery] = useState("");
  const [state, setState] = useState("All State");
  const [sort, setSort] = useState("Name (A to Z)");

  const rows = useMemo(() => {
    const filtered = CUSTOMER_ROWS.filter((row) => {
      const matchesSearch = `${row.name} ${row.email} ${row.city}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesState = state === "All State" || row.status === state;
      return matchesSearch && matchesState;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "Name (Z to A)") return b.name.localeCompare(a.name);
      if (sort === "Highest spent") return b.totalSpent - a.totalSpent;
      if (sort === "Lowest spent") return a.totalSpent - b.totalSpent;
      if (sort === "Most orders") return b.totalOrders - a.totalOrders;
      if (sort === "Least orders") return a.totalOrders - b.totalOrders;
      return a.name.localeCompare(b.name);
    });
  }, [query, state, sort]);

  useEffect(() => {
    setExtraCrumbs([]);
    setPageAction(
      <button
        type="button"
        onClick={() => {
          const csv = [
            "Customer,Email,Age/Gender,City,Total Orders,Total Spent,Last Order,Status",
            ...rows.map((row) =>
              [
                row.name,
                row.email,
                row.ageGender,
                row.city,
                row.totalOrders,
                row.totalSpent,
                row.lastOrder,
                row.status,
              ]
                .map((value) => `"${String(value).replaceAll('"', '""')}"`)
                .join(","),
            ),
          ].join("\n");
          const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "customers.csv";
          link.click();
          URL.revokeObjectURL(url);
        }}
        className="h-8 px-3 rounded-md bg-blue-600 text-white text-[10.5px] font-semibold flex items-center gap-1.5"
      >
        <span>Export</span>
        <Download size={12} />
      </button>,
    );
    return () => setPageAction(null);
  }, [rows, setExtraCrumbs, setPageAction]);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-[16px] font-semibold text-ink">
          Total Customer - 12,987
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative w-[275px]">
            <Search
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/30"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customer name, email"
              className="h-7 w-full rounded-md border border-black/10 bg-white pl-7 pr-2.5 text-[10.5px] outline-none"
            />
          </div>
          <Dropdown
            value={state}
            options={["All State", "Active", "Blocked"]}
            onChange={setState}
            width="w-[105px]"
          />
          <Dropdown
            value={sort}
            options={[
              "Name (A to Z)",
              "Name (Z to A)",
              "Highest spent",
              "Lowest spent",
              "Most orders",
              "Least orders",
            ]}
            onChange={setSort}
            width="w-[126px]"
          />
        </div>
      </div>
      <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
        <CommonTable
          headers={[
            "CUSTOMER",
            "EMAIL",
            "AGE/GENDER",
            "CITY",
            "TOTAL ORDERS",
            "TOTAL SPENT",
            "LAST ORDER",
            "STATUS",
            "ACTION",
          ]}
          data={rows.map((row) => [
            row.name,
            <span key="email" className="truncate">
              {row.email}
            </span>,
            row.ageGender,
            row.city,
            row.totalOrders,
            `₹${row.totalSpent.toLocaleString("en-IN")}`,
            row.lastOrder,
            <StatusPill key="status" status={row.status} />,
            <button
              key="view"
              type="button"
              onClick={() => navigate(`/admin-dashboard/customers/${row.id}`)}
              className="rounded-md border border-[#9b7457] px-3 py-1 text-[10px] text-[#805b42] hover:bg-[#fbf5ef]"
            >
              View
            </button>,
          ])}
          rowKeys={rows.map((row) => row.id)}
          minWidth={1100}
          emptyMessage="No customers found."
        />
        {rows.length === 0 && (
          <div className="py-12 text-center text-xs text-ink/40">
            No customers found.
          </div>
        )}
      </div>
    </div>
  );
}

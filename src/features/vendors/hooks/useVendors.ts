import { useEffect, useMemo, useState } from "react";
import { vendorApi } from "../api/vendorApi";
import type { VendorRow } from "../types/vendor.types";

export function useVendors() {
  const [rows, setRows] = useState<VendorRow[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [state, setState] = useState("All State");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Name (A to Z)");

  useEffect(() => {
    let mounted = true;
    vendorApi
      .getList()
      .then((data) => {
        if (!mounted) return;
        setRows(data.rows);
        setTotal(data.total);
      })
      .catch((err) => {
        if (mounted)
          setError(
            err instanceof Error ? err.message : "Failed to load vendors.",
          );
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const filteredRows = useMemo(() => {
    const q = search.toLowerCase().trim();
    return rows
      .filter((row) => {
        const matchesSearch =
          !q ||
          [row.owner, row.company, row.city, row.state].some((value) =>
            value.toLowerCase().includes(q),
          );
        return (
          matchesSearch &&
          (state === "All State" || row.state === state) &&
          (status === "All" || row.status === status)
        );
      })
      .sort((a, b) => {
        if (sort === "Name (A to Z)") return a.owner.localeCompare(b.owner);
        if (sort === "Name (Z to A)") return b.owner.localeCompare(a.owner);
        if (sort === "Revenue ↑")
          return (
            Number(a.revenue.replace(/[₹L]/g, "")) -
            Number(b.revenue.replace(/[₹L]/g, ""))
          );
        if (sort === "Revenue ↓")
          return (
            Number(b.revenue.replace(/[₹L]/g, "")) -
            Number(a.revenue.replace(/[₹L]/g, ""))
          );
        if (sort === "Orders ↑") return a.orders - b.orders;
        return b.orders - a.orders;
      });
  }, [rows, search, state, status, sort]);

  return {
    rows,
    filteredRows,
    total,
    isLoading,
    error,
    search,
    setSearch,
    state,
    setState,
    status,
    setStatus,
    sort,
    setSort,
  };
}

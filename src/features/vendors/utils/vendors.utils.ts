import type { VendorRow } from "../types/vendor.types";

export function vendorRevenueValue(value: string) {
  return Number(value.replace(/[₹L]/g, ""));
}

export function sortVendorRows(rows: VendorRow[], sort: string) {
  return [...rows].sort((a, b) => {
    if (sort === "Name (A to Z)") return a.owner.localeCompare(b.owner);
    if (sort === "Name (Z to A)") return b.owner.localeCompare(a.owner);
    if (sort === "Revenue ↑")
      return vendorRevenueValue(a.revenue) - vendorRevenueValue(b.revenue);
    if (sort === "Revenue ↓")
      return vendorRevenueValue(b.revenue) - vendorRevenueValue(a.revenue);
    if (sort === "Orders ↑") return a.orders - b.orders;
    return b.orders - a.orders;
  });
}

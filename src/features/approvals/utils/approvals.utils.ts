import type { ApprovalItem } from "../types/approvals.types";

export function filterApprovals(
  items: ApprovalItem[],
  type: "all" | "vendor" | "rider",
) {
  if (type === "all") return items;
  return items.filter((item) => item.type === type);
}

export function getApprovalTypeCount(
  items: ApprovalItem[],
  type: "vendor" | "rider",
) {
  return items.filter((item) => item.type === type).length;
}

export function exportRiderApprovals(items: ApprovalItem[]) {
  const headers = [
    "Name",
    "Email",
    "Contact",
    "Vehicle",
    "Vehicle No.",
    "City",
    "State",
    "Waiting",
  ];
  const rows = items
    .filter((item) => item.type === "rider")
    .map((item) => [
      item.name,
      item.email,
      item.contact,
      item.vehicle,
      item.vehicleNumber,
      item.city,
      item.state,
      item.waiting,
    ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","),
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "rider-approvals.csv";
  link.click();
  URL.revokeObjectURL(url);
}

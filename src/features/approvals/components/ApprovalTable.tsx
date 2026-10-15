import { Eye, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import CommonTable from "../../../shared/components/common/CommonTable";
import type { ApprovalItem } from "../types/approvals.types";
interface ApprovalTableProps {
  items: ApprovalItem[];
  onReject: (item: ApprovalItem) => void;
  onApprove: (item: ApprovalItem) => void;
}
const headers = [
  "Name",
  "Contact",
  "Vehicle",
  "Vehicle No.",
  "City",
  "Status",
  "Action",
];
const widths = ["1.2fr", "1fr", "1fr", "1fr", ".85fr", ".9fr", "1.6fr"];
export default function ApprovalTable({ items }: ApprovalTableProps) {
  const data = items.map((item) => [
    <span key="name" className="font-medium">
      {item.name || "—"}
    </span>,
    item.contact || "—",
    item.vehicle || "—",
    item.vehicleNumber || "—",
    item.city || "—",
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${item.status === "REJECTED" ? "bg-[#fff0f0] text-[#d94b4b]" : "bg-[#fff7e6] text-[#b7791f]"}`}
    >
      {item.status || "PENDING"}
    </span>,
    <div key="actions" className="flex items-center gap-2">
      <Link
        to={`/admin-dashboard/approvals/${item.id}?type=rider`}
        className="inline-flex items-center gap-1.5 rounded-md border border-[#a99b8f] px-3 py-1.5 text-xs font-medium text-ink/75 hover:bg-cream"
      >
        <Eye size={13} />
        View
        {item.rejectedCount ? (
          <span className="ml-0.5 rounded-full bg-[#ed7777] px-1.5 py-0.5 text-[10px] font-bold text-white">
            {item.rejectedCount}
          </span>
        ) : null}
      </Link>
      <Link
        to={`/admin-dashboard/approvals/${item.id}?type=rider`}
        className="inline-flex items-center gap-1.5 rounded-md bg-[#2fbd66] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#28aa5b]"
      >
        <CheckCircle2 size={13} />
        Approve
      </Link>
    </div>,
  ]);
  return (
    <CommonTable
      headers={headers.map((header, i) => ({ header, width: widths[i] }))}
      data={data}
      rowKeys={items.map((item) => item.id)}
      minWidth={1050}
    />
  );
}

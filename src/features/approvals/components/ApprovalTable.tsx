import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../../shared/components/common/buttons";
import CommonTable from "../../../shared/components/common/CommonTable";
import type { ApprovalItem } from "../types/approvals.types";

interface ApprovalTableProps {
  items: ApprovalItem[];
  onReject: (item: ApprovalItem) => void;
  onApprove: (item: ApprovalItem) => void;
}

const headers = [
  "Name",
  "Email",
  "Contact",
  "Vehicle",
  "Vehicle No.",
  "City",
  "State",
  "Action",
];
const widths = [
  "1fr",
  "1.35fr",
  "1fr",
  "1fr",
  "1fr",
  ".85fr",
  ".85fr",
  "1.5fr",
];

export default function ApprovalTable({
  items,
  onReject,
  onApprove,
}: ApprovalTableProps) {
  const data = items.map((item) => [
    <span key="name">{item.name}</span>,
    <span key="email" className="truncate">
      {item.email}
    </span>,
    item.contact,
    item.vehicle,
    item.vehicleNumber,
    item.city,
    item.state,
    <div key="actions" className="flex items-center gap-2">
      <Button
        variant="danger"
        size="sm"
        onClick={() => onReject(item)}
        className="bg-[#ed7777]"
      >
        Reject
      </Button>
      <Button
        variant="success"
        size="sm"
        onClick={() => onApprove(item)}
        className="bg-[#2fbd66]"
      >
        Approve
      </Button>
      <Link
        to={`/admin-dashboard/approvals/${item.id}`}
        className="inline-flex items-center gap-1 rounded-md border border-[#a99b8f] px-3 py-1.5 text-xs text-ink/70 hover:bg-cream"
      >
        View
      </Link>
    </div>,
  ]);
  return (
    <CommonTable
      headers={headers.map((header, i) => ({ header, width: widths[i] }))}
      data={data}
      rowKeys={items.map((item) => item.id)}
      minWidth={1260}
    />
  );
}

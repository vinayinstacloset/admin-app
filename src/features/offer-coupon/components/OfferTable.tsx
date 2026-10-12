import { Pencil } from "lucide-react";
import type { Offer } from "../types/offerCoupon.types";
import {
  formatDateRange,
  formatNumber,
  getOfferStatus,
} from "../utils/offerCoupon.utils";
import CommonTable from "../../../shared/components/common/CommonTable";

interface Props {
  rows: Offer[];
  onEdit: (row: Offer) => void;
  emptyMessage: string;
}

export default function OfferTable({ rows, onEdit, emptyMessage }: Props) {
  const headers = [
    "OFFER IMAGE",
    "PLACEMENT",
    "GENDER",
    "START & END DATE",
    "STATUS",
    "DISCOUNT",
    "CLICK RATE",
    "ACTION",
  ].map((header, index) => ({
    header,
    width: [
      "1.05fr",
      "1.05fr",
      ".85fr",
      "1.25fr",
      ".85fr",
      ".8fr",
      ".95fr",
      ".7fr",
    ][index],
  }));
  const data = rows.map((row) => {
    const status = getOfferStatus(row.startDate, row.endDate);
    return [
      <img
        key="image"
        src={row.imageUrl}
        alt="Offer"
        style={{ width: 110, height: 58, objectFit: "cover", borderRadius: 5 }}
      />,
      row.placement,
      row.gender || "-",
      formatDateRange(row.startDate, row.endDate),
      <span
        key="status"
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 11px",
          borderRadius: 14,
          fontSize: 10,
          ...(status === "active"
            ? { background: "#edf9f1", color: "#1fc260" }
            : status === "scheduled"
              ? { background: "#f8edff", color: "#a32cff" }
              : { background: "#fff0f0", color: "#e05252" }),
        }}
      >
        {status === "active"
          ? "Active"
          : status === "scheduled"
            ? "Scheduled"
            : "Expired"}
      </span>,
      <span key="discount" style={{ color: "#ff5c63", fontWeight: 600 }}>
        {row.discount === null ? "-" : `${row.discount}%`}
      </span>,
      <strong key="click">
        {row.clickRate === null ? "-" : formatNumber(row.clickRate)}
      </strong>,
      <div key="action" className="flex items-center justify-center gap-3">
        {status === "active" && (
          <span
            aria-label="Offer is active"
            className="relative inline-flex h-6 w-[42px] rounded-full bg-[#22C55E]"
          >
            <span className="absolute left-[21px] top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow" />
          </span>
        )}
        <button
          type="button"
          onClick={() => onEdit(row)}
          aria-label="Edit offer"
          className="inline-flex h-[25px] w-[25px] items-center justify-center rounded text-[#4c4844] hover:bg-[#f0eeec]"
        >
          <Pencil size={15} />
        </button>
      </div>,
    ];
  });
  return (
    <CommonTable
      headers={headers}
      data={data}
      rowKeys={rows.map((row) => row.id)}
      minWidth={1100}
      emptyMessage={emptyMessage}
      cellClassName="py-4"
    />
  );
}

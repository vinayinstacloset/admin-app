import { Pencil } from "lucide-react";
import type { Coupon } from "../types/offerCoupon.types";
import { formatDate, formatNumber } from "../utils/offerCoupon.utils";
import CommonTable from "../../../shared/components/common/CommonTable";

export default function CouponTable({
  rows,
  onEdit,
}: {
  rows: Coupon[];
  onEdit: (row: Coupon) => void;
}) {
  const headers = [
    "TITLE",
    "DISCOUNT",
    "CODE",
    "EXPIRY DATE",
    "USED COUNT",
    "ACTION",
  ].map((header, index) => ({
    header,
    width: ["1.35fr", ".8fr", "1.15fr", "1.15fr", "1fr", ".65fr"][index],
  }));
  const data = rows.map((row) => [
    row.title,
    <span key="discount" style={{ color: "#df5d5d", fontWeight: 700 }}>
      {row.discount}%
    </span>,
    row.code,
    formatDate(row.expiryDate),
    <strong key="count">{formatNumber(row.usedCount)}</strong>,
    <button
      key="edit"
      type="button"
      onClick={() => onEdit(row)}
      aria-label="Edit coupon"
      className="inline-flex h-[25px] w-[25px] items-center justify-center rounded text-[#4c4844] hover:bg-[#f0eeec]"
    >
      <Pencil size={15} />
    </button>,
  ]);
  return (
    <CommonTable
      headers={headers}
      data={data}
      rowKeys={rows.map((row) => row.id)}
      minWidth={900}
    />
  );
}

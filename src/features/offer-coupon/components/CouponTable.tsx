import { Pencil } from "lucide-react";
import type { Coupon } from "../types/offerCoupon.types";
import { formatDate, formatNumber } from "../utils/offerCoupon.utils";

interface Props {
  rows: Coupon[];
  onEdit: (row: Coupon) => void;
}

export default function CouponTable({ rows, onEdit }: Props) {
  return (
    <div className="oc-table-card">
      <div className="oc-table oc-coupon-table">
        <div className="oc-thead">
          <span>TITLE</span>
          <span>DISCOUNT</span>
          <span>CODE</span>
          <span>EXPIRY DATE</span>
          <span>USED COUNT</span>
          <span>ACTION</span>
        </div>
        {rows.map((row) => (
          <div className="oc-tr" key={row.id}>
            <div>{row.title}</div>
            <div className="oc-discount-value">{row.discount}%</div>
            <div>{row.code}</div>
            <div>{formatDate(row.expiryDate)}</div>
            <div className="oc-used-count">{formatNumber(row.usedCount)}</div>
            <div className="oc-action-cell">
              <button
                type="button"
                className="oc-edit-icon"
                onClick={() => onEdit(row)}
                aria-label="Edit coupon"
              >
                <Pencil size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

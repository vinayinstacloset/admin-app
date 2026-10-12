import { statusStyle } from "../utils/livedelivery.utils";
import type { DeliveryItem } from "../types/livedelivery.types";
import CommonTable from "../../../shared/components/common/CommonTable";

export default function ActiveDeliveriesTable({
  deliveries,
  onTrack,
  onReassign,
}: {
  deliveries: DeliveryItem[];
  onTrack: (item: DeliveryItem) => void;
  onReassign: (item: DeliveryItem) => void;
}) {
  const headers = [
    "Order",
    "Rider",
    "Customer",
    "Amount",
    "ETA",
    "Status",
    "Action",
  ].map((header, index) => ({
    header,
    width: ["1fr", "1.2fr", "1.35fr", ".9fr", ".8fr", "1fr", "1fr"][index],
  }));
  const data = deliveries.map((item) => {
    const style = statusStyle(item.status);
    return [
      <strong key="order">{item.id}</strong>,
      item.rider,
      item.customer,
      <strong key="amount">{item.amount}</strong>,
      <span
        key="eta"
        style={{
          color:
            item.status === "Delayed"
              ? "#ef7171"
              : item.status === "On time"
                ? "#16b45a"
                : "#8c4bc4",
          fontWeight: 700,
        }}
      >
        {item.eta}
      </span>,
      <span
        key="status"
        style={{
          padding: "5px 11px",
          borderRadius: 999,
          background: style.background,
          color: style.color,
          fontSize: 9,
          fontWeight: 700,
        }}
      >
        {item.status}
      </span>,
      <div key="actions" className="flex items-center gap-2">
        {item.status === "Delayed" && (
          <button
            type="button"
            onClick={() => onReassign(item)}
            style={buttonStyle}
          >
            Reassign
          </button>
        )}
        <button type="button" onClick={() => onTrack(item)} style={buttonStyle}>
          Track
        </button>
      </div>,
    ];
  });
  return (
    <CommonTable
      headers={headers}
      data={data}
      rowKeys={deliveries.map((item) => item.id)}
      minWidth={900}
    />
  );
}

const buttonStyle: React.CSSProperties = {
  border: "1px solid #76533d",
  background: "#fff",
  color: "#76533d",
  borderRadius: 5,
  padding: "5px 9px",
  fontSize: 9,
  cursor: "pointer",
};

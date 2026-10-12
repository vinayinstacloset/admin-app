import { Package } from "lucide-react";
import type { Delivery } from "../data/mockData";
import CommonTable from "../../../shared/components/common/CommonTable";

interface Props {
  items: Delivery[];
  onView: (item: Delivery) => void;
  onTrack: (item: Delivery) => void;
}

export default function DeliveryTable({ items, onView, onTrack }: Props) {
  const data = items.map((item) => [
    <div key="order">
      <div className="font-bold">#{item.id}</div>
      <span className="block mt-1 text-[8px] text-[#888]">
        2 Items · 20 min ago
      </span>
    </div>,
    <div key="customer">
      <b className="block max-w-[170px] truncate">{item.customer}</b>
      <span className="block mt-1 text-[8px] text-[#888]">
        ⌖ {item.customerAddress}
      </span>
    </div>,
    <div key="store">
      <b className="block max-w-[170px] truncate">{item.store}</b>
      <span className="block mt-1 text-[8px] text-[#888]">{item.city}</span>
    </div>,
    <div key="item">
      <b className="block max-w-[170px] truncate">{item.item}</b>
      <span className="mt-1 block text-[8px] text-[#888]">
        <Package size={11} className="mr-1 inline align-middle" />
        {item.itemMeta}
      </span>
    </div>,
    <span
      key="status"
      className={`inline-flex w-max rounded-xl px-3 py-1 text-[8px] ${item.status === "On the way" ? "bg-[#f1e7ff] text-[#9749df]" : "bg-[#fff0e9] text-[#ff6b42]"}`}
    >
      {item.status}
    </span>,
    item.amount,
    <div key="action" className="flex gap-2">
      {item.status === "On the way" && (
        <button type="button" onClick={() => onTrack(item)} style={actionStyle}>
          Track
        </button>
      )}
      <button type="button" onClick={() => onView(item)} style={actionStyle}>
        View details
      </button>
    </div>,
  ]);
  return (
    <CommonTable
      headers={[
        "ORDER",
        "CUSTOMER",
        "STORE",
        "ITEM",
        "STATUS",
        "AMOUNT",
        "ACTION",
      ]}
      data={data}
      rowKeys={items.map((item) => item.id)}
      minWidth={1100}
      emptyMessage="No deliveries found."
    />
  );
}

const actionStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #8a5a32",
  color: "#6d472c",
  borderRadius: 6,
  padding: "5px 8px",
  fontSize: 9,
  display: "flex",
  alignItems: "center",
  gap: 3,
};

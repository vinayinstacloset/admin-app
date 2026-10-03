import { Eye, MapPin, Package } from "lucide-react";
import type { Delivery } from "../data/mockData";

interface Props {
  items: Delivery[];
  onView: (item: Delivery) => void;
  onTrack: (item: Delivery) => void;
}

export default function DeliveryTable({ items, onView, onTrack }: Props) {
  return (
    <div className="rider-table-wrap delivery-table-wrap">
      <table className="rider-table delivery-table">
        <thead>
          <tr>
            <th>ORDER</th>
            <th>CUSTOMER</th>
            <th>STORE</th>
            <th>ITEM</th>
            <th>STATUS</th>
            <th>AMOUNT</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="delivery-order-id">#{item.id}</div>
                <span className="delivery-subtext">2 Items · 20 min ago</span>
              </td>
              <td>
                <b>{item.customer}</b>
                <span>
                  <span className="pin-text">⌖</span> {item.customerAddress}
                </span>
              </td>
              <td>
                <b>{item.store}</b>
                <span>{item.city}</span>
              </td>
              <td>
                <b>{item.item}</b>
                <span className="item-meta">
                  <Package size={11} /> {item.itemMeta}
                </span>
              </td>
              <td>
                <span
                  className={`delivery-status ${item.status === "On the way" ? "on-way" : "delivered"}`}
                >
                  {item.status}
                </span>
              </td>
              <td className="font-semibold">{item.amount}</td>
              <td>
                <div className="rider-actions">
                  {item.status === "On the way" && (
                    <button
                      className="track-action"
                      onClick={() => onTrack(item)}
                    >
                      Track
                    </button>
                  )}
                  <button
                    className="view-detail-action"
                    onClick={() => onView(item)}
                  >
                    View details
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
        <div className="empty-state">No deliveries found.</div>
      )}
    </div>
  );
}

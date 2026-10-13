import { useEffect, useState, type ReactNode } from "react";
import { Mail, Phone, Star, X } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { getCustomerOrderDetail } from "../api/customerApi";
import type { CustomerOrderDetail } from "../types/customer.types";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";

function ProductCard({
  detail,
  exchange,
}: {
  detail: CustomerOrderDetail;
  exchange?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-black/5 p-4 flex gap-4">
      <div className="w-[165px] h-[180px] rounded-lg bg-gradient-to-br from-[#e9e5df] to-[#cfc8bf] flex items-center justify-center text-[60px]">
        👕
      </div>
      <div className="flex-1">
        <h3 className="text-[15px] font-semibold text-ink">
          {detail.productName}
        </h3>
        <p className="text-[10px] text-ink/45 mt-1">
          88 T-Shirt · {detail.size} · {detail.color}
        </p>
        <p className="text-[10.5px] text-ink/65 mt-4 leading-5">
          A versatile, casual garment named for its T-shaped body and sleeves,
          typically featuring a crew neck and short sleeves without buttons or
          collars.
        </p>
        <div className="mt-4 flex items-end gap-3">
          <span className="text-[16px] font-semibold">
            ₹{detail.price.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] text-ink/35 line-through">₹2,649</span>
          <span className="text-[10px] text-green-600">
            {detail.discount}% off
          </span>
        </div>
        {exchange && (
          <p className="mt-4 text-[11px] font-semibold text-brand-700">
            Exchanged item
          </p>
        )}
      </div>
    </div>
  );
}

function PersonCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-[12px] font-semibold text-ink mb-2">{title}</p>
      <div className="bg-white rounded-xl border border-black/5 p-3">
        {children}
      </div>
    </div>
  );
}

function ActionButton({
  label,
  tone = "green",
  onClick,
}: {
  label: string;
  tone?: "green" | "red" | "brown";
  onClick?: () => void;
}) {
  const cls =
    tone === "red"
      ? "bg-[#e87373]"
      : tone === "brown"
        ? "bg-[#805b42]"
        : "bg-[#3cbe69]";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 px-4 rounded-md text-white text-[10.5px] font-semibold ${cls}`}
    >
      {label}
    </button>
  );
}

function ItemModal({
  detail,
  onClose,
}: {
  detail: CustomerOrderDetail;
  onClose: () => void;
}) {
  const items = [
    { name: `${detail.productName} (${detail.size})`, price: detail.price },
    { name: "Alone dark blue t-shirt (L)", price: 499 },
  ];
  return (
    <div
      className="fixed inset-0 z-[90] bg-black/30 flex items-center justify-center p-5"
      onMouseDown={onClose}
    >
      <div
        className="w-[500px] max-w-full rounded-xl bg-white shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
          <div>
            <p className="text-[14px] font-semibold">Order items</p>
            <p className="text-[10px] text-ink/45 mt-0.5">
              View all items in this order
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-black/5"
          >
            <X size={15} />
          </button>
        </div>
        <div className="p-4 space-y-2">
          {items.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex items-center gap-3 border border-black/5 rounded-lg p-3"
            >
              <div className="w-12 h-12 rounded-lg bg-[#ead0ca] flex items-center justify-center text-[22px]">
                👕
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-semibold">{item.name}</p>
                <p className="text-[9px] text-ink/45">Item {index + 1}</p>
              </div>
              <b className="text-[11px]">
                ₹{item.price.toLocaleString("en-IN")}
              </b>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-black/5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded-md border border-[#80634f] text-[#6f513e] text-[10.5px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CustomerOrderDetailsScreen({
  kind,
}: {
  kind: "order" | "return" | "exchange";
}) {
  const { customerId = "1", orderId = "OD-5490" } = useParams<{
    customerId: string;
    orderId: string;
  }>();
  const location = useLocation();
  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();
  const [detail, setDetail] = useState<CustomerOrderDetail | null>(null);
  const [status, setStatus] = useState<string>(
    (location.state as { status?: string } | null)?.status ??
      (kind === "order"
        ? "Delivered"
        : kind === "return"
          ? "Collected"
          : "Exchanged"),
  );
  const [itemModalOpen, setItemModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setExtraCrumbs([
      { label: "Customers", to: "/admin-dashboard/customers" },
      {
        label: "Priya Mehta details",
        to: `/admin-dashboard/customers/${customerId}`,
      },
      { label: `#${orderId}` },
    ]);
    getCustomerOrderDetail(kind, `#${orderId}`).then((data) => {
      if (active) setDetail(data);
    });
    return () => {
      active = false;
      setExtraCrumbs([]);
    };
  }, [customerId, orderId, kind, setExtraCrumbs]);

  useEffect(() => {
    if (!detail) return;
    const updateStatus = (next: string) => setStatus(next);
    const actions =
      kind === "order" ? (
        status === "New" ? (
          <div className="flex gap-2">
            <ActionButton
              label="Reject"
              tone="red"
              onClick={() => updateStatus("Rejected")}
            />
            <ActionButton
              label="Accept"
              onClick={() => updateStatus("Packing")}
            />
          </div>
        ) : status === "Packing" ? (
          <ActionButton
            label="Mark as Ready"
            onClick={() => updateStatus("Ready")}
          />
        ) : status === "Ready" ? (
          <span className="text-[10.5px] text-ink/60">ETA: 12:30 PM</span>
        ) : status === "On the way" ? (
          <ActionButton label="Reassign rider" tone="brown" />
        ) : status === "Delivered" ? (
          <span className="text-[10.5px] text-ink/60">★ 5/5 rating</span>
        ) : (
          <span className="text-[10.5px] text-ink/60">20th Apr, 12:35 PM</span>
        )
      ) : kind === "return" ? (
        status === "Collected" ? (
          <div className="flex items-center gap-2 px-2">
            <span className="text-[9px] text-ink/45 leading-3">Refunded</span>
            <span className="text-[13px] font-semibold text-ink">
              ₹{detail.price.toLocaleString("en-IN")}
            </span>
          </div>
        ) : null
      ) : null;
    setPageAction(actions);
    return () => setPageAction(null);
  }, [detail, kind, setPageAction, status]);

  if (!detail)
    return (
      <div className="py-20 text-center text-xs text-ink/40">
        Loading order...
      </div>
    );

  if (kind === "order") {
    return (
      <div>
        <div className="text-center py-3 mb-4">
          <div className="text-[70px] leading-none">📦</div>
          <p className="text-[16px] font-semibold text-ink mt-2">
            {status === "Delivered"
              ? detail.title
              : `Order ${status.toLowerCase()}`}
          </p>
        </div>
        <div className="grid grid-cols-[1fr_360px] gap-4 mb-4">
          <div>
            <p className="text-[13px] font-semibold mb-2">Price details</p>
            <div className="bg-white rounded-xl border border-black/5 p-4 space-y-3 text-[11px]">
              <div className="flex justify-between">
                <span>MRP</span>
                <b>₹1,589</b>
              </div>
              <div className="flex justify-between">
                <span>GST</span>
                <b>₹50</b>
              </div>
              <div className="border-t border-black/5 pt-3 flex justify-between text-[13px]">
                <span>Total</span>
                <b>₹1,709</b>
              </div>
              <div className="flex justify-between text-red-400">
                <span>Rider payout</span>
                <span>-₹39</span>
              </div>
              <div className="flex justify-between text-red-400">
                <span>Vendor payout</span>
                <span>-₹1,641</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Platform commission</span>
                <span>+₹29</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[13px] font-semibold mb-2">Customer feedback</p>
            <div className="bg-white rounded-xl border border-black/5 p-4">
              <div className="flex items-center gap-2">
                <Star size={16} fill="#eab308" className="text-yellow-500" />
                <b className="text-[19px]">5</b>
                <span className="text-[11px] text-ink/40">/5</span>
              </div>
              <div className="border-t border-black/5 mt-3 pt-3 text-[11px] leading-5">
                “{detail.feedback}”
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <PersonCard title="Vendor details">
            <div className="flex items-center gap-3">
              <div className="w-14 h-10 rounded bg-[#d7c6a8] flex items-center justify-center text-[18px]">
                🏬
              </div>
              <b>{detail.vendor.name}</b>
            </div>
            <div className="border-t border-black/5 mt-3 pt-3 flex justify-between text-[10.5px] text-ink/65">
              <span>
                <Mail size={12} className="inline mr-1" />
                {detail.vendor.email}
              </span>
              <span>
                <Phone size={12} className="inline mr-1" />
                {detail.vendor.phone}
              </span>
            </div>
          </PersonCard>
          <PersonCard title="Rider details">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f2b84b] flex items-center justify-center">
                👨
              </div>
              <b>{detail.rider.name}</b>
            </div>
            <div className="border-t border-black/5 mt-3 pt-3 flex justify-between text-[10.5px] text-ink/65">
              <span>
                <Phone size={12} className="inline mr-1" />
                {detail.rider.phone}
              </span>
              <span>
                <Star size={12} className="inline mr-1" />
                {detail.rider.rating}
              </span>
            </div>
          </PersonCard>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] font-semibold">Item</p>
              <button
                type="button"
                onClick={() => setItemModalOpen(true)}
                className="text-[10px] text-blue-600 underline"
              >
                View details
              </button>
            </div>
            <div className="bg-white rounded-xl border border-black/5 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded bg-[#d88c85] flex items-center justify-center">
                  👕
                </div>
                <span className="text-[10.5px]">Red T-shirt (M)</span>
                <b className="ml-auto text-[10px]">₹1,099</b>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded bg-[#5f6b7b] flex items-center justify-center">
                  👕
                </div>
                <span className="text-[10.5px]">dark blue t-shirt (L)</span>
                <b className="ml-auto text-[10px]">₹499</b>
              </div>
            </div>
          </div>
        </div>
        {itemModalOpen && (
          <ItemModal detail={detail} onClose={() => setItemModalOpen(false)} />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="text-center py-3 mb-4">
        <div className="text-[68px] leading-none">
          {kind === "return" ? "📦" : "👕"}
        </div>
        <p className="text-[15px] font-semibold mt-2">
          {kind === "return" ? detail.eventText : detail.eventText}
        </p>
      </div>
      {kind === "return" ? (
        <div className="grid grid-cols-[1fr_1fr] gap-4">
          <div>
            <p className="text-[12px] font-semibold mb-2">Reason</p>
            <div className="bg-white rounded-xl border border-black/5 p-4 text-[11px]">
              {detail.reason}
            </div>
            <p className="text-[12px] font-semibold mt-4 mb-2">Item</p>
            <ProductCard detail={detail} />
          </div>
          <div>
            <PersonCard title="Vendor details">
              <div className="flex items-center gap-3">
                <div className="w-14 h-10 rounded bg-[#d7c6a8] flex items-center justify-center">
                  🏬
                </div>
                <b>{detail.vendor.name}</b>
              </div>
              <div className="border-t border-black/5 mt-3 pt-3 flex justify-between text-[10px]">
                <span>{detail.vendor.email}</span>
                <span>{detail.vendor.phone}</span>
              </div>
            </PersonCard>
            <div className="mt-4">
              <PersonCard title="Rider details">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f2b84b] flex items-center justify-center">
                    👨
                  </div>
                  <b>{detail.rider.name}</b>
                </div>
                <div className="border-t border-black/5 mt-3 pt-3 flex justify-between text-[10px]">
                  <span>{detail.rider.phone}</span>
                  <span>★ {detail.rider.rating}</span>
                </div>
              </PersonCard>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-4">
            <ProductCard detail={detail} />
            <ProductCard
              detail={{
                ...detail,
                productName: detail.productName,
                size: "YL",
                color: "Red",
              }}
              exchange
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <PersonCard title="Vendor details">
              <div className="flex items-center gap-3">
                <div className="w-14 h-10 rounded bg-[#d7c6a8] flex items-center justify-center">
                  🏬
                </div>
                <b>{detail.vendor.name}</b>
              </div>
              <div className="border-t border-black/5 mt-3 pt-3 text-[10px]">
                {detail.vendor.email} · {detail.vendor.phone}
              </div>
            </PersonCard>
            <PersonCard title="Rider details">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f2b84b] flex items-center justify-center">
                  👨
                </div>
                <b>{detail.rider.name}</b>
              </div>
              <div className="border-t border-black/5 mt-3 pt-3 text-[10px]">
                {detail.rider.phone} · ★ {detail.rider.rating}
              </div>
            </PersonCard>
          </div>
        </div>
      )}
    </div>
  );
}

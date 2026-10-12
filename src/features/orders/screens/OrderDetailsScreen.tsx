import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Mail, MapPin, Phone, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { getOrderDetail } from "../data";
import { getOrderRejectionReason, getOrderStatus, setOrderRejectionReason, setOrderStatus } from "../orderState";
import type { OrderDetail, OrderStatus } from "../types/order.types";
import DeliveryMap from "../components/DeliveryMap";
import OrderConfirmModal from "../components/OrderConfirmModal";
import RejectOrderModal from "../components/RejectOrderModal";
import AssignRiderModal from "../components/AssignRiderModal";

const statusClass: Record<OrderStatus, string> = {
  New: "bg-[#edf6ff] text-[#1481ee]",
  Packing: "bg-[#fffbe5] text-[#e3bd00]",
  Ready: "bg-[#ecfbf1] text-[#22b962]",
  "On the way": "bg-[#f5eaff] text-[#a24ae8]",
  Delivered: "bg-[#fff0eb] text-[#ef765c]",
  Rejected: "bg-[#fff0f0] text-[#ed7373]",
};

function ProductCard({ item }: { item: OrderDetail["items"][number] }) {
  return <div className="flex min-h-[280px] gap-4 rounded-lg bg-white p-4"><div className="relative h-[250px] w-[250px] shrink-0 overflow-hidden rounded-lg bg-[#eee]"><img src={item.image} alt={item.title} className="h-full w-full object-cover"/><button type="button" className="absolute left-2 top-1/2 -translate-y-1/2 text-ink/60"><ChevronLeft size={20}/></button><button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-ink/60"><ChevronRight size={20}/></button><div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1"><span className="h-1.5 w-1.5 rounded-full bg-white"/><span className="h-1.5 w-1.5 rounded-full bg-white/50"/><span className="h-1.5 w-1.5 rounded-full bg-white/50"/></div></div><div className="min-w-0 flex-1 pt-2"><h3 className="max-w-[300px] text-[16px] font-bold leading-5 text-ink">{item.title}</h3><div className="mt-3 flex flex-wrap gap-5 text-[11px] text-ink/70"><span>▦ {item.tags[0]}</span><span>♢ {item.tags[1]}</span><span>◉ {item.tags[2]}</span></div><p className="mt-5 text-[10px] text-ink/45">Description:</p><p className="mt-1 max-w-[360px] text-[11px] leading-4 text-ink/75">{item.description}</p><div className="mt-3 flex items-end gap-2"><b className="text-[17px]">{item.price}</b><span className="text-[10px] text-ink/35 line-through">{item.mrp}</span><span className="text-[10px] text-[#ef765c]">♧ {item.discount}</span></div></div></div>;
}

function InfoCard({ title, person, vendor = false }: { title: string; person: OrderDetail["customer"]; vendor?: boolean }) {
  return <div><p className="mb-2 text-[14px] font-semibold">{title}</p><div className="rounded-lg bg-white p-3"><div className="flex items-center gap-3"><img src={person.avatar} alt="" className={`${vendor ? "h-10 w-28 rounded" : "h-11 w-11 rounded-full"} object-cover`}/><b className="text-[16px]">{person.name}</b><button type="button" className="ml-auto text-[9px] text-blue-600 underline">View details›</button></div><div className="mt-2 flex justify-between border-t border-black/10 pt-3 text-[10px] text-ink/65"><span><Mail size={12} className="mr-1 inline"/>{person.email}</span><span><Phone size={12} className="mr-1 inline"/>{person.phone}</span></div></div></div>;
}

function PriceCard({ price }: { price: OrderDetail["priceDetails"] }) {
  const row = (label: string, value: string, cls = "") => <div className="flex items-center justify-between border-b border-black/10 py-3 last:border-0"><span>{label}</span><b className={cls}>{value}</b></div>;
  return <div><p className="mb-2 text-[14px] font-semibold">Price details</p><div className="rounded-lg bg-white px-5 py-2 text-[12px]">{row("MRP", price.mrp)}{row("GST", price.gst)}{row("Total", price.total)}{row("Vendor payout", price.vendorPayout, "text-[#ef7373]")}{row("Rider payout", price.riderPayout, "text-[#ef7373]")}{row("Platform commission", price.platformCommission, "text-[#22b962]")}</div></div>;
}

function RiderCard({ detail }: { detail: OrderDetail }) {
  if (!detail.rider) return null;
  return <div><p className="mb-2 text-[14px] font-semibold">Rider details</p><div className="rounded-lg bg-white p-3"><div className="flex items-center gap-3"><img src={detail.rider.avatar} alt="" className="h-11 w-11 rounded-full object-cover"/><b className="text-[17px]">{detail.rider.name}</b><button type="button" className="ml-auto text-[9px] text-blue-600 underline">View details›</button></div><div className="mt-2 flex justify-between border-t border-black/10 pt-3 text-[10px] text-ink/65"><span><Phone size={12} className="mr-1 inline"/>{detail.rider.phone}</span><span><Star size={12} className="mr-1 inline"/>{detail.rider.rating}</span></div></div></div>;
}

export default function OrderDetailsScreen() {
  const { orderId = "DD-5428" } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();
  const state = location.state as { source?: { label: string; to: string; parentLabel?: string; parentTo?: string; rootLabel?: string; rootTo?: string }; status?: OrderStatus; riderState?: "reached" | "on-way" | "not-accepted"; row?: { rider?: string; riderState?: "reached" | "on-way" | "not-accepted" } } | null;
  const initialStatus = state?.status ?? "New";
  const [status, setStatus] = useState<OrderStatus>(() => getOrderStatus(orderId, initialStatus));
  const [confirm, setConfirm] = useState<"accept" | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [assignedRider, setAssignedRider] = useState<string | null>(null);
  const detail = useMemo(() => {
    const base = getOrderDetail(`#${orderId.replace("#", "")}`, status, state?.riderState ?? state?.row?.riderState);
    if (!assignedRider || !base.rider) return base;
    return { ...base, rider: { ...base.rider, name: assignedRider } };
  }, [assignedRider, orderId, state?.riderState, state?.row?.riderState, status]);

  useEffect(() => {
    const source = state?.source;
    if (source?.rootLabel && source.rootTo && source.parentLabel && source.parentTo) setExtraCrumbs([{ label: source.rootLabel, to: source.rootTo }, { label: source.parentLabel, to: source.parentTo }, { label: source.label, to: source.to }, { label: detail.id, badge: status }]);
    else if (source?.parentLabel && source.parentTo) setExtraCrumbs([{ label: source.parentLabel, to: source.parentTo }, { label: source.label, to: source.to }, { label: detail.id, badge: status }]);
    else if (source) setExtraCrumbs([{ label: source.label, to: source.to }, { label: detail.id, badge: status }]);
    else setExtraCrumbs([{ label: "Orders", to: "/admin-dashboard/orders" }, { label: detail.id, badge: status }]);
    return () => setExtraCrumbs([]);
  }, [detail.id, setExtraCrumbs, state?.source, status]);

  useEffect(() => {
    const update = (next: OrderStatus) => { setOrderStatus(orderId, next); setStatus(next); setConfirm(null); };
    if (status === "New") setPageAction(<div className="flex gap-2"><button type="button" onClick={() => setRejectOpen(true)} className="h-8 rounded-md bg-[#e87373] px-4 text-[10px] font-semibold text-white">Reject</button><button type="button" onClick={() => setConfirm("accept")} className="h-8 rounded-md bg-[#39be69] px-4 text-[10px] font-semibold text-white">Accept</button></div>);
    else if (status === "Ready" && detail.riderState === "not-accepted") setPageAction(<button type="button" onClick={() => setAssignOpen(true)} className="h-8 rounded-md border border-[#805b42] bg-white px-4 text-[10px] font-semibold text-[#805b42]">Assign rider</button>);
    else if (status === "Ready" && detail.riderState === "on-way") setPageAction(<button type="button" onClick={() => setShowLocation(true)} className="h-8 rounded-md bg-[#805b42] px-4 text-[10px] font-semibold text-white">Check location</button>);
    else if (status === "Ready" && detail.riderState === "reached") setPageAction(<button type="button" disabled className="h-8 rounded-md bg-[#805b42] px-4 text-[10px] font-semibold text-white opacity-90">Rider reached the store</button>);
    else if (status === "On the way") setPageAction(<button type="button" onClick={() => setAssignOpen(true)} className="h-8 rounded-md bg-[#805b42] px-4 text-[10px] font-semibold text-white">Reassign order</button>);
    else setPageAction(null);
    return () => setPageAction(null);
  }, [detail.riderState, setPageAction, status]);

  const goBack = () => navigate(-1);

  return <div className="pb-8">
    {status === "Packing" && <div className="mb-5 flex flex-col items-center pt-2"><img src="/orders-reference/packing-illustration.jpg" alt="" className="h-[145px] w-[190px] object-contain"/><p className="text-[13px] font-semibold">Vendor is preparing the order right now.</p></div>}
    {status === "Ready" && <div className="mb-5 flex flex-col items-center pt-2"><img src="/orders-reference/ready-illustration.jpg" alt="" className="h-[145px] w-[190px] object-contain"/><p className="text-[13px] font-semibold">{detail.riderState === "reached" ? "Rider has reached the store." : detail.riderState === "on-way" ? "Rider is on the way." : "Rider is not accepted yet."}</p></div>}
    {status === "Delivered" && <div className="mb-5 flex flex-col items-center pt-2"><img src="/orders-reference/delivered-illustration.jpg" alt="" className="h-[145px] w-[190px] object-contain"/><p className="text-[14px] font-semibold">Order delivered on {detail.deliveredAt}</p></div>}
    {status === "Rejected" && <div className="mb-5"><p className="mb-2 text-[14px] font-semibold">Reason</p><div className="rounded-lg bg-white px-4 py-3 text-[11px] text-ink/75">{getOrderRejectionReason(orderId, detail.rejectedReason)}</div></div>}
    {(status === "On the way" || (status === "Ready" && showLocation)) && <div id="order-map"><DeliveryMap rider={detail.riderLocation} customer={detail.customerLocation} eta={detail.eta}/></div>}

    <div className="mb-3 text-[14px] font-semibold">Items - {detail.items.length}</div>
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">{detail.items.map((item) => <ProductCard key={item.id} item={item}/>)}</div>

    {status === "Rejected" ? <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr_365px]"><InfoCard title="Customer" person={detail.customer}/><InfoCard title="Vendor" person={detail.vendor} vendor/><PriceCard price={detail.priceDetails}/></div> : <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr_365px]"><div><InfoCard title="Customer" person={detail.customer}/>{(status === "On the way" || status === "Delivered" || status === "Ready") && <div className="mt-5"><RiderCard detail={detail}/></div>}</div><div><InfoCard title="Vendor" person={detail.vendor} vendor/>{status === "Delivered" && detail.feedback && <div className="mt-5"><p className="mb-2 text-[14px] font-semibold">Customer feedback</p><div className="rounded-lg bg-white p-4"><div className="flex items-center gap-2"><Star size={17} fill="#eab308" className="text-yellow-500"/><b className="text-[20px]">{detail.feedback.rating}</b><span className="text-[11px] text-ink/40">/5</span></div><p className="mt-3 border-t border-black/10 pt-3 text-[11px] leading-4">“{detail.feedback.text}”</p></div></div>}</div><PriceCard price={detail.priceDetails}/></div>}

    <OrderConfirmModal open={confirm === "accept"} title="Accept order" message="Are you sure you want to accept this order?" tone="green" onClose={() => setConfirm(null)} onConfirm={() => { setOrderStatus(orderId, "Packing"); setStatus("Packing"); setConfirm(null); }}/>
    <RejectOrderModal open={rejectOpen} orderId={orderId} onClose={() => setRejectOpen(false)} onConfirm={(reason) => { setOrderRejectionReason(orderId, reason); setOrderStatus(orderId, "Rejected"); setStatus("Rejected"); setRejectOpen(false); }}/>
    <AssignRiderModal open={assignOpen} title={status === "On the way" ? "Reassign rider" : "Assign rider"} onClose={() => setAssignOpen(false)} onConfirm={(rider) => { setAssignedRider(rider); setAssignOpen(false); if (status === "Ready") { setStatus("Ready"); } }}/>
  </div>;
}

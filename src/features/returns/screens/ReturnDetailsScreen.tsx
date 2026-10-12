import { Check, MessageCircle, Bell, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { RETURN_ROWS, RETURN_STORES } from "../data";
import type { ReturnRow, ReturnStatus } from "../types/returns.types";
import { CustomerCard, PaymentModal, PersonInfo, ProductCard, RejectRefundModal, ReturnStatusPill, Section } from "../components";

function getStatusClass(status: Exclude<ReturnStatus,"All">) { return <ReturnStatusPill status={status}/>; }

export default function ReturnDetailsScreen({ customerContext = false }: { customerContext?: boolean }) {
  const params = useParams<{ storeId?: string; returnId?: string; customerId?: string; orderId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();
  const state = (location.state ?? {}) as { status?: ReturnStatus; storeName?: string; row?: ReturnRow; customerName?: string };
  const id = params.returnId ? `#${params.returnId}` : params.orderId ? `#${params.orderId}` : "#RT-5490";
  const initialRow = state.row ?? RETURN_ROWS.find((row) => row.id === id) ?? RETURN_ROWS[0];
  const [row, setRow] = useState<ReturnRow>(initialRow);
  const [status, setStatus] = useState<Exclude<ReturnStatus,"All">>((state.status && state.status !== "All" ? state.status : initialRow.status) as Exclude<ReturnStatus,"All">);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [itemOpen, setItemOpen] = useState(false);
  const storeName = state.storeName ?? RETURN_STORES[0].name;

  useEffect(() => {
    const root = customerContext ? "Customers" : "Returns";
    if (customerContext) {
      setExtraCrumbs([
        { label: "Customers", to: "/admin-dashboard/customers" },
        { label: `${state.customerName ?? "Arjun Mehta"} details`, to: `/admin-dashboard/customers/${params.customerId ?? "1"}` },
        { label: "Return" },
        { label: id, badge: status },
      ]);
    } else {
      setExtraCrumbs([
        { label: "Returns", to: "/admin-dashboard/returns" },
        { label: `${storeName} return`, to: `/admin-dashboard/returns/${params.storeId ?? "nike"}` },
        { label: id, badge: status },
      ]);
    }
    return () => setExtraCrumbs([]);
  }, [customerContext, id, params.customerId, params.storeId, setExtraCrumbs, state.customerName, status, storeName]);

  const updateRejected = (message: string) => { setRow((current) => ({ ...current, status: "Rejected", rejectionMessage: message })); setStatus("Rejected"); setRejectOpen(false); };
  const updateRefunded = () => { setRow((current) => ({ ...current, status: "Refunded" })); setStatus("Refunded"); setPaymentOpen(false); };

  useEffect(() => {
    const action = status === "New" ? (
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setRejectOpen(true)} className="h-8 px-4 rounded-md bg-[#ed7373] text-white text-[10.5px] font-semibold">Reject</button>
        <button type="button" onClick={() => setPaymentOpen(true)} className="h-8 px-4 rounded-md bg-[#805b42] text-white text-[10.5px] font-semibold">Refund</button>
        <div className="pl-2 text-[9px] text-[#655e58]">Refund<br/><b className="text-[13px] text-[#26211e]">₹{row.refund}</b></div>
      </div>
    ) : status === "On the way" || status === "Rejected" ? (
      <MessageCircle size={20} className="mr-1" />
    ) : null;
    setPageAction(action);
    return () => setPageAction(null);
  }, [row.refund, setPageAction, status]);

  const title = status === "New" ? null : status === "Collected" ? "Item collected successfully" : status === "Refunded" ? "Money refunded successfully" : null;
  const eventTime = status === "Collected" ? "on 29th Mar, 5:30 PM" : status === "Refunded" ? "on 25th Mar, 12:30 PM" : "";
  const rejectionMessage = row.rejectionMessage ?? "Size too small, but customer has returned so many times.";

  return <div>

    {status === "New" && <NewDetail row={row} onReject={() => setRejectOpen(true)} onRefund={() => setPaymentOpen(true)} />}
    {status === "On the way" && <OnWayDetail onItem={() => setItemOpen(true)} />}
    {status === "Collected" && <SuccessDetail title={title ?? "Item collected successfully"} time={eventTime} collected />}
    {status === "Refunded" && <SuccessDetail title={title ?? "Money refunded successfully"} time={eventTime} collected={false} />}
    {status === "Rejected" && <RejectedDetail message={rejectionMessage} />}
    <RejectRefundModal open={rejectOpen} onClose={() => setRejectOpen(false)} onConfirm={updateRejected} />
    <PaymentModal open={paymentOpen} amount={row.refund} onClose={() => setPaymentOpen(false)} onContinue={updateRefunded} />
    {itemOpen && <ItemModal onClose={() => setItemOpen(false)} />}
  </div>;
}

function NewDetail({ row }: { row: ReturnRow; onReject: () => void; onRefund: () => void }) {
  return <>
    <div className="flex justify-center pt-2 pb-5"><div className="text-center"><div className="text-[55px] leading-none">💳</div><p className="mt-1 text-[10.5px] font-semibold">Vendor is waiting for your response!</p></div></div>
    <Section title="Reason"><div className="rounded-xl bg-white border border-black/5 p-4 text-[11px] font-semibold">{row.reason}</div></Section>
    <Section title="Customer details"><CustomerCard /></Section>
    <Section title="Item"><div className="w-[590px] max-w-full"><ProductCard /></div></Section>
  </>;
}

function OnWayDetail({ onItem }: { onItem: () => void }) {
  return <>
    <Section title="Delivery status"><div className="relative h-[275px] overflow-hidden rounded-xl bg-white border border-black/5"><iframe title="Live delivery map" className="absolute inset-0 h-full w-full border-0" src="https://www.openstreetmap.org/export/embed.html?bbox=77.55%2C17.33%2C77.72%2C17.48&layer=mapnik&marker=17.405%2C77.63" /><div className="absolute left-[28%] top-[15%] h-20 w-20 rounded-full bg-[#ef4333] shadow-lg flex items-center justify-center text-white text-3xl">🚚</div><div className="absolute right-[22%] top-[42%] h-16 w-16 rounded-full bg-[#63c94c] shadow-lg flex items-center justify-center text-white text-2xl">▣</div><div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[300px] rounded-lg bg-white px-5 py-3 shadow-lg flex justify-between text-[10px]"><span>◷ ETA</span><b>12:30 PM</b></div></div></Section>
    <Section title="Reason"><div className="rounded-xl bg-white border border-black/5 p-4 text-[11px] font-semibold">Size too small</div></Section>
    <div className="grid grid-cols-3 gap-4"><Section title="Customer details"><PersonInfo type="customer" /></Section><Section title="Rider details"><PersonInfo type="rider" /></Section><Section title="Item" action={<button type="button" onClick={onItem} className="text-[9px] text-blue-600 underline">View details</button>}><ProductCard compact /></Section></div>
  </>;
}

function SuccessDetail({ title, time, collected }: { title: string; time: string; collected: boolean }) {
  return <>
    <div className="flex flex-col items-center pt-3 pb-5"><div className="h-20 w-20 rounded-full bg-[#00bf18] text-white flex items-center justify-center"><Check size={49} strokeWidth={4}/></div><p className="mt-3 text-[10px] font-semibold text-center">{title}<br/>{time}</p></div>
    <Section title="Reason"><div className="rounded-xl bg-white border border-black/5 p-4 text-[11px] font-semibold">Size too small</div></Section>
    {collected ? (
      <div className="grid grid-cols-[1.55fr_.75fr] gap-4">
        <Section title="Item"><ProductCard /></Section>
        <div><Section title="Customer details"><PersonInfo type="customer" /></Section><Section title="Rider details"><PersonInfo type="rider" /></Section></div>
      </div>
    ) : (
      <>
        <Section title="Customer details"><CustomerCard /></Section>
        <Section title="Item"><div className="w-[590px] max-w-full"><ProductCard /></div></Section>
      </>
    )}
  </>;
}

function RejectedDetail({ message }: { message: string }) {
  return <><div className="mb-4 flex justify-end text-[10px] text-[#625c57]">Rejected: 20th Apr, 12:35 PM</div><Section title="Rejection message"><div className="rounded-xl bg-white border border-black/5 p-4 text-[11px] font-semibold">{message}</div></Section><Section title="Customer details"><CustomerCard /></Section><Section title="Items - 1"><div className="w-[590px] max-w-full"><ProductCard /></div></Section></>;
}

function ItemModal({ onClose }: { onClose: () => void }) {
  return <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/30 p-5" onMouseDown={onClose}><div className="w-[560px] rounded-xl bg-white p-5 shadow-2xl" onMouseDown={(e) => e.stopPropagation()}><div className="flex items-center justify-between border-b border-[#ddd8d3] pb-3"><b className="text-[14px]">Item details</b><button type="button" onClick={onClose}><X size={19}/></button></div><div className="pt-4"><ProductCard /></div></div></div>;
}

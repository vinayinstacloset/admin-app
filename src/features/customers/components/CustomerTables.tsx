import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CustomerExchangeRow, CustomerOrderRow, CustomerReturnRow, CustomerTab } from "../types/customer.types";
import { useNavigate } from "react-router-dom";

type Props = {
    tab: CustomerTab;
    orders: CustomerOrderRow[];
    returns: CustomerReturnRow[];
    exchanges: CustomerExchangeRow[];
    customerId: string;
    onTabChange: (tab: CustomerTab) => void;
};

const orderStatuses = ["All", "New", "Packing", "Ready", "On the way", "Delivered", "Rejected"];
const returnStatuses = ["All", "New", "Refunded", "Pickup started", "Returning to vendor", "Collected", "Rejected"];
const exchangeStatuses = ["All", "New", "Ready for delivery", "On the way", "Exchanged", "Rejected"];

function SelectMenu({ value, options, onChange, width = "w-[125px]" }: { value: string; options: string[]; onChange: (value: string) => void; width?: string }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={`relative ${width}`}>
            <button
                type="button"
                onClick={() => setOpen((current) => !current)}
                className="h-8 w-full rounded-md border border-black/10 bg-white px-2.5 text-[10px] text-ink/65 flex items-center justify-between gap-2"
            >
                <span className="truncate">{value}</span>
                <ChevronDown size={11} />
            </button>
            {open && (
                <div className="absolute right-0 top-9 z-40 w-full min-w-[145px] rounded-lg border border-black/10 bg-white shadow-xl py-1">
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => {
                                onChange(option);
                                setOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-[10px] hover:bg-[#f6f2ed] ${option === value ? "text-[#805b42] font-semibold" : "text-ink/65"}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function StatusPill({ status }: { status: string }) {
    const className =
        status === "Delivered" || status === "Collected" || status === "Exchanged"
            ? "bg-[#ecfbf2] text-[#37b86a]"
            : status === "Rejected"
                ? "bg-[#fff0f0] text-[#ee7373]"
                : status === "New"
                    ? "bg-[#fff9df] text-[#e9b800]"
                    : status === "Ready for delivery"
                        ? "bg-[#fff1e8] text-[#ef8a61]"
                        : status === "On the way"
                            ? "bg-[#f5eaff] text-[#a34be8]"
                            : status === "Pickup started" || status === "Returning to vendor"
                                ? "bg-[#f5eaff] text-[#a34be8]"
                                : "bg-[#eaf4ff] text-[#438fe9]";

    return <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-medium whitespace-nowrap ${className}`}>{status}</span>;
}

function ReassignModal({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: (rider: string) => void }) {
    const [rider, setRider] = useState("Rajan Kumar");

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[90] bg-black/30 flex items-center justify-center p-5" onMouseDown={onClose}>
            <div className="w-[380px] rounded-xl bg-white shadow-2xl p-5" onMouseDown={(event) => event.stopPropagation()}>
                <p className="text-[14px] font-semibold text-ink">Reassign rider</p>
                <p className="text-[10px] text-ink/45 mt-1 mb-4">Select a rider for this order.</p>
                <select value={rider} onChange={(event) => setRider(event.target.value)} className="h-9 w-full rounded-md border border-black/10 px-3 text-[11px] outline-none bg-white">
                    <option>Rajan Kumar</option>
                    <option>Nitish Kumar</option>
                    <option>Arjun Singh</option>
                </select>
                <div className="flex justify-end gap-2 mt-5">
                    <button type="button" onClick={onClose} className="h-8 px-4 rounded-md border border-black/10 text-[10.5px] text-ink/65">Cancel</button>
                    <button type="button" onClick={() => onConfirm(rider)} className="h-8 px-4 rounded-md bg-[#805b42] text-white text-[10.5px] font-semibold">Reassign rider</button>
                </div>
            </div>
        </div>
    );
}

function actionButtonClass(tone: "red" | "green" | "brown" = "green") {
    if (tone === "red") return "bg-[#ed7373] text-white";
    if (tone === "brown") return "border border-[#80634f] text-[#6f513e] bg-white";
    return "bg-[#39be69] text-white";
}

export default function CustomerTables({ tab, orders, returns, exchanges, customerId, onTabChange }: Props) {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("All");
    const [sort, setSort] = useState("Newest first");
    const [orderRows, setOrderRows] = useState(orders);
    const [returnRows, setReturnRows] = useState(returns);
    const [exchangeRows, setExchangeRows] = useState(exchanges);
    const [reassignRow, setReassignRow] = useState<CustomerOrderRow | null>(null);

    useEffect(() => {
        setOrderRows(orders);
        setReturnRows(returns);
        setExchangeRows(exchanges);
    }, [orders, returns, exchanges]);

    useEffect(() => {
        setStatus("All");
        setQuery("");
        setSort(tab === "ORDER" ? "Newest first" : "Recent to oldest");
    }, [tab]);

    const filteredOrders = useMemo(
        () => orderRows.filter((item) => (status === "All" || item.status === status) && `${item.id} ${item.store} ${item.rider} ${item.details}`.toLowerCase().includes(query.toLowerCase())),
        [orderRows, query, status],
    );
    const filteredReturns = useMemo(
        () => returnRows.filter((item) => (status === "All" || item.status === status) && `${item.id} ${item.store} ${item.rider} ${item.item} ${item.reason}`.toLowerCase().includes(query.toLowerCase())),
        [returnRows, query, status],
    );
    const filteredExchanges = useMemo(
        () => exchangeRows.filter((item) => (status === "All" || item.status === status) && `${item.id} ${item.store} ${item.rider} ${item.item} ${item.replace} ${item.reason}`.toLowerCase().includes(query.toLowerCase())),
        [exchangeRows, query, status],
    );

    const dateValue = (value: string) => {
        const parsed = Date.parse(value);
        return Number.isNaN(parsed) ? 0 : parsed;
    };

    const sortedOrders = [...filteredOrders].sort((a, b) =>
        sort === "Oldest first" ? dateValue(a.date) - dateValue(b.date) :
            sort === "Amount high to low" ? b.amount - a.amount :
                sort === "Amount low to high" ? a.amount - b.amount :
                    dateValue(b.date) - dateValue(a.date),
    );

    const sortedReturns = [...filteredReturns].sort((a, b) =>
        sort === "Oldest first" ? dateValue(a.requested) - dateValue(b.requested) :
            sort === "Amount high to low" ? b.refund - a.refund :
                sort === "Amount low to high" ? a.refund - b.refund :
                    dateValue(b.requested) - dateValue(a.requested),
    );

    const sortedExchanges = [...filteredExchanges].sort((a, b) =>
        sort === "Oldest first" ? dateValue(a.requested) - dateValue(b.requested) : dateValue(b.requested) - dateValue(a.requested),
    );

    const statusOptions = tab === "ORDER" ? orderStatuses : tab === "RETURN" ? returnStatuses : exchangeStatuses;
    const sortOptions = tab === "ORDER" ? ["Newest first", "Oldest first", "Amount high to low", "Amount low to high"] : ["Recent to oldest", "Oldest to recent", "Amount high to low", "Amount low to high"];
    const visibleCount = tab === "ORDER" ? sortedOrders.length : tab === "RETURN" ? sortedReturns.length : sortedExchanges.length;
    const allCount = tab === "ORDER" ? 37 : tab === "RETURN" ? 6 : 5;

    const updateOrder = (target: CustomerOrderRow, nextStatus: string) => {
        setOrderRows((current) => current.map((row) => row === target ? { ...row, status: nextStatus } : row));
    };
    const updateReturn = (target: CustomerReturnRow, nextStatus: string) => {
        setReturnRows((current) => current.map((row) => row === target ? { ...row, status: nextStatus } : row));
    };
    const updateExchange = (target: CustomerExchangeRow, nextStatus: string) => {
        setExchangeRows((current) => current.map((row) => row === target ? { ...row, status: nextStatus } : row));
    };

    const openOrder = (row: CustomerOrderRow) => {
        navigate(`/admin-dashboard/customers/${customerId}/orders/${encodeURIComponent(row.id.replace("#", ""))}`, { state: { status: row.status } });
    };
    const openReturn = (row: CustomerReturnRow) => {
        navigate(`/admin-dashboard/customers/${customerId}/returns/${encodeURIComponent(row.id.replace("#", ""))}`, { state: { status: row.status } });
    };
    const openExchange = (row: CustomerExchangeRow) => {
        navigate(`/admin-dashboard/customers/${customerId}/exchanges/${encodeURIComponent(row.id.replace("#", ""))}`, { state: { status: row.status } });
    };

    return (
        <>
            <div className="bg-transparent">
                <div className="flex justify-center mb-2">
                    <div className="inline-flex rounded-md overflow-hidden bg-[#e7e5e3] p-0.5">
                        {(["ORDER", "RETURN", "EXCHANGE"] as CustomerTab[]).map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => onTabChange(item)}
                                className={`h-8 min-w-[76px] px-5 text-[10px] font-medium ${tab === item ? "bg-[#f8f7f5] border border-[#80634f] text-[#6f513e] rounded-md" : "text-ink/55"}`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
                        {statusOptions.map((option) => (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setStatus(option)}
                                className={`px-2.5 py-1.5 text-[10.5px] whitespace-nowrap border-b-2 ${status === option ? "border-[#80634f] text-[#6f513e] font-semibold" : "border-transparent text-ink/40"}`}
                            >
                                {option}{option === "All" ? ` - ${allCount}` : ""}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="relative w-[230px]">
                            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/30" />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder={tab === "ORDER" ? "Search order id..." : tab === "RETURN" ? "Search return id, customer name..." : "Search exchange id, customer name..."}
                                className="h-8 w-full rounded-md border border-black/10 bg-white pl-7 pr-2.5 text-[10px] outline-none"
                            />
                        </div>
                        <span className="w-7 h-8 flex items-center justify-center text-ink/45" aria-hidden="true">
                            <SlidersHorizontal size={15} />
                        </span>
                        <SelectMenu value={sort} options={sortOptions} onChange={setSort} />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
                    {tab === "ORDER" && (
                        <table className="w-full text-[10px]">
                            <thead className="bg-[#f2f1ef] text-ink/45 uppercase">
                                <tr>
                                    <th className="px-5 py-3 text-left font-medium">Order</th>
                                    <th className="px-2 py-3 text-left font-medium">Store</th>
                                    <th className="px-2 py-3 text-left font-medium">Rider</th>
                                    <th className="px-2 py-3 text-left font-medium">Item</th>
                                    <th className="px-2 py-3 text-left font-medium">Status</th>
                                    <th className="px-2 py-3 text-left font-medium">Amount</th>
                                    <th className="px-5 py-3 text-left font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedOrders.map((row, index) => (
                                    <tr key={`${row.id}-${row.status}-${index}`} className="border-t border-black/5 hover:bg-[#fcfbf9]">
                                        <td className="px-5 py-3">
                                            <button type="button" onClick={() => openOrder(row)} className="text-left font-semibold text-[11px] hover:text-[#805b42]">{row.id}</button>
                                            <span className="block text-[8.5px] text-ink/35 mt-1">{row.items} Items · {row.date}</span>
                                        </td>
                                        <td className="px-2 py-3">
                                            <span className="font-medium">{row.store}</span>
                                            <span className="block text-[8.5px] text-ink/35 mt-1">Mumbai</span>
                                        </td>
                                        <td className="px-2 py-3">
                                            <span className="font-medium">{row.rider === "-" ? "-" : row.rider}</span>
                                        </td>
                                        <td className="px-2 py-3 max-w-[260px]">
                                            <span className="block truncate">{row.details}</span>
                                            <span className="block text-[8.5px] text-ink/35 mt-1">◈ 19 &nbsp;&nbsp; ◈ 23</span>
                                        </td>
                                        <td className="px-2 py-3"><StatusPill status={row.status} /></td>
                                        <td className="px-2 py-3">
                                            <b className="text-[11px]">₹{row.amount.toLocaleString("en-IN")}</b>
                                            <button type="button" onClick={() => openOrder(row)} className="block text-[9px] text-blue-600 underline mt-0.5">View details</button>
                                        </td>
                                        <td className="px-5 py-3">
                                            {row.status === "New" && (
                                                <div className="flex items-center gap-2">
                                                    <button type="button" onClick={() => updateOrder(row, "Rejected")} className={`h-7 px-3 rounded-md text-[9.5px] font-semibold ${actionButtonClass("red")}`}>Reject</button>
                                                    <button type="button" onClick={() => updateOrder(row, "Packing")} className={`h-7 px-3 rounded-md text-[9.5px] font-semibold ${actionButtonClass("green")}`}>Accept</button>
                                                </div>
                                            )}
                                            {row.status === "Packing" && (
                                                <button type="button" onClick={() => updateOrder(row, "Ready")} className={`h-7 px-3 rounded-md text-[9.5px] font-semibold ${actionButtonClass("green")}`}>Mark as Ready</button>
                                            )}
                                            {row.status === "Ready" && <span className="text-[9.5px] text-ink/55">ETA: 12:30 PM</span>}
                                            {row.status === "On the way" && (
                                                <button type="button" onClick={() => setReassignRow(row)} className={`h-7 px-3 rounded-md text-[9.5px] ${actionButtonClass("brown")}`}>Reassign rider</button>
                                            )}
                                            {row.status === "Delivered" && <span className="text-[9.5px] text-ink/60">★ {row.rating ?? "5/5"} rating</span>}
                                            {row.status === "Rejected" && <span className="text-[9.5px] text-ink/60">20th Apr, 12:35 PM</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {tab === "RETURN" && (
                        <table className="w-full text-[10px]">
                            <thead className="bg-[#f2f1ef] text-ink/45 uppercase">
                                <tr>
                                    <th className="px-5 py-3 text-left font-medium">Order</th>
                                    <th className="px-2 py-3 text-left font-medium">Store</th>
                                    <th className="px-2 py-3 text-left font-medium">Rider</th>
                                    <th className="px-2 py-3 text-left font-medium">Item</th>
                                    <th className="px-2 py-3 text-left font-medium">Reason</th>
                                    <th className="px-2 py-3 text-left font-medium">Requested</th>
                                    <th className="px-2 py-3 text-left font-medium">Refund</th>
                                    <th className="px-2 py-3 text-left font-medium">Status</th>
                                    <th className="px-5 py-3 text-left font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedReturns.map((row, index) => (
                                    <tr key={`${row.id}-${row.status}-${index}`} className="border-t border-black/5 hover:bg-[#fcfbf9]">
                                        <td className="px-5 py-3 font-semibold text-[11px]">{row.id}</td>
                                        <td className="px-2 py-3"><span className="font-medium">{row.store}</span><span className="block text-[8.5px] text-ink/35 mt-1">Mumbai</span></td>
                                        <td className="px-2 py-3">{row.rider}</td>
                                        <td className="px-2 py-3">{row.item}</td>
                                        <td className="px-2 py-3 font-medium">{row.reason}</td>
                                        <td className="px-2 py-3">{row.requested}</td>
                                        <td className="px-2 py-3">₹{row.refund.toLocaleString("en-IN")}</td>
                                        <td className="px-2 py-3"><StatusPill status={row.status} /></td>
                                        <td className="px-5 py-3">
                                            {row.status === "New" ? (
                                                <div className="flex gap-2">
                                                    <button type="button" onClick={() => updateReturn(row, "Rejected")} className={`h-7 px-3 rounded-md text-[9.5px] font-semibold ${actionButtonClass("red")}`}>Reject</button>
                                                    <button type="button" onClick={() => updateReturn(row, "Refunded")} className={`h-7 px-3 rounded-md text-[9.5px] font-semibold ${actionButtonClass("brown")}`}>Refund</button>
                                                </div>
                                            ) : row.status === "Pickup started" || row.status === "Returning to vendor" ? (
                                                <div className="flex flex-col items-start gap-1"><span className="text-[9px] text-ink/55">ETA: 12:30 PM</span><button type="button" onClick={() => openReturn(row)} className="h-7 px-3 rounded-md border border-[#80634f] text-[#6f513e] text-[9.5px]">View details</button></div>
                                            ) : (
                                                <button type="button" onClick={() => openReturn(row)} className="h-7 px-3 rounded-md border border-[#80634f] text-[#6f513e] text-[9.5px]">View details</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {tab === "EXCHANGE" && (
                        <table className="w-full text-[10px]">
                            <thead className="bg-[#f2f1ef] text-ink/45 uppercase">
                                <tr>
                                    <th className="px-5 py-3 text-left font-medium">Order</th>
                                    <th className="px-2 py-3 text-left font-medium">Store</th>
                                    <th className="px-2 py-3 text-left font-medium">Rider</th>
                                    <th className="px-2 py-3 text-left font-medium">Item replace</th>
                                    <th className="px-2 py-3 text-left font-medium">Reason</th>
                                    <th className="px-2 py-3 text-left font-medium">Requested</th>
                                    <th className="px-2 py-3 text-left font-medium">Status</th>
                                    <th className="px-5 py-3 text-left font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedExchanges.map((row, index) => (
                                    <tr key={`${row.id}-${row.status}-${index}`} className="border-t border-black/5 hover:bg-[#fcfbf9]">
                                        <td className="px-5 py-3 font-semibold text-[11px]">{row.id}</td>
                                        <td className="px-2 py-3 font-medium">{row.store}</td>
                                        <td className="px-2 py-3">{row.rider}</td>
                                        <td className="px-2 py-3"><span className="block">{row.item}, {row.replace}</span><button type="button" onClick={() => openExchange(row)} className="text-[9px] text-blue-600 underline">View details</button></td>
                                        <td className="px-2 py-3 font-medium">{row.reason}</td>
                                        <td className="px-2 py-3">{row.requested}</td>
                                        <td className="px-2 py-3"><StatusPill status={row.status} /></td>
                                        <td className="px-5 py-3">
                                            {row.status === "New" ? (
                                                <div className="flex gap-2">
                                                    <button type="button" onClick={() => updateExchange(row, "Rejected")} className={`h-7 px-3 rounded-md text-[9.5px] font-semibold ${actionButtonClass("red")}`}>Reject</button>
                                                    <button type="button" onClick={() => updateExchange(row, "Ready for delivery")} className={`h-7 px-3 rounded-md text-[9.5px] font-semibold ${actionButtonClass("green")}`}>Approve</button>
                                                </div>
                                            ) : row.status === "Ready for delivery" ? (
                                                <span className="text-[9.5px] text-ink/55">Rider reached the store</span>
                                            ) : row.status === "On the way" ? (
                                                <span className="text-[9.5px] text-ink/55">Estimated Delivery in 18 mins</span>
                                            ) : (
                                                <button type="button" onClick={() => openExchange(row)} className="h-7 px-3 rounded-md border border-[#80634f] text-[#6f513e] text-[9.5px]">View details</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {visibleCount === 0 && <div className="py-10 text-center text-xs text-ink/40">No records found.</div>}
                </div>
            </div>
            <ReassignModal open={Boolean(reassignRow)} onClose={() => setReassignRow(null)} onConfirm={() => setReassignRow(null)} />
        </>
    );
}

import { Search, X, Phone, MapPin } from "lucide-react";
import type { AssignableOrder, DeliveryItem, Rider } from "../types/livedelivery.types";

interface AssignRiderModalProps {
    mode: "assign" | "reassign";
    delivery: DeliveryItem | null;
    orderId: string;
    orderOptions: AssignableOrder[];
    searchQuery: string;
    riders: Rider[];
    selectedRiderId: string | null;
    onSearch: (value: string) => void;
    onOrderSelect: (order: AssignableOrder) => void;
    onSelect: (id: string) => void;
    onClose: () => void;
    onAssign: () => void;
}

export default function AssignRiderModal({
    mode,
    delivery,
    orderId,
    orderOptions,
    searchQuery,
    riders,
    selectedRiderId,
    onSearch,
    onOrderSelect,
    onSelect,
    onClose,
    onAssign,
}: AssignRiderModalProps) {
    const isReassign = mode === "reassign";
    const title = isReassign ? "Reassign rider" : "Assign rider";

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 200,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                background: "rgba(0,0,0,.22)",
            }}
        >
            <div style={{ width: 405, maxWidth: "100%", maxHeight: "calc(100vh - 40px)", overflowY: "auto", borderRadius: 14, background: "#fff", padding: 20, boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 15, borderBottom: "1px solid #ddd" }}>
                    <strong style={{ fontSize: 14 }}>{title}</strong>
                    <button type="button" onClick={onClose} aria-label={`Close ${title}`} style={{ border: 0, background: "transparent", cursor: "pointer" }}>
                        <X size={19} />
                    </button>
                </div>

                {!isReassign ? (
                    <div style={{ position: "relative", marginTop: 18 }}>
                        <label style={{ display: "block", fontSize: 10, fontWeight: 700 }}>Search order</label>
                        <div style={{ position: "relative", marginTop: 9 }}>
                            <Search size={14} style={{ position: "absolute", left: 11, top: 11, color: "#8a8078" }} />
                            <input
                                value={searchQuery}
                                onChange={(event) => onSearch(event.target.value)}
                                placeholder="Search order ID or customer"
                                autoFocus
                                style={{ width: "100%", height: 36, boxSizing: "border-box", border: "1px solid #aaa", borderRadius: 5, padding: "0 12px 0 32px", outline: "none", fontSize: 11 }}
                            />
                        </div>
                        {searchQuery.trim() && (
                            <div style={{ marginTop: 6, border: "1px solid #ddd", borderRadius: 6, background: "#fff", overflow: "hidden", boxShadow: "0 8px 22px rgba(0,0,0,.08)" }}>
                                {orderOptions.length > 0 ? orderOptions.map((order) => (
                                    <button
                                        key={order.id}
                                        type="button"
                                        onClick={() => onOrderSelect(order)}
                                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 11px", border: 0, borderBottom: "1px solid #eee", background: "#fff", textAlign: "left", cursor: "pointer" }}
                                    >
                                        <span>
                                            <strong style={{ display: "block", fontSize: 11, color: "#26201b" }}>{order.id}</strong>
                                            <span style={{ display: "block", marginTop: 3, fontSize: 9, color: "#777" }}>{order.customer} · {order.amount}</span>
                                        </span>
                                        <span style={{ fontSize: 9, color: "#16a957", fontWeight: 700 }}>{order.status}</span>
                                    </button>
                                )) : (
                                    <div style={{ padding: 12, fontSize: 10, color: "#777" }}>No matching orders found</div>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <label style={{ display: "block", marginTop: 18, fontSize: 10, fontWeight: 700 }}>
                        Order ID
                        <input value={orderId} readOnly style={{ width: "100%", height: 36, boxSizing: "border-box", marginTop: 9, border: "1px solid #aaa", borderRadius: 5, padding: "0 12px", fontSize: 11, background: "#f8f7f5" }} />
                    </label>
                )}

                {orderId && (
                    <div style={{ marginTop: 18 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9, fontSize: 10, fontWeight: 700 }}>
                            <span>{isReassign ? "Select new rider" : "Select rider"}</span>
                            <span style={{ color: "#16b45a", fontWeight: 500 }}>{riders.filter((rider) => rider.availability === "Online").length} available</span>
                        </div>
                        <div style={{ display: "grid", gap: 9 }}>
                            {riders.filter((rider) => rider.availability === "Online").slice(0, 5).map((rider) => (
                                <button key={rider.id} type="button" onClick={() => onSelect(rider.id)} style={{ width: "100%", display: "grid", gridTemplateColumns: "42px 1fr 22px", alignItems: "center", gap: 9, padding: "8px 10px", border: 0, borderRadius: 6, background: selectedRiderId === rider.id ? "#eeeae6" : "#f2f2f0", textAlign: "left", cursor: "pointer" }}>
                                    <img src={rider.avatar} alt="" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
                                    <span>
                                        <strong style={{ display: "block", fontSize: 11 }}>{rider.name}</strong>
                                        <small style={{ display: "flex", gap: 9, marginTop: 5, color: "#555", fontSize: 9 }}><span><Phone size={9} style={{ display: "inline" }} /> {rider.phone}</span><span><MapPin size={9} style={{ display: "inline" }} /> {rider.distance}</span></small>
                                    </span>
                                    <span style={{ width: 15, height: 15, borderRadius: "50%", border: "1px solid #8a8078", boxSizing: "border-box", background: selectedRiderId === rider.id ? "#765038" : "transparent", boxShadow: selectedRiderId === rider.id ? "inset 0 0 0 4px #fff" : "none" }} />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginTop: 20 }}>
                    <button type="button" onClick={onClose} style={{ height: 36, border: "1px solid #765038", borderRadius: 5, background: "#fff", color: "#555", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
                    <button type="button" onClick={onAssign} disabled={!orderId || !selectedRiderId} style={{ height: 36, border: 0, borderRadius: 5, background: orderId && selectedRiderId ? "#765038" : "#d5cec8", color: "#fff", fontSize: 11, fontWeight: 700, cursor: orderId && selectedRiderId ? "pointer" : "default" }}>{isReassign ? "Reassign rider" : "Assign rider"}</button>
                </div>
            </div>
        </div>
    );
}

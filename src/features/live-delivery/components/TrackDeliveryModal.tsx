import { X, Truck } from "lucide-react";
import type { DeliveryItem } from "../types/livedelivery.types";
import { buildMapUrl } from "../utils/map.utils";

export default function TrackDeliveryModal({ delivery, onClose }: { delivery: DeliveryItem; onClose: () => void }) {
    return <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(0,0,0,.22)" }}>
        <div style={{ width: "min(900px, 100%)", borderRadius: 14, background: "#fff", boxShadow: "0 20px 60px rgba(0,0,0,.2)", overflow: "hidden" }}>
            <div style={{ height: 55, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px", borderBottom: "1px solid #ddd", fontSize: 14 }}><span>▣ {delivery.id} tracking</span><button type="button" onClick={onClose} style={{ border: 0, background: "transparent", cursor: "pointer" }}><X size={21} /></button></div>
            <div style={{ padding: 20 }}><div style={{ position: "relative", height: 235, overflow: "hidden", borderRadius: 7 }}><iframe title="Delivery route map" src={buildMapUrl("78.30,17.34,78.60,17.52")} style={{ width: "100%", height: "100%", border: 0 }} loading="lazy" /><div style={{ position: "absolute", left: "23%", top: "28%", width: 74, height: 74, borderRadius: "50%", background: "#ef4b3a", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 5px 12px rgba(0,0,0,.2)", color: "#fff" }}><Truck size={34} /></div><div style={{ position: "absolute", right: "22%", top: "42%", width: 58, height: 58, borderRadius: "50%", background: "#60c84c", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", boxShadow: "0 5px 12px rgba(0,0,0,.2)" }}>▣</div></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}><Address label="From" value={delivery.from} /><Address label="To" value={delivery.to} /></div>
            </div>
        </div>
    </div>;
}
function Address({ label, value }: { label: string; value: string }) { return <div><div style={{ marginBottom: 6, color: "#8a8078", fontSize: 9 }}>{label}</div><div style={{ minHeight: 56, boxSizing: "border-box", padding: 10, borderRadius: 5, background: "#f2f2f0", fontSize: 10, lineHeight: 1.45 }}>{value}</div></div>; }

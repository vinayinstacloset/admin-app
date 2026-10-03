import { statusStyle } from "../utils/livedelivery.utils";
import type { DeliveryItem } from "../types/livedelivery.types";

export default function ActiveDeliveriesTable({ deliveries, onTrack, onReassign }: { deliveries: DeliveryItem[]; onTrack: (item: DeliveryItem) => void; onReassign: (item: DeliveryItem) => void }) {
    return <div style={{ overflow: "hidden", borderRadius: 10, background: "#fff" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1.35fr .9fr .8fr 1fr 1fr", gap: 10, padding: "12px 24px", background: "#f1f0ee", color: "#777", fontSize: 9, textTransform: "uppercase" }}>
            {['Order','Rider','Customer','Amount','ETA','Status','Action'].map((label) => <span key={label}>{label}</span>)}
        </div>
        {deliveries.map((item) => { const style = statusStyle(item.status); return <div key={item.id} style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1.35fr .9fr .8fr 1fr 1fr", gap: 10, alignItems: "center", minHeight: 59, padding: "0 24px", borderTop: "1px solid #e5e2df", fontSize: 11 }}>
            <strong>{item.id}</strong><span>{item.rider}</span><span>{item.customer}</span><strong>{item.amount}</strong><span style={{ color: item.status === "Delayed" ? "#ef7171" : item.status === "On time" ? "#16b45a" : "#8c4bc4", fontWeight: 700 }}>{item.eta}</span><span style={{ justifySelf: "start", padding: "5px 11px", borderRadius: 999, background: style.background, color: style.color, fontSize: 9 }}>{item.status}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                {item.status === "Delayed" && <button type="button" onClick={() => onReassign(item)} style={{ border: "1px solid #76533d", background: "#fff", color: "#76533d", borderRadius: 5, padding: "5px 9px", fontSize: 9, cursor: "pointer" }}>Reassign</button>}
                <button type="button" onClick={() => onTrack(item)} style={{ border: "1px solid #76533d", background: "#fff", color: "#76533d", borderRadius: 5, padding: "5px 11px", fontSize: 9, cursor: "pointer" }}>Track</button>
            </div>
        </div>; })}
    </div>;
}

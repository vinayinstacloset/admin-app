import { useState } from "react";
import Dropdown from "./Dropdown";
import type { Rider } from "../types/livedelivery.types";

export default function RiderStatusPanel({ riders }: { riders: Rider[] }) {
    const [open, setOpen] = useState(false);
    const [state, setState] = useState("All State");
    const filtered = state === "All State" ? riders : riders.filter((rider) => rider.state === state);
    return <section><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}><h2 style={{ margin: 0, fontSize: 15 }}>Rider status</h2><Dropdown value={state} options={["All State", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Maharashtra", "Telangana"]} open={open} onToggle={() => setOpen(!open)} onSelect={(value) => { setState(value); setOpen(false); }} width={84} /></div>
        <div style={{ overflow: "hidden", borderRadius: 10, background: "#fff" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7, padding: 8 }}>
                <Stat value={riders.length} label="Total" tone="#0071e3" />
                <Stat value={riders.filter((rider) => rider.availability === "Online").length} label="Online" tone="#16b45a" />
                <Stat value={riders.filter((rider) => rider.availability === "Offline").length} label="Offline" tone="#aaa" />
            </div>
            <div>{filtered.map((rider) => <div key={rider.id} style={{ minHeight: 49, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "0 10px", borderTop: "1px solid #e5e2df", fontSize: 10 }}><span style={{ display: "flex", alignItems: "center", gap: 7 }}><i style={{ width: 6, height: 6, borderRadius: "50%", background: rider.availability === "Online" ? "#39bd65" : "#c8c8c8" }} />{rider.name}</span><span style={{ color: "#555" }}>{rider.availability === "Online" ? rider.delivery : "Offline"}</span></div>)}</div>
        </div></section>;
}
function Stat({ value, label, tone }: { value: number; label: string; tone: string }) { return <div style={{ padding: "8px 4px", textAlign: "center", borderRadius: 5, background: tone === "#16b45a" ? "#eaf9ef" : tone === "#0071e3" ? "#e9f2ff" : "#f5f5f5" }}><strong style={{ display: "block", color: tone, fontSize: 15 }}>{value}</strong><span style={{ fontSize: 9, color: tone }}>{label}</span></div>; }

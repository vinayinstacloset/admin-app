import { ChevronDown } from "lucide-react";

interface DropdownProps { value: string; options: string[]; open: boolean; onToggle: () => void; onSelect: (value: string) => void; width?: number; align?: "left" | "right"; }

export default function Dropdown({ value, options, open, onToggle, onSelect, width = 120, align = "right" }: DropdownProps) {
    return (
        <div style={{ position: "relative", width }}>
            <button type="button" onClick={onToggle} style={{ width: "100%", height: 28, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, padding: "0 10px", border: 0, borderRadius: 6, background: "#fff", color: "#26201b", fontSize: 10, cursor: "pointer", boxShadow: "0 1px 2px rgba(0,0,0,.04)" }}>
                <span>{value}</span><ChevronDown size={12} style={{ transform: open ? "rotate(180deg)" : "none" }} />
            </button>
            {open && <div style={{ position: "absolute", [align]: 0, top: 32, zIndex: 100, width: Math.max(width, 120), maxHeight: 230, overflowY: "auto", padding: 5, borderRadius: 6, background: "#fff", boxShadow: "0 12px 28px rgba(0,0,0,.14)", border: "1px solid rgba(0,0,0,.04)" }}>
                {options.map((option) => <button key={option} type="button" onClick={() => onSelect(option)} style={{ display: "block", width: "100%", border: 0, borderRadius: 4, background: option === value ? "#eeeae6" : "transparent", color: "#26201b", padding: "8px 9px", textAlign: "left", fontSize: 10, cursor: "pointer" }}>{option}</button>)}
            </div>}
        </div>
    );
}

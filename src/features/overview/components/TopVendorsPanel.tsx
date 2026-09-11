import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { TopVendorRow } from "../types/overview.types";

interface TopVendorsPanelProps {
    vendors: TopVendorRow[];
    states: string[];
}

export default function TopVendorsPanel({ vendors, states }: TopVendorsPanelProps) {
    const [stateFilter, setStateFilter] = useState(states[0] ?? "All State");
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-ink">Top vendors today</h2>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen((current) => !current)}
                        className="flex items-center gap-1 text-[11.5px] text-ink/50 hover:text-ink"
                    >
                        {stateFilter} <ChevronDown size={13} />
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-44 bg-white border border-black/5 rounded-lg shadow-soft py-1.5 z-10 max-h-56 overflow-y-auto">
                            {states.map((state) => (
                                <button
                                    key={state}
                                    type="button"
                                    onClick={() => {
                                        setStateFilter(state);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-cream ${
                                        state === stateFilter ? "text-brand-600" : "text-ink/60"
                                    }`}
                                >
                                    {state}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <ul className="space-y-3.5">
                {vendors.map((vendor, index) => (
                    <li
                        key={`${vendor.name}-${index}`}
                        className="flex items-center justify-between gap-3"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="w-9 h-9 rounded-lg bg-cream flex items-center justify-center font-bold text-ink/50 shrink-0">
                                {vendor.initial}
                            </span>
                            <div className="min-w-0">
                                <p className="text-[12.5px] text-ink truncate">{vendor.name}</p>
                                <p className="text-[11px] text-ink/40">{vendor.orders}</p>
                            </div>
                        </div>
                        <span className="text-[12.5px] font-semibold text-ink shrink-0">{vendor.amount}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

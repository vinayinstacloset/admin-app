import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { TopVendorRow } from "../types/overview.types";

interface TopVendorsPanelProps {
  vendors: TopVendorRow[];
  states: string[];
}

export default function TopVendorsPanel({
  vendors,
  states,
}: TopVendorsPanelProps) {
  const [stateFilter, setStateFilter] = useState(states[0] ?? "All State");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-ink">
          Top vendors today
        </h2>
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="flex h-8 items-center gap-1 rounded-lg bg-white px-3 text-[10px] font-medium text-ink/65 shadow-sm"
          >
            {stateFilter}
            <ChevronDown size={12} />
          </button>
          {isOpen && (
            <div className="absolute right-0 top-9 z-20 w-40 overflow-hidden rounded-lg border border-black/5 bg-white py-1 shadow-lg">
              {states.map((state) => (
                <button
                  key={state}
                  type="button"
                  onClick={() => {
                    setStateFilter(state);
                    setIsOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-left text-[10px] hover:bg-cream ${
                    state === stateFilter
                      ? "font-semibold text-brand-700"
                      : "text-ink/65"
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {vendors.map((vendor, index) => (
          <div
            key={`${vendor.name}-${index}`}
            className="flex min-h-[57px] items-center justify-between gap-3 border-b border-black/5 px-3.5 last:border-b-0"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#f3f3f3]">
                {vendor.logoUrl ? (
                  <img
                    src={vendor.logoUrl}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-sm font-semibold text-ink/40">
                    {vendor.initial ?? vendor.name.slice(0, 1)}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11.5px] font-semibold text-ink">
                  {vendor.name}
                </p>
                <p className="text-[9.5px] text-ink/45">{vendor.orders}</p>
              </div>
            </div>
            <span className="shrink-0 text-[11px] font-semibold text-ink/75">
              {vendor.amount}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

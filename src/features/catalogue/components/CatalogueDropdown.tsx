import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

interface Props {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  width?: string;
  align?: "left" | "right";
  placeholder?: string;
}

export default function CatalogueDropdown({
  value,
  options,
  onChange,
  width = "100%",
  align = "left",
  placeholder,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open, setOpen]);

  return (
    <div ref={ref} className="relative" style={{ width }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-9 w-full items-center justify-between gap-2 rounded-md border border-black/10 bg-white px-3 text-[10px] text-ink transition-shadow hover:shadow-sm"
      >
        <span className="truncate">{value || placeholder || "Select"}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`absolute ${align === "right" ? "right-0" : "left-0"} top-[42px] z-[90] min-w-full origin-top rounded-md border border-black/5 bg-white p-1 shadow-[0_14px_35px_rgba(38,32,27,.14)] transition-all duration-150 ${open ? "pointer-events-auto translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-[.98] opacity-0"}`}
      >
        <div className="max-h-56 overflow-auto scrollbar-hide">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between rounded px-2.5 py-2 text-left text-[10px] font-medium transition-colors hover:bg-[#f4f0ed] ${option === value ? "bg-[#f4f0ed] text-[#765038]" : "text-ink/75"}`}
            >
              <span>{option}</span>
              {option === value && <Check size={12} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

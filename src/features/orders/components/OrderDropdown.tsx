import { ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Props {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  searchable?: boolean;
  width?: number;
}

export default function OrderDropdown({
  value,
  options,
  onChange,
  searchable = false,
  width = 150,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const visible = options.filter((option) =>
    option.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div ref={ref} className="relative shrink-0" style={{ width }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-full rounded-md bg-white px-3 text-[10px] text-ink flex items-center justify-between gap-2"
      >
        <span className="truncate">{value}</span>
        <ChevronDown size={12} className={open ? "rotate-180" : ""} />
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-[70] w-full rounded-md bg-white p-1 shadow-xl ring-1 ring-black/5">
          {searchable && (
            <div className="relative p-1">
              <Search
                size={12}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35"
              />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search store"
                className="h-8 w-full rounded border border-black/10 pl-7 pr-2 text-[10px] outline-none"
              />
            </div>
          )}
          <div className="max-h-56 overflow-y-auto">
            {visible.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                  setQuery("");
                }}
                className={`block w-full rounded px-3 py-2 text-left text-[10px] ${option === value ? "bg-[#e9e5e1] font-semibold text-ink" : "text-ink/75 hover:bg-[#f7f5f2]"}`}
              >
                {option}
              </button>
            ))}
            {visible.length === 0 && (
              <p className="px-3 py-3 text-[10px] text-ink/40">
                No stores found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

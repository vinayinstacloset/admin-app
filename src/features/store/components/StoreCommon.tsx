import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export const classNames = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(" ");

export function Dropdown({
  label,
  options,
  value,
  open,
  onToggle,
  onSelect,
  align = "right",
  icon,
}: {
  label?: string;
  options: string[];
  value: string;
  open: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  align?: "left" | "right";
  icon?: ReactNode;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="flex h-9 min-w-[116px] items-center justify-between gap-3 rounded-md bg-white px-3 text-xs text-ink shadow-sm hover:bg-[#fafafa]"
      >
        <span className="flex items-center gap-2">
          {icon}
          {label ?? value}
        </span>
        <ChevronDown
          size={14}
          className={
            open ? "rotate-180 transition-transform" : "transition-transform"
          }
        />
      </button>
      {open && (
        <div
          className={classNames(
            "absolute top-10 z-50 min-w-[150px] overflow-hidden rounded-md bg-white p-1 shadow-xl ring-1 ring-black/5",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {options.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => onSelect(option)}
              className={classNames(
                "block w-full rounded px-3 py-2.5 text-left text-xs transition-colors",
                option === value
                  ? "bg-[#eeeae6] font-semibold text-ink"
                  : "text-ink/70 hover:bg-[#f7f5f2]",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function PageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-[17px] font-bold tracking-[-0.02em] text-ink">
      {children}
    </h1>
  );
}

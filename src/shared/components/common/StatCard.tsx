import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type StatTone =
  "green" | "purple" | "blue" | "orange" | "yellow" | "red";

export interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  tone?: StatTone;
  link?: boolean;
  onLinkClick?: () => void;
}

const toneStyles: Record<StatTone, string> = {
  green: "bg-emerald-50 text-emerald-600",
  purple: "bg-violet-50 text-violet-600",
  blue: "bg-sky-50 text-sky-600",
  orange: "bg-orange-50 text-orange-600",
  yellow: "bg-amber-50 text-amber-600",
  red: "bg-rose-50 text-rose-600",
};

export default function StatCard({
  label,
  value,
  icon,
  tone = "purple",
  link,
  onLinkClick,
}: StatCardProps) {
  const IconComponent =
    (Icons as unknown as Record<string, LucideIcon>)[icon] ?? Icons.Circle;

  return (
    <div className="flex min-h-[102px] flex-col rounded-xl border border-black/5 bg-white p-4">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[30px] ${toneStyles[tone]}`}
      >
        <IconComponent size={16} />
      </span>

      <div className="mt-3 flex min-w-0 items-center gap-1">
        <span className="truncate text-xs font-medium text-[#595959]">
          {label}:
        </span>

        <span className="shrink-0 text-[17px] font-bold leading-tight text-ink">
          {value}
        </span>

        {link && (
          <button
            type="button"
            onClick={onLinkClick}
            className="ml-1 shrink-0 text-[11px] text-sky-600 hover:underline"
          >
            View
          </button>
        )}
      </div>
    </div>
  );
}

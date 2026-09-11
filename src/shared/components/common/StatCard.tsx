import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type StatTone = "green" | "purple" | "blue" | "orange" | "yellow" | "red";

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

export default function StatCard({ label, value, icon, tone = "purple", link, onLinkClick }: StatCardProps) {
    const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[icon] ?? Icons.Circle;

    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-4 flex items-center gap-3">
            <span className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${toneStyles[tone]}`}>
                <IconComponent size={18} />
            </span>
            <div className="min-w-0">
                <p className="text-xs text-ink/45 truncate">{label}</p>
                <p className="text-[17px] font-bold text-ink leading-tight">
                    {value}
                    {link && (
                        <button
                            type="button"
                            onClick={onLinkClick}
                            className="ml-2 text-[11px] text-sky-600 align-middle hover:underline"
                        >
                            View
                        </button>
                    )}
                </p>
            </div>
        </div>
    );
}

import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { OverviewAlert } from "../types/overview.types";

interface AlertsPanelProps {
    alerts: OverviewAlert[];
}

const toneStyles: Record<OverviewAlert["tone"], string> = {
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-sky-50 text-sky-600",
    red: "bg-rose-50 text-rose-600",
    yellow: "bg-amber-50 text-amber-600",
    purple: "bg-violet-50 text-violet-600",
};

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5">
            <h2 className="text-sm font-semibold text-ink mb-4">Alerts</h2>
            <ul className="space-y-4">
                {alerts.map((alert) => {
                    const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[alert.icon] ?? Icons.Star;

                    return (
                        <li
                            key={alert.id}
                            className="flex items-start gap-3"
                        >
                            <span
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${toneStyles[alert.tone]}`}
                            >
                                <IconComponent size={15} />
                            </span>
                            <div className="min-w-0">
                                <p className="text-[12.5px] text-ink leading-snug">{alert.title}</p>
                                <p className="text-[11.5px] text-ink/40 truncate">{alert.subtitle}</p>
                                <p className="text-[10.5px] text-ink/30 mt-0.5">{alert.time}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

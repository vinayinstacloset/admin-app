import type { ReactNode } from "react";

export type StatTone = "orange" | "green" | "purple" | "blue";

interface StatTileProps {
    tone: StatTone;
    label: string;
    value: string | number;
    icon?: ReactNode;
    className?: string;
}

export default function StatTile({ tone, label, value, icon, className = "" }: StatTileProps) {
    return (
        <div className={`pm-stat pm-stat--${tone} ${className}`}>
            <span className="pm-stat__label">
                {icon}
                {label}
            </span>
            <strong className="pm-stat__value">{value}</strong>
        </div>
    );
}

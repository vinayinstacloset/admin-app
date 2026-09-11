import type { ReactNode } from "react";

interface DetailSectionProps {
    title: string;
    children: ReactNode;
}

export default function DetailSection({ title, children }: DetailSectionProps) {
    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5 mb-5">
            <h2 className="text-[13px] font-semibold text-ink/50 uppercase tracking-wide mb-4">{title}</h2>
            {children}
        </div>
    );
}

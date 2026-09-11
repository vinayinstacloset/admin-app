import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface PlaceholderScreenProps {
    title: string;
    description?: string;
    icon?: string;
}

export default function PlaceholderScreen({
    title,
    description = "This section is coming soon.",
    icon = "Construction",
}: PlaceholderScreenProps) {
    const IconComponent = (Icons as unknown as Record<string, LucideIcon>)[icon] ?? Icons.Construction;

    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-10 flex flex-col items-center justify-center text-center min-h-[420px]">
            <span className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                <IconComponent size={24} />
            </span>
            <h2 className="text-base font-semibold text-ink mb-1.5">{title}</h2>
            <p className="text-sm text-ink/50 max-w-sm">{description}</p>
        </div>
    );
}

export type OrderStatusValue = "On the way" | "Delivered" | "Pending" | "Ready" | "Cancelled" | string;

interface StatusBadgeProps {
    status: OrderStatusValue;
}

const styles: Record<string, string> = {
    "on the way": "bg-sky-50 text-sky-600",
    delivered: "bg-emerald-50 text-emerald-600",
    pending: "bg-amber-50 text-amber-600",
    ready: "bg-emerald-50 text-emerald-600",
    cancelled: "bg-rose-50 text-rose-600",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const key = status.toLowerCase();

    return (
        <span
            className={`inline-flex px-2.5 py-1 rounded-full text-[11px] ${
                styles[key] ?? "bg-ink/5 text-ink/60"
            }`}
        >
            {status}
        </span>
    );
}

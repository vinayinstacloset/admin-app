import { ChevronLeft, ChevronRight } from "lucide-react";
import type { OrderItem } from "../types/order.types";

interface OrderItemCardProps {
    item: OrderItem;
}

export default function OrderItemCard({ item }: OrderItemCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-4 flex gap-4">
            <div className="relative w-24 h-28 rounded-lg overflow-hidden shrink-0 bg-cream">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                />
                <button
                    type="button"
                    className="absolute left-0.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center shadow"
                >
                    <ChevronLeft size={12} />
                </button>
                <button
                    type="button"
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center shadow"
                >
                    <ChevronRight size={12} />
                </button>
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-ink leading-snug">{item.title}</p>
                <div className="flex flex-wrap gap-1.5 my-1.5">
                    {item.tags.map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full bg-cream text-[10.5px] text-ink/50"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
                <p className="text-[11.5px] text-ink/40 leading-relaxed line-clamp-2">{item.description}</p>
                <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-sm font-bold text-ink">{item.price}</span>
                    <span className="text-[11px] text-ink/30 line-through">{item.mrp}</span>
                    <span className="text-[11px] text-emerald-600">{item.discount}</span>
                </div>
            </div>
        </div>
    );
}

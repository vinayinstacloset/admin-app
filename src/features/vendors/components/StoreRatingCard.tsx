import { Star } from "lucide-react";
import type { StoreRating } from "../types/vendor.types";

interface StoreRatingCardProps {
    rating: StoreRating;
}

export default function StoreRatingCard({ rating }: StoreRatingCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5">
            <h2 className="text-sm font-semibold text-ink mb-3">Store rating</h2>
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-ink">{rating.average}</span>
                <Star
                    size={16}
                    className="fill-amber-500 text-amber-500"
                />
                <span className="text-[11px] text-ink/40">{rating.reviews}</span>
            </div>
            <div className="space-y-2">
                {rating.breakdown.map((row) => (
                    <div
                        key={row.star}
                        className="flex items-center gap-2 text-[11.5px]"
                    >
                        <span className="w-3 text-ink/50">{row.star}</span>
                        <div className="flex-1 h-1.5 rounded-full bg-cream overflow-hidden">
                            <div
                                className="h-full bg-amber-400"
                                style={{ width: `${row.pct}%` }}
                            />
                        </div>
                        <span className="w-8 text-right text-ink/40">{row.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

import { Phone, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { OrderRider } from "../types/order.types";

interface RiderMiniCardProps {
    rider: OrderRider;
    linkTo?: string;
}

export default function RiderMiniCard({ rider, linkTo }: RiderMiniCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-4">
            <h3 className="text-xs font-semibold text-ink/40 uppercase tracking-wide mb-3">Rider details</h3>
            <div className="flex items-center gap-3">
                <img
                    src={rider.avatar}
                    alt={rider.name}
                    className="w-11 h-11 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-semibold text-ink truncate">{rider.name}</p>
                        {linkTo && (
                            <Link
                                to={linkTo}
                                className="text-[11px] text-brand-600 hover:underline shrink-0"
                            >
                                View details
                            </Link>
                        )}
                    </div>
                    <p className="text-[11.5px] text-ink/50 flex items-center gap-1 mt-0.5">
                        <Phone size={11} /> {rider.phone}
                    </p>
                    <p className="text-[11.5px] text-amber-600 flex items-center gap-1 mt-0.5">
                        <Star
                            size={11}
                            className="fill-amber-500 text-amber-500"
                        />{" "}
                        {rider.rating}
                    </p>
                </div>
            </div>
        </div>
    );
}

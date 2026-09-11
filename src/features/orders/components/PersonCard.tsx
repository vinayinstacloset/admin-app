import { Phone } from "lucide-react";
import { Link } from "react-router-dom";
import type { OrderPerson } from "../types/order.types";

interface PersonCardProps {
    title: string;
    person: OrderPerson;
    linkTo?: string;
    linkLabel?: string;
}

export default function PersonCard({ title, person, linkTo, linkLabel }: PersonCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-4">
            <h3 className="text-xs font-semibold text-ink/40 uppercase tracking-wide mb-3">{title}</h3>
            <div className="flex items-center gap-3">
                <img
                    src={person.avatar}
                    alt={person.name}
                    className="w-11 h-11 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-semibold text-ink truncate">
                            {person.name} {person.meta && <span className="text-ink/40 font-normal">({person.meta})</span>}
                        </p>
                        {linkTo && linkLabel && (
                            <Link
                                to={linkTo}
                                className="text-[11px] text-brand-60 hover:underline shrink-0"
                            >
                                {linkLabel}
                            </Link>
                        )}
                    </div>
                    <p className="text-[11.5px] text-ink/50 truncate">{person.email}</p>
                    <p className="text-[11.5px] text-ink/50 flex items-center gap-1 mt-0.5">
                        <Phone size={11} /> {person.phone}
                    </p>
                </div>
            </div>
        </div>
    );
}

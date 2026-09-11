import { ChevronLeft, ChevronRight, Star, Clock, Truck, Wallet, MapPin, Mail, Phone } from "lucide-react";
import type { VendorProfile } from "../types/vendor.types";

interface StoreOverviewCardProps {
    profile: VendorProfile;
}

const chipTone: Record<string, string> = {
    amber: "bg-amber-50 text-amber-700",
    sky: "bg-sky-50 text-sky-700",
    rose: "bg-rose-50 text-rose-700",
    violet: "bg-violet-50 text-violet-700",
};

function Chip({ tone, icon, label }: { tone: keyof typeof chipTone; icon: React.ReactNode; label: string }) {
    return (
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] ${chipTone[tone]}`}>
            {icon} {label}
        </span>
    );
}

export default function StoreOverviewCard({ profile }: StoreOverviewCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card overflow-hidden mb-5">
            <div className="px-5 pt-4 pb-2">
                <h2 className="text-sm font-semibold text-ink">Overview</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-4 p-5 pt-1">
                <div className="relative w-full md:w-56 h-36 rounded-xl overflow-hidden shrink-0">
                    <img
                        src={profile.cover}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                    />
                    <button
                        type="button"
                        className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow"
                    >
                        <ChevronLeft size={13} />
                    </button>
                    <button
                        type="button"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center shadow"
                    >
                        <ChevronRight size={13} />
                    </button>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-ink">{profile.name}</p>
                    <p className="text-xs text-ink/40 mb-2">{profile.tagline}</p>
                    <p className="text-xs text-ink/50 flex items-center gap-1.5 mb-1">
                        <MapPin
                            size={13}
                            className="text-ink/30"
                        />{" "}
                        {profile.address}
                    </p>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink/50 mb-3">
                        <span className="flex items-center gap-1.5">
                            <Mail
                                size={13}
                                className="text-ink/30"
                            />{" "}
                            {profile.email}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Phone
                                size={13}
                                className="text-ink/30"
                            />{" "}
                            {profile.phone}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Chip
                            tone="amber"
                            icon={
                                <Star
                                    size={11}
                                    className="fill-amber-500 text-amber-500"
                                />
                            }
                            label={profile.rating}
                        />
                        <Chip
                            tone="sky"
                            icon={<Clock size={11} />}
                            label={profile.prepTime}
                        />
                        <Chip
                            tone="rose"
                            icon={<Truck size={11} />}
                            label={profile.freeDelivery}
                        />
                        <Chip
                            tone="violet"
                            icon={<Wallet size={11} />}
                            label={profile.minOrder}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

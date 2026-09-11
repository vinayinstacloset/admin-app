import { MapPin, Truck } from "lucide-react";

interface DeliveryMapProps {
    eta: string;
}

export default function DeliveryMap({ eta }: DeliveryMapProps) {
    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5 mb-5">
            <h2 className="text-sm font-semibold text-ink mb-3">Delivery status</h2>
            <div className="relative h-[220px] rounded-xl overflow-hidden bg-emerald-50">
                <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80"
                    alt="Delivery route map"
                    className="w-full h-full object-cover opacity-90"
                />
                <span className="absolute left-[18%] top-[38%] w-10 h-10 rounded-full bg-rose-500 border-4 border-white shadow-soft flex items-center justify-center text-white">
                    <Truck size={16} />
                </span>
                <span className="absolute right-[16%] top-[42%] w-9 h-9 rounded-full bg-emerald-500 border-4 border-white shadow-soft flex items-center justify-center text-white">
                    <MapPin size={15} />
                </span>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-4 bg-white rounded-full shadow-card px-4 py-1.5 flex items-center gap-2 text-xs text-ink/70">
                    <MapPin
                        size={13}
                        className="text-ink/30"
                    />{" "}
                    ETA <span className="text-ink font-semibold">{eta}</span>
                </div>
            </div>
        </div>
    );
}

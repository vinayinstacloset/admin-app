import { MapPin, Truck } from "lucide-react";
import type { OrderLocation } from "../types/order.types";

function bbox(a: OrderLocation, b: OrderLocation) {
  const minLon = Math.min(a.longitude, b.longitude) - 0.025;
  const maxLon = Math.max(a.longitude, b.longitude) + 0.025;
  const minLat = Math.min(a.latitude, b.latitude) - 0.018;
  const maxLat = Math.max(a.latitude, b.latitude) + 0.018;
  return `${minLon},${minLat},${maxLon},${maxLat}`;
}
export default function DeliveryMap({ rider, customer, eta }: { rider: OrderLocation; customer: OrderLocation; eta: string }) {
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox(rider, customer))}&layer=mapnik&marker=${rider.latitude}%2C${rider.longitude}`;
  return <section className="mb-5"><h2 className="mb-3 text-[14px] font-semibold text-ink">Delivery status</h2><div className="relative h-[275px] overflow-hidden rounded-lg bg-white"><iframe title="Order delivery map" src={src} className="absolute inset-0 h-full w-full border-0" loading="lazy"/><div className="pointer-events-none absolute inset-0"><div className="absolute left-[22%] top-[24%] flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-[#f04b3b] text-white shadow-lg"><Truck size={25}/></div><div className="absolute right-[20%] top-[45%] flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-[#6bc94f] text-white shadow-lg"><MapPin size={22}/></div><div className="absolute left-[31%] top-[42%] h-1 w-[42%] rotate-[10deg] rounded bg-[#ef4d3e] shadow-sm"/><div className="absolute left-1/2 bottom-5 -translate-x-1/2 rounded-md bg-white px-6 py-3 shadow-lg text-[11px] text-ink/60"><span className="mr-10">◷ ETA</span><b className="text-ink">{eta}</b></div></div></div></section>;
}

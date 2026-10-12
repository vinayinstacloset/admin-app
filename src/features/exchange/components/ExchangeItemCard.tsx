import {
  ChevronLeft,
  ChevronRight,
  Palette,
  Ruler,
  Shapes,
} from "lucide-react";
import type { ExchangeItem } from "../types/exchange.types";

export default function ExchangeItemCard({ item }: { item: ExchangeItem }) {
  return (
    <div className="rounded-xl bg-white p-4 border border-black/5">
      <div className="flex gap-4">
        <div className="relative h-[250px] w-[250px] shrink-0 overflow-hidden rounded-lg bg-[#ddd]">
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover"
          />
          <button
            type="button"
            className="absolute left-1 top-1/2 -translate-y-1/2 text-ink/55"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            className="absolute right-1 top-1/2 -translate-y-1/2 text-ink/55"
          >
            <ChevronRight size={22} />
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
          </div>
        </div>
        <div className="min-w-0 flex-1 pt-2">
          <h3 className="text-[16px] font-semibold leading-6 text-ink">
            {item.name}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] text-ink/65">
            <span>
              <Shapes size={14} className="mr-1 inline" />
              {item.category}
            </span>
            <span>
              <Ruler size={14} className="mr-1 inline" />
              {item.size}
            </span>
            <span>
              <Palette size={14} className="mr-1 inline text-[#ef6670]" />
              {item.color}
            </span>
          </div>
          <p className="mt-4 text-[10.5px] leading-5 text-ink/65">
            <span className="block text-ink/45">Description:</span>A versatile,
            casual garment named for its T-shaped body and sleeves, typically
            featuring a crew neck and short sleeves without buttons or collars.
          </p>
          <div className="mt-3 flex items-end gap-2">
            <b className="text-[17px]">₹{item.price.toLocaleString("en-IN")}</b>
            <span className="text-[11px] text-ink/35 line-through">
              ₹{item.mrp.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-[#ef665d]">
              ♧ {item.discount}% off
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

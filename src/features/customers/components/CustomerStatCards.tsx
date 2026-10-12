import { Package, Wallet, RotateCcw, Repeat2 } from "lucide-react";
import type { CustomerStat } from "../types/customer.types";

const icons = { Package, Wallet, RotateCcw, Repeat2 };

export default function CustomerStatCards({
  stats,
}: {
  stats: CustomerStat[];
}) {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
      {stats.map((stat) => {
        const Icon = icons[stat.icon as keyof typeof icons] ?? Package;
        const tone =
          stat.tone === "green"
            ? ["bg-green-50", "text-green-500"]
            : stat.tone === "blue"
              ? ["bg-blue-50", "text-blue-500"]
              : stat.tone === "orange"
                ? ["bg-orange-50", "text-orange-500"]
                : ["bg-purple-50", "text-purple-500"];
        return (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-black/5 px-4 py-3.5 flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] text-ink/45 mb-1">{stat.label}</p>
              <p className="text-[18px] font-semibold text-ink">{stat.value}</p>
            </div>
            <div
              className={`w-8 h-8 rounded-lg ${tone[0]} flex items-center justify-center`}
            >
              <Icon size={15} className={tone[1]} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

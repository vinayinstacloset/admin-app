import { CalendarDays, Download } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MoneySpentPoint } from "../types/customer.types";

export default function CustomerMoneySpent({
  data,
  onDates,
}: {
  data: MoneySpentPoint[];
  onDates: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-black/5 px-4 pt-3 pb-4 mb-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-[13px] font-semibold text-ink">
          Money spent - Last 12 days
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="h-7 px-2.5 rounded-md border border-black/10 text-[10.5px] text-ink/55 flex items-center gap-1.5"
            onClick={onDates}
          >
            <CalendarDays size={12} /> Dates
          </button>
          <button
            type="button"
            className="h-7 w-7 rounded-md border border-black/10 text-ink/45 flex items-center justify-center"
            aria-label="Download chart"
          >
            <Download size={12} />
          </button>
        </div>
      </div>
      <div className="h-[225px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 6, left: 0, bottom: 0 }}
            barSize={9}
          >
            <CartesianGrid vertical={false} stroke="#e8e5df" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 9, fill: "#8d877f" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) =>
                value >= 1000 ? `${value / 1000}k` : `${value}`
              }
              tick={{ fontSize: 9, fill: "#8d877f" }}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <Tooltip
              formatter={(value) => [
                `₹${Number(value).toLocaleString("en-IN")}`,
                "Spent",
              ]}
              contentStyle={{
                borderRadius: 8,
                border: "1px solid #eee",
                fontSize: 11,
              }}
            />
            <Bar dataKey="value" fill="#a855f7" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

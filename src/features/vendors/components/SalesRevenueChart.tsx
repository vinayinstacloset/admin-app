import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChevronDown } from "lucide-react";
import type { SalesRevenuePoint } from "../types/vendor.types";

interface SalesRevenueChartProps {
    data: SalesRevenuePoint[];
}

interface TooltipPayloadEntry {
    value: number;
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-white border border-black/5 rounded-lg shadow-card px-3 py-2 text-xs">
            <p className="text-ink/40">{label}</p>
            <p className="font-semibold text-ink">₹{payload[0].value.toLocaleString("en-IN")}</p>
        </div>
    );
}

export default function SalesRevenueChart({ data }: SalesRevenueChartProps) {
    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-ink">Sales revenue</h2>
                <button
                    type="button"
                    className="h-8 px-3 rounded-md border border-black/10 flex items-center gap-1 text-xs text-ink/50"
                >
                    Today <ChevronDown size={12} />
                </button>
            </div>
            <div className="h-[220px]">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <BarChart
                        data={data}
                        barSize={20}
                    >
                        <CartesianGrid
                            vertical={false}
                            stroke="#eceae4"
                        />
                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 10, fill: "#8b8478" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tickFormatter={(value: number) => (value >= 1000 ? `${value / 1000}k` : String(value))}
                            tick={{ fontSize: 10.5, fill: "#8b8478" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            content={<ChartTooltip />}
                            cursor={{ fill: "#f6f4ef" }}
                        />
                        <Bar
                            dataKey="value"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-[11px] text-ink/40 mt-2">
                <span className="text-emerald-600">Peak starts at 04:00 PM</span> · Peak down at 05:00 PM
                · Store open to close
            </p>
        </div>
    );
}

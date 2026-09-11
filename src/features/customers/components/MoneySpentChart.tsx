import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Download } from "lucide-react";
import type { MoneySpentPoint } from "../types/customer.types";

interface MoneySpentChartProps {
    data: MoneySpentPoint[];
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

export default function MoneySpentChart({ data }: MoneySpentChartProps) {
    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5 mb-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-ink">Money spent – Last 12 days</h2>
                <button
                    type="button"
                    className="text-ink/40 hover:text-ink/70"
                >
                    <Download size={14} />
                </button>
            </div>
            <div className="h-[220px]">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <BarChart
                        data={data}
                        barSize={18}
                    >
                        <CartesianGrid
                            vertical={false}
                            stroke="#eceae4"
                        />
                        <XAxis
                            dataKey="day"
                            tick={{ fontSize: 10.5, fill: "#8b8478" }}
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
                            fill="#a855f7"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Download } from "lucide-react";
import type { RevenuePoint, RevenueSummary } from "../types/overview.types";

interface RevenueChartProps {
    data: RevenuePoint[];
    summary: RevenueSummary;
}

interface TooltipPayloadEntry {
    value: number;
}

function ChartTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: TooltipPayloadEntry[];
    label?: string;
}) {
    if (!active || !payload?.length) return null;

    return (
        <div className="bg-white border border-black/5 rounded-lg shadow-card px-3 py-2 text-xs">
            <p className="text-ink/40">{label}</p>
            <p className="font-semibold text-ink">₹{payload[0].value.toLocaleString("en-IN")}</p>
        </div>
    );
}

export default function RevenueChart({ data, summary }: RevenueChartProps) {
    return (
        <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-sm font-semibold text-ink">Revenue – Last 7 days</h2>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-ink/50">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Weekly revenue:{" "}
                        {summary.weeklyRevenue}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-violet-400" /> Avg order value:{" "}
                        {summary.avgOrderValue}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-400" /> Conversion rate:{" "}
                        {summary.conversionRate}
                    </span>
                    <button
                        type="button"
                        className="text-ink/40 hover:text-ink/70"
                    >
                        <Download size={14} />
                    </button>
                </div>
            </div>

            <div className="h-[240px]">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <BarChart
                        data={data}
                        barSize={28}
                    >
                        <CartesianGrid
                            vertical={false}
                            stroke="#eceae4"
                        />
                        <XAxis
                            dataKey="day"
                            tick={{ fontSize: 11, fill: "#8b8478" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tickFormatter={(value: number) =>
                                value >= 100000 ? `${value / 100000}Lac` : `${value / 1000}k`
                            }
                            tick={{ fontSize: 11, fill: "#8b8478" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            content={<ChartTooltip />}
                            cursor={{ fill: "#f6f4ef" }}
                        />
                        <Bar
                            dataKey="value"
                            fill="#22c55e"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

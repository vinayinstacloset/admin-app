import { Download } from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { ChartPoint } from "../types/overview.types";

interface OverviewChartProps {
    title: string;
    data: ChartPoint[];
    summary?: {
        weeklyRevenue: string;
        avgOrderValue: string;
        conversionRate: string;
    };
    variant: "revenue" | "orders";
}

function formatValue(value: number, variant: OverviewChartProps["variant"]) {
    if (variant === "orders") {
        if (value >= 10000) return `${Math.round(value / 1000)}k+`;
        if (value >= 5000) return "5k–10k";
        if (value >= 3000) return "3k–5k";
        if (value >= 1000) return "1k–3k";
        if (value >= 100) return "100–1000";
        return "0–100";
    }

    if (value >= 100000) return `${(value / 100000).toFixed(1).replace(".0", "")} Lac+`;
    if (value >= 50000) return "50k–1 Lac";
    if (value >= 25000) return "25k–50k";
    if (value >= 10000) return "10k–25k";
    return "0–10k";
}

export default function OverviewChart({ title, data, summary, variant }: OverviewChartProps) {
    const isRevenue = variant === "revenue";

    return (
        <section className="min-w-0">
            <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
                <button
                    type="button"
                    aria-label={`Export ${title}`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0878df] text-white shadow-sm hover:bg-[#066bc7]"
                >
                    <Download size={14} />
                </button>
            </div>

            <div className="rounded-xl bg-white p-3.5 shadow-sm">
                {isRevenue && summary && (
                    <div className="mb-2 flex justify-end gap-3 text-[9px] text-ink/55">
                        <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                            Weekly revenue: <strong className="text-ink/70">{summary.weeklyRevenue}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-violet-400" />
                            Avg order value: <strong className="text-ink/70">{summary.avgOrderValue}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="h-2 w-2 rounded-full bg-rose-300" />
                            Conversion rate: <strong className="text-ink/70">{summary.conversionRate}</strong>
                        </span>
                    </div>
                )}

                <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barCategoryGap="35%" margin={{ top: 8, right: 10, left: 2, bottom: 0 }}>
                            <CartesianGrid vertical={false} stroke="#ececec" />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 10, fill: "#8a8a8a" }}
                                axisLine={{ stroke: "#e5e5e5" }}
                                tickLine={false}
                            />
                            <YAxis
                                tickFormatter={(value: number) => formatValue(value, variant)}
                                tick={{ fontSize: 10, fill: "#8a8a8a" }}
                                axisLine={{ stroke: "#e5e5e5" }}
                                tickLine={false}
                                width={54}
                            />
                            <Tooltip
                                cursor={{ fill: "#f7f7f7" }}
                            />
                            <Bar
                                dataKey="value"
                                fill={isRevenue ? "#2fc66d" : "#a33bf1"}
                                radius={[5, 5, 0, 0]}
                                maxBarSize={12}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-[-2px] flex justify-end text-[9px] text-ink/45">
                    {isRevenue ?
                    <span className="flex items-center gap-1">
                        <span className="text-[11px]">▣</span> Dates
                    </span>
                    :
                    <span className="flex items-center gap-1">
                        <span className="text-[11px]">▣</span> Weeks
                    </span>
                    }
                </div>
            </div>
        </section>
    );
}

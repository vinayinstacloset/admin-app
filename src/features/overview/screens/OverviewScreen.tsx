import { useEffect } from "react";
import { Download } from "lucide-react";

import StatCard from "../../../shared/components/common/StatCard";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useOverview } from "../hooks/useOverview";
import RevenueChart from "../components/RevenueChart";
import AlertsPanel from "../components/AlertsPanel";
import RecentOrdersTable from "../components/RecentOrdersTable";
import TopVendorsPanel from "../components/TopVendorsPanel";
import OverviewLoading from "../components/OverviewLoading";

const INDIAN_STATES = [
    "All State",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Maharashtra",
];

export default function OverviewScreen() {
    const { overview, isLoading, error } = useOverview();
    const { setPageAction } = useDashboardOutletContext();

    useEffect(() => {
        setPageAction(
            <button
                type="button"
                className="flex items-center gap-2 h-9 px-4 rounded-lg bg-brand-700 text-white text-xs font-semibold hover:bg-brand-800"
            >
                <Download size={14} /> Export
            </button>,
        );

        return () => setPageAction(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading || !overview) {
        return <OverviewLoading />;
    }

    if (error) {
        return <p className="text-sm text-red-500">{error}</p>;
    }

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {overview.stats.map((stat) => {
                    const { key, ...statProps } = stat;
                    return (
                        <StatCard
                            key={key}
                            {...statProps}
                        />
                    );
                })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
                <RevenueChart
                    data={overview.revenueChart}
                    summary={overview.revenueSummary}
                />
                <AlertsPanel alerts={overview.alerts} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
                <RecentOrdersTable orders={overview.recentOrders} />
                <TopVendorsPanel
                    vendors={overview.topVendors}
                    states={INDIAN_STATES}
                />
            </div>
        </div>
    );
}

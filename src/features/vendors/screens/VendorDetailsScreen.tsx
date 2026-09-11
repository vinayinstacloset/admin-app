import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useVendorDetails } from "../hooks/useVendorDetails";
import StatCard from "../../../shared/components/common/StatCard";
import StoreOverviewCard from "../components/StoreOverviewCard";
import SalesRevenueChart from "../components/SalesRevenueChart";
import TopProductsTable from "../components/TopProductsTable";
import StoreRatingCard from "../components/StoreRatingCard";
import OverviewLoading from "../../overview/components/OverviewLoading";

export default function VendorDetailsScreen() {
    const { vendorId = "1" } = useParams<{ vendorId: string }>();
    const { vendor, isLoading, error } = useVendorDetails(vendorId);
    const { setExtraCrumbs } = useDashboardOutletContext();

    useEffect(() => {
        setExtraCrumbs([
            { label: "#OD-5490", to: "/admin-dashboard/orders/OD-5490" },
            { label: "Vendor details" },
        ]);

        return () => setExtraCrumbs([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading || !vendor) {
        return <OverviewLoading />;
    }

    if (error) {
        return <p className="text-sm text-red-500">{error}</p>;
    }

    return (
        <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                {vendor.stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        {...stat}
                    />
                ))}
            </div>

            <StoreOverviewCard profile={vendor.profile} />
            <SalesRevenueChart data={vendor.salesRevenue} />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
                <TopProductsTable products={vendor.topProducts} />
                <StoreRatingCard rating={vendor.storeRating} />
            </div>
        </div>
    );
}

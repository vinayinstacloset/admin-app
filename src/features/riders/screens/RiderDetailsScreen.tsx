import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useRiderDetails } from "../hooks/useRiderDetails";
import StatCard from "../../../shared/components/common/StatCard";
import DetailSection from "../components/DetailSection";
import DocumentGrid from "../components/DocumentGrid";
import OverviewLoading from "../../overview/components/OverviewLoading";

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10.5px] text-ink/40 uppercase tracking-wide">{label}</p>
            <p className="text-[12.5px] text-ink">{value}</p>
        </div>
    );
}

export default function RiderDetailsScreen() {
    const { riderId = "1" } = useParams<{ riderId: string }>();
    const { rider, isLoading, error } = useRiderDetails(riderId);
    const { setPageAction, setExtraCrumbs } = useDashboardOutletContext();

    useEffect(() => {
        if (!rider) return;

        setExtraCrumbs([
            { label: "#OD-5490", to: "/admin-dashboard/orders/OD-5490" },
            { label: `${rider.personal.name} details` },
        ]);

        setPageAction(
            <button
                type="button"
                className="h-9 px-3 rounded-lg border border-black/10 flex items-center gap-1 text-xs text-ink/60"
            >
                Last 7 days <ChevronDown size={13} />
            </button>,
        );

        return () => {
            setPageAction(null);
            setExtraCrumbs([]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rider]);

    if (isLoading || !rider) {
        return <OverviewLoading />;
    }

    if (error) {
        return <p className="text-sm text-red-500">{error}</p>;
    }

    return (
        <div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
                {rider.stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        {...stat}
                    />
                ))}
            </div>

            <DetailSection title="Personal details">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3">
                        <img
                            src={rider.personal.avatar}
                            alt={rider.personal.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-[10.5px] text-ink/40 uppercase tracking-wide">Full Name</p>
                            <p className="text-[13px] font-semibold text-ink">{rider.personal.name}</p>
                        </div>
                    </div>
                    <Field
                        label="Email"
                        value={rider.personal.email}
                    />
                    <Field
                        label="Mobile No"
                        value={rider.personal.phone}
                    />
                    <Field
                        label="Age/Gender"
                        value={rider.personal.ageGender}
                    />
                    <Field
                        label="City/State"
                        value={rider.personal.city}
                    />
                </div>
            </DetailSection>

            <DetailSection title="Vehicle details">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="w-16 h-16 rounded-xl bg-emerald-50 flex items-center justify-center text-[28px]">
                        🛵
                    </div>
                    <Field
                        label="Vehicle Name"
                        value={rider.vehicle.name}
                    />
                    <Field
                        label="Color"
                        value={rider.vehicle.color}
                    />
                    <Field
                        label="Purchased On"
                        value={rider.vehicle.purchasedOn}
                    />
                    <Field
                        label="Vehicle Number"
                        value={rider.vehicle.number}
                    />
                    <Field
                        label="Model Year"
                        value={rider.vehicle.year}
                    />
                </div>
            </DetailSection>

            <DocumentGrid documents={rider.documents} />
        </div>
    );
}

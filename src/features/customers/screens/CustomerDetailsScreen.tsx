import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useCustomerDetails } from "../hooks/useCustomerDetails";
import StatCard from "../../../shared/components/common/StatCard";
import MoneySpentChart from "../components/MoneySpentChart";
import CustomerOrdersTable from "../components/CustomerOrdersTable";
import OverviewLoading from "../../overview/components/OverviewLoading";

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10.5px] text-ink/40 uppercase tracking-wide">{label}</p>
            <p className="text-[12.5px] text-ink">{value}</p>
        </div>
    );
}

export default function CustomerDetailsScreen() {
    const { customerId = "1" } = useParams<{ customerId: string }>();
    const { customer, isLoading, error } = useCustomerDetails(customerId);
    const { setExtraCrumbs } = useDashboardOutletContext();

    useEffect(() => {
        setExtraCrumbs([
            { label: "#OD-5490", to: "/admin-dashboard/orders/OD-5490" },
            { label: "Customer details" },
        ]);

        return () => setExtraCrumbs([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading || !customer) {
        return <OverviewLoading />;
    }

    if (error) {
        return <p className="text-sm text-red-500">{error}</p>;
    }

    return (
        <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                {customer.stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        {...stat}
                    />
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-black/5 shadow-card p-5 mb-5">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-3">
                        <img
                            src={customer.profile.avatar}
                            alt={customer.profile.name}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                            <p className="text-[10.5px] text-ink/40 uppercase tracking-wide">Full Name</p>
                            <p className="text-[13px] font-semibold text-ink">{customer.profile.name}</p>
                        </div>
                    </div>
                    <Field
                        label="Email"
                        value={customer.profile.email}
                    />
                    <Field
                        label="Mobile No"
                        value={customer.profile.phone}
                    />
                    <Field
                        label="Age/Gender"
                        value={customer.profile.ageGender}
                    />
                    <Field
                        label="City/State"
                        value={customer.profile.city}
                    />
                    <Field
                        label="Member since"
                        value={customer.profile.since}
                    />
                </div>
            </div>

            <MoneySpentChart data={customer.moneySpent} />
            <CustomerOrdersTable orders={customer.orders} />
        </div>
    );
}

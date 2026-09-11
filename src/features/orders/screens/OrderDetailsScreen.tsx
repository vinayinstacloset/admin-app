import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import { useOrderDetails } from "../hooks/useOrderDetails";
import { useReassignRider } from "../hooks/useReassignRider";
import DeliveryMap from "../components/DeliveryMap";
import OrderItemCard from "../components/OrderItemCard";
import PersonCard from "../components/PersonCard";
import RiderMiniCard from "../components/RiderMiniCard";
import PriceDetailsCard from "../components/PriceDetailsCard";
import ReassignRiderModal from "../components/ReassignRiderModal";
import OverviewLoading from "../../overview/components/OverviewLoading";

export default function OrderDetailsScreen() {
    const { orderId = "OD-5490" } = useParams<{ orderId: string }>();
    const { order, isLoading, error } = useOrderDetails(orderId);
    const { setPageAction, setExtraCrumbs } = useDashboardOutletContext();
    const [reassignOpen, setReassignOpen] = useState(false);

    const { selectedRiderId, setSelectedRiderId, isSubmitting, error: reassignError, reassign } = useReassignRider(
        orderId,
    );

    useEffect(() => {
        if (!order) return;

        setExtraCrumbs([{ label: order.id, badge: order.status }]);

        setPageAction(
            <button
                type="button"
                onClick={() => setReassignOpen(true)}
                className="h-9 px-4 rounded-lg bg-brand-700 text-white text-xs font-semibold hover:bg-brand-800"
            >
                Reassign rider
            </button>,
        );

        return () => {
            setPageAction(null);
            setExtraCrumbs([]);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [order]);

    if (isLoading || !order) {
        return <OverviewLoading />;
    }

    if (error) {
        return <p className="text-sm text-red-500">{error}</p>;
    }

    return (
        <div>
            <DeliveryMap eta={order.eta} />

            <div className="mb-2 flex items-center gap-2">
                <h2 className="text-sm font-semibold text-ink">Items</h2>
                <span className="text-xs text-ink/40">· {order.items.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                {order.items.map((item) => (
                    <OrderItemCard
                        key={item.id}
                        item={item}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
                <PersonCard
                    title="Customer"
                    person={order.customer}
                    linkTo="/admin-dashboard/customers/1"
                    linkLabel="View details"
                />
                <PersonCard
                    title="Vendor"
                    person={order.vendor}
                    linkTo="/admin-dashboard/vendor/1"
                    linkLabel="View details"
                />
                <RiderMiniCard
                    rider={order.rider}
                    linkTo="/admin-dashboard/riders/1"
                />
            </div>

            <PriceDetailsCard price={order.priceDetails} />

            <ReassignRiderModal
                open={reassignOpen}
                orderId={order.id}
                currentRider={order.rider}
                availableRiders={order.availableRiders}
                selectedRiderId={selectedRiderId}
                isSubmitting={isSubmitting}
                error={reassignError}
                onSelectRider={setSelectedRiderId}
                onClose={() => setReassignOpen(false)}
                onConfirm={() => reassign(() => setReassignOpen(false))}
            />
        </div>
    );
}

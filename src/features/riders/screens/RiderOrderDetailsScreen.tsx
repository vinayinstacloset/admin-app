import "../styles/riders.css";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRiderDeliveries } from "../hooks/useRiders";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import DeliveryDetail from "../components/DeliveryDetail";
import OverviewLoading from "../../overview/components/OverviewLoading";

export default function RiderOrderDetailsScreen() {
  const { riderId, orderId } = useParams();
  const navigate = useNavigate();

  const { items, isLoading } = useRiderDeliveries();

  const delivery = items.find((item) => item.id === orderId) ?? items[0];

  const { setExtraCrumbs, setPageAction } = useDashboardOutletContext();

  useEffect(() => {
    if (!delivery) return;

    const isLive = delivery.status === "On the way";

    setExtraCrumbs([
      {
        label: "Riders",
        to: "/admin-dashboard/riders",
      },
      {
        label: "Nitish Kumar details",
        to: `/admin-dashboard/riders/${riderId}`,
      },
      {
        label: (
          <div className="flex items-center gap-2">
            <span>#{delivery.id}</span>

            <div className="delivery-detail-status">
              <span className={isLive ? "on-way" : "delivered"}>
                {delivery.status}
              </span>
            </div>
          </div>
        ),
      },
    ]);

    setPageAction(null);

    return () => {
      setExtraCrumbs([]);
      setPageAction(null);
    };
  }, [delivery, riderId, setExtraCrumbs, setPageAction]);

  if (isLoading || !delivery) {
    return <OverviewLoading />;
  }

  return (
    <DeliveryDetail
      delivery={delivery}
      onBack={() => navigate(`/admin-dashboard/riders/${riderId}`)}
    />
  );
}

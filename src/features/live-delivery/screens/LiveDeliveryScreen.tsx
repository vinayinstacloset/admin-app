import { useEffect, useMemo, useState } from "react";
import { useDashboardOutletContext } from "../../../layouts/useDashboardOutletContext";
import MapView from "../components/MapView";
import Dropdown from "../components/Dropdown";
import ActiveDeliveriesTable from "../components/ActiveDeliveriesTable";
import RiderStatusPanel from "../components/RiderStatusPanel";
import TrackDeliveryModal from "../components/TrackDeliveryModal";
import AssignRiderModal from "../components/AssignRiderModal";
import { cities, mockAssignableOrders } from "../data/mockData";
import type {
  AssignableOrder,
  DeliveryItem,
} from "../types/livedelivery.types";
import { useLiveDelivery } from "../hooks/useLiveDelivery";

export default function LiveDeliveryScreen() {
  const { setPageAction, setExtraCrumbs } = useDashboardOutletContext();
  const [city, setCity] = useState("Hyderabad");
  const [cityOpen, setCityOpen] = useState(false);
  const [orderSearch, setOrderSearch] = useState("");
  const {
    deliveries,
    riders,
    selectedDelivery,
    assignmentMode,
    assignmentOrderId,
    selectedRiderId,
    setSelectedRiderId,
    selectAssignmentOrder,
    openTrack,
    closeTrack,
    openAssign,
    openReassign,
    closeAssignment,
    assign,
  } = useLiveDelivery();

  useEffect(() => {
    setExtraCrumbs([{ label: "Live Delivery" }]);
    setPageAction(
      <button
        type="button"
        onClick={openAssign}
        style={{
          height: 32,
          padding: "0 17px",
          border: 0,
          borderRadius: 6,
          background: "#765038",
          color: "#fff",
          fontSize: 11,
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Assign rider
      </button>,
    );

    return () => {
      setPageAction(null);
      setExtraCrumbs([]);
    };
  }, [openAssign, setExtraCrumbs, setPageAction]);

  const filteredOrders = useMemo(() => {
    const query = orderSearch.trim().toLowerCase();
    if (!query) return [];
    return mockAssignableOrders.filter((order) =>
      `${order.id} ${order.customer}`.toLowerCase().includes(query),
    );
  }, [orderSearch]);

  const selectedOrder = useMemo(
    () =>
      mockAssignableOrders.find((order) => order.id === assignmentOrderId) ??
      null,
    [assignmentOrderId],
  );

  const handleAssignClose = () => {
    setOrderSearch("");
    closeAssignment();
  };

  const handleOrderSelect = (order: AssignableOrder) => {
    setOrderSearch(order.id);
    selectAssignmentOrder(order.id);
    setSelectedRiderId(null);
  };

  return (
    <div style={{ color: "#26201b", paddingBottom: 24 }}>
      <div style={{ position: "relative", marginBottom: 21 }}>
        <MapView city={city} riders={riders} />
        <div style={{ position: "absolute", top: 12, right: 50, zIndex: 10 }}>
          <Dropdown
            value={city}
            options={cities}
            open={cityOpen}
            onToggle={() => setCityOpen((value) => !value)}
            onSelect={(value) => {
              setCity(value);
              setCityOpen(false);
            }}
            width={96}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 375px",
          gap: 16,
        }}
      >
        <section>
          <h2 style={{ margin: "0 0 14px", fontSize: 15 }}>
            Active deliveries
          </h2>
          <ActiveDeliveriesTable
            deliveries={deliveries}
            onTrack={openTrack}
            onReassign={openReassign}
          />
        </section>
        <RiderStatusPanel riders={riders} />
      </div>

      {selectedDelivery && (
        <TrackDeliveryModal delivery={selectedDelivery} onClose={closeTrack} />
      )}

      {assignmentMode && (
        <AssignRiderModal
          mode={assignmentMode}
          delivery={selectedDelivery}
          orderId={
            assignmentOrderId || (orderSearch && selectedOrder?.id) || ""
          }
          orderOptions={filteredOrders}
          searchQuery={orderSearch}
          riders={riders}
          selectedRiderId={selectedRiderId}
          onSearch={(value) => {
            setOrderSearch(value);
            selectAssignmentOrder("");
            setSelectedRiderId(null);
          }}
          onOrderSelect={handleOrderSelect}
          onSelect={setSelectedRiderId}
          onClose={handleAssignClose}
          onAssign={assign}
        />
      )}
    </div>
  );
}

import { useCallback, useMemo, useState } from "react";
import { mockDeliveries, mockRiders } from "../data/mockData";
import type { DeliveryItem } from "../types/livedelivery.types";

export type AssignmentMode = "assign" | "reassign";

export function useLiveDelivery() {
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>(mockDeliveries);
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(
    null,
  );
  const [assignmentMode, setAssignmentMode] = useState<AssignmentMode | null>(
    null,
  );
  const [assignmentOrderId, setAssignmentOrderId] = useState("");
  const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);

  const riders = useMemo(() => mockRiders, []);
  const online = riders.filter(
    (rider) => rider.availability === "Online",
  ).length;
  const offline = riders.length - online;

  const selectAssignmentOrder = useCallback((orderId: string) => {
    setAssignmentOrderId(orderId);
  }, []);

  const openTrack = useCallback((delivery: DeliveryItem) => {
    setAssignmentMode(null);
    setSelectedRiderId(null);
    setSelectedDelivery(delivery);
  }, []);

  const closeTrack = useCallback(() => {
    setSelectedDelivery(null);
  }, []);

  const openAssign = useCallback(() => {
    setSelectedDelivery(null);
    setAssignmentMode("assign");
    setAssignmentOrderId("");
    setSelectedRiderId(null);
  }, []);

  const openReassign = useCallback((delivery: DeliveryItem) => {
    setSelectedDelivery(null);
    setAssignmentMode("reassign");
    setAssignmentOrderId(delivery.id);
    setSelectedRiderId(delivery.riderId);
  }, []);

  const closeAssignment = useCallback(() => {
    setAssignmentMode(null);
    setAssignmentOrderId("");
    setSelectedRiderId(null);
  }, []);

  const assign = useCallback(() => {
    if (!assignmentOrderId || !selectedRiderId) return;

    const rider = riders.find((item) => item.id === selectedRiderId);
    if (!rider) return;

    setDeliveries((items) => {
      const existing = items.some((item) => item.id === assignmentOrderId);

      if (existing) {
        return items.map((item) =>
          item.id === assignmentOrderId
            ? {
                ...item,
                rider: rider.name,
                riderId: rider.id,
                status: "On the way",
                eta: "8 min",
                riderLat: rider.lat,
                riderLng: rider.lng,
              }
            : item,
        );
      }

      return [
        {
          id: assignmentOrderId,
          rider: rider.name,
          customer: "Meena Prakhar",
          amount: "₹2,599",
          eta: "8 min",
          status: "On the way",
          riderId: rider.id,
          from: "Shimla park, near mm valley, rashid compound, Kausa, Mumbai - 400612",
          to: "Shimla park, near mm valley, rashid compound, Kausa, Mumbai - 400612",
          riderLat: rider.lat,
          riderLng: rider.lng,
          customerLat: 17.455,
          customerLng: 78.418,
        },
        ...items,
      ];
    });

    closeAssignment();
  }, [assignmentOrderId, closeAssignment, riders, selectedRiderId]);

  return {
    deliveries,
    riders,
    online,
    offline,
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
  };
}
